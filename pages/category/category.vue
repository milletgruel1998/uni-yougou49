<template>
	<view class="category">
		<!-- 搜索框模块 -->
		<searchMod />
		<!-- 主体模块 -->
		<view class="content" v-if="catagoryList.length">
			<view class="left">
				<view class="content_item" :class="{active:activeIndex === index}" v-for="(item,index) in catagoryList" :key="index" @click="changeStyle(index)">{{item.cat_name}}</view>
			</view>
			<view class="right">
				<image class="rightTopImg" src="../../static/images/titleImage.png"></image>
				<!-- 二级菜单 -->
				<view class="category2" v-for="(cateItem2,cateIndex2) in catagoryList[activeIndex].children" :key="cateIndex2">
					<view class="categoryName">/<text class="">{{cateItem2.cat_name}}</text>/</view>
					<!-- 三级菜单 -->
					<view class="category3_mod">
						<view class="category3" @click="toSearchList(cateItem3.cat_name)" v-for="(cateItem3,cateIndex3) in cateItem2.children" :key="cateIndex3">
							<image :src="cateItem3.cat_icon"></image>
							<text>{{cateItem3.cat_name}}</text>
						</view>
					</view>
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
		//-------------------------data-------------------------
		data() {
			return {
				activeIndex: 0, // 改变选中的样式，默认是第一个
				catagoryList:[] // 分类列表数据
			}
		},
		//-------------------------onLoad-------------------------
		onLoad() {
			// 调用获取一级菜单
			this.getCategories()
		},
		//-------------------------methods-------------------------
		methods: {
			// 控制active样式
			changeStyle(index) {
				this.activeIndex = index
			},
			// 封装获取菜单列表数据
		async	getCategories(){
			let data = await this.$request({
					url:"/api/public/v1/categories"
				})
				this.catagoryList = data.message
			},
			toSearchList(catName){
				console.log(catName)
				uni.navigateTo({
					url:`../search_list/search_list?catName=${catName}`
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.category{
		.content{
			display: flex;
			position: absolute;
			top: 100rpx;
			bottom: 0;
			left: 0;
			right: 0;
			.left{
				width: 198rpx;
				overflow: auto;
				.content_item{
					height: 100rpx;
					line-height: 100rpx;
					border-bottom: 1rpx solid #eee;
					box-sizing: border-box;
					background-color: #f4f4f4;
					text-align: center;
				}
				.active{
					background-color: #fff;
					color: #eb4450;
					font-weight: 700;
					position: relative;
					&::before{
						position: absolute;
						content: '';
						top: 20rpx;
						left: 0;
						width: 8rpx;
						height: 60rpx;
						background-color: #eb4450;
					}
				}
			}
			.right{
				flex: 1;
				overflow: scroll;
				.rightTopImg{
					width: 520rpx;
					height: 180rpx;
					margin: 20rpx 0 0 16rpx;
				}
				/* 二级菜单 */
				.categoryName{
					color: #e0e0e0;
					text-align: center;
					margin-top: 50rpx;
					text{
						color: #000;
						font-weight:700;
						font-size: 40rpx;
						margin: 0 36rpx;
					}
				}
				/* 三级菜单 */
				.category3_mod{
					display: flex;
					flex-wrap: wrap;
					.category3{
						width: 33.33%;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 20rpx;
						image{
							width: 120rpx;
							height: 120rpx;
						}
					}
				}
			}
		}
	}
</style>