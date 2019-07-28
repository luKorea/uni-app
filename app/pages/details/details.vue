<template>
	<view class="details">
		<!-- 视频播放 start -->
		<view class="player">
			<video 
				class="movie" 
				:src="trailerInfo.trailder"
				:poster="trailerInfo.poster" 
				controls
			></video>
		</view>
		<!-- 视频播放 end -->
		
		<!-- 基本信息 start -->
		<view class="movie-info">
			<image class="cover" :src="trailerInfo.cover"></image>
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
		
		<!-- 剧照 start -->
		
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
				plotPics: [],  // 剧照
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
			//  获取导演
			getDirector(trailerId) {
				uni.request({
					url: `${this.serverURL}/search/trailer/${trailerId}`,
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
			}
		},
		onLoad(params) {
			let trailerId = params.trailerId;
			this.getTrailderInfo(trailerId);
		}
	}
</script>

<style>
	@import url("./details.css");
</style>
