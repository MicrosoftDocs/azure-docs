---
title: 'Using your data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to learn about using your data for better text generation in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 07/12/2023
recommendations: false
---

# Azure OpenAI on your data (preview)

Azure OpenAI on your data enables you to run supported chat models such as GPT-35-Turbo and GPT-4 on your data without needing to train or fine-tune models. Running models on your data enables you to chat on top of, and analyze your data with greater accuracy and speed. By doing so, you can unlock valuable insights that can help you make better business decisions, identify trends and patterns, and optimize your operations. One of the key benefits of Azure OpenAI on your data is its ability to tailor the content of conversational AI. 

To get started, [connect your data source](../use-your-data-quickstart.md) using [Azure OpenAI Studio](https://oai.azure.com/) and start asking questions and chatting on your data.

Because the model has access to, and can reference specific sources to support its responses, answers are not only based on its pretrained knowledge but also on the latest information available in the designated data source. This grounding data also helps the model avoid generating responses based on outdated or incorrect information.

> [!NOTE]
> To get started, you need to already have been approved for [Azure OpenAI access](../overview.md#how-do-i-get-access-to-azure-openai) and have an [Azure OpenAI Service resource](../how-to/create-resource.md) with either the gpt-35-turbo or the gpt-4 models deployed.

## What is Azure OpenAI on your data

Azure OpenAI on your data works with OpenAI's powerful GPT-35-Turbo and GPT-4 language models, enabling them to provide responses based on your data. You can access Azure OpenAI on your data using a REST API or the web-based interface in the [Azure OpenAI Studio](https://oai.azure.com/) to create a solution that connects to your data to enable an enhanced chat experience. 

One of the key features of Azure OpenAI on your data is its ability to retrieve and utilize data in a way that enhances the model's output.  Azure OpenAI on your data, together with Azure Cognitive Search, determines what data to retrieve from the designated data source based on the user input and provided conversation history. This data is then augmented and resubmitted as a prompt to the OpenAI model, with retrieved  information being appended to the original prompt. Although retrieved data is being appended to the prompt, the resulting input is still processed by the model like any other prompt. Once the data has been retrieved and the prompt has been submitted to the model, the model uses this information to provide a completion. See the [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context) article for more information. 

## Data source options

Azure OpenAI on your data uses an [Azure Cognitive Search](/azure/search/search-what-is-azure-search) index to determine what data to retrieve based on  user inputs and provided conversation history. We recommend using Azure OpenAI Studio to create your index from a blob storage or local files. See the [quickstart article](../use-your-data-quickstart.md?pivots=programming-language-studio) for more information.

## Ingesting your data into Azure Cognitive Search

For documents and datasets with long text, you should use the available [data preparation script](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts) to ingest the data into cognitive search. The script chunks the data so that your response with the service will be more accurate. This script also supports scanned PDF file and images and ingests the data using [Document Intelligence](../../../ai-services/document-intelligence/overview.md).


## Data formats and file types

Azure OpenAI on your data supports the following filetypes:

* `.txt`
* `.md`
* `.html` 
* Microsoft Word files
* Microsoft PowerPoint files
* PDF

There are some caveats about document structure and how it might affect the quality of responses from the model: 

* The model provides the best citation titles from markdown (`.md`) files. 

* If a document is a PDF file, the text contents are extracted as a preprocessing step (unless you're connecting your own Azure Cognitive Search index). If your document contains images, graphs, or other visual content, the model's response quality depends on the quality of the text that can be extracted from them. 

* If you're converting data from an unsupported format into a supported format, make sure the conversion:

    * Doesn't lead to significant data loss.
    * Doesn't add unexpected noise to your data.  

    This will impact the quality of Azure Cognitive Search and the model response. 

## Virtual network support & private link support

Azure OpenAI on your data does not currently support private endpoints. 

## Azure Role-based access controls (Azure RBAC)

To add a new data source to your Azure OpenAI resource, you need the following Azure RBAC roles.


|Azure RBAC role  |Needed when  |
|---------|---------|
|[Cognitive Services OpenAI Contributor](/azure/role-based-access-control/built-in-roles#cognitive-services-openai-contributor) | You want to use Azure OpenAI on your data. |
|[Search Index Data Contributor](/azure/role-based-access-control/built-in-roles#search-index-data-contributor)     | You have an existing Azure Cognitive Search index that you want to use, instead of creating a new one.        |
|[Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor)     | You have an existing Blob storage container that you want to use, instead of creating a new one.        |

## Recommended settings

Use the following sections to help you configure Azure OpenAI on your data for optimal results.

### System message

Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, what it should and shouldn't answer, and how to format responses. There's no token limit for the system message, but will be included with every API call and counted against the overall token limit. The system message will be truncated if it's greater than 200 tokens. 

For example, if you're creating a chatbot where the data consists of transcriptions of quarterly financial earnings calls, you might use the following system message:

*"You are a financial chatbot useful for answering questions from financial reports. You are given excerpts from the earnings call. Please answer the questions by parsing through all dialogue."*

This system message can help improve the quality of the response by specifying the domain (in this case finance) and mentioning that the data consists of call transcriptions. It helps set the necessary context for the model to respond appropriately. 

> [!NOTE] 
> The system message is only guidance. The model might not adhere to every instruction specified because it has been primed with certain behaviors such as objectivity, and avoiding controversial statements. Unexpected behavior may occur if the system message contradicts with these behaviors. 

### Maximum response 

Set a limit on the number of tokens per model response. The upper limit for Azure OpenAI on Your Data is 1500. This is equivalent to setting the `max_tokens` parameter in the API. 

### Limit responses to your data 

This option encourages the model to respond using your data only, and is selected by default. If you unselect this option, the model may more readily apply its internal knowledge to respond. Determine the correct selection based on your use case and scenario. 

### Semantic search 

> [!IMPORTANT]
> * Semantic search is subject to [additional pricing](/azure/search/semantic-search-overview#availability-and-pricing)
> * Currently Azure OpenAI on your data supports semantic search for English data only. Only enable semantic search if both your documents and use case are in English.

If [semantic search](/azure/search/semantic-search-overview) is enabled for your Azure Cognitive Search service, you are more likely to produce better retrieval of your data, which can improve response and citation quality.

### Index field mapping 

If you're using your own index, you will be prompted in the Azure OpenAI Studio to define which fields you want to map for answering questions when you add your data source. You can provide multiple fields for *Content data*, and should include all fields that have text pertaining to your use case. 

:::image type="content" source="../media/use-your-data/index-data-mapping.png" alt-text="A screenshot showing the index field mapping options in Azure OpenAI Studio." lightbox="../media/use-your-data/index-data-mapping.png":::

In this example, the fields mapped to **Content data** and **Title** provide information to the model to answer questions. **Title** is also used to title citation text. The field mapped to **File name** generates the citation names in the response. 

Mapping these fields correctly helps ensure the model has better response and citation quality. 

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

* Azure OpenAI on your data supports queries that are in the same language as the documents. For example, if your data is in Japanese, then queries need to be in Japanese too.  

* Currently Azure OpenAI on your data supports [semantic search](/azure/search/semantic-search-overview) for English data only. Don't enable semantic search if your data is in other languages.   

* We recommend using a system message to inform the model that your data is in another language. For example:
    
    *"You are an AI assistant that helps people find information. You retrieve Japanese documents, and you should read them carefully in Japanese and answer in Japanese."* 

* If you have documents in multiple languages, we recommend building a new index for each language and connecting them separately to Azure OpenAI.  

### Using the web app

You can use the available web app to interact with your model using a graphical user interface, which you can deploy using either [Azure OpenAI studio](../use-your-data-quickstart.md?pivots=programming-language-studio#deploy-a-web-app) or a [manual deployment](https://github.com/microsoft/sample-app-aoai-chatGPT). 

![A screenshot of the web app interface.](../media/use-your-data/web-app.png)

You can also customize the app's frontend and backend logic. For example, you could change the icon that appears in the center of the app by updating `/frontend/src/assets/Azure.svg` and then redeploying the app [using the Azure CLI](https://github.com/microsoft/sample-app-aoai-chatGPT#deploy-with-the-azure-cli).  See the source code for the web app, and more information [on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT).

When customizing the app, we recommend:

- Resetting the chat session (clear chat) if the user changes any settings. Notify the user that their chat history will be lost.

- Clearly communicating the impact on the user experience that each setting you implement will have.

- When you rotate API keys for your Azure OpenAI or Azure Cognitive Search resource, be sure to update the app settings for each of your deployed apps to use the new keys.

- Pulling changes from the `main` branch for the web app's source code frequently to ensure you have the latest bug fixes and improvements.

### Using the API

Consider setting the following parameters even if they are optional for using the API.


|Parameter  |Recommendation  |
|---------|---------|
|`fieldsMapping`    | Explicitly set the title and content fields of your index. This impacts the search retrieval quality of Azure Cognitive Search, which impacts the overall response and citation quality.         |
|`roleInformation`     | Corresponds to the "System Message" in the Azure OpenAI Studio. See the [System message](#system-message) section above for recommendations. |

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

When chatting with a model, providing a history of the chat will help the model return higher quality results. 

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


## Next steps
* [Get started using your data with Azure OpenAI](../use-your-data-quickstart.md)

* [Introduction to prompt engineering](./prompt-engineering.md)


