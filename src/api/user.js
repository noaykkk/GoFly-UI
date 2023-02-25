//不需要获取授权的接口
import http from '../utils/http'
var qs = require('qs')
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
let resquest = "/api"

//获取用户数据
export function userDetail(params){
    return http.post(`${resquest}/user/detail`,params)
}
//获取获取用户文件列表
export function getUserFileList(params){
    return http.post(`${resquest}/user/file/list`,params)
}

// 创建文件夹
export function makeCreateDir(params){
    return http.post(`${resquest}/user/folder/create`,params)
}
//用户文件关联
export function userFileLink(params){
    return http.post(`${resquest}/user/repository/save`,params)
}
//删除文件
export function deleteFile(params){
    return http.delete(`${resquest}/user/file/delete`,params)
}


export function getUserById(params){
    return http.get(`${resquest}/user/repository/by/id`,params)
}

