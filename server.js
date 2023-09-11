const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())
// connection database
const database = require('./confige')
database()


const apiError = require('./utilis/apiError')
const globalError = require('./middlewares/errorMidlleware')

app.use(cors({
    origin: "*"
}))

//middleware 
app.use('/api/auth', require('./routers/authRouter'))
app.use('/api/users', require('./routers/userRouter'))
app.use('/api/categories',require('./routers/categoryRouter'))
app.use('/api/subCategories',require('./routers/subCategoryRouter'))
app.use('/api/brands',require('./routers/brandRouter'))
app.use('/api/password',require('./routers/passwordRouter'))



app.use('*', (req, res, next) => {
    //const err = new Error(`Can't find this route : ${req.originalUrl}`)
    next(new apiError(`Can't find this route : ${req.originalUrl}`, 400))
})

app.use(globalError)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server listening on ${PORT}`))