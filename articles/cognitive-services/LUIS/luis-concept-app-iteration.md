---
title: Iterative app design - LUIS
titleSuffix: Azure Cognitive Services
description: LUIS learns best in an iterative cycle of model changes, utterance examples, publishing, and gathering data from endpoint queries.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: diberry
---

# Iterative app design for LUIS

A Language Understanding (LUIS) app learns and performs most efficiently with iteration. Here's a typical iteration cycle:

* Create new version
* Edit the LUIS app schema. This includes:
    * Intents with example utterances
    * Entities
    * Features
* Train, test, and publish
    * Test at the prediction endpoint for active learning
* Gather data from endpoint queries

![Authoring cycle](./media/luis-concept-app-iteration/iteration.png)

## Building a LUIS schema

An app's schema defines what the user is asking for (the _intention_ or _intent_ ) and what parts of the intent provide details (called _entities_) that are used to help determine the answer.

The app schema must be specific to the app domains to determine words and phrases that are relevant, as well as to determine typical word ordering.

Example utterances represent user inputs, such as recognized speech or text, that the app expects at runtime.

The schema requires intents, and _should have_ entities.

### Example schema of intents

The most common schema is an intent schema organized with intents. This type of schema uses LUIS to determine a user's intention.

The intent schema type may have entities if it helps LUIS determine the user's intention. For example, a shipping entity (as a _machine learning feature_ to an intent) helps LUIS determine a shipping intention.

### Example schema of entities

An entity schema focuses on entities, which is the data that is extracted from user utterances. For example, if a user was to say, "I'd like to order three pizzas." There are two entities that would be extracted: _three_ and _pizzas_. These are used to help fulfill the intention, which was to make an order.

For an entity schema, the intention of the utterance is less important to the client application.

A common method of organizing an entity schema is to add all example utterances to the **None** intent.

### Example of a mixed schema

The most powerful and mature schema is an intent schema with a full range of entities and features. This schema can begin as either an intent or entity schema and grow to include concepts of both, as the client application needs those pieces of information.

## Add example utterances to intents

LUIS needs a few example utterances in each **intent**. The example utterances need enough variation of word choice and word order to be able to determine which intent the utterance is meant for.

> [!CAUTION]
> Do not add example utterances in bulk. Start with 15 to 30 specific and varying examples.

Each example utterance needs to have any **required data to extract** designed and labeled with **entities**.

|Key element|Purpose|
|--|--|
|Intent|**Classify** user utterances into a single intention, or action. Examples include `BookFlight` and `GetWeather`.|
|Entity|**Extract** data from utterance required to complete intention. Examples include date and time of travel, and location.|

A LUIS app can be designed to ignore utterances that aren't relevant to an app's domain by assigning the utterance to the **None** intent.

## Test and train your app

After you have 15 to 30 different example utterances in each intent, with the required entities labeled, you need to test and [train](luis-how-to-train.md) your LUIS app.

## Publish to a prediction endpoint

The LUIS app must be published so that it's available to you in the list [prediction endpoint regions](luis-reference-regions.md).

## Test your published app

You can test your published LUIS app from the HTTPS prediction endpoint. Testing from the prediction endpoint allows LUIS to choose any utterances with low-confidence for [review](luis-how-to-review-endpoint-utterances.md).

## Create a new version for each cycle

Each version is a snapshot in time of the LUIS app. Before you make changes to the app, create a new version. It is easier to go back to an older version than to try to remove intents and utterances to a previous state.

The version ID consists of characters, digits or '.' and cannot be longer than 10 characters.

The initial version (0.1) is the default active version.

### Begin by cloning an existing version

Clone an existing version to use as a starting point for each new version. After you clone a version, the new version becomes the **active** version.

### Publishing slots

You can publish to either the stage and/or production slots. Each slot can have a different version or the same version. This is useful for verifying changes before publishing to production, which is available to bots or other LUIS calling apps.

Trained versions aren't automatically available at your LUIS app's [endpoint](luis-glossary.md#endpoint). You must [publish](luis-how-to-publish-app.md) or republish a version in order for it to be available at your LUIS app endpoint. You can publish to **Staging** and **Production**, giving you two versions of the app available at the endpoint. If more versions of the app need to be available at an endpoint, you should export the version and reimport it to a new app. The new app has a different app ID.

### Import and export a version

A version can be imported at the app level. That version becomes the active version and uses the version ID in the `versionId` property of the app file. You can also import into an existing app, at the version level. The new version becomes the active version.

A version can be exported at the app or version level as well. The only difference is that the app-level exported version is the currently active version while at the version level, you can choose any version to export on the **[Settings](luis-how-to-manage-versions.md)** page.

The exported file **doesn't** contain:

* machine-learning information, because the app is retrained after it's imported
* Contributor information

In order to back up your LUIS app schema, export a version from the [LUIS portal](https://www.luis.ai/applications).

## Manage contributor changes with versions and contributors

LUIS uses the concept of contributors to an app, by providing Azure resource-level permissions. Combine this concept with versioning to provide targeted collaboration.

Use the following techniques to manage contributor changes to your app.

### Manage multiple versions inside the same app

Begin by [cloning](luis-how-to-manage-versions.md#clone-a-version) from a base version for each author.

Each author makes changes to their own version of the app. When the author is satisfied with the model, export the new versions to JSON files.

Exported apps, .json or .lu files, can be compared for changes. Combine the files to create a single file of the new version. Change the `versionId` property to signify the new merged version. Import that version into the original app.

This method allows you to have one active version, one stage version, and one published version. You can compare the results of the active version with a published version (stage or production) in the [interactive testing pane](luis-interactive-test.md).

### Manage multiple versions as apps

[Export](luis-how-to-manage-versions.md#export-version) the base version. Each author imports the version. The person that imports the app is the owner of the version. When they are done modifying the app, export the version.

Exported apps are JSON-formatted files, which can be compared with the base export for changes. Combine the files to create a single JSON file of the new version. Change the **versionId** property in the JSON to signify the new merged version. Import that version into the original app.

Learn more about authoring contributions from [collaborators](luis-how-to-collaborate.md).

## Review endpoint utterances to begin the new iterative cycle

When you are done with an iteration cycle, you can repeat the process. Start with [reviewing prediction endpoint utterances](luis-how-to-review-endpoint-utterances.md) LUIS marked with low-confidence. Check these utterances for both correct predicted intent and correct and complete entity extracted. After you review and accept changes, the review list should be empty.

## Next steps

Learn concepts about [collaboration](luis-concept-keys.md).
