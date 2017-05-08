---
title: Azure Cosmos DB global database replication | Microsoft Docs
description: Learn how to manage the global replication of your Azure Cosmos DB account via the Azure portal.
services: cosmosdb
keywords: global database, replication
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: cgronlun

ms.assetid: 8b815047-2868-4b10-af1d-40a1af419a70
ms.service: cosmosdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/14/2017
ms.author: mimig

---
# How to perform global database replication using the Azure portal

Learn how to use the Azure portal to replicate data in multiple regions for global availability of data in Azure Cosmos DB.

[!INCLUDE [cosmosdb-tutorial-global-distribution-portal](../../includes/cosmosdb-tutorial-global-distribution-portal.md)]

## <a id="next"></a>Next steps
Learn how to manage the consistency of your globally replicated account by reading [Consistency levels in Azure Cosmos DB](documentdb-consistency-levels.md).

For information about how global database replication works in Cosmos DB, see [Distribute data globally with Azure Cosmos DB](documentdb-distribute-data-globally.md). For information about programmatically replicating data in multiple regions, see [Developing with multi-region Azure Cosmos DB accounts](../cosmos-db/tutorial-global-distribution-documentdb.md).

<!--Image references-->
[1]: ./media/documentdb-portal-global-replication/documentdb-add-region.png
[2]: ./media/documentdb-portal-global-replication/documentdb_change_write_region-1.png
[3]: ./media/documentdb-portal-global-replication/documentdb_change_write_region-2.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[azureregions]: https://azure.microsoft.com/regions/#services
[offers]: https://azure.microsoft.com/pricing/details/documentdb/
