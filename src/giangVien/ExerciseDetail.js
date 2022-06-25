import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Modal, ModalTitle, Tab, Tabs } from 'react-bootstrap';
import { useEffect, useState } from "react";
import axios from 'axios';

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
                <h1>Bài tập của sinh viên</h1>
            </Tab>
        </Tabs>
    )
}