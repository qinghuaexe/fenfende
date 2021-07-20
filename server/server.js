import http from './http'

const getQusetList = (data) => {
    return http({ url: '/api/question/getQuestionList', data })
}

const miniLogin = (data) => {
    return http({ url: '/api/userMiniAuth', data })
}

const commitUserInfo = (data) => {
    return http({ url: '/api/userMiniLogin', method: 'POST', data })
}

const decryptUserPhone = (data) => {
    return http({ url: '/api/decryptUserPhone', method: 'POST', data })
}

const groupList = (data) => {
    return http({ url: '/api/user/getMyAgency', data })
}

const payTest = (data) => {
    return http({ url: '/api/pay/postPay', method: 'POST', data })
}

export default {
    getQusetList,
    miniLogin,
    commitUserInfo,
    decryptUserPhone,
    groupList,
    payTest
}