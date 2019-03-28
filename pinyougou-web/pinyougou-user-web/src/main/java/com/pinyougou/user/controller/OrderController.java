package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.service.OrderService;
import com.pinyougou.service.WeixinPayService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Reference(timeout = 10000)
    private OrderService orderService;
    @Reference(timeout = 10000)
    private WeixinPayService weixinPayService;

    @GetMapping("/findOrder")
    public Map<String, Object> findAllOrderByUserId(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "2") Integer size) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> data = orderService.findAllOrder(userId, pageNum, size);
        return data;
    }

    /*生成单个订单的支付日志并保存在Redis,并返回支付流水单号*/
    @GetMapping("/pay")
    public boolean pay(Long orderId){
        try {
            orderService.pay(orderId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /*用户关闭订单*/
    @RequestMapping("/closeOrder")
    public Boolean closeOrder(Long orderId){
        try {
            orderService.closeOrderByOrderId(orderId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



}