---
title: How to use Multi-value Entities with a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use Multi-value Entities with a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to use multi-value entities with a Conversation Learner model
This tutorial shows the Multi-value property of Entities.

## Video

[![Multi Value Entities Tutorial Preview](https://aka.ms/cl_Tutorial_v3_MultiValued_Preview)](https://aka.ms/cl_Tutorial_v3_MultiValued_Preview)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details
Multi-value Entities accumulate values in a list, rather than storing a single value.  These Entities are useful when users can specify more than one value. Toppings on a pizza for example.

Entities marked as Multi-value will have each recognized instance of the Entity appended to a list in the Bot's memory. Subsequent recognition appends to the Entity's value, rather than overwriting.

## Steps

### Create the Model

1. In the Web UI, click New Model
2. In Name, enter MultiValueEntities. Then click Create.

### Create an Entity

1. Click Entities, then New Entity.
2. In Entity Name, enter Toppings.
3. Check Multi-valued.
	- Multi-value entities accumulate one or more values in the Entity.
2. Check Negatable.  
    - This will allow the user to remove toppings from the accumulated list of their pizza toppings.
3. Click Create.

![](../media/tutorial6_entities.PNG)

### Create two Actions

1. Click Actions, then New Action.
2. Type 'Here are your toppings: $toppings' for the Bot's Response.
3. Click Create.

Then create the second Action.

1. Click Actions, then New Action to create a second Action.
2. Type 'What toppings would you like?' for the Bot's Response.
3. Add toppings to the Disqualifying Entities.
4. Click Create.

Now you have two actions.

![](../media/tutorial6_actions.PNG)

### Train the Bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hi'.
3. Click Score Actions, and select 'What toppings do you want?'
4. Enter 'mushrooms and cheese'. 
	- You can label zero, one or more than one of the entities.
5. Click 'cheese', and select +Toppings.
6. Click 'mushrooms', and select +Toppings.
5. Click Score Actions.
	- The two values are now present in the Toppings entity. 
6. Select 'Here are your toppings: $Toppings'.

Now, it's add some more toppings.

7. Type 'add peppers' from the user.
	- Click on 'peppers' under Entity Detection, and select Toppings.
8. Click Score Actions.
	- 'peppers' now shows up as an additional value in Toppings.
9. Select 'Here are your toppings: $Toppings'.

Let's remove a topping and add one:

2. Type 'remove peppers and add sausage'.
1. Click on 'cheese' and click on the -toppings to remove it.
3. Click Score Actions.
	- Notice 'cheese' has been deleted.
6. Select 'Here are your toppings: $Toppings' from the available responses.

## Next steps

> [!div class="nextstepaction"]
> [Built-in entities](./7-built-in-entities.md)
