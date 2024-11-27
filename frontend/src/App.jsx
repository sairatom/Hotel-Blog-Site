import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  return (
    <>
       <div className='bg-bgPrimary min-h-screen flex flex-col'>
        <Navbar/>
        <div className='flex-grow'>
          <Outlet/>
        </div>
        <Footer className='mt-auto'>Footer</Footer>
       </div>
    </>
  )
}

export default App
