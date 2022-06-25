import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { MonItem } from "./monItem";
import "./gvStyle.css";
import axios from 'axios';
import { Button, Form, Modal, ModalTitle, Tab, Tabs } from 'react-bootstrap';
import { Mode } from '@mui/icons-material';

export default function Exercise(props) {
    const [listBT, setListBT] = useState([]);
    const [show, setShow] = useState(false);
    const [bt, setBT] = useState({
        tenBT: '',
        loaiBT: '',
        hanNop: '',
        moTa: '',
        kieuBT: 0,
        maLop: props.maLop
    })
    const [add, setAdd] = useState(0);
    useEffect(() => {
        let url = 'http://localhost:8080/api/baiTapList/' + props.maLop;
        axios.get(url).then(res => {
            setListBT(res.data);
        })
        console.log(bt);
    }, [props.maLop, add])

    const createBT = (e) => {
        e.preventDefault();
        let url = 'http://localhost:8080/api/baiTap'
        axios.post(url, bt).then(res => {
            if (res.status === 200) {
                setShow(false);
                setBT({
                    tenBT: '',
                    loaiBT: '',
                    hanNop: '',
                    moTa: '',
                    kieuBT: 0,
                    maLop: props.maLop
                });
                setAdd(add + 1);
            }
        })
    }

    const dataOnChange = (e) => {
        const date = new Date();
        if (e.target.name === 'tenBT') {
            setBT({ ...bt, tenBT: e.target.value })
        }
        if (e.target.name === 'moTa') {
            setBT({ ...bt, moTa: e.target.value })
        }
        if (e.target.name === 'kieuBT') {
            setBT({ ...bt, kieuBT: Number(e.target.value) })
        }
        if (e.target.name === 'loaiBT') {
            setBT({ ...bt, loaiBT: e.target.value })
        }
        if (e.target.name === 'hanNop') {
            const currDate = date.getTime();
            let value = new Date(e.target.value).getTime();
            console.log(value);
            console.log(currDate);
            if (value > currDate) {
                setBT({ ...bt, hanNop: e.target.value });
                document.getElementById('dueError').innerHTML = "";
            } else {
                document.getElementById("dueError").innerHTML = "Hạn nộp phải sau thời gian hiện tại";
            }
        }
    }

    function handleShow() {
        setShow(true);
    }

    return (
        <div className='container'>
            <div style={{ height: '200px', backgroundColor: 'skyblue', borderRadius: '1em', paddingTop: '150px', paddingLeft: '20px' }}>
                <h3 style={{ color: 'white' }}>{props.name}</h3>
            </div>
            <div className='row' style={{ marginTop: '20px' }}>
                <div className='col-sm-3 d-flex flex-column'>
                    <div className='d-flex flex-column' style={{ border: '1px solid rgb(32, 59, 135)', borderRadius: '5px', padding: '7px' }}>
                        <h4>Sắp đến hạn</h4>
                        <p>Tuyệt vời , không có bài tập nào sắp đến hạn</p>
                        <button className='btn btn-link' style={{ color: 'black' }}>Xem tất cả</button>
                    </div>
                    <button className='btn' onClick={() => handleShow()} style={{ backgroundColor: 'rgb(32, 59, 135)', color: 'white', marginTop: '5px' }}>Tạo bài tập</button>
                </div>
                <div className='col-sm-9 d-flex flex-column'>
                    {listBT.map((item) => (
                        <ExerciseItem bt={item}></ExerciseItem>
                    ))}
                </div>
            </div>
            <Modal show={show} fullscreen onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo bài tập</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createBT}>
                        <div className='row'>
                            <div className='col-sm-9 d-flex flex-column' style={{ padding: '20px' }}>
                                <Form.Group>
                                    <Form.Label>Tên bài tập</Form.Label>
                                    <Form.Control type='text' name='tenBT' required onChange={dataOnChange} value={bt.tenBT}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control as='textarea' rows={4} name='moTa' onChange={dataOnChange} value={bt.moTa}></Form.Control>
                                </Form.Group>
                            </div>
                            <div className='col-sm-3 d-flex flex-column' style={{ padding: '20px' }}>
                                <Form.Group>
                                    <Form.Label>Kiểu bài tập</Form.Label>
                                    <Form.Select name='kieuBT' onChange={dataOnChange} value={bt.kieuBT}>
                                        <option value="0">Cá nhân</option>
                                        <option value="1">Nhóm</option>
                                    </Form.Select>
                                    <Form.Group>
                                        <Form.Label>Loại bài tập</Form.Label>
                                        <Form.Control type='text' name='loaiBT' onChange={dataOnChange} value={bt.loaiBT}></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Hạn nộp</Form.Label>
                                        <Form.Control type='datetime-local' name='hanNop' onChange={dataOnChange}></Form.Control>
                                        <span id="dueError" style={{ color: 'red' }}></span>
                                    </Form.Group>
                                </Form.Group>
                            </div>
                        </div>
                        <Button variant='primary' type='submit'>Tạo</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

function ExerciseItem(props) {
    const [open, setOpen] = useState();
    const [key, setKey] = useState('detail');
    const [bt,setBT] = useState(props.bt);
    let navigate = useNavigate();

    // function closeModal() {
    //     setOpen(false);
    // }

    // function dataOnChange(e) {
    //     const date = new Date();
    //     if (e.target.name === 'moTa') {
    //         setBT({ ...bt, moTa: e.target.value })
    //     }
    //     if (e.target.name === 'kieuBT') {
    //         setBT({ ...bt, kieuBT: Number(e.target.value) })
    //     }
    //     if (e.target.name === 'loaiBT') {
    //         setBT({ ...bt, loaiBT: e.target.value })
    //     }
    //     if (e.target.name === 'hanNop') {
    //         const currDate = date.getTime();
    //         let value = new Date(e.target.value).getTime();
    //         console.log(value);
    //         console.log(currDate);
    //         if (value > currDate) {
    //             setBT({ ...bt, hanNop: e.target.value });
    //             document.getElementById('dueError').innerHTML = "";
    //         } else {
    //             document.getElementById("dueError").innerHTML = "Hạn nộp phải sau thời gian hiện tại";
    //         }
    //     }
    // }

    // function updateBT(e) {
    //     e.preventDefault();
    //     let url = 'http://localhost:8080/api/baiTap' + bt.maBT;
    //     axios.post(url, bt).then(res => {
    //         if (res.status === 200) {
    //             setOpen(false);
    //             window.location.reload();
    //         }
    //     })
    // }

    // function handleDate(){
    //     console.log(bt.hanNop);
    //     let date2 = bt.hanNop.slice(0,19);
    //     console.log(date2);
    //     return date2;
    // }


    return (
        <div className='btItem' onClick={() => {navigate("/giangvien/baiTap/" + props.bt.maBT);}}>
            <span className='dot'></span>
            <div>
                <h4>{bt.tenBT}</h4>
                <span>{bt.loaiBT}</span>
            </div>
            {/* <Modal show={open} fullscreen onHide={() => setOpen(false)}>
                <Modal.Body>
                    <Tabs
                        id="tab-detail"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="detail" title="Chi tiết bài tập">
                            <Form onSubmit={updateBT}>
                                <h3>{bt.tenBT}</h3>
                                <div className='row'>
                                    <div className='col-sm-9 d-flex flex-column' style={{ padding: '20px' }}>
                                        <Form.Group>
                                            <Form.Label>Mô tả</Form.Label>
                                            <Form.Control as='textarea' rows={4} name='moTa' onChange={dataOnChange} value = {bt.moTa}></Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className='col-sm-3 d-flex flex-column' style={{ padding: '20px' }}>
                                        <Form.Group>
                                            <Form.Label>Kiểu bài tập</Form.Label>
                                            <Form.Select name='kieuBT' onChange={dataOnChange} value = {bt.kieuBT}>
                                                <option value="0">Cá nhân</option>
                                                <option value="1">Nhóm</option>
                                            </Form.Select>
                                            <Form.Group>
                                                <Form.Label>Loại bài tập</Form.Label>
                                                <Form.Control type='text' name='loaiBT' onChange={dataOnChange} value = {bt.loaiBT}></Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Hạn nộp</Form.Label>
                                                <Form.Control type='datetime-local' name='hanNop' onChange={dataOnChange} value = {handleDate()}></Form.Control>
                                                <span id="dueError" style={{ color: 'red' }}></span>
                                            </Form.Group>
                                        </Form.Group>
                                    </div>
                                </div>
                                <Button variant='secondary' type='submit'>Cập nhật</Button>
                            </Form>
                        </Tab>
                        <Tab eventKey="work" title="Bài tập của sinh viên">
                            <h1>Bài tập của sinh viên</h1>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Đóng</Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    )
}