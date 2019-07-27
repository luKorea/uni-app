<template>
	<view class="home page">
		<!-- 轮播图 -->
		<swiper class="home-swiper" indicator-dots="true" autoplay="true" circular="true" indicator-color="#fff"
		 indicator-active-color="#1296db">
			<swiper-item v-for="item in swipeImgUrl" :key="item.movieId">
				<image :src="item.image" class="home-image"></image>
			</swiper-item>
		</swiper>
		<!-- 热门推荐 -->
		<view class="home-super-hot page-block">
			<view class="home-hot-title-wrapper">
				<image class="home-hot-ico" :src="hotImg"></image>
				<view class="home-hot-title">
					热门推荐
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swipeImgUrl: [],
				hotImg: '../../static/icos/hot.png',
			}
		},
		onLoad() {
			// TODO 请求轮播图数据
			uni.request({
				url: `${this.serverURL}/index/carousel/list`,
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {qq: this.qq},
				success: (res) => {
					if (res.data.status === 200) {
						this.swipeImgUrl = res.data.data;
					}

				}
			});
		},
		methods: {

		}
	}
</script>

<style>
	@import url("./index.css");
</style>
