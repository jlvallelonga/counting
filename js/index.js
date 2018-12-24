//TODO: Add context menu with "Delete" option to replace the trashcan
//TODO: Add a stop watch so you can time yourself
//TODO: add a field to show how long it will take to get through the whole deck with the current delay and tie it to the onChanged event of the flip delay
//TODO: preload card sprite images (both masked and unmasked)
//BUG: when you drop a card, it's z-index goes back to what it was before it was dragged. it goes back underneath cards that it was previously under instead of staying on top.
		var deck;
		var timeoutID = -1;
		var deckPosition = -1;
		var showValues = true;
	
		$(document).ready(function() {
			initializeDeck();
			$('.startCard').click(function() {
				cardClick(true, $(this));
			});
			$('#shuffle').click(shuffle);
			$('#addPile').click(addPile);
			$('#incrementCards').click(incrementCards);
			$('.controlDiv').draggable();
			$('.deck').draggable({ containment: "parent" }).bind("dragstart", function(event, ui) {
				$(this).addClass("dragging").css('z-index', '+=1');
			});
			$('#countDiv').draggable();
			$('#trashCan').droppable({
				drop: function(event, ui) {
					console.log(ui.draggable);
					if (ui.draggable.hasClass('deck'))
						ui.draggable.remove();
				}
			});
			$('#showCount').change(showCountChanged);
			$('#showCardLabels').change(showCardLabelsChanged);
			$('#startFlipping').click(function() {
				if (timeoutID == -1) {
					timeoutID = window.setInterval(function(){ 
						if (!incrementCard($('.deck').first())) {
							stopFlipping();
						}
					}, parseInt($('#flipDelay').val()));
				}
			});
			$('#stopFlipping').click(stopFlipping);
			
		});
		
		function stopFlipping() {
			clearInterval(timeoutID);
			timeoutID = -1;
		}
		
		function getCardClass(includeDot) {
			var cardClass = "card";
			if (!showValues)
				cardClass = "maskedCard";
			if (includeDot)
				cardClass = "." + cardClass;
			return cardClass;
		}
		
		function showCardLabelsChanged() {
			showValues = $(this).prop("checked");
			if (showValues) {
				$('.maskedCard').removeClass('maskedCard').addClass('card');
			}
			else {
				$('.card').removeClass('card').addClass('maskedCard');
			}
		}
		
		//returns whether or not the card could be successfully incremented
		function incrementCard(obj) {
			if (obj.hasClass('startCard')) {
				return cardClick(true, obj);
			}
			else {
				return cardClick(false, obj);
			}
		}
		
		function incrementCards() {
			$('.deck').each(function() {
				return incrementCard($(this));
			});
		}
		
		function cardClick(isStartCard, obj) {
			if (obj.hasClass('dragging')) {
				obj.removeClass('dragging').css('z-index', '0');
				return true;
			}
			else {
				if (deckPosition < (deck.length - 1)) {
					if (isStartCard) {
						obj.unbind('click').click(function() {
							cardClick(false, obj);
						}).trigger('click');
						obj.toggleClass(getCardClass(false) + ' startCard');
					}
					else {
						deckPosition++;
						displayCard(obj, deck[deckPosition].cardValue, deck[deckPosition].cardSuit);
						updateCount();
					}
					return true;
				}
				else {
					alert("end of deck reached. please shuffle");
					stopFlipping();
					return false; //to denote that the card click did not complete
				}
			}
		}
		
		function addPile() {
			pile = $('<div/>', {
				class: 'deck startCard'
			});
			pile.css({'top': '0px', 'left': '0px'});
			pile.click(function() {
				cardClick(true, $(this));
			}).draggable({ containment: "parent" }).bind("dragstart", function(event, ui) {
				$(this).addClass("dragging").css('z-index', '1');
			});;
			$('#table').append(pile);
		}
		
		function shuffle() {
			deckPosition = -1;
			$(getCardClass(true)).removeClass(getCardClass(false)).addClass('startCard').unbind('click').click(function() {
				cardClick(true, $(this));
			}).css('background-position', '0px 0px');
			$('.deck').draggable();
			$('#count').html('0');
			initializeDeck();
		}
		
		function showCountChanged() {
			showCountChecked = $(this).prop("checked");
			if (showCountChecked) {
				$('#count').animate({opacity: 1}, 100);//show(100);
			}
			else {
				$('#count').animate({opacity: 0}, 100);//hide(100);
			}
		}
		
		function updateCount() {
			newCount = parseInt($('#count').html()) + deck[deckPosition].countValue;
			$('#count').html(newCount);
		}
		
		function initializeDeck() {
			deck = new Array();
			for ( i = 0; i < 52; i++) {
				cardVal = (i % 13) + 1;
				card = {"cardValue": cardVal, "cardSuit": parseInt(i / 13) + 1, "countValue": getCardCountValue(cardVal)}; //the next card in order
				randomIndex = (parseInt(Math.random() * 100) % (deck.length + 1)); //a random place to insert the card
				deck.splice(randomIndex, 0, card);
			}
		}
		
		function getCardCountValue(cardValue) {
			countValue = 100; //initialize to a ridiculous value. fail fast
			if (cardValue > 1 && cardValue <= 6) {
				countValue = 1;
			}
			else if (cardValue > 6 && cardValue <= 9) {
				countValue = 0;
			}
			else if ((cardValue > 9 && cardValue <= 13) || cardValue == 1) {
				countValue = -1;
			}
			else {
				alert("uh...no. brought to you by: getCardCountValue (value:" + cardValue + ")");
			}
			return countValue;
		}
		
		function getDisplayedCard(obj) {
			bgPos = obj.css('background-position');
			xPos = getSpritePosition(bgPos, true);
			return parseInt(xPos/-73) + 1;
		}
		
		//card num is value of card. ie: A=1, 2=2,..., J=11, Q=12, K=13
		//suits are: 1=club, 2=spade, 3=heart, 4=diamond
		function displayCard(obj, cardNum, suit) {
			//-73 because the xPos values increase negatively as the sprite display window slides right
			xPos = ((cardNum - 1) * -73) - 1; 
			setXPos(obj, xPos);
			yPos = ((suit - 1) * -98) - 1; 
			setYPos(obj, yPos);
		}
		
		function setXPos(obj, valToSet) {
			bgPos = obj.css('background-position');
			yPos = getSpritePosition(bgPos, false) + "px";
			obj.css("background-position", valToSet + "px " + yPos);
		}
		
		function setYPos(obj, valToSet) {
			bgPos = obj.css('background-position');
			xPos = getSpritePosition(bgPos, true) + "px";
			obj.css("background-position", xPos + " " + valToSet + "px");
		}
		
		function getSpritePosition(bgPos, wantXPos) {
			bgPos = bgPos.replace(/px/g, "");
			posArr = bgPos.split(" ");
			toReturn = -1;
			if (wantXPos) {
				toReturn = parseInt(posArr[0]);
			}
			else {
				toReturn = parseInt(posArr[1]);
			}
			return toReturn;
		}