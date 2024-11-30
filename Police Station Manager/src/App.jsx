import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'

function App() {
  return (
    <div className='body'>
    <Header></Header>
    <div className="content">
            <Sidebar></Sidebar>
            <div className='main-content'>
              
            </div>
          </div>
    </div>
  )
}

export default App
