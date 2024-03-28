---
title: What is custom question answering?
description: Custom question answering is a cloud-based Natural Language Processing (NLP) service that easily creates a natural conversational layer over your data. It can be used to find the most appropriate answer for any given natural language input, from your custom project.
ms.service: azure-ai-language
author: jboback
ms.author: jboback
recommendations: false
ms.topic: overview
ms.date: 12/19/2023
keywords: "qna maker, low code chat bots, multi-turn conversations"
ms.custom: language-service-question-answering
---

# What is custom question answering?

Custom question answering provides cloud-based Natural Language Processing (NLP) that allows you to create a natural conversational layer over your data. It is used to find appropriate answers from customer input or from a project.

Custom question answering is commonly used to build conversational client applications, which include social media applications, chat bots, and speech-enabled desktop applications. This offering includes features like enhanced relevance using a deep learning ranker, precise answers, and end-to-end region support.

Custom question answering comprises two capabilities:

* Custom question answering: Using this capability users can customize different aspects like edit question and answer pairs extracted from the content source, define synonyms and metadata, accept question suggestions etc.
* [QnA Maker](./../../qnamaker/Overview/overview.md): This capability allows users to get a response by querying a text passage without having the need to manage knowledge bases.

This documentation contains the following article types:

* The [quickstarts](./quickstart/sdk.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time.
* The [how-to guides](./how-to/manage-knowledge-base.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](./concepts/precise-answering.md) provide in-depth explanations of the service's functionality and features.
* [**Tutorials**](./tutorials/bot-service.md) are longer guides that show you how to use the service as a component in broader business solutions. 

## When to use custom question answering

* **When you have static information** - Use custom question answering when you have static information in your project. This project is custom to your needs, which you've built with documents such as PDFs and URLs.
* **When you want to provide the same answer to a request, question, or command** - when different users submit the same question, the same answer is returned.
* **When you want to filter static information based on meta-information** - add [metadata](./tutorials/multiple-domains.md) tags to provide additional filtering options relevant to your client application's users and the information. Common metadata information includes [chit-chat](./how-to/chit-chat.md), content type or format, content purpose, and content freshness. <!--TODO: Fix Link-->
* **When you want to manage a bot conversation that includes static information** - your project takes a user's conversational text or command and answers it. If the answer is part of a pre-determined conversation flow, represented in your project with [multi-turn context](./tutorials/guided-conversations.md), the bot can easily provide this flow.

## What is a project?

Custom question answering [imports your content](./how-to/manage-knowledge-base.md) into a project full of question and answer pairs. The import process extracts information about the relationship between the parts of your structured and semi-structured content to imply relationships between the question and answer pairs. You can edit these question and answer pairs or add new pairs.

The content of the question and answer pair includes:
* All the alternate forms of the question
* Metadata tags used to filter answer choices during the search
* Follow-up prompts to continue the search refinement

After you publish your project, a client application sends a user's question to your endpoint. Your custom question answering service processes the question and responds with the best answer.

## Create a chat bot programmatically

Once a custom question answering project is published, a client application sends a question to your project endpoint and receives the results as a JSON response. A common client application for custom question answering is a chat bot.

![Ask a bot a question and get answer from project content](../../qnamaker/media/qnamaker-overview-learnabout/bot-chat-with-qnamaker.png)

|Step|Action|
|:--|:--|
|1|The client application sends the user's _question_ (text in their own words), "How do I programmatically update my project?" to your project endpoint.|
|2|Custom question answering uses the trained project to provide the correct answer and any follow-up prompts that can be used to refine the search for the best answer. Custom question answering returns a JSON-formatted response.|
|3|The client application uses the JSON response to make decisions about how to continue the conversation. These decisions can include showing the top answer and presenting more choices to refine the search for the best answer. |
|||

## Build low code chat bots

The [Language Studio](https://language.cognitive.azure.com/) portal provides the complete project authoring experience. You can import documents, in their current form, to your project. These documents (such as an FAQ, product manual, spreadsheet, or web page) are converted into question and answer pairs. Each pair is analyzed for follow-up prompts and connected to other pairs. The final _markdown_ format supports rich presentation including images and links.

Once your project is edited, publish the project to a working [Azure Web App bot](https://azure.microsoft.com/services/bot-service/) without writing any code. Test your bot in the [Azure portal](https://portal.azure.com) or download it and continue development.

## High quality responses with layered ranking

The custom question answering system uses a layered ranking approach. The data is stored in Azure search, which also serves as the first ranking layer. The top results from Azure search are then passed through custom question answering's NLP re-ranking model to produce the final results and confidence score.

## Multi-turn conversations

Custom question answering provides multi-turn prompts and active learning to help you improve your basic question and answer pairs.

**Multi-turn prompts** give you the opportunity to connect question and answer pairs. This connection allows the client application to provide a top answer and provides more questions to refine the search for a final answer.

After the project receives questions from users at the published endpoint, custom question answering applies **active learning** to these real-world questions to suggest changes to your project to improve the quality.

## Development lifecycle

Custom question answering provides authoring, training, and publishing along with collaboration permissions to integrate into the full development life cycle.

> [!div class="mx-imgBorder"]
> ![Conceptual image of development cycle](../../qnamaker/media/qnamaker-overview-learnabout/development-cycle.png)

## Complete a quickstart

We offer quickstarts in most popular programming languages, each designed to teach you basic design patterns, and have you running code in less than 10 minutes.

* [Get started with the custom question answering client library](./quickstart/sdk.md)

## Next steps
Custom question answering provides everything you need to build, manage, and deploy your custom project.
