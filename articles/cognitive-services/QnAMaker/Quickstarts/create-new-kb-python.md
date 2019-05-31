---
title:  "Quickstart: Create knowledge base - REST, Python - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This Python REST-based quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 01/24/2019
ms.author: diberry
---

# Quickstart: Create a knowledge base in QnA Maker using Python

This quickstart walks you through programmatically creating and publishing a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://go.microsoft.com/fwlink/?linkid=2092179)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)

## Prerequisites

* [Python 3.7](https://www.python.org/downloads/)
* You must have a QnA Maker service. To retrieve your key, select Keys under Resource Management in your dashboard.

[!INCLUDE [Code is available in Azure-Samples GitHub repo](../../../../includes/cognitive-services-qnamaker-python-repo-note.md)]

## Create a knowledge base Python file

Create a file named `create-new-knowledge-base-3x.py`.

## Add the required dependencies

At the top of `create-new-knowledge-base-3x.py`, add the following lines to add necessary dependencies to the project:

[!code-python[Add the required dependencies](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=1-1 "Add the required dependencies")]

## Add the required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

[!code-python[Add the required constants](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=5-13 "Add the required constants")]

## Add the KB model definition

After the constants, add the following KB model definition. The model is converting into a string after the definition.

[!code-python[Add the KB model definition](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=15-41 "Add the KB model definition")]

## Add supporting function

Add the following function to print out JSON in a readable format:

[!code-python[Add supporting function](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=43-45 "Add supporting function")]

## Add function to create KB

Add the following function to make an HTTP POST request to create the knowledge base. 
This API call returns a JSON response that includes the operation ID in the header field **Location**. Use the operation ID to determine if the KB is successfully created. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

[!code-python[Add function to create KB](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=48-59 "Add function to create KB")]

This API call returns a JSON response that includes the operation ID. Use the operation ID to determine if the KB is successfully created. 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:19:01Z",
  "lastActionTimestamp": "2018-09-26T05:19:01Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "8dfb6a82-ae58-4bcb-95b7-d1239ae25681"
}
```

## Add function to check creation status

The following function checks the creation status sending in the operation ID at the end of the URL route. The call to `check_status` is inside the main _while_ loop.

[!code-python[Add function to check creation status](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=61-67 "Add function to check creation status")]

This API call returns a JSON response that includes the operation status: 

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:22:53Z",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

Repeat the call until success or failure: 

```JSON
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-09-26T05:22:53Z",
  "lastActionTimestamp": "2018-09-26T05:23:08Z",
  "resourceLocation": "/knowledgebases/XXX7892b-10cf-47e2-a3ae-e40683adb714",
  "userId": "XXX9549466094e1cb4fd063b646e1ad6",
  "operationId": "177e12ff-5d04-4b73-b594-8575f9787963"
}
```

## Add main code block
The following loop polls for the creation operation status periodically until the operation is complete. 

[!code-python[Add main code block](~/samples-qnamaker-python/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base-3x.py?range=70-96 "Add main code block")]

## Build and run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
python create-new-knowledge-base-3x.py
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. Select your knowledge base name, for example QnA Maker FAQ, to view.

[!INCLUDE [Clean up files and KB](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
