package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Address;
import com.pinyougou.service.AddressService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 地址控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-20<p>
 */
@RestController
@RequestMapping("/address")
public class AddressController {

    @Reference(timeout = 10000)
    private AddressService addressService;

    /** 获取登录用户的收件地址 */
    @GetMapping("/findAddressByUser")
    public List<Address> findAddressByUser(HttpServletRequest request){
        // 获取登录用户名
        String userId = request.getRemoteUser();
        // 查询收件地址
        return addressService.findAddressByUser(userId);
    }

    @PostMapping("/save")
    public boolean save(@RequestBody Address address,HttpServletRequest request){
        try {
            String userId = request.getRemoteUser();
            address.setUserId(userId);
            addressService.save(address);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/update")
    public boolean update(@RequestBody Address address) {
        try {
            addressService.update(address);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
    @GetMapping("/delete")// ids=1,2,3
    public boolean delte(Long id){
        try{
            addressService.delete(id);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }
    @PostMapping("/setDefault")
    public boolean setDefault(@RequestBody Long id) {
        try {
            addressService.setDefault(id);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }
}
