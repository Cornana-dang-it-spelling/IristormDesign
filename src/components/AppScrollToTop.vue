<template>
	<transition name="stt-fade">
		<div v-show="!atTop && $route.name !== 'home'" class="scroll-to-top">
			<button @click="scrollToTop()" title="Scroll up to the top">▲</button>
		</div>
	</transition>
</template>

<script>
import scrollToTop from '@/mixins/scrollToTop.js'

export default {
	mixins: [scrollToTop],
	data () {
		return {
			atTop: true
		}
	},
	mounted () {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 128) {
				this.atTop = false
			} else {
				this.atTop = true
			}
		})
	}
}
</script>
