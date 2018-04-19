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
# Quickstart: Try cognitive search (preview) in a portal walkthrough

Cognitive search is a new pre-release capability in the Azure Search indexing subsystem that transforms raw, unstructured content into rich searchable content in a searchable index. Depending on indexer configuration, the system could extract text from images, entities and key phrases from unstructured text, channel text into either deconstructed or constructed shapes, or apply custom analysis or transformations that you provide.

In this quickstart, the Azure portal guides you through pipeline configuration, providing a list of built-in skills that you can apply to sample data. You

> [!Note]
> Cognitive search is a preview feature with limited availability. Create a search service running in a data region providing this feature.

## Prerequisites

To issue REST calls to Azure Search, use a web test tool such as Telerik Fiddler or Postman to formulate HTTP calls. If these tools are new to you, see [Explore Azure Search REST APIs using Fiddler or Postman](https://docs.microsoft.com/azure/search/search-fiddler).

Use the [Azure portal](https://portal.azure.com/) to create services used in an end-to-end workflow. 

 ![Dashboard portal](./media/cognitive-search-get-start-preview/create-service-full-portal.png)

### Set up Azure Search

First, sign up for the Azure Search service. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. Go to the [Azure portal](https://portal.azure.com) and sign in by using your Azure account.

1. Click **Create a resource**, search for Azure Search, and click **Create**. See [Create a service in the portal](search-create-service-portal.md) if you are setting up a search service for the first time.

1. For Resource group, create a resource group for all resources you create today to make cleanup easier.

1. For Location, choose either **South Central US** or **West Europe**. Currently, the preview is available only in those regions.

1. For Pricing tier, you can create a **Free** service to complete tutorials and quickstarts. For deeper investigation using your own data, create a [paid service](https://azure.microsoft.com/pricing/details/search/) such as **Basic** or **Standard**. 

  A Free service is limited to 3 indexes, 16-MB maximum blob size, and 2 minutes of indexing, which is insufficient for exercising the full capabilities of cognitive search. To review limits for different tiers, see [Service Limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity).

1. Pin the service to the dashboard for fast access to service information.

  ![Service definition page in the portal](./media/cognitive-search-get-start-preview/create-search-service.png)

1. After the service is created, collect the following information once the search service is created: "endpoint", "api-key" (either primary or secondary).

  ![Endpoint and key information in the portal](./media/cognitive-search-get-start-preview/create-search-collect-info.png)

### Set up Azure Blob service and load sample data

The enrichment pipeline pulls from Azure data sources. Source data must originate from a [supported data source type](https://docs.microsoft.com/azure/search/search-indexer-overview). For this exercise, we use blob storage to showcase multiple content types.

1. [Download sample data](https://1drv.ms/f/s!As7Oy81M_gVPa-LCb5lC_3hbS-4). Sample data consists of a very small file set of different types. 

1. [Sign up for Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-storage-explorer) and upload sample files. Create a storage account, log in to Storage Explorer, create a collection, and upload the sample files.

1. Collect the following information from the portal:

  + The container name you created when uploading the files. The sample script used to create the data source in a later step assumes you named it `basicdemo`.

  + The connection string for your storage account from  **Settings** > **Access keys**. The connection string should be a URL similar to the following example:

  ```http
  DefaultEndpointsProtocol=https;AccountName=cogsrchdemostorage;AccountKey=y5NIlE4wFVBIyrCi392GzZl+JO4TEGdqOerqfbT79C8zrn28Te8DsWlxvKKnjh69P/HM5k50ztz2shOt8vqlbg==;EndpointSuffix=core.windows.net
  ```

There are other ways to specify the connection string, such as providing a shared access signature. To learn more about data source credentials, see [Indexing Azure Blob Storage](https://docs.microsoft.com/azure/search/search-howto-indexing-azure-blob-storage).


## TBD

## Next steps

+ [How to map fields into your index](cognitive-search-output-field-mapping.md)
+ [How to create a skillset or augmentation pipeline](cognitive-search-defining-skillset.md)
+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a custom interface](cognitive-search-custom-skill-interface.md)
+ [Example: creating a custom skill](cognitive-search-create-custom-skill-example.md)