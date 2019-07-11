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

[Reference documentation](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/cognitiveservices/client/languageunderstanding?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Language.LUIS.Authoring) | [Authoring Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Language.LUIS.Authoring/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/documentation-samples/quickstarts/LUIS/LUIS.cs)

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

The Language Understanding (LUIS) authoring client is a [LUISClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.LUISclient?view=azure-dotnet) object that authenticates to Azure using [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.XXX.apikeyserviceclientcredentials), which contains your key.

Once the client is created, use the [Knowledge base](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.XXX.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_LUIS_LUISClient_Knowledgebase) property create, manage, and publish your knowledge base. 

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.GetDetailsAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.operationsextensions.getdetailsasync?view=azure-dotnet) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.operationstatetype?view=azure-dotnet). 

 
## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) client library for .NET:

* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Download a knowledge base](#download-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)

## Add the dependencies

From the project directory, open the **Program.cs** file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=Dependencies)]

## Authenticate the client

In the **main** method, create a variable for your resource's Azure key pulled from an environment variable named `LUIS_SUBSCRIPTION_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

Next, create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [LUISClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.LUISclient?view=azure-dotnet) object.

If your key is not in the `westus` region, as this sample code shows, change the location for the **Endpoint** variable. This location is found on the **Overview** page for your Language Understanding (LUIS) resource in the Azure portal.

[!code-csharp[Authorization to resource key](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=Authorization)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.createkbdto?view=azure-dotnet) object from three sources:

* For **editorial content**, use the [QnADTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.qnadto?view=azure-dotnet) object.
* For **files**, use the [FileDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.filedto?view=azure-dotnet) object. 
* For **URLs**, use a list of strings.

Call the [CreateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.createasync?view=azure-dotnet) method then pass the returned operation ID to the [MonitorOperation](#get-status-of-an-operation) method to poll for status. 

The final line of the following code returns the knowledge base ID from the response from MonitorOoperation. 

[!code-csharp[Create a knowledge base](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=CreateKB&highlight=29,30)]

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdatekbOperationDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.updatekboperationdto?view=azure-dotnet) containing [add](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.updatekboperationdtoadd?view=azure-dotnet), [update](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.updatekboperationdtoupdate?view=azure-dotnet), and [delete](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.updatekboperationdtodelete?view=azure-dotnet) DTO objects to the [UpdateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.updateasync?view=azure-dotnet) method. Use the [MonitorOperation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-csharp[Update a knowledge base](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=UpdateKB&highlight=4,13)]

## Download a knowledge base

Use the [DownloadAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.downloadasync?view=azure-dotnet) method to download the database as a list of [QnADocumentsDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.qnadocumentsdto?view=azure-dotnet). This is _not_ equivalent to the Language Understanding (LUIS) portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-csharp[Download a knowledge base](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DownloadKB&highlight=2)]

## Publish a knowledge base

Publish the knowledge base using the [PublishAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.publishasync?view=azure-dotnet) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. 

[!code-csharp[Publish a knowledge base](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=PublishKB&highlight=2)]

## Delete a knowledge base

Delete the knowledge base using the [DeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.knowledgebaseextensions.deleteasync?view=azure-dotnet) method with a parameter of the knowledge base ID. 

[!code-csharp[Delete a knowledge base](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DeleteKB&highlight=2)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.operation?view=azure-dotnet) is returned. Use the [operation ID](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.LUIS.models.operation.operationid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_LUIS_Models_Operation_OperationId) from the operation to poll (with retry logic) to determine the status of the original method. 

The _loop_ and _Task.Delay_ in the following code block are used to simulate retry logic. These should be replaced with your own retry logic. 

[!code-csharp[Monitor an operation](~/samples-LUIS-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=MonitorOperation&highlight=10)]

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