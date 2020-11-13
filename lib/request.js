const http = require('http')
const https = require('https')
const qs = require('querystring')
const { parse } = require('url')

const request =  function(url, options){
    return new Promise((resolve, reject) => {
        const { method = 'GET', data, params, defaultHandle = true, ...props} = options || {}
        const {protocol, port, host, path} = parse(url)
        const extraParams = qs.stringify(params)
        const sendData = qs.stringify(data)
        const _path = params ? (path.includes('?') ? `${path}&${extraParams}`: `${path}?${extraParams}`) : ''
        const opt = {
            host,
            port: port || protocol === 'https:' ? 443 : 80,
            method,
            path: _path || path,
            ...props
        }
        const httpMod = protocol === 'https:' ? https : http
        const req = httpMod.request(opt, res => {
            let datas = '';
            res.on('data', data => {
                try {
                    datas += data; 
                } catch(e) {
                    reject('请求出错了')
                } 
            }).on('end', () => {
                if(datas) {
                    try {
                        if(defaultHandle){
                            resolve(JSON.parse(datas))
                        } else {
                            resolve(datas)
                        }
                    } catch (error) {
                        reject(error)
                    }
                } else {
                    resolve('返回为空')
                }
            })
        })
        req.on('error', e => {
            reject(e)
        })
        data && req.write(sendData)
        req.end()
    })
}

module.exports = request