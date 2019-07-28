<template>
	<view class="search page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<input 
					class="search-text" 
					type="text" 
					maxlength="10" 
					placeholder="请输入片名"
					confirm-type="search"
					@confirm="searchList"
				/>
			</view>
		</view>
		<view class="movie-list">
			<view class="movie-wapper" v-for="image in list" :key="image.id">
				<image 
					class="search-list-image" 
					:src="image.cover" 
					@click="goDetails(image.id)"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				keywords: '',
				page: 1,
				totalPages: 1
			}
		},
		methods: {
			getList(keywords, page, pageSize) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.showNavigationBarLoading();
				uni.request({
					url: `${this.serverURL}/search/list`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq,
						keywords,
						page,
						pageSize
					},
					success: (res) => {
						if (res.data.status === 200) {
							let templist = res.data.data.rows;
							this.list = this.list.concat(templist);
							this.totalPages = res.data.data.total;
							this.page = page;
						}
					},
					complete: () => {
						uni.hideLoading();
						uni.hideNavigationBarLoading();
					}
				})
			},
			//  搜索列表
			searchList(e) {
				let value = e.detail.value;
				this.keywords = value;
				this.list = [];
				// TODO 分页
				this.getList(value, 1, 15);
			},
			goDetails (id) {
				uni.navigateTo({
					url: `../details/details?trailerId=${id}`,
				});
			}
		},
		onLoad() {
			this.getList(this.keywords, this.page, 9);
		},
		// TODO 上拉触底刷新
		onReachBottom() {
			let page = this.page + 1;  // 查询下一页面，当前页面加一
			let keywords = this.keywords;
			let totalPages = this.totalPages;
			//  如 果当前需要分页的分页数和总页数相等，就不分页
			if (page > totalPages) return;
			else this.getList(keywords, page, 15);
		}
	}
</script>

<style>
	@import url("./search.css");
</style>
