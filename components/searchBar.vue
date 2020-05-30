<template>
	<view class="search_box">
		<icon class="iconSearch" type="search" size="16" color="#bbb" />
		<input type="text" v-model.trim="inputVal" confirm-type="search" @confirm="searchGoods" />
		<icon class="clearVal" v-show="inputVal" @click="clearVal" type="clear" size="16" color="#bbb" />
	</view>
</template>

<script>
	export default {
		props: ['keyword'],
		data() {
			return {
				inputVal: this.keyword // 搜索框的关键字
			}
		},
		methods: {
			searchGoods() {
				if (this.inputVal) {
					this.$emit('search', this.inputVal)
				}
			},
			// 清空搜索框
			clearVal() {
				this.inputVal = ''
			}
		},
		watch: {
			keyword(newValue) {
				this.inputVal = newValue
			}
		}
	}
</script>

<style scoped lang="less">
	.search_box {
		height: 100rpx;
		background-color: #efefef;
		padding: 20rpx 16rpx;
		box-sizing: border-box;
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;

		>input {
			display: inline-block;
			height: 60rpx;
			width: 100%;
			background-color: #fff;
			padding-left: 85rpx;
			box-sizing: border-box;
		}

		.iconSearch {
			position: absolute;
			top: 35rpx;
			left: 55rpx;
		}

		.clearVal {
			position: absolute;
			top: 35rpx;
			right: 40rpx;
			z-index: 8;
		}
	}
</style>
