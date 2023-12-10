const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

const checkDataValidation=(req,res,next)=>{
    if(!req.body.name) return res.status(400).json({message:"missing required name"})
    if(!req.body.email) return res.status(400).json({message:"missing required email"})
    next()
}
const checkEmail=async(req,res,next)=>{
    const user= await prisma.user.findFirst({
        where:{
            email:req.body.email
        }
    })
    if(!user) return next()
    return res.status(400).json({message:"user with that email already exists"})
}
app.post(`/users`,checkDataValidation,checkEmail, async (req, res) => {
  const { name, email} = req.body

  const result = await prisma.user.create({
    data: {
      name,
      email
    },
  })
  return res.status(201).json(result)
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  return res.status(200).json(users)
})

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params
  
    const user = await prisma.user
      .delete({
        where: {
          id: Number(id),
        },
      })
      if(user) return res.status(204).json("user deleted successfully")
      return res.status(404).json({message:"user not found"})
  })

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`),
)