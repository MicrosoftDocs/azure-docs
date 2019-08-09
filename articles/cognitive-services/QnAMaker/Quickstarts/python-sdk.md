---
title: "Quickstart: QnA Maker client library for python"
titleSuffix: Azure Cognitive Services 
description: Get started with the QnA Maker client library for python. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 08/09/2019
ms.author: diberry
---

# Quickstart: QnA Maker client library for python

Get started with the QnA Maker client library for python. Follow these steps to install the package and try out the example code for basic tasks.  QnA Maker enables you to power a question-and-answer service from your semi-structured content like FAQ documents, URLs, and product manuals. 

Use the QnA Maker client library for python to:

* Create a knowledge base 
* Manage a knowledge base
* Publish a knowledge base

[Reference documentation](https://docs.microsoft.com/en-us/python/api/overview/azure/cognitiveservices/qnamaker?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-knowledge-qnamaker) | [Package (pypi)](https://pypi.org/project/azure-cognitiveservices-knowledge-qnamaker/) | [python Samples](https://github.com/Azure-Samples/cognitive-services-qnamaker-python/blob/master/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.py)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a QnA Maker Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for QnA Maker using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. 

After getting a key from your resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the resource, named `QNAMAKER_KEY` and `QNAMAKER_HOST`. Use the key and host values found in the Resource's **Keys** and **Overview** pages in the Azure portal.

### Install the Python library for LUIS

Within the application directory, install the Language Understanding (LUIS) authoring client library for python with the following command:

```console
pip install azure-cognitiveservices-knowledge-qnamaker
```

## Object model

The QnA Maker client is a [QnAMakerClient]() object that authenticates to Azure using ServiceClientCredentials, which contains your key.

Once the client is created, use the [Knowledge base]() property create, manage, and publish your knowledge base. 

Manage your knowledge base by sending a JSON object. For immediate operations, a method usually returns a JSON object indicating status. For long-running operations, the response is the operation ID. Call the [client.Operations.getDetails]() method with the operation ID to determine the [status of the request](). 

 
## Code examples

These code snippets show you how to do the following with the QnA Maker client library for python:

* [Create a knowledge base](#create-a-knowledge-base)
* [Update a knowledge base](#update-a-knowledge-base)
* [Publish a knowledge base](#publish-a-knowledge-base)
* [Delete a knowledge base](#delete-a-knowledge-base)
* [Get status of an operation](#get-status-of-an-operation)

## Add the dependencies

Create a file named `knowledgebase_quickstart.py`. Add the QnA Maker library and the Azure REST library to the file.

[!code-python[Require statements](~/samples-qnamaker-python/documentation-samples/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.py?name=dependencies)]

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.


|Environment variable|python variable|Example|
|--|--|--|
|`QNAMAKER_SUBSCRIPTION_KEY`|`subscription_key`|32 character GUID|
|`QNAMAKER_HOST`|`endpoint`|`https://westus.api.cognitive.microsoft.com`|
||||

[!code-python[Azure resource variables]()]

## Authenticate the client

Next, create a ServiceClientCredentials object with your key, and use it with your endpoint to create an [QnAMakerClient]() object. Use the client object to get a [knowledge base]() object.


[!code-python[Authorization to resource key]()]

## Create a knowledge base

A knowledge base stores question and answer pairs for the [CreateKbDTO]() object from three sources:

* For **editorial content**, use the [QnADTO]() object.
* For **files**, use the [FileDTO]() object. 
* For **URLs**, use a list of strings.

Call the [create]() method then pass the returned operation ID to the [Operations.getDetails](#get-status-of-an-operation) method to poll for status. 

[!code-python[Create a knowledge base]()]


## Update a knowledge base

You can update a knowledge base by passing in the knowledge base ID and an [UpdateKbOperationDTO]() containing [add](), [update](), and [delete]() DTO objects to the [update]() method. Use the [Operation.getDetail](#get-status-of-an-operation) method to determine if the update succeeded.

[!code-python[Update a knowledge base]()]

## Publish a knowledge base

Publish the knowledge base using the [publish]() method. This takes the current saved and trained model, referenced by the knowledge base ID, and publishes that at an endpoint. 

[!code-python[Publish a knowledge base]()]

## Delete a knowledge base

Delete the knowledge base using the [delete]() method with a parameter of the knowledge base ID. 

[!code-python[Delete a knowledge base]()]

## Get status of an operation

Some methods, such as create and update, can take enough time that instead of waiting for the process to finish, an [operation]() is returned. Use the [operation ID]() from the operation to poll (with retry logic) to determine the status of the original method. 

The _setTimeout_ call in the following code block is used to simulate asynchronous code. Replace this with retry logic. 

[!code-python[Monitor an operation]()]

## Run the application

Run the application with `python knowledgebase_quickstart.py` command from your application directory.

```console
python knowledgebase_quickstart.py
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
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-qnamaker-python/blob/master/documentation-samples/quickstarts/knowledgebase_quickstart/knowledgebase_quickstart.py).