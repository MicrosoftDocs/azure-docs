---
title: Entity types - LUIS
description: An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities by using the entity as a feature.
ms.topic: conceptual
ms.date: 06/10/2020
---

# Extract data with entities

An entity extracts data from a user utterance at prediction runtime. An _optional_, secondary purpose is to boost the prediction of the intent or other entities by using the entity as a feature.

There are several types of entities:

* [machine-learning entity](reference-entity-machine-learned-entity.md) - this is the primary entity. You should design your schema with this entity type before using other entities.
* Non-machine-learning used as a required [feature](luis-concept-feature.md) - for exact text matches, pattern matches, or detection by prebuilt entities
* [Pattern.any](#patternany-entity) - to extract free-form text such as book titles from a [Pattern](reference-entity-pattern-any.md)

machine-learning entities provide the widest range of data extraction choices. Non-machine-learning entities work by text matching and are used as a [required feature](#design-entities-for-decomposition) for a machine-learning entity or intent.

## Entities represent data

Entities are data you want to pull from the utterance, such as names, dates, product names, or any significant group of words. An utterance can include many entities or none at all. A client application _may_ need the data to perform its task.

Entities need to be labeled consistently across all training utterances for each intent in a model.

 You can define your own entities or use prebuilt entities to save time for common concepts such as [datetimeV2](luis-reference-prebuilt-datetimev2.md), [ordinal](luis-reference-prebuilt-ordinal.md), [email](luis-reference-prebuilt-email.md), and [phone number](luis-reference-prebuilt-phonenumber.md).

|Utterance|Entity|Data|
|--|--|--|
|Buy 3 tickets to New York|Prebuilt number<br>Destination|3<br>New York|


### Entities are optional but recommended

While [intents](luis-concept-intent.md) are required, entities are optional. You do not need to create entities for every concept in your app, but only for those where the client application needs the data or the entity acts as a hint or signal to another entity or intent.

As your application develops and a new need for data is identified, you can add appropriate entities to your LUIS model later.

<a name="entity-compared-to-intent"></a>

## Entity represents data extraction

The entity represents a data concept _inside the utterance_. An intent classifies the _entire utterance_.

Consider the following four utterances:

|Utterance|Intent predicted|Entities extracted|Explanation|
|--|--|--|--|
|Help|help|-|Nothing to extract.|
|Send something|sendSomething|-|Nothing to extract. The model does not have a required feature to extract `something` in this context, and there is no recipient stated.|
|Send Bob a present|sendSomething|`Bob`, `present`|The model extracts `Bob` by adding a required feature of prebuilt entity `personName`. A machine-learning entity has been used to extract `present`.|
|Send Bob a box of chocolates|sendSomething|`Bob`, `box of chocolates`|The two important pieces of data, `Bob` and the `box of chocolates`, have been extracted by machine-learning entities.|

## Label entities in all intents

Entities extract data regardless of the predicted intent. Make sure you label _all_ example utterances in all intents. The `None` intent missing entity labeling causes confusion even if there were far more training utterances for the other intents.

## Design entities for decomposition

machine-learning entities allow you to design your app schema for decomposition, breaking a large concept into subentities.

Designing for decomposition allows LUIS to return a deep degree of entity resolution to your client application. This allows your client application to focus on business rules and leave data resolution to LUIS.

A machine-learning entity triggers based on the context learned through example utterances.

[**machine-learning entities**](tutorial-machine-learned-entity.md) are the top-level extractors. Subentities are child entities of machine-learning entities.

## Effective machine learned entities

To build the machine learned entities effectively:

* Your labeling should be consistent across the intents. This includes even utterances you provide in the **None** intent that include this entity. Otherwise the model will not be able to determine the sequences effectively.
* If you have a machine learned entity with subentities, make sure that the different orders and variants of the entity and subentities are presented in the labeled utterances. Labeled example utterances should include all valid forms, and include entities that appear and are absent and also reordered within the utterance.
* You should avoid overfitting the entities to a very fixed set. **Overfitting** happens when the model doesn't generalize well, and is a common problem in machine learning models. This implies the app would not work on new data adequately. In turn, you should vary the labeled example utterances so the app is able to generalize beyond the limited examples you provide. You should vary the different subentities with enough change for the model to think more of the concept instead of just the examples shown.

<a name="composite-entity"></a>
<a name="list-entity"></a>
<a name="patternany-entity"></a>
<a name="prebuilt-entity"></a>
<a name="regular-expression-entity"></a>
<a name="simple-entity"></a>

## Types of entities

A subentity to a parent should be a machine-learning entity. The subentity can use a non-machine-learning entity as a [feature](luis-concept-feature.md).

Choose the entity based on how the data should be extracted and how it should be represented after it is extracted.

|Entity type|Purpose|
|--|--|
|[**Machine-learned**](tutorial-machine-learned-entity.md)|Extract nested, complex data learned from labeled examples. |
|[**List**](reference-entity-list.md)|List of items and their synonyms extracted with **exact text match**.|
|[**Pattern.any**](#patternany-entity)|Entity where finding the end of entity is difficult to determine because the entity is free-form. Only available in [patterns](luis-concept-patterns.md).|
|[**Prebuilt**](luis-reference-prebuilt-entities.md)|Already trained to extract specific kind of data such as URL or email. Some of these prebuilt entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. If your specific culture or entity isn't currently supported, contribute to the project.|
|[**Regular Expression**](reference-entity-regular-expression.md)|Uses regular expression for **exact text match**.|


## Extraction versus resolution

Entities extract data as the data appears in the utterance. Entities do not change or resolve the data. The entity won't provide any resolution if the text is a valid value for the entity or not.

There are ways to bring resolution into the extraction, but you should be aware that this limits the ability of the app to be immune against variations and mistakes.

List entities and regular expression (text-matching) entities can be used as [required features](luis-concept-feature.md#required-features) to a subentity and that acts as a filter to the extraction. You should use this carefully as not to hinder the ability of the app to predict.

## Extracting contextually related data

An utterance may contain two or more occurrences of an entity where the meaning of the data is based on context within the utterance. An example is an utterance for booking a flight that has two geographical locations, origin and destination.

`Book a flight from Seattle to Cairo`

The two locations need to be extracted in a way that the client-application knows the type of each location in order to complete the ticket purchase.

To extract the origin and destination, create two subentities as part of the ticket order machine-learning entity. For each of the subentities, create a required feature that uses geographyV2.

<a name="using-component-constraints-to-help-define-entity"></a>
<a name="using-subentity-constraints-to-help-define-entity"></a>

### Using required features to constrain entities

Learn more about [required features](luis-concept-feature.md)

## Pattern.any entity

A Pattern.any is only available in a [Pattern](luis-concept-patterns.md).

<a name="if-you-need-more-than-the-maximum-number-of-entities"></a>
## Exceeding app limits for entities

If you need more than the [limit](luis-limits.md#model-limits), contact support. To do so, gather detailed information about your system, go to the [LUIS](luis-reference-regions.md#luis-website) website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/).

## Entity prediction status

The LUIS portal shows when the entity has a different entity prediction than the entity you selected for an example utterance. This different score is based on the current trained model. Use this information to resolve training errors using one or more of the following:
* Create a [feature](luis-concept-feature.md) for the entity to help identify the entity's concept
* Add more [example utterances](luis-concept-utterance.md) and label with the entity
* [Review active learning suggestions](luis-concept-review-endpoint-utterances.md) for any utterances received at the prediction endpoint that can help identify the entity's concept.

## Next steps

Learn concepts about good [utterances](luis-concept-utterance.md).

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.

See [Tutorial: Extract structured data from user utterance with machine-learning entities in Language Understanding (LUIS)](tutorial-machine-learned-entity.md) to learn how to extract structured data from an utterance using the machine-learning entity.

