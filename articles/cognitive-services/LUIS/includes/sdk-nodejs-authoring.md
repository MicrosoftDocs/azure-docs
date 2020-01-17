---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: luis
ms.topic: include
ms.custom: include file
ms.date: 01/14/2020
ms.author: diberry
---
Use the Language Understanding (LUIS) authoring client library for Node.js to:

* Create an app.
* Add intents, entities, and example utterances.
* Add features, such as a phrase list.
* Train and publish an app.
* Delete app

[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-authoring/?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-luis-authoring) | [Authoring Package (NPM)](https://www.npmjs.com/package/azure-cognitiveservices-luis-authoring) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/LUIS/luis_authoring_quickstart.js)

## Prerequisites

* Language Understanding (LUIS) portal account: [Create one for free](https://www.luis.ai).
* [Node.js](https://nodejs.org)

## Setting up

### Get your Language Understanding (LUIS) starter key

Get your [starter key](../luis-how-to-azure-subscription.md#starter-key) by creating a LUIS authoring resource. Keep your key, and the endpoint of the key for the next step.

### Create an environment variable

Using your key, and the region for the key, create two environment variables for authentication:

* `LUIS_AUTHORING_KEY` - The resource key for authenticating your requests.
* `LUIS_AUTHORING_ENDPOINT` - The endpoint associated with your key.

Use the instructions for your operating system.

#### [Windows](#tab/windows)

```console
setx LUIS_AUTHORING_KEY <replace-with-your-luis-authoring-key
setx LUIS_AUTHORING_ENDPOINT <replace-with-your-luis-authoring-endpoint>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export LUIS_AUTHORING_KEY=<replace-with-your-luis-authoring-key>
export LUIS_AUTHORING_ENDPOINT=<replace-with-your-luis-authoring-endpoint>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export LUIS_AUTHORING_KEY=<replace-with-your-luis-authoring-key>
export LUIS_AUTHORING_ENDPOINT=<replace-with-your-luis-authoring-endpoint>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

### Install the NPM library for LUIS authoring

Within the application directory, install the dependencies with the following command:

```console
npm install @azure/cognitiveservices-luis-authoring @azure/ms-rest-js dotenv
```

## Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-authoring/luisauthoringclient?view=azure-node-latest) object that authenticates to Azure, which contains your authoring key.

Once the client is created, use this client to access functionality including:

* Apps - [create](), [delete](), [publish]()
* Example utterances - [add by batch](), [delete by ID]()
* Features - manage [phrase lists]()
* Model - manage [intents]() and entities
* Pattern - manage [patterns]()
* Train - [train]() the app and poll for [training status]()
* [Versions]() - manage with clone, export, and delete


## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) authoring client library for python:

* [Create an app](#create-a-luis-app)
* [Add entities](#create-entities-for-the-app)
* [Add intents](#create-intent-for-the-app)
* [Add example utterances](#add-example-utterance-to-intent)
* [Train the app](#train-the-app)
* [Publish the app](#publish-a-language-understanding-app)
* [Delete the app](#delete-a-language-understanding-app)
* [List apps](#list-language-understanding-apps)

## Create a new Node.js application

Create a new text file in your preferred editor or IDE named `luis_authoring_quickstart.js`. Then add the following dependencies.

[!code-javascript[Create a new application in your preferred editor or IDE.](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=Dependencies)]

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

[!code-javascript[Create variables for your resource's Azure endpoint and key.](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=Variables)]

## Authenticate the client

Create an [CognitiveServicesCredentials]() object with your key, and use it with your endpoint to create an [LUISAuthoringClient]() object.

[!code-javascript[Create LUIS client object](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringCreateClient)]

## Create a LUIS app

1. Create a LUIS app to contain the natural language processing (NLP) model holding intents, entities, and example utterances.

1. Create a [AppsOperation]() object's [add]() method to create the app. The name and language culture are required properties.

    [!code-javascript[Create LUIS client app](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringCreateApplication)]


## Create intent for the app
The primary object in a LUIS app's model is the intent. The intent aligns's with a grouping of user utterance _intentions_. A user may ask a question, or make a statement looking for a particular _intended_ response from a bot (or other client application). Examples of intentions are booking a flight, asking about weather in a destination city, and asking about contact information for customer service.

Use the [model.add_intent]() method with the name of the unique intent then pass the app ID, version ID, and new intent name.

[!code-javascript[Create intent](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringAddIntents)]

## Create entities for the app

While entities are not required, they are found in most apps. The entity extracts information from the user utterance, necessary to fullfil the user's intention. There are several types of [prebuilt]() and custom entities, each with their own data transformation object (DTO) models.  Common prebuilt entities to add to your app include [number](../luis-reference-prebuilt-number.md), [datetimeV2](../luis-reference-prebuilt-datetimev2.md), [geographyV2](../luis-reference-prebuilt-geographyv2.md), [ordinal](../luis-reference-prebuilt-ordinal.md).

This **add_entities** method created a `Location` simple entity with two roles, a `Class` simple entity, a `Flight` composite entity and adds several prebuilt entities.

It is important to know that entities are not marked with an intent. They can and usually do apply to many intents. Only example user utterances are marked for a specific, single intent.

Creation methods for entities are part of the [ModelOperations]() class. Each entity type has its own data transformation object (DTO) model.

[!code-javascript[Create entities for the app](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringAddEntities)]

## Add example utterance to intent

In order to determine an utterance's intention and extract entities, the app needs examples of utterances. The examples need to target a specific, single intent and should mark all custom entities. Prebuilt entities do not need to be marked.

Add example utterances by creating a list of [ExampleLabelObject]() objects, one object for each example utterance. Each example should mark all entities with a dictionary of name/value pairs of entity name and entity value. The entity value should be exactly as it appears in the text of the example utterance.

Call [examples.batch]() with the app ID, version ID, and the list of examples. The call responds with a list of results. You need to check each example's result to make sure it was successfully added to the model.

[!code-javascript[Add example utterance to intent](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringBatchAddUtterancesForIntent)]

## Train the app

Once the model is created, the LUIS app needs to be trained for this version of the model. A trained model can be used in a [container](../luis-container-howto.md), or [published](../luis-how-to-publish-app.md) to the staging or product slots.

The [train.train_version]() method needs the app ID and the version ID.

A very small model, such as this quickstart shows, will train very quickly. For production-level applications, training the app should include a polling call to the [get_status]() method to determine when or if the training succeeded. The response is a list of [ModelTrainingInfo]() objects with a separate status for each object. All objects must be successful for the training to be considered complete.

[!code-javascript[Train LUIS client app](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringTrainVersion)]

Training all models takes time. Use the operation ID to check the training status.

[!code-javascript[Get training status](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringWaitForOperation)]

## Publish a Language Understanding app

Publish the LUIS app using the [app.publish]() method. This publishes the current trained version to the specified slot at the endpoint. Your client application uses this endpoint to send user utterances for prediction of intent and entity extraction.

[!code-javascript[Publish LUIS client app](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringPublishVersion)]

## Delete a Language Understanding app

Publish the LUIS app using the [app.deleteMethod]() method. This deletes the current app.

[!code-javascript[Publish LUIS client app](~/cognitive-services-quickstart-code/javascript/LUIS/luis_authoring_quickstart.js?name=AuthoringDeleteApp)]

## Run the application

Run the application with the `node luis_authoring_quickstart.js` command on your quickstart file.

```console
node luis_authoring_quickstart.js
```