---
title: 'Create a knowledge store in the Azure portal - Azure Search'
description: Create an Azure Search knowledge store for persisting enrichments from cognitive search pipeline, using the Import data wizard in the Azure portal.

author: lisaleib
services: search
ms.service: search
ms.subservice: cognitive-search
ms.topic: tutorial
ms.date: 09/03/2019
ms.author: v-lilei
 
---
# Create an Azure Search knowledge store

> [!Note]
> Knowledge store is in preview and should not be used in production. The [Azure Search REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>

Knowledge store is a feature in Azure Search that persists output from an AI enrichment pipeline for later analysis or other downstream processing. An AI-enriched pipeline accepts image files or unstructured text files, indexes them using Azure Search, applies AI enrichments from Cognitive Services (such as image analysis and natural language processing), and then saves results to a knowledge store in Azure storage. You can then use tools like Power BI or Storage Explorer to explore the knowledge store.

In this article, you will use the Import Data wizard on the Azure portal to ingest, index, and apply AI enrichments to a set of hotel reviews. The hotel reviews are imported into Azure Blog Storage and the results are saved as a knowledge store in Azure Table Storage.

After you create the knowledge store, you can learn how to access this knowledge store using Storage Explorer or Power BI.

## Prerequisites

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial.

+ [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample data and the knowledge store. Your storage account must use the same location (such as US-WEas your Azure Search service, and the *Account kind* must be *StorageV2 (general purpose V2)* (default) or *Storage (general purpose V1)*.

## Load the data

Load the hotel reviews CSV file into Azure Blob storage so it can be accessed by an Azure Search indexer and fed through the AI enrichment pipeline.

### Create an Azure Blob container with the data

1. [Download the hotel review data saved in a CSV file (HotelReviews_Free.csv)](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D). This data originates from Kaggle.com and contains customer feedback about hotels.
1. [Sign in to the Azure portal](https://portal.azure.com), and navigate to your Azure storage account.
1. [Create a Blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) To do this, in the left navigation bar for your storage account, click **Blobs**, and then click **+ Container** on the command bar.
1. For the new container **Name**, enter `hotel-reviews`.
1. Select any **Public Access Level**. We used the default.
1. Click **OK** to create the Azure Blob container.
1. Open the new `hotels-review` container, click **Upload**, and  select the **HotelReviews-Free.csv** file you downloaded in the first step.

    ![Upload the data](media/knowledge-store-create-portal/upload-command-bar.png "Upload the hotel reviews")

1. Click **Upload** to import the CSV file into Azure Blob Storage. The new container will appear.

    ![Create the Azure Blob container](media/knowledge-store-create-portal/hotel-reviews-blob-container.png "Create the Azure Blob container")

### Get the Azure Storage account connection string

1. On the portal, navigate to your Azure Storage account.
1. In the left navigation for the service,  click **Access keys**.
1. Under **key 1**, copy and save the *Connection string*. The string starts with `DefaultEndpointsProtocol=https`. Your storage account name and key are embedded in the string. Keep this string handy. You will need it in future steps.

## Create and run AI enrichments

Use the Import Data wizard to create the knowledge store. You will create a data source, choose enrichments, configure a knowledge store and an index, and then execute.

### Start the Import data wizard

1. On the Azure portal, [Find your search service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices).

1. On the command bar, click **Import data** to start the import wizard.

### Connect to your data (Import data wizard)

In this wizard step, you will create a data source from the Azure Blob with your hotels data.

1. In the **Data Source** list, select **Azure Blob Storage**.
1. For the **Name**, enter `hotel-reviews-ds`.
1. For **Parsing mode**, select **Delimited text**, and then select the **First Line Contains Header** checkbox. Make sure the **Delimiter character** is a comma (,).
1. Enter your storage service **Connection String** that you saved in a previous step.
1. For **Container name**, enter `hotel-reviews`.
1. Click **Next: Add cognitive search (Optional)**.

      ![Create a data source object](media/knowledge-store-create-portal/hotel-reviews-ds.png "Create a data source object")

## Add cognitive search (Import data wizard)

In this wizard step, you will create a skillset with cognitive skill enrichments. The skills we use in this sample will extract key phrases and detect the language and sentiment. These enrichments will be "projected" into a knowledge store as Azure tables.

1. Expand **Attach Cognitive Services**. **Free (Limited enrichments)** is selected by default. You can use this resource because number of records in HotelReviews-Free.csv is 19 and this free resource allows up to 20 transactions a day.
1. Expand **Add Enrichments**.
1. For **Skillset name**, enter `hotel-reviews-ss`.
1. For **Source data field**, select **reviews_text*.
1. For **Enrichment granularity level**, select **Pages (5000 characters chunks)**
1. Select these cognitive skills:
    + **Extract key phrases**
    + **Detect language**
    + **Detect sentiment**

      ![Create a skillset](media/knowledge-store-create-portal/hotel-reviews-ss.png "Create a skillset")

1. Expand **Save enrichments to knowledge store**
1. Enter the **Storage account Connection String** that you saved in a previous step.
1. Select these **Azure table projections**:
    + **Documents**
    + **Pages**
    + **Key phrases**

    ![Configure knowledge store](media/knowledge-store-create-portal/hotel-reviews-ks.png "Configure knowledge store")

1. Click **Next: Customize target index**.

### Import data (Import data wizard)

In this wizard step, you will configure an index for optional full-text search queries. The wizard will sample your data source to infer fields and data types. You only need to select the attributes for your desired behavior. For example, the **Retrievable** attribute will allow the search service to return a field value while the **Searchable** will enable full text search on the field.

1. For **Index name**, enter `hotel-reviews-idx`*`.
1. For attributes, make these selections:
    + Select **Retrievable** for all fields.
    + Select **Filterable** and **Facetable** for these fields: *Sentiment*, *Language*, *Keyphrases*
    + Select **Searchable** for these fields: *city*, *name*, *reviews_text*, *language*, *Keyphrases*

    Your index should look similar to the following image. Because the list is long, not all fields are visible in the image.

    ![Configure an index](media/knowledge-store-create-portal/hotel-reviews-idx.png "Configure an index")

1. Click **Next: Create an indexer**.

### Create an indexer

In this wizard step, you will configure an indexer that will pull together the data source, skillset, and the index you defined in the previous wizard steps.

1. For **Name**, enter `hotel-reviews-idxr`.
1. For **Schedule**, keep the default **Once**.
1. Click **Submit** to run the indexer. Data extraction, indexing, application of cognitive skills all happen in this step.

### Monitor the Notifications queue for status

1. In the Azure portal, monitor the Notifications activity log for a clickable **Azure Search notification** status link. Execution may take several minutes to complete.

## Next steps

Now that you have enriched your data using cognitive services and projected the results into a knowledge store, you can use Storage Explorer or Power BI to explore your enriched data set.

To learn how to explore this knowledge store using Storage Explorer, see the following walkthrough.

> [!div class="nextstepaction"]
> [View with Storage Explorer](knowledge-store-view-storage-explorer.md)

To learn how to connect this knowledge store to Power BI, see the following walkthrough.

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)

If you want to repeat this exercise or try a different AI enrichment walkthrough, delete the *hotel-reviews-idx* indexer. Deleting the indexer resets the free daily transaction counter back to zero.
