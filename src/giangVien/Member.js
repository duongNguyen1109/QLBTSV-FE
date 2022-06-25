import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from "react-router-dom";
import { MonItem } from "./monItem";
import "./gvStyle.css";
import axios from 'axios';

export default function Member(props) {
    const [member, setMember] = useState([]);

    useEffect(() => {
        const url = 'http://localhost:8080/api/svByMaLop/'+props.maLop;
        axios.get(url)
        .then(respone =>{
            setMember(respone.data);
        })
        console.log(url);
        console.log(member)
        console.log(typeof(member));
    }, [props])

    return (
        <div className='container'>
            <div className="title">
                <h3>Giảng viên</h3>
            </div>
            <MemberItem name = {props.name} id = {localStorage.getItem("id")}></MemberItem>
            <div className="title d-flex">
                <h3 className = 'flex-grow-1'>Sinh viên</h3>
                <h5 className='align-self-end'>{`${member.length} thành viên`}</h5>
            </div>
            {member.map((item) => (
                <MemberItem name={item.hoTen} id = {item.maSV}></MemberItem>
            ))}
        </div>
    )
}

function MemberItem(props){
    return(
        <div className='memberItem'>
            <span className='dot'></span>
            <span >{`${props.name} - ${props.id}`}</span>
        </div>
    )
}