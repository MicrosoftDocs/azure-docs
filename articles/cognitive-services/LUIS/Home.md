---
title: About Language Understanding (LUIS) in Azure | Microsoft Docs
description: Learn how to use Language Understanding (LUIS) to bring the power of machine learning to your applications.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/07/2017
ms.author: v-geberr
---

<!--
The three questions an overview article needs to answer are:

What is it?
Why should I care?
How can I get started?



Points of confusion:

What client application is : conversational application such as chat bot, VR app, cortana app
What LUIS application is: trained and published domain-specific model
What client does: sending 500 chars to LUIS and acting on response from LUIS
what LUIS does: receive text, apply pre-prediction changes (spelling, timezoneoffset), apply prediction model to text, respond with overall prediction and any extracted detailed data

what LUIS had to know before the client passes information: trained domain model with examples

what does "label" mean?
-->

# What is Language Understanding (LUIS)?
Language Understanding (LUIS) is a REST-based service that applies custom machine-learning to a user's natural language text to predict overall meaning and pull out relevant, detailed information. 

Your client application sends user text of what a person wants in their own words to LUIS in an HTTP request. LUIS applies your learned model to the natural language and returns a JSON format response. Your client application uses the JSON response to fulfill the user's requests. 

--Conceptual image of user in text conversation with chat bot--


## What is a LUIS app?
A LUIS app is a domain-specific language model designed by you and tailored to your needs. You can start with a prebuilt domain model, build your own, or blend pieces of a prebuilt domain with your own custom information.

A model starts with a list of general user intentions, called _intents_, such as "Book Flight" or "Contact Help Desk." You provide user's example phrases, called _utterances_ for the intents. Then mark significant words or phrases in the utterance, called _entities_, you want LUIS to return.

[Prebuilt domain models][prebuilt-domains] include all these pieces for you and are a great way to start using LUIS quickly.

<a name="Accessing-LUIS"></a>

## What does a LUIS endpoint query return?
Once your model is built and published, your client application sends utterances to the LUIS [endpoint API][endpoint-apis] and receives the prediction results as JSON responses.

Example of JSON endpoint response:

```JSON
{
  "query": "I want to be called by my HR rep.",
  "topScoringIntent": {
    "intent": "HRContact",
    "score": 0.921233
  },
  "entities": [
    {
      "entity": "called",
      "type": "Contact Type",
      "startIndex": 13,
      "endIndex": 18,
      "score": 0.7615982
    }
  ]
}
```

<a name="Key-LUIS-concepts"></a>

## What does a LUIS model include?
A LUIS model includes:

* **[intents](#intents)**: categories of user intentions (intended action or result)
* **[entities](#entities)**: specific types of data in utterances such as number, email, or name
* **[example utterances](#example-utterances)**: example text a user may enter in your client application

### Intents 
An [intent][add-intents], short for _intention_, is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You create an intent for each action. A travel app may define an intent named "BookFlight." Your client application can use the top scoring intent to trigger an action. For example, when "BookFlight" intent is returned from LUIS, your client application could trigger an API call to an external service for booking a plane ticket.

### Entities
An [entity][add-entities] represents detailed information that is relevant in the utterance. For example, in the utterance "Book a ticket to Paris", "Paris" is a location. After LUIS returns the entities found in the user’s utterance, your client application can use the list of entities as parameters to a triggered action. For example, booking a flight requires entities like the travel destination, date, and airline.

LUIS provides several ways to identify and categorize entities.

* **Prebuilt Entities** LUIS has many prebuilt domain models including intents, utterances, and [prebuilt entities][prebuilt-entities]. You can use the prebuilt entities without having to use the intents and utterances of the prebuilt model. The prebuilt entities save you time.

* **Custom Entities** LUIS gives you several ways to identify your own custom [entities][entity-concept] including simple entities, composite entities, list entities, regular expression entities, hierarchical entities, and key phrase entities.

### Example utterances
An example [utterance][add-example-utterances] is text input from the user that your app needs to understand. It may be a sentence, like "Book a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. Add example utterances to each intent and mark the entities of the utterance.

|Example user utterance|Intent|Entities|
|-----------|-----------|-----------|
|"Book a flight to __Seattle__?"|BookFlight|Seattle|
|"When does your store __open__?"|StoreHoursAndLocation|open|
|"Schedule a meeting at __1pm__ with __Bob__ in Distribution"|ScheduleMeeting|1pm, Bob|

## Improve prediction accuracy
After your application is published and receives real user utterances, LUIS provides several methods to improve prediction accuracy: [active learning](#active-learning), [phrase lists](#phrase-lists), and [patterns](#patterns).

### Active learning
In the [active learning](label-suggested-utterances.md) process, LUIS selects utterances it received at the endpoint it is relatively unsure for your review. You can accept or correct the intents and entities, retrain, and republish. LUIS learns quickly with this iterative process, taking the minimum amount of your time and effort. 

### Phrase lists 
LUIS provides [phrases lists](luis-concept-feature.md) so you can indicate words or phrases that are important to your model domain or words that are considered outliers or exceptions to your model domain. LUIS uses these lists to add additional significance to those words and phrases that would otherwise not be found in the model.

### Patterns 
Patterns allow you to simplify an intent's utterance collection into common [templates][patterns] of word choice and word order. This allows LUIS to learn quicker by needing fewer example utterances for the intents.  

## What technologies work with LUIS?
Several Microsoft technologies work with LUIS:

* [Bing Spell Check API][bing-spell-check-api] provides text correction before prediction. 
* [Bot Framework][bot-framework] allows a chat bot to talk with a user via text input. Select [3.x](https://github.com/Microsoft/BotBuilder) or [4.x](https://github.com/Microsoft/botbuilder-dotnet) SDK for a complete bot experience.
* [QnA Maker][qnamaker] allows several types of text to combine into a question and answer knowledge base.
* [Speech][speech] converts spoken language requests into text. Once converted to text, LUIS processes the requests. See [Speech SDK](https://aka.ms/csspeech) for more information.
* [Text Analytics][text-analytics] provides sentiment analysis and key phrase data extraction.

## Next steps
Create a [new LUIS app](LUIS-get-started-create-app.md).

<!-- Reference-style links -->
[create-app]:luis-get-started-create-app.md
[azure-portal]:https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account
[publish-app]:PublishApp.md#test-your-published-endpoint-in-a-browser
[luis-concept-entity-types]:luis-concept-entity-types.md
[add-example-utterances]: add-example-utterances.md
[prebuilt-entities]: pre-builtentities.md
[prebuilt-domains]: luis-how-to-use-prebuilt-domains.md
[label-suggested-utterances]: label-suggested-utterances.md
[intro-video]:https://aka.ms/LUIS-Intro-Video
[bot-framework]:https://docs.microsoft.com/bot-framework/
[speech]:../Speech/index.md
[flow]:https://docs.microsoft.com/connectors/luis/
[entity-concept]:luis-concept-entity-types.md
[add-intents]:Add-intents.md
[add-entities]:Add-entities.md
[authoring-apis]:https://aka.ms/luis-authoring-api
[endpoint-apis]:https://aka.ms/luis-endpoint-apis
[LUIS]:luis-reference-regions.md
[text-analytics]:https://azure.microsoft.com/services/cognitive-services/text-analytics/
[patterns]:luis-concept-patterns.md
[bing-spell-check-api]:https://azure.microsoft.com/services/cognitive-services/spell-check/
[qnamaker]:https://qnamaker.ai/