---
title: Glossary - LUIS
description: The glossary explains terms that you might encounter as you work with the LUIS API Service.
ms.topic: reference
ms.date: 04/27/2020
---

# Language understanding glossary of common vocabulary and concepts
The Language Understanding (LUIS) glossary explains terms that you might encounter as you work with the LUIS API Service.

## <a name="active-version"></a>Active version

The active version is the version of your app that is updated when you make changes to the model using the LUIS portal. In the LUIS portal, if you want to make changes to a version that is not the active version, you need to first set that version as active.

## <a name="active-learning"></a>Active learning

Active learning is a technique of machine learning in which the machine learned model is used to identify informative new examples to label. In LUIS, active learning refers to adding utterances from the endpoint traffic whose current predictions are unclear to improve your model. Click on "review endpoint utterances", to view utterances to label.

## <a name="application"></a>Application (App)

In LUIS, your application, or app, is a collection of machine learned models built on the same data set, that work together to predict intents and entities for a particular scenario. Each application has a separate prediction endpoint.

If you are building an HR bot, you might have a set of intents, such as “Schedule leave time”, “inquire about benefits” and “update personal information” and entities for each one of those intents that you group into a single application.

## <a name="authoring"></a>Authoring

Authoring is the ability to create, manage and deploy a LUIS app, either using the LUIS portal or the authoring APIs.

### <a name="authoring-key"></a>Authoring Key

Previously named "Programmatic" key. Used to author the app. Not used for production-level endpoint queries. For more information, see [Key limits](luis-limits.md#key-limits).

### <a name="authoring-resource"></a>Authoring Resource

Your LUIS authoring resource is a manageable item that is available through Azure. The resource is your access to the associated Azure service. The resource includes authentication, authorization, and security information you need to access the associated Azure service.

## <a name="batch-test"></a>Batch test

Batch testing is the ability to validate a current LUIS app's models with a consistent and known test set of user utterances. The batch test is defined in a [JSON formatted file](luis-concept-batch-test.md#batch-file-format).

See also:
* [Concepts](luis-concept-batch-test.md)
* [How-to](luis-how-to-batch-test.md) run a batch test
* [Tutorial](luis-tutorial-batch-testing.md) - create and run a batch test

### <a name="f-measure"></a>F-measure

In batch testing, a measure of the test's accuracy.

### <a name="false-negative"></a>False negative (FN)

In batch testing, the data points represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

### <a name="false-positive"></a>False positive (FP)

In batch testing, the data points represent utterances in which your app incorrectly predicted the existence of the target intent/entity.

### <a name="precision"></a>Precision
In batch testing, precision (also called positive predictive value) is the fraction of relevant utterances among the retrieved utterances.

An example for an animal batch test is the number of sheep that were predicted divided by the the total number of animals (sheep and non-sheep alike).

### Recall

In batch testing, recall (also known as sensitivity), is the ability for LUIS to generalize.

An example for an animal batch test is the number of sheep that were predicted divided by the total number of sheep available.

## <a name="classifier"></a>Classifier

A classifier is a machine learned model that predicts what category or class an input fits into.

An [intent](#intent) is an example of a classifier.

## <a name="collaborator"></a>Collaborator

A collaborator is conceptually the same thing as a [contributor](#contributor). A collaborator is granted access when an owner adds the collaborator's email address to an app that isn't controlled with role-based access (RBAC). If you are still using collaborators, you should migrate your LUIS account, and use LUIS authoring resources to manage contributors with RBAC.

## <a name="contributor"></a>Contributor

A contributor is not the [owner](#owner) of the app, but has the same permissions to add, edit, and delete the intents, entities, utterances. A contributor provides role-based access (RBAC) to a LUIS app.

See also:
* [How-to](luis-how-to-collaborate.md#add-contributor-to-azure-authoring-resource) add contributors

## <a name="descriptor"></a>Descriptor

A descriptor is the term formerly used for a machine learning [feature](#feature).

## <a name="domain"></a>Domain

In the LUIS context, a domain is an area of knowledge. Your domain is specific to your scenario. Different domains use specific language and terminology that have meaning in the context of the domain. For example, if you are building an application to play music, your application would have terms and language specific to music – words like “song, track, album, lyrics, b-side, artist”. For examples of domains, see [prebuilt domains](#prebuilt-domain).

## <a name="endpoint"></a>Endpoint

### Authoring endpoint

The LUIS authoring endpoint URL is where you author, train, and publish your app. The endpoint URL contains the region or custom subdomain of the published app as well as the app ID.

Learn more about authoring your app programmatically from the [Developer reference](developer-reference-resource.md#rest-endpoints)

### Prediction endpoint

The LUIS prediction endpoint URL is where you submit LUIS queries after the [LUIS app](#application-app) is authored and published. The endpoint URL contains the region or custom subdomain of the published app as well as the app ID. You can find the endpoint on the **[Azure resources](luis-how-to-azure-subscription.md)** page of your app, or you can get the endpoint URL from the [Get App Info](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37) API.

Your access to the prediction endpoint is authorized with the LUIS prediction key.

## <a name="entity"></a>Entity

Entities are words in utterances that describe information used to fulfill or identify an intent. If your entity is complex and you would like your model to identify specific parts, you can break your model into subentities. For example, you might want you model to predict an address, but also the sub-entities of street, city, state and zipcode. Entities can also be used as features to models. Your response from the LUIS app will include both the predicted intents and all the entities.

### Entity extractor

An entity extractor sometimes known only as an extractor is the type of machine learned model that LUIS uses to predict entities.

### Entity schema

The entity schema is the structure you define for machine learned entities with subentities. The prediction endpoint returns all of the extracted entities and subentities defined in the schema.

### Entity's subentity

A subentity is a child entity of a machine-learned entity.

## <a name="features"></a>Features

In machine learning, a feature is a characteristic that helps the model recognize a particular concept. It is a hint that LUIS can use, but not a hard rule.

This term is also referred to as a **machine-learned feature**.

These hints are used in conjunction with the labels to learn how to predict new data. LUIS supports both phrase lists and using other models as features.

### Required feature

A required feature is a way to constrain the output of a LUIS model. When a feature for an entity is marked as required, the feature must be present in the example for the entity to be predicted, regardless of what the machine learned model predicts.

Consider an example where you have a prebuilt-number feature that you have marked as required on the quantity entity for a menu ordering bot. When your bot sees “I want a bajillion large pizzas?”, bajillion will not be predicted as a quantity regardless of the context in which it appears. Bajillion is not a valid number and won’t be predicted by the number pre-built entity.

## <a name="intent"></a>Intent

An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, or paying a bill. In LUIS, an utterance as a whole is classified as an intent, but parts of the utterance are extracted as entities

## <a name="labeling"></a>Labeling examples

Labeling, or marking, is the process of associating an a positive or negative example with a model.

### Labeling for intents
In LUIS, intents within an app are mutually exclusive. This means when you add an utterance to an intent, it is considered a _positive_ example for that intent and a _negative_ example for all other intents. Negative examples should not be confused with the "None" intent, which represents utterances that are outside the scope of the app.

### Labeling for entities
In LUIS, you label a word or phrase in an intent's example utterance with an entity as a _positive_ example. Labeling shows the intent what it should predict for that utterance. The labeled utterances are used to train the intent.

## <a name="list-entity"></a>List entity

A list entity represents a fixed, closed set of related words along with their synonyms. List entities are exact matches, unlike machined learned entities.

The entity will be predicted if a word in the list entity is included in the list. For example, if you have a list entity called “size” and you have the words “small, medium, large” in the list, then the size entity will be predicted for all utterances where the words “small”, “medium”, or “large” are used regardless of the context.

## <a name="luis-app"></a>LUIS app

See the definition for [application (app)](#application-app).

## <a name="model"></a>Model

A (machine learned) model is a function that makes a prediction on input data. In LUIS, we refer to a intent classifiers and entity extractors generically as "models", and we refer to a collections of models that are trained, published, and queried together as an "app".

## <a name="normalized-value"></a>Normalized value

You add values to your [list](list-entity) entities. Each of those values can have a list of one or more synonyms. Only the normalized value is returned in the response.

## <a name="owner"></a>Owner

Each app has one owner who is the person that created the app. The owner manages permissions to the application in the Azure portal.

<!--
## <a name="pattern"></a>Patterns
The previous Pattern feature is replaced with [Patterns](luis-concept-patterns.md). Use patterns to improve prediction accuracy by providing fewer training examples.
-->

## <a name="phrase-list"></a>Phrase list

A phrase list is a specific type of machine learning feature that includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products).

## <a name="prebuilt-domains"></a>Prebuilt model

A prebuilt model is a intent, entity, or collection of both, along with labeled examples. These common prebuilt models can be added to your add to reduce the model development work required for your app.

### Prebuilt domain

A prebuilt domain is a LUIS app configured for a specific domain such as home automation (HomeAutomation) or restaurant reservations (RestaurantReservation). The intents, utterances, and entities are configured for this domain.

### Prebuilt entity

A prebuilt entity is an entity LUIS provides for common types of information such as number, URL, and email. These are created based on public data. You can choose to add a prebuilt entity as a stand alone entity, or as a feature to an entity

### Prebuilt intent

A prebuilt intent is an intent LUIS provides for common types of information and come with their own labeled example utterances.

## Prediction

A prediction is a REST request to the Azure LUIS prediction service that takes in new data (user utterance), and applies the trained and published application to that data to determine what intents and entities are found.

## Prediction key

The prediction key (previously known as the subscription key) is the key associated with the LUIS service you created in Azure that authorizes your usage of the prediction endpoint.

This key is not the authoring key. If you have a prediction endpoint key, it should be used for any endpoint requests instead of the authoring key. You can see your current prediction key inside the endpoint URL at the bottom of Azure resources page in LUIS website. It is the value of the subscription-key name/value pair.

## Prediction resource

## Prediction score

The score is a number from 0 and 1 that is a measure of how confident the system is that a particular input utterance matches a particular intent. A score closer to 1 means the system is very confident about its output and a score closer to 0 means the system is confident that the input does not match a particular output. Scores in the middle mean the system is very unsure of how to make the decision.

For example, take a model that is used to identify if some customer text includes a food order. It might give a score of 1 for "i'd like to order one coffee" (the system is very confident that this is an order) and a score of 0 for "my team won the game last night" (the system is very confident that this is NOT an order). And it might have a score of .5 for "let's have some tea" (isn't sure if this is an order or not).

## <a name="programmatic-key"></a>Programmatic key

Renamed to [authoring key](#authoring-key).

## <a name="publish"></a>Publish

Publishing means making a LUIS active version available on either the staging or production [endpoint](#endpoint).

## <a name="quota"></a>Quota

LUIS quota is the limitation of the Azure subscription tier. The LUIS quota can be limited by both requests per second (HTTP Status 429) and total requests in a month (HTTP Status 403).

## <a name="sentiment-analysis"></a>Sentiment Analysis
Sentiment analysis provides positive or negative values of the utterances provided by Text Analytics.

## <a name="speech-priming"></a>Speech priming

Speech priming allows your speech service to be primed with your LUIS model.

<!--
## <a name="spelling-correction"></a>Spelling correction

Enable Bing spell checker to correct misspelled words in the utterances before prediction.
-->
## <a name="starter-key"></a>Starter key

A free key to use when first starting out using LUIS.

## <a name="structure"></a>Structure

Add structure to a machine-learned entity to provide subcomponents with descriptors (features) and constraints (regular expression or list entities).

## <a name="subscription-key"></a>Subscription key

The subscription key is the **prediction endpoint** key associated with the LUIS service [you created in Azure](luis-how-to-azure-subscription.md). This key is not the [authoring key](#programmatic-key). If you have an endpoint key, it should be used for any endpoint requests instead of the authoring key. You can see your current endpoint key inside the endpoint URL at the bottom of [**Keys and endpoints** page](luis-how-to-azure-subscription.md) in [LUIS](luis-reference-regions.md) website. It is the value of **subscription-key** name/value pair.

## <a name="test"></a>Test

[Testing](luis-interactive-test.md#test-your-app) a LUIS app means passing an utterance to LUIS and viewing the JSON results.

## <a name="timezoneoffset"></a>Timezone offset

The endpoint includes timezoneOffset. This is the number in minutes you want to add or remove from the datetimeV2 prebuilt entity. For example, if the utterance is "what time is it now?", the datetimeV2 returned is the current time for the client request. If your client request is coming from a bot or other application that is not the same as your bot's user, you should pass in the offset between the bot and the user.

See [Change time zone of prebuilt datetimeV2 entity](luis-concept-data-alteration.md?#change-time-zone-of-prebuilt-datetimev2-entity).

## <a name="token"></a>Token
A token is the smallest unit that can be labeled in an entity. Tokenization is based on the application's [culture](luis-language-support.md#tokenization).

## <a name="train"></a>Train

Training is the process of teaching LUIS about any changes to the active version since the last training.

## <a name="true-negative"></a>True negative (TN)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app correctly predicted the absence of the target intent/entity.

## <a name="true-positive"></a>True positive (TP)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app correctly predicted the existence of the target intent/entity.

## <a name="utterance"></a>Utterance

An utterance is a natural language phrase such as "book 2 tickets to Seattle next Tuesday". Example utterances are added to the intent.

## <a name="version"></a>Version

A LUIS [version](luis-how-to-manage-versions.md) is a specific data model associated with a LUIS app ID and the published endpoint. Every LUIS app has at least one version.
