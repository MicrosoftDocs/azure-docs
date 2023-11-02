---
title: Quickstart integrated vectorization
titleSuffix: Azure AI Search
description: Use the Import and vectorize data wizard to automate data chunking and vectorization in a search index.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 11/02/2023
---

# Quickstart: Integrated vectorization (preview)

Get started with integrated vectorization using the **Import and vectorize data** wizard in the Azure portal.

## Prerequisites

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure AI Search, in any region and on any tier. Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

+ [Azure OpenAI](https://aka.ms/oai/access) endpoint with a deployment of **text-embedding-ada-002** and [Cognitive Services OpenAI User](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions to upload data. You can only choose one vectorizer in this preview.

+ [Azure Storage account](/azure/storage/common/storage-account-overview), standard performance (general-purpose v2), Hot and Cool access tiers.

+ Blobs providing text content, unstructured docs only, and metadata. In this preview, your data source must be Azure blobs.

+ Read permissions in Azure Storage. A storage connection string that includes an access key gives you read access to storage content. If instead you're using Microsoft Entra logins and roles, make sure the [search service's managed identity](search-howto-managed-identities-data-sources.md) has **Storage Blob Data Reader** permissions.


Chunking cannot be customized, only the most recommended values will be set by default as per: https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167 

### Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, three skillsets, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

<!-- ## Prepare sample data

This section points you to data that works for this quickstart. -->

## Start the wizard

To get started, browse to your Azure AI Search service in the Azure portal and open the **Import and vectorize data** wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import and vectorize data**.

## Connect to your data

The next step is to connect to a data source to use for the search index.

1. In the **Import data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Samples**.

1. In the list of built-in samples, select **hotels-sample**.

1. Select **Next: Vectorize and Enrich** to continue.

## Enrich and vectorize your data

In this step, specify the embedding model used to vectorize chunked data.

1. Provide the subscription, endpoint, API key, and model deployment name.

1. Optionally, you can crack binary images (for example, scanned document files) and [use OCR](cognitive-search-skill-ocr.md) to recognize text.

1. Optionally, you can add [semantic ranking](semantic-search-overview.md) to rerank results at the end of query execution, promoting the most semantically relevant matches to the top.

1. Specify a [run time schedule](search-howto-schedule-indexers.md) for the indexer.

1. Select **Next: Create and Review** to continue.

## Run the wizard

This step creates the following objects:

+ Data source connection to your blob container.

+ Index with vector fields, vectorizers, vector profiles, vector algorithms. You aren't prompted to design or modify the default index during the wizard workflow. Indexes conform to the 2023-10-01-Preview version.

+ Skillset with [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and [AzureOpenAIEmbeddingModel](cognitive-search-skill-azure-openai-embedding.md) for vectorization.

+ Indexer with field mappings and output field mappings.

## Check results

Search explorer accepts text strings as input and then vectorizes the text for vector query execution.

1. Make sure the API version is **2023-10-01-preview**.

1. Enter your search string.

1. Select **Search**.

## Clean up

Azure AI Search is a billable resource. If it's no longer needed, delete it from your subscription to avoid charges.

## Next steps

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the objects necessary for integrated vectorization. If you want to explore each step in detail, try the integrated vectorization tutorial.