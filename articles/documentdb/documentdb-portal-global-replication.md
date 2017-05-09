---
title: DocumentDB global database replication | Microsoft Docs
description: Learn how to manage the global replication of your DocumentDB account via the Azure portal.
services: documentdb
keywords: global database, replication
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: cgronlun

ms.assetid: 8b815047-2868-4b10-af1d-40a1af419a70
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/14/2017
ms.author: mimig

---
# How to perform global database replication using the Azure portal

Learn how to use the Azure portal to replicate data in multiple regions for global availability of data in Azure DocumentDB and API for MongoDB.

For information about how global database replication works in DocumentDB, see [Distribute data globally with DocumentDB](documentdb-distribute-data-globally.md). For information about performing global database replication programmatically, see [Developing with multi-region DocumentDB accounts](documentdb-developing-with-multiple-regions.md).

## <a id="addregion"></a>Add global database regions
DocumentDB is available in most [Azure regions][azureregions]. After selecting the default consistency level for your database account, you can associate one or more regions (depending on your choice of default consistency level and global distribution needs).

1. In the [Azure portal](https://portal.azure.com/), in the left bar, click **NoSQL (DocumentDB)**.
2. In the **NoSQL (DocumentDB)** blade, select the database account to modify.
3. In the account blade, click **Replicate data globally** from the menu.
4. In the **Replicate data globally** blade, select the regions to add or remove, and then click **Save**. There is a cost to adding regions, see the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/) or the [Distribute data globally with DocumentDB](documentdb-distribute-data-globally.md) article for more information.
   
    ![Click the regions in the map to add or remove them][1]
    
Once you add a second region, the **Manual Failover** option is enabled on the **Replicate data locally** blade in the portal. You can use this option to test the failover process. Once you add a third region, the **Failover Priorities** option is enabled on the same blade so that you can change the failover order for reads.  

### Selecting global database regions
When configuring two or more regions, it is recommended that regions are selected based on the region pairs described in the [Business continuity and disaster recovery (BCDR): Azure Paired Regions][bcdr] article.

Specifically, when configuring to multiple regions, make sure to select the same number of regions (+/-1 for odd/even) from each of the paired region columns. For example, if you want to deploy to four US regions, you select two US regions from the left column and two from the right. So, the following would be an appropriate set: West US, East US, North Central US, and South Central US.

This guidance is important to follow when only two regions are configured for disaster recovery scenarios. For more than two regions, following this guidance is good practice, but not critical as long as some of the selected regions adhere to this pairing.

<!---
## <a id="selectwriteregion"></a>Select the write region

While all regions associated with your DocumentDB database account can serve reads (both, single item as well as multi-item paginated reads) and queries, only one region can actively receive the write (insert, upsert, replace, delete) requests. To set the active write region, do the following  


1. In the **NoSQL (DocumentDB)** blade, select the database account to modify.
2. In the account blade, if the **All Settings** blade is not already opened, click **All Settings**.
3. In the **All Settings** blade, click **Write Region Priority**.
    ![Change the write region under DocumentDB Account > Settings > Add/Remove Regions][2]
4. Click and drag regions to order the list of regions. The first region in the list of regions is the active write region.
    ![Change the write region by reordering the region list under DocumentDB Account > Settings > Change Write Regions][3]
-->

### Verifying your regional setup in API for MongoDB
The simplest way of double checking your global configuration within API for MongoDB is to run the *isMaster()* command from the Mongo Shell.

From your Mongo Shell:

   ```
      db.isMaster()
   ```
   
Example results:

   ```JSON
      {
         "_t": "IsMasterResponse",
         "ok": 1,
         "ismaster": true,
         "maxMessageSizeBytes": 4194304,
         "maxWriteBatchSize": 1000,
         "minWireVersion": 0,
         "maxWireVersion": 2,
         "tags": {
            "region": "South India"
         },
         "hosts": [
            "vishi-api-for-mongodb-southcentralus.documents.azure.com:10250",
            "vishi-api-for-mongodb-westeurope.documents.azure.com:10250",
            "vishi-api-for-mongodb-southindia.documents.azure.com:10250"
         ],
         "setName": "globaldb",
         "setVersion": 1,
         "primary": "vishi-api-for-mongodb-southindia.documents.azure.com:10250",
         "me": "vishi-api-for-mongodb-southindia.documents.azure.com:10250"
      }
   ```

## <a id="next"></a>Next steps
Learn how to manage the consistency of your globally replicated account by reading [Consistency levels in DocumentDB](documentdb-consistency-levels.md).

For information about how global database replication works in DocumentDB, see [Distribute data globally with DocumentDB](documentdb-distribute-data-globally.md). For information about programmatically replicating data in multiple regions, see [Developing with multi-region DocumentDB accounts](documentdb-developing-with-multiple-regions.md).

<!--Image references-->
[1]: ./media/documentdb-portal-global-replication/documentdb-add-region.png
[2]: ./media/documentdb-portal-global-replication/documentdb_change_write_region-1.png
[3]: ./media/documentdb-portal-global-replication/documentdb_change_write_region-2.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[azureregions]: https://azure.microsoft.com/en-us/regions/#services
[offers]: https://azure.microsoft.com/en-us/pricing/details/documentdb/
