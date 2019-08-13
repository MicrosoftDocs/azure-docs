---
title: "Quickstart: QnA Maker with REST APIs for Node.js"
titleSuffix: Azure Cognitive Services 
description: Get started with the QnA Maker REST APIs for Node.js. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 08/13/2019
ms.author: diberry
---

# Quickstart: QnA Maker REST APIs for Node.js

Get started with the QnA Maker REST APIs for Node.js. Follow these steps to try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 

Use the QnA Maker REST APIs for Node.js to:

* Create a knowledge base 
* Manage a knowledge base
* Publish a knowledge base

[Reference documentation]https://docs.microsoft.com/en-us/rest/api/cognitiveservices/qnamaker/knowledgebase) | | [Node.js Samples](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/tree/master/documentation-samples/quickstarts/rest-api)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org).

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. 

After getting a key from your resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the resource, named `QNAMAKER_RESOURCE_KEY` and `QNAMAKER_AUTHORING_ENDPOINT`. Use the key and host values found in the Resource's **Keys** and **Overview** pages in the Azure portal.

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init -y` command to create a node application with a `package.json` file. 

```console
npm init -y
```
## Code examples

These code snippets show you how to do the following with the QnA Maker client library for Node.js:

* [Create a knowledge base](#create-a-knowledge-base)
* [Replace a knowledge base](#replace-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)

## Add the dependencies

Create a file named `rest-apis.js` and add the HTTP request package, `requestretry`. 

[!code-javascript[Require statements](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/rest-api/rest-api.js)]

## Add Azure resource information

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

## Create a knowledge base

A knowledge base stores question and answer pairs, created from a JSON object of:

* **Editorial content**. 
* **Files** - local files that do not require any permissions. 
* **URLs** - publicly available URLs.

## Replace a knowledge base

Replace an existing knowledge base with new information:



## Publish a knowledge base



## Delete a knowledge base


## Get status of an operation



## Run the application

Run the application with `node index.js` command from your application directory.

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
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-qnamaker-nodejs/blob/master/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.js).