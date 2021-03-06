package com.pinyougou.user.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.AddressMapper;
import com.pinyougou.pojo.Address;
import com.pinyougou.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 地址服务接口实现类
 *
 * @author lee.siu.wah
 * @version 1.0
 * <p>File Created at 2019-03-20<p>
 */
@Service(interfaceName = "com.pinyougou.service.AddressService")
@Transactional
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressMapper addressMapper;

    @Override
    public void save(Address address) {
        try {

            address.setIsDefault("0");
            address.setCreateDate(new Date());
            addressMapper.insertSelective(address);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(Address address) {
        addressMapper.updateByPrimaryKeySelective(address);
    }

    @Override
    public void delete(Serializable id) {
        addressMapper.deleteByPrimaryKey(id);
    }

    @Override
    public void deleteAll(Serializable[] ids) {

    }

    @Override
    public Address findOne(Serializable id) {
        return null;
    }

    @Override
    public List<Address> findAll() {
        return null;
    }

    @Override
    public List<Address> findByPage(Address address, int page, int rows) {
        return null;
    }

    @Override
    public List<Address> findAddressByUser(String userId) {
        try {
            // SELECT * FROM `tb_address` WHERE user_id = 'itcast' ORDER BY is_default DESC
            // 创建Example对象
            Example example = new Example(Address.class);
            // 创建条件对象
            Example.Criteria criteria = example.createCriteria();
            // user_id = 'itcast'
            criteria.andEqualTo("userId", userId);
            // 排序  ORDER BY is_default DESC
            example.orderBy("isDefault").desc();

            // 条件查询
            return addressMapper.selectByExample(example);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public void setDefault(Long id) {
        Address address = addressMapper.selectByPrimaryKey(id);
        address.setIsDefault("1");

        Example example = new Example(Address.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("isDefault", 1);
        List<Address> addressList = addressMapper.selectByExample(example);
        for (Address address1 : addressList) {
            address1.setIsDefault("0");
            addressMapper.updateByPrimaryKey(address1);
        }

        addressMapper.updateByPrimaryKey(address);
    }
}
