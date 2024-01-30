---
title: 'Quickstart: RAG app'
titleSuffix: Azure AI Search
description: Use Azure OpenAI Studio to chat with a search index on Azure AI Search. Explore the Retrieval Augmented Generation (RAG) pattern for your search solution.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
ms.topic: quickstart
ms.date: 01/25/2024
---

# Quickstart: Chat with your search index in Azure OpenAI Studio

Get started with generative search using Azure OpenAI Studio's **Add your own data** option to implement a Retrieval Augmented Generation (RAG) experience powered by Azure AI Search.

**Add your own data** gives you built-in data preprocessing (text extraction and clean up), data chunking, embedding, and indexing. You can stand up a chat experience quickly, experiment with prompts over your own data, and gain important insights as to how your content performs before writing any code.

In this quickstart:

> [!div class="checklist"]
> + Deploy Azure OpenAI models
> + Download sample PDFs
> + Configure data processing
> + Chat with your data in the Azure OpenAI Studio playground
> + Test your index with different chat models, configurations, and history

## Prerequisites

+ [An Azure subscription](https://azure.microsoft.com/free/)

+ [Azure OpenAI](https://aka.ms/oai/access)

+ [Azure Storage](/azure/storage/common/storage-account-create)

+ [Azure AI Search](search-create-app-portal.md), in any region, on a billable tier (Basic and higher), preferably with [semantic ranking enabled](semantic-how-to-enable-disable.md)

+ Contributor permissions in the Azure subscription for creating resources

+ Download the sample famous-speeches-pdf PDFs in [azure-search-sample-data](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/famous-speeches-pdf).

  For this quickstart, we recommend starting with smaller files so that you can conserve [vector storage](vector-search-index-size.md) and [Azure OpenAI quota](/azure/ai-services/openai/quotas-limits) for other work.

## Set up model deployments

1. Start [Azure OpenAI Studio](https://oai.azure.com/portal).

1. Sign in, select your Azure subscription and Azure OpenAI resource, and then select **Use resource**.

1. Under **Management > Deployments**, find or create a deployment for each of the following models:

   + [text-embedding-ada-002](/azure/ai-services/openai/concepts/models#embeddings)
   + [gpt-35-turbo](/azure/ai-services/openai/concepts/models#gpt-35)

   Deploy more *chat* models if you want to compare them using your data. *Fine-tuning* models like Text-Davinci-002 aren't supported for this scenario. 

   If you create new deployments, the default configurations are suited for this tutorial. It's helpful to name each deployment after the model. For example, "text-embedding-ada-002" as the deployment name of the text-embedding-ada-002 model.

## Generate a vector store for the playground

1. Sign in to the [Azure OpenAI Studio](https://oai.azure.com/portal).

1. On the **Chat** page under **Playground**, select **Add your data (preview)**.

1. Select **Add data source**.

1. From the dropdown list, select **Upload files**.

   :::image type="content" source="media/search-get-started-rag/azure-openai-data-source.png" lightbox="media/search-get-started-rag/azure-openai-data-source.png" alt-text="Screenshot of the upload files option.":::

1. In Data source, select your Azure Blob storage resource. Enable cross-origin scripting if prompted.

1. Select your Azure AI Search resource.

1. Provide an index name that's unique in your search service.

1. Check **Add vector search to this search index.** This option tokenizes your content and generates embeddings.

1. Select **Azure OpenaI - text-embedding-ada-002**. This embedding model accepts a maximum of 8192 tokens for each chunk. Data chunking is internal and nonconfigurable.

1. Check the acknowledgment that Azure AI Search is a billable service. If you're using an existing search service, there's no extra charge for vector store unless you add semantic ranking. If you're creating a new service, Azure AI Search becomes billable upon service creation. 

1. Select **Next**.

1. In Upload files, select the four files and then select **Upload**. File size limit is 16 MB.

1. Select **Next**.

1. In Data Management, choose **Hybrid + semantic** if [semantic ranking is enabled](semantic-how-to-enable-disable.md) on your search service. If semantic ranking is disabled, choose **Hybrid (vector + keyword)**. [Hybrid](hybrid-search-overview.md) is a better choice because vector (similarity) search and keyword search execute the same query input in parallel, which can produce a more relevant response.

   :::image type="content" source="media/search-get-started-rag/azure-openai-data-manage.png" lightbox="media/search-get-started-rag/azure-openai-data-manage.png" alt-text="Screenshot of the data management options.":::

1. Acknowledge that vectorization of the sample data is billed at the usage rate of the Azure OpenAI embedding model.

1. Select **Next**, and then select **Review and Finish**.

## Chat with your data

The playground gives you options for configuring and monitoring chat. On the right, model configuration determines which model formulates an answer using the search results from Azure AI Search. The input token progress indicator keeps track of the token count of the question you submit.

Advanced settings on the left determine how much flexibility the chat model has in supplementing the grounding data, and how many chunks are provided to the model to generate its response. 

+ Strictness level 5 means no supplementation. Only your grounding data is used, which means the search engine plays a large role in the quality of the response. Semantic ranking can be helpful in this scenario because the ranking models do a better job of inferring the intent of the query. Lower levels of strictness produce more verbose answers, but might also include information that isn't in your index.

+ Retrieved documents are the number of matching search results used to answer the question. It's capped at 20 to minimize latency and to stay under the model input limits.

  :::image type="content" source="media/search-get-started-rag/azure-openai-studio-advanced-settings.png" alt-text="Screenshot of the advanced settings.":::

1. Start with these advanced settings:

   + Verify the **Limit responses to your data content** option is selected.
   + Strictness set to 3 or 4.
   + Retrieved documents set to 20.  Maximum documents give the model more information to work with when generating responses. The tradeoff for maximum documents is increased query latency, but you can experiment with chat replay to find the right balance. 

1. Send your first query. The chat models perform best in question and answer exercises. For example, "who gave the Gettysburg speech" or "when was the Gettysburg speech delivered".

   More complex queries, such as "why was Gettysburg important", perform better if the model has some latitude to answer (lower levels of strictness) or if semantic ranking is enabled.

   Queries that require deeper analysis or language understanding, such as "how many speeches are in the vector store", will probably fail. Remember that the search engine looks for chunks having exact or similar terms, phrases, or construction to the query. And while the model might understand the question, if search results are chunks from speeches, it's not the right information to answer that kind of question.

   Finally, chats are constrained by the number of documents (chunks) returned in the response (limited to 3-20 in Azure OpenAI Studio playground). As you can imagine, posing a question about "all of the titles" requires a full scan of the entire vector store. You could modify the generated code (assuming you [deploy the solution](/azure/ai-services/openai/use-your-data-quickstart#deploy-your-model)) to allow for [service-side exhaustive search](vector-search-how-to-create-index.md#add-a-vector-search-configuration) on your queries.

   :::image type="content" source="media/search-get-started-rag/chat-results.png" lightbox="media/search-get-started-rag/chat-results.png" alt-text="Screenshot of a chat session.":::

## Next steps

In the playground, it's easy to start over with different data and configurations and compare the results. If you didn't try **Hybrid + semantic** the first time, perhaps try again with [semantic ranking enabled](semantic-how-to-enable-disable.md).

If you need customization and tuning that the playground can't provide, take a look at code samples that demonstrate the full range of APIs for RAG applications based on Azure AI Search. Samples are available in [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python), [C#](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-dotnet), and [JavaScript](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-javascript).

## Clean up

Azure AI Search is a billable resource for as long as the service exists. If it's no longer needed, delete it from your subscription to avoid charges.