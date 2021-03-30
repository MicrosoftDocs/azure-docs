---
title: "Quickstart: QnA Maker client library for Node.js"
description: This quickstart shows how to get started with the QnA Maker client library for Node.js.
ms.topic: quickstart
ms.date: 06/18/2020
ms.custom: devx-track-js
---

# [QnA Maker GA (stable release)](#tab/version-1)

Use the QnA Maker client library for Node.js to:

* Create a knowledgebase
* Update a knowledgebase
* Publish a knowledgebase
* Get prediction runtime endpoint key
* Wait for long-running task
* Download a knowledgebase
* Get an answer from a knowledgebase
* Delete knowledge base

[Reference documentation](/javascript/api/@azure/cognitiveservices-qnamaker/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-qnamaker) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js)

# [QnA Maker managed (preview release)](#tab/version-2)

Use the QnA Maker client library for Node.js to:

* Create a knowledgebase
* Update a knowledgebase
* Publish a knowledgebase
* Wait for long-running task
* Download a knowledgebase
* Get an answer from a knowledgebase
* Delete knowledge base

[Reference documentation](/javascript/api/@azure/cognitiveservices-qnamaker/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-qnamaker) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/preview-sdk/quickstart.js)

---

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

# [QnA Maker GA (stable release)](#tab/version-1)

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org).
* Once you have your Azure subscription, create a [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) in the Azure portal to get your authoring key and resource. After it deploys, select **Go to resource**.
    * You will need the key and resource name from the resource you create to connect your application to the QnA Maker API. You'll paste your key and resource name into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

# [QnA Maker managed (preview release)](#tab/version-2)

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [Node.js](https://nodejs.org).
* Once you have your Azure subscription, create a [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) in the Azure portal to get your authoring key and endpoint.
	* NOTE: Be sure to select the **Managed** checkbox.
	* After your QnA Maker resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect your application to the QnA Maker API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

---

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

# [QnA Maker GA (stable release)](#tab/version-1)

Install the following NPM packages:

```console
npm install @azure/cognitiveservices-qnamaker
npm install @azure/cognitiveservices-qnamaker-runtime
npm install @azure/ms-rest-js
```

# [QnA Maker managed (preview release)](#tab/version-2)

Install the following NPM packages:

```console
npm install @azure/cognitiveservices-qnamaker
npm install @azure/ms-rest-js
```

---

Your app's `package.json` file is updated with the dependencies.

Create a file named index.js and import the following libraries:

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Dependencies](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=Dependencies)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Dependencies](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=Dependencies)]

---

Create a variable for your resource's Azure key and resource name.

# [QnA Maker GA (stable release)](#tab/version-1)

> [!IMPORTANT]
> Go to the Azure portal and find the key and endpoint for the QnA Maker resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**.

- The value of QNA_MAKER_ENDPOINT has the format `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`. Go to the QnA Maker resource in the Azure portal and click on **Keys and Endpoint** to locate authoring (subscription) key and QnA Maker Endpoint.

 ![QnA Maker Authoring Endpoint](../media/keys-endpoint.png)
 
- The value of QNA_MAKER_RUNTIME_ENDPOINT has the format `https://YOUR-RESOURCE-NAME.azurewebsites.net`. 
   
- For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../key-vault/general/overview.md) provides secure key storage.

[!code-javascript[Set the resource key and resource name](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=Resourcevariables)]

# [QnA Maker managed (preview release)](#tab/version-2)

> [!IMPORTANT]
> Go to the Azure portal and find the key and endpoint for the QnA Maker resource you created in the prerequisites. They will be located on the resource's **key and endpoint** page, under **resource management**.

- The value of QNA_MAKER_ENDPOINT has the format `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`. Go to the QnA Maker resource in the Azure portal and click on **Keys and Endpoint** to locate authoring (subscription) key and QnA Maker Endpoint.

 ![QnA Maker Authoring Endpoint](../media/keys-endpoint.png)
 
- For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../key-vault/general/overview.md) provides secure key storage.

[!code-javascript[Set the resource key and resource name](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=Resourcevariables)]

---

## Object models

# [QnA Maker GA (stable release)](#tab/version-1)

[QnA Maker](/javascript/api/@azure/cognitiveservices-qnamaker/) uses two different object models:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, and download the knowledgebase.
* **[QnAMakerRuntime](#qnamakerruntimeclient-object-model)** is the object to query the knowledge base with the GenerateAnswer API and send new suggested questions using the Train API (as part of [active learning](../how-to/use-active-learning.md)).

# [QnA Maker managed (preview release)](#tab/version-2)

[QnA Maker](/javascript/api/@azure/cognitiveservices-qnamaker/) uses the following object model:
* **[QnAMakerClient](#qnamakerclient-object-model)** is the object to create, manage, publish, download, and query the knowledgebase.

---

### QnAMakerClient object model

The authoring QnA Maker client is a [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object that authenticates to Azure using your credentials, which contains your key.

Once the client is created, use the [knowledgebase](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient#knowledgebase) to create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.operations.getDetails](/javascript/api/@azure/cognitiveservices-qnamaker/operations#getdetails-string--msrest-requestoptionsbase-) method with the operation ID to determine the [status of the request](/javascript/api/@azure/cognitiveservices-qnamaker/operation).

### QnAMakerRuntimeClient object model

# [QnA Maker GA (stable release)](#tab/version-1)

The prediction QnA Maker client is a QnAMakerRuntimeClient object that authenticates to Azure using Microsoft.Rest.ServiceClientCredentials, which contains your prediction runtime key, returned from the authoring client call, [client.EndpointKeys.getKeys](/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeys#getkeys-msrest-requestoptionsbase-) after the knowledgebase is published.

# [QnA Maker managed (preview release)](#tab/version-2)

A QnA Maker managed resource does not require the use of the QnAMakerRuntimeClient object. Instead, you call [generateAnswer](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#generateAnswer_string__QueryDTO__msRest_RequestOptionsBase_) directly on the [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object.

---

## Code examples

These code snippets show you how to do the following with the QnA Maker client library for .NET:

# [QnA Maker GA (stable release)](#tab/version-1)

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

# [QnA Maker managed (preview release)](#tab/version-2)

* [Authenticate the authoring client](#authenticate-the-client-for-authoring-the-knowledge-base)
* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Download a knowledge base](#download-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)
* [Generate an answer from the knowledge base](#generate-an-answer-from-the-knowledge-base)

---

## Authenticate the client for authoring the knowledge base

Instantiate a client with your endpoint and key. Create an ServiceClientCredentials object with your key, and use it with your endpoint to create an [QnAMakerClient](/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient) object.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=AuthorizationAuthor)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Create QnAMakerClient object with key and endpoint](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=AuthorizationAuthor)]

---

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](/javascript/api/@azure/cognitiveservices-qnamaker/createkbdto) object from three sources:

* For **editorial content**, use the [QnADTO](/javascript/api/@azure/cognitiveservices-qnamaker/qnadto) object.
    * To use metadata and follow-up prompts, use the editorial context, because this data is added at the individual QnA pair level.
* For **files**, use the [FileDTO](/javascript/api/@azure/cognitiveservices-qnamaker/filedto) object. The FileDTO includes the filename as well as the public URL to reach the file.
* For **URLs**, use a list of strings to represent publicly available URLs.

The creation step also includes properties for the knowledgebase:
* `defaultAnswerUsedForExtraction` - what is returned when no answer is found
* `enableHierarchicalExtraction` - automatically create prompt relationships between extracted QnA pairs
* `language` - when creating the first knowledgebase of a resource, set the language to use in the Azure Search index.

Call the [create](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#create-createkbdto--servicecallback-operation--) method with the knowledge base information. The knowledge base information is basically a JSON object.

When the create method returns, pass the returned operation ID to the [wait_for_operation](#get-status-of-an-operation) method to poll for status. The wait_for_operation method returns when the operation completes. Parse the `resourceLocation` header value of the returned operation to get the new knowledge base ID.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Create knowledgebase](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=CreateKBMethod)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Create knowledgebase](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=CreateKBMethod)]

---

Make sure to include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdateKbOperationDTO](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto) containing [add](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#add), [update](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#update), and [delete](/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto#deleteproperty) DTO objects to the [update](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#update-string--updatekboperationdto--msrest-requestoptionsbase-) method. The DTOs are also basically JSON objects. Use the [wait_for_operation](#get-status-of-an-operation) method to determine if the update succeeded.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Update a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=UpdateKBMethod)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Update a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=UpdateKBMethod)]

---

Make sure the include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Download a knowledge base

Use the [download](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#download-string--models-environmenttype--msrest-requestoptionsbase-) method to download the database as a list of [QnADocumentsDTO](/javascript/api/@azure/cognitiveservices-qnamaker/qnadocumentsdto). This is _not_ equivalent to the QnA Maker portal's export from the **Settings** page because the result of this method is not a TSV file.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Download a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=DownloadKB)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Download a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=DownloadKB)]

---

## Publish a knowledge base

Publish the knowledge base using the [publish](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#publish-string--msrest-requestoptionsbase-) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. Check the HTTP response code to validate that the publish succeeded.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Publish a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=PublishKB)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Publish a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=PublishKB)]

---

## Query a knowledge base

# [QnA Maker GA (stable release)](#tab/version-1)

### Get query runtime key

Once a knowledgebase is published, you need the query runtime key to query the runtime. This isn't the same key used to create the original client object.

Use the [EndpointKeys.getKeys](/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeys) method to get the [EndpointKeysDTO](/javascript/api/@azure/cognitiveservices-qnamaker/endpointkeysdto) class.

Use either of the key properties returned in the object to query the knowledgebase.

[!code-javascript[Get query runtime key](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=GetQueryEndpointKey)]

### Authenticate the runtime for generating an answer

Create a QnAMakerRuntimeClient to query the knowledge base to generate an answer or train from active learning.

[!code-javascript[Authenticate the runtime](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=AuthorizationQuery)]

Use the QnAMakerRuntimeClient to get an answer from the knowledge or to send new suggested questions to the knowledge base for [active learning](../concepts/active-learning-suggestions.md).

### Generate an answer from the knowledge base

Generate an answer from a published knowledge base using the RuntimeClient.runtime.generateAnswer method. This method accepts the knowledge base ID and the [QueryDTO](/javascript/api/@azure/cognitiveservices-qnamaker/querydto). Access additional properties of the QueryDTO, such a Top and Context to use in your chat bot.

[!code-javascript[Generate an answer from a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=GenerateAnswer)]

# [QnA Maker managed (preview release)](#tab/version-2)

### Generate an answer from the knowledge base

Generate an answer from a published knowledge base using the QnAMakerClient.knowledgebase.generateAnswer method. This method accepts the knowledge base ID and the [QueryDTO](/javascript/api/@azure/cognitiveservices-qnamaker/querydto). Access additional properties of the QueryDTO, such a Top and Context to use in your chat bot.

[!code-javascript[Generate an answer from a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=GenerateAnswer)]

---

This is a simple example querying the knowledge base. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).

## Delete a knowledge base

Delete the knowledge base using the [delete](/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase#deletemethod-string--msrest-requestoptionsbase-) method with a parameter of the knowledge base ID.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Delete a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=DeleteKB)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Delete a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=DeleteKB)]

---

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](/javascript/api/@azure/cognitiveservices-qnamaker/operations) is returned. Use the [operation ID](/javascript/api/@azure/cognitiveservices-qnamaker/operation#operationid) from the operation to poll (with retry logic) to determine the status of the original method.

The _delayTimer_ call in the following code block is used to simulate the retry logic. Replace this with your own retry logic.

# [QnA Maker GA (stable release)](#tab/version-1)

[!code-javascript[Monitor an operation](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=MonitorOperation)]

# [QnA Maker managed (preview release)](#tab/version-2)

[!code-javascript[Monitor an operation](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/preview-sdk/quickstart.js?name=MonitorOperation)]

---

## Run the application

Run the application with `node index.js` command from your application directory.

```console
node index.js
```

# [QnA Maker GA (stable release)](#tab/version-1)

The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js).

# [QnA Maker managed (preview release)](#tab/version-2)

The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/preview-sdk/quickstart.js).

---
