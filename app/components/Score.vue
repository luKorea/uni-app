<template name='Score'>
	<view class="score-scroll-ico">
		
		<!-- #ifdef H5 -->
		<image class="score-scroll-ico-star" src="../../static/icos/star-yellow.png" v-for="yello in yelloScore"></image>
		<image class="score-scroll-ico-star" src="../../static/icos/star-gray.png" v-for="index in grayScore"></image>
		<view class="score-scroll-ico-comment" v-if="showScore == 1">
			评分:{{innerScore}}
		</view>
		<!-- #endif -->
		
		<!-- #ifdef APP-PLUS -->
		<image class="score-scroll-ico-star" src="../../static/icos/star-yellow.png" v-for="yello in yelloScore"></image>
		<image class="score-scroll-ico-star" src="../../static/icos/star-gray.png" v-for="index in grayScore"></image>
		<view class="score-scroll-ico-comment" v-if="showScore == 1">
			评分:{{innerScore}}
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP -->
		<image class="score-scroll-ico-star" src="../static/icos/star-yellow.png" v-for="gray in yelloScore" ></image>
		<image class="score-scroll-ico-star" src="../static/icos/star-gray.png" v-for="index in grayScore" ></image>
		<view class="score-scroll-ico-comment" v-if="showScore == 1">
			评分:{{innerScore}}
		</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	export default {
		nmae: "Score",
		props: {
			innerScore: 0,
			showScore: 0
		},
		data() {
			return {
				yelloScore: 0,
				grayScore: 5
			}
		},
		created() {
			let tempScore = 0;
			if (this.innerScore != null && this.innerScore != undefined && this.innerScore != '') {
				tempScore = this.innerScore;
			}
			let yelloScore = parseInt(tempScore / 2);
			this.yelloScore = yelloScore;
			let grayScore = 5 - yelloScore;
			this.grayScore = grayScore;
		}
	}
</script>

<style>
	.score-scroll-ico {
		display: flex;
		flex-direction: row;
		margin-bottom: 4upx;
	}

	.score-scroll-ico-star {
		width: 20upx;
		height: 20upx;
		margin-top: 5upx;
	}

	.score-scroll-ico-comment {
		font-size: 19upx;
		color: #999;
		margin-left: 8upx;
	}
</style>
