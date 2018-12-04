---
title: "Quickstart: Use Postman to get answer from knowledge base - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This quickstart walks you through getting an answer from your knowledge base using Postman.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 12/5/2018
ms.author: diberry
#Customer intent: As an knowledge base manager new to the QnA Maker service, I want to get an answer from a published knowledge base using Postman. 
---

# Quickstart: Get an answer from knowledge base using Postman

This Postman-based quickstart walks you through getting an answer from your knowledge base.

## Prerequisites

* Latest [**Postman**](https://www.getpostman.com/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md) and have a [knowledge base with questions and answers](../Tutorials/create-publish-query-in-portal.md). 

## Publish to get endpoint

When you are ready to generate an answer to a question from your knowledge base, [publish](../How-to/publish-knowledge-base.md) your knowledge base.

## Use endpoint with Postman

When your knowledge base is published, the **Publish** page displays the HTTP request settings to generate an answer. The default view shows the settings required to generate an answer from [Postman](https://www.getpostman.com).

[![Publish results](../media/qnamaker-quickstart-get-answer-with-postman/publish-settings.png)](../media/qnamaker-quickstart-get-answer-with-postman/publish-settings.png#lightbox)

To generate an answer with Postman, complete the following steps:

1. Open Postman. 
1. Select the building block to create a basic request.
1. Set the **Request name** as `Generate QnA Maker answer`and the **collection** as `Generate QnA Maker answers`.
1. In the workspace, select the HTTP method of **POST**.
1. For the URL, concatenate the HOST value and the Post value to create the complete URL. 

    [![In Postman, set the method to Post and the complete URL](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-method-and-url.png)](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-method-and-url.png#lightbox)

1. Select the **Headers** tab under the URL. 
1. Add the first header key of **Content-Type** with a value of `application/json`.
1. Add the second header key of **Authorization** with the value of the word `Endpointkey`, then a space, then the key from the Publish page. 

    [![In Postman, set the headers](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-headers.png)](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-headers.png#lightbox)

1. Select the **Body** tab.
1. Select the **raw** format and enter the JSON that represents the question.

    [![In Postman, set the body JSON value](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-body-json-value.png)](../media/qnamaker-quickstart-get-answer-with-postman/set-postman-body-json-value.png#lightbox)

1. Select the **Send** button.
1. The response contains the answer along with other information that may be important to the client application. 

    [![In Postman, set the body JSON value](../media/qnamaker-quickstart-get-answer-with-postman/receive-postman-response.png)](../media/qnamaker-quickstart-get-answer-with-postman/receive-postman-response.png#lightbox)

## Next steps

The publish page also provides information to [generate an answer](../Quickstarts/get-answer-from-kb-using-curl.md) with cURL. 

> [!div class="nextstepaction"]
> [Use metadata while generating an answer](metadata-generateanswer-usage.md)