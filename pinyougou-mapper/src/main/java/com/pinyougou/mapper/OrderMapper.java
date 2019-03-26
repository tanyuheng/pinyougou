package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Select;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.Order;

import java.util.List;

/**
 * OrderMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface OrderMapper extends Mapper<Order>{
    @Select("select * FROM tb_order WHERE user_id = #{loginName}")
    List<Order> selectOrder(String loginName);
}