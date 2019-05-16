---
title: "Quickstart: Create knowledge base - REST, Go - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This Go REST-based quickstart walks you through creating a sample QnA Maker knowledge base, programmatically, that will appear in your Azure Dashboard of your Cognitive Services API account.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/04/2019
ms.author: diberry
---

# Quickstart: Create a knowledge base in QnA Maker using Go

This quickstart walks you through programmatically creating a sample QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The model for the knowledge base is defined in the JSON sent in the body of the API request. 

This quickstart calls QnA Maker APIs:
* [Create KB](https://go.microsoft.com/fwlink/?linkid=2092179)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)

## Prerequisites

* [Go 1.10.1](https://golang.org/dl/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 

## Create a knowledge base Go file

Create a file named `create-new-knowledge-base.go`.

## Add the required dependencies

At the top of `create-new-knowledge-base.go`, add the following lines to add necessary dependencies to the project:

[!code-go[Add the required dependencies](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=1-11 "Add the required dependencies")]

## Add the required constants
After the preceding required dependencies, add the required constants to access QnA Maker. Replace the value of the `subscriptionKey`variable with your own QnA Maker key.

[!code-go[Add the required constants](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=13-20 "Add the required constants")]

## Add the KB model definition
After the constants, add the following KB model definition. The model is converting into a string after the definition.

[!code-go[Add the KB model definition](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=22-44 "Add the KB model definition")]

## Add supporting structures and functions

Next, add the following supporting functions.

1. Add the structure for an HTTP request:

    [!code-go[Add the structure for an HTTP request](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=46-49 "Add the structure for an HTTP request")]

2. Add the following method to handle a POST to the QnA Maker APIs. For this quickstart, the POST is used to send the KB definition to QnA Maker.

    [!code-go[Add the POST method](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=51-66 "Add the POST method")]

3. Add the following method to handle a GET to the QnA Maker APIs. For this quickstart, the GET is used to check the status of the creation operation. 

    [!code-go[Add the GET method](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=68-83 "Add the GET method")]

## Add function to create KB

Add the following functions to make an HTTP POST request to create the knowledge base. The _create_ **Operation ID** is returned in the POST response header field **Location**, then used as part of the route in the GET request. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

[!code-go[Add the create_kb method](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=85-97 "Add the create_kb method")]

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

## Add function to get status

Add the following function to make an HTTP GET request to check the operation status. The `Ocp-Apim-Subscription-Key` is the QnA Maker service key, used for authentication. 

[!code-go[Add the check_status method](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=99-108 "Add the check_status method")]

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
## Add main function

The following function is the main function and creates the KB and repeats checks on the status. Because the KB creation may take some time, you need to repeat calls to check the status until the status is either successful or fails.

[!code-go[Add the main method](~/samples-qnamaker-go/documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.go?range=110-140 "Add the main method")]


## Compile the program
Enter the following command to compile the file. The command prompt does not return any information for a successful build.

```bash
go build create-new-knowledge-base.go
```

## Run the program

Enter the following command at a command-line to run the program. It will send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

```bash
go run create-new-knowledge-base
```

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 

[!INCLUDE [Clean up files and KB](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
