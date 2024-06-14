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

1. Download the [unsplash-signs image folder](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/unsplash-images/jpg-signs) to a local folder or find some images of your own. On a free search service, keep the image files under 20 to stay under the free quota for enrichment processing.

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

If raw content includes text, or if the skillset produces text, the wizard calls a text embedding model to generate vectors for that content. In this exercise, text will be produced from the Optical Character Recognition (OCR) skill that you add in the next step.

Azure AI Vision model provides text embeddings, so we'll use that model for text vectorization.

1. On the **Vectorize text** page, select **AI Vision vectorization**. If it's not selectable, make sure Azure AI Search and Azure AI multiservice account are together in a region that [supports AI Vision multimodal APIs](/azure/ai-services/computer-vision/how-to/image-retrieval).

   :::image type="content" source="media/search-get-started-portal-images/vectorize-your-text.png" alt-text="Screenshot of the Vectorize your text page in the wizard.":::

1. Select **Next**.

## Vectorize and enrich your images

Use Azure AI Vision to generate a vector representation of the image files. 

In this step, you can also set enrichment options to extract text from images. The wizard uses OCR from Azure AI services to recognize text in image files. Two more outputs appear in the index when OCR is added to the workflow. First, the "chunk" field is populated with the OCR-generated string. Second, the "text_vector" field is populated with an embedding that represents the string. The inclusion of plain text in an index is useful if you want to use relevance features that operate on strings, such as semantic ranker and scoring profiles.

1. On the **Vectorize images** page, select the **Vectorize images** checkbox, and then select **AI Vision vectorization**.

1. Select **Use same AI service selected for text vectorization**.

1. In the enrichment section, select **Extract text from images**.

1. Select **Use same AI service selected for image vectorization**.

   :::image type="content" source="media/search-get-started-portal-images/vectorize-enrich-images.png" alt-text="Screenshot of the Vectorize your images page in the wizard.":::

1. Select **Next**.

## Advanced settings

1. Specify a [run time schedule](search-howto-schedule-indexers.md) for the indexer. We recommend **Once** for this exercise, but for data sources where the underlying data is volatile, you can schedule indexing to pick up the changes.

   :::image type="content" source="media/search-get-started-portal-images/run-once.png" alt-text="Screenshot of the Advanced settings page in the wizard.":::

1. Select **Next**.

## Run the wizard

1. On Review and create, specify a prefix for the objects created when the wizard runs. The wizard creates multiple objects. A common prefix helps you stay organized.

   :::image type="content" source="media/search-get-started-portal-images/review-create.png" alt-text="Screenshot of the Review and create page in the wizard.":::

1. Select **Create** to run the wizard. This step creates the following objects:

   + Data source connection to blob storage.

   + Index with vector fields, text fields, vectorizers, vector profiles, vector algorithms. You can't modify the default index during the wizard workflow. Indexes conform to the [2024-05-01-preview REST API](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2024-05-01-preview&preserve-view=true).

   + Skillset with the following five skills:

     + [OCR skill](cognitive-search-skill-ocr.md) recognizes text in image files.
     + [Text Merger skill](cognitive-search-skill-textmerger.md) reunites the various outputs of OCR processing.
     + [Text Split skill](cognitive-search-skill-textsplit.md) adds data chunking. This skill is part of the wizard workflow, although for this data, chunking isn't technically necessary. 
     + [Azure AI Vision multimodal](cognitive-search-skill-vision-vectorize.md) is used to vectorize OCR-generated text.
     + [Azure AI Vision multimodal](cognitive-search-skill-vision-vectorize.md) is called again to vectorize images.

   + Indexer with field mappings and output field mappings.

## Check results

Search explorer accepts text, vectors, and images as query inputs. You can drag or select an image into the search area, and it will be vectorized for search. Image vectorization assumes that your index has a vectorizer definition, which the **Import and vectorize data** wizard creates using your selections.

1. In the Azure portal, under **Search Management** and **Indexes**, select the index your created. An embedded Search Explorer is the first tab.

1. Under **View**, select **Image view**.

   :::image type="content" source="media/search-get-started-portal-images/select-image-view.png" alt-text="Screenshot of the query options button with image view.":::

1. Drag an image from the local folder that contains the sample image files. Or, open the file browser to select a local image file.

1. Select **Search** to run the query 

   :::image type="content" source="media/search-get-started-portal-images/image-search.png" alt-text="Screenshot of search results.":::

   The top match should be the image you searched for.

1. Try the query options to compare search outcomes:

   + Hide vectors for more readable results.
   + Select a vector field to query over. The default is text vectors, but you can specify the image vector to exclude text vectors from query execution.

## Clean up

This demo uses billable Azure resources. If the resources are no longer needed, delete them from your subscription to avoid charges.

## Next steps

This quickstart introduced you to the **Import and vectorize data** wizard that creates all of the objects necessary for image search. If you want to explore each step in detail, try an [integrated vectorization sample](https://github.com/Azure/azure-search-vector-samples/blob/main/demo-python/code/integrated-vectorization/azure-search-integrated-vectorization-sample.ipynb).
