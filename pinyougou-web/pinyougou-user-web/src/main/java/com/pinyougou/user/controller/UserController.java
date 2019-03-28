package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.User;
import com.pinyougou.service.UserService;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    public  boolean selectCode(String code,HttpServletRequest request){
        String oldCode = (String) request.getSession().getAttribute(VerifyController.VERIFY_CODE);
      if (oldCode.equalsIgnoreCase(code)){
          return  true;
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
    //判断短信验证码
    @PostMapping("/next")
    public boolean next(@RequestBody User user,String smsCode){
        try {

          boolean ok=  userService.checkSmsCode(user.getPhone(),smsCode);
            if (ok){
               return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    //更新手机号码
    @PostMapping("/nextNew")
    public boolean nextNew(@RequestBody User user ,String smsCode,HttpServletRequest request){
        try {
            String username = request.getRemoteUser();
            boolean ok = userService.checkSmsCode(user.getPhone(), smsCode);
            userService.updatePhoneNum(username,user.getPhone());
            return ok;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    //查询用户信息
    @GetMapping("/finduserInfo")
    public User findUserInfo(HttpServletRequest request) {
        try {
            String username = request.getRemoteUser();
            User user=new User();
            user.setUsername(username);
            return userService.findUserInfo(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    //更新用户信息
    @PostMapping("/update")
    public boolean update(@RequestBody User user) {
        try {
            userService.update(user);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

}
