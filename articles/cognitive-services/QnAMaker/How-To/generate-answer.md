---
title: "Quickstart: Get answer from knowledge base with cURL - QnA Maker"
titleSuffix: Azure Cognitive Services
description: QnA Maker creates or refreshes the queryable endpoint when you publish the knowledge base. When publishing is complete, the HTTP request settings to generate an answer from your knowledge base are available.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 12/04/2018
ms.author: diberry
---

# Quickstart: Get answer from knowledge base

QnA Maker creates or refreshes the queryable endpoint when you publish the knowledge base. When publishing is complete, the HTTP request settings to generate an answer from your knowledge base are available. 

## Prerequisites

* Latest [**cURL**](https://curl.haxx.se/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md) and have a [knowledge base with questions and answers](../Tutorials/create-publish-query-in-portal.md).

## Use endpoint with cURL

When your knowledge base is published, the **Publish** page displays the HTTP request settings to generate an answer. The **CURL** tab shows the settings required to generate an answer from the command-line tool, [CURL](https://www.getpostman.com).

[![Publish results](../media/qnamaker-use-to-generate-answer/curl-command-on-publish-page.png)](../media/qnamaker-use-to-generate-answer/curl-command-on-publish-page.png#lightbox)

To generate an answer with CURL, complete the following steps:

1. Copy the text in the CURL tab. 
1. Open a command-line or terminal and paste the text.
1. Edit the question to be relevant to your knowledge base. Be careful not to remove the containing JSON surrounding the question.
1. Enter the command. 
1. The response includes the relevant information about the answer. 

    ```bash
    > curl -X POST https://qnamaker-f0.azurewebsites.net/qnamaker/knowledgebases/1111f8c-d01b-4698-a2de-85b0dbf3358c/generateAnswer -H "Authorization: EndpointKey 111841fb-c208-4a72-9412-03b6f3e55ca1" -H "Content-type: application/json" -d "{'question':'How do I programmatically update my Knowledge Base?'}"
    {
      "answers": [
        {
          "questions": [
            "How do I programmatically update my Knowledge Base?"
          ],
          "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600",
          "score": 100.0,
          "id": 18,
          "source": "Custom Editorial",
          "metadata": [
            {
              "name": "category",
              "value": "api"
            }
          ]
        }
      ]
    }
    ```

## Use endpoint with Postman

The publish page also provides information to [generate an answer](../Quickstarts/get-answer-from-kb-using-postman.md) with Postman. 

## Next steps

> [!div class="nextstepaction"]
> [Use metadata while generating an answer](metadata-generateanswer-usage.md)