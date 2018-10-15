---
title: "Quickstart: Update knowledge base - REST, Node.js - QnA Maker"
titleSuffix: Azure Cognitive Services
description: This quickstart walks you through programmatically updating an existing QnA Maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: diberry
---

# Quickstart: Update a QnA Maker knowledge base in Node.js

This quickstart walks you through programmatically updating an existing QnA Maker knowledge base (KB).  This JSON allows you to update a KB by adding new data sources, changing data sources, or deleting data sources.

This API is equivalent to editing, then using the **Save and train** button in the QnA Maker portal.

This quickstart calls QnA Maker APIs:
* [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) - The model for the knowledge base is defined in the JSON sent in the body of the API request. 
* [Get Operation Details](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails)

## Prerequisites

* [Node.js 6+](https://nodejs.org/en/download/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-nodejs.md).

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-nodejs-repo-note.md)]

## Create a knowledge base Node.js file

Create a file named `update-knowledge-base.js`.

## Add the required dependencies

At the top of `update-knowledge-base.js`, add the following lines to add necessary dependencies to the project:

[!code-nodejs[Add the dependencies](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=1-4 "Add the dependencies")]

## Add required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key. 

[!code-nodejs[Add required constants](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=10-17 "Add required constants")]

## Add knowledge base ID

After the previous constants, add the knowledge base ID and add it to the path:

[!code-nodejs[Add knowledge base ID](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=19-23 "Add knowledge base ID")]

## Add the KB update model definition

After the constants, add the following KB update definition. The update definition has three sections:

* add
* update
* delete

Each section can be used in the same single request to the API. 

[!code-nodejs[Add the KB update definition](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=25-53 "Add the KB update definition")]


## Add supporting functions

Next, add the following supporting functions.

1. Add the following function to print out JSON in a readable format:

   [!code-nodejs[Add supporting functions, step 1](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=55-58 "Add supporting functions, step 1")]

2. Add the following functions to manage the HTTP response to get the creation operation status:

   [!code-nodejs[Add supporting functions, step 2](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=60-82 "Add supporting functions, step 2")]

## Add PATCH request to update KB

Add the following functions to make an HTTP PATCH request to update the knowledge base. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication.

[!code-nodejs[Add PATCH request to update KB](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=84-111 "Add PATCH request to update KB")]

This API call returns a JSON response that includes the operation ID. The operation ID is necessary to request status if the operation is not complete.

```JSON
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-10-02T01:23:00Z",
  "lastActionTimestamp": "2018-10-02T01:23:00Z",
  "userId": "335c3841df0b42cdb00f53a49d51a89c",
  "operationId": "e7be3897-88ff-44e5-a06c-01df0e05b78c"
}
```

## Add GET request to determine operation status

Check the status of the operation.
    
[!code-nodejs[Add GET request to determine operation status](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=113-137 "Add GET request to determine operation status")]

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

## Add update_kb method

The following method updates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

[!code-nodejs[Add update_kb method](~/samples-qnamaker-nodejs/documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js?range=139-169 "Add update_kb method")]

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to update the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
node update-knowledge-base.js
```

Once your knowledge base is updated, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)