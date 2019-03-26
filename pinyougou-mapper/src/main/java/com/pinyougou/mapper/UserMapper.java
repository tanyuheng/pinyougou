package com.pinyougou.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import tk.mybatis.mapper.common.Mapper;

import com.pinyougou.pojo.User;

/**
 * UserMapper 数据访问接口
 * @date 2019-02-27 09:55:07
 * @version 1.0
 */
public interface UserMapper extends Mapper<User>{

    @Update("UPDATE tb_user set password=#{password} where username=#{username}")
    void updatePassword( @Param("username") String username, @Param("password") String password);
    @Select("SELECT * FROM tb_user WHERE username = #{username}")
    User selectPhone(String username);
}