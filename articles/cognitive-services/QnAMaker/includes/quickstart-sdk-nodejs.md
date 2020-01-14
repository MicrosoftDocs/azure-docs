---
title: "Quickstart: QnA Maker client library for Node.js"
description: This quickstart shows how to get started with the QnA Maker client library for Node.js.
ms.topic: quickstart
ms.date: 01/13/2020
---
Use the QnA Maker client library for Node.js to:

* Create a knowledge base
* Update a knowledge base
* Publish a knowledge base
* Get published endpoint key
* Wait for long-running task
* Delete knowledge base

[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-qnamaker) | [Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org).

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine.

After getting the key and endpoint from your resource, get the values from the Azure portal, for your new resource, on the Quickstart page.

[Create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication), named `QNAMAKER_AUTHORING_KEY` and `QNAMAKER_ENDPOINT`. You can copy the `[.env.sample](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/.env.sample)` file to `.env` and use the environment variables in that file.

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

Install the required and optional NPM packages:

```console
npm install @azure/cognitiveservices-qnamaker @azure/ms-rest-js dotenv
```

Your app's `package.json` file is updated with the dependencies. The `dotenv` is optional and is used to allow you to set the environment variables in a text file. Do not check the `.env` into your source control.


## Object model

The QnA Maker client is a [QnAMakerClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest) object that authenticates to Azure using ServiceClientCredentials, which contains your key.

Once the client is created, use the [Knowledge base](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest#knowledgebase) property create, manage, and publish your knowledge base.

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.getDetails](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operations?view=azure-node-latest#getdetails-string--servicecallback-operation--) method with the operation ID to determine the [status of the request](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operationstatetype?view=azure-node-latest).


## Code examples

These code snippets show you how to do the following with the QnA Maker client library for Node.js:

* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get published endpoint](#get-published-endpoint)
* [Get status of an operation](#get-status-of-an-operation)

## Add the dependencies

Create a file named `index.js`. Add the QnA Maker library and the dependencies to the file.

[!code-javascript[Require statements](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=dependencies)]

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

|Environment variable|Node.js variable|Example|
|--|--|--|
|`QNAMAKER_AUTHORING_KEY`|`authoring_key`|The key is a 32 character string and is available in the Azure portal, on the QnA Maker resource, on the Quickstart page. This is not the same as the prediction endpoint key.|
|`QNAMAKER_ENDPOINT`|`endpoint`| Your authoring endpoint, in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`, includes your **resource name**. This is not the same URL used to query the prediction endpoint.|
||||

[!code-javascript[Azure resource variables](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=resourceSettings)]

## Authenticate the client

Next, create a ApiKeyCredentials object with your key, and use it with your endpoint to create an [QnAMakerClient](https://docs.microsoft.com/javascript/api/%40azure/cognitiveservices-qnamaker/qnamakerclient?view=azure-node-latest#qnamakerclient-serviceclientcredentials--string--msrest-serviceclientoptions-) object. Use the client object to get a [knowledge base client](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest) object.


[!code-javascript[Authorization to resource key](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=authorization)]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/createkbdto?view=azure-node-latest) object from three sources:

* For **editorial content**, use the [QnADTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/qnadto?view=azure-node-latest) object.
* For **files**, use the [FileDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/filedto?view=azure-node-latest) object.
* For **URLs**, use a list of strings.

Call the [create](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#create-createkbdto--servicecallback-operation--) method with the knowledge base information. The knowledge base information is basically a JSON object.

When the create method returns, pass the returned operation ID to the [wait_for_operation](#get-status-of-an-operation) method to poll for status. The wait_for_operation method returns when the operation completes. Parse the `resourceLocation` header value of the returned operation to get the new knowledge base ID.

[!code-javascript[Create a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=createKnowledgeBase&highlight=15,30)]

Make sure the include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully create a knowledge base.

## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdateKbOperationDTO](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest) containing [add](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#add), [update](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#update), and [delete](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/updatekboperationdto?view=azure-node-latest#deleteproperty) DTO objects to the [update](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#update-string--updatekboperationdto--msrest-requestoptionsbase-) method. The DTOs are also basically JSON objects. Use the [wait_for_operation](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-javascript[Update a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=updateKnowledgeBase&highlight=28)]

Make sure the include the [`wait_for_operation`](#get-status-of-an-operation) function, referenced in the above code, in order to successfully update a knowledge base.

## Publish a knowledge base

Publish the knowledge base using the [publish](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#publish-string--msrest-requestoptionsbase-) method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. Check the HTTP response code to validate publish succeeded.

[!code-javascript[Publish a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=publishKnowledgeBase&highlight=3)]


# Get published endpoint

Once the knowledge base is published, access the published knowledge base via the query prediction runtime' generateAnswer API. In order to do this, you need the runtime's endpoint key. This is different than the authoring key.

[!code-javascript[Get endpoint keys](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=getEndpointKeys&highlight=3)]

Two endpoint keys are returned from the call. Only one is necessary to access the runtime endpoint.

## Delete a knowledge base

Delete the knowledge base using the [delete](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/knowledgebase?view=azure-node-latest#deletemethod-string--msrest-requestoptionsbase-) method with a parameter of the knowledge base ID.

[!code-javascript[Delete a knowledge base](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=deleteKnowledgeBase&highlight=3)]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operations?view=azure-node-latest) is returned. Use the [operation ID](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-qnamaker/operation?view=azure-node-latest#operationid) from the operation to poll (with retry logic) to determine the status of the original method.

The _delayTimer_ call in the following code block is used to simulate the retry logic. Replace this with your own retry logic.

[!code-javascript[Monitor an operation](~/cognitive-services-quickstart-code/javascript/QnAMaker/sdk/qnamaker_quickstart.js?name=monitorOperation&highlight=8,13)]

## Run the application

Run the application with `node index.js` command from your application directory.

All of the code snippets in this article are [available](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/QnAMaker/sdk/qnamaker_quickstart.js) and can be run as a single file.

```console
node index.js
```

The program prints status to the console:

```console
qnamaker_quickstart@1.0.0 start C:\samples\cognitive-services-quickstart-code\javascript\QnAMaker\sdk> node index.js

Operation state - Running
Operation state - Running
Operation state - Running
Operation state - Running
Operation state - Running
Operation state - Succeeded
Create operation 200, KB ID 99df758d-f23f-4931-ab83-e738fe978e69
Operation state - Running
Operation state - Running
Operation state - Running
Operation state - Succeeded
Update operation state 200 - HTTP status 200
Publish request succeeded - HTTP status 204
GetEndpointKeys request succeeded - HTTP status 200 - primary key 8482830b-681e-400e-b8a3-4016278aba64
QnA Maker FAQ stored in English language with 1 sources, last updated 2020-01-12T16:54:40Z
New KB name stored in English language with 1 sources, last updated 2020-01-12T17:32:16Z
New KB name stored in English language with 1 sources, last updated 2020-01-13T00:27:46Z
Delete operation state succeeded - HTTP status 204
done
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)