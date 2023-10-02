---
title: Glossary - LUIS
description: The glossary explains terms that you might encounter as you work with the LUIS API Service.
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 03/21/2022
author: aahill
ms.author: aahi
manager: nitinme
---

# Language understanding glossary of common vocabulary and concepts

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

The Language Understanding (LUIS) glossary explains terms that you might encounter as you work with the LUIS service.

## Active version

The active version is the [version](luis-how-to-manage-versions.md) of your app that is updated when you make changes to the model using the LUIS portal. In the LUIS portal, if you want to make changes to a version that is not the active version, you need to first set that version as active.

## Active learning

Active learning is a technique of machine learning in which the machine learned model is used to identify informative new examples to label. In LUIS, active learning refers to adding utterances from the endpoint traffic whose current predictions are unclear to improve your model. Select "review endpoint utterances", to view utterances to label.

See also:
* [Conceptual information](how-to/improve-application.md)
* [Tutorial reviewing endpoint utterances](how-to/improve-application.md)
* How to improve the LUIS app by [reviewing endpoint utterances](how-to/improve-application.md)

## Application (App)

In LUIS, your application, or app, is a collection of machine learned models, built on the same data set, that works together to predict intents and entities for a particular scenario. Each application has a separate prediction endpoint.

If you are building an HR bot, you might have a set of intents, such as "Schedule leave time", "inquire about benefits" and "update personal information" and entities for each one of those intents that you group into a single application.

## Authoring

Authoring is the ability to create, manage and deploy a LUIS app, either using the LUIS portal or the authoring APIs.

### Authoring Key

The [authoring key](luis-how-to-azure-subscription.md) is used to author the app. Not used for production-level endpoint queries. For more information, see [resource limits](luis-limits.md#resource-usage-and-limits).

### Authoring Resource

Your LUIS [authoring resource](luis-how-to-azure-subscription.md) is a manageable item that is available through Azure. The resource is your access to the associated authoring, training, and publishing abilities of the Azure service. The resource includes authentication, authorization, and security information you need to access the associated Azure service.

The authoring resource has an Azure "kind" of `LUIS-Authoring`.

## Batch test

Batch testing is the ability to validate a current LUIS app's models with a consistent and known test set of user utterances. The batch test is defined in a [JSON formatted file](./luis-how-to-batch-test.md#batch-test-file).


See also:
* [Concepts](./luis-how-to-batch-test.md)
* [How-to](luis-how-to-batch-test.md) run a batch test
* [Tutorial](./luis-how-to-batch-test.md) - create and run a batch test

### F-measure

In batch testing, a measure of the test's accuracy.

### False negative (FN)

In batch testing, the data points represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

### False positive (FP)

In batch testing, the data points represent utterances in which your app incorrectly predicted the existence of the target intent/entity.

### Precision
In batch testing, precision (also called positive predictive value) is the fraction of relevant utterances among the retrieved utterances.

An example for an animal batch test is the number of sheep that were predicted divided by the total number of animals (sheep and non-sheep alike).

### Recall

In batch testing, recall (also known as sensitivity), is the ability for LUIS to generalize.

An example for an animal batch test is the number of sheep that were predicted divided by the total number of sheep available.

### True negative (TN)

A true negative is when your app correctly predicts no match. In batch testing, a true negative occurs when your app does predict an intent or entity for an example that has not been labeled with that intent or entity.

### True positive (TP)

True positive (TP) A true positive is when your app correctly predicts a match. In batch testing, a true positive occurs when your app predicts an intent or entity for an example that has been labeled with that intent or entity.

## Classifier

A classifier is a machine learned model that predicts what category or class an input fits into.

An [intent](#intent) is an example of a classifier.

## Collaborator

A collaborator is conceptually the same thing as a [contributor](#contributor). A collaborator is granted access when an owner adds the collaborator's email address to an app that isn't controlled with Azure role-based access control (Azure RBAC). If you are still using collaborators, you should migrate your LUIS account, and use LUIS authoring resources to manage contributors with Azure RBAC.

## Contributor

A contributor is not the [owner](#owner) of the app, but has the same permissions to add, edit, and delete the intents, entities, utterances. A contributor provides Azure role-based access control (Azure RBAC) to a LUIS app.

See also:
* [How-to](luis-how-to-collaborate.md#add-contributor-to-azure-authoring-resource) add contributors

## Descriptor

A descriptor is the term formerly used for a machine learning [feature](#features).

## Domain

In the LUIS context, a domain is an area of knowledge. Your domain is specific to your scenario. Different domains use specific language and terminology that have meaning in the context of the domain. For example, if you are building an application to play music, your application would have terms and language specific to music – words like "song, track, album, lyrics, b-side, artist". For examples of domains, see [prebuilt domains](#prebuilt-domain).

## Endpoint

### Authoring endpoint

The LUIS authoring endpoint URL is where you author, train, and publish your app. The endpoint URL contains the region or custom subdomain of the published app as well as the app ID.

Learn more about authoring your app programmatically from the [Developer reference](developer-reference-resource.md#rest-endpoints)

### Prediction endpoint

The LUIS prediction endpoint URL is where you submit LUIS queries after the [LUIS app](#application-app) is authored and published. The endpoint URL contains the region or custom subdomain of the published app as well as the app ID. You can find the endpoint on the **[Azure resources](luis-how-to-azure-subscription.md)** page of your app, or you can get the endpoint URL from the [Get App Info](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37) API.

Your access to the prediction endpoint is authorized with the LUIS prediction key.

## Entity

[Entities](concepts/entities.md) are words in utterances that describe information used to fulfill or identify an intent. If your entity is complex and you would like your model to identify specific parts, you can break your model into subentities. For example, you might want you model to predict an address, but also the subentities of street, city, state, and zipcode. Entities can also be used as features to models. Your response from the LUIS app will include both the predicted intents and all the entities.

### Entity extractor

An entity extractor sometimes known only as an extractor is the type of machine learned model that LUIS uses to predict entities.

### Entity schema

The entity schema is the structure you define for machine learned entities with subentities. The prediction endpoint returns all of the extracted entities and subentities defined in the schema.

### Entity's subentity

A subentity is a child entity of a machine-learning entity.

### Non-machine-learning entity

An entity that uses text matching to extract data:
* List entity
* Regular expression entity

### List entity

A [list entity](reference-entity-list.md) represents a fixed, closed set of related words along with their synonyms. List entities are exact matches, unlike machined learned entities.

The entity will be predicted if a word in the list entity is included in the list. For example, if you have a list entity called "size" and you have the words "small, medium, large" in the list, then the size entity will be predicted for all utterances where the words "small", "medium", or "large" are used regardless of the context.

### Regular expression

A [regular expression entity](reference-entity-regular-expression.md) represents a regular expression. Regular expression entities are exact matches, unlike machined learned entities.
### Prebuilt entity

See Prebuilt model's entry for [prebuilt entity](#prebuilt-entity)

## Features

In machine learning, a feature is a characteristic that helps the model recognize a particular concept. It is a hint that LUIS can use, but not a hard rule.

This term is also referred to as a **[machine-learning feature](concepts/patterns-features.md)**.

These hints are used in conjunction with the labels to learn how to predict new data. LUIS supports both phrase lists and using other models as features.

### Required feature

A required feature is a way to constrain the output of a LUIS model. When a feature for an entity is marked as required, the feature must be present in the example for the entity to be predicted, regardless of what the machine learned model predicts.

Consider an example where you have a prebuilt-number feature that you have marked as required on the quantity entity for a menu ordering bot. When your bot sees `I want a bajillion large pizzas?`, bajillion will not be predicted as a quantity regardless of the context in which it appears. Bajillion is not a valid number and won’t be predicted by the number pre-built entity.

## Intent

An [intent](concepts/intents.md) represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, or paying a bill. In LUIS, an utterance as a whole is classified as an intent, but parts of the utterance are extracted as entities

## Labeling examples

Labeling, or marking, is the process of associating a positive or negative example with a model.

### Labeling for intents
In LUIS, intents within an app are mutually exclusive. This means when you add an utterance to an intent, it is considered a _positive_ example for that intent and a _negative_ example for all other intents. Negative examples should not be confused with the "None" intent, which represents utterances that are outside the scope of the app.

### Labeling for entities
In LUIS, you [label](how-to/entities.md) a word or phrase in an intent's example utterance with an entity as a _positive_ example. Labeling shows the intent what it should predict for that utterance. The labeled utterances are used to train the intent.

## LUIS app

See the definition for [application (app)](#application-app).

## Model

A (machine learned) model is a function that makes a prediction on input data. In LUIS, we refer to intent classifiers and entity extractors generically as "models", and we refer to a collection of models that are trained, published, and queried together as an "app".

## Normalized value

You add values to your [list](#list-entity) entities. Each of those values can have a list of one or more synonyms. Only the normalized value is returned in the response.

## Overfitting

Overfitting happens when the model is fixated on the specific examples and is not able to generalize well.

## Owner

Each app has one owner who is the person that created the app. The owner manages permissions to the application in the Azure portal.

## Phrase list

A [phrase list](concepts/patterns-features.md) is a specific type of machine learning feature that includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products).

## Prebuilt model

A [prebuilt model](luis-concept-prebuilt-model.md) is an intent, entity, or collection of both, along with labeled examples. These common prebuilt models can be added to your app to reduce the model development work required for your app.

### Prebuilt domain

A prebuilt domain is a LUIS app configured for a specific domain such as home automation (HomeAutomation) or restaurant reservations (RestaurantReservation). The intents, utterances, and entities are configured for this domain.

### Prebuilt entity

A prebuilt entity is an entity LUIS provides for common types of information such as number, URL, and email. These are created based on public data. You can choose to add a prebuilt entity as a stand-alone entity, or as a feature to an entity

### Prebuilt intent

A prebuilt intent is an intent LUIS provides for common types of information and come with their own labeled example utterances.

## Prediction

A prediction is a REST request to the Azure LUIS prediction service that takes in new data (user utterance), and applies the trained and published application to that data to determine what intents and entities are found.

### Prediction key

The [prediction key](luis-how-to-azure-subscription.md) is the key associated with the LUIS service you created in Azure that authorizes your usage of the prediction endpoint.

This key is not the authoring key. If you have a prediction endpoint key, it should be used for any endpoint requests instead of the authoring key. You can see your current prediction key inside the endpoint URL at the bottom of Azure resources page in LUIS website. It is the value of the subscription-key name/value pair.

### Prediction resource

Your LUIS prediction resource is a manageable item that is available through Azure. The resource is your access to the associated prediction of the Azure service. The resource includes predictions.

The prediction resource has an Azure "kind" of `LUIS`.

### Prediction score

The [score](luis-concept-prediction-score.md) is a number from 0 and 1 that is a measure of how confident the system is that a particular input utterance matches a particular intent. A score closer to 1 means the system is very confident about its output and a score closer to 0 means the system is confident that the input does not match a particular output. Scores in the middle mean the system is very unsure of how to make the decision.

For example, take a model that is used to identify if some customer text includes a food order. It might give a score of 1 for "I'd like to order one coffee" (the system is very confident that this is an order) and a score of 0 for "my team won the game last night" (the system is very confident that this is NOT an order). And it might have a score of 0.5 for "let's have some tea" (isn't sure if this is an order or not).

## Programmatic key

Renamed to [authoring key](#authoring-key).

## Publish

[Publishing](how-to/publish.md) means making a LUIS active version available on either the staging or production [endpoint](#endpoint).

## Quota

LUIS quota is the limitation of the Azure subscription tier. The LUIS quota can be limited by both requests per second (HTTP Status 429) and total requests in a month (HTTP Status 403).

## Schema

Your schema includes your intents and entities along with the subentities. The schema is initially planned for then iterated over time. The schema doesn't include app settings, features, or example utterances.

## Sentiment Analysis
Sentiment analysis provides positive or negative values of the utterances provided by the [Language service](../language-service/sentiment-opinion-mining/overview.md).

## Speech priming

Speech priming improves the recognition of spoken words and phrases that are commonly used in your scenario with [Speech Services](../speech-service/overview.md). For speech priming enabled applications, all LUIS labeled examples are used to improve speech recognition accuracy by creating a customized speech model for this specific application. For example, in a chess game you want to make sure that when the user says "Move knight", it isn’t interpreted as "Move night". The LUIS app should include examples in which "knight" is labeled as an entity.

## Starter key

A free key to use when first starting out using LUIS.

## Synonyms

In LUIS [list entities](reference-entity-list.md), you can create a normalized value, which can each have a list of synonyms. For example, if you create a size entity that has normalized values of small, medium, large, and extra-large. You could create synonyms for each value like this:

|Nomalized value| Synonyms|
|--|--|
|Small| the little one, 8 ounce|
|Medium| regular, 12 ounce|
|Large| big, 16 ounce|
|Xtra large| the biggest one, 24 ounce|

The model will return the normalized value for the entity when any of synonyms are seen in the input.

## Test

[Testing](./how-to/train-test.md) a LUIS app means viewing model predictions.

## Timezone offset

The endpoint includes [timezoneOffset](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity). This is the number in minutes you want to add or remove from the datetimeV2 prebuilt entity. For example, if the utterance is "what time is it now?", the datetimeV2 returned is the current time for the client request. If your client request is coming from a bot or other application that is not the same as your bot's user, you should pass in the offset between the bot and the user.

See [Change time zone of prebuilt datetimeV2 entity](luis-concept-data-alteration.md?#change-time-zone-of-prebuilt-datetimev2-entity).

## Token
A [token](luis-language-support.md#tokenization) is the smallest unit of text that LUIS can recognize. This differs slightly across languages.

For **English**, a token is a continuous span (no spaces or punctuation) of letters and numbers. A space is NOT a token.

|Phrase|Token count|Explanation|
|--|--|--|
|`Dog`|1|A single word with no punctuation or spaces.|
|`RMT33W`|1|A record locator number. It may have numbers and letters, but does not have any punctuation.|
|`425-555-5555`|5|A phone number. Each punctuation mark is a single token so  `425-555-5555` would be 5 tokens:<br>`425`<br>`-`<br>`555`<br>`-`<br>`5555` |
|`https://luis.ai`|7|`https`<br>`:`<br>`/`<br>`/`<br>`luis`<br>`.`<br>`ai`<br>|

## Train

[Training](how-to/train-test.md) is the process of teaching LUIS about any changes to the active version since the last training.

### Training data

Training data is the set of information that is needed to train a model. This includes the schema, labeled utterances, features, and application settings.

### Training errors

Training errors are predictions on your training data that do not match their labels.

## Utterance

An [utterance](concepts/utterances.md) is user input that is short text representative of a sentence in a conversation. It is a natural language phrase such as "book 2 tickets to Seattle next Tuesday". Example utterances are added to train the model and the model predicts on new utterance at runtime

## Version

A LUIS [version](luis-how-to-manage-versions.md) is a specific instance of a LUIS application associated with a LUIS app ID and the published endpoint. Every LUIS app has at least one version.
