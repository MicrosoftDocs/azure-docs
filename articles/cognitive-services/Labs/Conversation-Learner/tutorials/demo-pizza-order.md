---
title: Demo Conversation Learner model, pizza order - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to create a demo Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# Demo: Pizza order
This demo illustrates a pizza ordering bot. It supports ordering of a single pizza with this functionality:

- recognizing pizza toppings in user utterances
- checking if pizza toppings are in stock or out of stock, and responding appropriately
- remembering pizza toppings from a previous order, and offering to - start a new order with the same toppings

## Requirements
This tutorial requires that the pizza order bot is running

	npm run demo-pizza

### Open the demo

In the Model list of the web UI, click on TutorialDemo Pizza Order. 

## Entities

We have created three entities.

- Toppings: will accumulate the toppings the user asked for. It includes the valid toppings that are in stock. It checks to see if a topping is in or out of stock.
- OutofStock: this is used to communicate back to the user that their selected topping is not in stock.
- LastToppings: once an order is placed, this entity is used to offer to the user the list of toppings on their order.

![](../media/tutorial_pizza_entities.PNG)

### Actions

We have created a set of actions including asking the user what they want on their pizza, telling them what they have added so far, etc.

There are also two API calls:

- FinalizeOrder: to place the order for the pizza
- UseLastToppings: to migrate the toppings from previous order 

![](../media/tutorial_pizza_actions.PNG)

### Training Dialogs
We have defined a handful of training dialogs. 

![](../media/tutorial_pizza_dialogs.PNG)

As an example, let's try a teaching session.

1. Click Train Dialogs, then New Train Dialog.
1. Enter 'order a pizza'.
2. Click Score Action.
3. Click to Select 'what would you like on your pizza?'
4. Enter 'mushrooms and cheese'.
	- Notice LUIS has labeled both as Toppings. If that was not correct, you could click to highlight, then correct it.
	- The '+' sign next to the entity means that it is being added to the set of toppings.
5. Click Score Actions.
	- Notice mushrooms and cheese are not in the memory for Toppings.
3. Click to Select 'you have $Toppings on your pizza'
	- Notice this is a non-wait action so the bot will ask for the next action.
6. Select 'Would you like anything else?'
7. Enter 'remove mushrooms and add peppers'.
	- Notice **mushroom** has a '-' sign next to it for it to be removed. And peppers has '+' to add it to toppings.
2. Click Score Action.
	- Notice **peppers** is now in bold as it is new. And **mushrooms** has been crossed out.
8. Click to Select 'you have $Toppings on your pizza'
6. Select 'Would you like anything else?'
7. Enter 'add peas'.
	- Peas are an example of a topping which is out of stock. Note that it is still labeled as a topping.
2. Click Score Action.
	- Peas show up as OutOfStock.
	- To see how this happened, let's open the code at C:\<\installedpath>\src\demos\demoPizzaOrder.ts. And note the EntityDetectionCallback method. This method is called after each topping to see if it is in stock. If not, it clears it from the set of toppings and adds to the OutOfStock entity. The inStock variable is defined above that method which has the list of in-stock toppings.
6. Select 'We don't have $OutOfStock'.
7. Select 'Would you like anything else?'
8. Enter 'no'.
9. Click Score Action.
10. Select 'FinalizeOrder' API call. 
	- This will call the 'FinalizeOrder' function defined in code. This clears toppings, and returns 'your order is on its way'. 
2. Enter 'order another'. We are starting a new order.
9. Click Score Action.
	- Note cheese and peppers are in the memory as toppings from the last order.
1. Select 'Would you like $LastToppings'.
2. Enter 'yes'
3. Click Score Action.
	- The bot wants to take the UseLastToppings action. That is the second of the two callback methods. It will copy the last order's toppings into toppings and clear last toppings. This is a way of remembering the last order, and if the user says they want another pizza, providing those toppings as options.
2. Click to Select 'you have $Toppings on your pizza'.
3. Select 'Would you like anything else?'
8. Enter 'no'.
4. Click Done Teaching.

![](../media/tutorial_pizza_callbackcode.PNG)

![](../media/tutorial_pizza_apicalls.PNG)

## Next steps

> [!div class="nextstepaction"]
> [Demo - VR app launcher](./demo-vr-app-launcher.md)
