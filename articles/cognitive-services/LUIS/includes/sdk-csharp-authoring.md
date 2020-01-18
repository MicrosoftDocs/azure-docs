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

Use the Language Understanding (LUIS) authoring client library for .NET to:

* Create an app
* Add intents, entities, and example utterances
* Add features such as a phrase list
* Train and publish app

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.LUIS.Authoring) | [Authoring Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/documentation-samples/quickstarts/LUIS/LUIS.cs)

## Prerequisites

* Language Understanding (LUIS) portal account - [Create one for free](https://www.luis.ai)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).


## Setting up

### Get your Language Understanding (LUIS) starter key

Get your [starter key](../luis-how-to-azure-subscription.md#starter-key) by creating a LUIS authoring resource. Keep your key, and the region of the key for the next step.

### Create an environment variable

Using your key, and the region for the key, create two environment variables for authentication:

* `COGNITIVESERVICE_AUTHORING_KEY` - The resource key for authenticating your requests.
* `COGNITIVESERVICE_REGION` - The region associated with your key. For example `westus`.

Use the instructions for your operating system.

#### [Windows](#tab/windows)

```console
setx COGNITIVESERVICE_AUTHORING_KEY <replace-with-your-authoring-key>
setx COGNITIVESERVICE_REGION <replace-with-your-authoring-region>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export COGNITIVESERVICE_AUTHORING_KEY=<replace-with-your-authoring-key>
export COGNITIVESERVICE_REGION=<replace-with-your-authoring-region>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export COGNITIVESERVICE_AUTHORING_KEY=<replace-with-your-authoring-key>
export COGNITIVESERVICE_REGION=<replace-with-your-authoring-region>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

1. In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `language-understanding-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.

    ```dotnetcli
    dotnet new console -n language-understanding-quickstart
    ```

1. Change your directory to the newly created app folder.

1. You can build the application with:

    ```dotnetcli
    dotnet build
    ```

    The build output should contain no warnings or errors.

    ```console
    ...
    Build succeeded.
     0 Warning(s)
     0 Error(s)
    ...
    ```


### Install the SDK

Within the application directory, install the Language Understanding (LUIS) authoring client library for .NET with the following command:

```dotnetcli
dotnet add package Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring --version 3.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


## Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient?view=azure-dotnet) object that authenticates to Azure, which contains your authoring key.

Once the client is created, use this client to access functionality including:

* Apps - [create](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync?view=azure-dotnet), [delete](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.deleteasync?view=azure-dotnet), [publish](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.publishasync?view=azure-dotnet)
* Example utterances - [add by batch](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.batchasync?view=azure-dotnet), [delete by ID](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.deleteasync?view=azure-dotnet)
* Features - manage [phrase lists](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.featuresextensions.addphraselistasync?view=azure-dotnet)
* Model - manage [intents](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions?view=azure-dotnet) and entities
* Pattern - manage [patterns](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.patternextensions?view=azure-dotnet)
* Train - [train](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.trainversionasync?view=azure-dotnet) the app and poll for [training status](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.getstatusasync?view=azure-dotnet)
* [Versions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.versionsextensions?view=azure-dotnet) - manage with clone, export, and delete


## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) authoring client library for .NET:

* [Create an app](#create-a-luis-app)
* [Add entities](#create-entities-for-the-app)
* [Add intents](#create-intent-for-the-app)
* [Add example utterances](#add-example-utterance-to-intent)
* [Train the app](#train-the-app)
* [Publish the app](#publish-a-language-understanding-app)

## Add the dependencies

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=Dependencies)]

## Authenticate the client

1. Create a variable to manage your authoring key pulled from an environment variable named `COGNITIVESERVICES_AUTHORING_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

1. Create variables to hold your authoring region and endpoint. The region of your authoring key depends on where you are authoring. The [three authoring regions](../luis-reference-regions.md) are:

    * Australia - `australiaeast`
    * Europe - `westeurope`
    * U.S. and other regions - `westus` (Default)

    [!code-csharp[Authorization to resource key](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=Variables)]

1. Create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [LUISAuthoringClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient?view=azure-dotnet) object.

    [!code-csharp[Create LUIS client object](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringCreateClient)]

## Create a LUIS app

1. Create a LUIS app to contain the natural language processing (NLP) model holding intents, entities, and example utterances.

1. Create a [ApplicationCreateObject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.applicationcreateobject?view=azure-dotnet). The name and language culture are required properties.

1. Call the [Apps.AddAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync?view=azure-dotnet) method. The response is the app ID.

    [!code-csharp[Create a LUIS app](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringCreateApplication)]

## Create intent for the app
The primary object in a LUIS app's model is the intent. The intent aligns's with a grouping of user utterance _intentions_. A user may ask a question, or make a statement looking for a particular _intended_ response from a bot (or other client application). Examples of intentions are booking a flight, asking about weather in a destination city, and asking about contact information for customer service.

Create a [ModelCreateObject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.modelcreateobject?view=azure-dotnet) with the name of the unique intent then pass the app ID, version ID, and the ModelCreateObject to the [Model.AddIntentAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions.addintentasync?view=azure-dotnet) method. The response is the intent ID.

[!code-csharp[Create intent](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringAddIntents)]

## Create entities for the app

While entities are not required, they are found in most apps. The entity extracts information from the user utterance, necessary to fullfil the user's intention. There are several types of [prebuilt](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions.addprebuiltasync?view=azure-dotnet) and custom entities, each with their own data transformation object (DTO) models.  Common prebuilt entities to add to your app include [number](../luis-reference-prebuilt-number.md), [datetimeV2](../luis-reference-prebuilt-datetimev2.md), [geographyV2](../luis-reference-prebuilt-geographyv2.md), [ordinal](../luis-reference-prebuilt-ordinal.md).

This **AddEntities** method created a `Location` simple entity with two roles, a `Class` simple entity, a `Flight` composite entity and adds several prebuilt entities.

It is important to know that entities are not marked with an intent. They can and usually do apply to many intents. Only example user utterances are marked for a specific, single intent.

Creation methods for entities are part of the [Model](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions?view=azure-dotnet) class. Each entity type has its own data transformation object (DTO) model, usually containing the word `model` in the [Models](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models?view=azure-dotnet) namespace.

[!code-csharp[Create entities](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringAddEntities)]

## Add example utterance to intent

In order to determine an utterance's intention and extract entities, the app needs examples of utterances. The examples need to target a specific, single intent and should mark all custom entities. Prebuilt entities do not need to be marked.

Add example utterances by creating a list of [ExampleLabelObject](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.examplelabelobject?view=azure-dotnet) objects, one object for each example utterance. Each example should mark all entities with a dictionary of name/value pairs of entity name and entity value. The entity value should be exactly as it appears in the text of the example utterance.

Call [Examples.BatchAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.batchasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_ExamplesExtensions_BatchAsync_Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_IExamples_System_Guid_System_String_System_Collections_Generic_IList_Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_Models_ExampleLabelObject__System_Threading_CancellationToken_) with the app ID, version ID, and the list of examples. The call responds with a list of results. You need to check each example's result to make sure it was successfully added to the model.

[!code-csharp[Add example utterances to a specific intent](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringBatchAddUtterancesForIntent)]

The **CreateUtterance** and **CreateLabel** methods are utility methods to help you create objects.

## Train the app

Once the model is created, the LUIS app needs to be trained for this version of the model. A trained model can be used in a [container](../luis-container-howto.md), or [published](../luis-how-to-publish-app.md) to the staging or product slots.

The [Train.TrainVersionAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions?view=azure-dotnet) method needs the app ID and the version ID.

A very small model, such as this quickstart shows, will train very quickly. For production-level applications, training the app should include a polling call to the [GetStatusAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.getstatusasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_TrainExtensions_GetStatusAsync_Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_ITrain_System_Guid_System_String_System_Threading_CancellationToken_) method to determine when or if the training succeeded. The response is a list of [ModelTrainingInfo](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.modeltraininginfo?view=azure-dotnet) objects with a separate status for each object. All objects must be successful for the training to be considered complete.

[!code-csharp[Train the app's version](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringTrainVersion)]

## Publish a Language Understanding app

Publish the LUIS app using the [PublishAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.publishasync?view=azure-dotnet) method. This publishes the current trained version to the specified slot at the endpoint. Your client application uses this endpoint to send user utterances for prediction of intent and entity extraction.

[!code-csharp[Create entities](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=AuthoringPublishVersionAndSlot)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

```dotnetcli
dotnet run
```

## Clean up resources

If you want to clean up, you can delete the LUIS app. Deleting the app is done with the [Apps.DeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.deleteasync?view=azure-dotnet) method. You can also delete the app from the [LUIS portal](https://www.luis.ai).