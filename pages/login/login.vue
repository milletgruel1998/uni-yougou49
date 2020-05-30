<template>
	<view class="login">
		<button open-type="getUserInfo" @getuserinfo="getMyInfo">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		methods:{
			getMyInfo(userInfoRes){
				let {encryptedData,iv,rawData,signature} = userInfoRes.detail
				// 通过uni.login获取到code
				uni.login({
					success:async(res)=>{
						let code = res.code
						let data = await this.$request({
							url:"/api/public/v1/users/wxlogin",
							method:"post",
							data:{
								code,
								encryptedData,
								iv,
								rawData,
								signature
							}
						})
						this.userInfo = data.message
						// 将token保存在Storage
						uni.setStorageSync("token",this.userInfo.token)
						// 保存用户信息
						uni.getStorageSync("userInfo",userInfoRes.detail.userInfo)
						// 弹出提示用户登录成功
						uni.showToast({
							title:"登录成功",
							duration:1500,
							success: () => {
								// 登录成功，返回上一页
								setTimeout(()=>{
									uni.navigateBack()
								},1500)
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>
