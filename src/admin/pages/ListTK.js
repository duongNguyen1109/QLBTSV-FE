import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ListTK.css';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import AddTK from "../components/AddTK";
import { toast } from "react-toastify";

const ListTK = () => {

    const [data, setData] = useState([]);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    let navigate = useNavigate();

    useEffect(() => {
        getTK();
        getPagination();
    }, [page])



    const getTK = async () => {
        const res = await axios.get(`http://localhost:8080/api/listTaiKhoan/${page}`);
        if (res.status === 200) {
            setData(res.data);
        }
    };

    const getPagination = async () => {
        const res = await axios.get(`http://localhost:8080/api/slPage`);
        if (res.status === 200) {
            setPages(res.data);
        }
    };

    const onDelete = async (ma, name) => {

        if (window.confirm(`Bạn có muốn xóa tài khoản ${name} không?`)) {
            const response = await axios.delete(`http://localhost:8080/api/taiKhoan/${ma}`);
            console.log(response);
            if (response.status === 200) {
                toast.success(`Đã xóa tài khoản ${name}`, { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                navigate(`/admin/taiKhoan`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }

    }

    function renderPages(){
        let pageItem = [];
        for (let number = 1; number <= pages; number++) {
            pageItem.push(
              <a key={`${number}`} onClick={(e) => {setPage(Number(e.target.text))}} className={`${page === number ? "active" : ""}`} >
                {number}
              </a>,
            );
          }
        return(pageItem);
    }

    return (
        <>
            {/* <NameForm/> */}
            <AddTK />
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
                            <th style={{ textAlign: "center" }}>SĐT</th>
                            <th style={{ textAlign: "center" }}>Email</th>
                            <th style={{ textAlign: "center" }}>Địa chỉ</th>
                            <th style={{ textAlign: "center" }}>Ngày sinh</th>
                            <th style={{ textAlign: "center" }}>Loại tài khoản</th>
                            <th style={{ textAlign: "center" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => {
                            return (
                                <tr key={item.ma} onClick={() => {
                                    navigate(`/admin/taiKhoan/${item.ma}`);
                                }}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.ma}</td>
                                    <td>{item.hoTen}</td>
                                    <td>{item.SDT}</td>
                                    <td>{item.email}</td>
                                    <td>{item.diaChi}</td>
                                    <td>{item.ngaySinh}</td>
                                    <td>{`${item.loaiTK === 1 ? "Sinh viên" : `${item.loaiTK === 2 ? "Giáo Viên" : `${item.loaiTK === 3 && "Admin"}`}`}`}</td>
                                    <td>
                                        {/* <Link to={`/taiKhoan/${item.ma}`}>
                                            <button className="btn btn-view">Chi tiết</button>
                                        </Link> */}
                                        <button className="btn btn-delete" onClick={() => onDelete(item.ma, item.hoTen)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>

                <div className="pagination">
                    <a onClick = {() => {if(page>1){setPage(page-1)}}} className={`${page === 1 ? "hide" : ""}`}>&laquo;</a>
                    {renderPages()}
                    <a onClick = {() => {if(page<pages){setPage(page+1);}}} className={`${page == pages ? "hide" : ""}`}>&raquo;</a>
                </div>

            </div>
        </>
    )
}

export default ListTK