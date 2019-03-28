package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Areas;
import com.pinyougou.pojo.Cities;
import com.pinyougou.pojo.Provinces;
import com.pinyougou.service.AreasService;
import com.pinyougou.service.CitiesService;
import com.pinyougou.service.ProvincesService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

/**
 * ProvincesController 控制器类
 *
 * @version 1.0
 * @date 2019-03-26 19:35:59
 */
@RestController
@RequestMapping("/provinces")
public class ProvincesController {
    @Reference(timeout = 10000)
    private ProvincesService provincesService;

    @Reference(timeout = 10000)
    private CitiesService citiesService;
    @Reference(timeout = 10000)
    private AreasService areasService;
    /** 查询全部方法 */
    @GetMapping("/findAll")
    public List<Provinces> findAll() {
        return provincesService.findAll();
    }

    /**
     * 多条件分页查询方法
     */
    @GetMapping("/findByPage")
    public List<Provinces> findByPage(Provinces provinces,
                                      Integer page, Integer rows) {
        try {
            return provincesService.findByPage(provinces, page, rows);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    /**
     * 根据主键id查询方法
     */
    @GetMapping("/findOne")
    public Provinces findOne(Long id) {
        try {
            return provincesService.findOne(id);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    /**
     * 添加方法
     */
    @PostMapping("/save")
    public boolean save(@RequestBody Provinces provinces) {
        try {
            provincesService.save(provinces);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 修改方法
     */
    @PostMapping("/update")
    public boolean update(@RequestBody Provinces provinces) {
        try {
            provincesService.update(provinces);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /**
     * 删除方法
     */
    @GetMapping("/delete")
    public boolean delete(Long[] ids) {
        try {
            provincesService.deleteAll(ids);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return false;
    }

    /*根据省份id查询市*/
    @GetMapping("/findCity")
    public List<Cities> findCityByProvinceId(Long provinceId) {


        return citiesService.findCityByProvinceId(provinceId);
    }
    /*根据城市Id查询区*/
    @GetMapping("/findArea")
    public List<Areas>findAreasByCityId(Long cityId){
        return areasService.findAreasByCityId(cityId);
    }
}
