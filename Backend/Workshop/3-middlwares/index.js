const express = require("express");

const app = express();

const PORT = 3000;

let users = [
  {
    userId: 1,
    userName: "John Doe",
    email: "john@gmail.com",
    password: "123456",
  },
  {
    userId: 2,
    userName: "Rayan",
    email: "rayan@gmail.com",
    password: "123456",
  },
  {
    userId: 3,
    userName: "amine",
    email: "amine@gmail.com",
    password: "123456",
  },
  {
    userId: 1,
    userName: "John Doe",
    email: "john@gmail.com",
    password: "123456",
  },
];
//body parser  
  app.use(express.json());
//get all users
app.get("/users", (req, res) => {
  return res.status(200).json(users)
});

//get user by id
app.get("/users/:userId", (req, res) => {
    const {userId} = req.params
    const user = users.find((user)=>user.userId == userId)
    if(!user) return res.status(404).json({message:"user not found"})
    return res.status(200).json(user)
  });
//delete user by id
app.delete("/users/:userId", (req, res) => {
    const {userId} = req.params
    const user = users.find((user)=>user.userId == userId)
    if(!user) return res.status(404).json({message:"user not found"})
    users = users.filter((user)=>user.userId != userId)
    return res.status(204).json({message:"user deleted successfully"})
  });

  const checkEmailMiddelware = (req,res,next)=>{
    const body = req.body
    const user = users.find((user)=>user.email == body.email)
    if(user) return res.status(400).json({message:"email already exists"})
    next()
console.log("user email checked2")
}
//create user
app.post("/users",checkEmailMiddelware,(req,res)=>{
    const {userName,email,password} = req.body
    const newUser = {
        userId:users.length + 1,
        userName,
        email,
        password
    }
    users.push(newUser)
    return res.status(201).json(newUser)
})
//update user
app.put("/users/:userId",checkEmailMiddelware,(req,res)=>{
    const {userId} = req.params
    const user = req.body
    let oldUser = users.find(user => user.userId == userId)
    if(!oldUser) return res.status(404).json({message:"user not found"})
    oldUser ={...oldUser,...user}

    oldUser ={...oldUser,...userData}
    users.map(user => {
        if(user.userId == userId) {
            user = oldUser
        }
    })
    return res.status(200).json(oldUser)
})
app.listen(PORT, () => console.log(`GDG School  listening on port ${PORT}!`));
