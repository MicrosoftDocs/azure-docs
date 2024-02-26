---
title: 'Using your data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to learn about using your data for better text generation in Azure OpenAI.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 01/09/2023
recommendations: false
ms.custom: references_regions 
---

# Azure OpenAI On Your Data 

Use this article to learn about Azure OpenAI On Your Data, which makes it easier for developers to connect, ingest and ground their enterprise data to create personalized copilots (preview) rapidly. It enhances user comprehension, expedites task completion, improves operational efficiency, and aids decision-making.

## What is Azure OpenAI On Your Data

Azure OpenAI On Your Data enables you to run advanced AI models such as GPT-35-Turbo and GPT-4 on your own enterprise data without needing to train or fine-tune models. You can chat on top of and analyze your data with greater accuracy. You can specify sources to support the responses based on the latest information available in your designated data sources. You can access Azure OpenAI On Your Data using a REST API, via the SDK or the web-based interface in the [Azure OpenAI Studio](https://oai.azure.com/). You can also create a web app that connects to your data to enable an enhanced chat solution or deploy it directly as a copilot in the Copilot Studio (preview).

## Get started

To get started, [connect your data source](../use-your-data-quickstart.md) using Azure OpenAI Studio and start asking questions and chatting on your data.

> [!NOTE]
> To get started, you need to already have been approved for [Azure OpenAI access](../overview.md#how-do-i-get-access-to-azure-openai) and have an [Azure OpenAI Service resource](../how-to/create-resource.md) deployed in a [supported region](#regional-availability-and-model-support) with either the gpt-35-turbo or the gpt-4 models.

## Azure Role-based access controls (Azure RBAC) for adding data sources

To use Azure OpenAI On Your Data fully, you need to set one or more Azure RBAC roles. See [Use Azure OpenAI On Your Data securely](../how-to/use-your-data-securely.md#role-assignments) for more information.

## Data formats and file types

Azure OpenAI On Your Data supports the following file types:

* `.txt`
* `.md`
* `.html`
* `.docx`
* `.pptx`
* `.pdf`

There's an [upload limit](../quotas-limits.md), and there are some caveats about document structure and how it might affect the quality of responses from the model: 

* If you're converting data from an unsupported format into a supported format, make sure the conversion:

    * Doesn't lead to significant data loss.
    * Doesn't add unexpected noise to your data.  

    This affects the quality of the model response. 

* If your files have special formatting, such as tables and columns, or bullet points, prepare your data with the data preparation script available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts#optional-crack-pdfs-to-text).

* For documents and datasets with long text, you should use the available [data preparation script](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts#data-preparation). The script chunks data so that the model's responses are more accurate. This script also supports scanned PDF files and images.

## Supported data sources

You need to connect to a data source to upload your data. When you want to use your data to chat with an Azure OpenAI model, your data is chunked in a search index so that relevant data can be found based on user queries. For some data sources such as uploading files from your local machine (preview) or data contained in a blob storage account (preview), Azure AI Search is used. 

When you choose the following data sources, your data is ingested into an Azure AI Search index.

|Data source  | Description  |
|---------|---------|
| [Azure AI Search](/azure/search/search-what-is-azure-search)  | Use an existing Azure AI Search index with Azure OpenAI On Your Data.      |
|Upload files (preview)      | Upload files from your local machine to be stored in an Azure Blob Storage database, and ingested into Azure AI Search.         |
|URL/Web address (preview)        | Web content from the URLs is stored in Azure Blob Storage.         |
|Azure Blob Storage (preview) | Upload files from Azure Blob Storage to be ingested into an Azure AI Search index.         |

# [Azure AI Search](#tab/ai-search)

You might want to consider using an Azure AI Search index when you either want to:
* Customize the index creation process. 
* Reuse an index created before by ingesting data from other data sources.

> [!NOTE]
> To use an existing index, it must have at least one searchable field.

### Search types

Azure OpenAI On Your Data provides the following search types you can use when you add your data source.

* [Keyword search](/azure/search/search-lucene-query-architecture)

* [Semantic search](/azure/search/semantic-search-overview)
* [Vector search](/azure/search/vector-search-overview) using Ada [embedding](./understand-embeddings.md) models, available in [selected regions](models.md#embeddings-models) 

    To enable vector search, you need an existing embedding model deployed in your Azure OpenAI resource. Select your embedding deployment when connecting your data, then select one of the vector search types under **Data management**. If you're using Azure AI Search as a data source, make sure you have a vector column in the index.

If you're using your own index, you can customize the [field mapping](#index-field-mapping) when you add your data source to define the fields that will get mapped when answering questions. To customize field mapping, select **Use custom field mapping** on the **Data Source** page when adding your data source.



> [!IMPORTANT]
> * [Semantic search](/azure/search/semantic-search-overview#availability-and-pricing) is subject to additional pricing. You need to choose **Basic or higher SKU** to enable semantic search or vector search. See [pricing tier difference](/azure/search/search-sku-tier) and [service limits](/azure/search/search-limits-quotas-capacity) for more information.
> * To help improve the quality of the information retrieval and model response, we recommend enabling [semantic search](/azure/search/semantic-search-overview) for the following data source languages: English, French, Spanish, Portuguese, Italian, Germany, Chinese(Zh), Japanese, Korean, Russian, and Arabic.

| Search option       | Retrieval type | Additional pricing? |Benefits|
|---------------------|------------------------|---------------------| -------- |
| *keyword*            | Keyword search                       | No additional pricing.                    |Performs fast and flexible query parsing and matching over searchable fields, using terms or phrases in any supported language, with or without operators.|
| *semantic*          |  Semantic search  |  Additional pricing for [semantic search](/azure/search/semantic-search-overview#availability-and-pricing) usage.                  |Improves the precision and relevance of search results by using a reranker (with AI models) to understand the semantic meaning of query terms and documents returned by the initial search ranker|
| *vector*            | Vector search       | No additional pricing |Enables you to find documents that are similar to a given query input based on the vector embeddings of the content. |
| *hybrid (vector + keyword)*   | A hybrid of vector search and keyword search | [Additional pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) on your Azure OpenAI account from calling the embedding model.            |Performs similarity search over vector fields using vector embeddings, while also supporting flexible query parsing and full text search over alphanumeric fields using term queries.|
| *hybrid (vector + keyword) + semantic* | A hybrid of vector search, semantic search, and keyword search.     | [Additional pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) on your Azure OpenAI account from calling the embedding model, and additional pricing for [semantic search](/azure/search/semantic-search-overview#availability-and-pricing) usage.                    |Uses vector embeddings, language understanding, and flexible query parsing to create rich search experiences and generative AI apps that can handle complex and diverse information retrieval scenarios. |

### Intelligent search

Azure OpenAI On Your Data has intelligent search enabled for your data. Semantic search is enabled by default if you have both semantic search and keyword search. If you have embedding models, intelligent search will default to hybrid + semantic search.

### Document-level access control

> [!NOTE] 
> Document-level access control is supported when you select Azure AI Search as your data source.

Azure OpenAI On Your Data lets you restrict the documents that can be used in responses for different users with Azure AI Search [security filters](/azure/search/search-security-trimming-for-azure-search-with-aad). When you enable document level access, the search results returned from Azure AI Search and used to generate a response are trimmed based on user Microsoft Entra group membership. You can only enable document-level access on existing Azure AI Search indexes See [Use Azure OpenAI On Your Data securely](../how-to/use-your-data-securely.md#document-level-access-control) for more information.


### Index field mapping 

If you're using your own index, you will be prompted in the Azure OpenAI Studio to define which fields you want to map for answering questions when you add your data source. You can provide multiple fields for *Content data*, and should include all fields that have text pertaining to your use case. 

:::image type="content" source="../media/use-your-data/index-data-mapping.png" alt-text="A screenshot showing the index field mapping options in Azure OpenAI Studio." lightbox="../media/use-your-data/index-data-mapping.png":::

In this example, the fields mapped to **Content data** and **Title** provide information to the model to answer questions. **Title** is also used to title citation text. The field mapped to **File name** generates the citation names in the response. 

Mapping these fields correctly helps ensure the model has better response and citation quality. You can additionally configure this [in the API](../reference.md#completions-extensions) using the `fieldsMapping` parameter.   

# [Azure Cosmos DB for MongoDB vCore](#tab/mongo-db)

### Prerequisites
* [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) account
* A deployed [embedding model](../concepts/understand-embeddings.md)

### Limitations
* Only Azure Cosmos DB for MongoDB vCore is supported.
* The search type is limited to [Azure Cosmos DB for MongoDB vCore vector search](/azure/cosmos-db/mongodb/vcore/vector-search) with an Azure OpenAI embedding model.
* This implementation works best on unstructured and spatial data.

### Data preparation

Use the script provided on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/feature/2023-9/scripts/cosmos_mongo_vcore_data_preparation.py) to prepare your data.

<!--### Add your data source in Azure OpenAI Studio

To add Azure Cosmos DB for MongoDB vCore as a data source, you will need an existing Azure Cosmos DB for MongoDB vCore index containing your data, and a deployed Azure OpenAI Ada embeddings model that will be used for vector search.

1. In the [Azure OpenAI portal](https://oai.azure.com/portal) chat playground, select **Add your data**. In the panel that appears, select **Azure Cosmos DB for MongoDB vCore** as the data source. 
1. Select your Azure subscription and database account, then connect to your Azure Cosmos DB account by providing your Azure Cosmos DB account username and password.
    
    :::image type="content" source="../media/use-your-data/add-mongo-data-source.png" alt-text="A screenshot showing the screen for adding Mongo DB as a data source in Azure OpenAI Studio." lightbox="../media/use-your-data/add-mongo-data-source.png":::

1. **Select Database**. In the dropdown menus, select the database name, database collection, and index name that you want to use as your data source. Select the embedding model deployment you would like to use for vector search on this data source, and acknowledge that you will incur charges for using vector search. Then select **Next**.

    :::image type="content" source="../media/use-your-data/select-mongo-database.png" alt-text="A screenshot showing the screen for adding Mongo DB settings in Azure OpenAI Studio." lightbox="../media/use-your-data/select-mongo-database.png":::
-->

### Index field mapping

When you add your Azure Cosmos DB for MongoDB vCore data source, you can specify  data fields to properly map your data for retrieval.

* Content data (required): One or more provided fields that will be used to ground the model on your data. For multiple fields, separate the values with commas, with no spaces.
* File name/title/URL: Used to display more information when a document is referenced in the chat.
* Vector fields (required): Select the field in your database that contains the vectors.

:::image type="content" source="../media/use-your-data/mongo-index-mapping.png" alt-text="A screenshot showing the index field mapping options for Mongo DB." lightbox="../media/use-your-data/mongo-index-mapping.png":::

# [Azure Blob Storage (preview)](#tab/blob-storage)

You might want to use Azure Blob Storage as a data source if you want to connect to existing Azure Blob Storage and use files stored in your containers.

## Schedule automatic index refreshes

> [!NOTE] 
> * Automatic index refreshing is supported for Azure Blob Storage only.
> * If a document is deleted from input blob container, the corresponding chunk index records won't be removed by the scheduled refresh.

To keep your Azure AI Search index up-to-date with your latest data, you can schedule an automatic index refresh rather than manually updating it every time your data is updated. Automatic index refresh is only available when you choose **Azure Blob Storage** as the data source. To enable an automatic index refresh:

1. [Add a data source](../quickstart.md) using Azure OpenAI studio.
1. Under **Select or add data source** select **Indexer schedule** and choose the refresh cadence you would like to apply.

    :::image type="content" source="../media/use-your-data/indexer-schedule.png" alt-text="A screenshot of the indexer schedule in Azure OpenAI Studio." lightbox="../media/use-your-data/indexer-schedule.png":::

After the data ingestion is set to a cadence other than once, Azure AI Search indexers will be created with a schedule equivalent to `0.5 * the cadence specified`. This means that at the specified cadence, the indexers will pull the documents that were added or modified from the storage container, reprocess and index them. This ensures that the updated data gets preprocessed and indexed in the final index at the desired cadence automatically. To update your data, you only need to upload the additional documents from the Azure portal. From the portal, select **Storage Account** > **Containers**. Select the name of the original container, then **Upload**. The index will pick up the files automatically after the scheduled refresh period. The intermediate assets created in the Azure AI Search resource will not be cleaned up after ingestion to allow for future runs. These assets are:
   - `{Index Name}-index`
   - `{Index Name}-indexer`
   - `{Index Name}-indexer-chunk`
   - `{Index Name}-datasource`
   - `{Index Name}-skillset`

To modify the schedule, you can use the [Azure portal](https://portal.azure.com/).

1. Open your search resource page in the Azure portal
1. Select **Indexers** from the left pane 
    
    :::image type="content" source="../media/use-your-data/indexers-azure-portal.png" alt-text="A screenshot of the indexers tab in the Azure portal." lightbox="../media/use-your-data/indexers-azure-portal.png":::

1. Perform the following steps on the two indexers that have your index name as a prefix.
    1. Select the indexer to open it. Then select the **settings** tab.
    1. Update the schedule to the desired cadence from "Schedule" or specify a custom cadence from "Interval (minutes)"
        
        :::image type="content" source="../media/use-your-data/indexer-schedule-azure-portal.png" alt-text="A screenshot of the settings page for an individual indexer." lightbox="../media/use-your-data/indexer-schedule-azure-portal.png":::

    1. Select **Save**.

# [Upload files (preview)](#tab/file-upload)

Using Azure OpenAI Studio, you can upload files from your machine to try Azure OpenAI On Your Data, and optionally creating a new Azure Blob Storage account and Azure AI Search resource. The service then stores the files to an Azure storage container and performs ingestion from the container. You can use the [quickstart](../use-your-data-quickstart.md) article to learn how to use this data source option.

:::image type="content" source="../media/quickstarts/add-your-data-source.png" alt-text="A screenshot showing options for selecting a data source in Azure OpenAI Studio." lightbox="../media/quickstarts/add-your-data-source.png":::


# [URL/Web address (preview)](#tab/web-pages)

You can paste URLs and the service will store the webpage content, using it when generating responses from the model. The content in URLs/web addresses that you use need to have the following characteristics to be properly ingested:

* A public website, such as [Using your data with Azure OpenAI Service - Azure OpenAI | Microsoft Learn](/azure/ai-services/openai/concepts/use-your-data?tabs=ai-search). You can't add a URL/Web address with access control, such as ones with a password.
* An HTTPS website.
* The size of content in each URL is smaller than 5 MB.  
* The website can be downloaded as one of the [supported file types](#data-formats-and-file-types).
* Only one layer of nested links is supported. Only up to 20 links, on the web page will be fetched.

<!--:::image type="content" source="../media/use-your-data/url.png" alt-text="A screenshot of the Azure OpenAI use your data url/webpage studio configuration page." lightbox="../media/use-your-data/url.png":::-->

Once you have added the URL/web address for data ingestion, the web pages from your URL are fetched and saved to Azure Blob Storage with a container name: `webpage-<index name>`. Each URL will be saved into a different container within the account. Then the files are indexed into an Azure AI Search index, which is used for retrieval when you’re chatting with the model.

---

### How data is ingested into Azure AI search

Data is ingested into Azure AI search using the following process:

1. Ingestion assets are created in Azure AI Search resource and Azure storage account. Currently these assets are: indexers, indexes, data sources, a [custom skill](/azure/search/cognitive-search-custom-skill-interface) in the search resource, and a container (later called the chunks container) in the Azure storage account. You can specify the input Azure storage container using the [Azure OpenAI studio](https://oai.azure.com/), or the [ingestion API (preview)](../reference.md#start-an-ingestion-job-preview).  

2. Data is read from the input container, contents are opened and chunked into small chunks with a maximum of 1,024 tokens each. If vector search is enabled, the service calculates the vector representing the embeddings on each chunk. The output of this step (called the "preprocessed" or "chunked" data) is stored in the chunks container created in the previous step. 

3. The preprocessed data is loaded from the chunks container, and indexed in the Azure AI Search index.

## Deploy to a copilot (preview) or web app 

After you connect Azure OpenAI to your data, you can deploy it using the **Deploy to** button in Azure OpenAI studio.

:::image type="content" source="../media/use-your-data/deploy-model.png" alt-text="A screenshot showing the model deployment button in Azure OpenAI Studio." lightbox="../media/use-your-data/deploy-model.png":::

This gives you the option of deploying a standalone web app for you and your users to interact with chat models using a graphical user interface. See [Use the Azure OpenAI web app](../how-to/use-web-app.md) for more information. 

You can also deploy to a copilot in [Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) (preview) directly from Azure OpenAI studio, enabling you to bring conversational experiences to various channels such as: Microsoft Teams, websites, Dynamics 365, and other [Azure Bot Service channels](/microsoft-copilot-studio/publication-connect-bot-to-azure-bot-service-channels). The tenant used in the Azure OpenAI service and Copilot Studio (preview) should be the same. For more information, see [Use a connection to Azure OpenAI On Your Data](/microsoft-copilot-studio/nlu-generative-answers-azure-openai).

> [!NOTE]
> Deploying to a copilot in Copilot Studio (preview) is only available in US regions.

## Use Azure OpenAI On Your Data securely

You can use Azure OpenAI On Your Data securely by protecting data and resources with Microsoft Entra ID role-based access control, virtual networks, and private endpoints. You can also restrict the documents that can be used in responses for different users with Azure AI Search security filters. See [Securely use Azure OpenAI On Your Data](../how-to/use-your-data-securely.md).

## Best practices

Use the following sections to learn how to improve the quality of responses given by the model.

### Runtime parameters

You can modify the following additional settings in the **Data parameters** section in Azure OpenAI Studio and [the API](../reference.md#completions-extensions). You don't need to reingest your data when you update these parameters. 


|Parameter name  | Description  |
|---------|---------|
| **Limit responses to your data** | This flag configures the chatbot's approach to handling queries unrelated to the data source or when search documents are insufficient for a complete answer. When this setting is disabled, the model supplements its responses with its own knowledge in addition to your documents. When this setting is enabled, the model attempts to only rely on your documents for responses. This is the `inScope` parameter in the API. |
|**Retrieved documents**     |  This parameter is an integer that can be set to 3, 5, 10, or 20, and controls the number of document chunks provided to the large language model for formulating the final response. By default, this is set to 5. The search process can be noisy and sometimes, due to chunking, relevant information might be spread across multiple chunks in the search index. Selecting a top-K number, like 5, ensures that the model can extract relevant information, despite the inherent limitations of search and chunking. However, increasing the number too high can potentially distract the model. Additionally, the maximum number of documents that can be effectively used depends on the version of the model, as each has a different context size and capacity for handling documents. If you find that responses are missing important context, try increasing this parameter. This is the `topNDocuments` parameter in the API. |
| **Strictness**     | Determines the system's aggressiveness in filtering search documents based on their similarity scores. The system queries Azure Search or other document stores, then decides which documents to provide to large language models like ChatGPT. Filtering out irrelevant documents can significantly enhance the performance of the end-to-end chatbot. Some documents are excluded from the top-K results if they have low similarity scores before forwarding them to the model. This is controlled by an integer value ranging from 1 to 5. Setting this value to 1 means that the system will minimally filter documents based on search similarity to the user query. Conversely, a setting of 5 indicates that the system will aggressively filter out documents, applying a very high similarity threshold. If you find that the chatbot omits relevant information, lower the filter's strictness (set the value closer to 1) to include more documents. Conversely, if irrelevant documents distract the responses, increase the threshold (set the value closer to 5). This is the `strictness` parameter in the API. |

### System message

You can define a system message to steer the model's reply when using Azure OpenAI On Your Data. This message allows you to customize your replies on top of the retrieval augmented generation (RAG) pattern that Azure OpenAI On Your Data uses. The system message is used in addition to an internal base prompt to provide the experience. To support this, we truncate the system message after a specific [number of tokens](#token-usage-estimation-for-azure-openai-on-your-data) to ensure the model can answer questions using your data. If you are defining extra behavior on top of the default experience, ensure that your system prompt is detailed and explains the exact expected customization. 

Once you select add your dataset, you can use the **System message** section in the Azure OpenAI Studio, or the `roleInformation` [parameter in the API](../reference.md#completions-extensions).

:::image type="content" source="../media/use-your-data/system-message.png" alt-text="A screenshot showing the system message option in Azure OpenAI Studio." lightbox="../media/use-your-data/system-message.png":::

#### Potential usage patterns

**Define a role**

You can define a role that you want your assistant. For example, if you are building a support bot, you can add *"You are an expert incident support assistant that helps users solve new issues."*.

**Define the type of data being retrieved**

You can also add the nature of data you are providing to assistant.
* Define the topic or scope of your dataset, like "financial report", "academic paper", or "incident report". For example, for technical support you might add *"You answer queries using information from similar incidents in the retrieved documents."*.
* If your data has certain characteristics, you can add these details to the system message. For example, if your documents are in Japanese, you can add *"You retrieve Japanese documents and you should read them carefully in Japanese and answer in Japanese."*. 
* If your documents include structured data like tables from a financial report, you can also add this fact into the system prompt. For example, if your data has tables, you might add *"You are given data in form of tables pertaining to financial results and you should read the table line by line to perform calculations to answer user questions."*.

**Define the output style** 

You can also change the model's output by defining a system message. For example, if you want to ensure that the assistant answers are in French, you can add a prompt like *"You are an AI assistant that helps users who understand French find information. The user questions can be in English or French. Please read the retrieved documents carefully and answer them in French. Please translate the knowledge from documents to French to ensure all answers are in French."*.

**Reaffirm critical behavior**

Azure OpenAI On Your Data works by sending instructions to a large language model in the form of prompts to answer user queries using your data. If there is a certain behavior that is critical to the application, you can repeat the behavior in system message to increase its accuracy. For example, to guide the model to only answer from documents, you can add "*Please answer using retrieved documents only, and without using your knowledge. Please generate citations to retrieved documents for every claim in your answer. If the user question cannot be answered using retrieved documents, please explain the reasoning behind why documents are relevant to user queries. In any case, do not answer using your own knowledge."*.

**Prompt Engineering tricks**

There are many tricks in prompt engineering that you can try to improve the output. One example is chain-of-thought prompting where you can add *"Let’s think step by step about information in retrieved documents to answer user queries. Extract relevant knowledge to user queries from documents step by step and form an answer bottom up from the extracted information from relevant documents."*.

> [!NOTE]
> The system message is used to modify how GPT assistant responds to a user question based on retrieved documentation. It does not affect the retrieval process. If you'd like to provide instructions for the retrieval process, it is better to include them in the questions.
> The system message is only guidance. The model might not adhere to every instruction specified because it has been primed with certain behaviors such as objectivity, and avoiding controversial statements. Unexpected behavior might occur if the system message contradicts with these behaviors. 



### Maximum response 

Set a limit on the number of tokens per model response. The upper limit for Azure OpenAI On Your Data is 1500. This is equivalent to setting the `max_tokens` parameter in the API. 

### Limit responses to your data 

This option encourages the model to respond using your data only, and is selected by default. If you unselect this option, the model might more readily apply its internal knowledge to respond. Determine the correct selection based on your use case and scenario. 



### Interacting with the model

Use the following practices for best results when chatting with the model. 

**Conversation history** 

* Before starting a new conversation (or asking a question that isn't related to the previous ones), clear the chat history. 
* Getting different responses for the same question between the first conversational turn and subsequent turns can be expected because the conversation history changes the current state of the model. If you receive incorrect answers, report it as a quality bug. 

**Model response**

* If you aren't satisfied with the model response for a specific question, try either making the question more specific or more generic to see how the model responds, and reframe your question accordingly. 

* [Chain-of-thought prompting](advanced-prompt-engineering.md?pivots=programming-language-chat-completions#chain-of-thought-prompting) has been shown to be effective in getting the model to produce desired outputs for complex questions/tasks.

**Question length**

Avoid asking long questions and break them down into multiple questions if possible. The GPT models have limits on the number of tokens they can accept. Token limits are counted toward: the user question, the system message, the retrieved search documents (chunks), internal prompts, the conversation history (if any), and the response. If the question exceeds the token limit, it will be truncated.

**Multi-lingual support**  

* Currently, keyword search and semantic search in Azure OpenAI On Your Data supports queries are in the same language as the data in the index. For example, if your data is in Japanese, then input queries also need to be in Japanese. For cross-lingual document retrieval, we recommend building the index with [Vector search](/azure/search/vector-search-overview) enabled.  

* To help improve the quality of the information retrieval and model response, we recommend enabling [semantic search](/azure/search/semantic-search-overview) for the following languages: English, French, Spanish, Portuguese, Italian, Germany, Chinese(Zh), Japanese, Korean, Russian, Arabic   

* We recommend using a system message to inform the model that your data is in another language. For example:

*   *"**You are an AI assistant designed to help users extract information from retrieved Japanese documents. Please scrutinize the Japanese documents carefully before formulating a response. The user's query will be in Japanese, and you must response also in Japanese."*

* If you have documents in multiple languages, we recommend building a new index for each language and connecting them separately to Azure OpenAI.  

#### Streaming data

You can send a streaming request using the `stream` parameter, allowing data to be sent and received incrementally, without waiting for the entire API response. This can improve performance and user experience, especially for large or dynamic data.

```json
{
    "stream": true,
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$AZURE_AI_SEARCH_ENDPOINT'",
                "key": "'$AZURE_AI_SEARCH_API_KEY'",
                "indexName": "'$AZURE_AI_SEARCH_INDEX'"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the differences between Azure Machine Learning and Azure AI services?"
        }
    ]
}
```

#### Conversation history for better results

When you chat with a model, providing a history of the chat will help the model return higher quality results. 

```json
{
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$AZURE_AI_SEARCH_ENDPOINT'",
                "key": "'$AZURE_AI_SEARCH_API_KEY'",
                "indexName": "'$AZURE_AI_SEARCH_INDEX'"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the differences between Azure Machine Learning and Azure AI services?"
        },
        {
            "role": "tool",
            "content": "{\"citations\": [{\"content\": \"title: Azure AI services and Machine Learning\\ntitleSuffix: Azure AI services\\ndescription: Learn where Azure AI services fits in with other Azure offerings for machine learning.\\nAzure AI services and machine learning\\nAzure AI services provides machine learning capabilities to solve general problems such as...\\n \"articles\\\\cognitive-services\\\\cognitive-services-and-machine-learning.md\", \"url\": null, \"metadata\": {\"chunking\": \"orignal document size=1018. Scores=0.32200050354003906 and 1.2880020141601562.Org Highlight count=115.\"}, \"chunk_id\": \"0\"}], \"intent\": \"[\\\"What are the differences between Azure Machine Learning and Azure AI services?\\\"]\"}"
        },
        {
            "role": "assistant",
            "content": " \nAzure Machine Learning is a product and service tailored for data scientists to build, train, and deploy machine learning models [doc1]..."
        },
        {
            "role": "user",
            "content": "How do I use Azure machine learning?"
        }
    ]
}
```

## Token usage estimation for Azure OpenAI On Your Data



| Model | Max tokens for system message | Max tokens for model response |
|--|--|--|
| GPT-35-0301 | 400 | 1500 |
| GPT-35-0613-16K | 1000 | 3200 |
| GPT-4-0613-8K | 400 | 1500 |
| GPT-4-0613-32K | 2000 | 6400 |

The table above shows the total number of tokens available for each model type. It also determines the maximum number of tokens that can be used for the [system message](#system-message) and the model response. Additionally, the following also consume tokens:



* The meta prompt (MP): if you limit responses from the model to the grounding data content (`inScope=True` in the API), the maximum number of tokens is 4,036 tokens. Otherwise (for example if `inScope=False`) the maximum is 3,444 tokens. This number is variable depending on the token length of the user question and conversation history. This estimate includes the base prompt and the query rewriting prompts for retrieval.
* User question and history: Variable but capped at 2,000 tokens.
* Retrieved documents (chunks): The number of tokens used by the retrieved document chunks depends on multiple factors. The upper bound for this is the number of retrieved document chunks multiplied by the chunk size. It will, however, be truncated based on the tokens available tokens for the specific model being used after counting the rest of fields. 

    20% of the available tokens are reserved for the model response. The remaining 80% of available tokens include the meta prompt, the user question and conversation history, and the system message. The remaining token budget is used by the retrieved document chunks. 

```python 
import tiktoken

class TokenEstimator(object):

    GPT2_TOKENIZER = tiktoken.get_encoding("gpt2")

    def estimate_tokens(self, text: str) -> int:
        return len(self.GPT2_TOKENIZER.encode(text))
      
token_output = TokenEstimator.estimate_tokens(input_text)
```

## Troubleshooting 

### Failed ingestion jobs

To troubleshoot a failed job, always look out for errors or warnings specified either in the API response or Azure OpenAI studio. Here are some of the common errors and warnings: 


**Quota Limitations Issues** 

*An index with the name X in service Y could not be created. Index quota has been exceeded for this service. You must either delete unused indexes first, add a delay between index creation requests, or upgrade the service for higher limits.*

*Standard indexer quota of X has been exceeded for this service. You currently have X standard indexers. You must either delete unused indexers first, change the indexer 'executionMode', or upgrade the service for higher limits.* 

Resolution: 

Upgrade to a higher pricing tier or delete unused assets. 

**Preprocessing Timeout Issues** 

*Could not execute skill because the Web API request failed*

*Could not execute skill because Web API skill response is invalid* 

Resolution: 

Break down the input documents into smaller documents and try again. 

**Permissions Issues** 

*This request isn't authorized to perform this operation*

Resolution: 

This means the storage account isn't accessible with the given credentials. In this case, please review the storage account credentials passed to the API and ensure the storage account isn't hidden behind a private endpoint (if a private endpoint isn't configured for this resource). 

## Regional availability and model support

You can use Azure OpenAI On Your Data with an Azure OpenAI resource in the following regions:
* Australia East
* Brazil South
* Canada East
* East US
* East US 2
* France Central
* Japan East
* North Central US
* Norway East
* South Africa North
* South Central US
* South India
* Sweden Central
* Switzerland North
* UK South
* West Europe
* West US

### Supported models

* `gpt-4` (0314)
* `gpt-4` (0613)
* `gpt-4-32k` (0314)
* `gpt-4-32k` (0613)
* `gpt-4` (1106-preview)
* `gpt-35-turbo-16k` (0613)
* `gpt-35-turbo` (1106)

If your Azure OpenAI resource is in another region, you won't be able to use Azure OpenAI On Your Data.

## Next steps
* [Get started using your data with Azure OpenAI](../use-your-data-quickstart.md)

* [Securely use Azure OpenAI On Your Data](../how-to/use-your-data-securely.md)

* [Introduction to prompt engineering](./prompt-engineering.md)
