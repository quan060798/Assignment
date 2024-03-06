import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './assets/pages/AuthPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilValue } from 'recoil';
import userAtom from './assets/atoms/userAtom';
import HomePage from './assets/pages/HomePage';

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
    
  )
}

export default App
