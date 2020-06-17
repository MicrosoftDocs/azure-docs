---
title: "Quickstart: QnA Maker client library for .NET"
description: This quickstart shows how to get started with the QnA Maker client library for .NET. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.
ms.topic: quickstart
ms.date: 06/11/2020
---
Use the QnA Maker client library for .NET to:

 * Create a knowledgebase
 * Update a knowledgebase
 * Publish a knowledgebase, waiting for publishing to complete
 * Get prediction runtime endpoint key
 * Download a knowledgebase
 * Delete a knowledgebase

[Reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Knowledge.QnAMaker) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker/) | [C# Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/QnAMaker/SDK-based-quickstart)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, create a [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) in the Azure portal to get your authoring key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the QnA Maker API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up


#### [Visual Studio IDE](#tab/visual-studio)

Using Visual Studio, create a .NET Core application and install the client library by right-clicking on the solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `(package-name)`. Select version `(version)`, and then **Install**.

#### [CLI](#tab/cli)

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `qna-maker-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*.

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

Within the application directory, install the QnA Maker client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker --version 1.1.0
```


---

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/QnAMaker/SDK-based-quickstart/Program.cs), which contains the code examples in this quickstart.

From the project directory, open the *program.cs* file and add the following `using` directives:

[!code-csharp[Dependencies](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=Dependencies&highlight=1-2)]

In the application's `Main` method, add variables and code, shown in the following sections, to use the common tasks in this quickstart.

## Object models

QnA Maker uses two different object models:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, and download the knowledgebase.
* **[QnAMakerRuntime](#qnamakerruntimeclient-object-model)** is the object to query the knowledge base with the GenerateAnswer API and send new suggested questions using the Train API (as part of [active learning](../concepts/active-learning-suggestions.md)).


### QnAMakerClient object model

The authoring QnA Maker client is a [QnAMakerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient?view=azure-dotnet) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your key.

Once the client is created, use the [Knowledge base](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase) property to create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.GetDetailsAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.operationsextensions.getdetailsasync?view=azure-dotnet) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operationstatetype?view=azure-dotnet).

### QnAMakerRuntimeClient object model

The prediction QnA Maker client is a [QnAMakerRuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerruntimeclient?view=azure-dotnet) object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your prediction runtime key, returned from the authoring client call, `client.EndpointKeys.GetKeys` after the knowledgebase is published.

## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Authenticate the authoring client](#authenticate-the-client-for-authoring-the-knowledge-base)
* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Download a knowledge base](#download-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get query runtime key](#get-query-runtime-key)
* [Get status of an operation](#get-status-of-an-operation)
* [Authenticate the query runtime client](#authenticate-the-runtime-for-generating-an-answer)
* [Generate an answer from the knowledge base](#generate-an-answer-from-the-knowledge-base)

## Using this example knowledge base

The knowledge base in this quickstart starts with 2 conversational QnA pairs, this is done on purpose to simplify the example and to have highly predictable Ids to use in the Update method, associating follow-up prompts with questions to new pairs. This was planned and implemented in a specific order for this quickstart.

If you plan to develop your knowledge base over time with follow-up prompts that are dependent on existing QnA pairs, you may choose to:
* For larger knowledgebases, manage the knowledge base in a text editor or TSV tool that supports automation, then completely replace the knowledge base at once with an update.
* For smaller knowledgebases, manage the follow-up prompts entirely in the QnA Maker portal.

## Authenticate the client for authoring the knowledge base

In the **main** method, create a variable for your resource's Azure key and resource name. Both the authoring and prediction URLs use the resource name as the subdomain.

[!code-csharp[Set the resource key and resource name](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=Resourcevariables)]


> [!IMPORTANT]
> Go to the Azure portal and find the key and endpoint for the QnA Maker resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**.
> You need the entire key to create your knowledgebase. You need only the resource name from the endpoint. The format is ``.
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) provides secure key storage.

Next, create an [ApiKeyServiceClientCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.apikeyserviceclientcredentials?view=azure-dotnet) object with your key, and use it with your endpoint to create an [QnAMakerClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient?view=azure-dotnet) object.

|variable|Example|
|--|--|
|`authoringKey`|The key is a 32 character string and is available in the Azure portal, on the QnA Maker resource, on the **Keys and endpoints** page. This is not the same as the prediction runtime key.|
|`resourceName`| Your resource name is used in the format of `https://{resourceName}.cognitiveservices.azure.com`. This is not the same URL used to query the prediction runtime.|
||||

[!code-csharp[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=AuthorizationAuthor)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.createkbdto?view=azure-dotnet) object from three sources:

* For **editorial content**, use the [QnADTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadto?view=azure-dotnet) object.
    * To use metadata and follow-up prompts, use the editorial context, because this data is added at the individual QnA pair level.
* For **files**, use the [FileDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.filedto?view=azure-dotnet) object.
* For **URLs**, use a list of strings.

Call the [CreateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.createasync?view=azure-dotnet) method then pass the returned operation ID to the [MonitorOperation](#get-status-of-an-operation) method to poll for status.

The final line of the following code returns the knowledge base ID from the response from MonitorOperation.

[!code-csharp[Create a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=CreateKBMethod&highlight=37-38)]

Make sure the include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdatekbOperationDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdto?view=azure-dotnet) containing [add](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoadd?view=azure-dotnet), [update](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtoupdate?view=azure-dotnet), and [delete](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.updatekboperationdtodelete?view=azure-dotnet) DTO objects to the [UpdateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.updateasync?view=azure-dotnet) method. Use the [MonitorOperation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-csharp[Update a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=UpdateKBMethod&highlight=8)]

Make sure the include the [`MonitorOperation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Download a knowledge base

Use the [DownloadAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.downloadasync?view=azure-dotnet) method to download the database as a list of [QnADocumentsDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.qnadocumentsdto?view=azure-dotnet). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-csharp[Download a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=DownloadKB&highlight=3,4)]

## Publish a knowledge base

Publish the knowledge base using the [PublishAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.publishasync?view=azure-dotnet) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at your endpoint.

[!code-csharp[Publish a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=PublishKB&highlight=3)]

## Get query runtime key

Once a knowledgebase is published, you need the query runtime key to query the runtime. This isn't the same key used to create the original client object.

Use the [EndpointKeys](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.endpointkeys.getkeyswithhttpmessagesasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_EndpointKeys_GetKeysWithHttpMessagesAsync_System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_) method to get the [EndpointKeysDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.endpointkeysdto?view=azure-dotnet) class.

Use either of the key properties returned in the object to query the knowledgebase.

[!code-csharp[Get query runtime key](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=GetQueryEndpointKey&highlight=3)]

## Authenticate the runtime for generating an answer

Create a [QnAMakerRuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerruntimeclient?view=azure-dotnet) to query the knowledge base to generate an answer or train from active learning.

[!code-csharp[Authenticate the runtime](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=AuthorizationQuery)]

Use the QnAMakerRuntimeClient to get an answer from the knowledge or to send new suggested questions to the knowledge base for [active learning](../concepts/active-learning-suggestions.md).

## Generate an answer from the knowledge base

Generate an answer from a published knowledge base using the [RuntimeClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.qnamakerclient.knowledgebase?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_QnAMakerClient_Knowledgebase).[GenerateAnswerAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.runtimeextensions.generateanswerasync?view=azure-dotnet) method. This method accepts the knowledge base ID and the [QueryDTO](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto?view=azure-dotnet). Access additional properties of the QueryDTO, such a [Top](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.top?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_QueryDTO_Top) and [Context](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.querydto.context?view=azure-dotnet) to use in your chat bot.

[!code-csharp[Generate an answer from a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=GenerateAnswer&highlight=3)]

This is a simple example us querying the knowledge base. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).

## Delete a knowledge base

Delete the knowledge base using the [DeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.knowledgebaseextensions.deleteasync?view=azure-dotnet) method with a parameter of the knowledge base ID.

[!code-csharp[Delete a knowledge base](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=DeleteKB&highlight=3)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation?view=azure-dotnet) is returned. Use the [operation ID](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker.models.operation.operationid?view=azure-dotnet#Microsoft_Azure_CognitiveServices_Knowledge_QnAMaker_Models_Operation_OperationId) from the operation to poll (with retry logic) to determine the status of the original method.

The _loop_ and _Task.Delay_ in the following code block are used to simulate retry logic. These should be replaced with your own retry logic.

[!code-csharp[Monitor an operation](~/cognitive-services-quickstart-code/dotnet/QnAMaker/SDK-based-quickstart/Program.cs?name=MonitorOperation&highlight=10)]

## Run the application

Run the application with the `dotnet run` command from your application directory.

All of the code snippets in this article are [available](https://github.com/Azure-Samples/cognitive-services-qnamaker-python/blob/master/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.py) and can be run as a single file.

```dotnetcli
dotnet run
```

* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/QnAMaker/SDK-based-quickstart).