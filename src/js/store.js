import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import defaultDecks from './default-decks.json'
import router from './router.js'

const vuexLocalStorage = new VuexPersist({
	storage: window.localStorage,
	reducer: (state) => ({
		decks: state.decks,
		sortAttribute: state.sortAttribute
	})
})
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		alertNameTooLong: '⚠ That deck name is too long. Please shorten it to fewer than 50 characters.',
		decks: defaultDecks.decks,
		deletedDeckName: null,
		showCard: false,
		showDeckMenu: false,
		sortAttribute: 'type',
		manaSymbol: {
			w: '<span class="mana-symbol white" title="White mana symbol"><div>W</div></span>',
			u: '<span class="mana-symbol blue" title="Blue mana symbol">U</span>',
			b: '<span class="mana-symbol black" title="Black mana symbol">B</span>',
			r: '<span class="mana-symbol red" title="Red mana symbol">R</span>',
			g: '<span class="mana-symbol green" title="Green mana symbol">G</span>'
		},
		raritySymbol: {
			c: '<div class="rarity-symbol common" title="Common">C</div>',
			u: '<div class="rarity-symbol uncommon" title="Uncommon">U</div>',
			r: '<div class="rarity-symbol rare" title="Rare">R</div>',
			m: '<div class="rarity-symbol mythic" title="Mythic rare">M</div>',
			s: '<div class="rarity-symbol special" title="Special">S</div>'
		},
		alertNameExists: (name) => {
			return `⚠ You already have another deck named “${name}.” Please give a different name.`
		},
		curlApostrophes: (string) => {
			return string.replace(/'/g, '’') // Convert every straight apostrophe (or single right quotation mark) into a curly one.
		},
		scrollToTop: () => {
			window.scrollTo(0, 0)
			history.replaceState('', document.title, window.location.pathname)
		},
		stringToPath: (string) => {
			return string
				.toLowerCase()
				.replace(/\s/g, '-') // Replace whitespace characters with hyphens.
				.replace(/-{2,}/g, '-') // Replace multiple hyphens in a row with a single hyphen.
		}
	},
	getters: {
		attentionHeaderButton: (state) => () => {
			let buttonForAttention

			if (state.decks.length > 0) {
				buttonForAttention = document.querySelector('.deck-menu-toggler')
			} else {
				buttonForAttention = document.querySelector('.add-new-deck button')
			}

			buttonForAttention.classList.add('attention')

			setTimeout(() => {
				buttonForAttention.classList.remove('attention')
			}, 1000)
		},
		// Check whether another deck exists with the same name. If one does, return that deck object (not the name). The name check is actually based on the deck's path because the path must be unique.
		existingDeck: (state) => (testPath) => {
			return state.decks.find(deck =>
				testPath === deck.path
			)
		}
	},
	mutations: {
		setDecks (state, payload) {
			state.decks = payload
		},
		setDeletedDeckName (state, payload) {
			state.deletedDeckName = payload
		},
		setSortAttribute (state, payload) {
			state.sortAttribute = payload
		},
		setShowCard (state, payload) {
			state.showCard = payload
		},
		setShowDeckMenu (state, payload) {
			state.showDeckMenu = payload
		},
		sortDeckMenu (state) {
			state.decks.sort((a, b) => {
				const deckA = a.name.toUpperCase()
				const deckB = b.name.toUpperCase()

				if (deckA > deckB) return 1
				else if (deckA < deckB) return -1
			})
		}
	},
	actions: {
		createDeck ({ state, getters, commit }) {
			function createDeck (failedName, existingDeckName) {
				let message = 'Name this new deck:'
				if (existingDeckName) {
					message = state.alertNameExists(existingDeckName)
				}

				let name = prompt(message, failedName)

				// First edit the given name to remove any excess white space.
				if (name) {
					name = name.trim()
					name = state.curlApostrophes(name)
				}
				if (name) { // If the user entered any name...
					const path = state.stringToPath(name)
					const deckExists = getters.existingDeck(path)

					if (deckExists) {
						createDeck(failedName, deckExists.name) // Restart.
					} else if (name.length > 50) {
						alert(state.alertNameTooLong)
						createDeck(name) // Restart.
					} else {
						state.decks.push({
							name: name,
							path: path,
							cards: [],
							editDate: new Date(),
							viewedCard: ''
						})
						commit('setDecks', state.decks)
						commit('sortDeckMenu')

						router.push({
							name: 'deck',
							params: { deckPath: path }
						})
					}
				} // Else, if the user left the prompt blank, do nothing.
			}
			createDeck()
		}
	},
	plugins: [vuexLocalStorage.plugin]
})
