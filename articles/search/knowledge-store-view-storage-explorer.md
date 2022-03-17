---
title: View a knowledge store
titleSuffix: Azure Cognitive Search
description: View a knowledge store using the Storage Browser in the Azure portal.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/03/2021
---

# View a knowledge store with Storage Browser

A [knowledge store](knowledge-store-concept-intro.md) is content created by an Azure Cognitive Search skillset and saved to Azure Storage. In this article, you'll learn how to view the contents of a knowledge store using Storage Browser in the Azure portal.

Start with an existing knowledge store created in the [Azure portal](knowledge-store-create-portal.md) or using the [REST APIs](knowledge-store-create-rest.md). Both the portal and REST walkthroughs create a knowledge store in Azure Table Storage.

## Start Storage Browser

1. In the Azure portal, [open the Storage account](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) that you used to create the knowledge store.

1. In the storage account's left navigation pane, select **Storage Browser**.

## View and edit tables

1. Expand **Tables** to find the table projections of your knowledge store. If you used the quickstart or REST article to create the knowledge store, the tables will contain content related to customer reviews of a European hotel.

   :::image type="content" source="media/knowledge-store-concept-intro/kstore-in-storage-explorer.png" alt-text="Screenshot of Storage Browser" border="true":::

1. Select a table from the list to views it's contents.

1. To rearrange column order or delete a column, select **Edit columns** at the top of the page.

In Storage Browser, you can only query one table at time using [supported query syntax](/rest/api/storageservices/Querying-Tables-and-Entities). To query across tables, consider using Power BI instead.

## Next steps

Connect this knowledge store to Power BI to build visualizations that include multiple tables.

> [!div class="nextstepaction"]
> [Connect with Power BI](knowledge-store-connect-power-bi.md)
