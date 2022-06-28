import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, Navigate, useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import Login from ".//Login.js";
import GvHome from "./giangVien/gvHome";
import Classroom from "./giangVien/Classroom.js";
import axios from "axios";
import { DropdownButton, Dropdown, NavDropdown } from "react-bootstrap";
import ExcerciseDetail from "./giangVien/ExerciseDetail.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./admin/components/Header.js";
import ListTK from "./admin/pages/ListTK";
import ListMon from "./admin/pages/ListMon";
import ListLop from "./admin/pages/ListLop";
import AddSV from "./admin/components/AddSV";
import SvHome from "./sinhVien/SvHome.js";
import ExcerciseDetailSV from "./sinhVien/exerciseDetailSV.js";
import ListSV from "./admin/components/ListSV.js";
import SVUpFile from "./sinhVien/svUpfile.js";
import SearchImage from "./giangVien/searchImage.js";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={
                    (localStorage.getItem("user") === "admin") ? <Admin /> : <Navigate replace to="/" />
                }>
                    <Route path="taiKhoan" element={<ListTK />} exact />
                    <Route exact path="mon" element={<ListMon />} />
                    <Route exact path="lop" element={<ListLop />} />
                    <Route path="taiKhoan/:ma" element={<ListTK />} />
                    <Route path='mon/:maMon' element={<ListMon />} />
                    <Route path='lop/listSV/:maLop' element={<ListSV />} />
                    <Route path='lop/addSV/:maLop' element={<AddSV />} />
                </Route>

                <Route path="/sinhvien" element={
                    (localStorage.getItem("user") === "sv") ? <SinhVien /> : <Navigate replace to="/" />
                }>
                    <Route path="" element={<SvHome />}></Route>
                    <Route path="lop/:tenLop/:maLop/:maGV" element={<Classroom />}></Route>
                    <Route path="baiTap/:maBaiTap/:maLop" element={<ExcerciseDetailSV />}></Route>
                    <Route path=":maLop/:maBaiTap/upfile" element={<SVUpFile />}></Route>
                </Route>

                <Route path="/giangvien" element={
                    (localStorage.getItem("user") === "gv") ? <GiangVien /> : <Navigate replace to="/" />
                }>
                    <Route path="" element={<GvHome />}></Route>
                    <Route path="lop/:tenLop/:maLop/:maMon" element={<Classroom />}></Route>
                    <Route path="baiTap/:maBaiTap" element={<ExcerciseDetail />}></Route>
                    <Route path="search-img" element={<SearchImage />}></Route>
                </Route>
                <Route exact path="/" element={<Login />}>
                </Route>
            </Routes>
        </Router >
    )
}
// function Abc() {
//     console.log(localStorage.getItem("admin"));
//     if (localStorage.getItem("admin")) return <Admin />
//     else return <Navigate to="/" />
// }
function Admin() {
    // console.log(localStorage.getItem("admin"));
    return (
        <div className='App'>
            <Header />
            <ToastContainer />
            <Outlet />
        </div>
    )
}

function SinhVien() {
    let { tenLop } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [tab, setTab] = useState('');
    useEffect(() => {
        axios.get(`http://localhost:8080/api/taiKhoan/` + localStorage.getItem("id"))
            .then(response => {
                setUserInfo(response.data[0]);
            });
    }, []);

    let history = useNavigate();
    const logout = () => {
        localStorage.removeItem("user");
        history("/");
    }
    return (
        <div>
            <nav class="navbar navbar-expand-sm" style={{ backgroundColor: 'rgb(32, 59, 135)' }}>
                <div class="container-fluid">
                    <a class="navbar-brand" style={{ color: 'white' }}>{tenLop ? `Lớp ${tenLop}` : 'Quản lý bài tập sinh viên - Khoa đa phương tiện'}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar">
                        {tenLop ? <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(0)}>Bài tập</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(1)}>Thành viên</a>
                            </li>
                        </ul> : <ul class="navbar-nav me-auto"></ul>}

                        <NavDropdown
                            title={userInfo.hoTen}
                            menuVariant="light"
                            id="userName"
                        >
                            <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </nav>
            <Outlet context={[tab, setTab]} />
        </div>
    )
}

function GiangVien() {
    let { tenLop, maLop, maMon } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [tab, setTab] = useState(0);
    const [tabHome, setTabHome] = useState(0);
    let location = useLocation();
    useEffect(() => {
        axios.get(`http://localhost:8080/api/taiKhoan/` + localStorage.getItem("id"))
            .then(response => {
                setUserInfo(response.data[0]);
            });
    }, []);

    let history = useNavigate();
    let logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        history("/");
    }
    return (
        <div>
            <nav class="navbar navbar-expand-sm" style={{ backgroundColor: 'rgb(32, 59, 135)' }}>
                <div class="container-fluid">
                    <a class="navbar-brand" style={{ color: 'white' }}>{tenLop ? `Lớp ${tenLop}` : 'Quản lý bài tập sinh viên - Khoa đa phương tiện'}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar">
                        {tenLop ? <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(0)}>Bài tập</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(1)}>Thành viên</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(2)}>Chia nhóm</a>
                            </li>
                        </ul> : (location.pathname === "/giangvien" || location.pathname === "/giangvien/search-img") ?
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link" onClick={() => {
                                        if (location.pathname !== "/giangvien") {
                                            setTabHome(0);
                                            history("/giangvien");
                                        }
                                    }}>Trang chủ</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" onClick={() => {
                                        if (location.pathname !== "/giangvien/search-img") {
                                            setTabHome(1);
                                            history("/giangvien/search-img");
                                        }
                                    }}>Tìm kiếm hình ảnh</a>
                                </li>
                            </ul> : <ul class="navbar-nav me-auto"></ul>}

                        <NavDropdown
                            title={userInfo.hoTen}
                            menuVariant="light"
                            id="userName"
                        >
                            <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </nav >
            {/* <div className="container center" style={{ marginTop: "50px" }}>
                <select class="form-control" onChange={(e) => handleKyHoc(e.target.value)} >
                    {kyHocList.map((item) => (
                        <option value={item.namHoc + "/" + item.ky} >Năm {item.namHoc} kỳ {item.ky}</option>
                    ))}
                </select>
                <GvHome namHoc={namHoc} ky={ky}></GvHome>
            </div> */}
            < Outlet context={[tab, setTab]} />
        </div >
    )
}
