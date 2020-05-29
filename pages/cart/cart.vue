<template>
	<view class="cart">
		<!-- 收货人地址模块 -->
		<view class="address-mod">
			<view class="consignee">
				<text>收货人：<text>小米粥</text></text>
				<text>13535337057</text>
				<text class="iconfont icon-arrow"></text>
			</view>
			<view class="address">收货地址：<text>广东省广州市天河区珠吉</text></view>
		</view>
		<view class="headerImg">
			<image src="../../static/images/cart_border@2x.png"></image>
			<view></view>
		</view>
		<!-- 优购生活馆头部 -->
		<view class="goodsShow-header">
			<text class="iconfont icon-shop"></text>
			<text>优购生活馆</text>
		</view>
		<!-- 优购生活馆主体 -->
		<view class="goodsShow-body" v-for="(item,index) in localCartInfo" :key="index" @click="toGoodsDetail(item.goods_id)">
			<view class="icon" @click.stop="changeIcon(item)">
				<text class="iconfont " :class="item.isSelect?'icon-checked':'icon-unchecked'"></text>
			</view>
			<view class="goodsInfor">
				<view>
					<image v-if="item.goods_small_logo" :src="item.goods_small_logo"></image>
				</view>
				<!-- 文字 -->
				<view class="information">
					<text>{{item.goods_name}}</text>
					<view>
						<text>￥<text class="number">{{item.goods_price}}</text>.00</text>
						<button @click.stop="subGoods(item,index)">-</button>
						<text>{{item.num}}</text>
						<button @click.stop="addGoods(item)" :disabled="item.num === 15">+</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部结算 -->
		<view class="pay-mod">
			<!-- 全选 -->
			<view class="icon-bottom" @click="allSelect">
				<text class="iconfont " :class="isAllSelect?'icon-checked':'icon-unchecked'"></text>
				<text>全选</text>
			</view>
			<!-- 合计 -->
			<view class="totalNum">
				<view class="totalNum-top">
					<text>合计：</text>
					<text>￥<text>{{goodsTotalPrice}}</text>.00</text>
				</view>
				<view class="totalNum-bottom">
					<text>包含运费</text>
				</view>
			</view>
			<view class="payMoney">
				<text>结算（<text>{{goodsTotalNum}}</text>）</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		//----------------------data----------------------
		data() {
			return {
				serveCartGoodsInfo: [], // 从服务器返回的购物车商品信息
				localCartInfo: [] // localStorage中的购物车信息
			}
		},
		//----------------------onShow----------------------
		onShow() {
			// 获取localStorage中的购物车
			this.localCartInfo = uni.getStorageSync("cart") || []
			// 遍历cart数组，得到商品id
			let goodsIdArr = this.localCartInfo.map(item => {
				return item.goodsId
			})
			let goodsIdStr = goodsIdArr.join(',')
			// 调用获取购物车商品信息的方法
			this.getCartGoodsInfo(goodsIdStr)
		},
		//----------------------methods----------------------
		methods: {
			// 获取购物车商品信息
			async getCartGoodsInfo(goodsId) {
				let data = await this.$request({
					url: '/api/public/v1/goods/goodslist?goods_ids=' + goodsId
				})
				this.serveCartGoodsInfo = data.message
				this.localCartInfo = this.localCartInfo.map(item => {
					// newData 返回在服务器返回的数据中与本地购物车中id一样的数据
					let newData = this.serveCartGoodsInfo.find(goods => {
						return goods.goods_id === item.goodsId
					})
					return { ...item,
						...newData
					}
				})
			},
			// 点击商品，切换选中/未选中的图标
			changeIcon(item) {
				item.isSelect = !item.isSelect
			},
			// 减少商品数量
			subGoods(item, index) {
				if (item.num > 1) {
					item.num = item.num - 1
				} else {
					uni.showModal({
						title: "删除",
						content: "您确定要删除这件商品吗",
						success: (res) => {
							if (res.confirm) {
								this.localCartInfo.splice(index, 1)
							}
						}
					})
				}
			},
			// 增加商品数量
			addGoods(item) {
				item.num = item.num + 1
			},
			// 全选按钮 改变
			allSelect() {
				this.isAllSelect = !this.isAllSelect
			},
			// 点击商品，跳转到商品详情
			toGoodsDetail(goodsId) {
				uni.navigateTo({
					url: "/pages/item/item?goodsId=" + goodsId
				})
			}
		},
		//----------------------computed----------------------
		computed: {
			isAllSelect: {
				get() {
					// selectStatus 商品选中状态的数组
					// let selectStatus = this.localCartInfo.map(item=>{
					// 	return item.isSelect
					// })
					// // for of 与forEach很相似，但是for of 可以响应break、return、continue
					// for(let status of selectStatus){
					// 	if(status === false){
					// 		return false
					// 	}
					// }
					// return true
					// this.localCartInfo中的每一项的isSelect如果都返回true的话。every最终返回true
					return this.localCartInfo.every(item => {
						return item.isSelect
					})
				},
				set(selectStatus) {
					this.localCartInfo.forEach(item => {
						item.isSelect = selectStatus
					})
				}
			},
			// 计算商品总数
			goodsTotalNum() {
				return this.localCartInfo.reduce((sum, item) => {
					return sum + item.num
				}, 0)
			},
			// 计算商品价格
			goodsTotalPrice() {
				return this.localCartInfo.reduce((sum, item) => {
						return sum + (item.isSelect?(item.goods_price * item.num):0)
				}, 0)
			}
		}
	}
</script>

<style scoped lang="less">
	/* 地址模块样式 */
	.address-mod {
		margin-top: 20rpx;
		padding: 0 16rpx;
		box-sizing: border-box;

		.consignee,
		.address {
			height: 88rpx;
			line-height: 88rpx;
		}

		.consignee {
			>text:nth-child(2) {
				margin-left: 205rpx;
			}

			>text:nth-child(3) {
				margin-left: 40rpx;
			}
		}
	}

	/* 地址栏下面的图片 */
	.headerImg {
		image {
			width: 100%;
			height: 12rpx;
		}

		>view {
			width: 100%;
			height: 18rpx;
			background-color: #f4f4f4;
		}
	}

	/* 优购生活馆头部 */

	.goodsShow-header {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		padding-left: 32rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;

		>text:nth-child(1) {
			color: #999;
			margin-right: 18rpx;
			font-size: 40rpx;
		}

		>text:nth-child(2) {
			font-size: 40rpx;
		}
	}

	/* 优购生活馆主体 */
	.goodsShow-body {
		height: 200rpx;
		display: flex;
		margin-bottom: 100rpx;

		.icon {
			width: 100rpx;
			text-align: center;

			>text {
				font-size: 50rpx;
				color: #eb4450;
				line-height: 200rpx;
			}
		}

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

					>button:nth-child(2) {
						width: 60rpx;
						height: 50rpx;
						border: 2rpx solid #666;
						box-sizing: border-box;
						position: absolute;
						top: 0;
						right: 158rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					>text:nth-child(3) {
						display: inline-block;
						width: 60rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						position: absolute;
						top: 0;
						right: 96rpx;
					}

					>button:nth-child(4) {
						width: 60rpx;
						height: 50rpx;
						border: 2rpx solid #666;
						box-sizing: border-box;
						position: absolute;
						top: 0;
						right: 35rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}

	/* 底部结算模块样式 */
	.pay-mod {
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 98rpx;
		width: 100%;
		background-color: #fff;
		border: 2rpx solid #b8b8b8;
		box-sizing: border-box;

		/* 全选 */
		.icon-bottom {
			width: 200rpx;
			height: 98rpx;
			line-height: 98rpx;

			>text:nth-child(1) {
				font-size: 50rpx;
				color: #eb4450;
				margin: 0 20rpx 0 16rpx;
			}

			>text:nth-child(2) {
				font-size: 40rpx;
			}
		}

		/* 合计 */
		.totalNum {
			flex: 1;

			.totalNum-top {
				>text:nth-child(1) {
					font-size: 36rpx;
				}

				>text:nth-child(2) {
					font-size: 28rpx;
					color: #f00;

					text {
						font-size: 36rpx;
					}
				}
			}

			.totalNum-bottom {
				text {
					color: #999;
				}
			}
		}

		/* 结算 */
		.payMoney {
			width: 230rpx;
			height: 98rpx;
			line-height: 98rpx;
			background-color: #eb4450;
			color: #fff;
			text-align: center;
		}
	}
</style>
