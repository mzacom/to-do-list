import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Today,Inbox } from './pages/page'

const App = () => {
  return (
 <BrowserRouter>
 <Routes>
  <Route path='/' element={<Today/>}/>
 </Routes>
 </BrowserRouter>
  )
}

export default App