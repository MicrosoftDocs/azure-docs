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
---

# Azure OpenAI on your data 

Azure OpenAI on your data enables you to run supported chat models such as GPT-35-Turbo and GPT-4 on your data without needing to train or fine-tune models. Running models on your data enables you to chat on top of, and analyze your data with greater accuracy and speed.

Because the model has access to, and can reference specific sources to support its responses, answers are not only based on its pretrained knowledge but also on the latest information available in the designated data source. This grounding data also helps the model avoid generating responses based on outdated or incorrect information.

## What is Azure OpenAI on your data

One of the key features of Azure OpenAI on your data is its ability to retrieve and utilize data in a way that enhances the model's output.  Azure OpenAI on your data determines what data to retrieve from the designated data source based on the user input and provided conversation history. This data is then augmented and resubmitted as a prompt to the OpenAI model, with retrieved  information being appended to the original prompt. The model uses this information to provide a completion. See the [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context) article for more information. 

You can access Azure OpenAI on your data using a REST API or the web-based interface in the [Azure OpenAI Studio](https://oai.azure.com/) and [Azure AI Studio](https://ai.azure.com/) to create a solution that connects to your data to enable an enhanced chat experience.

## Get started

To get started, [connect your data source](../use-your-data-quickstart.md) using Azure OpenAI Studio and start asking questions and chatting on your data.

> [!NOTE]
> To get started, you need to already have been approved for [Azure OpenAI access](../overview.md#how-do-i-get-access-to-azure-openai) and have an [Azure OpenAI Service resource](../how-to/create-resource.md) with either the gpt-35-turbo or the gpt-4 models deployed.

## Azure Role-based access controls (Azure RBAC) for adding data sources

To use Azure OpenAI on your data fully, you may need to set one or more Azure RBAC roles. See [Use Azure OpenAI on your data securely](../how-to/use-your-data-securely.md#role-assignments) for more information.

### Data formats and file types

Azure OpenAI on your data supports the following filetypes:

* `.txt`
* `.md`
* `.html`
* Microsoft Word files
* Microsoft PowerPoint files
* PDF

There is an [upload limit](../quotas-limits.md), and there are some caveats about document structure and how it might affect the quality of responses from the model: 

* The model provides the best citation titles from markdown (`.md`) files. 

* If a document is a PDF file, the text contents are extracted as a preprocessing step (unless you're connecting your own Azure AI Search index). If your document contains images, graphs, or other visual content, the model's response quality depends on the quality of the text that can be extracted from them. 

* If you're converting data from an unsupported format into a supported format, make sure the conversion:

    * Doesn't lead to significant data loss.
    * Doesn't add unexpected noise to your data.  

    This will affect the quality of the model response. 

* If your files have special formatting, such as tables and columns, or bullet points, prepare your data with the data preperation script [available on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts#optional-crack-pdfs-to-text)

* For documents and datasets with long text, you should use the available [data preparation script](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts#data-preparation). The script chunks data so that your response with the service will be more accurate. This script also supports scanned PDF files and images.

### Supported data sources

You need to connect to a data source to upload your data. When you want to use your data to chat with an Azure OpenAI model, your data will be chunked and stored in a search index so that relevant data can be found based on user queries. For some data sources (such as uploading files from your local machine or data contained in a blob storage account), Azure AI Search is used. 

When you choose the following data sources, your data is ingested into an Azure AI Search index.

|Data source  | Description  |
|---------|---------|
|Upload files      | Upload files from your local machine to be stored in an Azure blob storage database, and ingested into Azure AI Search.         |
|URL/Web pages        | Web content from the URLs is stored in an Azure Blob Storage account.         |
|Azure Blob storage account | Upload files from an Azure Blob Storage account to be ingested into an Azure AI Search index.         |
| [Azure AI Search](/azure/search/search-what-is-azure-search)  | Use an existing Azure AI Search index with Azure OpenAI on your data.      |


# [Azure AI Search](#tab/ai-search)

You might want to consider using an Azure AI Search index when you either want to:
* Customize the index creation process. 
* Reuse an index created before by ingesting data from other data sources.


Azure OpenAI on your data provides several search options you can use when you add your data source, leveraging the following types of search.

* [Keyword search](/azure/search/search-lucene-query-architecture)

* [Semantic search](/azure/search/semantic-search-overview)
* [Vector search](/azure/search/vector-search-overview) using Ada [embedding](./understand-embeddings.md) models, available in [select regions](models.md#embeddings-models). 

    To enable vector search, you will need a `text-embedding-ada-002` deployment in your Azure OpenAI resource. Select your embedding deployment when connecting your data, then select one of the vector search types under **Data management**.  

> [!IMPORTANT]
> * [Semantic search](/azure/search/semantic-search-overview#availability-and-pricing) and [vector search](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) are subject to additional pricing. You need to choose **Basic or higher SKU** to enable semantic search or vector search. See [pricing tier difference](/azure/search/search-sku-tier) and [service limits](/azure/search/search-limits-quotas-capacity) for more information.
> * To help improve the quality of the information retrieval and model response, we recommend enabling [semantic search](/azure/search/semantic-search-overview) for the following languages: English, French, Spanish, Portuguese, Italian, Germany, Chinese(Zh), Japanese, Korean, Russian, and Arabic.

| Search option       | Retrieval type | Additional pricing? |Benefits|
|---------------------|------------------------|---------------------| -------- |
| *keyword*            | Keyword search                       | No additional pricing.                    |Performs fast and flexible query parsing and matching over searchable fields, using terms or phrases in any supported language, with or without operators.|
| *semantic*          |  Semantic search  |  Additional pricing for [semantic search](/azure/search/semantic-search-overview#availability-and-pricing) usage.                  |Improves the precision and relevance of search results by using a reranker (with AI models) to understand the semantic meaning of query terms and documents returned by the initial search ranker|
| *vector*            | Vector search       | [Additional pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) on your Azure OpenAI account from calling the embedding model.                    |Enables you to find documents that are similar to a given query input based on the vector embeddings of the content. |
| *hybrid (vector + keyword)*   | A hybrid of vector search and keyword search | [Additional pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) on your Azure OpenAI account from calling the embedding model.            |Performs similarity search over vector fields using vector embeddings, while also supporting flexible query parsing and full text search over alphanumeric fields using term queries.|
| *hybrid (vector + keyword) + semantic* | A hybrid of vector search, semantic and keyword search for retrieval.     | [Additional pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) on your Azure OpenAI account from calling the embedding model, and additional pricing for [semantic search](/azure/search/semantic-search-overview#availability-and-pricing) usage.                    |Leverages vector embeddings, language understanding and flexible query parsing to create rich search experiences and generative AI apps that can handle complex and diverse information retrieval scenarios. |

## Document-level access control

> [!NOTE] 
> Document-level access control is supported when you select an existing Azure AI search as your data source.

Azure OpenAI on your data lets you restrict the documents that can be used in responses for different users with Azure AI Search [security filters](/azure/search/search-security-trimming-for-azure-search-with-aad). When you enable document level access, the search results returned from Azure AI Search and used to generate a response will be trimmed based on user Microsoft Entra group membership. You can only enable document-level access on existing Azure AI Search indexes See [Use Azure OpenAI on your data securely](../how-to/use-your-data-securely.md) for more information.


### Index field mapping 

If you're using your own index, you will be prompted in the Azure OpenAI Studio to define which fields you want to map for answering questions when you add your data source. You can provide multiple fields for *Content data*, and should include all fields that have text pertaining to your use case. 

:::image type="content" source="../media/use-your-data/index-data-mapping.png" alt-text="A screenshot showing the index field mapping options in Azure OpenAI Studio." lightbox="../media/use-your-data/index-data-mapping.png":::

In this example, the fields mapped to **Content data** and **Title** provide information to the model to answer questions. **Title** is also used to title citation text. The field mapped to **File name** generates the citation names in the response. 

Mapping these fields correctly helps ensure the model has better response and citation quality. You can additionally configure this [in the API](../reference.md#completions-extensions) using the `fieldsMapping` parameter.   

# [Azure blob storage](#tab/blob-storage)

You may want to use Azure Blob Storage as a data source if you want to connect to existing Azure blob storage and use files stored in your containers.

### Schedule automatic index refreshes

> [!NOTE] 
> Automatic index refreshing is supported when you select an existing Azure Blob storage account.

To keep your Azure AI Search index up-to-date with your latest data, you can schedule a refresh for it that runs automatically rather than manually updating it every time your data is updated. Automatic index refresh is only available when you choose **blob storage** as the data source. To enable an automatic index refresh:

1. [Add a data source](../quickstart.md) using Azure OpenAI studio.
1. Under **Select or add data source** select **Indexer schedule** and choose the refresh cadence you would like to apply.

    :::image type="content" source="../media/use-your-data/indexer-schedule.png" alt-text="A screenshot of the indexer schedule in Azure OpenAI Studio." lightbox="../media/use-your-data/indexer-schedule.png":::

After the data ingestion is set to a cadence other than once, Azure AI Search indexers will be created with a schedule equivalent to `0.5 * the cadence specified`. This means that at the specified cadence, the indexers will pull the documents that were added, modified, or deleted from the storage container, reprocess and index them. This ensures that the updated data gets preprocessed and indexed in the final index at the desired cadence automatically. To update your data, you only need to upload the additional documents from the Azure portal. From the portal, select **Storage Account** > **Containers**. Select the name of the original container, then **Upload**. The index will pick up the files automatically after the scheduled refresh period. The intermediate assets created in the Azure AI Search resource will not be cleaned up after ingestion to allow for future runs. These assets are:
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

# [Upload files](#tab/file-upload)

Using Azure OpenAI Studio, you can upload files from your machine. The service then stores the files to an Azure storage container and performs ingestion from the container. 

# [Web pages (preview)](#tab/web-pages)

Using Azure OpenAI Studio, you can paste URLs and the service will store the webpage content, using it when generating responses from the model.The content in URLs/web addresses that you use need to have the following characteristics to be properly ingested:

* A public website, such as [Using your data with Azure OpenAI Service - Azure OpenAI | Microsoft Learn](/azure/ai-services/openai/concepts/use-your-data?tabs=ai-search). Note that you cannot add a URL/Web address with access control, such as with password.
* An HTTPS website.
* The size of content in each URL is smaller than 5MB.  
* The website can be downloaded as one of the [supported file types](#data-formats-and-file-types).

> [!TIP]
> Only one layer of nested links is supported. Only up to 20 links, on the web page will be fetched.

<!--:::image type="content" source="../media/use-your-data/url.png" alt-text="A screenshot of the Azure OpenAI use your data url/webpage studio configuration page." lightbox="../media/use-your-data/url.png":::-->

Once you have added the URL/web address for data ingestion, the web pages from your URL are fetched and saved to your Azure Blob Storage account with a container name: `webpage-<index name>`. Each URL will be saved into a different container within the account. Then the files are indexed into an Azure AI Search index, which is used for retrieval when you’re chatting with the model.

### Search options

Azure OpenAI on your data provides several search options you can use when you add your data source, leveraging the following types of search.

* [Keyword search](/azure/search/search-lucene-query-architecture)

| Search option       | Retrieval type | Additional pricing? |Benefits|
|---------------------|------------------------|---------------------| -------- |
| *keyword*            | Keyword search                       | No additional pricing.                    |Performs fast and flexible query parsing and matching over searchable fields, using terms or phrases in any supported language, with or without operators.|

# [Azure Cosmos DB for MongoDB vCore](#tab/mongo-db)

### Prerequisites
* [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) account
* A deployed [embedding model](../concepts/understand-embeddings.md)

### Limitations
* Only Azure Cosmos DB for MongoDB vCore is supported.
* The search type is limited to [Azure Cosmos DB for MongoDB vCore vector search](/azure/cosmos-db/mongodb/vcore/vector-search) with an Azure OpenAI embedding model.
* This implementation works best on unstructured and spatial data.

### Data preparation

Use the script [provided on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/feature/2023-9/scripts/cosmos_mongo_vcore_data_preparation.py) to prepare your data.

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

* Content data (required): The provided field(s) will be used to ground the model on your data. For multiple fields, separate the values with commas, with no spaces.
* File name/title/URL: Used to display more information when a document is referenced in the chat.
* Vector fields (required): Select the field in your database that contains the vectors.

:::image type="content" source="../media/use-your-data/mongo-index-mapping.png" alt-text="A screenshot showing the index field mapping options for Mongo DB." lightbox="../media/use-your-data/mongo-index-mapping.png":::

# [Pinecone (preview)](#tab/pinecone)
TBD

# [Elasticsearch (preview)](#tab/elasticsearch)

TBD

---

## How data is ingested into Azure AI search

Data is ingested into Azure AI search using the following process:

1. Ingestion assets are created in Azure AI Search resource and Azure storage account. Currently these assets are: indexers, indexes, data sources, a [custom skill](/azure/search/cognitive-search-custom-skill-interface) in the search resource, and a container (later called the chunks container) in the Azure storage account. You can specify the input Azure storage container using the [Azure OpenAI studio](https://oai.azure.com/), or the [ingestion API (preview)](../reference.md#start-an-ingestion-job).  

2. Data is read from the input container, contents are opened and chunked into small chunks with a maximum of 1024 tokens each. If vector search is enabled, the service will calculate the vector representing the embeddings on each chunk. The output of this step (called the "preprocessed" or "chunked" data) is stored in the chunks container created in the previous step. 

3. The preprocessed data is loaded from the chunks container, and indexed in the Azure AI Search index. 


### Using the model

After ingesting your data, you can start chatting with the model on your data using the chat playground in Azure OpenAI studio, or the following methods:
* [Web app](#using-the-web-app)
* [Microsoft Copilot Studio copilot](#deploy-to-microsoft-copilot-studio)
* [REST API](../reference.md#azure-ai-search)
* [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples/AzureOnYourData.cs)
* [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/openai/azure-ai-openai/src/samples/java/com/azure/ai/openai/ChatCompletionsWithYourData.java)
* [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/openai/openai/samples/v1-beta/javascript/bringYourOwnData.js)
* [PowerShell](../use-your-data-quickstart.md?tabs=command-line%2Cpowershell&pivots=programming-language-powershell#example-powershell-commands)
* [Python](https://github.com/openai/openai-cookbook/blob/main/examples/azure/chat_with_your_own_data.ipynb) 

## Use Azure OpenAI on your data securely

You can use Azure OpenAI on your data securely by protecting data and resources with Microsoft Entra ID role-based access control, virtual networks and private endpoints. You can also restrict the documents that can be used in responses for different users with Azure AI Search security filters. See [Securely use Azure OpenAI on your data](../how-to/use-your-data-securely.md).

## Improve model response quality

Use the following sections to learn how to improve the quality of responses given by the model.

### Custom parameters

You can modify the following additional settings in the **Data parameters** section in Azure OpenAI Studio and [the API](../reference.md#completions-extensions).


|Parameter name  | Description  |
|---------|---------|
|**Retrieved documents**     |  Specifies the number of top-scoring documents from your data index used to generate responses. You might want to increase the value when you have short documents or want to provide more context. The default value is 5. This is the `topNDocuments` parameter in the API.     |
| **Strictness**     | Sets the threshold to categorize documents as relevant to your queries. Raising the value means a higher threshold for relevance and filters out more less-relevant documents for responses. Setting this value too high might cause the model to fail to generate responses due to limited available documents. The default value is 3.         |

### System message

Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, what it should and shouldn't answer, and how to format responses. There are token limits that apply to the system message, used with every API call, and counted against the overall token limit. The system message will be truncated if it exceeds the token limits listed in the [token estimation](#token-usage-estimation-for-azure-openai-on-your-data) section.

For example, if you're creating a chatbot where the data consists of transcriptions of quarterly financial earnings calls, you might use the following system message:

*"You are a financial chatbot useful for answering questions from financial reports. You are given excerpts from the earnings call. Please answer the questions by parsing through all dialogue."*

This system message can help improve the quality of the response by specifying the domain (in this case finance) and mentioning that the data consists of call transcriptions. It helps set the necessary context for the model to respond appropriately. You can also configure this [in the API](../reference.md#completions-extensions) by using the `roleInformation`.

> [!NOTE]
> The system message is used to modify how GPT assistant responds to a user question based on retrieved documentation. It does not affect the retrieval process. If you'd like to provide instructions for the retrieval process, it is better to include them in the questions.
> The system message is only guidance. The model might not adhere to every instruction specified because it has been primed with certain behaviors such as objectivity, and avoiding controversial statements. Unexpected behavior might occur if the system message contradicts with these behaviors. 



### Maximum response 

Set a limit on the number of tokens per model response. The upper limit for Azure OpenAI on Your Data is 1500. This is equivalent to setting the `max_tokens` parameter in the API. 

### Limit responses to your data 

This option encourages the model to respond using your data only, and is selected by default. If you unselect this option, the model might more readily apply its internal knowledge to respond. Determine the correct selection based on your use case and scenario. 



### Interacting with the model

Use the following practices for best results when chatting with the model. 

**Conversation history** 

* Before starting a new conversation (or asking a question that is not related to the previous ones), clear the chat history. 
* Getting different responses for the same question between the first conversational turn and subsequent turns can be expected because the conversation history changes the current state of the model. If you receive incorrect answers, report it as a quality bug. 

**Model response**

* If you are not satisfied with the model response for a specific question, try either making the question more specific or more generic to see how the model responds, and reframe your question accordingly. 

* [Chain-of-thought prompting](advanced-prompt-engineering.md?pivots=programming-language-chat-completions#chain-of-thought-prompting) has been shown to be effective in getting the model to produce desired outputs for complex questions/tasks.

**Question length**

Avoid asking long questions and break them down into multiple questions if possible. The GPT models have limits on the number of tokens they can accept. Token limits are counted toward: the user question, the system message, the retrieved search documents (chunks), internal prompts, the conversation history (if any), and the response. If the question exceeds the token limit, it will be truncated.

**Multi-lingual support**  

* Currently, keyword search and semantic search in Azure OpenAI on your data supports queries are in the same language as the data in the index. For example, if your data is in Japanese, then input queries also need to be in Japanese. For cross-lingual document retrieval, we recommend building the index with [Vector search](/azure/search/vector-search-overview) enabled.  

* To help improve the quality of the information retrieval and model response, we recommend enabling [semantic search](/azure/search/semantic-search-overview) for the following languages: English, French, Spanish, Portuguese, Italian, Germany, Chinese(Zh), Japanese, Korean, Russian, Arabic   

* We recommend using a system message to inform the model that your data is in another language. For example:

*   *"**You are an AI assistant designed to help users extract information from retrieved Japanese documents. Please scrutinize the Japanese documents carefully before formulating a response. The user's query will be in Japanese, and you must response also in Japanese."*

* If you have documents in multiple languages, we recommend building a new index for each language and connecting them separately to Azure OpenAI.  

## Deploying the model

After you connect Azure OpenAI to your data, you can deploy it using the **Deploy to** button in Azure OpenAI studio.

:::image type="content" source="../media/use-your-data/deploy-model.png" alt-text="A screenshot showing the model deployment button in Azure OpenAI Studio." lightbox="../media/use-your-data/deploy-model.png":::

### Deploy to Microsoft Copilot Studio

You can deploy your model to [Microsoft Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) directly from Azure OpenAI studio, enabling you to bring conversational experiences to various Microsoft Teams, Websites, Dynamics 365, and other [Azure Bot Service channels](/microsoft-copilot-studio/publication-connect-bot-to-azure-bot-service-channels). Microsfot Copilot Studio acts as a conversational and generative AI platform, making the process of creating, publishing and deploying a bot to any number of channels simple and accessible.

While Microsoft Copilot Studio has features that leverage Azure OpenAI such as [generative answers](/microsoft-copilot-studio/nlu-boost-conversations), deploying a model grounded on your data lets you create a chatbot that will respond using your data, and connect it to the Power Platform. The tenant used in the Azure OpenAI service and Microsoft Copilot Studio should be the same. For more information, see [Use a connection to Azure OpenAI on your data](/microsoft-copilot-studio/nlu-generative-answers-azure-openai).

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RW18YwQ]

> [!NOTE]
> Deploying to Microsoft Copilot Studio from Azure OpenAI is only available to US regions.
> Microsoft Copilot Studio supports Azure AI Search indexes with keyword or semantic search only. Other data sources and advanced features might not be supported.

### Deploy a web app

Along with Azure OpenAI Studio, Power Virtual Agents, and the API, you can also use the available standalone web app to interact with chat models using a graphical user interface. See [Use the Azure OpenAI web app](../how-to/use-web-app.md) for more information. 

#### Streaming data

You can send a streaming request using the `stream` parameter, allowing data to be sent and received incrementally, without waiting for the entire API response. This can improve performance and user experience, especially for large or dynamic data.

```json
{
    "stream": true,
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "'$SearchEndpoint'",
                "key": "'$SearchKey'",
                "indexName": "'$SearchIndex'"
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
                "endpoint": "'$SearchEndpoint'",
                "key": "'$SearchKey'",
                "indexName": "'$SearchIndex'"
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

## Token usage estimation for Azure OpenAI on your data



| Model                   | Total tokens available | Max tokens for system message | Max tokens for model response |
|-------------------------|------------------------|------------------------------------|------------------------------------|
| ChatGPT Turbo (0301) 8k | 8000                   | 400                                | 1500                               |
| ChatGPT Turbo 16k       | 16000                  | 1000                               | 3200                               |
| GPT-4 (8k)              | 8000                   | 400                                | 1500                               |
| GPT-4 32k               | 32000                  | 2000                               | 6400                               |

The table above shows the total number of tokens available for each model type. It also determines the maximum number of tokens that can be used for the [system message](#system-message) and the model response. Additionally, the following also consume tokens:



* The meta prompt (MP): if you limit responses from the model to the grounding data content (`inScope=True` in the API), the maximum number of tokens is 4036 tokens. Otherwise (for example if `inScope=False`) the maximum is 3444 tokens. This number is variable depending on the token length of the user question and conversation history. This estimate includes the base prompt as well as the query rewriting prompts for retrieval.
* User question and history: Variable but capped at 2000 tokens.
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

### failed ingestion jobs

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

*This request is not authorized to perform this operation*

Resolution: 

This means the storage account is not accessible with the given credentials. In this case, please review the storage account credentials passed to the API and ensure the storage account is not hidden behind a private endpoint (if a private endpoint is not configured for this resource). 



## Next steps
* [Get started using your data with Azure OpenAI](../use-your-data-quickstart.md)

* [Securely use Azure OpenAI on your data](../how-to/use-your-data-securely.md)

* [Introduction to prompt engineering](./prompt-engineering.md)
