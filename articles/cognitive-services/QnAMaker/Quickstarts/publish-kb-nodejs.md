---
title: "Quickstart: QnA Maker with REST APIs for Node.js"
description: This quickstart shows how to get started with the QnA Maker REST APIs for Node.js. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.
ms.date: 02/08/2020
ROBOTS: NOINDEX,NOFOLLOW
ms.custom: RESTCURL2020FEB27
ms.topic: how-to
---

# Quickstart: QnA Maker REST APIs for Node.js

Get started with the QnA Maker REST APIs for Node.js. Follow these steps to try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals.

Use the QnA Maker REST APIs for Node.js to:

* Create a knowledge base
* Replace a knowledge base
* Publish a knowledge base
* Delete a knowledge base
* Download a knowledge base
* Get status of an operation

[Reference documentation](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase) | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/tree/master/documentation-samples/quickstarts/rest-api)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key and endpoint (which includes the resource name), select **Quickstart** for your resource in the Azure portal.

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine.

After getting a key from your resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the resource, named `QNAMAKER_RESOURCE_KEY` and `QNAMAKER_AUTHORING_ENDPOINT`. Use the key and endpoint values found in the Resource's **Quickstart** page in the Azure portal.

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

```console
mkdir myapp && cd myapp
```

Run the `npm init -y` command to create a node `package.json` file.

```console
npm init -y
```

Add the `reqeuestretry` and `request` NPM packages:

```console
npm install requestretry request --save
```

## Code examples

These code snippets show you how to do the following with the QnA Maker REST APIs for Node.js:

* [Create a knowledge base](#create-a-knowledge-base)
* [Replace a knowledge base](#replace-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Download a knowledge base](#download-the-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)

## Add the dependencies

Create a file named `rest-apis.js` and add the following _requires_ statement to make HTTP requests.

```javascript
const request = require("requestretry");
```

## Add Azure resource information

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

Set the following environment values:

* `QNAMAKER_RESOURCE_KEY` - The **key** is a 32 character string and is available in the Azure portal, on the QnA Maker resource, on the **Quick start** page. This is not the same as the prediction endpoint key.
* `QNAMAKER_AUTHORING_ENDPOINT` - Your authoring endpoint, in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com`, includes your **resource name**. This is not the same URL used to query the prediction endpoint.

[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=authorization)]

## Create a knowledge base

A knowledge base stores question and answer pairs, created from a JSON object of:

* **Editorial content**.
* **Files** - local files that do not require any permissions.
* **URLs** - publicly available URLs.

Use the [REST API to create a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create).

[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=createKb)]

## Replace a knowledge base

Use the [REST API to replace a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/replace).

[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=replaceKb)]

## Publish a knowledge base

Publish the knowledge base. This process makes the knowledge base available from an HTTP query prediction endpoint.

Use the [REST API to publish a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish).


[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=publish)]

## Download the knowledge base

Use the [REST API to download a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/download).

[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=download)]

## Delete a knowledge base

When you are done using the knowledge base, delete it.

Use the [REST API to delete a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/delete).

[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=deleteKb)]

## Get status of an operation

Long running processes such as the creation process returns an operation ID, which needs to be checked with a separate REST API call. This function takes the body of the create response. The important key is the `operationState`, which determines if you need to continue polling.

Use the [REST API to monitor operations on a knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails).


[!code-javascript[Add Azure resources from environment variables](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js?name=operationDetails)]


## Run the application

Run the application with `node rest-apis.js` command from your application directory.

```console
node rest-apis.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
>[Tutorial: Create and answer a KB](../tutorials/create-publish-query-in-portal.md)

* [What is the QnA Maker API?](../Overview/overview.md)
* [Edit a knowledge base](../how-to/edit-knowledge-base.md)
* [Get usage analytics](../how-to/get-analytics-knowledge-base.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/blob/master/documentation-samples/quickstarts/rest-api/rest-api.js).