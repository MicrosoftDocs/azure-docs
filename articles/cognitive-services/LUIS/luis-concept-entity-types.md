---
title: Entity types - LUIS
titleSuffix: Azure Cognitive Services
description: "Entities extract data from the utterance. Entity types give you predictable extraction of data. There are two types of entities: machine-learned and non-machine-learned. It is important to know which type of entity you are working with in utterances."  
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/25/2019
ms.author: diberry
---
# Entities and their purpose in LUIS

The primary purpose of entities is to give the client application predictable extraction of data. An _optional_, secondary purpose is to boost the prediction of the intent with descriptors. 

There are two types of entities: 

* machine-learned - from context
* non-machine-learned - for exact text matches

Always begin with a machine-learned entity because that provides the widest range of data extraction choices.

## Entity compared to intent

The entity represents a data concept inside the utterance that you want extracted. 

Consider the following 3 utterances:

|Utterance|Data extracted|Explanation|
|--|--|--|
|`Help`|-|Nothing to extract.|
|`Send Bob a present`|Bob, present|Bob is definitely important to completing the task. The present may be enough information or the bot may need to clarify what the present is with a follow-up question.|
|`Send Bob a box of chocolates.`|The two important pieces of data, Bob and the box of chocolates, is important to completing the user's request.|

An utterance can include many entities or none at all. A client application _may_ need the entity to perform its task. 

By comparison, the prediction of the intent for an utterance is _required_ and represents the entire utterance. LUIS requires example utterances are contained in an intent. If the primary intention of the utterance isn't important to the client application, add all the utterances to the None intent. 

If you find, later in the app lifecycle, you want to break out the utterances, you can easily do that. This can be to organize the utterances while you are authoring, or it can be to use the predicted intention in the client application. 

There is no requirement to use the predicted intent in the client application, but it is returned as part of the prediction endpoint response.

## Entities represent data

Entities are data you want to pull from the utterance. This can be a name, date, product name, or any group of words. 

|Utterance|Entity|Data|
|--|--|--|
|Buy 3 tickets to New York|Prebuilt number<br>Location.Destination|3<br>New York|
|Buy a ticket from New York to London on March 5|Location.Origin<br>Location.Destination<br>Prebuilt datetimeV2|New York<br>London<br>March 5, 2018|

## Entities are optional but highly recommended

While intents are required, entities are optional. You do not need to create entities for every concept in your app, but only for those required for the client application to take action. 

If your utterances do not have details your bot needs to continue, you do not need to add them. As your app matures, you can add them later. 

If you're not sure how you would use the information, add a few common prebuilt entities such as [datetimeV2](luis-reference-prebuilt-datetimev2.md), [ordinal](luis-reference-prebuilt-ordinal.md), [email](luis-reference-prebuilt-email.md), and [phone number](luis-reference-prebuilt-phonenumber.md).

## Design entities for decomposition

Begin your entity design with a machine-learned entity. This allows for easy design growth and changes of your entity over time. Add **subcomponents** (child entities) with **constraints** and **descriptors** to complete the entity design. 

Designing for decomposition allows LUIS to return a deep degree of entity resolution to your client application. This allows your client-application to focus on business rules and leave data resolution to LUIS.

### Machine-learned entities are primary data collections

Machine-learned entities are the top-level data unit. Subcomponents are child entities of machine-learned entities. 

**Constraints** are exact-text matching entities that apply rules to identify and extract data. **Descriptors** are features applied to boost the relevance of the words or phrases for the prediction.

<a name="composite-entity"></a>
<a name="list-entity"></a>
<a name="patternany-entity"></a>
<a name="prebuilt-entity"></a>
<a name="regular-expression-entity"></a>
<a name="simple-entity"></a>

## Types of entities

Choose the entity based on how the data should be extracted and how it should be represented after it is extracted.

|Entity type|Purpose|
|--|--|
|[**Machine-learned**](#composite-entity)|Parent grouping of entities, regardless of entity type. Machine-learned entities learn from context in the utterance. This makes variation of placement in example utterances significant. |
|[**List**](#list-entity)|List of items and their synonyms extracted with **exact text match**.|
|[**Pattern.any**](#patternany-entity)|Entity where end of entity is difficult to determine. |
|[**Prebuilt**](#prebuilt-entity)|Already trained to extract specific kind of data such as URL or email. Some of these prebuilt entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. If your specific culture or entity isn't currently supported, contribute to the project.|
|[**Regular Expression**](#regular-expression-entity)|Uses regular expression for **exact text match**.|

### Entity role defines context

An entity's role is the named alias based on context within the utterance. An example is an utterance for booking a flight that has two locations, origin and destination.

`Book a flight from Seattle to Cairo`

The two examples of a `location` entity need to be extracted. The client-application needs to know the type of location for each in order to complete the ticket purchase. The `location` entity needs two roles of `origin` and `destination` and both need to be marked in the example utterances. 

If LUIS finds the `location` but can't determine the role, the location entity is still returned. The client application would need to follow up with a question to determine which type of location the user meant. 

Multiple entities can exist in an utterance and can be extracted without using roles. If the context of the sentence indicates the entity value, then a role should be used.

If the utterance includes a list of locations, `I want to travel to Seattle, Cairo, and London.`, this is a list where each item doesn't have an additional meaning. 

## If you need more than the maximum number of entities 

If you need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS](luis-reference-regions.md#luis-website) website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/). 

## Entity prediction status

The LUIS portal shows when the entity, in an example utterance, has a different entity prediction than the entity you selected. This different score is based on the current trained model. 

## Next steps

Learn concepts about good [utterances](luis-concept-utterance.md). 

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.
