---
title: Connect to a knowledge store (preview) with Power BI
titleSuffix: Azure Cognitive Search
description: Connect an Azure Cognitive Search knowledge store (preview) with Power BI for analysis and exploration.

author: HeidiSteen
ms.author: heidist
manager: nitinme
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/05/2020
---

# Connect a knowledge store with Power BI

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides preview features. There is currently limited portal support, and no .NET SDK support.

In this article, learn how to connect to and explore a knowledge store using Power Query in the Power BI Desktop app. You can get started faster with templates, or build a custom dashboard from scratch. This brief video below demonstrates how you can enrich your experience with your data by using Azure Cognitive Search in combination with Power BI.


> [!VIDEO https://www.youtube.com/embed/XWzLBP8iWqg?version=3&start=593&end=663]



+ Follow the steps in [Create a knowledge store in the Azure portal](knowledge-store-create-portal.md) or [Create an Azure Cognitive Search knowledge store by using REST](knowledge-store-create-rest.md) to create the sample knowledge store used in this walkthrough. You will also need the name of the Azure Storage account that you used to create the knowledge store, along with its access key from the Azure portal.

+ [Install Power BI Desktop](https://powerbi.microsoft.com/downloads/)

## Sample Power BI template - Azure portal only

When creating a [knowledge store using the Azure portal](knowledge-store-create-portal.md), you have the option of downloading a [Power BI template](https://github.com/Azure-Samples/cognitive-search-templates) on the second page of the **Import data** wizard. This template gives you several visualizations, such as WordCloud and Network Navigator, for text-based content. 

Click **Get Power BI Template** on the **Add cognitive skills** page to retrieve and download the template from its public GitHub location. The wizard modifies the template to accommodate the shape of your data, as captured in the knowledge store projections specified in the wizard. For this reason, the template you download will vary each time you run the wizard, assuming different data inputs and skill selections.

![Sample Azure Cognitive Search Power BI Template](media/knowledge-store-connect-power-bi/powerbi-sample-template-portal-only.png "Sample Power BI template")

> [!NOTE]
> Although the template is downloaded while the wizard is in mid-flight, you'll have to wait until the knowledge store is actually created in Azure Table storage before you can use it.

## Connect with Power BI

1. Start Power BI Desktop and click **Get data**.

1. In the **Get Data** window, select **Azure**, and then select **Azure Table Storage**.

1. Click **Connect**.

1. For **Account Name or URL**, enter in your Azure Storage account name (the full URL will be created for you).

1. If prompted, enter the storage account key.

1. Select the tables containing the hotel reviews data created by the previous walkthroughs. 

   + For the portal walkthrough, table names are *hotelReviewsSsDocument*, *hotelReviewsSsEntities*, *hotelReviewsSsKeyPhrases*, and *hotelReviewsSsPages*. 
   
   + For the REST walkthrough, table names are *hotelReviewsDocument*, *hotelReviewsPages*, *hotelReviewsKeyPhrases*, and *hotelReviewsSentiment*.

1. Click **Load**.

1. On the top ribbon, click **Edit Queries** to open the **Power Query Editor**.

   ![Open Power Query](media/knowledge-store-connect-power-bi/powerbi-edit-queries.png "Open Power Query")

1. Select *hotelReviewsSsDocument*, and then remove the *PartitionKey*, *RowKey*, and *Timestamp* columns. 
   ![Edit tables](media/knowledge-store-connect-power-bi/powerbi-edit-table.png "Edit tables")

1. Click the icon with opposing arrows at the upper right side of the table to expand the *Content*. When the list of columns appears, select all columns, and then deselect columns that start with 'metadata'. Click **OK** to show the selected columns.

   ![Edit tables](media/knowledge-store-connect-power-bi/powerbi-expand-content-table.png "Expand content")

1. Change the data type for the following columns by clicking the  ABC-123 icon at the top left of the column.

   + For *content.latitude* and *Content.longitude*, select **Decimal Number**.
   + For *Content.reviews_date* and *Content.reviews_dateAdded*,  select **Date/Time**.

   ![Change data types](media/knowledge-store-connect-power-bi/powerbi-change-type.png "Change data types")

1. Select *hotelReviewsSsPages*, and then repeat steps 9 and 10 to delete the columns and expand the *Content*.
1. Change the data type for *Content.SentimentScore* to **Decimal Number**.
1. Select *hotelReviewsSsKeyPhrases* and repeat steps 9 and 10 to delete the columns and expand the *Content*. There are no data type modifications for this table.

1. On the command bar, click **Close and Apply**.

1. Click on the Model tile on the left navigation pane and validate that Power BI shows relationships between all three tables.

   ![Validate relationships](media/knowledge-store-connect-power-bi/powerbi-relationships.png "Validate relationships")

1. Double-click each relationship and make sure that the **Cross-filter direction** is set to **Both**.  This enables your visuals to refresh when a filter is applied.

1. Click on the Report tile on the left navigation pane to explore data through visualizations. For text fields, tables and cards are useful visualizations. You can choose fields from each of the three tables to fill in the table or card. 

<!-- ## Try with larger data sets

We purposely kept the data set small to avoid charges for a demo walkthrough. For a more realistic experience, you can create and then attach a billable Cognitive Services resource to enable a larger number of transactions against the sentiment analyzer, keyphrase extraction, and language detector skills.

Create new containers in Azure Blob storage and upload each CSV file to its own container. Specify one of these containers in the data source creation step in Import data wizard.

| Description | Link |
|-------------|------|
| Free tier   | [HotelReviews_Free.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Free.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D) |
| Small (500 Records) | [HotelReviews_Small.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Small.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D) |
| Medium (6000 Records)| [HotelReviews_Medium.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Medium.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D)
| Large (Full dataset 35000 Records) | [HotelReviews_Large.csv](https://knowledgestoredemo.blob.core.windows.net/hotel-reviews/HotelReviews_Large.csv?st=2019-07-29T17%3A51%3A30Z&se=2021-07-30T17%3A51%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=LnWLXqFkPNeuuMgnohiz3jfW4ijePeT5m2SiQDdwDaQ%3D). Be aware that very large data sets are expensive to process. This one costs roughly $1000 U.S dollars.|

In the enrichment step of the wizard, attach a billable [Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) resource, created at the *S0* tier, in the same region as Azure Cognitive Search to use larger data sets. 

  ![Create a Cognitive Services resource](media/knowledge-store-connect-power-bi/create-cognitive-service.png "Create a Cognitive Services resource") -->

## Clean up

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

To learn how to explore this knowledge store using Storage Explorer, see the following article.

> [!div class="nextstepaction"]
> [View with Storage Explorer](knowledge-store-view-storage-explorer.md)