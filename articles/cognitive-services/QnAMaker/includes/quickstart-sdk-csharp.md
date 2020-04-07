---
title: "Quickstart: QnA Maker client library for .NET"
description: This quickstart shows how to get started with the QnA Maker client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.
ms.topic: quickstart
ms.date: 01/13/2020
---
Use the QnA Maker client library for .NET to:

* Create a knowledge base
* Manage a knowledge base
* Publish a knowledge base
* Generate an answer from the knowledge base

[Reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Knowledge.QnAMaker) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine.

After getting a key and endpoint for your resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `QNAMAKER_SUBSCRIPTION_KEY`. The resource name is used as part of the endpoint URL.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE.

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `qna-maker-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```dotnetcli
dotnet new console -n qna-maker-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

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

Within the application directory, install the QnA Maker client library for .NET with the following command:

```dotnetcli
dotnet add package Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker --version 1.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.


## Object model

The QnA Maker client is a [QnAMakerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient?view=azure-dotnet) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

Once the client is created, use the [Knowledge base](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase) property to create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.GetDetailsAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.operationsextensions.getdetailsasync?view=azure-dotnet) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operationstatetype?view=azure-dotnet).


## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Download a knowledge base](#download-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)
* [Generate an answer from the knowledge base](#generate-an-answer-from-the-knowledge-base)

## Add the dependencies

From the project directory, open the **Program.cs** file in your preferred editor or IDE. Replace the existing `using` code with the following `using` directives:

[!code-csharp[Using statements](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=Dependencies)]

## Authenticate the client for authoring the knowledge base

In the **main** method, create a variable for your resource's Azure key pulled from an environment variable named `QNAMAKER_SUBSCRIPTION_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

Next, create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [QnAMakerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient?view=azure-dotnet) object.

|Environment variable|variable|Example|
|--|--|--|
|`QNAMAKER_SUBSCRIPTION_KEY`|`subscription_key`|The key is a 32 character string and is available in the Azure portal, on the QnA Maker resource, on the Quickstart page. This is not the same as the prediction endpoint key.|
|`QNAMAKER_HOST`|`Endpoint`| Your authoring endpoint, in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`, includes your **resource name**. This is not the same URL used to query the prediction endpoint.|
||||

```csharp
var subscriptionKey = Environment.GetEnvironmentVariable("QNAMAKER_SUBSCRIPTION_KEY");
var client = new QnAMakerClient(new ApiKeyServiceClientCredentials(subscriptionKey)) { Endpoint = "https://<your-custom-domain>.api.cognitive.microsoft.com" };
```

## Authenticate the runtime for generating an answer

In the **main** method, create a variable for your resource's authentication pulled from an environment variables named `QNAMAKER_ENDPOINT_HOSTNAME` and `QNAMAKER_ENDPOINT_KEY`. When you publish your knowledge base, these values are returned. After you publish, you can find these settings on the **Settings** page of the QnA Maker portal.

Create a [QnAMakerRuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerruntimeclient?view=azure-dotnet) to query the knowledge base to generate an answer or train from active learning.

[!code-csharp[Authenticate the runtime](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=EndpointKey)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.createkbdto?view=azure-dotnet) object from three sources:

* For **editorial content**, use the [QnADTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadto?view=azure-dotnet) object.
* For **files**, use the [FileDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.filedto?view=azure-dotnet) object.
* For **URLs**, use a list of strings.

Call the [CreateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.createasync?view=azure-dotnet) method then pass the returned operation ID to the [MonitorOperation](#get-status-of-an-operation) method to poll for status.

The final line of the following code returns the knowledge base ID from the response from MonitorOoperation.

[!code-csharp[Create a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=CreateKB&highlight=29,30)]

Make sure the include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdatekbOperationDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdto?view=azure-dotnet) containing [add](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoadd?view=azure-dotnet), [update](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoupdate?view=azure-dotnet), and [delete](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtodelete?view=azure-dotnet) DTO objects to the [UpdateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.updateasync?view=azure-dotnet) method. Use the [MonitorOperation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-csharp[Update a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=UpdateKB&highlight=4,13)]

Make sure the include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Download a knowledge base

Use the [DownloadAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.downloadasync?view=azure-dotnet) method to download the database as a list of [QnADocumentsDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadocumentsdto?view=azure-dotnet). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-csharp[Download a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DownloadKB&highlight=2)]

## Publish a knowledge base

Publish the knowledge base using the [PublishAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.publishasync?view=azure-dotnet) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint.

[!code-csharp[Publish a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=PublishKB&highlight=2)]

## Generate an answer from the knowledge base

Generate an answer from a published knowledge base using the [RuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase).[GenerateAnswerAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.runtimeextensions.generateanswerasync?view=azure-dotnet) method. This method accepts the knowledge base ID and the [QueryDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto?view=azure-dotnet). Access additional properties of the QueryDTO, such a [Top](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.top?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_QueryDTO_Top) and [Context](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.context?view=azure-dotnet) to use in your chat bot.

[!code-csharp[Generate an answer from a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=GenerateAnswer&highlight=2)]


## Delete a knowledge base

Delete the knowledge base using the [DeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.deleteasync?view=azure-dotnet) method with a parameter of the knowledge base ID.

[!code-csharp[Delete a knowledge base](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=DeleteKB&highlight=2)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation?view=azure-dotnet) is returned. Use the [operation ID](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation.operationid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_Operation_OperationId) from the operation to poll (with retry logic) to determine the status of the original method.

The _loop_ and _Task.Delay_ in the following code block are used to simulate retry logic. These should be replaced with your own retry logic.

[!code-csharp[Monitor an operation](~/samples-qnamaker-csharp/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs?name=MonitorOperation&highlight=10)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

All of the code snippets in this article are [available](https://github.com/Azure-Samples/cognitive-services-qnamaker-python/blob/master/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.py) and can be run as a single file.

```dotnetcli
dotnet run
```

The [source code for this quickstart](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp/blob/master/documentation-samples/quickstarts/Knowledgebase_Quickstart/Program.cs) is available in the QnA Maker C# samples GitHub repository.

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)