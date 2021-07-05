import http from './http'

const getList = () => {
  return http({ url: '/api/getQuestionList' })
}

export default {
  getList
}