import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './style.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import store from './lib/store/store';
// import 'react-toastify/dist/ReactToastify.css'

const root = document.getElementById("root")
document.body.style.setProperty('background-color', 'black');
if (root)
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <ToastContainer position='top-center' theme='dark' aria-label='toast message'/>
        <App />
      </Provider>
    </StrictMode>
  )
