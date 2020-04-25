---
title: Entity types - LUIS
description: An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities by using the entity as a feature.
ms.topic: conceptual
ms.date: 04/17/2020
---

# Extract data with entities

An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities by using the entity as a feature.

There are several types of entities:

* Machine-learned entity
* Non-machine-learned used as a required feature - for exact text matches, pattern matches, or detection by prebuilt entities
* [Pattern.any](#patternany-entity) - to extract free-form text such as book titles

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
|Send something|sendSomething|-|Nothing to extract. The model has not been constrained by adding a required feature to extract `something` in this context, and there is no recipient either.|
|Send Bob a present|sendSomething|`Bob`, `present`|The model has been constrained with the [personName](luis-reference-prebuilt-person.md) prebuilt entity by adding a required feature, which has extracted the name `Bob`. A machine-learned entity has been used to extract `present`.|
|Send Bob a box of chocolates|sendSomething|`Bob`, `box of chocolates`|The two important pieces of data, `Bob` and the `box of chocolates`, have been extracted by entities.|

## Design entities for decomposition

Machine-learned entities allow you to design your app schema for decomposition, breaking a large concept into subentities.

Designing for decomposition allows LUIS to return a deep degree of entity resolution to your client application. This allows your client application to focus on business rules and leave data resolution to LUIS.

A machine-learned entity triggers based on the context learned through example utterances.

[**Machine-learned entities**](tutorial-machine-learned-entity.md) are the top-level extractors. Subentities are child entities of machine-learned entities.

<a name="composite-entity"></a>
<a name="list-entity"></a>
<a name="patternany-entity"></a>
<a name="prebuilt-entity"></a>
<a name="regular-expression-entity"></a>
<a name="simple-entity"></a>

## Types of entities

A subentity to a parent should be a machine-learned entity. The subentity can use a non-machine-learned entity as a [feature](luis-concept-feature.md).

Choose the entity based on how the data should be extracted and how it should be represented after it is extracted.

|Entity type|Purpose|
|--|--|
|[**Machine-learned**](tutorial-machine-learned-entity.md)|Machine-learned entities learn from context in the utterance. Parent grouping of entities, regardless of entity type. This makes variation of placement in example utterances significant. |
|[**List**](reference-entity-list.md)|List of items and their synonyms extracted with **exact text match**.|
|[**Pattern.any**](#patternany-entity)|Entity where finding the end of entity is difficult to determine because the entity is free-form. Only available in [patterns](luis-concept-patterns).|
|[**Prebuilt**](luis-reference-prebuilt-entities.md)|Already trained to extract specific kind of data such as URL or email. Some of these prebuilt entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. If your specific culture or entity isn't currently supported, contribute to the project.|
|[**Regular Expression**](reference-entity-regular-expression.md)|Uses regular expression for **exact text match**.|

## Extracting contextually related data

An utterance may contain two or more occurrences of an entity where the meaning of the data is based on context within the utterance. An example is an utterance for booking a flight that has two geographical locations, origin and destination.

`Book a flight from Seattle to Cairo`

The two locations need to be extracted in a way that the client-application knows the type of each location in order to complete the ticket purchase.

To extract the origin and destination, create two subentities as part of the ticket order machine-learned entity. For each of the subentities, create a required feature that uses geographyV2.

<a name="using-component-constraints-to-help-define-entity"></a>
<a name="using-subentity-constraints-to-help-define-entity"></a>

### Using required features to constrain entities

Learn more about [required features](luis-concept-feature.md)

## Pattern.any entity

A Pattern.any is only available in a [Pattern](luis-concept=patterns.md).

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

