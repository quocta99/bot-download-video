const axios = require('axios')
const FormData = require('form-data')

const getLinkVideoFacebook = async (url) => {
    const response = await axios.post('https://www.getfvid.com/downloader', {url}, {
        headers: {
            referer: 'https://www.getfvid.com/'
        }
    })

    return await parseUrlLink(response.data)
} 

const getLinkVideoYoutube = async (url) => {
    let data = new FormData();
    data.append('q', url);
    data.append('vt', ' home');

    const response = await axios.post('https://yt1s.com/api/ajaxSearch/index', data, {
        headers: {...data.getHeaders()}
    })

    const result = {
        title: response.data.title,
        links: {
            mp4: {
                360: await convertLinkYoutube(response.data.vid, response.data.links.mp4['18'].k),
                720: await convertLinkYoutube(response.data.vid, response.data.links.mp4['22'].k),
            },
            mp3: {
                mp3128: await convertLinkYoutube(response.data.vid, response.data.links.mp3['mp3128'].k)
            }
        }
    }

    return result
}

const convertLinkYoutube = async (vid, k) => {
    let data = new FormData()
    data.append('vid', vid)
    data.append('k', k)

    const response = await axios.post('https://yt1s.com/api/ajaxConvert/convert', data, {
        headers: {...data.getHeaders()}
    })

    const {fquality, dlink, ftype } = response.data

    return {fquality, dlink, ftype}
}

const parseUrlLink = (content) => {
    const regex = /<a href="(.*?)" .*? class="btn btn-download" .*?>(.*?)<\/a>/gm;
    let result = [...content.matchAll(regex)]

    if(result.length) {
        result = result.map(el => {
            return {
                label: el[2].replace(/(<([^>]+)>)/gi, ""),
                url: el[1]
            }
        })
    }
    return result
}

module.exports = {
    getLinkVideoFacebook,
    getLinkVideoYoutube
}