---
title: What is QnA Maker API service?
titleSuffix: Azure Cognitive Services
description: QnA Maker is a cloud-based API service that applies custom machine-learning intelligence to a user's natural language question to provide the best answer.
services: cognitive-services
author: tulasim88
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: overview
ms.date: 03/19/2019
ms.author: tulasim
#customer intent: As a developer, I want to know how to use QnA Maker for my FAQs and product manuals so that I can enable conversational question and answer sessions for my customers.
---

# What is the QnA Maker API service?

QnA Maker is a cloud-based API service that takes natural language questions, and returns the most appropriate answer from your custom knowledge base (KB) of information.

A client application for QnA Maker is any conversational application that communicates with a user in natural language to answer a question. Examples of client applications include social media apps, chat bots, and speech-enabled desktop applications.

## Use QnA Maker knowledge base in a chat bot

Once a QnA Maker knowledge base is published, a client application sends a question to your knowledge base processing endpoint API and receives the results as a JSON response. A common client application for QnA Maker is a chat bot.

![Ask a bot a question and get answer from knowledge base content](../media/qnamaker-overview-learnabout/bot-chat-with-qnamaker.png)

|Step|Action|
|:--|:--|
|1|The client application sends the user's _question_ (text in their own words), "How do I programmatically update my Knowledge Base?" to your knowledge base endpoint.|
|2|QnA Maker applies the learned knowledge base to the natural language question to provide the correct answer. QnA Maker returns a JSON-formatted response, with a top answer and score.|
|3|The client application uses the JSON response to make decisions about how to continue the conversation. These decisions can include just showing the single answer or present more choices to refine the user's question. |

## What is a knowledge base 

QnA Maker imports your content, via a [portal](https://www.qnamaker.ai) or APIs, into a knowledge base of question and answer sets you can then edit and test. After you publish your knowledge base, a client application sends a user's question to the service for analysis. Your QnA Maker service processes the question and responds with the best answer. 

## Build a knowledge base from your custom information

To build your knowledge base, you provide content:

* **Files** such as PDF, XLS, and DOC
* **Web content** such as FAQs, Support pages, and How-to articles
* **Prebuilt question and answer sets** such as chit chat with personalities
* Your own questions and answers
 
Tag question and answer sets with **metadata**. The client application requests a response that has answers filtered with this metadata. The service applies the filter then responds with the answers.   

![Example question and answer with metadata](../media/qnamaker-overview-learnabout/example-question-and-answer-with-metadata.png)

Publish the trained knowledge to use it from an HTTP endpoint via REST API(s) or SDKs.

## Conversation skills

QnA Maker provides multi-turn prompts and active learning to help you improve your basic question and answer sets. 

**Multi-turn prompts** give you the opportunity to connect question and answer pairs. This connection allows the client application to provide an answer but also provide more questions to refine the answer. 

After the knowledge base receives questions from users at the published endpoint, QnA Maker applies **active learning** to these real-world questions to suggest changes to your knowledge base to improve the quality. 

## How do I start?

**Step 1**: Create a QnA Maker resource in the [Azure portal](https://portal.azure.com). 
**Step 2**: Create a knowledge base in the [QnA Maker](https://www.qnamaker.ai) portal. Add files and URLs while create the knowledge base. QnA Maker imports those files and URLS, turning the documents into editable question and answer pairs. 
**Step 3**: Publish your knowledge base and test from your custom endpoint. The publish page provides information for cURL and Postman testing of your endpoint. 
**Step 4**: Connect your chat bot or other client application to your knowledge base.  

## Development lifecycle

QnA Maker provides authoring, training, and publishing APIs and collaboration permissions to integrate into the full development life cycle. 

## News and updates

Learn what's new with QnA Maker.

* May 2019:
    * Multi-turn conversations
    * XYZ SDK

## Next steps
QnA Maker provides everything you need to build, manage and deploy your custom knowledge base. 

> [!div class="nextstepaction"]
> [Create a QnA Maker service](../how-to/set-up-qnamaker-service-azure.md)