---
title: Create a knowledge store (preview) in the Azure portal
titleSuffix: Azure Cognitive Search
description: Use the Import data wizard to create a knowledge store used for persisting enriched content. Connect to a knowledge store for analysis from other apps, or send enriched content to downstream processes. This feature is currently in public preview.

author: HeidiSteen
ms.author: heidist
manager: nitinme
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 06/07/2020
---

# Quickstart: Create an Azure Cognitive Search knowledge store in the Azure portal

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

Knowledge store is a feature of Azure Cognitive Search that persists output from a content processing pipeline for subsequent analyses or downstream processing. 

A pipeline accepts unstructured text and image content, applies AI powered by Cognitive Services (such as OCR and natural language processing), and outputs new structures and information that didn't previously exist. One of the physical artifacts created by a pipeline is a [knowledge store](knowledge-store-concept-intro.md), which you can access through tools to analyze and explore content.

In this quickstart, you'll combine services and data in the Azure cloud to create a knowledge store. Once everything is in place, you'll run the **Import data** wizard in the portal to pull it all together. The end result is original text content plus AI-generated content that you can view in the portal ([Storage explorer](knowledge-store-view-storage-explorer.md)).

## Prerequisites

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure Cognitive Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

+ An Azure Storage account with [Blob storage](https://docs.microsoft.com/azure/storage/blobs/).

> [!NOTE]
> This quickstart also uses [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) for the AI. Because the workload is so small, Cognitive Services is tapped behind the scenes for free processing for up to 20 transactions. This means that you can complete this exercise without having to create an additional Cognitive Services resource.

## Set up your data

In the following steps, set up a blob container in Azure Storage to store heterogeneous content files.

1. [Download HotelReviews_Free.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?sp=r&st=2019-11-04T01:23:53Z&se=2025-11-04T16:00:00Z&spr=https&sv=2019-02-02&sr=b&sig=siQgWOnI%2FDamhwOgxmj11qwBqqtKMaztQKFNqWx00AY%3D). This data is hotel review data saved in a CSV file (originates from Kaggle.com) and contains 19 pieces of customer feedback about a single hotel. 

1. [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal) or [find an existing account](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) under your current subscription. You'll use Azure storage for both the raw content to be imported, and the knowledge store that is the end result.

   + Choose the **StorageV2 (general purpose V2)** account type.

1. Open the Blob services pages and create a container named *hotel-reviews*.

1. Click **Upload**.

    ![Upload the data](media/knowledge-store-create-portal/upload-command-bar.png "Upload the hotel reviews")

1. Select the **HotelReviews-Free.csv** file you downloaded in the first step.

    ![Create the Azure Blob container](media/knowledge-store-create-portal/hotel-reviews-blob-container.png "Create the Azure Blob container")

1. Before you quit the Blob storage pages, use a link on the left navigation pane to open the **Access Keys** page. Get a connection string to retrieve data from Blob storage. A connection string looks similar to the following example: `DefaultEndpointsProtocol=https;AccountName=<YOUR-ACCOUNT-NAME>;AccountKey=<YOUR-ACCOUNT-KEY>;EndpointSuffix=core.windows.net`

You are now ready to move on the **Import data** wizard.

## Run the Import data wizard

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, click **Import data** on the command bar to create a knowledge store in four steps.

   ![Import data command](media/cognitive-search-quickstart-blob/import-data-cmd2.png)

### Step 1: Create a data source

1. In **Connect to your data**, choose **Azure Blob storage**, select the account and container you created. 

1. For the **Name**, enter `hotel-reviews-ds`.

1. For **Parsing mode**, select **Delimited text**, and then select the **First Line Contains Header** checkbox. Make sure the **Delimiter character** is a comma (,).

1. In **Connection String**, paste in the connection string you copied from the **Access Keys** page in Azure Storage.

1. In **Containers**, enter the name of the blob container holding the data.

    Your page should look similar to the following screenshot.

    ![Create a data source object](media/knowledge-store-create-portal/hotel-reviews-ds.png "Create a data source object")

1. Continue to the next page.

### Step 2: Add cognitive skills

In this wizard step, you will create a skillset with cognitive skill enrichments. The source data consists of customer reviews in several languages. Skills that are relevant for this data set include key phrase extraction, sentiment detection, and text translation. In a later step, these enrichments will be "projected" into a knowledge store as Azure tables.

1. Expand **Attach Cognitive Services**. **Free (Limited enrichments)** is selected by default. You can use this resource because number of records in HotelReviews-Free.csv is 19 and this free resource allows up to 20 transactions a day.

1. Expand **Add enrichments**.

1. For **Skillset name**, enter `hotel-reviews-ss`.

1. For **Source data field**, select **reviews_text**.

1. For **Enrichment granularity level**, select **Pages (5000 characters chunks)**

1. Select these cognitive skills:
    + **Extract key phrases**
    + **Translate text**
    + **Detect sentiment**

      ![Create a skillset](media/knowledge-store-create-portal/hotel-reviews-ss.png "Create a skillset")

1. Expand **Save enrichments to knowledge store**.

1. Select these **Azure table projections**:
    + **Documents**
    + **Pages**
    + **Key phrases**

1. Enter the **Storage account Connection String** that you saved in a previous step.

    ![Configure knowledge store](media/knowledge-store-create-portal/hotel-reviews-ks.png "Configure knowledge store")

1. Optionally, download a Power BI template. When you access the template from the wizard, the local .pbit file is adapted to reflect the shape of your data.

1. Continue to the next page.

### Step 3: Configure the index

In this wizard step, you will configure an index for optional full-text search queries. The wizard will sample your data source to infer fields and data types. You only need to select the attributes for your desired behavior. For example, the **Retrievable** attribute will allow the search service to return a field value while the **Searchable** will enable full text search on the field.

1. For **Index name**, enter `hotel-reviews-idx`.

1. For attributes, accept the default selections: **Retrievable** and **Searchable** for the new fields that the pipeline is creating.

    Your index should look similar to the following image. Because the list is long, not all fields are visible in the image.

    ![Configure an index](media/knowledge-store-create-portal/hotel-reviews-idx.png "Configure an index")

1. Continue to the next page.

### Step 4: Configure the indexer

In this wizard step, you will configure an indexer that will pull together the data source, skillset, and the index you defined in the previous wizard steps.

1. For **Name**, enter `hotel-reviews-idxr`.

1. For **Schedule**, keep the default **Once**.

1. Click **Submit** to run the indexer. Data extraction, indexing, application of cognitive skills all happen in this step.

## Monitor status

Cognitive skill indexing takes longer to complete than typical text-based indexing. The wizard should open the Indexer list in the overview page so that you can track progress. For self-navigation, go to the Overview page and click **Indexers**.

In the Azure portal, you can also monitor the Notifications activity log for a clickable **Azure Cognitive Search notification** status link. Execution may take several minutes to complete.

## Next steps

Now that you have enriched your data using Cognitive Services and projected the results into a knowledge store, you can use Storage Explorer or Power BI to explore your enriched data set.

You can view content in Storage Explorer, or take it a step further with Power BI to gain insights through visualization.

> [!div class="nextstepaction"]
> [View with Storage Explorer](knowledge-store-view-storage-explorer.md)
> [Connect with Power BI](knowledge-store-connect-power-bi.md)

> [!Tip]
> If you want to repeat this exercise or try a different AI enrichment walkthrough, delete the *hotel-reviews-idxr* indexer. Deleting the indexer resets the free daily transaction counter back to zero for Cognitive Services processing.
