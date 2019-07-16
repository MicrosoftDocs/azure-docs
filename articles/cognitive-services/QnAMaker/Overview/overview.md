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

QnA Maker takes natural language questions, and returns the most appropriate answer from your custom knowledge base (KB) of information.

QnA Maker imports your content into question and answer sets you can then edit and test. After you publish your knowledge base, a client application sends a user's question to the service for analysis. Your QnA Maker service processes the question and responds with the best answer. 

![Ask a bot a question and get answer from knowledge base content](../media/what-is-qnamaker/bot-chat-with-qnamaker.png)

## What is a knowledge base 

A knowledge base is a collection of question and answer sets. 

To build your knowledge base, you provide content:

* **Files** such as PDF, XLS, and DOC
* **Web content** such as FAQs, Support pages, and How-to articles
* **Prebuilt question and answer sets** such as chit chat with personalities
* Your own questions and answers
 
Tag question and answer sets with **metadata**. The client application requests answers filtered with this metadata. The service applies the filter then responds with the answers.   

![Example question and answer with metadata](../media/what-is-qnamaker/example-question-and-answer-with-metadata.png)

After the knowledge base receives questions from users at the published endpoint, QnA Maker applies **active learning** to these real-world questions to suggest changes to your knowledge base to improve the quality. 

## Managing your knowledge base 

You don't need any developer experience to manage your knowledge base. The easy-to-use [web portal](https://qnamaker.ai) enables you to:

* develop your knowledge base of natural language questions and answers
* test your knowledge base
* train and publish to an Internet endpoint 

## Querying your knowledge base is simple

Querying the knowledge base is the process of sending the natural-language question to the service, along with requirements for the response such as metadata filters to apply, the number of answers expected, and a user's ID. 

The service responds with the best answer or answers. If a best response can't be determined, a configurable default answer is returned. 

QnA Maker provides SDKs and REST-based APIs to send the user question and return a response. Samples show this process including end-to-end bot scenarios you can quickly adopt and deploy. 

## Growing a QnA Maker knowledge base is easy

Because the knowledge base is stored in Azure, you can easily change your resources based on growth:

* allow for more questions and answers in a single knowledge base
* add more knowledge bases 
* handle more users requesting content

## Next steps
QnA Maker provides everything you need to build, manage and deploy your custom knowledge base. 

> [!div class="nextstepaction"]
> [Create a QnA Maker service](../how-to/set-up-qnamaker-service-azure.md)