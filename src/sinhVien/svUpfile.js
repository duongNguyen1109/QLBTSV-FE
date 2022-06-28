import { useEffect, useState } from 'react';
import axios from 'axios';
import ExForm from './components/ExForm';
import Exs from './components/Exs';
import { useParams } from 'react-router-dom';

export default function SVUpFile() {
    let { maLop, maBaiTap } = useParams();
    const [exs, setExs] = useState([])

    const getAllExs = async () => {
        try {
            let url = process.env.REACT_APP_API_URL + "/taiLieuBTLop";
            const taiLieu = await axios.get(url, {
                params: {
                    maSV: localStorage.getItem("id"),
                    maLop: Number(maLop),
                    maBT: Number(maBaiTap)
                }
            });
            setExs(taiLieu.data);
            console.log(taiLieu);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllExs()
    }, [])
    return (
        <div className="container-backgroud">
            <ExForm />
            <div className="exs_container" >
                {exs.map((ex) => (
                    <Exs ex={ex} key={ex._id} />
                )).reverse()}
            </div>
        </div>
    )
}