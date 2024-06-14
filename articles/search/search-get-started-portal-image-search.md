---
title: Quickstart image search
titleSuffix: Azure AI Search
description: Index and query images on Azure AI Search using the Azure portal. Run the Import and vectorize data wizard to vectorize images. Use Search Explorer to query images.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 06/14/2024
---

# Quickstart: Image search in Azure portal (preview)

> [!IMPORTANT]
> **Import and vectorize data** wizard and Azure AI Vision vectorizers are in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). By default, it targets the [2024-05-01-Preview REST API](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

Get started with image search using the **Import and vectorize data** wizard in the Azure portal and image search in **Search explorer**.

You need three Azure resources and sample data to complete this walkthrough:

> [!div class="checklist"]
> + Azure Storage to store image files as blobs
> + Azure AI services multiservice account, used for image vectorization and image analysis
> + Azure AI Search for indexing and queries

Sample data consists of image files in the azure-search-sample-data repo, but you can use different images and still follow this walkthrough.

## Prerequisites

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure AI services, a multiservice account, in a region that provides Azure AI Vision multimodal embeddings. Currently, those regions are: SwedenCentral, EastUS, NorthEurope, WestEurope, WestUS, SoutheastAsia, KoreaCentral, FranceCentral, AustraliaEast, WestUS2, SwitzerlandNorth, JapanEast. [Check the documentation](/azure/ai-services/computer-vision/how-to/image-retrieval) for an updated list.

+ Azure AI Search, on any tier, but in the same region as Azure AI services. The tier of your search service determines how many blobs you can index. We used the free tier to create this walkthrough and we limited the content to 10 JPG files.

+ Azure Storage, use a standard performance (general-purpose v2) account. Access tiers can be hot, cool, and cold.

All of the above resources must have public access enabled for the portal nodes to be able to access them. Otherwise, the wizard fails. After the wizard runs, firewalls and private endpoints can be enabled on the different integration components for security.

A free search service supports role-based access control on connections to Azure AI Search, but it doesn't support managed identities on outbound connections to Azure Storage or Azure AI Vision. This means you must use key-based authentication on free search service connections to other Azure services. Or, you can use basic or above and [configure a managed identity](search-howto-managed-identities-data-sources.md) and role assignment to admit requests from Azure AI Search. 

## Check for space

If you're starting with the free service, you're limited to three indexes, three data sources, three skillsets, and three indexers. Make sure you have room for extra items before you begin. This quickstart creates one of each object.

## Prepare sample data

1. Download the [unsplash-signs image folder](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/unsplash-images/jpg-signs) to a local folder or find some images of your own. On a free search service, keep the image files under 20 to stay under the free quota for enrichment procedssing.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure Storage account.

1. In the navigation pane, under **Data Storage**, select **Containers**.

1. Create a new container and then upload the images.

## Start the wizard

If your Azure AI multiservice account and Azure AI Search are in the same supported region and tenant, and if your Azure Storage blob container is using the default configuration, you're ready to start the wizard.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account, and go to your Azure AI Search service.

1. On the **Overview** page, select **Import and vectorize data**.

   :::image type="content" source="media/search-get-started-portal-import-vectors/command-bar.png" alt-text="Screenshot of the wizard command.":::

## Connect to your data

The next step is to connect to a data source to use for the search index.

1. In the **Import and vectorize data** wizard on the **Connect to your data** tab, expand the **Data Source** dropdown list and select **Azure Blob Storage**.

1. Specify the Azure subscription.

1. For Azure Storage, select the account and container that provides the data. Use the default values for the remaining fields.

   :::image type="content" source="media/search-get-started-portal-images/connect-to-your-data.png" alt-text="Screenshot of the connect to your data page in the wizard.":::

1. Select **Next**.

## Vectorize your text

If raw content includes text, this step specifies an embedding model that generates vectors for that content. Azure AI Vision model provides text embeddings, so we'll use that for this step.

1. On the **Vectorize your text** page, select **AI Vision vectorization**.  If it's not selectable, make sure Azure AI Search and Azure AI multiservice account are together in a region that [supports AI Vision multimodal APIs](/azure/ai-services/computer-vision/how-to/image-retrieval).

   :::image type="content" source="media/search-get-started-portal-images/vectorize-your-text.png" alt-text="Screenshot of the vectorize your text page in the wizard.":::

1. Select **Next**.

## Vectorize your images

Use Azure AI Vision to generate a vector representation of the image files.


vectorize-enrich-images.png


1. For AI Vision vectorization, select the account. 
1
1. Select the checkbox acknowledging the billing impact of using these resources.

1. Select **Next**.

## Vectorize and enrich your images

If your content includes images, you can apply AI in two ways:

+ Use a supported image embedding model from the catalog, or choose the Azure AI Vision multimodal embeddings API to vectorize images. 
+ Use OCR to recognize text in images. 

Azure AI Search and your Azure AI resource must be in the same region.

1. Specify the kind of connection the wizard should make. For image vectorization, it can connect to embedding models in Azure AI Studio or Azure AI Vision.

1. Specify the subscription.

1. For Azure AI Studio model catalog, specify the project and deployment. See [Setting up an embedding model](#set-up-embedding-models) for details.

1. Optionally, you can crack binary images (for example, scanned document files) and [use OCR](cognitive-search-skill-ocr.md) to recognize text.

1. Select the checkbox acknowledging the billing impact of using these resources.

1. Select **Next**.

## Advanced settings

1. Optionally, specify a [run time schedule](search-howto-schedule-indexers.md) for the indexer.

1. Select **Next**.

## Run the wizard

1. On Review and create, specify a prefix for the objects created when the wizard runs. A common prefix helps you stay organized.

1. Select **Create** to run the wizard. This step creates the following objects:

   + Data source connection.

   + Index with vector fields, vectorizers, vector profiles, vector algorithms. You aren't prompted to design or modify the default index during the wizard workflow. Indexes conform to the [2024-05-01-preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

   + Skillset with [Text Split skill](cognitive-search-skill-textsplit.md) for chunking and an embedding skill for vectorization. The embedding skill is either the [AzureOpenAIEmbeddingModel skill](cognitive-search-skill-azure-openai-embedding.md) for Azure OpenAI or [AML skill](cognitive-search-aml-skill.md) for Azure AI Studio model catalog.

   + Indexer with field mappings and output field mappings (if applicable).

If you can't select Azure AI Vision vectorizer, make sure you have an Azure AI Vision resource in a supported region, and that your search service managed identity has **Cognitive Services OpenAI User** permissions.

If you can't progress through the wizard because other options aren't available (for example, you can't select a data source or an embedding model), revisit the role assignments. Error messages indicate that models or deployments don't exist, when in fact the real issue is that the search service doesn't have permission to access them.

## Check results

Search explorer accepts text strings as input and then vectorizes the text for vector query execution.

1. In the Azure portal, under **Search Management** and **Indexes**, select the index your created.

1. Optionally, select **Query options** and hide vector values in search results. This step makes your search results easier to read.

   :::image type="content" source="media/search-get-started-portal-import-vectors/query-options.png" alt-text="Screenshot of the query options button.":::

1. Select **JSON view** so that you can enter text for your vector query in the **text** vector query parameter. 


1. Replace the text `"*"` with a question related to health plans, such as *"which plan has the lowest deductible"*.

1. Select **Search** to run the query.

   :::image type="content" source="media/search-get-started-portal-import-vectors/search-results.png" alt-text="Screenshot of search results.":::

   You should see 5 matches, where each document is a chunk of the original PDF. The title field shows which PDF the chunk comes from.

## Clean up

This demo uses billable Azure resources. If the resources are no longer needed, delete them from your subscription to avoid charges.

## Next steps

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the objects necessary for image search. If you want to explore each step in detail, try an [integrated vectorization sample](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/azure-search-integrated-vectorization-sample.ipynb).
