import session from "express-session";
import MongoStore from "connect-mongo";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2


//session managment
export const middleware = session({
    name: 'nodepop-session',
    secret: 'PA(Q*=hd2Yy9{@saq$EkK!x<M>B+;ZpVHScW',
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: INACTIVITY_EXPIRATION_2_DAYS},
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/nodepop'
    })
})

//set session to be use in views
export function  useSessionInViews(req,res,next){
    res.locals.session = req.session
    next()
}

//layer of protection of database and users info

export function guard(req,res,next){
    if(!req.session.userId){
        res.redirect(`/login?redir=${req.url}`)
        return
    }
    next()
}





