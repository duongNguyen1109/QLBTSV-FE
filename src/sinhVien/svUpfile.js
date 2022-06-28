import { useEffect, useState } from 'react';
import axios from 'axios';
import SongForm from './components/SongForm';
import Songs from './components/Songs';
import { useParams } from 'react-router-dom';

export default function SVUpFile() {
    let { maLop, maBaiTap } = useParams();
    const [songs, setSongs] = useState([])

    const getAllSongs = async () => {
        try {
            let url = process.env.REACT_APP_API_URL + "/taiLieuBTLop";
            const taiLieu = await axios.get(url, {
                params: {
                    maSV: localStorage.getItem("id"),
                    maLop: Number(maLop),
                    maBT: Number(maBaiTap)
                }
            });
            setSongs(taiLieu.data);
            console.log(taiLieu);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllSongs()
    }, [])
    return (
        <div className="container-backgroud">
            <SongForm />
            <div className="songs_container" >
                {songs.map((song) => (
                    <Songs song={song} key={song._id} />
                )).reverse()}
            </div>
        </div>
    )
}