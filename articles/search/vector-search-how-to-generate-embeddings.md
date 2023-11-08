---
title: Generate embeddings
titleSuffix: Azure AI Search
description: Learn how to generate embeddings for downstream indexing into an Azure AI Search index.

author: farzad528
ms.author: fsunavala
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/30/2023
---

# Generate embeddings for search queries and documents

Azure AI Search doesn't host vectorization models, so one of your challenges is creating embeddings for query inputs and outputs. You can use any embedding model, but this article assumes Azure OpenAI embeddings models. Demos in the [sample repository](https://github.com/Azure/cognitive-search-vector-pr/tree/main) tap the [similarity embedding models](/azure/ai-services/openai/concepts/models#embeddings-models) of Azure OpenAI.

Dimension attributes have a minimum of 2 and a maximum of 2048 dimensions per vector field.

> [!NOTE]
> This article applies to the generally available version of [vector search](vector-search-overview.md), which assumes your application code calls an external resource such as Azure OpenAI for vectorization. A new feature called [integrated vectorization](vector-search-integrated-vectorization.md), currently in preview, offers embedded vectorization. Integrated vectorization takes a dependency on indexers, skillsets, and either the AzureOpenAIEmbedding skill or a custom skill that points to a model that executes externally from Azure AI Search.

## How models are used

+ Query inputs require that you submit user-provided input to an embedding model that quickly converts human readable text into a vector.

  + For example, you can use **text-embedding-ada-002** to generate text embeddings and [Image Retrieval REST API](/rest/api/computervision/2023-02-01-preview/image-retrieval/vectorize-image) for image embeddings.

  + To avoid [rate limiting](/azure/ai-services/openai/quotas-limits), you can implement retry logic in your workload. For the Python demo, we used [tenacity](https://pypi.org/project/tenacity/).

+ Query outputs are any matching documents found in a search index. Your search index must have been previously loaded with documents having one or more vector fields with embeddings. Whatever model you used for indexing, use the same model for queries.

## Create resources in the same region

If you want resources in the same region, start with:

1. [A region for the similarity embedding model](/azure/ai-services/openai/concepts/models#embeddings-models-1), currently in Europe and the United States.

1. [A region for Azure AI Search](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=cognitive-search). 

1. To support hybrid queries that include [semantic ranking](semantic-how-to-query-request.md), or if you want to try machine learning model integration using a [custom skill](cognitive-search-custom-skill-interface.md) in an [AI enrichment pipeline](cognitive-search-concept-intro.md), note the regions that provide those features.

## Generate an embedding for an improvised query

The Postman collection assumes that you already have a vector query. Here's some Python code for generating an embedding that you can paste into the "values" property of a vector query.

```python
!pip install openai==0.28.1

import openai

openai.api_type = "azure"
openai.api_key = "YOUR-API-KEY"
openai.api_base = "https://YOUR-OPENAI-RESOURCE.openai.azure.com"
openai.api_version = "2023-05-15"

response = openai.Embedding.create(
    input="How do I use Python in VSCode?",
    engine="text-embedding-ada-002"
)
embeddings = response['data'][0]['embedding']
print(embeddings)
```

## Tips and recommendations for embedding model integration

+ **Identify use cases:** Evaluate the specific use cases where embedding model integration for vector search features can add value to your search solution. This can include matching image content with text content, cross-lingual searches, or finding similar documents.
+ **Optimize cost and performance**: Vector search can be resource-intensive and is subject to maximum limits, so consider only vectorizing the fields that contain semantic meaning.
+ **Choose the right embedding model:** Select an appropriate model for your specific use case, such as word embeddings for text-based searches or image embeddings for visual searches. Consider using pretrained models like **text-embedding-ada-002** from OpenAI or **Image Retrieval** REST API from [Azure AI Computer Vision](/azure/ai-services/computer-vision/how-to/image-retrieval).
+ **Normalize Vector lengths**: Ensure that the vector lengths are normalized before storing them in the search index to improve the accuracy and performance of similarity search. Most pretrained models already are normalized but not all. 
+ **Fine-tune the model**: If needed, fine-tune the selected model on your domain-specific data to improve its performance and relevance to your search application.
+ **Test and iterate**: Continuously test and refine your embedding model integration to achieve the desired search performance and user satisfaction.

## Next steps

+ [Understanding embeddings in Azure OpenAI Service](/azure/ai-services/openai/concepts/understand-embeddings)
+ [Learn how to generate embeddings](/azure/ai-services/openai/how-to/embeddings?tabs=console)
+ [Tutorial: Explore Azure OpenAI Service embeddings and document search](/azure/ai-services/openai/tutorials/embeddings?tabs=command-line)