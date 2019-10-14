---
 title: Azure Cosmos DB global distribution
 description: Learn how to replicate data globally with Azure Cosmos DB in the Azure portal
 services: cosmos-db
 author: rimman
 ms.service: cosmos-db
 ms.topic: include
 ms.date: 12/26/2018
 ms.author: rimman
 ms.custom: include file
---

## <a id="addregion"></a>Add global database regions using the Azure portal
Azure Cosmos DB is available in all [Azure regions][azureregions] worldwide. After selecting the default consistency level for your database account, you can associate one or more regions (depending on your choice of default consistency level and global distribution needs).

1. In the [Azure portal](https://portal.azure.com/), in the left bar, click **Azure Cosmos DB**.
2. In the **Azure Cosmos DB** page, select the database account to modify.
3. In the account page, click **Replicate data globally** from the menu.
4. In the **Replicate data globally** page, select the regions to add or remove by clicking regions in the map, and then click **Save**. There is a cost to adding regions, see the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) or the [Distribute data globally with Azure Cosmos DB](../articles/cosmos-db/distribute-data-globally.md) article for more information.
   
    ![Click the regions in the map to add or remove them][1]
    
Once you add a second region, the **Manual Failover** option is enabled on the **Replicate data globally** page in the portal. You can use this option to test the failover process or change the primary write region. Once you add a third region, the **Failover Priorities** option is enabled on the same page so that you can change the failover order for reads.  

### Selecting global database regions
There are two common scenarios for configuring two or more regions:

1. Delivering low-latency access to data to end users no matter where they are located around the globe
2. Adding regional resiliency for business continuity and disaster recovery (BCDR)

For delivering low-latency to end users, it is recommended that you deploy both the application and Azure Cosmos DB in the regions that correspond to where the application's users are located.

For BCDR, it is recommended to add regions based on the region pairs described in the [Business continuity and disaster recovery (BCDR): Azure Paired Regions][bcdr] article.

<!--

## <a id="selectwriteregion"></a>Select the write region

While all regions associated with your Cosmos DB database account can serve reads (both, single item as well as multi-item paginated reads) and queries, only one region can actively receive the write (insert, upsert, replace, delete) requests. To set the active write region, do the following  


1. In the **Azure Cosmos DB** blade, select the database account to modify.
2. In the account blade, click **Replicate data globally** from the menu.
3. In the **Replicate data globally** blade, click **Manual Failover** from the top bar.
    ![Change the write region under Azure Cosmos DB Account > Replicate data globally > Manual Failover][2]
4. Select a read region to become the new write region, click the checkbox to confirm triggering a failover, and click OK
    ![Change the write region by selecting a new region in list under Azure Cosmos DB Account > Replicate data globally > Manual Failover][3]

--->

<!--Image references-->
[1]: ./media/cosmos-db-tutorial-global-distribution-portal/azure-cosmos-db-add-region.png
[2]: ./media/cosmos-db-tutorial-global-distribution-portal/azure-cosmos-db-manual-failover-1.png
[3]: ./media/cosmos-db-tutorial-global-distribution-portal/azure-cosmos-db-manual-failover-2.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[consistency]: ../articles/cosmos-db/consistency-levels.md
[azureregions]: https://azure.microsoft.com/regions/#services
[offers]: https://azure.microsoft.com/pricing/details/cosmos-db/
