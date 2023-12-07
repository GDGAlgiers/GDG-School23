const express = require("express")

const app = express()

const PORT = 3000

app.get('/',(req,res)=>{
    res.send("Hello Wor")
})
app.listen(PORT, () =>
  console.log(`GDG School  listening on port ${PORT}!`)
);