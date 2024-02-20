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


The playground gives you options for configuring and monitoring chat. On the right, model configuration determines which model formulates an answer using the search results from Azure AI Search. The input token progress indicator keeps track of the token count of the question you submit.

The **Advanced settings** on the left are [runtime parameters](../concepts/use-your-data.md#runtime-parameters) determine how much flexibility the chat model has in supplementing the grounding data, and how many chunks are provided to the model to generate its response. 

- **Strictness** determines the system's aggressiveness in filtering search documents based on their similarity scores. Setting strictness to 5 indicates that the system will aggressively filter out documents, applying a very high similarity threshold. [Semantic search](../concepts/use-your-data.md#search-types) can be helpful in this scenario because the ranking models do a better job of inferring the intent of the query. Lower levels of strictness produce more verbose answers, but might also include information that isn't in your index.

- **Retrieved documents** are the number of matching search results used to answer the question. It's capped at 20 to minimize latency and to stay under the model input limits.

- When **Limit responses to your data** is enabled, the model attempts to only rely on your documents for responses.
:::image type="content" source="../../../search/media/search-get-started-rag/azure-openai-studio-advanced-settings.png" alt-text="Screenshot of the advanced settings.":::

Send your first query. The chat models perform best in question and answer exercises. For example, "*who gave the Gettysburg speech.*" or "*when was the Gettysburg speech delivered?*".

More complex queries, such as "why was Gettysburg important", perform better if the model has some latitude to answer (lower levels of strictness) or if semantic search is enabled.

Queries that require deeper analysis or language understanding, such as "*how many speeches are in the vector store*", will probably fail. Remember that the search engine looks for chunks having exact or similar terms, phrases, or construction to the query. And while the model might understand the question, if search results are chunks from speeches, it's not the right information to answer that kind of question.

Chats are constrained by the number of documents (chunks) returned in the response (limited to 3-20 in Azure OpenAI Studio playground). As you can imagine, posing a question about "all of the titles" requires a full scan of the entire vector store. You could modify the code for the [web app](#deploy-your-model) (assuming you [deploy the solution](#deploy-your-model)) to allow for [service-side exhaustive search](/azure/search/vector-search-how-to-create-index#add-a-vector-search-configuration) on your queries.

<!--You can experiment with the configuration settings such as temperature and pre-response text to improve the performance of your task. You can read more about each parameter in the [REST API](../reference.md).-->

[!INCLUDE [deploy-web-app](deploy-web-app.md)]

