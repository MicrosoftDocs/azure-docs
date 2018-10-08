---
title: What is Language Understanding (LUIS) - Azure Cognitive Services | Microsoft Docs
description: Language Understanding (LUIS) is a cloud-based API service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information. A client application for LUIS is any conversational application that communicates with a user in natural language to complete a task. Examples of client applications include social media apps, chat bots, and speech-enabled desktop applications.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: overview
ms.date: 10/06/2018
ms.author: diberry
#Customer intent: As a developer incorporating LUIS into my client application, I want to understand what natural language processing (LUIS) is, so that I can determine if it will meet my Cognitive Language needs.
---

# What is Language Understanding (LUIS)?

Language Understanding (LUIS) is a cloud-based API service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information. 

A client application for LUIS is any conversational application that communicates with a user in natural language to complete a task. Examples of client applications include social media apps, chat bots, and speech-enabled desktop applications.  

![Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)](./media/luis-overview/luis-entry-point.png "Conceptual image of 3 client applications working with Cognitive Services Language Understanding (LUIS)")

## Use LUIS in a chat bot

<a name="Accessing-LUIS"></a>

Once the LUIS app is published, a client application sends utterances (text) to the LUIS natural language processing endpoint [API][endpoint-apis] and receives the results as JSON responses. A common client application for LUIS is a chat bot.


![Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP)](./media/luis-overview/luis-overview-process-2.png "Conceptual imagery of LUIS working with Chat bot to predict user text with natural language understanding (NLP")

|Step|Action|
|:--|:--|
|1|The client application sends the user _utterance_ (text in their own words), "I want to call my HR rep." to the LUIS endpoint as an HTTP request.|
|2|LUIS applies the learned model to the natural language text to provide intelligent understanding about the user input. LUIS returns a JSON-formatted response, with a top intent, "HRContact". The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the Contact Type entity.|
|3|The client application uses the JSON response to make decisions about how to fulfill the user's requests. These decisions can include some decision tree in the bot framework code and calls to other services. |

The LUIS app provides intelligence so the client application can make smart choices. LUIS doesn't provide those choices. 

<!--

### Example of JSON endpoint response

The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the following **Contact Type** entity. 

```JSON
{
  "query": "I want to call my HR rep.",
  "topScoringIntent": {
    "intent": "HRContact",
    "score": 0.921233
  },
  "entities": [
    {
      "entity": "call",
      "type": "Contact Type",
      "startIndex": 10,
      "endIndex": 13,
      "score": 0.7615982
    }
  ]
}
```
-->

<a name="Key-LUIS-concepts"></a>
<a name="what-is-a-luis-model"></a>

## Natural language processing

A LUIS app contains a domain-specific natural language model. You can start the LUIS app with a prebuilt domain model, build your own model, or blend pieces of a prebuilt domain with your own custom information.

* **Prebuilt model** LUIS has many prebuilt domain models including intents, utterances, and prebuilt entities. You can use the prebuilt entities without having to use the intents and utterances of the prebuilt model. [Prebuilt domain models](luis-how-to-use-prebuilt-domains.md) include the entire design for you and are a great way to start using LUIS quickly.

* **Custom Entities** LUIS gives you several ways to identify your own custom intents and entities including machine-learned entities, specific or literal entities, and a combination of machine-learned and literal.

## Build the LUIS model
Build the model with the [authoring](https://aka.ms/luis-authoring-apis) APIs or with the LUIS portal.

The LUIS model begins with categories of user intentions called **[intents](luis-concept-intent.md)**. Each intent needs examples of user **[utterances](luis-concept-utterance.md)**. Each utterance can provide a variety of data that needs to be extracted with **[entities](luis-concept-entity-types.md)**. 

|Example user utterance|Intent|Entities|
|-----------|-----------|-----------|
|"Book a flight to __Seattle__?"|BookFlight|Seattle|
|"When does your store __open__?"|StoreHoursAndLocation|open|
|"Schedule a meeting at __1pm__ with __Bob__ in Distribution"|ScheduleMeeting|1pm, Bob|

<!--
## What is a natural language model?

A model begins with a list of general user intentions, called _intents_, such as "Book Flight" or "Contact Help Desk." You provide user's example text, called _example utterances_ for the intents. Then mark significant words or phrases in the utterance, called _entities_.


A model includes:

* **[intents](#intents)**: categories of user intentions (overall intended action or result)
* **[entities](#entities)**: specific types of data in utterances such as number, email, or name contained in text
* **[example utterances](#example-utterances)**: example text a user might enter in the client application

### Intents 

An [intent](luis-how-to-add-intents.md), short for _intention_, is a purpose or goal expressed in a user's utterance, such as booking a flight, paying a bill, or finding a news article. You create an intent for each action. A LUIS travel app may define an intent named "BookFlight." Each prediction query includes the top scored intent. 

The client application can use the top scoring intent to trigger an action. For example, when "BookFlight" intent is returned from LUIS, a client application could trigger an API call to an external service for booking a plane ticket.

### Entities

An [entity](luis-how-to-add-entities.md) represents detailed information found within the utterance that is relevant to the user's request. For example, in the utterance "Book a ticket to Paris",  a single ticket is requested, and "Paris" is a location. Two entities are found "a ticket" indicating a single ticket and "Paris" indicating the destination. 

After LUIS returns the entities found in the user’s utterance, the client application can use the list of entities as parameters to trigger an action. For example, booking a flight requires entities like the travel destination, date, and airline.
-->
<!--
### Example utterances

An example [utterance](luis-how-to-add-example-utterances.md) is text input from the user that the client application needs to understand. It may be a sentence, like "Book a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. Add 10 to 20 example utterances to each intent and mark entities in every utterance.

|Example user utterance|Intent|Entities|
|-----------|-----------|-----------|
|"Book a flight to __Seattle__?"|BookFlight|Seattle|
|"When does your store __open__?"|StoreHoursAndLocation|open|
|"Schedule a meeting at __1pm__ with __Bob__ in Distribution"|ScheduleMeeting|1pm, Bob|
-->
## Query prediction endpoint

After the model is built and published to the endpoint, the client application sends utterances to the published prediction [endpoint](https://aka.ms/luis-endpoint-apis) API. The API applies the model to the text for analysis. The API responds with the prediction results in a JSON format.  

The minimum JSON endpoint response contains the query utterance, and the top scoring intent. It can also extract data such as the following **Contact Type** entity. 

```JSON
{
  "query": "I want to call my HR rep.",
  "topScoringIntent": {
    "intent": "HRContact",
    "score": 0.921233
  },
  "entities": [
    {
      "entity": "call",
      "type": "Contact Type",
      "startIndex": 10,
      "endIndex": 13,
      "score": 0.7615982
    }
  ]
}
```

## Improve model prediction

After a LUIS model is published and receives real user utterances, LUIS provides several methods to improve prediction accuracy: [active learning](luis-concept-review-endpoint-utterances.md) of endpoint utterances, [phrase lists](luis-concept-feature.md) for domain word inclusion, and [patterns](luis-concept-patterns.md) to reduce the number of utterances needed.
<!--
### Active learning

In the [active learning](luis-how-to-review-endoint-utt.md) process, LUIS allows you to adapt the LUIS app to real-world utterances by selecting utterances it received at the endpoint for your review. You can accept or correct the endpoint prediction, retrain, and republish. LUIS learns quickly with this iterative process, taking the minimum amount of your time and effort. 

### Phrase lists 

LUIS provides [phrases lists](luis-concept-feature.md) so you can indicate important words or phrases of the model. LUIS uses these lists to add additional significance to those words and phrases that would otherwise not be found in the model.

### Patterns 

Patterns allow you to simplify an intent's utterance collection into common [templates](luis-concept-patterns.md) of word choice and word order. This allows LUIS to learn quicker by needing fewer example utterances for the intents. Patterns are a hybrid system of regular expressions and machine-learned expressions. 
-->
<a name="using-luis"></a>
<!--
## Authoring and accessing models
Author LUIS from the [authoring](https://aka.ms/luis-authoring-apis) APIs or from the LUIS portal. Query the published prediction endpoint of the model from the [endpoint](https://aka.ms/luis-endpoint-apis) APIs.
-->

## Development Lifecycle
LUIS provides tools, versioning, and collaboration with other LUIS authors to integrate into the full development life cycle at the level of the client application and the language model. 

## Implementing LUIS
LUIS, as a REST API, can be used with any product, service, or framework that makes an HTTP request. The following list contains the top Microsoft products and services used with LUIS.

The top client application for LUIS is:
* [Web app bot](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-3.0) quickly creates a LUIS-enabled chat bot to talk with a user via text input. Uses [Bot Framework][bot-framework] version [3.x](https://github.com/Microsoft/BotBuilder) or [4.x](https://github.com/Microsoft/botbuilder-dotnet) for a complete bot experience.

Tools to quickly and easily use LUIS with a bot:
* [LUIS CLI](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUIS) The NPM package provides authoring and predecition with as either a stand-alone command line tool or as import. 
* [LUISGen](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/LUISGen) LUISGen is a tool for generating strongly typed C# and typescript source code from an exported LUIS model.
* [Dispatch](https://aka.ms/dispatch-tool) allows several LUIS and QnA Maker apps to be used from a parent app using dispatcher model.
* [LUDown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown) LUDown is a command line tool that helps manage language models for your bot.

Other Cognitive Services used with LUIS:
* [QnA Maker][qnamaker] allows several types of text to combine into a question and answer knowledge base.
* [Bing Spell Check API](../bing-spell-check/proof-text.md) provides text correction before prediction. 
* [Speech service](../Speech-Service/overview.md) converts spoken language requests into text. 
* [Conversation learner](https://docs.microsoft.com/azure/cognitive-services/labs/conversation-learner/overview) allows you to build bot conversations quicker with LUIS.
* [Project personality chat](https://docs.microsoft.com/azure/cognitive-services/project-personality-chat/overview) to handle bot small talk.
<!--
## Other ways of implementing LUIS

A client application for LUIS is:
* [Windows Mixed Reality](https://docs.microsoft.com/windows/mixed-reality/) - learn more with this [Mixed reality course](https://docs.microsoft.com/windows/mixed-reality/mr-azure-303) with LUIS. 


Labs: 

-->
## Next steps

Author a new LUIS app with a [prebuilt](luis-get-started-create-app.md) or [custom](luis-quickstart-intents-only.md) domain. [Query the prediction endpoint](luis-get-started-cs-get-intent.md) of a public IoT app.

<!-- Reference-style links -->
[bot-framework]: https://docs.microsoft.com/bot-framework/
[flow]: https://docs.microsoft.com/connectors/luis/
[authoring-apis]: https://aka.ms/luis-authoring-api
[endpoint-apis]: https://aka.ms/luis-endpoint-apis
[qnamaker]: https://qnamaker.ai/