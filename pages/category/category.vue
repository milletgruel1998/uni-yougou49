<template>
	<view class="category">
		<!-- 搜索框模块 -->
		<searchMod />
		<!-- 主体模块 -->
		<view class="content">
			<view class="left">
				<view class="content_item" v-for="item in 20" :key="item">热门推荐</view>
			</view>
			<view class="right">这是一个寂寞的Tina</view>
		</view>
	</view>
</template>

<script>
	import searchMod from '@/components/searchMod.vue'
	export default {
		components:{
			searchMod
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
			}
			.right{
				flex: 1;
			}
		}
	}
</style>