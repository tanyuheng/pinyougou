package com.pinyougou.user.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.Areas;
import com.pinyougou.service.AreasService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
/**
 * AreasController 控制器类
 * @date 2019-03-26 19:35:59
 * @version 1.0
 */
@RestController
@RequestMapping("/areas")
public class AreasController {
	@Reference(timeout = 10000)
	private AreasService areasService;

	/** 查询全部方法 */
	@GetMapping("/findAll")
	public List<Areas> findAll() {
		return areasService.findAll();
	}

	/** 多条件分页查询方法 */
	@GetMapping("/findByPage")
	public List<Areas> findByPage(Areas areas,
			Integer page,Integer rows) {
		try {
			return areasService.findByPage(areas, page, rows);
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
	}

	/** 根据主键id查询方法 */
	@GetMapping("/findOne")
	public Areas findOne(Long id) {
		try {
			return areasService.findOne(id);
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return null;
	}

	/** 添加方法 */
	@PostMapping("/save")
	public boolean save(@RequestBody Areas areas) {
		try {
			areasService.save(areas);
			return true;
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return false;
	}

	/** 修改方法 */
	@PostMapping("/update")
	public boolean update(@RequestBody Areas areas) {
		try {
			areasService.update(areas);
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
			areasService.deleteAll(ids);
			return true;
		}catch (Exception ex){
			ex.printStackTrace();
		}
		return false;
	}

}
