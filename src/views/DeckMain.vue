<template>
	<div class="card-display-scroll-view wrap">
		<card-display :deck="deck" />
		<div class="deck-main">
			<section class="card-list-controls card-list-viewing-controls">
				<card-sorter :deck="deck" />
				<sideboard-toggler :deck="deck" />
			</section>
			<card-list :deck="deck" />
			<section class="card-list-controls card-list-action-controls">
				<card-adder :deck="deck" />
				<deck-actions :deck="deck" />
			</section>
		</div>
	</div>
</template>

<script>
import findRelevantDeck from '@/mixins/findRelevantDeck.js'
import CardDisplay from '@/components/DeckCardDisplay.vue'
import CardSorter from '@/components/DeckCardSorter.vue'
import SideboardToggler from '@/components/DeckSideboardToggler.vue'
import CardList from '@/components/DeckCardList.vue'
import CardAdder from '@/components/DeckCardAdder.vue'
import DeckActions from '@/components/DeckDeckActions.vue'

export default {
	mixins: [findRelevantDeck],
	components: { CardDisplay, CardSorter, SideboardToggler, CardList, CardAdder, DeckActions },
	computed: {
		deck () {
			return this.$store.state.decks.find(deck =>
				`/deck/${deck.path}/` === this.$route.path
			)
		}
	}
}
</script>
