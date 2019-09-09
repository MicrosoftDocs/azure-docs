---
title: 'Connect to a knowledge store with Storage Explorer'
description: 

author: lisaleib
services: search
ms.service: search
ms.subservice: cognitive-search
ms.topic: tutorial
ms.date: 09/03/2019
ms.author: v-lilei
 
---
# Connect a knowledge store to Storage Explorer

> [!Note]
> Knowledge store is in preview and should not be used in production. The [Azure Search REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>
In this article, you'll learn how to connect and explore a knowledge store using Storage Explorer in the Azure Portal. To create the knowledge store sample used in this walkthrough see [How to create a knowledge store](knowledge-store-howto-create).

## Prerequisites

+ Follow the steps in [How to create a knowledge store](knowledge-store-howto-create) to create the sample knowledge store used in this walkthrough. You will also need the name of the Azure storage account that you used to create the knowledge store, along with its access key from the Azure portal.

## Connect with Azure Storage

1. In the Azure Portal, open the storage account that you used to create the knowledge store.

1. In the storage account's left navigation pane, click **Storage Explorer**.

1. Expand the **TABLES** list to show a list of Azure table projections that were created when you ran the **Import Data** wizard on your hotel reviews sample data.

Select any table to view the enriched data, including key phrases sentiment scores, latitude and longitude location data and more.

To change the data type for any table value, click **Edit**. 

To run queries, click **Query** on the command bar and enter your conditions.  



## Clean up

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

To learn how to create a knowledge store using the REST APIs and Postman, see the following article.  

> [!div class="nextstepaction"]
> [How to create a knowledge store using REST](knowledge-store-howto.md)
