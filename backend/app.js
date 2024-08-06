const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const cors = require("cors")


const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/users",userRoutes)

sequelize.sync().then(()=>{
    console.log("Database & tables synced")
}).catch(err=>{
    console.error(`Error syncing Databse:`, err)
})


const PORT = process.env.PORT || 5000 
const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

module.exports = {app,server}