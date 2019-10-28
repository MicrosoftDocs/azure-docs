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
ms.date: 07/24/2019
ms.author: diberry
---
# Entity types and their purposes in LUIS

Entities extract data from the utterance. Entity types give you predictable extraction of data. There are two types of entities: machine-learned and non-machine-learned. It is important to know which type of entity you are working with in utterances. 

## Entity compared to intent

The entity represents a word or phrase inside the utterance that you want extracted. An utterance can include many entities or none at all. A client application may need the entity to perform its task or use it as a guide of several choices to present to the user. 

An entity:

* Represents a class including a collection of similar objects (places, things, people, events or concepts). 
* Describes information relevant to the intent


For example, a News Search app may include entities such as “topic”, “source”, “keyword” and “publishing date”, which are key data to search for news. In a travel booking app, the “location”, “date”, "airline", "travel class" and "tickets" are key information for flight booking (relevant to the "Book flight" intent).

By comparison, the intent represents the prediction of the entire utterance. 

## Entities help with data extraction only

You label or mark entities for the purpose of entity extraction only, it does not help with intent prediction.

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

## Label for word meaning

If the word choice or word arrangement is the same, but doesn't mean the same thing, do not label it with the entity. 

The following utterances, the word `fair` is a homograph. It is spelled the same but has a different meaning:

|Utterance|
|--|
|What kind of county fairs are happening in the Seattle area this summer?|
|Is the current rating for the Seattle review fair?|

If you wanted an event entity to find all event data, label the word `fair` in the first utterance, but not in the second.

## Entities are shared across intents

Entities are shared among intents. They don't belong to any single intent. Intents and entities can be semantically associated but it isn't an exclusive relationship.

In the utterance "Book me a ticket to Paris", "Paris" is an entity referring to location. By recognizing the entities that are mentioned in the user’s utterance, LUIS helps your client application choose the specific actions to take to fulfill the user's request.

## Mark entities in None intent

All intents, including the **None** intent, should have marked entities, when possible. This helps LUIS learn more about where the entities are in the utterances and what words are around the entities. 

## Entity status for predictions

The LUIS portal tells you when the entity in an example utterance is either different from the marked entity or is too close to another entity and therefore unclear. This is indicated by a red underline in the example utterance. 

For more information, see [Entity Status predictions](luis-how-to-add-example-utterances.md#entity-status-predictions). 

## Types of entities

LUIS offers many types of entities. Choose the entity based on how the data should be extracted and how it should be represented after it is extracted.

Entities can be extracted with machine-learning, which allows LUIS to continue learning about how the entity appears in the utterance. Entities can be extracted without machine-learning, matching either exact text or a regular expression. Entities in patterns can be extracted with a mixed implementation. 

Once the entity is extracted, the entity data can be represented as a single unit of information or combined with other entities to form a unit of information the client-application can use.

|Machine-learned|Can Mark|Tutorial|Example<br>Response|Entity type|Purpose|
|--|--|--|--|--|--|
|✔|✔|[✔](luis-tutorial-composite-entity.md)|[✔](luis-concept-data-extraction.md#composite-entity-data)|[**Composite**](#composite-entity)|Grouping of entities, regardless of entity type.|
|||[✔](luis-quickstart-intent-and-list-entity.md)|[✔](luis-concept-data-extraction.md#list-entity-data)|[**List**](#list-entity)|List of items and their synonyms extracted with exact text match.|
|Mixed||[✔](luis-tutorial-pattern.md)|[✔](luis-concept-data-extraction.md#patternany-entity-data)|[**Pattern.any**](#patternany-entity)|Entity where end of entity is difficult to determine.|
|||[✔](luis-tutorial-prebuilt-intents-entities.md)|[✔](luis-concept-data-extraction.md#prebuilt-entity-data)|[**Prebuilt**](#prebuilt-entity)|Already trained to extract various kinds of data.|
|||[✔](luis-quickstart-intents-regex-entity.md)|[✔](luis-concept-data-extraction.md#regular-expression-entity-data)|[**Regular Expression**](#regular-expression-entity)|Uses regular expression to match text.|
|✔|✔|[✔](luis-quickstart-primary-and-secondary-data.md)|[✔](luis-concept-data-extraction.md#simple-entity-data)|[**Simple**](#simple-entity)|Contains a single concept in word or phrase.|

Only Machine-learned entities need to be marked in the example utterances. Machine-learned entities work best when tested via [endpoint queries](luis-concept-test.md#endpoint-testing) and [reviewing endpoint utterances](luis-how-to-review-endoint-utt.md). 

Pattern.any entities need to be marked in the [Pattern](luis-how-to-model-intent-pattern.md) template examples, not the intent user examples. 

Mixed entities use a combination of entity detection methods.

## Machine-learned entities use context

Machine-learned entities learn from context in the utterance. This makes variation of placement in example utterances significant. 

## Non-machine-learned entities don't use context

The following non-machine learned entities do not take utterance context into account when matching entities: 

* [Prebuilt entities](#prebuilt-entity)
* [Regex entities](#regular-expression-entity)
* [List entities](#list-entity) 

These entities do not require labeling or training the model. Once you add or configure the entity, the entities are extracted. The tradeoff is that these entities can be overmatched, where if context was taken into account, the match would not have been made. 

This happens with list entities on new models frequently. You build and test your model with a list entity but when you publish your model and receive queries from the endpoint, you realize your model is overmatching due to lack of context. 

If you want to match words or phrases and take context into account, you have two options. The first is to use a simple entity paired with a phrase list. The phrase list will not be used for matching but instead will help signal relatively similar words (interchangeable list). If you must have an exact match instead of a phrase list's variations, use a list entity with a role, described below.

### Context with non-machine-learned entities

If you want context of the utterance to matter for non-machine learned entities, you should use [roles](luis-concept-roles.md).

If you have a non-machine-learned entity, such as [prebuilt entities](#prebuilt-entity), [regex](#regular-expression-entity) entities or [list](#list-entity) entities, which is matching beyond the instance you want, consider creating one entity with two roles. One role will capture what you are looking for, and one role will capture what you are not looking for. Both versions will need to be labeled in example utterances.  

## Composite entity

A [composite entity](reference-entity-composite.md) is made up of other entities, such as prebuilt entities, simple, regular expression, and list entities. The separate entities form a whole entity. 

## List entity

[List entities](reference-entity-list.md) represent a fixed, closed set of related words along with their synonyms. LUIS does not discover additional values for list entities. Use the **Recommend** feature to see suggestions for new words based on the current list. If there is more than one list entity with the same value, each entity is returned in the endpoint query. 

## Pattern.any entity

[Pattern.any](reference-entity-pattern-any.md) is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends.  

## Prebuilt entity

Prebuilt entities are built-in types that represent common concepts such as email, URL, and phone number. Prebuilt entity names are reserved. [All prebuilt entities](luis-prebuilt-entities.md) that are added to the application are returned in the endpoint prediction query if they are found in the utterance. 

The entity is a good fit when:

* The data matches a common use case supported by prebuilt entities for your language culture. 

Prebuilt entities can be added and removed at any time.

![Number prebuilt entity](./media/luis-concept-entities/number-entity.png)

[Tutorial](luis-tutorial-prebuilt-intents-entities.md)<br>
[Example JSON response for entity](luis-concept-data-extraction.md#prebuilt-entity-data)

Some of these prebuilt entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. If your specific culture or entity isn't currently supported, contribute to the project. 

### Troubleshooting prebuilt entities

In the LUIS portal, if a prebuilt entity is tagged instead of your custom entity, you have a few choices of how to fix this.

The prebuilt entities added to the app will _always_ be returned, even if the utterance should extract custom entities for the same text. 

#### Change tagged entity in example utterance

If the prebuilt entity is the same text or tokens as the custom entity, select the text in the example utterance and change the tagged utterance. 

If the prebuilt entity is tagged with more text or tokens than your custom entity, you have a couple of choices of how to fix this:

* [Remove example utterance](#remove-example-utterance-to-fix-tagging) method
* [Remove prebuilt entity](#remove-prebuilt-entity-to-fix-tagging) method

#### Remove example utterance to fix tagging 

Your first choice is to remove the example utterance. 

1. Delete the example utterance.
1. Retrain the app. 
1. Add back just the word or phrase that is the entity, which is marked as a prebuilt entity, as a complete example utterance. The word or phrase will still have the prebuilt entity marked. 
1. Select the entity in the example utterance on the **Intent** page, and change to your custom entity and train again. This should prevent LUIS from marking this exact text as the prebuilt entity in any example utterances that use that text. 
1. Add the entire original example utterance back to the Intent. The custom entity should continue to be marked instead of the prebuilt entity. If the custom entity is not marked, you need to add more examples of that text in utterances.

#### Remove prebuilt entity to fix tagging

1. Remove the prebuilt entity from the app. 
1. On the **Intent** page, mark the custom entity in the example utterance.
1. Train the app.
1. Add the prebuilt entity back to the app and train the app. This fix assumes the prebuilt entity isn't part of a composite entity.

## Regular expression entity 

A [regular expression entity](reference-entity-regular-expression.md) extracts an entity based on a regular expression pattern you provide.

## Simple entity

A [simple entity](reference-entity-simple.md) is a machine-learned value. It can be a word or phrase.
## Entity limits

Review [limits](luis-boundaries.md#model-boundaries) to understand how many of each type of entity you can add to a model.

## If you need more than the maximum number of entities 

You might need to use composite entities in combination with entity roles.

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder might have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass.

LUIS also provides the list entity type that isn't machine-learned but allows your LUIS app to specify a fixed list of values. See [LUIS Boundaries](luis-boundaries.md) reference to review limits of the List entity type. 

If you've considered these entities and still need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS](luis-reference-regions.md#luis-website) website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/). 

## Next steps

Learn concepts about good [utterances](luis-concept-utterance.md). 

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.
