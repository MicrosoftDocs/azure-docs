---
title: Azure SQL Managed Instance connection for search indexing
titleSuffix: Azure Cognitive Search
description: Enable public endpoint to allow connections to SQL Managed Instances from an indexer on Azure Cognitive Search.

manager: nitinme
author: vl8163264128
ms.author: victliu
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Configure a connection from an Azure Cognitive Search indexer to SQL Managed Instance

As noted in [Connecting Azure SQL Database to Azure Cognitive Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#faq), creating indexers against **SQL Managed Instances** is supported by Azure Cognitive Search through the public endpoint.

## Create Azure SQL Managed Instance with public endpoint
Create a SQL Managed Instance with the **Enable public endpoint** option selected.

   ![Enable public endpoint](media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers/enable-public-endpoint.png "Enable public endpoint")

## Enable Azure SQL Managed Instance public endpoint
You can also enable public endpoint on an existing SQL Managed Instance under **Security** > **Virtual network** > **Public endpoint** > **Enable**.

   ![Enable public endpoint](media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers/mi-vnet.png "Enable public endpoint")

## Verify NSG rules
Check the Network Security Group has the correct **Inbound security rules** that allow connections from Azure services.

   ![NSG Inbound security rule](media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers/nsg-rule.png "NSG Inbound security rule")

## Get public endpoint connection string
Make sure you use the connection string for the **public endpoint** (port 3342, not port 1433).

   ![Public endpoint connection string](media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers/mi-connection-string.png "Public endpoint connection string")

## Next steps
With configuration out of the way, you can now specify a SQL Managed Instance as the data source for an Azure Cognitive Search indexer using either the portal or REST API. See [Connecting Azure SQL Database to Azure Cognitive Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) for more information.
