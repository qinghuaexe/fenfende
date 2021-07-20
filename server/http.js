const token = wx.getStorageSync('token') || ''



const baseUrl = 'https://admin.ok8809.com'

const http = options => {
    if (token) {
        options.data.token = token
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                resolve(res.data);
            },
            fail(e) {
                reject(e);
            },
        })
    })
}

export default http