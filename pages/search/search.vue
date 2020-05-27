<template>
	<view class="search">
		<!-- 搜索框组件 -->
		<searchBar @search="toGoodsList" />
		<!-- 历史搜索 -->
		<view class="historySearch_mod">
			<view class="historySearch">
				<text>历史搜索</text>
				<icon type="clear" size=16 color="#bbb" @click="clearHistory"></icon>
			</view>
			<view class="searchContent">
				<text v-for="(item,index) in searchContent" @click="toGoodsList(item)">{{item}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import searchBar from '../../components/searchBar'
	export default {
		components: {
			searchBar
		},
		data() {
			return {
				searchContent: uni.getStorageSync('search_history') || [] // 搜索的全部内容
			}
		},
		onShow() {
			this.searchContent = uni.getStorageSync('search_history') || []
		},
		methods: {
			// 通过搜索框搜索，进入商品列表页
			toGoodsList(inputVal) {
				uni.navigateTo({
					url: "../search_list/search_list?catName=" + inputVal
				})
				// 将搜索记录添加到历史搜索中
				let _searchContent = [inputVal, ...this.searchContent]
				// 搜索记录去重
				_searchContent = [...new Set(_searchContent)]
				// 将搜索记录添加到localStorage中
				uni.setStorageSync("search_history", _searchContent)
			},
			// 清空历史记录
			clearHistory() {
				uni.showModal({
					title: "删除",
					content: "您确定要清空搜索记录吗？",
					success:(res)=> {
						console.log(res)
						if (res.confirm) {
							// 清空搜索记录以及localStorage
							this.searchContent = []
							uni.removeStorageSync("search_history")
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.historySearch_mod {
		.historySearch {
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 18rpx;
			box-sizing: border-box;
			position: relative;

			text {
				font-size: 36rpx;
			}

			icon {
				position: absolute;
				top: 22rpx;
				right: 40rpx;
			}
		}

		.searchContent {
			text {
				display: inline-block;
				margin: 0 0 18rpx 18rpx;
				padding: 20rpx;
				background-color: #ddd;
			}
		}
	}
</style>
