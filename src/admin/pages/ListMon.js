import React, { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ListMon.css';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import AddMon from "../components/AddMon";
import { toast } from "react-toastify";

const ListMon = () => {

    const [data, setData] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        getMon();
    }, [])

    const getMon = async () => {
        const res = await axios.get("http://localhost:8080/api/monHocList");
        if (res.status === 200) {
            setData(res.data);
        }
    };

    const onDelete = async (maMon, name) => {

        if(window.confirm(`Bạn có muốn xóa môn ${name} không?`)){
            const response = await axios.delete(`http://localhost:8080/api/monHoc/${maMon}`);
            if (response.status === 200) {
                toast.success(`Đã xóa tài khoản ${name}`, { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                navigate(`/admin/mon`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                

            }
        }

    }

    return (
        <>
            <AddMon />
            <div style={{ marginTop: "50px", paddingBottom: "50px" }}>
                <Table striped bordered hover responsive="xl" className="styled-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>#</th>
                            <th style={{ textAlign: "center" }}>Mã môn</th>
                            <th style={{ textAlign: "center" }}>Tên môn</th>
                            <th style={{ textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => {
                            return (
                                <tr key={item.maMon} onClick={() => {
                                    navigate(`/admin/mon/${item.maMon}`);
                                }}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.maMon}</td>
                                    <td>{item.tenMon}</td>
                                    <td>
                                        <button className="btn btn-delete" onClick={() => onDelete(item.maMon, item.tenMon)}>Xóa</button>
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

export default ListMon