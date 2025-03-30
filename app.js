import path from 'node:path'
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/connectMongoose.js'
import * as homeController from './controllers/homeController.js'
import * as sessionManager from './lib/sessionManager.js'
import * as loginController from './controllers/loginController.js'


await connectMongoose()
console.log('connected to mongoDB')


const app = express()

app.set('views','views')
app.set('view engine', 'html')
app.engine('html', (await import ('ejs')).__express)

app.locals.appName = 'NodePop'


app.use(logger('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(import.meta.dirname,'public')))


/**
 * application rutes
*/
app.use(sessionManager.middleware)
app.use(sessionManager.useSessionInViews)
app.get('/',homeController.index)
app.get('/login',loginController.index)
app.post('/login',loginController.loginUserPost)
app.get('/logout',loginController.logout)
app.get('/products/new')
app.post('/products/new')
app.get('/products/delete/:productId')


app.use((err,req,res,next) => {

    if (err.array){
        err.message = 'invalid request : ' + err.array()
        .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
        .join(',')

        err.status = 422
    }
    
    res.status(err.status || 500)
    // res.send('Ocurrio un error: ' + err.message) 

    //set locals, including error informartion in development 
    res.locals.message = err.message
    res.locals.error = process.env.NODEAPP_ENV === 'development' ? err : {}
    res.render('error')
})

export default app