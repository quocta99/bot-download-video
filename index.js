const express = require("express");
const app = express()
const port = process.env.PORT || 3001

app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

const { getLinkVideoFacebook, getLinkVideoYoutube } = require('./service')

app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html')
})

app.get('/downloader', async (req, res) => {
    if(req?.query?.url == undefined) {
        return res.json({
            message: "Url is required"
        })
    }
    const result = req?.query?.type == 'facebook' 
        ? await getLinkVideoFacebook(req?.query?.url || '')
        : await getLinkVideoYoutube(req?.query?.url)
    return res.json({
        message: 'Loaded successfully!',
        result
    })
})

app.listen(port, () => {
    console.log(`Server running in http://localhost:${port}`);
})