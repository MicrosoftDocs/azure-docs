---
title: 'Connect to knowledge store with Power BI - Azure Search'
description: Create a knowledge store using the Import data wizard in Azure portal, and then connect with Power BI for analysis and exploration.

author: heidisteen
services: search
ms.service: search
ms.subservice: cognitive-search
ms.devlang: NA
ms.topic: tutorial
ms.date: 07/30/2019
ms.author: heidist
 
---
# Create an Azure Search knowledge store and connect using Power BI

> [!Note]
> Knowledge store is in preview and should not be used in production. The [Azure Search REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>

Knowledge store is a feature in Azure Search that persists output from an AI enrichment pipeline for subsequent analysis or other downstream processing. An AI-enriched pipeline accepts image files or unstructured text files from a supported data source, sends it to Azure Search indexing, applies AI enrichments from Cognitive Services (such as image analysis and natural language processing), and then saves results to a knowledge store in Azure storage. From knowledge store, you can attach tools like Power BI or Storage Explorer to explore the results.

In this article, create a knowledge store in the portal, and then connect and explore using Power Query in Power BI Desktop. 

This walkthrough uses a data set consisting of customer reviews and ratings, sentiment scoring from Cognitive Services, and then Power Query to query your documents. The data originates from hotel reviews data on Kaggle.com. 

## Prerequisites

+ [Download hotel reviews CSV file (HotelReviews_Free.csv)](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D). This data set contains records of customer feedback about hotels.

+ [Power BI Desktop](https://powerbi.microsoft.com/downloads/)

+ [Azure Search](search-create-service-portal.md). You can use a free service for this walkthrough. 

+ [Azure Storage](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal). Make sure that the account is "general purpose", either *StorageV2 (general purpose V2)* which is the default, or *Storage (general purpose V1)*. Choose the same region as Azure Search.
 
## Prepare data 

Load the .csv file into Azure Blob storage so that it can be accessed by an Azure Search indexer.

1. [Sign in to the Azure portal](https://portal.azure.com), navigate to your Azure storage account, click **Blobs**, and then click **+ Container**.

1. [Create a Blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) to contain sample data: 

   1. Name the container `hotel-reviews`. 
   
   1. Set the Public Access Level to any of its valid values. We used the default.

1. After the container is created, open it and select **Upload** on the command bar.

1. Navigate to the folder containing the **HotelReviews-Free.csv**, select the file, and click **Upload**.

   ![Upload the .csv file](media/knowledge-store-howto-powerbi/hotel-reviews-blob-container.png "Upload the .csv file")

1. While you are in Azure storage, get the connection string and container name.  You will need both of these strings when creating a data source object:

   1. In the overview page, click **Access Keys** and copy a *connection string*. It starts with `DefaultEndpointsProtocol=https;` and concludes with `EndpointSuffix=core.windows.net`. Your account name and key are in between. 

   1. The container name should be `hotel-reviews` or whatever name you assigned. 

## Create and run AI enrichments

Use the Import Data wizard to create the knowledge store. You will import the data set, choose enrichments, configure a knowledge store and an index, and then execute.

1. [Find your search service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) on Azure portal.

1. Click **Import data** on the command bar.

1. Create the data source object in the first page of the wizard.

   - Select **Azure Blob Storage**.

   - Give the data source a name, such as *hotel-reviews-ds*.

   - Because the data is .csv, select **Delimited text** for Parsing mode, select the **First Line Contains Header**, and make sure the delimiter character is a comma.

   - Connection string to your Azure Storage account can be obtained in the portal, under **Access keys**.

   - Container name can also be obtained from the portal in your Azure Storage Blobs list.

      ![Create a data source object](media/knowledge-store-howto-powerbi/hotel-reviews-ds.png "Create a data source object")

1. Add enrichments and configure a knowledge store in the second page of the wizard.

   - In **Attach Cognitive Services**, you can use the Free resource that allows up to 20 transactions a day. The number of records in HotelReviews-Free.csv is less than 20.

   - In **Add Enrichments**, name the skillset *hotel-reviews-ss*, choose the *reviews_text* field, choose a granularity level of *Pages (5000 characters chunks)*, and then select these three cognitive skills: *Extract key phrases*, *Detect language*, *Detect sentiment*.

      ![Create a skillset](media/knowledge-store-howto-powerbi/hotel-reviews-ss.png "Create a skillset")

   - In **Save enrichments to knowledge store**, provide the connection string to your general-purpose Azure Storage account. A knowledge store is created in Azure Table storage when you select the *Azure table projects* options in this section.

      ![Configure knowledge store](media/knowledge-store-howto-powerbi/hotel-reviews-ks.png "Configure knowledge store")
   
   Click **Next: Customize target index** to continue to the next step.

1. Configure an index for optional full-text search queries in Azure Search. Although the focus of this walkthrough is Power BI connected to Azure Table storage, the **Import data** wizard can also create an index used for full-text search in Azure Search. 

   The wizard samples your data source to infer fields and data types, so all you need to do is select the necessary attributes to achieve the behaviors want. For example, *Retrievable* means that the field content can be retrieved from the service, while *Searchable* enables full text search on selected fields.

   - Give the index a name, such as *hotel-reviews-idx*.
   - Set all fields as **Retrievable**.
   - Set *city*, *name*, *reviews_text*, *language*, *keyphrases* as **Searchable**.
   - Set *sentiment*, *language*, *keyphrases* as **Filterable** and **Facetable**. 
   
    Your index should look similar to the following image.

     ![Configure an index](media/knowledge-store-howto-powerbi/hotel-reviews-idx.png "Configure an index")

   Click **Next: Create an indexer** to continue to the next step.

1. Configure an indexer by giving it a name and execution cadence. For this walkthrough, use *hotel-reviews-idxr* as the indexer name, and use the default **Once** schedule to run the indexer immediately.

   Indexer execution puts all of the previous configurations in motion. Extraction, processing, and ingesting all happens here in this step.

1. Monitor indexing in the Notifications queue in the portal. Execution takes several minutes to complete.

## Connect with Power BI

1. Start Power BI Desktop and select **Get Data**.

1. In Get Data, select **Azure** and then **Azure Table Storage**. Click **Connect**.

1. In Account Name or URL, paste in your Azure Storage account name (the full URL is resolved for you).

1. Enter the Account Key.

1. Select Document, KeyPhrases, and Pages. These are the tables created by Import data wizard when you select the same-named items in knowledge store configuration. Click **Load**.

1. Open Power Query by clicking the **Edit Queries** command.

   ![Open Power Query](media/knowledge-store-howto-powerbi/powerbi-edit-queries.png "Open Power Query")

1. For Documents:

   - Remove the PartitionKey, RowKey, and Timestamp columns created by Azure Table storage. Knowledge store provides relationships used in this analysis.

   - Expand the content column.

     ![Edit tables](media/knowledge-store-howto-powerbi/powerbi-edit-table.png "Edit tables")

1. Select all of the fields and then deselect those starting with "metadata".

1. Correct the data type for the following columns using ABC-123 icon on each column:

   - Date columns should be **DateTime**
   - *Latitude* should be **Decimal Number**
   - *Longitude* should be **Decimal Number**

1. Repeat the previous steps for KeyPhrases, removing PartitionKey and other columns, expanding content columns, setting *SentimentScore* to **Decimal Number**.

1. Repeat again for Pages, removing PartitionKey and other columns, expanding content columns. There are no data type modifications for this table.

1. Click **Close and Apply** on the far left of the Power Query command bar.

1. Validate that Power BI recognizes the relationships that knowledge store created within your data. Click on the relationships tile on the left navigation pane. All three tables should be related. Edit the relationships and ensure that the "Cross-filter direction" is set to both, this will ensure that all your visuals refresh when a filter is applied.

   ![Validate relationships](media/knowledge-store-howto-powerbi/powerbi-relationships.png "Validate relationships")

## Try with larger data sets

We purposely kept the data set small to avoid charges for a demo walkthrough. For a more realistic experience, you can create and then attach a billable Cognitive Services resource to enable a larger number of transactions against the sentiment analyzer, keyphrase extraction, and language detector skills.

Create new containers in Azure Blob storage and upload each CSV file to its own container. Specify one of these containers in the data source creation step in Import data wizard.

| Description | Link |
|-------------|------|
| Free tier   | [HotelReviews_Free.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D) |
| Small (500 Records) | [HotelReviews_Small.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Small.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D) |
| Medium (6000 Records)| [HotelReviews_Medium.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Medium.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D)
| Large (Full dataset 35000 Records) | [HotelReviews_Large.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Large.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D). Be aware that very large data sets are expensive to process. This one costs roughly $1000 U.S dollars.|

In the enrichment step of the wizard, attach a billable [Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) resource, created at the *S0* tier, in the same region as Azure Search to use larger data sets. 

  ![Create a Cognitive Services resource](media/knowledge-store-howto-powerbi/create-cognitive-service.png "Create a Cognitive Services resource")

## Next steps

If you want to repeat this exercise or do another AI enrichment walkthrough, delete the *hotel-reviews-idx* indexer that you just created. Deleting the indexer resets the free daily transaction counter  back to zero. 

For more step-by-step walkthroughs demonstrating knowledge store, continue with the next article that shows you how to create a knowledge store using REST APIs and Postman.

> [!div class="nextstepaction"]
> [Get started with knowledge store](knowledge-store-howto.md)
