<template>
	<view class="item">
		<!-- 轮播图模块 -->
		<view class="swiper_mod">
			<swiper class="swiper" indicator-dots autoplay interval="3500" circular>
				<swiper-item v-for="(item,index) in goodsDetail.pics" :key="index" @click="previewImg(index)">
					<image :src="item.pics_big"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 价格 -->
		<view class="goodsPrice">
			￥<text>{{goodsDetail.goods_price||"--"}}</text>
		</view>
		<!-- 商品说明 -->
		<view class="goodsIntro_mod">
			<view class="goodsIntro">
				<text>{{goodsDetail.goods_name||""}}</text>
			</view>
			<view class="goodsCollect">
				<text class="iconfont icon-fenxiang"></text>
				<view><text>分享</text></view>
				<button open-type="share">分享</button>
			</view>
		</view>
		<!-- 快递模块 -->
		<view class="deliver">
			<text>快递：免运费</text>
		</view>
		<!-- 空白模块 -->
		<view class="white_mod"></view>
		<!-- 促销模块 -->
		<view class="sale_mod">
			<view class="sale">
				<text>促销</text>
				<text>满300减30元</text>
			</view>
			<view class="selected">
				<text>已选</text>
				<text>黑色/S/1件</text>
			</view>
		</view>
		<view class="white_mod"></view>
		<!-- 地址模块 -->
		<view class="address">
			<text>送至</text>
			<text>广东省</text>
			<text>广州市</text>
			<text>海珠区</text>
			<text class="iconfont icon-arrow"></text>
		</view>
		<view class="white_mod"></view>
		<!-- 图文介绍模块 -->
		<view class="picTextIntro">
			<view class="top">
				<view class="left" :class="{active:activeIndex === index}" @click="changeStyle(index)" v-for="(item,index) in picTextIntro"
				 :key="index">
					<text>{{item}}</text>
				</view>
			</view>
			<rich-text v-show="activeIndex === 0" :nodes="goodsDetail.goods_introduce"></rich-text>
			<text v-show="activeIndex === 1" class="goodsParams">商品参数</text>
		</view>
		<!-- 底部模块 -->
		<view class="bottom">
			<view class="service">
				<text class="iconfont icon-kefu"></text>
				<view><text>联系客服</text></view>
				<button open-type="contact">客服</button>
			</view>
			<view class="cart" @click="toCart">
				<text class="iconfont icon-gouwuchekong"></text>
				<view><text>购物车</text></view>
			</view>
			<view class="addCart" @click="addCart">
				<text>加入购物车</text>
			</view>
			<view class="nowBuy">
				<text>立即购买</text>
			</view>
		</view>
		<!-- 分享的图片 -->
		<canvas class="canvas" canvas-id="canvasId"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				picTextIntro: ['图文介绍', '规格参数'],
				activeIndex: 0, // 默认第一个有样式
				goodsDetail: {} // 商品详情
			}
		},
		//------------------------onLoad------------------------
		onLoad(options) {
			this.goodsId = options.goodsId // 商品的id
			// 调用获取商品详情的方法
			this.getGoodsDetail()
		},
		//------------------------methods------------------------
		methods: {
			// 添加active样式
			changeStyle(index) {
				this.activeIndex = index
			},
			// 获取商品详情
			async getGoodsDetail() {
				let data = await this.$request({
					url: "/api/public/v1/goods/detail?goods_id=" + this.goodsId
				})
				this.goodsDetail = data.message
				
				//-------------------------------canvas------------------------------
				// 创建canvas，返回一个CanvasContext对象
				// const CONTEXT = uni.createCanvasContext("canvasId",this)
				
			},
			// 预览轮播图图片
			previewImg(index) {
				// map 遍历原数组，每一项执行指定的函数，函数的返回值作为数组的每一项，最后返回新数组
				let urls = this.goodsDetail.pics.map(item => {
					return item.pics_big
				})
				uni.previewImage({
					current: index, // 当前预览图片的索引
					// current:urls[index], // 当前预览图片的链接
					urls,
				})
			},
			// 点击购物车，跳转到购物车页面
			toCart(){
				uni.switchTab({
					url:"../cart/cart"
				})
			},
			// 加入购物车
			addCart(){
				let goodsId = this.goodsDetail.goods_id // 商品id
				// 1.获取购物车数据
				let goodsArr= uni.getStorageSync("cart")||[]
				// 2.更新购物车数据
			let goods = goodsArr.find(item=>{
					return item.goodsId === goodsId
				})
				if(goods){
					// 商品已存在
					goods.isSelect = true
					goods.num = goods.num + 1
					goodsArr = [...new Set([goods,...goodsArr])]
				}else{
					// 商品不存在
					goodsArr.unshift({
						goodsId,
						isSelect:true,
						num:1
					})
				}
				// 提示用户添加商品成功
				uni.showToast({
					title:"添加购物车成功"
				})
				// 3.重新存储购物车数据
				uni.setStorageSync("cart",goodsArr)
			}
		},
		//------------------------onShareAppMessage ------------------------
		onShareAppMessage() {
			return {
				title: this.goodsDetail.goods_name,
				imageUrl: this.goodsDetail.pics[0].pics_big
			}
		}
	}
</script>

<style lang="less">
	.item {
		position: relative;
	}

	/* 轮播图模块样式 */
	.swiper {
		width: 100%;
		height: 650rpx;
		padding: 50rpx;
		box-sizing: border-box;

		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 价格模块样式 */
	.goodsPrice {
		margin: 32rpx 0 32rpx 16rpx;
		color: red;
		font-size: 46rpx;
		font-weight: 700;
	}

	/* 商品说明 */
	.goodsIntro_mod {
		display: flex;
		width: 100%;
		height: 86rpx;

		.goodsIntro {
			padding: 0 50rpx 0 16rpx;
			width: 80%;
			box-sizing: border-box;
			border-right: 4rpx solid #f5f5f5;

			text {
				color: #272727;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2; //2行
				-webkit-box-orient: vertical;
			}
		}

		.goodsCollect {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			color: #a8a7a8;
			position: relative;
			button{
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
	}

	/* 快递模块 */
	.deliver {
		color: #a8a7a8;
		padding-left: 16rpx;
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: border-box;
	}

	/* 空白区域 */
	.white_mod {
		height: 26rpx;
		background-color: #f5f5f5;
	}

	/* 促销模块 */
	.sale_mod {
		font-size: 36rpx;

		.sale,
		.selected {
			height: 100rpx;
			line-height: 100rpx;
		}

		.sale text:nth-child(2) {
			margin-left: 40rpx;
			color: #f00;
		}

		.selected text:nth-child(2) {
			margin-left: 40rpx;
			color: #9f9f9f;
		}
	}

	/* 地址模块 */
	.address {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;

		&>text {
			color: #9f9f9f;
		}

		&>text:nth-child(1) {
			color: #000;
		}

		&>text:nth-child(2) {
			margin-left: 40rpx;
		}

		&>text:nth-child(3) {
			margin: 0 8rpx;
		}
	}

	/* 图文介绍模块 */
	.picTextIntro {
		line-height: 100rpx;
		box-sizing: border-box;
		margin-bottom: 120rpx;

		.top {
			display: flex;
			justify-content: space-around;
			text-align: center;

			.left {
				width: 46%;
			}

			.active {
				color: #f00;
				border-bottom: 10rpx solid #f00;
			}
		}

		image {
			width: 96%;
			margin: 12rpx 0 0 16rpx;
			height: 220rpx;
		}

		.goodsParams {
			margin-left: 16rpx;
		}
	}

	/* 底部模块 */
	.bottom {
		display: flex;
		height: 120rpx;
		width: 100%;
		text-align: center;
		font-size: 30rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;

		.service{
			position: relative;
			button{
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
		.service,
		.cart {
			width: 20%;
			padding-top: 18rpx;
		}

		.addCart,
		.nowBuy {
			width: 30%;
			line-height: 120rpx;
			color: #fff;
			font-size: 36rpx;
		}

		.addCart {
			background-color: #ffb400;
		}

		.nowBuy {
			background-color: #ff2d4a;
		}
	}

	/* 字体图标样式 */
	.iconfont {
		font-size: 46rpx;
	}
</style>
