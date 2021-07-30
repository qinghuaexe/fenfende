export const formatTime = (time, type) => {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (type === 1) {
        let h = hour > 9 ? hour : `0${hour}`
        let m = minute > 9 ? minute : `0${minute}`
        let s = second > 9 ? second : `0${second}`
        return `${h}:${m}  ${s}秒`
    } else {
        return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`

    }
}

export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

export function wait(time) {
    return new Promise((resolve, reject) => setTimeout(resolve, time))
}