---
title: "Quickstart: QnA Maker client library for .NET | Microsoft Docs"
description:
Get started with the QnA Maker client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 07/10/2019
ms.author: diberry
---

# Quickstart: QnA Maker client library for .NET

Get started with the QnA Maker client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 

Use the QnA Maker client library for .NET to:

* Create a knowledge base 
* Update a knowledge base
* Publish a knowledge base
* Download a knowledge base
* Delete a knowledge base

[Reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Knowledge.QnAMaker) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* View your resource on the [Azure Portal](https://portal.azure.com/).

After getting a key from your resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `QNAMAKER_SUBSCRIPTION_KEY`.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the dotnet `new` command to create a new console app with the name `qna-maker-quickstart`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`. 

```console
dotnet new console -n qna-maker-quickstart
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

From the project directory, open the **Program.cs** file in your preferred editor or IDE. Add the following `using` directives:

[!code-csharp[Using statements](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=usingStatements)]

In the application's `main()` method, create variables for your resource's Azure location, and your key as an environment variable. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

```csharp
[!code-csharp[Main method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=main)]
```

### Install the client library

Within the application directory, install the QnA Maker client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker --version 1.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


## Object model

The QnA Maker client is a [QnAMakerClient](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient?view=azure-dotnet) object that authenticates to Azure using [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.anomalydetector.apikeyserviceclientcredentials), which contains your key.

Once the client is created, use the [Knowledgebase](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase) property to access the following methods:

* [CreateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.createasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_KnowledgebaseExtensions_CreateAsync_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_IKnowledgebase_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_CreateKbDTO_System_Threading_CancellationToken_) - create a knowledgebase
* [DeleteAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.deleteasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_KnowledgebaseExtensions_DeleteAsync_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_IKnowledgebase_System_String_System_Threading_CancellationToken_) - delete a knowledgebase
* [DownloadAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.downloadasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_KnowledgebaseExtensions_DownloadAsync_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_IKnowledgebase_System_String_System_String_System_Threading_CancellationToken_) - download a knowledgebase
* [PublishAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.publishasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_KnowledgebaseExtensions_PublishAsync_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_IKnowledgebase_System_String_System_Threading_CancellationToken_) - publish knowledgebase to endpoint
* [UpdateAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.updateasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_KnowledgebaseExtensions_UpdateAsync_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_IKnowledgebase_System_String_Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_UpdateKbOperationDTO_System_Threading_CancellationToken_) - update knowledgebase 


## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first time
-->

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [link to example task 1]()
* [link to example task 2]()
* [link to example task 3]()

<!--
    change the environment key variable to something descriptive for your service.
    For example: TEXT_ANALYTICS_KEY
-->

### Authenticate the client

<!-- 
    The authentication section (and its H3) is required and must be the first code example in the section if your library requires authentication for use.
-->

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your QnA Maker key, named `TBD_KEY`.


In a new method, instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.

```csharp

```

### Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

### Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

## Run the application

Run the application with the dotnet `run` command from your application directory.

```dotnet
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the QnA Maker API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().