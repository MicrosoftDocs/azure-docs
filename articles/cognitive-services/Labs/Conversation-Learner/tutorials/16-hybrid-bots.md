---
title: How to use Conversation Learner with other bot building technologies - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use Conversation Learner with other bot building technologies.
services: cognitive-services
author: mattm
manager: larsliden
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 07/13/2018
ms.author: nitinme
---

# How to use Conversation Learner with other bot building technologies

This tutorial covers how to use Conversation Learner with other bot building technologies and how memory (or state) can be shared between these technologies. 

## Video

[![Hybrid Bots Tutorial Preview](https://aka.ms/cl_Tutorial_v3_Hybrid_Applications_Preview)](https://aka.ms/cl_Tutorial_v3_Hybrid_Applications)

## Requirements
This tutorial requires using the bot emulator to create log dialogs, not the Log Dialog Web UI. More information on setting up the Bot Framework Emulator is available [here](https://docs.microsoft.com/azure/bot-service/bot-service-debug-emulator?view=azure-bot-service-4.0). 

This tutorial requires that the hybrid tutorial bot is running:

	npm run tutorial-hybrid

## Details

While Conversation Learner is in control, all state relative to the Conversation Learner Session must be stored in the Conversation Learner’s memory manager. This is necessary as the machine learning uses the state to determine how to drive the conversation. External state can be passed into the Conversation Learner in the OnSessionStartCallback that is called when the session begins. Internal state can be returned out by the OnSessionEndCallback when the session terminates.

You can almost think of Conversation Learner as a function call that takes some initial state and returns values.

In this example, you will create a hybrid bot using two different systems:
1. A Conversation Learner Model <br/>
	Uses conversation learner model to determine the next action of the bot based on the current session.This part of the bot takes one piece of initial state `isOpen` (which indicates whether a store is open or closed) and returns another piece of state `purchaseItem` (the name of an item the user purchases).

2. Text matching <br />
	Simply looks at incoming text for specific strings and responds.This part of the bot manages the Bots' other storage mechanisms and is responsible for starting the CL session. Specifically it manages three variables: `usingConversationLearner`, `storeIsOpen`, and `purchaseItem`.

Let’s start by taking a look at the model used in this demo.

### Open the demo

In the web UI, click on "Import Tutorials" and select the model named "Tutorial-16-HybridBot".

## Entities

Open the entities page and notice two entities: `isOpen` and `purchaseItem`

To understand how these entities are used, open the file: `C:\<installedpath>\src\demos\tutorialHybrid.ts` to look at the callbacks.

Notice that the code in `OnSessionStartCallback` copies the value of `storeIsOpen` from BotBuilder conversation storage as the value of the `isOpen` entity so it is available to Conversation Learner. See the following code:

![](../media/tutorial17_sessionstart.PNG)

Likewise, the code in `OnSessionEndCallback` (if the session was ended due to a learned activity and not merely a timeout) copies the value of entity `purchaseItem` out to BotBuilder storage `purchaseItem`. See the following code:

![](../media/tutorial17_sessionend.PNG)

Now let's look at the Actions.

## Actions

Notice the model has four actions.

The intended rules for the actions are as follows:

- If the `isOpen` entity is set, the Bot will ask "What would you like to buy?" and store that in the `puchaseItem` slot.
- If `isOpen` isn’t set, the Bot will say "I’m sorry we’re closed".
- The other two Actions are of the type `END_SESSION`.
- The END_SESSION Action indicates to ConversationLearner that the conversation has completed.

### Overall Bot Logic

First you see that if the Bot state’s `usingConversationLearner` flag has been set, we pass control to Conversation Learner. If not, we pass control to something else.  In this example, we’re showing simple text matching, but this could be any other Bot technology including LUIS, QnA maker and even another instance of Conversation Learner.

We need a way for the user to open and close the store, so we do a string compare with "open store" and "close store" and set the "storeIsOpen" flag.

Next, we need a way to trigger handing control over to our Conversation Learner Model. When we match to the "shop" string we do the following:
- Set the `usingConversationLearner` flag in the Bot’s memory.
- Call the "StartSession" method on our Conversation Learner Model.  This will trigger the "onSessionStartCallback" which will initialize the `isOpen` entity value

See below:

![](../media/tutorial17_useConversationLearner.PNG)

We also do a text match to "history" which will display that last purchase item.
Finally, if anything else is typed, we display the available user commands

## Train Dialog

For this tutorial, the model is already pre-trained.  We will test the full bot to see the effect of the start and end session callbacks in practice.

## Testing the Bot

Unlike single Conversation Leaner model bots you won’t be able to test this in the Conversation Learner UI as it can only show what’s handled by the Conversation Learner Model.

### Install the Bot framework emulator

- Go to [https://github.com/Microsoft/BotFramework-Emulator](https://github.com/Microsoft/BotFramework-Emulator).
- Download and install the emulator.

### Configure the emulator

- Open the emulator and ensure the URL is targeting the same port your bot is running on. Likely: `http://localhost:3978/api/messages`

### Test 

#### Scenario 1: Store is closed
1. Enter 'shop'. This is handled by the text matching and will give control to the Conversation Learner model.
2. Enter 'hello'.  Because `isOpen` value is not set, the bot will say "I’m sorry we’re closed" and end the session.

#### Scenario 2: Store is open
1. Enter 'open store'.  This will set the `isOpen` to true.
1. Enter 'shop'.
1. Enter 'hello'.  Because `isOpen` value is set to true, the bot will say "What would you like to buy?"
1. Enter 'chair'. 'chair' will be saved into CL memory as the entity `purchaseItem`. The end session callback is invoked which copies this value out to the conversation store.
1. Enter 'history'.  The bot will say 'You bought chair' as this was your last `purchaseItem`.

## Conclusion

With what you have learned above you should be able to combine Conversation Learner with any other Bot building technology.

## Next steps

> [!div class="nextstepaction"]
> [Branching and undo](./17-branch-undo.md)
