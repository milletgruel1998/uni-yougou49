<template>
	<view class="home">
		<!-- 搜索框模块 -->
		<searchMod />
		<!-- 轮播图模块 -->
		<view class="swiper_mod">
			<swiper class="swiper" indicator-dots="true" indicator-color="#96defc" indicator-active-color="#fff" autoplay interval="3000" circular>
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.image_src"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 导航栏模块 -->
		<view class="nav_mod">
				<view class="nav_img" v-for="(item,index) in navList" :key="index">
					<image :src="item.image_src"></image>
				</view>
		</view>
		<view class="body_content" v-for="(item,index) in floorList" :key="index">
			<!-- 横幅模块 -->
			<view class="banner">
				<image :src="item.floor_title.image_src"></image>
			</view>
			<!-- 楼层模块 -->
			<view class="floor_mod">
				<view class="floor_left">
					<image :src="item.product_list[0].image_src"></image>
				</view>
				<view class="floor_right">
					<block v-for="(sonItem,sonIndex) in item.product_list" :key="sonIndex">
						<image v-if="sonIndex" :src="sonItem.image_src"></image>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import searchMod from '@/components/searchMod.vue'
	export default {
		components:{
			searchMod
		},
		// ----------------------data----------------------
		data() {
			return {
				swiperList:[], // 轮播图数据
				navList:[], // 导航栏数据
				floorList:[] // 楼层数据
			}
		},
		// ----------------------onload----------------------
		onLoad() {
			// 调用获取轮播图的方法
			this.getSwiperdata()
			// 调用获取导航栏的方法
			this.getCatitems()
			// 调用获取楼层的数据
			this.getFloordata()
		},
		// ----------------------methods----------------------
		methods:{
		// 封装获取轮播图的方法
		async	getSwiperdata(){
			let data = await	this.$request({
					url:"/api/public/v1/home/swiperdata"
				})
				this.swiperList = data.message
			},
		// 封装导航栏的方法
		async	getCatitems(){
			let data = await	this.$request({
					url:"/api/public/v1/home/catitems"
				})
				this.navList = data.message
			},
		// 封装楼层的方法
		async getFloordata(){
			let data = await	this.$request({
					url:"/api/public/v1/home/floordata"
				})
				this.floorList = data.message
			}
		}
	}
</script>

<style scoped lang="less">
	.home{
		/* 轮播图模块 */
		.swiper_mod{
			.swiper{
				width: 100%;
				height: 340rpx;
				swiper-item{
					image{
						height: 340rpx;
						width: 100%;
					}
				}
			}
		}
		/* 导航栏模块 */
		.nav_mod{
			width: 100%;
			height: 194rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.nav_img{
				image{
					width: 128rpx;
					height: 140rpx;
				}				
			}
		}
		/* 横幅模块 */
		.banner{
			width: 100%;
			height: 88rpx;
			background-color: #f4f4f4;
			image{
				height: 62rpx;
				margin: 22rpx 0 0 10rpx;
			}
		}
		/* 楼层模块 */
		.floor_mod{
			padding: 20rpx 17rpx 0;
			box-sizing: border-box;
			display: flex;
			.floor_left{
				image{
					width: 232rpx;
				}
			}
			.floor_right{
				margin-left: 10rpx;
				display: flex;
				flex-wrap: wrap;
				image{
					width: 232rpx;
					height: 235rpx;
				}
				image:nth-child(odd){
					margin-right: 10rpx;
				}
			}
		}
	}
</style>