		function runTests() {
			testDeck();
		}

		function testDeck() {
			passed = true;
			//test that each suit has 13 cards
			for (i = 1; i <= 4; i++) {
				if ($.grep(deck, function(card) { return card.cardSuit == i }).length != 13)
					passed = false;
			}
			
			//test that each card value has 4 suits
			for (i = 1; i <= 13; i++) {
				if ($.grep(deck, function(card) { return card.cardValue == i }).length != 4)
					passed = false;
			}
			
			if ($.grep(deck, function(card) { return card.countValue == 1 }).length != 20)
				passed = false;
			if ($.grep(deck, function(card) { return card.countValue == 0 }).length != 12)
				passed = false;
			if ($.grep(deck, function(card) { return card.countValue == -1 }).length != 20)
				passed = false;
			
			
			alert("passed tests: " + passed);
			$('#fullDeck').remove();
			fullDeck = $('<div />', {
				id: "fullDeck",
				style: "width: 950px"
			});
			$('body').append(fullDeck);
			$.each(deck, function(i, card) {
				cardDiv = $('<div />', { class: 'card' });
				fullDeck.append(cardDiv);
				displayCard(cardDiv, card.cardValue, card.cardSuit);
			});
		}