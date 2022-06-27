import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ListSV.css';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { toast } from "react-toastify";

const ListSV = () => {
    const [data, setData] = useState([]);
    let navigate = useNavigate();
    const { maLop } = useParams();

    useEffect(() => {
        getSV();
    }, [])

    const getSV = async () => {
        const res = await axios.get(`http://localhost:8080/api/svByMaLop/${maLop}`);
        if (res.status === 200) {
            setData(res.data);
        }
    };

    const onDelete = async (maSV, name) => {

        if (window.confirm(`Bạn có muốn xóa sinh viên ${name} khỏi lớp không?`)) {
            // let dataSV = {
            //     maLop: Number(maLop),
            //     maSV: maSV
            // }
            // console.log(dataSV);
            const response = await axios.delete(`http://localhost:8080/api/svLop`, {
                params: {
                    maLop: Number(maLop),
                    maSV: maSV
                }
            });
            console.log(response);
            if (response.status === 200) {
                toast.success(`Đã xóa sinh viên ${name}`, { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                navigate(`/admin/lop/listSV/${maLop}`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                window.position.reload();
                console.log(response);
            }
        }

    }

    return (
        <div style={{ marginTop: "50px", paddingBottom: "50px" }}>

            {/* <Link to="/taiKhoan/add">
                <button className="btn btn-add">Thêm mới</button>
            </Link> */}
            <Table striped bordered hover responsive="xl" className="styled-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th style={{ textAlign: "center" }}>Mã</th>
                        <th style={{ textAlign: "center" }}>Họ tên</th>
                        <th style={{ textAlign: "center" }}>Lớp trường</th>
                        <th style={{ textAlign: "center" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => {
                        return (
                            <tr key={item.maSV} >
                                <th scope="row">{index + 1}</th>
                                <td>{item.maSV}</td>
                                <td>{item.hoTen}</td>
                                <td>{item.lopTruong}</td>

                                <td>
                                    {/* <Link to={`/taiKhoan/${item.ma}`}>
                                            <button className="btn btn-view">Chi tiết</button>
                                        </Link> */}
                                    <button className="btn btn-delete" onClick={() => onDelete(item.maSV, item.hoTen)}>Xóa</button>
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </Table>
        </div>

        // onClick={() => {
        //     navigate(`/admin/taiKhoan/${item.maSV}`);
        // }}
    )
}

export default ListSV