---
title: "Quickstart: Language Understanding (LUIS) client library for .NET | Microsoft Docs"
description: Get started with the Language Understanding (LUIS) client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  Language Understanding (LUIS) enables you to . 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 07/11/2019
ms.author: diberry
---

# Quickstart: Language Understanding (LUIS) client library for .NET

Get started with the Language Understanding (LUIS) client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  Language Understanding (LUIS) enables you to . 

Use the Language Understanding (LUIS) client library for .NET to:

* Create an app
* Add intents, entities, and example utterances
* Add features such as a phrase list
* Train and publish app

[Reference documentation](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet) | [Library source code](https://github.com/Azure/cognitive-services-dotnet-sdk-samples/tree/master/sdk/cognitiveservices/Language.LUIS.Authoring) | [Authoring Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/documentation-samples/quickstarts/LUIS/LUIS.cs)

## Prerequisites

* Language Understanding (LUIS) portal account - [Create one for free](https://www.luis.ai)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Get your Language Understanding (LUIS) authoring key

<!--
Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource of type **Cognitive Services** using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. 
-->

Get your [authoring key](luis-how-to-account-settings), and [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `COGNITIVESERVICE_AUTHORING_KEY`.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `language-understanding-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`. 

```console
dotnet new console -n language-understanding-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
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

Within the application directory, install the Language Understanding (LUIS) client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.XXX.LUIS --version X.X.X
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


## Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient?view=azure-dotnet) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

Once the client is created, use this client to access functionality:

* Apps - [create](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync?view=azure-dotnet), [delete](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.deleteasync?view=azure-dotnet), [publish](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.publishasync?view=azure-dotnet)
* Example utterances - [add by batch](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.batchasync?view=azure-dotnet), [delete by ID](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.examplesextensions.deleteasync?view=azure-dotnet) 
* Features - manage [phrase lists](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.featuresextensions.addphraselistasync?view=azure-dotnet) 
* Model - manage [intents](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions?view=azure-dotnet) and entities
* Pattern - manage [patterns](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.patternextensions?view=azure-dotnet)
* Train - [train](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.trainversionasync?view=azure-dotnet) the app and poll for [training status](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.trainextensions.getstatusasync?view=azure-dotnet)
* [Versions](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.versionsextensions?view=azure-dotnet) - manage with clone, export, and delete


## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) client library for .NET:

* [Create an app]()
* [Add entities]()
* [Add intents]()
* [Add example utterances]()
* [Train the app]()
* [Publish the app]()

## Add the dependencies

From the project directory, open the **Program.cs** file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=Dependencies)]

## Authenticate the client

1. Create variables to manage your authoring key pulled from an environment variable named `LUIS_AUTHORING_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

1. Create variables to hold your authoring region and endpoint. The region of your authoring key depends on where you are authoring. The [three authoring regions](luis-reference-regions) are:

* Australia - `australiaeast`
* Europe - `westeurope`
* U.S. and other regions - `westus` (Default)

[!code-csharp[Authorization to resource key](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=Variables)]

1. Create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [LUISAuthoringClient](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.luisauthoringclient?view=azure-dotnet) object.

[!code-csharp[Create LUIS client object](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/LUIS/LUIS.cs?name=Authoring-CreateClient)]

## Create a LUIS app

Create a LUIS app to contain the natural language processing (NLP) model holding intents, entities, and example utterances. 

Create a [ApplicationCreateObject](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.models.applicationcreateobject?view=azure-dotnet). The name and language culture are required properties. 

Call the [Apps.AddAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.appsextensions.addasync?view=azure-dotnet) method. The response is the appId. 

[!code-csharp[Create a LUIS app](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=Authoring-CreateApplication)]

## Create entities and add to the app

One of the two main objects in a LUIS app is the entity. The entity defines information inside a user utterance that provides information necessary to fullfil the user's intention. There are several types of [prebuilt](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.language.luis.authoring.modelextensions.addprebuiltasync?view=azure-dotnet) and custom entities, each with their own data transformation object (DTO) models.  

[!code-csharp[Create entities and add to app](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=Authoring-CreateApplication)]

## Download a knowledge base

Use the [DownloadAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.downloadasync?view=azure-dotnet) method to download the database as a list of [QnADocumentsDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.qnadocumentsdto?view=azure-dotnet). This is _not_ equivalent to the Language Understanding (LUIS) portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-csharp[Download a knowledge base](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DownloadKB&highlight=2)]

## Publish a knowledge base

Publish the knowledge base using the [PublishAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.publishasync?view=azure-dotnet) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. 

[!code-csharp[Publish a knowledge base](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=PublishKB&highlight=2)]

## Delete a knowledge base

Delete the knowledge base using the [DeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.deleteasync?view=azure-dotnet) method with a parameter of the knowledge base ID. 

[!code-csharp[Delete a knowledge base](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DeleteKB&highlight=2)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.operation?view=azure-dotnet) is returned. Use the [operation ID](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.operation.operationid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_LUIS_Models_Operation_OperationId) from the operation to poll (with retry logic) to determine the status of the original method. 

The _loop_ and _Task.Delay_ in the following code block are used to simulate retry logic. These should be replaced with your own retry logic. 

[!code-csharp[Monitor an operation](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=MonitorOperation&highlight=10)]

## Run the application

Run the application with the dotnet `run` command from your application directory.

```dotnet
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Tutorial: Create and answer a KB](../tutorials/create-publish-query-in-portal.md)

* [What is the Language Understanding (LUIS) API?](../Overview/overview.md)
* [Edit a knowledge base](../how-to/edit-knowledge-base.md)
* [Get usage analytics](../how-to/get-analytics-knowledge-base.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-LUIS-csharp/blob/master/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs).