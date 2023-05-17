import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Auth, { EAuthType } from './routes/Auth/Auth';
import Home from './routes/Home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/register',
    element: <Auth authType={EAuthType.Register} />,
  },
  {
    path: '/login',
    element: <Auth authType={EAuthType.Login} />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
