<template>
	<view class="search_list">
		<!-- 搜索框 -->
		<view class="search_box">
			<icon type="search" size="16" color="#bbb" />
			<input type="text" v-model="keyWord" confirm-type="search" @confirm="searchGoods" />
		</view>
		<!-- 过滤栏 -->
		<view class="filter_box">
			<view class="filterName" :class="{active:filterIndex === index}" @click="changeStyle(index)" v-for="(item,index) in filterList"
			 :key="index">{{item}}</view>
		</view>
		<!-- 商品介绍模块 -->
		<view class="goodsIntro_mod" v-for="(item,index) in goodsList" :key="index">
			<!-- 商品图片 -->
			<view class="goodsImg">
				<image :src="item.goods_big_logo"></image>
			</view>
			<!-- 商品说明 -->
			<view class="goodsIntro">
				<text>{{item.goods_name}}</text>
				<view class="goodsPrice">￥<text class="priceNum">{{item.goods_price}}</text>.00</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		//-------------------------data-------------------------
		data() {
			return {
				filterIndex: 0, // 在过滤栏中，默认选中第一个
				filterList: ['综合', '销量', '价格'],
				goodsList: [], // 商品列表
				keyWord: '', // 关键字
				goodsPage: 1, // 默认加载第一页数据
				isRequesting:false // 默认不发送请求
			}
		},
		//-------------------------onload-------------------------
		onLoad(options) {
			this.keyWord = options.catName
			// 调用获取商品列表的方法
			this.getGoodsList(options.catName)
		},
		//-------------------------onPullDownRefresh-------------------------
		// 监听用户下拉动作
		onPullDownRefresh() {
			this.goodsList = []
			this.goodsPage = 1
			this.getGoodsList() // 请求页面数据
		},
		//-------------------------onReachBottom	-------------------------
		// 监听用户上拉触底动作
		onReachBottom() {
			this.goodsPage++
			this.getGoodsList()
		},
		//-------------------------methods-------------------------
		methods: {
			// 改变过滤栏的字体样式
			changeStyle(index) {
				this.filterIndex = index
			},
			async getGoodsList() {
				// 调用此函数前，应该先判断isRequesting的状态
				if(this.isRequesting){
					return
				}
				// 发送请求前，将isRequesting设置为true,表示正在请求中
				this.isRequesting = true
				const pageCount = 6 // 页容量
				let data = await this.$request({
					url: "/api/public/v1/goods/search",
					data: {
						query: this.keyWord,
						pagenum: this.goodsPage,
						pagesize: pageCount
					},
					showLoading: false
				})
				this.goodsList = [...this.goodsList, ...data.message.goods]
				// 请求结束后，将isRequesting设置为false,表示请求结束
				this.isRequesting = false
			},
			// 点击键盘右下角的搜索按钮，触发的点击事件
			searchGoods() {
				this.getGoodsList()
			}
		}
	}
</script>

<style scoped lang="less">
	.search_list {

		/* 搜索框 */
		.search_box {
			height: 100rpx;
			background-color: #efefef;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
			position: relative;

			input {
				display: inline-block;
				height: 60rpx;
				width: 100%;
				background-color: #fff;
				padding-left: 85rpx;
			}

			icon {
				position: absolute;
				top: 35rpx;
				left: 55rpx;
			}
		}

		/* 过滤栏 */
		.filter_box {
			height: 100rpx;
			display: flex;
			justify-content: space-around;
			line-height: 100rpx;

			.filterName {
				padding: 0 30rpx;
			}

			.active {
				color: #ff5c73;
			}
		}

		/* 商品介绍模块 */
		.goodsIntro_mod {
			height: 320rpx;
			border-top: 1rpx solid #f3f3f3;
			box-sizing: border-box;
			display: flex;

			/* 商品图片 */
			.goodsImg {
				image {
					width: 260rpx;
					height: 260rpx;
					margin-top: 30rpx;
				}
			}

			/* 商品说明 */
			.goodsIntro {
				margin-top: 30rpx;

				>text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; //2行
					-webkit-box-orient: vertical;
				}

				.goodsPrice {
					color: #f00;
					margin-top: 108rpx;

					.priceNum {
						font-size: 56rpx;
					}
				}
			}
		}
	}
</style>
