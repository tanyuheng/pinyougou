package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.pinyougou.cart.Cart;
import com.pinyougou.common.util.CookieUtils;
import com.pinyougou.pojo.OrderItem;
import com.pinyougou.service.CartService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

/**
 * 购物车控制器
 */
@RestController
@RequestMapping("/cart")
public class CartController {

    @Reference(timeout = 10000)
    private CartService cartService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private HttpServletResponse response;

    /**
     * 添加购物车
     * @param itemId
     * @param num
     * @return
     */
    @GetMapping("/addCart")
    public boolean addCart(Long itemId, Integer num) {
        try {
            // 设置允许跨域访问的域名
            response.setHeader("Access-Control-Allow-Origin", "http://item.pinyougou.com");
            // 设置允许跨域访问Cookie
            response.setHeader("Access-Control-Allow-Credentials", "true");

            // 获取登录用户名
            String userId = request.getRemoteUser();
            // 获取购物车集合
            List<Cart> carts = findCart("cart_");
            // 将商品添加到购物车
            carts = cartService.addItemToCart(carts, itemId, num);
            // 判断用户是否登录
            if (StringUtils.isNoneBlank(userId)) { // 已登录
                cartService.saveCartRedis(userId, carts);
            } else { // 未登录
                // 将购物车集合添加到cookie
                CookieUtils.setCookie(request, response,
                        CookieUtils.CookieName.PINYOUGOU_CART,
                        JSON.toJSONString(carts), 3600*24, true);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * 获取购物车
     * @return
     */
    @GetMapping("/findCart")
    public List<Cart> findCart(String prefix) {
        // 获取登录用户名
        String userId = request.getRemoteUser();
        // 购物车集合
        List<Cart> carts = null;

        // 判断用户是否登录
        if (StringUtils.isNoneBlank(userId)) { // 已登录
            carts = cartService.findCartRedis(userId, prefix);
            // 从cookie中获得购物车集合
            String cartStr = CookieUtils.getCookieValue(request, CookieUtils.CookieName.PINYOUGOU_CART, true);
            if (StringUtils.isNoneBlank(cartStr)) { // 不为空
                List<Cart> cookieCarts = JSON.parseArray(cartStr, Cart.class);
                if (cookieCarts.size() > 0) {
                    carts = cartService.mergeCart(cookieCarts, carts);
                    // 把合并后的购物车数据存储到Redis
                    cartService.saveCartRedis(userId, carts);
                    // 删除cookie中的购物车
                    CookieUtils.deleteCookie(request, response, CookieUtils.CookieName.PINYOUGOU_CART);
                }
            }

        } else { // 未登录
            // 从cookie中获得购物车集合
            String cartStr = CookieUtils.getCookieValue(request, CookieUtils.CookieName.PINYOUGOU_CART, true);
            // 判断是否为空
            if (StringUtils.isBlank(cartStr)) {
                cartStr = "[]";
            }
            // 将字符串转换为集合
            carts = JSON.parseArray(cartStr, Cart.class);
        }

        return carts;
    }

    /**
     * 生成选中订单
     * @param itemIds
     * @return
     */
    @GetMapping("/generateOrderItemList")
    public boolean generateOrderItemList(Long[] itemIds) {
        try {
            // 获取登录用户名
            String userId = request.getRemoteUser();
            // 获取购物车集合
            List<Cart> carts = findCart("cart_");
            List<Long> list = Arrays.asList(itemIds);
            for (int i = 0; i < carts.size(); i++) {
                List<OrderItem> orderItems = carts.get(i).getOrderItems();
                for (int j = orderItems.size() - 1; j >= 0; j--) {
                    OrderItem orderItem = orderItems.get(j);
                    if (!list.contains(orderItem.getItemId())) {
                        orderItems.remove(orderItem);
                    }
                }
            }
            cartService.saveCartRedis("selected_" + userId, carts);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


}
