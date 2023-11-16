---
title: Quickstart integrated vectorization
titleSuffix: Azure AI Search
description: Use the Import and vectorize data wizard to automate data chunking and vectorization in a search index.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: quickstart
ms.date: 11/06/2023
---

# Quickstart: Integrated vectorization (preview)

> [!IMPORTANT] 
> **Import and vectorize data** wizard is in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It targets the [2023-10-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&preserve-view=true).

Get started with [integrated vectorization](vector-search-integrated-vectorization.md) using the **Import and vectorize data** wizard in the Azure portal.

In this preview version of the wizard:

+ Source data is blob only, using the default parsing mode (one search document per blob).
+ Index schema is non-configurable. Source fields include `content` (chunked and vectorized), `metadata_storage_name` for title, and a `metadata_storage_path` for the document key.
+ Vectorization is Azure OpenAI only, using the [HNSW](vector-search-ranking.md) algorithm with defaults.
+ Chunking is non-configurable. The effective settings are:

  ```json
  textSplitMode: "pages",
  maximumPageLength: 2000,
  pageOverlapLength: 500
  ```

## Prerequisites

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure AI Search, in any region and on any tier. Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

+ [Azure OpenAI](https://aka.ms/oai/access) endpoint with a deployment of **text-embedding-ada-002** and an API key or [**Cognitive Services OpenAI User**](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions to upload data. You can only choose one vectorizer in this preview, and the vectorizer must be Azure OpenAI.

+ [Azure Storage account](/azure/storage/common/storage-account-overview), standard performance (general-purpose v2), Hot and Cool access tiers.

+ Blobs providing text content, unstructured docs only, and metadata. In this preview, your data source must be Azure blobs.

+ Read permissions in Azure Storage. A storage connection string that includes an access key gives you read access to storage content. If instead you're using Microsoft Entra logins and roles, make sure the [search service's managed identity](search-howto-managed-identities-data-sources.md) has [**Storage Blob Data Reader**](/azure/storage/blobs/assign-azure-role-data-access) permissions.

## Check for space

Many customers start with the free service. The free tier is limited to three indexes, three data sources, three skillsets, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

## Prepare sample data

This section points you to data that works for this quickstart.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure Storage account.

1. In the navigation pane, under **Data Storage**, select **Containers**.

1. Create a new container and then upload the [health-plan PDF documents](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/health-plan) used for this quickstart.

1. Before leaving the Azure Storage account in the Azure portal, [grant Storage Blob Data Reader permissions](search-howto-managed-identities-data-sources.md#assign-a-role) on the container, assuming you want role-based access. Or, get a connection string to the storage account from the **Access keys** page.

<a name="connect-to-azure-openai"></a>
<!-- This bookmark is used in an FWLINK. Do not change. -->

## Get connection details for Azure OpenAI

The wizard needs an endpoint, a deployment of **text-embedding-ada-002**, and either an API key or a search service managed identity with [**Cognitive Services OpenAI User**](/azure/ai-services/openai/how-to/role-based-access-control#azure-openai-roles) permissions.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure OpenAI resource.

1. Under **Keys and management**, copy the endpoint.

1. On the same page, copy a key or check **Access control** to assign role members to your search service identity.

1. Under **Model deployments**, select **Manage deployments** to open Azure AI Studio. Copy the deployment name of text-embedding-ada-002.

## Start the wizard

To get started, browse to your Azure AI Search service in the Azure portal and open the **Import and vectorize data** wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import and vectorize data**.

   :::image type="content" source="media/search-get-started-portal-import-vectors/command-bar.png" alt-text="Screenshot of the wizard command.":::

## Connect to your data

The next step is to connect to a data source to use for the search index.

1. In the **Import data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Azure Blob Storage**.

1. Specify the Azure subscription, storage account, and container that provides the data.

1. For the connection, either provide a full access connection string that includes a key, or [specify a managed identity](search-howto-managed-identities-storage.md) that has **Storage Blob Data Reader** permissions on the container.

1. Specify whether you want [deletion detection](search-howto-index-changed-deleted-blobs.md):

      :::image type="content" source="media/search-get-started-portal-import-vectors/data-source-page.png" alt-text="Screenshot of the data source page.":::

1. Select **Next: Vectorize and Enrich** to continue.

## Enrich and vectorize your data

In this step, specify the embedding model used to vectorize chunked data.

1. Provide the subscription, endpoint, API key, and model deployment name.

1. Optionally, you can crack binary images (for example, scanned document files) and [use OCR](cognitive-search-skill-ocr.md) to recognize text.

1. Optionally, you can add [semantic ranking](semantic-search-overview.md) to rerank results at the end of query execution, promoting the most semantically relevant matches to the top.

1. Specify a [run time schedule](search-howto-schedule-indexers.md) for the indexer.

   :::image type="content" source="media/search-get-started-portal-import-vectors/enrichment-page.png" alt-text="Screenshot of the enrichment page.":::

1. Select **Next: Create and Review** to continue.

## Run the wizard

This step creates the following objects:

+ Data source connection to your blob container.

+ Index with vector fields, vectorizers, vector profiles, vector algorithms. You aren't prompted to design or modify the default index during the wizard workflow. Indexes conform to the 2023-10-01-Preview version.

+ Skillset with [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and [AzureOpenAIEmbeddingModel](cognitive-search-skill-azure-openai-embedding.md) for vectorization.

+ Indexer with field mappings and output field mappings (if applicable).

## Check results

Search explorer accepts text strings as input and then vectorizes the text for vector query execution.

1. Select your index.

1. Make sure the API version is **2023-10-01-preview**.

1. Enter your search string. Here's a string that gets a count of the chunked documents and selects just the title and chunk fields: `$count=true&$select=title,chunk`.

1. Select **Search**.

   :::image type="content" source="media/search-get-started-portal-import-vectors/search-results.png" alt-text="Screenshot of search results.":::

You should see 84 documents, where each document is a chunk of the original PDF. The title field shows which PDF the chunk comes from.

The index definition isn't configurable so you can't filter by "title". To work around this limitation, you could define an index manually, making "title" filterable to get all of the chunks for a single document.

## Clean up

Azure AI Search is a billable resource. If it's no longer needed, delete it from your subscription to avoid charges.

## Next steps

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the objects necessary for integrated vectorization. If you want to explore each step in detail, try an[integrated vectorization sample](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-python/code/azure-search-integrated-vectorization-sample.ipynb).
