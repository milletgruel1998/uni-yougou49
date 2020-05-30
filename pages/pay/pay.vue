<template>
	<view>
		<view class="address-wrapper" @click="getAddress" >
			<view class="address" v-if="address.userName">
				<view class="receiver">
					<view class="name">收货人：{{address.userName}}</view>
					<view class="phone-num">{{address.telNumber}}</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				<view class="address-txt">收货地址：{{address.provinceName+address.cityName+address.countyName+address.detailInfo}}</view>
			</view>
			<!-- 选择地址 -->
			<view class="choose-address" v-else>
				<view>请选择地址</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			<view class="flower">
				<image src="/static/images/cart_border@2x.png">
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goodsShow-body" v-for="(item,index) in newMergeCartInfo" :key="index">
				<view class="goodsInfor">
					<view>
						<image :src="item.goods_small_logo"></image>
					</view>
					<!-- 文字 -->
					<view class="information">
						<text>{{item.goods_name}}</text>
						<view>
							<text>￥<text class="number">{{item.goods_price}}</text>.00</text>
							<text>×{{item.num}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-fixed" @click="pay">
			微信支付({{goodsTotalPrice}}.00)
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: {}, // 通讯地址
				mergeCartInfo: [], // Storage和服务器返回的数据----合并后的数据
				newMergeCartInfo: [], // Storage和服务器返回的数据----合并后的数据 并且是选中状态下
			}
		},
		onLoad() {
			// 获取localStorage中的购物车
			this.localCartInfo = uni.getStorageSync("cart") || []
			// 如果Storage中 的cart是空的话，无须发送请求
			if (this.localCartInfo.length === 0) {
				return
			}
			// 遍历cart数组，得到商品id
			let goodsIdArr = this.localCartInfo.map(item => {
				return item.goodsId
			})
			let goodsIdStr = goodsIdArr.join(',')
			// 调用获取购物车商品信息的方法
			this.getCartGoodsInfo(goodsIdStr)
		},
		methods: {
			// 获取购物车商品信息
			async getCartGoodsInfo(goodsId) {
				let data = await this.$request({
					url: '/api/public/v1/goods/goodslist?goods_ids=' + goodsId
				})
				let serveCartGoodsInfo = data.message
				this.mergeCartInfo = this.localCartInfo.map(item => {
					// newData 返回在服务器返回的数据中与本地购物车中id一样的数据
					let newData = serveCartGoodsInfo.find(goods => {
						return goods.goods_id === item.goodsId
					})
					return { ...item,...newData}
				})
				this.newMergeCartInfo = this.mergeCartInfo.filter(item => {
					return item.isSelect
				})
			},
			// 发起授权,获取用户通讯地址
			getAddress() {
				// 发起授权弹窗
				uni.authorize({
					scope: "scope.address",
					success: () => {
						// 调用授权接口
						uni.chooseAddress({
							success: (res) => {
								this.address = res
								// 并将通讯地址存到Storage中
								uni.setStorageSync("address", res)
							}
						})
					},
					fail: () => {
						// 提示用户需要授权
						uni.showModal({
							title: "提示",
							content: "请在设置中允许通讯地址",
							// 打开小程序授权的设置
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({})
								}
							}
						})
					}
				})
			},
			// 点击支付
			pay() {
				// 先判断是否有收货地址
				if (!this.address.userName) {
					uni.showModal({
						title: "提示",
						content: "请先填写收货地址",
						showCancel: false
					})
					return
				}
				// 如果没有购物商品，提示
				if (!this.newMergeCartInfo.length) {
					uni.showModal({
						title: "提示",
						content: "请先选择商品",
						showCancel: false
					})
					return
				}
				// 如果用户未登录，提示
				let token = uni.getStorageSync('token')
				if (!token) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return
				}
				// 调用 创建订单 的方法
				this.createOrder()
			},
			// 创建订单
			async createOrder() {
			let data = await this.$request({
					url: "/api/public/v1/my/orders/create",
					method: "post",
					header: {
						Authorization: uni.getStorageSync("token")
					},
					data: {
						order_price: this.goodsTotalPrice,
						consignee_addr: this.getAddressInfo(),
						goods:this.getOrderArr()
					}
				})
				// 将订单号存起来
				this.orderNumber = data.message.order_number
				// 调用 获取支付参数 的方法
				this.getPayParams()
			},
			// 收货地址
			getAddressInfo(){
				return this.address.provinceName+this.address.cityName+this.address.countyName+this.address.detailInfo+' '+this.address.userName+' '+this.address.telNumber
			},
			// 订单数组
			getOrderArr(){
				this.newMergeCartInfo.map(item=>{
					return {
						goods_id:item.goods_id,
						goods_number:item.num,
						goods_price:item.goods_price
					}
				})
			},
			// 获取支付参数
		async	getPayParams(){
			let data = await this.$request({
					url:"/api/public/v1/my/orders/req_unifiedorder",
					method:"post",
					header:{
						Authorization:uni.getStorageSync("token")
					},
					data:{
						order_number:this.orderNumber
					}
				})
				// 通过支付参数（data）唤起微信支付
				uni.requestPayment({
					...data.message.pay,
					success: (res) => {
						uni.showModal({
							title:"提示",
							contnet:"微信支付成功",
							showCancel:false,
							success: (res) => {
								if(res.confirm){
									// 支付成功后，跳转到订单结果页
									uni.navigateTo({
										url:"pages/order_result/order_result"
									})
								}
							}
						})
					}
				})
			}
		},
		computed: {
			// 计算商品价格
			goodsTotalPrice() {
				return this.newMergeCartInfo.reduce((sum, item) => {
					return sum + (item.isSelect ? (item.goods_price * item.num) : 0)
				}, 0)
			}
		}
	}
</script>

<style lang="less">
	.address-wrapper {
		background-color: #fff;
	}

	.address {
		display: flex;
		flex-direction: column;
		padding: 44rpx 30rpx 48rpx 20rpx;

		.receiver {
			display: flex;
			justify-content: space-between;
			margin-bottom: 50rpx;
			position: relative;

			.phone-num {
				margin-right: 40rpx;
			}

			.icon-arrow-right {
				position: absolute;
				top: 8rpx;
				right: 0;
				color: #999;
			}
		}
	}

	.choose-address {
		display: flex;
		padding: 44rpx 30rpx 48rpx 20rpx;
		justify-content: space-between;

		.icon-arrow-right {
			color: #999;
		}
	}

	.flower {
		image {
			height: 16rpx;
			width: 100%;
			display: block;
		}
	}

	.goods-item {
		height: 206rpx;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		display: flex;
		box-sizing: border-box;
		align-items: center;

		image {
			width: 160rpx;
			height: 160rpx;
			margin-left: 30rpx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin: 0 20rpx 0 18rpx;

			.btm {
				display: flex;
				margin-top: 40rpx;
				justify-content: space-between;

				.price {
					color: #eb4450;

					>text {
						font-size: 24px;
					}
				}
			}
		}
	}

	.goods-list {
		position: absolute;
		bottom: 98rpx;
		top: 243rpx;
		width: 100%;
		overflow: auto;
		padding-bottom: 60rpx;
		background-color: #f4f4f4;

		.goodsShow-body {
			height: 200rpx;
			display: flex;
			margin-bottom: 100rpx;

			.goodsInfor {
				display: flex;
				flex: 1;
				border-bottom: 2rpx solid #ddd;
				box-sizing: border-box;
				padding-right: 16rpx;

				image {
					margin: 10rpx 16rpx 0 0;
					width: 180rpx;
					height: 180rpx;
				}

				.information {
					>text {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2; //2行
						-webkit-box-orient: vertical;
						margin-top: 16rpx;
					}

					>view {
						position: relative;
						margin-top: 30rpx;

						>text:nth-child(1) {
							color: #f00;

							.number {
								font-size: 50rpx;
							}
						}

						>text:nth-child(2) {
							display: inline-block;
							width: 60rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							position: absolute;
							top: 0;
							right: 96rpx;
						}
					}
				}
			}
		}
	}

	.bottom-fixed {
		position: absolute;
		height: 98rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #1aad19;
		color: #fff;
		line-height: 98rpx;
		text-align: center;
	}
</style>
