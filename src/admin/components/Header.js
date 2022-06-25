import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../style/Header.css';
import axios from "axios";
import { NavDropdown } from "react-bootstrap";

const Header = () => {

    const [activeTab, setActiveTab] = useState("Home");
    const location = useLocation();
    const [userInfo, setUserInfo] = useState("");

    let history = useNavigate();
    let logout = () => {
        //localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        history("/");
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/api/taiKhoan/` + localStorage.getItem("id"))
            .then(response => {
                setUserInfo(response.data[0]);
            });
    }, [])

    useEffect(() => {
        if (location.pathname === '/admin') {
            setActiveTab("Home");
        } else if (location.pathname === 'admin/taiKhoan') {
            setActiveTab("TaiKhoan");
        } else if (location.pathname === 'admin/mon') {
            setActiveTab("Mon");
        } else if (location.pathname === 'admin/lop') {
            setActiveTab("Lop");
        }
    }, [location]);

    return (
        <div className="header">
            <p className="logo">Admin</p>
            <div className="header-right">
                <Link to="/admin">
                    <p className={`header-item ${activeTab === "Home" ? "active" : ""}`} onClick={() => setActiveTab("Home")} >Trang chủ</p>
                </Link>
                <Link to="taiKhoan">
                    <p className={`header-item ${activeTab === "TaiKhoan" ? "active" : ""}`} onClick={() => setActiveTab("TaiKhoan")}>Tài khoản</p>
                </Link>
                <Link to="mon">
                    <p className={`header-item ${activeTab === "Mon" ? "active" : ""}`} onClick={() => setActiveTab("Mon")} >Môn</p>
                </Link>
                <Link to="lop">
                    <p className={`header-item ${activeTab === "Lop" ? "active" : ""}`} onClick={() => setActiveTab("Lop")} >Lớp</p>
                </Link>
                <NavDropdown
                    title={userInfo.hoTen}
                    menuVariant="light"
                    id="admin"
                    className = 'header-item'
                    color="dark"
                >
                    <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
    )
}

export default Header