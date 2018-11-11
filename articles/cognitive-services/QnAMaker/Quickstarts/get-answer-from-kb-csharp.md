---
title: "Quickstart: Get answer from knowledge base - REST, C# - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This C# REST-based quickstart walks you through getting an answer from knowledge base, programmatically.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 11/6/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically get an answer a knowledge base using C#. 
---

## Get answers to a question by using a knowledge base

This quickstart walks you through programmatically getting an answer from a QnA Maker knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/data-sources-supported.md). The question is sent in the JSON sent in the body of the API request. 

```json
{question:'Does QnA Maker support non-English languages?'}
```

The answer is returned in a JSON object:

```json
{
  "answers": [
    {
      "questions": [
        "Does QnA Maker support non-English languages?"
      ],
      "answer": "See more details about [supported languages](https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/overview/languages-supported).\n\n\nIf you have content from multiple languages, be sure to create a separate service for each language.",
      "score": 82.19,
      "id": 11,
      "source": "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
      "metadata": []
    }
  ]
}
```

## Prerequisites

* Latest [**Visual Studio Community edition**](https://www.visualstudio.com/downloads/).
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your dashboard. 
* Published knowledge base's ID. You can create an empty knowledge base, then import this KB on the **Settings** page, then publish. You can download and use [this basic KB](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/basic-kb.tsv).

The code for this quickstart is available. 


## Create a knowledge base project

[!INCLUDE [Create Visual Studio Project](../../../../includes/cognitive-services-qnamaker-quickstart-csharp-create-project.md)] 

## Add the required dependencies

At the top of Program.cs, replace the single using statement with the following lines to add necessary dependencies to the project:

[!code-csharp[Add the required dependencies](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer-from-knowledge-base/QnAMakerAnswerQuestion/Program.cs?range=1-4 "Add the required dependencies")]

## Add the required constants

At the top of the Program class, add the following constants to access QnA Maker:

[!code-csharp[Add the required constants](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer-from-knowledge-base/QnAMakerAnswerQuestion/Program.cs?range=10-32 "Add the required constants")]

## Add a POST request to send question 

The following code makes an HTTPS request to the QnA Maker API to send the question to the KB and receives the response:

[!code-csharp[Add a POST request to send question to KB](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer-from-knowledge-base/QnAMakerAnswerQuestion/Program.cs?range=34-47 "Add a POST request to send question to KB")]

## Add GetAnswers method 


[!code-csharp[Add GET request to determine creation status](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer-from-knowledge-base/QnAMakerAnswerQuestion/Program.cs?range=49-56 "Add GET request to determine creation status")]

This API call returns a JSON response that includes the operation status: 


## Add the GetAnswers method to Main

Change the Main method to call the GetAnswers method:

[!code-csharp[Add CreateKB method](~/samples-qnamaker-csharp/documentation-samples/quickstarts/get-answer-from-knowledge-base/QnAMakerAnswerQuestion/Program.cs?range=58-62 "Add CreateKB method")]

## Build and run the program

Build and run the program. It will automatically send the request to the QnA Maker API to create the KB, then it will poll for the results every 30 seconds. Each response is printed to the console window.

Once your knowledge base is created, you can view it in your QnA Maker Portal, [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) page. 


[!INCLUDE [Clean up files and KB](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)