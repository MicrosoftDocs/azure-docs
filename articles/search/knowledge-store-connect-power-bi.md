---
title: Connect to a knowledge store with Power BI
titleSuffix: Azure Cognitive Search
description: Connect an Azure Cognitive Search knowledge store with Power BI for analysis and exploration.

author: HeidiSteen
ms.author: heidist
manager: nitinme
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/07/2021
---

# Connect a knowledge store with Power BI

In this article, learn how to connect to and explore a knowledge store using Power Query in the Power BI Desktop app. You can get started faster with templates, or build a custom dashboard from scratch.

A knowledge store composed of tables in Azure Storage works best in Power BI. If the tables contain projections from the same skillset and projection group, you can easily build table visualizations that combine fields from related tables.

To follow the steps in this article, use the hotel-reviews sample data and [create a knowledge store in the Azure portal](knowledge-store-create-portal.md) or use the [REST APIs](knowledge-store-create-rest.md). 

If necessary, [install Power BI Desktop](https://powerbi.microsoft.com/downloads/).

For a demonstration of the techniques in this article, the following video segment shows you how.

> [!VIDEO https://www.youtube.com/embed/XWzLBP8iWqg?version=3&start=593&end=663]

## Connect with Power BI

1. Start Power BI Desktop and select **Get data**.

1. In the **Get Data** window, select **Azure**, and then select **Azure Table Storage**.

1. Select **Connect**.

1. For **Account Name or URL**, enter in your Azure Storage account name (the full URL will be created for you).

1. If prompted, enter the storage account key.

1. Select the checkbox next to all of the tables that were created from the same skillset, and then select **Load**.

   ![Load tables](media/knowledge-store-connect-power-bi/power-bi-load-tables.png "Load tables")

1. On the top ribbon, select **Transform Data** to open the **Power Query Editor**.

   ![Open Power Query](media/knowledge-store-connect-power-bi/powerbi-edit-queries.png "Open Power Query")

1. Select *hotelReviewsSsDocument*, and then remove the *PartitionKey*, *RowKey*, and *Timestamp* columns. 

   ![Edit tables](media/knowledge-store-connect-power-bi/powerbi-edit-table.png "Edit tables")

1. Click the icon with opposing arrows at the upper right side of the table to expand the *Content*. When the list of columns appears, select all columns, and then deselect columns that start with 'metadata'. Click **OK** to show the selected columns.

   ![Expand content](media/knowledge-store-connect-power-bi/powerbi-expand-content-table.png "Expand content")

1. Change the data type for the following columns by clicking the  ABC-123 icon at the top left of the column.

   + For *content.latitude* and *Content.longitude*, select **Decimal Number**.
   + For *Content.reviews_date* and *Content.reviews_dateAdded*,  select **Date/Time**.

   ![Change data types](media/knowledge-store-connect-power-bi/powerbi-change-type.png "Change data types")

1. Select *hotelReviewsSsPages*, and then repeat steps 9 and 10 to delete the columns and expand the *Content*.

1. Select *hotelReviewsSsKeyPhrases* and repeat steps 9 and 10 to delete the columns and expand the *Content*. There are no data type modifications for this table.

1. On the command bar, click **Close and Apply**.

1. Click on the Model tile on the left navigation pane and validate that Power BI shows relationships between all three tables.

   ![Validate relationships](media/knowledge-store-connect-power-bi/powerbi-relationships.png "Validate relationships")

1. Double-click each relationship and make sure that the **Cross-filter direction** is set to **Both**.  This enables your visuals to refresh when a filter is applied.

1. Click on the Report tile on the left navigation pane to explore data through visualizations. For text fields, tables and cards are useful visualizations. You can choose fields from each of the three tables to fill in the table or card.

   ![Build a table report](media/knowledge-store-connect-power-bi/power-bi-table-report.png "Build a table report")

## Sample Power BI template - Azure portal only

When creating a [knowledge store using the Azure portal](knowledge-store-create-portal.md), you have the option of downloading a [Power BI template](https://github.com/Azure-Samples/cognitive-search-templates) on the second page of the **Import data** wizard. This template gives you several visualizations, such as WordCloud and Network Navigator, for text-based content. 

Click **Get Power BI Template** on the **Add cognitive skills** page to retrieve and download the template from its public GitHub location. The wizard modifies the template to accommodate the shape of your data, as captured in the knowledge store projections specified in the wizard. For this reason, the template you download will vary each time you run the wizard, assuming different data inputs and skill selections.

![Sample Azure Cognitive Search Power BI Template](media/knowledge-store-connect-power-bi/powerbi-sample-template-portal-only.png "Sample Power BI template")

> [!NOTE]
> The template is downloaded while the wizard is in mid-flight. You'll have to wait until the knowledge store is actually created in Azure Table Storage before you can use it.

## Next steps

To learn how to explore this knowledge store using Storage Explorer, see the following article.

> [!div class="nextstepaction"]
> [Tables in Power BI reports and dashboards](/power-bi/visuals/power-bi-visualization-tables)