import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css';

import "bootstrap/dist/css/bootstrap.css"
import "./themes/zephyr/bootstrap.min.css"


import App from './App';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);


  