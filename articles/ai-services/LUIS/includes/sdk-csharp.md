---
title: include file
description: include file
services: cognitive-services

manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.date: 03/07/2022
ms.topic: include
ms.custom: "include file, devx-track-dotnet, cog-serv-seo-aug-2020"

---

Use the Language Understanding (LUIS) client libraries for .NET to:
* Create an app
* Add an intent, a machine-learned entity, with an example utterance
* Train and publish app
* Query prediction runtime

[Reference documentation](/dotnet/api/overview/azure/language-understanding) | [Authoring](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.LUIS.Authoring) and [Prediction](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.LUIS.Runtime)  Library source code | [Authoring](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/) and [Prediction](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime/) NuGet | [C# Sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/LanguageUnderstanding/sdk-3x//Program.cs)

## Prerequisites

* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core) and [.NET Core CLI](/dotnet/core/tools/).
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, [create a Language Understanding authoring resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne) in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you [create](../luis-how-to-azure-subscription.md) to connect your application to Language Understanding authoring. You'll paste your key and endpoint into the code below later in the quickstart. You can use the free pricing tier (`F0`) to try the service.

## Setting up

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

1. In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `language-understanding-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.

    ```dotnetcli
    dotnet new console -n language-understanding-quickstart
    ```

1. Change your directory to the newly created app folder.

    ```dotnetcli
    cd language-understanding-quickstart
    ```

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

### Install the NuGet libraries

Within the application directory, install the Language Understanding (LUIS) client libraries for .NET with the following commands:

```dotnetcli
dotnet add package Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring --version 3.2.0-preview.3
dotnet add package Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime --version 3.1.0-preview.1
```

## Authoring Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient) object that authenticates to Azure, which contains your authoring key.

## Code examples for authoring

Once the client is created, use this client to access functionality including:

* Apps - [create](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync), [delete](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.deleteasync), [publish](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.publishasync)
* Example utterances - [add](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions), [delete by ID](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.deleteasync)
* Features - manage [phrase lists](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.featuresextensions.addphraselistasync)
* Model - manage [intents](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions) and entities
* Pattern - manage [patterns](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.patternextensions)
* Train - [train](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.trainversionasync) the app and poll for [training status](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.getstatusasync)
* [Versions](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.versionsextensions) - manage with clone, export, and delete

## Prediction Object model

The Language Understanding (LUIS) prediction runtime client is a [LUISRuntimeClient](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.luisruntimeclient) object that authenticates to Azure, which contains your resource key.

## Code examples for prediction runtime

Once the client is created, use this client to access functionality including:

* Prediction by [staging or production slot](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.predictionoperationsextensions.getslotpredictionasync)
* Prediction by [version](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.predictionoperationsextensions.getversionpredictionasync)


[!INCLUDE [Bookmark links to same article](sdk-code-examples.md)]

## Add the dependencies

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Add NuGet libraries to code file](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=Dependencies)]

## Add boilerplate code

1. Change the signature of the `Main` method to allow async calls:

    ```csharp
    public static async Task Main()
    ```

1. Add the rest of the code in the `Main` method of the `Program` class unless otherwise specified.

## Create variables for the app

Create two sets of variables: the first set you change, the second set leave as they appear in the code sample. 

[!INCLUDE [Remember to remove credentials when you're done](app-secrets.md)]

1. Create variables to hold your authoring key and resource names.

    [!code-csharp[Variables you need to change](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=VariablesYouChange)]

1. Create variables to hold your endpoints, app name, version, and intent name.

    [!code-csharp[Variables you don't need to change](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=VariablesYouDontNeedToChangeChange)]

## Authenticate the client

Create an [ApiKeyServiceClientCredentials](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.apikeyserviceclientcredentials) object with your key, and use it with your endpoint to create an [LUISAuthoringClient](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient) object.

[!code-csharp[Authenticate the client](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AuthoringCreateClient)]

## Create a LUIS app

A LUIS app contains the natural language processing (NLP) model including intents, entities, and example utterances.

Create a [ApplicationCreateObject](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.applicationcreateobject). The name and language culture are required properties. Call the [Apps.AddAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync) method. The response is the app ID.

[!code-csharp[Create a LUIS app](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AuthoringCreateApplication)]

## Create intent for the app
The primary object in a LUIS app's model is the intent. The intent aligns with a grouping of user utterance _intentions_. A user may ask a question, or make a statement looking for a particular _intended_ response from a bot (or other client application). Examples of intentions are booking a flight, asking about weather in a destination city, and asking about contact information for customer service.

Create a [ModelCreateObject](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.modelcreateobject) with the name of the unique intent then pass the app ID, version ID, and the ModelCreateObject to the [Model.AddIntentAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions.addintentasync) method. The response is the intent ID.

The `intentName` value is hard-coded to `OrderPizzaIntent` as part of the variables in the [Create variables for the app](#create-variables-for-the-app) section.

[!code-csharp[Create intent for the app](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AddIntent)]

## Create entities for the app

While entities are not required, they are found in most apps. The entity extracts information from the user utterance, necessary to fullfil the user's intention. There are several types of [prebuilt](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions.addprebuiltasync) and custom entities, each with their own data transformation object (DTO) models.  Common prebuilt entities to add to your app include [number](../luis-reference-prebuilt-number.md), [datetimeV2](../luis-reference-prebuilt-datetimev2.md), [geographyV2](../luis-reference-prebuilt-geographyv2.md), [ordinal](../luis-reference-prebuilt-ordinal.md).

It is important to know that entities are not marked with an intent. They can and usually do apply to many intents. Only the example user utterances are marked for a specific, single intent.

Creation methods for entities are part of the [Model](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions) class. Each entity type has its own data transformation object (DTO) model, usually containing the word `model` in the [Models](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models) namespace.

The entity creation code creates a machine-learning entity with subentities and features applied to the `Quantity` subentities.

:::image type="content" source="../media/quickstart-sdk/machine-learned-entity.png" alt-text="Partial screenshot from portal showing the entity created, a machine-learning entity with subentities and features applied to the `Quantity` subentities.":::

[!code-csharp[Create entities for the app](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AuthoringAddEntities)]

Use the following method to the class to find the Quantity subentity's ID, in order to assign the features to that subentity.

[!code-csharp[Find subentity id](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AuthoringSortModelObject)]

## Add example utterance to intent

In order to determine an utterance's intention and extract entities, the app needs examples of utterances. The examples need to target a specific, single intent and should mark all custom entities. Prebuilt entities do not need to be marked.

Add example utterances by creating a list of [ExampleLabelObject](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.examplelabelobject) objects, one object for each example utterance. Each example should mark all entities with a dictionary of name/value pairs of entity name and entity value. The entity value should be exactly as it appears in the text of the example utterance.

:::image type="content" source="../media/quickstart-sdk/labeled-example-machine-learned-entity.png" alt-text="Partial screenshot showing the labeled example utterance in the portal. ":::

Call [Examples.AddAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions) with the app ID, version ID, and the example.

[!code-csharp[Add example utterance to intent](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=AuthoringAddLabeledExamples)]

## Train the app

Once the model is created, the LUIS app needs to be trained for this version of the model. A trained model can be used in a [container](../luis-container-howto.md), or [published](../how-to/publish.md) to the staging or product slots.

The [Train.TrainVersionAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions) method needs the app ID and the version ID.

A very small model, such as this quickstart shows, will train very quickly. For production-level applications, training the app should include a polling call to the [GetStatusAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.getstatusasync#Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_TrainExtensions_GetStatusAsync_Microsoft_Azure_CognitiveServices_Language_LUIS_Authoring_ITrain_System_Guid_System_String_System_Threading_CancellationToken_) method to determine when or if the training succeeded. The response is a list of [ModelTrainingInfo](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.modeltraininginfo) objects with a separate status for each object. All objects must be successful for the training to be considered complete.

[!code-csharp[Train the app](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=TrainAppVersion)]

## Publish app to production slot

Publish the LUIS app using the [PublishAsync](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.publishasync) method. This publishes the current trained version to the specified slot at the endpoint. Your client application uses this endpoint to send user utterances for prediction of intent and entity extraction.

[!code-csharp[Publish app to production slot](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=PublishVersion)]

## Authenticate the prediction runtime client

Use an [ApiKeyServiceClientCredentials](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.apikeyserviceclientcredentials) object with your key, and use it with your endpoint to create an [LUISRuntimeClient](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.luisruntimeclient) object.

[!INCLUDE [Caution about using authoring key](caution-authoring-key.md)]

[!code-csharp[Authenticate the prediction runtime client](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=PredictionCreateClient)]


## Get prediction from runtime

Add the following code to create the request to the prediction runtime.

The user utterance is part of the [PredictionRequest](/dotnet/api/microsoft.azure.cognitiveservices.language.luis.runtime.models.predictionrequest) object.

The **GetSlotPredictionAsync** method needs several parameters such as the app ID, the slot name, the prediction request object to fulfill the request. The other options such as verbose, show all intents, and log are optional.

[!code-csharp[Get prediction from runtime](~/cognitive-services-quickstart-code/dotnet/LanguageUnderstanding/sdk-3x//Program.cs?name=QueryPredictionEndpoint)]

[!INCLUDE [Prediction JSON response](sdk-json.md)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

```dotnetcli
dotnet run
```
