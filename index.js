require('dotenv').config()

const express = require('express')
const fs = require('fs')
const app = express()
const database = require('./public/index.json')

app.use('/public', express.static('./public'))

app.use(express.json())

app.post('/status', (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const isExist = database.find(data => {
            return data.username === username
        })

        if (!isExist) {
            return res.status(404).json({
                message: 'user tidak ditemukan'
            })
        }

        if (isExist.password !== password) {
            return res.status(401).json({
                message: 'wrong password'
            })
        }

        username.map(user => {
            console.log(user)
        })

        return res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        throw {
            message: error.message,
            code: 500
        }
    }
})

app.get('/hello', (_, res) => {
    return res.status(200).send('Hello')
})

app.get('/json', (_, res) => {
    const jsonData = fs.readFileSync('./public/index.json')
    const data = JSON.parse(jsonData.toString())

    return res.status(200).json(data)
})

app.get('/html', (_, res) => {
    const indexData = fs.readFileSync('./public/index.html')
    
    fs.readFile('./public/index.html', (err, file) => {
        console.log(file.toString())
    })
    console.log('ini akan tereksekusi duluan')

    const data = indexData.toString()

    return res.status(200).contentType('html').send(data)
})

app.use((err, req, res, next) => {
    const code = err.code
    let message = err.message

    const mode = process.env.MODE

    if (mode === 'production') {
        message = 'internal server error'
    }

    return res.status(code).json({
        message: message
    })
})

app.listen(1234)