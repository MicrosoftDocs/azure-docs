---
title: "Quickstart: custom question answering client library for Node.js"
description: This quickstart shows how to get started with the custom question answering client library for Node.js.
ms.topic: include
ms.date: 11/02/2021
ms.custom: devx-track-js, ignite-fall-2021
---

Use the QnA Maker client library for Node.js to:

* Create a knowledgebase
* Update a knowledgebase
* Publish a knowledgebase
* Wait for long-running task
* Download a knowledgebase
* Get an answer from a knowledgebase
* Delete a project

[Reference documentation](/javascript/api/@azure/cognitiveservices-qnamaker/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-qnamaker) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/preview-sdk/quickstart.js)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org).
* Custom question and answering, requires a [Language resource](https://portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint.
     * After your Language resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect your application to the QnA Maker API. Paste your key and endpoint into the code below later in the quickstart.


## Setting up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir qnamaker_quickstart && cd qnamaker_quickstart
```

Run the `npm init -y` command to create a node application with a `package.json` file.

```console
npm init -y
```

### Install the client library

Install the following npm packages:

```console
npm install @azure/cognitiveservices-qnamaker
npm install @azure/ms-rest-js
```

Your app's `package.json` file is updated with the dependencies.

Create a file named index.js and import the following libraries:

[!code-javascript[Dependencies](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=Dependencies)]

Create a variable for your resource's Azure key and resource name.

<!-- TODO: Replace Link
- We use subscription key and authoring key interchangeably. For more details on authoring key, follow [Keys](../concepts/azure-resources.md?tabs=v2#keys-in-qna-maker).
-->

- The value of QNA_MAKER_ENDPOINT has the format `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`. Go to the Azure portal and find the Language resource you created in the prerequisites. Select **Keys and Endpoint** page, under **resource management** to locate Authoring (Subscription) key and Endpoint.

    > [!div class="mx-imgBorder"]
    > ![Custom QnA Authoring Endpoint](../../../qnamaker/media/qnamaker-how-to-key-management/custom-qna-keys-and-endpoint.png)

- For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md) provides secure key storage.

    [!code-javascript[Set the resource key and resource name](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=Resourcevariables)]

## Object models

[QnA Maker](/javascript/api/@azure/cognitiveservices-qnamaker/) uses the following object model:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, download, and query the knowledgebase.

### QnAMakerClient object model

The authoring QnA Maker client is a [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object that authenticates to Azure using your credentials, which contains your key.

Once the client is created, use the [knowledgebase](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient#knowledgebase) to create, manage, and publish your project.

Manage your project by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.operations.getDetails](/javascript/api/@azure/cognitiveservices-qnamaker/operations#getdetails-string--msrest-requestoptionsbase-) method with the operation ID to determine the [status of the request](/javascript/api/@azure/cognitiveservices-qnamaker/operation).

### QnAMakerRuntimeClient object model

Custom question answering does not require the use of the QnAMakerRuntimeClient object. Instead, you call [generateAnswer](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#generateAnswer_string__QueryDTO__msRest_RequestOptionsBase_) directly on the [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object.

## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

* [Authenticate the authoring client](#authenticate-the-client-for-authoring-the-project)
* [Create a project](#create-a-project)
* [Update a project](#update-a-project)
* [Download a project](#download-a-project)
* [Publish a project](#publish-a-project)
* [Delete a project](#delete-a-project)
* [Get status of an operation](#get-status-of-an-operation)
* [Generate an answer from the project](#generate-an-answer-from-the-project)

## Authenticate the client for authoring the project

Instantiate a client with your endpoint and key. Create a ServiceClientCredentials object with your key, and use it with your endpoint to create an [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object.

[!code-javascript[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=AuthorizationAuthor)]

## Create a project

A project stores question and answer pairs for the [CreateKbDTO](/javascript/api/@azure/cognitiveservices-qnamaker/createkbdto) object from three sources:

* For **editorial content**, use the [QnADTO](/javascript/api/@azure/cognitiveservices-qnamaker/qnadto) object.
    * To use metadata and follow-up prompts, use the editorial context, because this data is added at the individual QnA pair level.
* For **files**, use the [FileDTO](/javascript/api/@azure/cognitiveservices-qnamaker/filedto) object. The FileDTO includes the filename and the public URL to reach the file.
* For **URLs**, use a list of strings to represent publicly available URLs.

The creation step also includes properties for the knowledgebase:
* `defaultAnswerUsedForExtraction` - what is returned when no answer is found
* `enableHierarchicalExtraction` - automatically create prompt relationships between extracted QnA pairs
* `language` - when creating the first knowledgebase of a resource, set the language to use in the Azure Search index.

Call the [create](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#create-createkbdto--servicecallback-operation--) method with the project information. The project information is basically a JSON object.

When the create method returns, pass the returned operation ID to the [wait_for_operation](#get-status-of-an-operation) method to poll for status. The wait_for_operation method returns when the operation completes. Parse the `resourceLocation` header value of the returned operation to get the new project ID.

[!code-javascript[Create knowledgebase](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=CreateKBMethod)]

Make sure to include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a project.

## Update a project

You can update a project by passing in the project ID and an [UpdateKbOperationDTO](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto) containing [add](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#add), [update](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#update), and [delete](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#deleteproperty) DTO objects to the [update](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#update-string--updatekboperationdto--msrest-requestoptionsbase-) method. The DTOs are also basically JSON objects. Use the [wait_for_operation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-javascript[Update a project](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=UpdateKBMethod)]

Make sure to include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a project.

## Download a project

Use the [download](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#download-string--models-environmenttype--msrest-requestoptionsbase-) method to download the database as a list of [QnADocumentsDTO](/javascript/api/@azure/cognitiveservices-qnamaker/qnadocumentsdto). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-javascript[Download a project](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=DownloadKB)]

## Publish a project

Publish the project using the [publish](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#publish-string--msrest-requestoptionsbase-) method. This takes the current saved and trained model, referenced by the project ID, and publishes that at an endpoint. Check the HTTP response code to validate that the publish succeeded.

[!code-javascript[Publish a project](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=PublishKB)]


## Query a project

### Generate an answer from the project

Generate an answer from a published project using the QnAMakerClient.knowledgebase.generateAnswer method. This method accepts the project ID and the [QueryDTO](/javascript/api/@azure/cognitiveservices-qnamaker/querydto). Access additional properties of the QueryDTO, such a Top and Context to use in your chat bot.

[!code-javascript[Generate an answer from a project](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=GenerateAnswer)]

<!-- TODO: Replace Link
This is a simple example querying the project. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).
-->

## Delete a project

Delete the project using the [delete](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#deletemethod-string--msrest-requestoptionsbase-) method with a parameter of the project ID.

[!code-javascript[Delete a project](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=DeleteKB)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](/javascript/api/@azure/cognitiveservices-qnamaker/operations) is returned. Use the [operation ID](/javascript/api/@azure/cognitiveservices-qnamaker/operation#operationid) from the operation to poll (with retry logic) to determine the status of the original method.

The _delayTimer_ call in the following code block is used to simulate the retry logic. Replace this with your own retry logic.

[!code-javascript[Monitor an operation](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=MonitorOperation)]

## Run the application

Run the application with `node index.js` command from your application directory.

```console
node index.js
```

The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/preview-sdk/quickstart.js).