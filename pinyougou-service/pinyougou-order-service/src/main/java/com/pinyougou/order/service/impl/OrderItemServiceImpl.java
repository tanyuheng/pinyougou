package com.pinyougou.order.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.OrderItemMapper;
import com.pinyougou.pojo.OrderItem;
import com.pinyougou.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

@Service(interfaceName = "com.pinyougou.service.OrderItemService")
@Transactional
public class OrderItemServiceImpl implements OrderItemService {
    @Autowired
    private OrderItemMapper orderItemMapper;
    /**
     * 查询订单明细
     * @param orderId
     */
    @Override
    public List<OrderItem> findAll(Long orderId) {
        try{
            return orderItemMapper.selectOrderItem(orderId);
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }
    /**
     * 添加方法
     *
     * @param orderItem
     */
    @Override
    public void save(OrderItem orderItem) {

    }

    /**
     * 修改方法
     *
     * @param orderItem
     */
    @Override
    public void update(OrderItem orderItem) {

    }

    /**
     * 根据主键id删除
     *
     * @param id
     */
    @Override
    public void delete(Serializable id) {

    }

    /**
     * 批量删除
     *
     * @param ids
     */
    @Override
    public void deleteAll(Serializable[] ids) {

    }

    /**
     * 根据主键id查询
     *
     * @param id
     */
    @Override
    public OrderItem findOne(Serializable id) {
        return null;
    }



    /**
     * 多条件分页查询
     *
     * @param orderItem
     * @param page
     * @param rows
     */
    @Override
    public List<OrderItem> findByPage(OrderItem orderItem, int page, int rows) {
        return null;
    }
}
