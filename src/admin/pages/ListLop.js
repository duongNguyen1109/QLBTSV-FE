import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ListTK.css';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import AddLop from "../components/AddLop";
import { toast } from "react-toastify";

const ListLop = () => {

    const [data, setData] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        getLop();
    }, [])

    const getLop = async () => {
        const res = await axios.get("http://localhost:8080/api/lopHocList");
        if (res.status === 200) {
            setData(res.data);
        }
    };

    const onDelete = async (maLop, name) => {

        if (window.confirm(`Bạn có muốn xóa lớp ${name} không?`)) {
            const response = await axios.delete(`http://localhost:8080/api/lopHoc/${maLop}`);
            if (response.status === 200) {
                toast.success(`Đã xóa tài khoản ${name}`, { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);


            }
        }

    }

    return (
        <>
            <AddLop />
            <div style={{ marginTop: "50px", paddingBottom: "50px" }}>
                <Table striped bordered hover responsive="xl" className="styled-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>#</th>
                            <th style={{ textAlign: "center" }}>Tên lớp</th>
                            <th style={{ textAlign: "center" }}>Năm học</th>
                            <th style={{ textAlign: "center" }}>Kỳ học</th>
                            <th style={{ textAlign: "center" }}>Giáo viên</th>
                            <th style={{ textAlign: "center" }}>Môn học</th>
                            <th style={{ textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => {
                            return (
                                <tr key={item.maLop} >
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.tenLop}</td>
                                    <td>{item.namHoc}</td>
                                    <td>{item.ky}</td>
                                    <td>{item.hoTen}</td>
                                    <td>{item.tenMon}</td>
                                    <td>
                                        <button className="btn btn-add" onClick={() => navigate(`/admin/lop/addSV/${item.maLop}`)}>Thêm</button>
                                        <button className="btn btn-delete" onClick={() => onDelete(item.maLop, item.tenLop)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default ListLop