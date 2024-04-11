---
title: 'Use your own data to generate text using Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to import and use your data in Azure OpenAI.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 02/12/2024
recommendations: false
---

## Chat playground

Start exploring Azure OpenAI capabilities with a no-code approach through the chat playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. 

:::image type="content" source="../media/quickstarts/chat-playground.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/chat-playground.png":::

The playground gives you options to tailor your chat experience. On the right, you can select **Deployment** to determine which model generates a response using the search results from your index. You choose the number of past messages to include as conversation history for future generated responses. [Conversation history](../concepts/use-your-data.md#conversation-history-for-better-results) gives context to generate related responses but also consumes [token usage](../concepts/use-your-data.md#token-usage-estimation-for-azure-openai-on-your-data). The input token progress indicator keeps track of the token count of the question you submit. 


The **Advanced settings** on the left are [runtime parameters](../concepts/use-your-data.md#runtime-parameters), which give you control over retrieval and search relevant information from your data. A good use case is when you want to make sure responses are generated only based on your data or you find the model cannot generate a response based on existed information on your data.

- **Strictness** determines the system's aggressiveness in filtering search documents based on their similarity scores. Setting strictness to 5 indicates that the system will aggressively filter out documents, applying a very high similarity threshold. [Semantic search](../concepts/use-your-data.md#search-types) can be helpful in this scenario because the ranking models do a better job of inferring the intent of the query. Lower levels of strictness produce more verbose answers, but might also include information that isn't in your index. This is set to 3 by default.

- **Retrieved documents** is an integer that can be set to 3, 5, 10, or 20, and controls the number of document chunks provided to the large language model for formulating the final response. By default, this is set to 5.


- When **Limit responses to your data** is enabled, the model attempts to only rely on your documents for responses. This is set to true by default.

:::image type="content" source="../media/quickstarts/studio-advanced-settings.png" alt-text="Screenshot of the advanced settings.":::

Send your first query. The chat models perform best in question and answer exercises. For example, "*What are my available health plans?*" or "*What is the health plus option?*".

Queries that require data analysis would probably fail, such as "*Which health plan is most popular?*". Queries that require information about all of your data will also likely fail, such as "*How many documents have I uploaded?*". Remember that the search engine looks for chunks having exact or similar terms, phrases, or construction to the query. And while the model might understand the question, if search results are chunks from the data set, it's not the right information to answer that kind of question.

Chats are constrained by the number of documents (chunks) returned in the response (limited to 3-20 in Azure OpenAI Studio playground). As you can imagine, posing a question about "all of the titles" requires a full scan of the entire vector store.

[!INCLUDE [deploy-web-app](deploy-web-app.md)]

