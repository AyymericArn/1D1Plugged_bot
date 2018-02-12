const twit = require('twit')
const axios = require('axios')
const config = require('./config.js')
const fs = require('fs')
const he = require('he')
const T = new twit(config)

function postPlugged() {
    const b64content = fs.readFileSync('./img/plugged.jpg', { encoding: 'base64' })

    axios({
        method: 'get',
        url: config.quotes_api
    }).then((response) => {
        let quote = he.decode(response.data[0].content.replace('<p>','').replace('</p>','').replace('\n',''))
        
        T.post('media/upload', { media_data: b64content }, (err, data, response) => {
            let mediaIdStr = data.media_id_string
            let meta_params = { media_id: mediaIdStr, alt_text: { text: "Plugged." }}
            if (err) {
                console.error(err);
            } else {
                T.post('media/metadata/create', meta_params, (err, data, response) => {
                    if (!err) {
                        let params = { status: quote, media_ids: [mediaIdStr] }
                        T.post('statuses/update', params, (err, data, response) => {
                            console.log(`[${new Date}]: Succes !`)
                        })
                    } else {
                        console.error(err);
                    }
                })
            }
        })
    }).catch((err) => {
        console.error(err)
    })

}

setTimeout(() => {
    let d = new Date()
    let h = d.getHours()
    if (h === 13) {
        postPlugged()
    }
}, 3600000)