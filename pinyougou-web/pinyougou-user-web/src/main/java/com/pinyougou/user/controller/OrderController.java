package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Order;
import com.pinyougou.pojo.OrderItem;
import com.pinyougou.pojo.User;
import com.pinyougou.service.OrderItemService;
import com.pinyougou.service.OrderService;
import com.pinyougou.service.UserService;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Reference
    private OrderService orderService ;
    @Reference
    private UserService userService ;
    @Reference
    private OrderItemService orderItemService ;
    @GetMapping("/findOrder")
    public Map<String ,Object> findOrder (){
        SecurityContext context = SecurityContextHolder.getContext();
        String loginName = context.getAuthentication().getName();
        List<Order> orders = orderService.findOrderByUserId(loginName);

        List<OrderItem> orderItems =null;
        for (Order order : orders) {
            Long orderId = order.getOrderId();
            orderItems = orderItemService.findAll(orderId);
        }
        Map<String,Object> data = new HashMap<>();
        data.put("orderItems",orderItems);
        data.put("orders", orders);
        return data;
    }
}
