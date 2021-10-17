---
title: View a knowledge store with Storage Explorer
titleSuffix: Azure Cognitive Search
description: View and analyze an Azure Cognitive Search knowledge store with the Azure portal's Storage Explorer.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/15/2021
---

# View a knowledge store with Storage Explorer

A [knowledge store](knowledge-store-concept-intro.md) is content created by an Azure Cognitive Search skillset and saved to Azure Storage. In this article, you'll learn how to view the contents of a knowledge store using Storage Explorer in the Azure portal.

Start with an existing knowledge store created in the [Azure portal](knowledge-store-create-portal.md) or using the [REST APIs](knowledge-store-create-rest.md). Both the portal and REST walkthroughs create a knowledge store in Azure Table Storage.

## Start Storage Explorer

1. In the Azure portal, [open the Storage account](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) that you used to create the knowledge store.

1. In the storage account's left navigation pane, select **Storage Explorer**.

## View, edit, and query tables

1. Expand the **TABLES** list to show a list of Azure table projections that were created when you created the knowledge store. If you used the quickstart or REST article to create the knowledge store, the tables will contain content related to customer reviews of a European hotel.

1. Select a table from the list.

   ![View tables in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-tables.png "View tables in Storage Explorer")

1. To change the data type, property name, or individual data values in your table, click **Edit**.

   ![Edit table in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-edit-table.png "Edit table in Storage Explorer")

1. To run queries, select **Query** on the command bar and enter your conditions.

   ![Query table in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-query-table.png "Query table in Storage Explorer")

In Storage Explorer, you can only query one table at time using [supported query syntax](/rest/api/storageservices/Querying-Tables-and-Entities). To query across tables, consider using Power BI instead.

## Next steps

Connect this knowledge store to Power BI to build visualizations that include multiple tables.

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)
