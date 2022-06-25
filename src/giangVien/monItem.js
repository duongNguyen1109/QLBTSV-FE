import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

export default function MonItem(props) {
    let history = useNavigate();
    let handleLop = (tenLop, maLop,maMon) =>{
        history(`/giangvien/lop/${tenLop}/${maLop}/${maMon}`);
    }
        return (
            <div class="card" style={{height: '300px', width: '300px', margin:"20px"}}>
                <div class="card-header">{props.name}</div>
                <div class="card-body">
                    {props.lopList.map((item)=>(
                        <button onClick={()=> handleLop(item.tenLop, item.maLop, props.maMon)} className='btn btn-outline-primary' style={{margin: '10px'}}>{item.tenLop}</button>
                    )
                    )}
                </div>
            </div>
        )
}