---
title: LUIS for non-NLP developers - Azure | Microsoft Docs
description: Understand LUIS terminology and actions for developers that are new to natural language processing.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/15/2018
ms.author: v-geberr
---

# LUIS apps for people new to natural language processing
LUIS is a REST-based API that makes predictions of text (500 characters max). The typical consumer of a LUIS app is a conversation-style application such as chat bot or virtual reality game. In the following example, the chat bot passes the user text to LUIS. 

```
user (1): Who is my Human Resources rep?
bot: For engineering, your HR rep is Tom Smith
user (2): When is Tom available? 
bot: Tom is available from 8 to 6 Eastern Standard Time
user (3): I want to schedule a meeting with Tom at 4pm
```

Each user submission in the previous conversation is passed from the bot to LUIS as the conversation happens -- meaning one user submission at a line. LUIS takes the user submission of text and the LUIS app's trained model to predict the user's overall intention and any specific data. The prediction is returned as a JSON response. 

Creating a LUIS app is called authoring the model. Using the LUIS app is known as querying the endpoint. 

## Model development
The model is the configuration of LUIS used to predict text for your specific domain. The domain is the subject area of the app. In the previous bot conversation, the domain is Human resources. 

### Models begin with intentions
Your model begins with user intentions. An intention is what the user is trying to ask for or do, within the conversational, natural language text. 

Different examples of a user's request that can be grouped into the same intention are called **Intents**.

|Examples of the HRContact intent in the Company app|
|--|
|Who is my Human Resources rep?|
|Is anyone in HR available now?|
|I want to schedule a meeting with Tom Smith in HR.|

You can begin the model with just a single domain-specific intent such as HRContact. The only intent outside the domain of your app is the None intent. Since a domain is specific, such as a company's Human Resources (HR), LUIS doesn't guess what those utterances are. You need to provide a few examples of utterances. 

If you want to quickly try LUIS without developing a model of your own, add a prebuilt model to a new app. This allows you to see what the model looks like as well as test it. 

## An intent(ion) needs example utterances
Once the different user intents are identified, provide examples of text (called utterances) a user might submit to LUIS for each intent. 

This teaches LUIS how utterances are constructed, specifically what words, word order, and utterance length. This isn't meant to be a hard limit of all examples but rather a short list of utterances, as a guideline. LUIS learns from the examples. Giving too many examples may incorrectly teach LUIS by reinforcing information derived from the example utterances that you didn't want LUIS to learn. 

> ![NOTE]
> * The LUIS authoring API documentation uses the word label when meaning utterance. 

An utterance is made up of words, spaces, and punctuation. Depending on the culture (spoken language) of the app, there can be a smaller unit (called a token) than a word. See [Tokenization](luis-supported-languages.md#tokenization) for more information.

## An entity is a piece of data inside an utterance
After the intents with example utterances are created, the next step of building the model is to define the data to pull out of the utterance. Each piece of data can be categorized by an **Entity**. 

Prebuilt entities such as number, email, URL, and datetimeV2 are provided by LUIS. 

There are several types of custom, domain-specific data. If the data can change form but means the same thing, you need to mark the data in the example utterances. 

The following table shows example utterances with the **Contact type** entity marked:

|Contact type entity marked with bold characters|
|--|
|I would like an HR rep or his manager to **call** me.| 
|**Text** me the email address of my HR rep.|
|Send me an **email** with the list of HR reps for the local engineers' group.|

## Train the model
The model of intents, entities, and marked example utterances is not ready to be published (deployed) yet. It needs to be trained and tested first. Training applies the current model, including any changes, to the example utterances. 

Generally, as long as each intent has at least one example utterance, training succeeds.

## Publish the model
Once the model is successfully trained, it can be published. Publishing is the process of making the model available from an HTTPS endpoint. 

A LUIS app can have more than one version but publishes only the active version to the staging or production endpoint. 

## Test the model
There are three types of model testing: interactive, batch, and endpoint testing. It is important that the utterances used for testing are not the same utterances used as examples. 

The most important test is submitting utterances to the endpoint. This may not seem like testing to the conventional developer. After an utterance's prediction, if the prediction had a low score or a high score but too close to another intent's, the utterance is moved to the Review endpoint utterances list. By using the published endpoint for testing, LUIS can help you find utterances with low confidence. 

Interactive and batch testing utterances are not put on the list of utterances to review due.  

Interactive testing is only found in the LUIS website and is meant for testing utterances one at a time. The test includes intent and entity information. You can also compare it to the same query sent to the endpoint.

Batch testing is only found in the LUIS website and sends thousands of utterances to LUIS for prediction. 

## Improve app performance
Improving app performance is the process of increasing the prediction score of an intent. The first, and most powerful way, to increase the prediction score is to review endpoint utterances (mentioned in the preceding section).

A second method is to create a Phrase list. A phrase list is a list of words that you want to emphasis. These can be words that are important in the domain or in the word choice of your users. 

## Patterns
If intents are still not getting a high prediction score, consider added patterns to your app. This allows you to define common utterance word choice and phrase composition that follows a pattern. Entities and ignorable text are configured using regular expressions.

## Querying at the endpoint
Once the model is published, it is available from an HTTPS URL. You can send an utterance to the endpoint URL and receive a prediction. The endpoint URL is shown at the bottom of the Publish page in the LUIS website. The API documentation also has a test console on each page for each region. 

## Using the APIs
The APIs are divided between the authoring APIs and the endpoint APIs. 

The authoring APIs do not have a limit for usage but you must use the correct key, found on your User page in the LUIS website. 

The endpoint APIs have a limit for usage. While you are beginning with LUIS, use your authoring key for endpoint queries, up to 1000 queries. After that, you will either get a 403 - out of quota for the month or you can create a subscription key and associate it with your LUIS app on the Publish page of the LUIS website. 

Both sets of APIs call the key the same thing, **Ocp-Apim-Subscription-Key**. It is important to understand that the value of the key needs to change based on whether you are accessing the authoring or endpoint API. 
