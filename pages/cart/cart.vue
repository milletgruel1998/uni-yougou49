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
		<view class="goodsShow-body">
			<view class="icon">
				<text class="iconfont icon-checked"></text>
			</view>
			<view class="goodsInfor">
				<view>
					<image src="http://image1.suning.cn/uimg/b2c/newcatentries/0070134290-000000000149003877_1_400x400.jpg"></image>
				</view>
				<!-- 文字 -->
				<view class="information">
					<text>spike 经典武士大马士革直刀(微型) 户外野营直刀 收藏礼品刀 饰品刀具</text>
					<view>
						<text>￥<text class="number">279</text>.00</text>
						<text>-</text>
						<text>3</text>
						<text>+</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

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

					>text:nth-child(2) {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
						border: 2rpx solid #666;
						box-sizing: border-box;
						position: absolute;
						top: 0;
						right: 158rpx;
						text-align: center;
					}

					>text:nth-child(3) {
						position: absolute;
						top: 0;
						right: 110rpx;
					}

					>text:nth-child(4) {
						display: inline-block;
						width: 50rpx;
						height: 50rpx;
						border: 2rpx solid #666;
						box-sizing: border-box;
						position: absolute;
						top: 0;
						right: 35rpx;
						text-align: center;
					}
				}
			}
		}
	}
</style>
