<template>
	<view class="search_list">
		<!-- 搜索框 -->
		<searchBar :keyword="keyword" @search="searchGoodsDetail" />
		<!-- <view class="search_box">
			<icon type="search" size="16" color="#bbb" />
			<input type="text" v-model="keyword" confirm-type="search" @confirm="searchGoods" />
		</view> -->
		<!-- 过滤栏 -->
		<view class="filter_box">
			<view class="filterName" :class="{active:filterIndex === index}" @click="changeStyle(index)" v-for="(item,index) in filterList"
			 :key="index">{{item}}</view>
		</view>
		<!-- 商品介绍模块 -->
		<view class="goodsIntro_box">
			<view class="goodsIntro_mod" v-for="(item,index) in goodsList" :key="index" @click="toGoodsDetail(item.goods_id)">
				<!-- 商品图片 -->
				<view class="goodsImg">
					<image :src="item.goods_small_logo"></image>
				</view>
				<!-- 商品说明 -->
				<view class="goodsIntro">
					<text>{{item.goods_name}}</text>
					<view class="goodsPrice">￥<text class="priceNum">{{item.goods_price}}</text>.00</view>
				</view>
			</view>
		</view>
		<view class="lastPageTip" v-show="isLastPage">
			<text>------我可不是面团捏的，我也有底线------</text>
		</view>
	</view>
</template>

<script>
	import searchBar from '../../components/searchBar'
	export default {
		components:{
			searchBar
		},
		//-------------------------data-------------------------
		data() {
			return {
				filterIndex: 0, // 在过滤栏中，默认选中第一个
				filterList: ['综合', '销量', '价格'],
				goodsList: [], // 商品列表
				keyword: '', // 关键字
				isLastPage: false // 是否是最后一页数据
			}
		},
		//-------------------------onload-------------------------
		onLoad(options) {
			this.goodsPage = 1 // 默认加载第一页数据
			this.isRequesting = false, // 默认不发送请求
			this.keyword = options.catName
			// 调用获取商品列表的方法
			this.getGoodsList(options.catName)
		},
		//-------------------------onPullDownRefresh-------------------------
		// 监听用户下拉动作
		onPullDownRefresh() {
			// 每次点击右下角搜索的时候，需要清空商品列表
			this.goodsList = []
			// 每次点击右下角搜索的时候，需要将页码重置为1
			this.goodsPage = 1
			// 每次点击右下角搜索的时候，需要将isLastPage重置为false
			this.isLastPage = false
			// 发送请求
			this.getGoodsList(false)
		},
		//-------------------------onReachBottom	-------------------------
		// 监听用户上拉触底动作
		onReachBottom() {
			if (this.isLastPage) {
				return
			}
			this.goodsPage++
			this.getGoodsList()
		},
		//-------------------------methods-------------------------
		methods: {
			// 改变过滤栏的字体样式
			changeStyle(index) {
				this.filterIndex = index
			},
			async getGoodsList(isShowLoading) {
				// 调用此函数前，应该先判断isRequesting的状态或是否为最后一页数据
				if (this.isRequesting) {
					return
				}
				// 发送请求前，将isRequesting设置为true,表示正在请求中
				this.isRequesting = true
				const pageCount = 6 // 页容量
				let data = await this.$request({
					url: "/api/public/v1/goods/search",
					data: {
						query: this.keyword,
						pagenum: this.goodsPage,
						pagesize: pageCount
					},
					showLoading: isShowLoading
				})
				// 请求的数据响应后，停止下拉刷新的动画
				uni.stopPullDownRefresh()
				this.goodsList = [...this.goodsList, ...data.message.goods]
				// 判断goodsList和data.total是否相等
				if (this.goodsList.length === data.message.total) {
					this.isLastPage = true
				}
				// 请求结束后，将isRequesting设置为false,表示请求结束
				this.isRequesting = false

			},
			// 点击键盘右下角的搜索按钮，触发的点击事件
			searchGoods() {
				// 每次点击右下角搜索的时候，需要清空商品列表
				this.goodsList = []
				// 每次点击右下角搜索的时候，需要将页码重置为1
				this.goodsPage = 1
				// 每次点击右下角搜索的时候，需要将isLastPage重置为false
				this.isLastPage = false
				// 发送请求
				this.getGoodsList()
			},
			// 点击商品进入商品详情页面
			toGoodsDetail(goodsId) {
				uni.navigateTo({
					url: "/pages/item/item?goodsId=" + goodsId
				})
			},

			searchGoodsDetail(inputVal){
				this.keyword = inputVal
				this.searchGoods()
			}
		}
	}
</script>

<style lang="less">
	.search_list {

		/* 过滤栏 */
		.filter_box {
			height: 100rpx;
			width: 100%;
			display: flex;
			justify-content: space-around;
			line-height: 100rpx;
			position: sticky;
			top: 98rpx;
			left: 0;
			background-color: #fff;

			.filterName {
				padding: 0 30rpx;
			}

			.active {
				color: #ff5c73;
			}
		}

		/* 商品介绍模块 */
		.goodsIntro_box {

			// margin-top: 200rpx;
			.goodsIntro_mod {
				height: 320rpx;
				border-top: 1rpx solid #f3f3f3;
				box-sizing: border-box;
				display: flex;

				/* 商品图片 */
				.goodsImg {
					padding: 0 30rpx;
					box-sizing: border-box;
					image {
						width: 230rpx;
						height: 230rpx;
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

		.lastPageTip {
			text-align: center;
		}
	}
</style>
