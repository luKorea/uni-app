<template>
	<view class="home page">
		<!-- 轮播图 start-->
		<swiper class="home-swiper" indicator-dots="true" autoplay="true" circular="true" indicator-color="#fff"
		 indicator-active-color="#1296db">
			<swiper-item v-for="swiper in swipeImgUrl" :key="swiper.movieId">
				<navigator open-type="navigate" :url="'../details/details?trailerId=' + swiper.movieId">
					<image :src="swiper.image" class="home-image"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 轮播图 end -->

		<!-- 热门推荐 start -->
		<view class="home-super-hot page-block">
			<view class="home-hot-title-wrapper">
				<image class="home-hot-ico" :src="hotImg"></image>
				<view class="home-hot-title">
					热门推荐
				</view>
			</view>
		</view>
		<scroll-view class="home-hot-scroll page-block" scroll-x>
			<view class="home-hot-scroll-single" v-for="hot in hotImgUrl" :key="hot.id">
				<view class="home-hot-scroll-wrapper">
					<navigator open-type="navigate" :url="'../details/details?trailerId=' + hot.id">
						<image :src="hot.cover" class="home-hot-scroll-img"></image>
					</navigator>
					<view class="home-hot-scroll-title">{{hot.name}}</view>
					<score :innerScore="hot.score" showScore='1'></score>
				</view>
			</view>
		</scroll-view>
		<!-- 热门推荐end -->

		<!--热门预告 start  -->
		<view class="home-super-hot page-block">
			<view class="home-hot-title-wrapper">
				<image class="home-hot-ico" :src="trailerImg"></image>
				<view class="home-hot-title">
					热门预告
				</view>
			</view>
		</view>
		<view class="home-hot-movie page-block">
			<video :id="trailer.id" class="home-hot-movie-single" v-for="trailer in trailerImgUrl" :key='trailer.id' :src="trailer.trailer"
			 :poster="trailer.poster" @play="playVideo(trailer.id)" controls></video>
		</view>
		<!-- 热门预告 end -->

		<!-- 猜你喜欢 start  -->
		<view class="home-super-hot page-block">
			<view class="home-hot-title-wrapper">
				<image class="home-hot-ico" :src="hobbyImg"></image>
				<view class="home-hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="home-hobby page-block">
			<view class="home-hobby-sigle" v-for="(hobby, gIndex) in hobbyImgUrl" :key='hobby.id'>

				<navigator open-type="navigate" :url="'../details/details?trailerId=' + hobby.id">
					<image :src="hobby.cover" class="home-hobby-img"></image>
				</navigator>
				<view class="home-hobby-desc">
					<view class="home-hobby-desc-title">{{hobby.name}}</view>
					<score :innerScore="hobby.score" showScore='0'></score>
					<view class="home-hobby-desc-info">{{hobby.basicInfo}}</view>
					<view class="home-hobby-desc-info">{{hobby.releaseDate}}</view>
				</view>

				<view class="home-hobby-options" :data-gIndex="gIndex" @click="praiseClick">
					<image class="home-hobby-options-ico" :src="praiseImg"></image>
					<view class="home-hobby-options-me">点赞</view>
					<view class="home-hobby-options-me animation-opacity" :animation="animationDataArr[gIndex]">+1</view>
				</view>
			</view>
		</view>

		<!-- 猜你喜欢 end -->

	</view>
</template>

<script>
	import Score from '../../components/Score.vue';
	export default {
		components: {
			Score
		},
		data() {
			return {
				hotImg: '../../static/icos/hot.png',
				trailerImg: '../../static/icos/interest.png',
				hobbyImg: '../../static/icos/guess-u-like.png',
				praiseImg: '../../static/icos/praise.png',
				swipeImgUrl: [],
				hotImgUrl: [],
				trailerImgUrl: [],
				hobbyImgUrl: [],
				animationData: {},
				animationDataArr: [{}, {}, {}, {}, {}]
			}
		},
		onLoad() {
			this.getSwiperData();
			this.getHotData();
			this.getTrailerData();
			this.getHobbyData();
			// #ifdef APP-PLUS || MP-WEIXIN
			// 在页面创建的时候，创建一个临时动画对象
			this.animation = uni.createAnimation();
			// #endif
		},
		onUnload() {
			// 页面卸载的时候，清除动画数据
			this.animationData = {};
			this.animationDataArr = [{}, {}, {}, {}, {}];
		},
		onPullDownRefresh() {
			this.getHobbyData();
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause();
			}
		},
		methods: {
			// TODO 获取轮播图数据
			getSwiperData() {
				uni.request({
					url: `${this.serverURL}/index/carousel/list`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.swipeImgUrl = res.data.data;
						}
					}
				});
			},
			// TODO 获取热门推荐
			getHotData() {
				uni.request({
					url: `${this.serverURL}/index/movie/hot`,
					method: "POST",
					header: this.header,
					data: {
						type: 'superhero',
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							let data = res.data.data;
							this.hotImgUrl = data;
						}
					}
				});
			},
			// TODO 获取热门预告
			getTrailerData() {
				uni.request({
					url: `${this.serverURL}/index/movie/hot`,
					method: "POST",
					header: this.header,
					data: {
						type: 'trailer',
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							let data = res.data.data;
							this.trailerImgUrl = data;
						}
					}
				});
			},
			// TODO 获取猜你喜欢
			getHobbyData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});

				uni.request({
					url: `${this.serverURL}/index/guessULike`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							let data = res.data.data;
							this.hobbyImgUrl = data;
						}
					},
					complete: () => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				});
			},
			//  TODO 点赞
			praiseClick(e) {
				// #ifdef APP-PLUS || MP-WEIXIN
				let gIndex = e.currentTarget.dataset.gindex;
				// 构建动画数据，并且通过step来表示这组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				});

				// 导出动画数据到view组件，实现组件的动画效果
				this.animationData = this.animation;
				this.animationDataArr[gIndex] = this.animationData.export();

				// 还原动画
				setTimeout(() => {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					});
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}, 500)
				// #endif
			},
			playVideo(id) {
				this.videoContext = uni.createVideoContext(id);
				let trailer = this.trailerImgUrl;
				for (let i = 0; i < trailer.length; i++) {
					let tempID = trailer[i].id;
					if(tempID != id) {
						uni.createVideoContext(tempID).pause();
					}
				}
			}
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
