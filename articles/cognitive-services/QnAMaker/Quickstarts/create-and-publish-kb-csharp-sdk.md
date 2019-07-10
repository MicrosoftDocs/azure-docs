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
* Manage a knowledge base
* Publish a knowledge base

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

Once the client is created, use the [Knowledgebase](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase) property create, manage, and publish your knowledgebase. 

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.GetDetailsAsync](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.operationsextensions.getdetailsasync?view=azure-dotnet) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operationstatetype?view=azure-dotnet). 

 
## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Create a knowledgebase]()
* [Update a knowledgebase]()
* [Download a knowledgebase]()
* [Publish a knowledgebase]()
* [Delete a knowledgebase]()
* [Get status of an operation]()

### Add the dependencies and main method

From the project directory: 

1. Open the Program.cs file in your preferred editor or IDE. 
1. Add the following using directives.



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