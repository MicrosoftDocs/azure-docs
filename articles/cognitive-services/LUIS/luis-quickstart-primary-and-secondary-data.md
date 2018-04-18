---
title: Create a LUIS app to get secondary data - Azure | Microsoft Docs 
description: Learn how to create a simple LUIS app using intents and entities to extract data. 
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/13/2018
ms.author: v-geberr;
--- 

# Simple app with primary and secondary data
This simple app has two intents and one entity . This app demonstrates how to pull data out of an utterance. In the utterance, `Send a message telling them to stop`, the intent (primary data) is to send a message and the entity (secondary data) is the content of the message, `telling them to stop`.  

When the intent and entities of the utterance are identified, LUIS is done. The calling application or chat bot takes that identification and fulfills the request -- in whatever way the app or chat bot is designed to do. 

## Create a new app
1. Log in to the [LUIS][LUIS] website. Make sure to log into the region where you need the LUIS endpoints published.

2. On the [LUIS][LUIS] website, select **Create new app**.  

    ![LUIS apps list](./media/luis-quickstart-primary-and-secondary-data/app-list.png)

3. In the pop-up dialog, enter the name `MyCommunicator`. 

4. When that process finishes, the app shows the **Intents** page with the **None** Intent. 

    ![Intents page](./media/luis-quickstart-primary-and-secondary-data/intents-list.png)

## Create a new intent

1. On the **Intents** page, select **Create new intent**. 

2. Enter the new intent name `SendMessage`. This intent should be selected any time a user wants to send a message.

    By creating an intent, you are creating the primary category of information that you want to identify. Giving the category a name allows any other application that uses the LUIS query results to use that category name to find an appropriate answer or take appropriate action. LUIS won't answer these questions, only identify what type of information is being asked for in natural language. 

3. Add seven utterances to the `SendMessage` intent that you expect a user to ask for, such as:

    | Example utterances|
    |--|
    |Reply with I got your message, I will have the answer tomorrow|
    |Send message of When will you be home?|
    |Text that I am busy|
    |Tell them that it needs to be done today|
    |IM that I am driving and will respond later|
    |Compose message to David that says When was that?|
    |say greg hello|

## Add utterances to None intent

The LUIS app currently has no utterances for the **None** intent. It needs utterances that you don't want the app to answer, so it has to have utterances in the **None** intent. Do not leave it empty. 
    
Select **Intents** from the left panel. Select the **None** intent. Add three utterances that your user might enter but are not relevant to your app. Some good **None** utterances are:

| Example utterances|
|--|
|Cancel!|
|Good bye|
|What is going on?|

In your LUIS-calling application, such as a chat bot, if LUIS returns the **None** intent for an utterance, your bot can ask if the user wants to end the conversation. The bot can also give more directions for continuing the conversation if the user doesn't want to end it. 

## Create a message entity 
1. Select **Intents** from the left menu.

2. Select `SendMessage` from the intents list.

3. In the utterance, `Reply with I got your message, I will have the answer tomorrow`, select the first word of the message body, `I`, and the last word of the message body, `tomorrow`. All these words are selected for the message and a drop-down menu appears with a text box at the top.

4. Enter the entity name `Message` in the text box.

    ![Create new entity](./media/luis-quickstart-primary-and-secondary-data/create-message-entity.png)

5. Select **Create new entity** in the drop-down menu then select enter. The purpose of the entity is to pull out the text that is the body of the message. In this LUIS app, the text message is at the end of the utterance, but the utterance can be any length, and the message can be any length. 

6. In the pop-up window, the default entity type is **Simple** and the entity name is `Message`. Keep these settings and select **Done**.

    ![Verify entity type](./media/luis-quickstart-primary-and-secondary-data/entity-type.png)

7. Now that the entity is created, and one utterance is labeled, you can label the rest of the utterances with that entity. Continue to label all the utterances with the entity (secondary data). Select an utterance, then select the first and last word of a message. In the drop-down menu, Select the entity, `Message`. The message is now labeled in the entity. 

    ![Label utterance with existing entity](./media/luis-quickstart-primary-and-secondary-data/label-utterance.png)

8. Continue to label all message phrases in the remaining utterances.

    ![All message utterances labeled](./media/luis-quickstart-primary-and-secondary-data/labeled-utterances.png)

## Train the LUIS app
In the top right side of the LUIS website, select the **Train** button.

![Train button](./media/luis-quickstart-primary-and-secondary-data/train-button.png)

Training is complete when you see the green status bar at the top of the website confirming success.

![Trained status bar](./media/luis-quickstart-primary-and-secondary-data/trained.png)

## Publish the app to get the endpoint URL
In the top right side of the LUIS website, select the **Publish** button. Select the **Publish to product slot**. Publishing is complete when you see the green status bar at the top of the website confirming success.

## Query the endpoint with a different utterance
On the **Publish** page, select the **endpoint** link at the bottom of the page. This action opens another browser window with the endpoint URL in the address bar. Go to the end of the URL in the address and enter `When do you open next?`. The last querystring parameter is `q`, the utterance **q**uery. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `SendMessage` utterances.

```
{
  "query": "text I'm driving and will be 30 minutes late to the meeting",
  "topScoringIntent": {
    "intent": "SendMessage",
    "score": 0.987501
  },
  "intents": [
    {
      "intent": "SendMessage",
      "score": 0.987501
    },
    {
      "intent": "None",
      "score": 0.111048922
    }
  ],
  "entities": [
    {
      "entity": "i ' m driving and will be 30 minutes late to the meeting",
      "type": "Message",
      "startIndex": 5,
      "endIndex": 58,
      "score": 0.162995353
    }
  ]
}
```

## What has this LUIS app accomplished?
This app, with just two intents and one entity, identified a natural language query intention and returned the message data. 

The JSON result identifies the top scoring intent `SendMessage` with a score of 0.987501. All scores are between 1 and 0, with the better score being close to 1. The `None` intent's score is 0.111048922, much closer to zero. 

The message data has a type, `Message`, as well as a value, `i ' m driving and will be 30 minutes late to the meeting`. 

Your chat bot now has enough information to determine the primary action, `SendMessage`, and a parameter of that action, the text of the message. 

## Where is this LUIS data used? 
LUIS is done with this request. The calling application, such as a chat bot, can take the topScoringIntent result and the data from the entity to send the message through an 3rd party API. There are other programmatic options for the bot or calling application. LUIS doesn't do that work. LUIS only determines what the user's intention is. 


## Next steps

> [!div class="nextstepaction"]
> [Learn more about entities](luis-concept-entity-types.md)


<!--References-->
[LUIS]:luis-reference-regions.md
