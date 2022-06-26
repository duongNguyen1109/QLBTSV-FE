import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { MonItem } from "./monItem";
import "./gvStyle.css";
import axios from 'axios';
import { InputGroup, Button, Modal, Form } from 'react-bootstrap';
import { Autocomplete, Avatar, Chip, MenuItem, Select, TextField, InputLabel, FormControl } from '@mui/material';
import { Face } from '@mui/icons-material';

import { OutTable, ExcelRenderer } from 'react-excel-renderer';

export default function Group(props) {
    const [groupsNumber, setGroupsNumber] = useState(0);
    //const [groups, setGroups] = useState([]);
    const [excelData, setExcelData] = useState({
        cols: [],
        rows: []
    });
    const [groupList, setGroupList] = useState([]);
    const [show, setShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [svNotInNhom, setSVNotInNhom] = useState([]);
    const [value, setValue] = useState([]);
    const [tenNhom, setTenNhom] = useState('');
    const [sttUpdate, setsttUpdate] = useState(0);
    const [topicList, setTopicList] = useState([]);
    const [topic, setTopic] = useState('')

    function initData() {
        let url = 'http://localhost:8080/api/getNhomByLop/' + props.maLop;
        axios.get(url).then(respone => {
            // handleGroup(respone.data);
            setGroupList(respone.data);
        });
        axios.get('http://localhost:8080/api/svNotInNhom/' + props.maLop).then(res => {
            setSVNotInNhom(res.data);
            // console.log(props.maLop);
        });
        console.log('da init');
    }

    useEffect(() => {
        initData();
        axios.get('http://localhost:8080/api/topicList/' + props.maMon).then(res => {
            setTopicList(res.data);
        })
    }, [props.maLop])

    function createGroup() {
        //console.log(groups);
        // console.log(value);
        // console.log(tenNhom);
        axios.post('http://localhost:8080/api/nhomBT', {
            maLop: props.maLop,
            sttNhom: Number(groupList.length) + 1,
            tenNhom: tenNhom ? tenNhom : null,
            idTopic: topic ? topic : null
        }).then(res => {
            console.log(res);
        });

        if (value.length > 0) {
            value.forEach(element => {
                axios.post('http://localhost:8080/api/svNhom', {
                    maLop: props.maLop,
                    sttNhom: Number(groupList.length) + 1,
                    maSV: element.maSV,
                    nhomTruong: 0
                }).then(res => {
                    console.log(res);
                });
            });
        }
        closeModal();
        initData();
    }

    function deleteSV(maSV, sttNhom, maLop) {
        console.log(`${maSV} ${sttNhom} ${maLop}`);
        let url = 'http://localhost:8080/api/svNhom';
        axios.delete(url, {
            data: {
                maLop: Number(maLop),
                sttNhom: Number(sttNhom),
                maSV: maSV
            }
        }).then(res => {
            if (res.data === 'deleted!') {
                initData();
            } else {
                alert("Xóa sinh viên trong nhóm thất bại!");
            }
        })
    }

    function updateNhom() {
        console.log(value);
        console.log(tenNhom);
        console.log(sttUpdate);

        axios.put('http://localhost:8080/api/nhomBT', {
            maLop: props.maLop,
            sttNhom: sttUpdate,
            tenNhom: tenNhom ? tenNhom : null,
            idTopic: topic ? topic : null
        }).then(res => {
            console.log(res);
        });

        if (value.length > 0) {
            value.forEach(element => {
                axios.post('http://localhost:8080/api/svNhom', {
                    maLop: props.maLop,
                    sttNhom: sttUpdate,
                    maSV: element.maSV,
                    nhomTruong: 0
                }).then(res => {
                    console.log(res);
                });
            });
        }

        closeModalUpdate();
        initData();
    }

    const openUpdateShow = (nhomData) => {
        setUpdateShow(true);
        setTenNhom(nhomData.tenNhom);
        setsttUpdate(nhomData.sttNhom);
        setTopic(nhomData.idTopic);
    }

    function renderGroups() {
        return (
            <div className='mon'>
                {groupList.map((item1, index) => (
                    <div className='card' style={{ width: '400px', margin: '20px' }} key={item1.maLop + item1.sttNhom}>
                        <div className='card-header' onClick={() => openUpdateShow(item1)}>
                            {`${item1.sttNhom}. ${item1.tenNhom ? item1.tenNhom : ''}`}
                        </div>
                        <div className='card-body'>
                            {item1.sv.map(item => (
                                <Chip className='mb-3' icon={<Face></Face>} label={`${item.hoTen} - ${item.maSV}`} onDelete={() => deleteSV(item.maSV, item1.sttNhom, props.maLop)} key={item.maSV}></Chip>
                            ))}
                        </div>
                        <div className='card-footer'>
                            {item1.tenTopic ? item1.tenTopic : 'Chưa có topic'}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const fileHandle = (e) => {
        let fileObj = e.target.files[0];

        ExcelRenderer(fileObj, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                setExcelData({
                    cols: res.cols,
                    rows: res.rows
                });
            }
        })
    }

    const closeModal = () => {
        setShow(false);
        setValue([]);
        setTenNhom('');
        setTopic('');
        console.log(value, tenNhom, topic);
    }

    const closeModalUpdate = () => {
        setUpdateShow(false);
        setValue([]);
        setTenNhom('');
        setTopic('');
    }

    return (
        <div className='container mt-3'>
            <Button variant='primary' onClick={() => setShow(true)}>Tạo 1 nhóm</Button>
            <input type="file" onChange={fileHandle} style={{ "padding": "10px" }} />
            {renderGroups()}

            <Modal show={show} size='lg' onHide={() => closeModal()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo nhóm {groupList.length + 1}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        className='mb-3'
                        multiple
                        limitTags={2}
                        id='ds-sv-Nhom'
                        options={svNotInNhom}
                        getOptionLabel={(option) => option.hoTen}
                        renderInput={(params) => (
                            <TextField {...params} label="Danh sách sinh viên trong nhóm" />
                        )}
                    />
                    <TextField value={tenNhom} onChange={(e) => setTenNhom(e.target.value)} className='mb-3' id="ten-Nhom" label="Tên nhóm" variant="outlined" fullWidth />
                    <FormControl fullWidth className='mb-3'>
                        <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={topic}
                            label="Topic"
                            onChange={(e) => setTopic(e.target.value)}
                        >
                            {topicList.map(item => (
                                <MenuItem value={item.idTopic}>{item.ten}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={createGroup}>Tạo nhóm</Button>
                </Modal.Body>
            </Modal>

            <Modal show={updateShow} size='lg' onHide={() => closeModalUpdate()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa nhóm {sttUpdate}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        className='mb-3'
                        multiple
                        limitTags={2}
                        id='ds-sv-Nhom'
                        options={svNotInNhom}
                        getOptionLabel={(option) => option.hoTen}
                        renderInput={(params) => (
                            <TextField {...params} label="Danh sách sinh viên thêm vào nhóm" />
                        )}
                    />
                    <TextField value={tenNhom} onChange={(e) => setTenNhom(e.target.value)} className='mb-3' id="ten-Nhom" label="Tên nhóm" variant="outlined" fullWidth />
                    <FormControl fullWidth className='mb-3'>
                        <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={topic}
                            label="Topic"
                            onChange={(e) => setTopic(e.target.value)}
                        >
                            {topicList.map(item => (
                                <MenuItem value={item.idTopic}>{item.ten}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={updateNhom}>Update</Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}