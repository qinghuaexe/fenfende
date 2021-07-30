import http from './http'

const homeSlide = (data = {}) => {
    return http({ url: '/api/homeSlideShow', data })
}

const getUserInfo = (data = {}) => {
    return http({ url: '/api/user/getUserInfo', data })
}

const countUserActive = (data = {}) => {
    return http({ url: '/api/countUserActive', data })
}

const countYesTerDayActive = (data = {}) => {
    return http({ url: '/api/countYesTerDayActive', data })
}

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
    return http({ url: '/api/pay/postPayV3', method: 'POST', data })
}

const payList = (data) => {
    return http({ url: '/api/pay/pay-info', data })
}

const pushCode = (data) => {
    return http({ url: '/api/place/createBuffer', data })
}

export default {
    homeSlide,
    countUserActive,
    countYesTerDayActive,
    getQusetList,
    miniLogin,
    commitUserInfo,
    decryptUserPhone,
    groupList,
    payTest,
    payList,
    pushCode,
    getUserInfo
}