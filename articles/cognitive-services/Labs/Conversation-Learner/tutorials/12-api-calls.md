---
title: How to use API calls with a Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use API calls with a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to add API calls to a Conversation Learner model

This tutorial shows how to add API calls to your model. API calls are functions that you define and write in your bot, and which Conversation Learner can call.

## Video

[![Tutorial 12 Preview](https://aka.ms/cl-tutorial-12-preview)](https://aka.ms/blis-tutorial-12)

## Requirements
This tutorial requires that the "tutorialAPICalls.ts" bot is running.

	npm run tutorial-api-calls

## Details

- API calls can read and manipulate entities.
- API calls have access to the memory manager object.
- API calls can also take arguments -- this allows re-using the same API call to serve different purposes.

### Open the demo

In the Model list of the web UI, click on Tutorial-12-APICalls. 

### Entities

We have defined one entity in the model called number.

![](../media/tutorial12_entities.PNG)

### API Calls
The code for the API calls is defined in the this file: C:\<installedpath\>\src\demos\tutorialAPICalls.ts.

![](../media/tutorial12_apicalls.PNG)

- The first API Callback is RandomGreeting. It returns a random greeting defined in the greeting variable.
- The Multiply API callback: It will multiply two numbers provided by the user. It then returns the result of the multiplication of the two numbers. This shows that API callbacks can take inputs. Note that memory manager is the first argument. 
- The ClearEntities API callback: clears the number entity to let the user enter the next number. This illustrates how API calls can manipulate entities.

### Actions
![](../media/tutorial12_actions.PNG)

We have created four Actions. Three of them are "Non-Wait" API Actions, with the fourth is a "Text" Action that asks the user a question similar to what we have seen in other tutorials. To see how each was created do the following:
1. On the left panel, click "Actions", then click on one of the four actions listed in the grid.
2. Notice the values of each field on the form that pops up.
3. Notice the `Refresh` button next to the API field.
	- If we were to stop the bot and make change to the APIs while the UI page is up, then you click `Refresh` to pick up the latest changes.

#### ClearEntities
This Action uses an API call to clear Entity Memory of our one and only `number` Entity.

#### Multiply
This Action uses an API call to multiply 2 numbers. The Action is setup to pass the value of the `number` Entity and the number 12 to the `Multiply` call back API.

#### RandomGreeting
This API call creates a formatted textual random greeting that also includes a photograph.

#### "What number do you want to multiply by 12"
This is the "Text" Action and it simply asks a question of the user. While this Action does not actually interact with an API, it prompts the user to respond with a number that will go into the memory of an Entity that can then be used by the "Multiply" action.


### Train Dialog

Let's walk through a teaching dialog.

1. On the left panel, click `Train Dialogs`, then the `New Train Dialog` button.
2. Type "hello".
3. Click the `Score Actions` button.
4. Select `RandomGreeting`. 
	- This will execute the Random Greeting API call.
5. Select `What number to do you want to multiply by 12?`
6. Type in a number, any number and only a number.
	- Notice that your number was automatically labeled as the `number` entity.
7. Click the `Score Actions` button.
8. Select the `Multiply` Action.
	- Notice the result of the multiplication by 12.
	- Notice that memory still contains the value you entered for `number`
9. Select the `Clear Entities` Action.
	- Notice that the Entity value for `number` has been cleared from memory.
10. Click the `Save` button.

You have now seen how to register API callbacks, their common patterns, and how to define arguments and associate values and entities in them.

## Next steps

> [!div class="nextstepaction"]
> [Cards part 1](./13-cards-1.md)
