import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email: "" , password:"" , cpassword:""})
    let history = useHistory();

    const handleSubmit = async (e)=>{
        e.preventDefault();
const {name,email,password} = credentials

          //API call
    const response = await fetch(
        "http://localhost:5000/api/auth/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        
          },
          body: JSON.stringify({name, email ,password}),
        });
        const json = await response.json();
        
        console.log(json);
        //below if else for if credentials are true save the token in local storage and redirect the user to home
        if(json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authToken); 
            history.push("/");
            props.showAlert("Account Created successfully", "success")

        }
        else{
           props.showAlert("Invalid Details", "danger")
        }
        
        
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };
    return (
      <div className="container mt-2">
      <h2 className= "my-3">Create an account to use iCloud Notebook</h2>
        <form  onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="name" className="form-control" id="name"   onChange={onChange} name="name" aria-describedby="emailHelp"/ >
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email"   onChange={onChange} name="email" aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control"   onChange={onChange} name="password" id="password"    minLength={5} required / >
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Confirm Password</label>
          <input type="password" className="form-control"   onChange={onChange} name="cpassword" id="cpassword" minLength={5} required/>
        </div>
        
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
      </div>
    )
}

export default Signup
