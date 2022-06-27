import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { ImageList, ImageListItem } from "@mui/material";

export default function ExcerciseDetail() {
    let { maBaiTap } = useParams();
    const [baiTap, setBaiTap] = useState('');
    const [key, setKey] = useState('detail');
    let navigate = useNavigate();

    useEffect(() => {
        console.log(maBaiTap);
        axios.get(`http://localhost:8080/api/baiTap/` + maBaiTap)
            .then(res => {
                setBaiTap(res.data[0]);
            });
    }, []);

    function updateBT(e) {
        e.preventDefault();
        console.log(baiTap);
        let url = 'http://localhost:8080/api/baiTap/' + maBaiTap;
        axios.put(url, baiTap).then(res => {
            if (res.status === 200) {
                window.history.back();
            }
        })
    }

    function dataOnChange(e) {
        const date = new Date();
        if (e.target.name === 'moTa') {
            setBaiTap({ ...baiTap, moTa: e.target.value })
        }
        if (e.target.name === 'kieuBT') {
            setBaiTap({ ...baiTap, kieuBT: Number(e.target.value) })
        }
        if (e.target.name === 'loaiBT') {
            setBaiTap({ ...baiTap, loaiBT: e.target.value })
        }
        if (e.target.name === 'hanNop') {
            const currDate = date.getTime();
            let value = new Date(e.target.value).getTime();
            console.log(value);
            console.log(currDate);
            if (value > currDate) {
                setBaiTap({ ...baiTap, hanNop: e.target.value });
                document.getElementById('dueError').innerHTML = "";
            } else {
                document.getElementById("dueError").innerHTML = "Hạn nộp phải sau thời gian hiện tại";
            }
        }
    }

    function handleDate() {
        if (baiTap) {
            console.log(baiTap);
            let date2 = baiTap.hanNop.slice(0, 19);
            console.log(date2);
            return date2;
        }
    }

    return (
        <Tabs
            id="tab-detail"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="detail" title="Chi tiết bài tập">
                <Form onSubmit={updateBT}>
                    <h3>{baiTap.tenBT}</h3>
                    <div className='row'>
                        <div className='col-sm-9 d-flex flex-column' style={{ padding: '20px' }}>
                            <Form.Group>
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control as='textarea' rows={4} name='moTa' onChange={dataOnChange} value={baiTap.moTa ? baiTap.moTa : ""}></Form.Control>
                            </Form.Group>
                        </div>
                        <div className='col-sm-3 d-flex flex-column' style={{ padding: '20px' }}>
                            <Form.Group>
                                <Form.Label>Kiểu bài tập</Form.Label>
                                <Form.Select name='kieuBT' onChange={dataOnChange} value={baiTap.kieuBT}>
                                    <option value="0">Cá nhân</option>
                                    <option value="1">Nhóm</option>
                                </Form.Select>
                                <Form.Group>
                                    <Form.Label>Loại bài tập</Form.Label>
                                    <Form.Control type='text' name='loaiBT' onChange={dataOnChange} value={baiTap.loaiBT}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Hạn nộp</Form.Label>
                                    <Form.Control type='datetime-local' name='hanNop' onChange={dataOnChange} value={handleDate()}></Form.Control>
                                    <span id="dueError" style={{ color: 'red' }}></span>
                                </Form.Group>
                            </Form.Group>
                        </div>
                    </div>
                    <Button variant='primary' type='submit'>Cập nhật</Button>
                </Form>
            </Tab>
            <Tab eventKey="work" title="Bài tập của sinh viên">
                {(baiTap.kieuBT === 0) ? <BTofSV tenBT={baiTap.tenBT} maBT={maBaiTap} kieuBT={baiTap.kieuBT}></BTofSV> : <BTofNhom tenBT={baiTap.tenBT} maBT={maBaiTap} kieuBT={baiTap.kieuBT}></BTofNhom>}
            </Tab>
        </Tabs>
    )
}

function BTofSV(props) {
    const [svDaNop, setSVDaNop] = useState([]);
    const [svChuaNop, setSVChuaNop] = useState([]);
    const [ds, setDS] = useState();
    const [ModalID, setModalID] = useState(null);
    const [imgList, setImgList] = useState([]);
    // let navigate = useNavigate();
    const getSVDaNop = () => {
        axios.get('http://localhost:8080/api/SVDaNopBT/' + props.maBT).then(res => {
            setSVDaNop(res.data);
        })
    }

    const getSVChuaNop = () => {
        axios.get('http://localhost:8080/api/SVChuaNopBT/' + props.maBT).then(res => {
            setSVChuaNop(res.data);
        })
    }

    useEffect(() => {
        getSVDaNop();
        getSVChuaNop();
    }, []);

    const getImgList = (maSV) => {
        axios.get('http://localhost:8080/api/TLTheoSVBT', {
            params: {
                maBT: Number(props.maBT),
                maSV: maSV
            }
        }).then(res => {
            setImgList(res.data);
        });
    }

    const renderDS = () => {
        if (ds == 1) {
            return (
                <div>
                    <div className="title mt-5">
                        <h3>Danh sách sinh viên đã nộp bài</h3>
                    </div>
                    <List>
                        {svDaNop.map(item => (
                            <div key={item.ma}>
                                <ListItemButton onClick={() => { setModalID(item.ma); getImgList(item.ma); }}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon></PersonIcon>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.hoTen} secondary={item.ma}></ListItemText>
                                </ListItemButton>

                                <Modal show={item.ma === ModalID} size="lg" onHide={() => setModalID(null)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Danh sách bài tập</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Box sx={{ height: '550px', overflowY: 'scroll' }}>
                                            <ImageList variant="masonry" cols={3} gap={8}>
                                                {imgList.map((item) => (
                                                    <ImageListItem key={item.maTL}>
                                                        <img
                                                            src={`${item.link}?w=248&fit=crop&auto=format`}
                                                            srcSet={`${item.link}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                            loading="lazy"
                                                        />
                                                    </ImageListItem>
                                                ))}
                                            </ImageList>
                                        </Box>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        ))}
                    </List>
                </div >
            )
        } else if (ds === 2) {
            return (
                <div>
                    <div className="title mt-5">
                        <h3>Danh sách sinh viên chưa nộp bài</h3>
                    </div>
                    <List>
                        {svChuaNop.map(item => (
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon></PersonIcon>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.hoTen} secondary={item.ma}></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </div >
            )
        }
    }

    return (
        <div className="container">
            <div className="text-center">
                <h2>{props.tenBT}</h2>
                <div className="sv-number mt-3">
                    <div style={{ width: '300px', borderRight: 'solid 2px black' }}>
                        <h1 style={{ color: 'green' }}>{svDaNop.length}</h1>
                        <p style={{ fontSize: '25px' }}>Sinh viên đã nộp</p>
                        <Button disabled={(ds === 1) ? true : false} variant="primary" onClick={() => { setDS(1); }}>Hiển thị</Button>
                    </div>
                    <div style={{ width: '300px' }}>
                        <h1 style={{ color: 'red' }}>{svChuaNop.length}</h1>
                        <p style={{ fontSize: '25px' }}>Sinh viên chưa nộp</p>
                        <Button disabled={(ds === 2) ? true : false} variant="primary" onClick={() => setDS(2)}>Hiển thị</Button>
                    </div>
                </div>
            </div>
            {renderDS()}
        </div>
    )
}

function BTofNhom(props) {
    const [nhomDaNop, setNhomDaNop] = useState([]);
    const [nhomChuaNop, setNhomChuaNop] = useState([]);
    const [ds, setDS] = useState();
    const [show, setShow] = useState(false);
    const [imgList, setImgList] = useState([]);
    const getNhomDaNop = () => {
        axios.get('http://localhost:8080/api/NhomNopBT/' + props.maBT).then(res => {
            setNhomDaNop(res.data);
        })
    }

    const getNhomChuaNop = () => {
        axios.get('http://localhost:8080/api/NhomKhongNopBT/' + props.maBT).then(res => {
            setNhomChuaNop(res.data);
        })
    }

    useEffect(() => {
        getNhomDaNop();
        getNhomChuaNop();
    }, []);

    const getImgList = (maLop, sttNhom) => {
        axios.get('http://localhost:8080/api/TLTheoNhom', {
            params: {
                maBT: Number(props.maBT),
                maLop: maLop,
                sttNhom: sttNhom
            }
        }).then(res => {
            setImgList(res.data);
        });
    }

    const renderDS = () => {
        if (ds == 1) {
            return (
                <div>
                    <div className="title mt-5">
                        <h3>Danh sách nhóm sinh viên đã nộp bài</h3>
                    </div>
                    <div className='mon'>
                        {nhomDaNop.map(item1 => (
                            <div key={item1.maLop + item1.sttNhom}>
                                <div className='card' style={{ width: '430px', margin: '20px' }}>
                                    <div className='card-header' onClick={() => { setShow(true); getImgList(item1.maLop, item1.sttNhom) }}>
                                        {`${item1.sttNhom}. ${item1.tenNhom ? item1.tenNhom : ''}`}
                                    </div>
                                    <div className='card-body'>
                                        <List>
                                            {item1.sv.map(item => (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <PersonIcon></PersonIcon>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${item.hoTen} - ${item.maSV}`} secondary={(item.nhomTruong === 1) ? 'Nhóm trưởng' : ''}></ListItemText>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>
                                    <div className='card-footer'>
                                        {item1.topic ? item1.topic : 'Chưa có topic'}
                                    </div>
                                    <Modal show={show} size='lg' onHide={() => setShow(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Danh sách tài liệu hình ảnh</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Box sx={{ height: '550px', overflowY: 'scroll' }}>
                                                <ImageList variant="masonry" cols={3} gap={8}>
                                                    {imgList.map((item) => (
                                                        <ImageListItem key={item.maTL}>
                                                            <img
                                                                src={`${item.link}?w=248&fit=crop&auto=format`}
                                                                srcSet={`${item.link}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                                loading="lazy"
                                                            />
                                                        </ImageListItem>
                                                    ))}
                                                </ImageList>
                                            </Box>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            )
        } else if (ds === 2) {
            return (
                <div>
                    <div className="title mt-5">
                        <h3>Danh sách nhóm sinh viên chưa nộp bài</h3>
                    </div>
                    <div className='mon'>
                        {nhomChuaNop.map(item1 => (
                            <div className='card' style={{ width: '430px', margin: '20px' }} key={item1.maLop + item1.sttNhom}>
                                <div className='card-header'>
                                    {`${item1.sttNhom}. ${item1.tenNhom ? item1.tenNhom : ''}`}
                                </div>
                                <div className='card-body'>
                                    <List>
                                        {item1.sv.map(item => (
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <PersonIcon></PersonIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={`${item.hoTen} - ${item.maSV}`} secondary={(item.nhomTruong === 1) ? 'Nhóm trưởng' : ''}></ListItemText>
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                                <div className='card-footer'>
                                    {item1.topic ? item1.topic : 'Chưa có topic'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            )
        }
    }

    return (
        <div className="container">
            <div className="text-center">
                <h2>{props.tenBT}</h2>
                <div className="sv-number mt-3">
                    <div style={{ height: '150px', width: '250px', borderRight: 'solid 2px black' }}>
                        <h1 style={{ color: 'green' }}>{nhomDaNop.length}</h1>
                        <p style={{ fontSize: '25px' }}>Nhóm đã nộp</p>
                        <Button disabled={(ds === 1) ? true : false} variant="primary" onClick={() => { setDS(1); }}>Hiển thị</Button>
                    </div>
                    <div style={{ height: '150px', width: '250px' }}>
                        <h1 style={{ color: 'red' }}>{nhomChuaNop.length}</h1>
                        <p style={{ fontSize: '25px' }}>Nhóm chưa nộp</p>
                        <Button disabled={(ds === 2) ? true : false} variant="primary" onClick={() => setDS(2)}>Hiển thị</Button>
                    </div>
                </div>
            </div>
            {renderDS()}
        </div>
    )
}