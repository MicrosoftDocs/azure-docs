---
title: View a knowledge store with Storage Explorer
titleSuffix: Azure Cognitive Search
description: View and analyze an Azure Cognitive Search knowledge store with the Azure portal's Storage Explorer.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/30/2021
---

# View a knowledge store with Storage Explorer

A [knowledge store](knowledge-store-concept-intro.md) is created by a skillset and saved to Azure Storage. In this article, you'll learn how to view the content of a knowledge store using Storage Explorer in the Azure portal.

## Prerequisites

+ Create a knowledge store in [Azure portal](knowledge-store-create-portal.md) or [Postman and the REST APIs](knowledge-store-create-rest.md).

+ You will also need the name of the Azure Storage account that has the knowledge store, along with its access key from the Azure portal.

## Start Storage Explorer

1. In the Azure portal, [open the Storage account](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) that you used to create the knowledge store.

1. In the storage account's left navigation pane, click **Storage Explorer**.

## View, edit, and query tables

Both the portal and REST walkthroughs create a knowledge store in Table Storage.

1. Expand the **TABLES** list to show a list of Azure table projections that were created when you created the knowledge store. The tables should contain content related to hotel reviews.

1. Select any table to view the enriched data, including key phrases and sentiment scores.

   ![View tables in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-tables.png "View tables in Storage Explorer")

1. To change the data type for any table value or to change individual values in your table, click **Edit**. When you change the data type for any column in one table row, it will be applied to all rows.

   ![Edit table in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-edit-table.png "Edit table in Storage Explorer")

1. To run queries, click **Query** on the command bar and enter your conditions.  

   ![Query table in Storage Explorer](media/knowledge-store-view-storage-explorer/storage-explorer-query-table.png "Query table in Storage Explorer")

## Next steps

Connect this knowledge store to Power BI for deeper analysis, or move forward with code, using the REST API and Postman to create a different knowledge store.

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)
> [Create a knowledge store in Azure portal](knowledge-store-create-portal.md)
> [Create a knowledge store in REST](knowledge-store-create-rest.md)
