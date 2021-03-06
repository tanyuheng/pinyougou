package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.Areas;
import com.pinyougou.mapper.AreasMapper;
import com.pinyougou.service.AreasService;
import java.util.List;
import com.github.pagehelper.ISelect;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;
import java.io.Serializable;
import java.util.Arrays;
/**
 * AreasServiceImpl 服务接口实现类
 * @date 2019-03-26 19:42:12
 * @version 1.0
 */
@Service(interfaceName = "com.pinyougou.service.AreasService")
@Transactional
public class AreasServiceImpl implements AreasService {

	@Autowired
	private AreasMapper areasMapper;

	/** 添加方法 */
	public void save(Areas areas){
		try {
			areasMapper.insertSelective(areas);
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 修改方法 */
	public void update(Areas areas){
		try {
			areasMapper.updateByPrimaryKeySelective(areas);
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 根据主键id删除 */
	public void delete(Serializable id){
		try {
			areasMapper.deleteByPrimaryKey(id);
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 批量删除 */
	public void deleteAll(Serializable[] ids){
		try {
			// 创建示范对象
			Example example = new Example(Areas.class);
			// 创建条件对象
			Example.Criteria criteria = example.createCriteria();
			// 创建In条件
			criteria.andIn("id", Arrays.asList(ids));
			// 根据示范对象删除
			areasMapper.deleteByExample(example);
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 根据主键id查询 */
	public Areas findOne(Serializable id){
		try {
			return areasMapper.selectByPrimaryKey(id);
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 查询全部 */
	public List<Areas> findAll(){
		try {
			return areasMapper.selectAll();
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	/** 多条件分页查询 */
	public List<Areas> findByPage(Areas areas, int page, int rows){
		try {
			PageInfo<Areas> pageInfo = PageHelper.startPage(page, rows)
				.doSelectPageInfo(new ISelect() {
					@Override
					public void doSelect() {
						areasMapper.selectAll();
					}
				});
			return pageInfo.getList();
		}catch (Exception ex){
			throw new RuntimeException(ex);
		}
	}

	@Override
	public List<Areas> findAreasByCityId(Long cityId) {
		Example example = new Example(Areas.class);
		Example.Criteria criteria = example.createCriteria();
		criteria.andEqualTo("cityId", cityId);
		return areasMapper.selectByExample(example);
	}

}