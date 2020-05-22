// 基地址
const BASE_URL = "https://www.uinav.com/api"
function request(params){
	return new Promise((resolve,reject)=>{
		// 发送请求前，打开loading
		uni.showLoading({
			title:"加载中...",
			mask:true
		})
		uni.request({
			url:BASE_URL+params.url,
			success:(res)=>{
				let {msg,status} = res.data.meta
				if(status===200){
					resolve(res.data)
				}else{
					uni.showToast({
						title:msg
					})
				}
			},
			complete: () => {
				// 请求结束后，关闭loading
				uni.hideLoading()
			}
		})
	})
}

export default request