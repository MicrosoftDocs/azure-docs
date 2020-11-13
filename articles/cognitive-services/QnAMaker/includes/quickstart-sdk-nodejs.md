---
title: "Quickstart: QnA Maker client library for Node.js"
description: This quickstart shows how to get started with the QnA Maker client library for Node.js.
ms.topic: quickstart
ms.date: 06/18/2020
ms.custom: devx-track-js
---
Use the QnA Maker client library for Node.js to:

* Create a knowledgebase
* Update a knowledgebase
* Publish a knowledgebase
* Get prediction runtime endpoint key
* Wait for long-running task
* Download a knowledgebase
* Get answer
* Delete knowledge base

[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-qnamaker) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org).
* Once you have your Azure subscription, create a [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) in the Azure portal to get your authoring key and resource. After it deploys, select **Go to resource**.
    * You will need the key and resource name from the resource you create to connect your application to the QnA Maker API. You'll paste your key and resource name into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

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

Install the following NPM packages:

```console
npm install @azure/cognitiveservices-qnamaker
npm install @azure/cognitiveservices-qnamaker-runtime
npm install @azure/ms-rest-js
```

Your app's `package.json` file is updated with the dependencies.

Create a file named index.js and import the following libraries:

[!code-javascript[Dependencies](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=Dependencies)]

Create a variable for your resource's Azure key and resource name. Both the authoring and prediction URLs use the resource name as the subdomain.

> [!IMPORTANT]
> Go to the Azure portal and find the key and endpoint for the QnA Maker resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**.
> You need the entire key to create your knowledgebase. You need only the resource name from the endpoint. The format is `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`.
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) provides secure key storage.

[!code-javascript[Set the resource key and resource name](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=Resourcevariables)]

## Object models

QnA Maker uses two different object models:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, and download the knowledgebase.
* **[QnAMakerRuntime](#qnamakerruntimeclient-object-model)** is the object to query the knowledge base with the GenerateAnswer API and send new suggested questions using the Train API (as part of [active learning](../concepts/active-learning-suggestions.md)).


### QnAMakerClient object model

The authoring QnA Maker client is a [QnAMakerClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest) object that authenticates to Azure using your credentials, which contains your key.

Once the client is created, use the [knowledgebase](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest#knowledgebase) to create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.operations.getDetails](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operations?view=azure-node-latest#getdetails-string--msrest-requestoptionsbase-) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operation?view=azure-node-latest).

### QnAMakerRuntimeClient object model

The prediction QnA Maker client is a QnAMakerRuntimeClient object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your prediction runtime key, returned from the authoring client call, [client.EndpointKeys.getKeys](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeys?view=azure-node-latest#getkeys-msrest-requestoptionsbase-) after the knowledgebase is published.


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



## Authenticate the client for authoring the knowledge base

Instantiate a client with your endpoint and key. Create an ServiceClientCredentials object with your key, and use it with your endpoint to create an [QnAMakerClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest) object.

[!code-javascript[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=AuthorizationAuthor)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/createkbdto?view=azure-node-latest) object from three sources:

* For **editorial content**, use the [QnADTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnadto?view=azure-node-latest) object.
    * To use metadata and follow-up prompts, use the editorial context, because this data is added at the individual QnA pair level.
* For **files**, use the [FileDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/filedto?view=azure-node-latest) object. The FileDTO includes the filename as well as the public URL to reach the file.
* For **URLs**, use a list of strings to represent publicly available URLs.

The creation step also includes properties for the knowledgebase:
* `defaultAnswerUsedForExtraction` - what is returned when no answer is found
* `enableHierarchicalExtraction` - automatically create prompt relationships between extracted QnA pairs
* `language` - when creating the first knowledgebase of a resource, set the language to use in the Azure Search index.

Call the [create](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#create-createkbdto--servicecallback-operation--) method with the knowledge base information. The knowledge base information is basically a JSON object.

When the create method returns, pass the returned operation ID to the [wait_for_operation](#get-status-of-an-operation) method to poll for status. The wait_for_operation method returns when the operation completes. Parse the `resourceLocation` header value of the returned operation to get the new knowledge base ID.

[!code-javascript[Create a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=CreateKBMethod&highlight=39,46)]

Make sure the include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdateKbOperationDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest) containing [add](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#add), [update](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#update), and [delete](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#deleteproperty) DTO objects to the [update](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#update-string--updatekboperationdto--msrest-requestoptionsbase-) method. The DTOs are also basically JSON objects. Use the [wait_for_operation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-javascript[Update a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=UpdateKBMethod&highlight=74,81)]

Make sure the include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Download a knowledge base

Use the [download](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#download-string--models-environmenttype--msrest-requestoptionsbase-) method to download the database as a list of [QnADocumentsDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnadocumentsdto?view=azure-node-latest). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a TSV file.

[!code-javascript[Download a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=DownloadKB&highlight=2)]


## Publish a knowledge base

Publish the knowledge base using the [publish](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#publish-string--msrest-requestoptionsbase-) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. Check the HTTP response code to validate that the publish succeeded.

[!code-javascript[Publish a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=PublishKB&highlight=3)]


## Get query runtime key

Once a knowledgebase is published, you need the query runtime key to query the runtime. This isn't the same key used to create the original client object.

Use the [EndpointKeys.getKeys](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeys?view=azure-node-latest) method to get the [EndpointKeysDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeysdto?view=azure-node-latest) class.

Use either of the key properties returned in the object to query the knowledgebase.

[!code-javascript[Get query runtime key](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=GetQueryEndpointKey&highlight=4)]

## Authenticate the runtime for generating an answer

Create a QnAMakerRuntimeClient to query the knowledge base to generate an answer or train from active learning.

[!code-javascript[Authenticate the runtime](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=AuthorizationQuery)]

Use the QnAMakerRuntimeClient to get an answer from the knowledge or to send new suggested questions to the knowledge base for [active learning](../concepts/active-learning-suggestions.md).

## Generate an answer from the knowledge base

Generate an answer from a published knowledge base using the RuntimeClient.runtime.generateAnswer method. This method accepts the knowledge base ID and the QueryDTO. Access additional properties of the QueryDTO, such a Top and Context to use in your chat bot.

[!code-javascript[Generate an answer from a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=GenerateAnswer&highlight=3)]

This is a simple example querying the knowledge base. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).

## Delete a knowledge base

Delete the knowledge base using the [delete](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#deletemethod-string--msrest-requestoptionsbase-) method with a parameter of the knowledge base ID.

[!code-javascript[Delete a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=DeleteKB&highlight=3)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operations?view=azure-node-latest) is returned. Use the [operation ID](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operation?view=azure-node-latest#operationid) from the operation to poll (with retry logic) to determine the status of the original method.

The _delayTimer_ call in the following code block is used to simulate the retry logic. Replace this with your own retry logic.

[!code-javascript[Monitor an operation](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=MonitorOperation&highlight=8)]

## Run the application

Run the application with `node index.js` command from your application directory.

```console
node index.js
```

The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js).