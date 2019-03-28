package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Cities;
import com.pinyougou.service.CitiesService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
/**
 * CitiesController 控制器类
 * @date 2019-03-26 19:35:59
 * @version 1.0
 */
@RestController
@RequestMapping("/cities")
public class CitiesController {
	@Reference(timeout = 10000)
	private CitiesService citiesService;

	/** 查询全部方法 */
	@GetMapping("/findAll")
	public List<Cities> findAll() {
		return citiesService.findAll();
	}

	/** 多条件分页查询方法 */
	@GetMapping("/findByPage")
	public List<Cities> findByPage(Cities cities,
			Integer page,Integer rows) {
		try {
			return citiesService.findByPage(cities, page, rows);
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
	}

	/** 根据主键id查询方法 */
	@GetMapping("/findOne")
	public Cities findOne(Long id) {
		try {
			return citiesService.findOne(id);
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
	}

	/** 添加方法 */
	@PostMapping("/save")
	public boolean save(@RequestBody Cities cities) {
		try {
			citiesService.save(cities);
			return true;
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return false;
	}

	/** 修改方法 */
	@PostMapping("/update")
	public boolean update(@RequestBody Cities cities) {
		try {
			citiesService.update(cities);
			return true;
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return false;
	}

	/** 删除方法 */
	@GetMapping("/delete")
	public boolean delete(Long[] ids) {
		try {
			citiesService.deleteAll(ids);
			return true;
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return false;
	}

}
