const express = require("express");
const app = express()
const port = process.env.PORT || 3001

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