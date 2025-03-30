import path from 'node:path'
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import connectMongoose from './lib/mongooseConnection'

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