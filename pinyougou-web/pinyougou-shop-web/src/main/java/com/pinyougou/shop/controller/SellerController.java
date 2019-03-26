package com.pinyougou.shop.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Seller;
import com.pinyougou.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * 商家控制器
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-03<p>
 */
@RestController
@RequestMapping("/seller")
public class SellerController {

    // @Autowired spring容器中的bean
    @Reference(timeout = 10000)
    private SellerService sellerService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /** 商家入驻 */
    @PostMapping("/save")
    public boolean save(@RequestBody Seller seller){
        try{
            // 密码加密
            String password = passwordEncoder.encode(seller.getPassword());
            seller.setPassword(password);
            sellerService.save(seller);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    @GetMapping("/findSeller")
    public Seller findSeller(HttpServletRequest request){
        try {
            String sellerId = request.getRemoteUser();
            Seller seller = sellerService.findOne(sellerId);
            return seller;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return null;
    }


    /** 修改商家资料 */
    @PostMapping("/update")
    public boolean update(@RequestBody Seller seller,HttpServletRequest request){
        try{
            String sellerId = request.getRemoteUser();
            sellerService.update(seller,sellerId);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

    /** 修改商家资料 */
    @PostMapping("/updatePassword")
    public boolean updatePassword(@RequestBody Seller seller, HttpServletRequest request){
        try{
            String sellerId = request.getRemoteUser();
            sellerService.updatePassword(passwordEncoder.encode(seller.getPassword()),sellerId);
            return true;
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return false;
    }

}
