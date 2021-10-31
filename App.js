import './App.css';
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NoteState from './context/notes/Notestate';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import  {useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message,type)=>{
    setAlert({
    msg: message,
    type: type
  })
  setTimeout(() => {
    setAlert(null)
  }, 1500);
  }
  return (
    <>
    <NoteState>
      <Router>
      <Navbar/>
      <Alert alert={alert} />
      <div className="container">

      <Switch>
          <Route exact path="/">
            <Home showAlert={showAlert}/>
          </Route>
          <Route path="/about">
            <About />
          </Route>
          
          <Route path="/login">
            <Login showAlert={showAlert}/>
          </Route>
          
          <Route path="/signup">
            <Signup showAlert={showAlert}/>
          </Route>
          
        </Switch>
        </div>
      </Router>
      </NoteState>
      </>
  );
}

export default App;
