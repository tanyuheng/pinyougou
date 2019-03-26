package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.User;
import com.pinyougou.service.UserService;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 用户控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-16<p>
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Reference(timeout = 10000)
    private UserService userService;
    //查询手机号
    @GetMapping("/phone")
    public User phone( HttpServletRequest request){
        String username = request.getRemoteUser();
       return userService.selectPhone(username);
    }
    //查询判断验证码
    @GetMapping("/code")
    public boolean selectCode(String code,HttpServletRequest request){
        String oldCode = (String) request.getSession().getAttribute(VerifyController.VERIFY_CODE);
       if (code != null && code.equalsIgnoreCase(oldCode)){
           return true;
       }
       return false;
        }
    //发送短信
    @GetMapping("/sms")
    public boolean sms ( String phone){
        try {
              return userService.sendSmsCode(phone);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    //修改密码
    @PostMapping("/safe")
    public boolean safe(@RequestBody User user){

        return userService.safe(user);

    }
    /** 用户注册 */
    @PostMapping("/save")
    public boolean save(@RequestBody User user, String code){
        try{
            // 检验短信验证码
            boolean flag = userService.checkSmsCode(user.getPhone(), code);
            if (flag) {
                userService.save(user);
            }
            return flag;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    /** 发送短信验证码 */
    @GetMapping("/sendSmsCode")
    public boolean sendSmsCode(String phone){
        try{
            return userService.sendSmsCode(phone);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }
}
