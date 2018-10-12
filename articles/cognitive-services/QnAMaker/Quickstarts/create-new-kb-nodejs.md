---
title: "Quickstart: Create knowledge base - REST, Node.js - QnA Maker"
description: This quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: diberry
---

# Quickstart: Create a QnA Maker knowledge base in Node.js

This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Create a knowledge base Node.js file

Create a file named `create-new-knowledge-base.js`.

## Add the required dependencies

At the top of `create-new-knowledge-base.js`, add the following lines to add necessary dependencies to the project:

[!code-nodejs[Add the dependencies](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=1-4 "Add the dependencies")]

## Add the required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

[!code-nodejs[Add the required constants](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=10-19 "Add the required constants")]

## Add the KB model definition

After the constants, add the following KB model definition. The model is converting into a string after the definition.

[!code-nodejs[Add the KB model definition](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=21-51 "Add the KB model definition")]

## Add supporting functions

Next, add the following supporting functions.

1. Add the following function to print out JSON in a readable format:

   [!code-nodejs[Add supporting functions, step 1](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=53-56 "Add supporting functions, step 1")]

2. Add the following functions to manage the HTTP response:

   [!code-nodejs[Add supporting functions, step 2](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=58-80 "Add supporting functions, step 2")]

## Add functions to create KB

Add the following functions to make an HTTP POST request to create the knowledge base. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

[!code-nodejs[POST Request to API](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=82-109 "POST Request to API")]

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

## Add functions to determine creation status

Add the following function to make an HTTP GET request to check the operation status. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

[!code-nodejs[GET Request to API](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=111-135 "GET Request to API")]

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

## Add create-kb function

The following function is the main function and creates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

[!code-nodejs[Add create-kb function](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js?range=137-167 "Add create-kb function")]

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
node create-new-knowledge-base.js
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
