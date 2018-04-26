---
title: Quickstart cognitive search preview in Azure Search | Microsoft Docs
description: Learn how to use natural language processing (NLP) and AI-powered pretrained models for transforming unstructured data into searchable content during indexing. Build a cognitive search solution in Azure Search. 
manager: cgronlun
author: HeidiSteen
ms.service: search
ms.topic: quickstart
ms.date: 05/01/2018
ms.author: heidist
---
# Quickstart: Add pre-defined cognitive skills to indexing in a portal walkthrough

Cognitive search (preview) adds natural language processing (NLP) and image processing to an Azure Search indexing pipeline, making unsearchable, unstructured content both searchable, and structured. 

When added to indexing, NLP and image processing yields tangible benefits: detect language or entities in source content, extract key phrases or text from images, get a text representation of an image, and more. Information created through enrichment is added to a searchable index hosted in your Azure Search service.

In this quickstart, create an enrichment pipeline using built-in components and learn important concepts:

* Set up sample data in Azure Blob storage
* Start the **Import data** wizard to configure indexing and enrichment
* Choose built-in skills to enrich the sample data
* Run the indexing job and query the results in **Search explorer**

You can try out cognitive search in an Azure Search service created in the following regions:

* South Central US
* West Europe

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[What is cognitive search](cognitive-search-concept-intro.md) describes the enrichment pipeline and important concepts. 

Azure services make up an end-to-end workflow.

+ Azure data sources provide the source data to index. Supported data sources include Azure Blob storage, Azure SQL Database, Azure Table storage, Azure Cosmos DB (SQL). In this quickstart, sample data is loaded into and retrieved from an Azure Blob container.

+ Azure Search provides the cognitive search enrichment pipeline, full text search, and the Search Explorer tool for querying the index.

### Set up Azure Search

1. Go to the [Azure portal](https://portal.azure.com) and sign in by using your Azure account.

1. Click **Create a resource**, search for Azure Search, and click **Create**. See [Create an Azure Search service in the portal](search-create-service-portal.md) if you are setting up a search service for the first time.

  ![Dashboard portal](./media/cognitive-search-tutorial-blob/create-service-full-portal.png)

1. For Resource group, create a resource group to contain all the resources you create today to make cleanup easier.

1. For Location, choose either **South Central US** or **West Europe**. Currently, the preview is available only in those regions.

1. For Pricing tier, you can create a **Free** service to complete tutorials and quickstarts. For deeper investigation using your own data, create a [paid service](https://azure.microsoft.com/pricing/details/search/) such as **Basic** or **Standard**. 

  A Free service is limited to 3 indexes, 16 MB maximum blob size, and 2 minutes of indexing. This might be insufficient for exercising the full capabilities of cognitive search. To review limits across tiers, see [Service Limits](search-limits-quotas-capacity.md).

1. Pin the service to the dashboard for fast access to service information.

  ![Service definition page in the portal](./media/cognitive-search-tutorial-blob/create-search-service.png)

1. After the service is created, collect the following information once the search service is created: "URL" from the Overview page, and "api-key" (either primary or secondary) from the Keys page.

  ![Endpoint and key information in the portal](./media/cognitive-search-tutorial-blob/create-search-collect-info.png)

### Set up Azure Blob service and load sample data

The enrichment pipeline pulls from Azure data sources. Source data must originate from a supported data source type of an [Azure Search indexer](search-indexer-overview.md). For this exercise, use blob storage to showcase multiple content types.

1. [Download sample data](https://1drv.ms/f/s!As7Oy81M_gVPa-LCb5lC_3hbS-4). Sample data consists of a small file set of different types. 

1. Sign up for Azure Blob storage, create a storage account, log in to Storage Explorer, and create a container named `basicdemo`. This [Quickstart](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-storage-explorer) covers all the steps.

1. Still in Storage Explorer, in the `basicdemo` container you created, click **Upload** to upload the sample files.

1. Collect the following information from the portal:

  + The container name you created when uploading the files. The sample script used to create the data source in a later step assumes `basicdemo`.

  + The connection string for your storage account from  **Settings** > **Access keys**. The connection string should be a URL similar to the following example:

  ```http
  DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=y1NIlE9wFVBIyrCi562GzZl+JO9TEGdqOerqfbT78C8zrn28Te8DsWlxvKKnjh67P/HM5k80zt4shOt9vqlbg==;EndpointSuffix=core.windows.net
  ```

There are other ways to specify the connection string, such as providing a shared access signature. To learn more about data source credentials, see [Indexing Azure Blob Storage](search-howto-indexing-azure-blob-storage.md#Credentials).

## Create the enrichment pipeline
1. On the search service dashboard page, click **Import data** on the command bar.

1. Click **Connect to your data** to choose the Azure blob container.

1. Click **Define enrichment** to choose enrichments.

1. Click **Customize index** to view a default index inferred from artifacts in the pipeline. Fields in the source data, plus output fields in the enrichment phase, are used to build an initial fields collection in an index.

1. Click **Indexer** to name and schedule the indexer. 

1. Specify the schedule, which is based on the regional time zone in which the service is provisioned.

1. Set advanced options to specify thresholds on whether indexing can continue if a document is dropped. Additionally, you can specify whether **Key** fields are allowed to contain spaces and slashes.  

1. Click **OK** to create the index and import the data.

## Query in Search Explorer

Recall that sample data started out as a collection of text, image, and application files. 

  ![Source files in Azure blob storage](./media/cognitive-search-quickstart-blob/sample-data.png)

Post-enrichment, the index contains searchable text and information derived from these files. In addition, some content is placed in newly generated fields that can be attributed for various search scenarios. 

To access searchable data, use **Search explorer** to run queries and view results. Results are returned in JSON, which can be verbose and hard to read. For readability, run highly specified queries so that only a few JSON documents are returned. 

1. On the search service dashboard page, click **Search explorer** on the command bar.

1. Choose the index.

1. Enter this query to return . . . 


## Next steps

You have now loaded sample data and created your first enriched cognitive search pipeline in the portal. As a next step, learn how to perform the same tasks programmatically. 

> [!div class="nextstepaction"]
> [Tutorial: Learn the cognitive search REST APIs](cognitive-search-tutorial-blob.md)