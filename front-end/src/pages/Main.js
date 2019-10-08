import React, { useEffect, useState } from 'react';
import Logo from '../assets/Logo-Tinder.svg';
import Like from '../assets/like.svg';
import Dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';
import ihateyou from '../assets/ihateyou.png';
import io from 'socket.io-client';
import api from '../services/api';
import { Link } from 'react-router-dom';
import './Main.css';

export default function Main({ match }){

    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);
    const [unmatchDev, setUnmatchDev] = useState(null);
    
    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: { 
                    user: match.params.id,
                }
            })
            setUsers(response.data);
        }
        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:8080', {
            query:{ user: match.params.id}
        });

        socket.on('match', dev =>{
            setMatchDev(dev);

        });
    },[match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:8080', {
            query:{ user: match.params.id}
        });

        socket.on('unmatch', dev =>{
            setUnmatchDev(dev);

        });
    },[match.params.id]);

    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers:{ user: match.params.id},
        })

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers:{ user: match.params.id},
        })

        setUsers(users.filter(user => user._id !== id));
    }

    return(
        <div className="main-container">
            <Link to="/">
            <img id="logo" src={Logo} alt="Tindev" />
            </ Link>
                { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li>
                            <img src={user.avatar} alt="Avatar do Usuario" />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img className="img1" src={Dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={Like} alt="Like" />
                                </button>
                            </div>
                        </li>     
                    ))}
                </ul>
                ) : (
                    <div className="empty"> Acabou :( </div>
                )} 

                { matchDev && (
                    <div className="match-container">
                        <img className="imagem" src={itsamatch} alt="It's a Match"></img>
                        <img className="avatar" src={matchDev.avatar} alt="Avatar Usuario"></img>
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        
                        <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
                    </div>
                )}

                { unmatchDev && (
                    <div className="match-container">
                        <img className="imagem" src={ihateyou} alt="I Hate You"></img>
                        <img className="avatar" src={unmatchDev.avatar} alt="Avatar Usuario"></img>
                        <strong>{unmatchDev.name}</strong>
                        <p>{unmatchDev.bio}</p>
                        
                        <button type="button" onClick={() => setUnmatchDev(null)}>Fechar</button>
                    </div>
                )}
        </div>
    )
}