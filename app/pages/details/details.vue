<template>
	<view class="details">
		<!-- 视频播放 start -->
		<view class="player">
			<video id="myPlay" class="movie" :src="trailerInfo.trailder" :poster="trailerInfo.poster" controls></video>
		</view>
		<!-- 视频播放 end -->

		<!-- 基本信息 start -->
		<view class="movie-info">
			<navigator :url="'../cover/cover?cover=' + trailerInfo.cover">
				<image class="cover" :src="trailerInfo.cover"></image>
			</navigator>
			<view class="movie-desc">
				<view class="title">{{trailerInfo.name}}</view>
				<view class="basic-info">{{trailerInfo.basicInfo}}</view>
				<view class="basic-info">{{trailerInfo.originalName}}</view>
				<view class="basic-info">{{trailerInfo.totalTime}}</view>
				<view class="basic-info">{{trailerInfo.releaseDate}}</view>
				<view class="score-block">
					<view class="big-score">
						<view class="score-words">综合评分</view>
						<view class="movie-score">{{trailerInfo.score}}</view>
					</view>
					<view class="score-stars">
						<block v-if="trailerInfo.score >= 0">
							<score :innerScore="trailerInfo.score" showScore='0'></score>
						</block>
						<view class="prise-counts">{{trailerInfo.prisedCounts}} 人点赞</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 基本信息 end -->

		<!-- 剧情介绍 start -->
		<view class="plots-block">
			<view class="plots-title">剧情介绍</view>
			<view class="plots-desc">{{trailerInfo.plotDesc}}</view>
		</view>
		<!-- 剧情介绍 end -->

		<!-- 演职人员 start -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			<scroll-view scroll-y class="scroll-list">
				<view class="actor-wapper" v-for="(deirectors, index) in deirector" :key="deirectors.id">
					<image class="single-actor" :src="deirectors.photo" mode="aspectFill" @click="lookStaff(index)"></image>
					<view class="actor-name">{{deirectors.name}}</view>
					<view class="actor-name">{{deirectors.actName}}</view>
				</view>
				<view class="actor-wapper" v-for="(actors, index) in actor" :key="actors.id" @click="lookStaff(index + actor.length)">
					<image class="single-actor" :src="actors.photo" mode="aspectFill"></image>
					<view class="actor-name">{{actors.name}}</view>
					<view class="actor-name">{{actors.actName}}</view>
				</view>

			</scroll-view>
		</view>
		<!-- 演职人员 end -->


		<!-- 剧照 start -->
		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-y class="scroll-list">
				<image class="plot-image" v-for="(plotimage, index) in plotPics" :src="plotimage" :key="plotimage.id" mode="aspectFill"
				 @click="lookMe(index)"></image>
			</scroll-view>
		</view>
		<!-- 剧照 end -->
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
				trailerInfo: {},
				plotPics: [], // 剧照
				director: [], // 导演
				actor: [], // 演员
			}
		},
		methods: {
			//  获取详情页
			getTrailderInfo(trailerId) {
				uni.request({
					url: `${this.serverURL}/search/trailer/${trailerId}`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.trailerInfo = res.data.data;
							this.plotPics = JSON.parse(this.trailerInfo.plotPics);
						}
					}
				});
			},
			// TODO 获取演员
			getActor(trailerId) {
				uni.request({
					url: `${this.serverURL}/search/staff/${trailerId}/2`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.actor = res.data.data;
						}
					}
				});
			},
			// TODO  获取导演
			getDirector(trailerId) {
				uni.request({
					url: `${this.serverURL}/search/staff/${trailerId}/1`,
					method: "POST",
					header: this.header,
					data: {
						qq: this.qq
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.deirector = res.data.data;
						}
					}
				});
			},
			//  放大图片
			lookMe(index) {
				uni.previewImage({
					current: index,
					urls: this.plotPics
				})
			},
			// 演员图片预览 
			lookStaff(index) {
				let director = this.deirector;
				let actor = this.actor;
				let newArray = [];
				newArray = newArray.concat(director).concat(actor);
				let urls = [];
				for (let i = 0; i < newArray.length; i++) {
					let tempPhoto = newArray[i].photo;
					urls.push(tempPhoto);
				}
				uni.previewImage({
					current: urls[index],
					urls: urls
				})
			}
		},
		onLoad(params) {
			let trailerId = params.trailerId;
			this.getTrailderInfo(trailerId);
			this.getActor(trailerId);
			this.getDirector(trailerId);
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myPlay');
		},
		onHide() {
			this.videoContext.pause();
		},
		onShow() {
			if (this.videoContext) {
				this.videoContext.play();
			}
		},
		//  只支持小程序分享，
		onShareAppMessage() {
			return {
				title: this.trailerInfo.name,
				path: `/pages/details/details?trailerId=${this.trailerInfo.id}`
			}
		},
		// TODO 顶部按钮分享
		onNavigationBarButtonTap(e) {
			let index = e.index;
			// console.log(index);
			let me = this;
			let trailerInfo = me.trailerInfo;
			let trailerId = trailerInfo.id;
			let trailerName = trailerInfo.name;
			let cover = trailerInfo.cover;
			let poster = trailerInfo.poster;

			// index 为0 则分享
			if (index === 0) {
				uni.share({
					provider: "weixin",
					scene: "WXSenceTimeline",
					type: 0,
					href: `http://www.imovietrailer.com/#/pages/details/details?trailerId=${trailerId}`,
					title: `超英预告：《${trailerName}》`,
					summary: `超英预告：《${trailerName}》`,
					imageUrl: cover,
					success(res) {
						console.log("success:" + JSON.stringify(res));
					}
				});
			}
		}
	}
</script>

<style>
	@import url("./details.css");
</style>
