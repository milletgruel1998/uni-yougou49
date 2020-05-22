<template>
	<view class="search_mod">
		<view class="search">
			<icon type="search" size="16" color="#bbb"/>
			<text>搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style scoped lang="less">
	/* 搜索框模块 */
	.search_mod{
		width: 100%;
		height: 100rpx;
		background-color: #eb4450;
		padding: 20rpx 16rpx;
		box-sizing: border-box;
		.search{
			height: 60rpx;
			line-height: 60rpx;
			background-color: #fff;
			border-radius: 8rpx;
			position: relative;
			text{
				color: #bbb;
				margin-left: 360rpx;
			}
			icon{
				position: absolute;
				top: 16rpx;
				left: 310rpx;
			}
		}
	}
</style>
