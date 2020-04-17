---
title: Entity types - LUIS
description: An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities as a feature to those models.
ms.topic: conceptual
ms.date: 04/17/2020
---
# Extract data with entities

An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities as a feature to those models.

There are two types of entities:

* machine-learned entity
* non-machine-learned - for exact text matches, pattern matches, or detection by prebuilt entities

Machine-learned entities provide the widest range of data extraction choices. Non-machine-learned entities work by text matching and are used as a feature with a [constraint](#design-entities-for-decomposition) for a machine-learned entity or intent.

## Entities represent data

Entities are data you want to pull from the utterance, such as names, dates, product names, or any significant group of words. An utterance can include many entities or none at all. A client application _may_ need the data to perform its task.

Entities need to be labeled consistently across all training utterances for each intent in a model.

 You can define your own entities or use prebuilt entities to save time for common concepts such as [datetimeV2](luis-reference-prebuilt-datetimev2.md), [ordinal](luis-reference-prebuilt-ordinal.md), [email](luis-reference-prebuilt-email.md), and [phone number](luis-reference-prebuilt-phonenumber.md).

|Utterance|Entity|Data|
|--|--|--|
|Buy 3 tickets to New York|Prebuilt number<br>DestinationLocation|3<br>New York|
|Buy a ticket from New York to London on March 5|OriginLocation<br>Location.Destination<br>Prebuilt datetimeV2|New York<br>London<br>March 5, 2018|

### Entities are optional

While [intents](luis-concept-intent.md) are required, entities are optional. You do not need to create entities for every concept in your app, but only for those where the client application needs the data or the entity helps classify another entity or intent.

As your application develops and a new need for data is identified, you can add appropriate entities to your LUIS model later.

## Entity compared to intent

The entity represents a data concept inside the utterance that you want extracted. An intent classifies the entire utterance.

Consider the following 4 utterances:

|Utterance|Intent predicted|Entities extracted|Explanation|
|--|--|--|--|
|Help|help|-|Nothing to extract.|
|Send something|sendSomething|-|Nothing to extract. The model has not been trained to extract `something` in this context, and there is no recipient either.|
|Send Bob a present|sendSomething|`Bob`, `present`|The model has been constrained with the [personName](luis-reference-prebuilt-person.md) prebuilt entity, which has extracted the name `Bob`. A machine-learned entity has been used to extract `present`.|
|Send Bob a box of chocolates|sendSomething|`Bob`, `box of chocolates`|The two important pieces of data, `Bob` and the `box of chocolates`, have been extracted by entities.|

## Design entities for decomposition

Machine-learned entities allow you to design your app schema for decomposition, breaking a large concept into smaller components.

Designing for decomposition allows LUIS to return a deep degree of entity resolution to your client application. This allows your client application to focus on business rules and leave data resolution to LUIS.

### Machine-learned entities are primary data collections

[**Machine-learned entities**](tutorial-machine-learned-entity.md) are the top-level data unit. Components are child entities of machine-learned entities.

A machine-learned entity triggers based on the context learned through example utterances. **Constraints** are optional rules applied to a machine-learned entity that further constrains triggering based on the exact-text matching definition of a non-machine-learned entity such as a [List](reference-entity-list.md) or [Regex](reference-entity-regular-expression.md), or [prebuilt entity](luis-reference-prebuilt-entities.md).

For example, a `size` machine-learned entity can have a constraint of a `sizeList` list entity that constrains the `size` entity to trigger only when values contained within the `sizeList` entity are encountered.

[**Features**](luis-concept-feature.md) are applied to boost the relevance of the words or phrases for the prediction by identifying concepts through distinguishing traits or attributes.

When you create a feature in your LUIS app, it should be applied as closely to the concept it helps identify.

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
|[**Machine-learned**](tutorial-machine-learned-entity.md)|Machine-learned entities learn from context in the utterance. Parent grouping of entities, regardless of entity type. This makes variation of placement in example utterances significant. |
|[**List**](reference-entity-list.md)|List of items and their synonyms extracted with **exact text match**.|
|[**Pattern.any**](reference-entity-pattern-any.md)|Entity where finding the end of entity is difficult to determine because the entity is free-form. |
|[**Prebuilt**](luis-reference-prebuilt-entities.md)|Already trained to extract specific kind of data such as URL or email. Some of these prebuilt entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. If your specific culture or entity isn't currently supported, contribute to the project.|
|[**Regular Expression**](reference-entity-regular-expression.md)|Uses regular expression for **exact text match**.|

## Extracting contextually related data

An utterance may contain two or more occurrences of an entity where the meaning of the data is based on context within the utterance. An example is an utterance for booking a flight that has two locations, origin and destination.

`Book a flight from Seattle to Cairo`

The two examples of a `location` entity need to be extracted. The client-application needs to know the type of location for each in order to complete the ticket purchase.

To extract location, create a `location` entity is a machine-learned entity and uses two child component entities to capture the  `origin` and `destination`.

### Using component constraints to help define entity

You can use a [**machine-learned entity**](tutorial-machine-learned-entity.md) to extract the data that describes the action of booking a flight and then to decompose the top-level entity into the separate parts.

In this example, `Book a flight from Seattle to Cairo`, the top-level entity could be `travelAction` and labeled to extract `flight from Seattle to Cairo`. Then two component entities are created, called `origin` and `destination`, both with a constraint applied of the prebuilt `geographyV2` entity. In the training utterances, you need to label the `origin` and `destination` appropriately.

## If you need more than the maximum number of entities

If you need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS](luis-reference-regions.md#luis-website) website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/).

## Entity prediction status

The LUIS portal shows when the entity, in an example utterance, has a different entity prediction than the entity you selected. This different score is based on the current trained model. Use this information to resolve training errors:
* Create a feature for the entity to help identify the entity's concept
* Add more example utterances and label with the entity
* Review active learning suggestions for any utterances received at the prediction runtime that can help identify the entity's concept.

## Next steps

Learn concepts about good [utterances](luis-concept-utterance.md).

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.

See [Tutorial: Extract structured data from user utterance with machine-learned entities in Language Understanding (LUIS)](tutorial-machine-learned-entity.md) to learn how to extract structured data from an utterance using the machine-learned entity.

