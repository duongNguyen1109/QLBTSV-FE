import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
// import { Route, Routes, Navigate } from 'react-router-dom';
import { MonItem } from "./monItem";
import "./gvStyle.css";
import axios from 'axios';
import Exercise from './Exercise';
import Member from './Member';
import Group from './Group';
import { render } from '@testing-library/react';
import { Dropdown, DropdownButton, NavDropdown } from 'react-bootstrap';

export default function Classroom() {
    let { tenLop, maLop, maMon} = useParams();
    const [tab, setTab] = useOutletContext(0);
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/taiKhoan/` + localStorage.getItem("id"))
            .then(response => {
                setUserInfo(response.data[0]);
            });
        setTab(0);
    }, []);

    let history = useNavigate();
    // let logout = () => {
    //     localStorage.removeItem("user");
    //     history("/");
    // }

    const renderTab = () => {
        switch (tab) {
            case 0: return (<Exercise name={tenLop} maLop={maLop} />);
            case 1: return (<Member maLop={maLop} name={userInfo.hoTen} />);
            case 2: return (<Group maLop = {maLop} maMon = {maMon}/>);
        }
    }

    return (
        <div>
            {/* <nav class="navbar navbar-expand-sm" style={{ backgroundColor: 'rgb(32, 59, 135)' }}>
                <div class="container-fluid">
                    <a class="navbar-brand" style={{ color: 'white' }}>Lớp {tenLop.toLowerCase()}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(0)}>Bài tập</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(1)}>Thành viên</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={() => setTab(2)}>Chia nhóm</a>
                            </li>
                        </ul>
                        <NavDropdown
                            title={userInfo.hoTen}
                            menuVariant="light"
                            id="userName"
                        >
                            <NavDropdown.Item onClick={logout}>Đăng xuất</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>
            </nav> */}
            {renderTab()}
        </div>
    )
}
