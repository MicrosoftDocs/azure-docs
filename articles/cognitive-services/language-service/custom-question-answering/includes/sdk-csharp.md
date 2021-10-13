---
title: "Quickstart: custom question answering client library for .NET"
description: This quickstart shows how to get started with the QnA Maker client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.
ms.topic: include
ms.date: 11/02/2021
---

Use the custom question answering client library for .NET to:

 * Create a knowledgebase
 * Update a knowledgebase
 * Publish a knowledgebase
 * Wait for long-running task
 * Download a knowledgebase
 * Get an answer from a knowledgebase
 * Delete a knowledgebase

[Reference documentation](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Knowledge.QnAMaker) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker/3.0.0-preview.1) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/QnAMaker/Preview-sdk-based-quickstart)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Custom question and answering, requires a [Language resource](https://ms.portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint. <!--TODO: Change link-->
    * After your Language resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect your application to the QnA Maker API. Paste your key and endpoint into the code below later in the quickstart.

## Setting up

### CLI

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `question-answering-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*.

```console
dotnet new console -n question-answering-quickstart
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

Within the application directory, install the custom question answering client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker --version 3.0.0-preview.1
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs), which contains the code examples in this quickstart.

### Using directives

From the project directory, open the *program.cs* file and add the following `using` directives:

[!code-csharp[Dependencies](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=Dependencies)]

### Subscription key and resource endpoints

In the application's `Main` method, add variables and code, shown in the following section, to use the common tasks in this quickstart.

<!-- TODO: Replace Link
- We use subscription key and authoring key interchangably. For more details on authoring key, follow [Keys](../concepts/azure-resources.md?tabs=v2#keys-in-qna-maker).
-->

- The value of QNA_MAKER_ENDPOINT has the format `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`. Go to the Azure portal and find the Text Analytics resource you created in the prerequisites. Select **Keys and Endpoint** page, under **resource management** to locate Authoring (Subscription) key and Endpoint.

    > [!div class="mx-imgBorder"]
    > ![Custom QnA Authoring Endpoint](../../../qnamaker/media/qnamaker-how-to-key-management/custom-qna-keys-and-endpoint.png)


- For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md) provides secure key storage.

    [!code-csharp[Set the resource key and resource name](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=Resourcevariables)]

## Object models

[Custom question answering](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker) uses the following object model:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, download, and query the knowledgebase.


[!INCLUDE [Get KBinformation](../../../qnamaker/includes/quickstart-sdk-cognitive-model.md)]

### QnAMakerClient object model

The authoring client is a [QnAMakerClient](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

Once the client is created, use the [Knowledge base](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase) property to create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.GetDetailsAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.operationsextensions.getdetailsasync) method with the operation ID to determine the [status of the request](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operationstatetype).

### QnAMakerRuntimeClient object model

 Custom question answering does not require the use of the **QnAMakerRuntimeClient** object. Instead, you call the [QnAMakerClient.Knowledgebase](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase).[GenerateAnswerAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.generateanswerasync) method.

## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Authenticate the authoring client](#authenticate-the-client-for-authoring-the-knowledge-base)
* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Download a knowledge base](#download-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)
* [Generate an answer from the knowledge base](#generate-an-answer-from-the-knowledge-base)

## Authenticate the client for authoring the knowledge base

Instantiate a client object with your key, and use it with your resource to construct the endpoint to create an [QnAMakerClient](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient) with your endpoint and key. Create a [ServiceClientCredentials](/dotnet/api/microsoft.rest.serviceclientcredentials) object.

[!code-csharp[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=AuthorizationAuthor)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.createkbdto) object from three sources:

* For **editorial content**, use the [QnADTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadto) object.
    * To use metadata and follow-up prompts, use the editorial context, because this data is added at the individual QnA pair level.
* For **files**, use the [FileDTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.filedto) object. The FileDTO includes the filename and the public URL to reach the file.
* For **URLs**, use a list of strings to represent publicly available URLs.

The creation step also includes properties for the knowledgebase:
* `defaultAnswerUsedForExtraction` - what is returned when no answer is found
* `enableHierarchicalExtraction` - automatically create prompt relationships between extracted QnA pairs
* `language` - when creating the first knowledgebase of a resource, set the language to use in the Azure Search index.

Call the [CreateAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.createasync) method then pass the returned operation ID to the [MonitorOperation](#get-status-of-an-operation) method to poll for status.

The final line of the following code returns the knowledge base ID from the response from MonitorOperation.

[!code-csharp[Create a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=CreateKBMethod)]

Make sure to include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdatekbOperationDTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdto) containing [add](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoadd), [update](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoupdate), and [delete](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtodelete) DTO objects to the [UpdateAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.updateasync) method. Use the [MonitorOperation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-csharp[Update a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=UpdateKBMethod)]

Make sure to include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Download a knowledge base

Use the [DownloadAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.downloadasync) method to download the database as a list of [QnADocumentsDTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadocumentsdto). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a file.

[!code-csharp[Download a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=DownloadKB)]

## Publish a knowledge base

Publish the knowledge base using the [PublishAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.publishasync) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at your endpoint. This is a necessary step in order to query your knowledgebase.

[!code-csharp[Publish a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=PublishKB)]

## Generate an answer from the knowledge base

Generate an answer from a published knowledgebase using the [QnAMakerClient.Knowledgebase](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase).[GenerateAnswerAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.generateanswerasync) method. This method accepts the knowledge base ID and the [QueryDTO](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto). Access additional properties of the QueryDTO, such a [Top](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.top#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_QueryDTO_Top), [Context](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.context#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_QueryDTO_Context) and [AnswerSpanRequest](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.answerspanrequest#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_QueryDTO_AnswerSpanRequest) to use in your chat bot.

[!code-csharp[Generate an answer from a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=GenerateAnswer)]

<!-- TODO: Replace Link
This is a simple example querying the knowledgebase. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).
-->

## Delete a knowledge base

Delete the knowledgebase using the [DeleteAsync](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.deleteasync) method with a parameter of the knowledge base ID.

[!code-csharp[Delete a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=DeleteKB)]


## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation) is returned. Use the [operation ID](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation.operationid#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_Operation_OperationId) from the operation to poll (with retry logic) to determine the status of the original method.

The loop and `Task.Delay` in the following code block are used to simulate retry logic. These should be replaced with your own retry logic.

[!code-csharp[Monitor an operation](~/cognitive-services-quickstart-code/dotnet/QnAMaker/Preview-sdk-based-quickstart/Program.cs?name=MonitorOperation)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

```dotnetcli
dotnet run
```

The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/QnAMaker/Preview-sdk-based-quickstart).

