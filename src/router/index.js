import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import NewsSanBox from '../pages/newsandbox'
import News from '../pages/news/News';
import Detail from '../pages/news/Detail'

export default function index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/news' element={<News />}></Route>
                <Route path='/detail/:id' element={<Detail />}></Route>
                <Route path='/*' exact element={localStorage.getItem('token') ? <NewsSanBox /> : <Navigate to='/login' />} />
            </Routes>
        </BrowserRouter>
    )
}
 