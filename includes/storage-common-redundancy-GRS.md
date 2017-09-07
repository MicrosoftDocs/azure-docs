Geo-redundant storage (GRS) replicates your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

For a storage account with GRS enabled, an update is first committed to the primary region, where it is replicated three times. Then the update is replicated asynchronously to the secondary region, where it is also replicated three times.

With GRS, both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit as described with LRS.

Considerations:

* Since asynchronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region will be lost if the data cannot be recovered from the primary region.
* The replica is not available unless Microsoft initiates failover to the secondary region. If Microsoft does initiate a failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, please see [Disaster Recovery Guidance](../storage-disaster-recovery-guidance.md). 
* If an application wants to read from the secondary region, the user should enable RA-GRS.

When you create a storage account, you select the primary region for the account. The secondary region is determined based on the primary region, and cannot be changed. The following table shows the primary and secondary region pairings.

| Primary | Secondary |
| --- | --- |
| North Central US |South Central US |
| South Central US |North Central US |
| East US |West US |
| West US |East US |
| US East 2 |Central US |
| Central US |US East 2 |
| North Europe |West Europe |
| West Europe |North Europe |
| South East Asia |East Asia |
| East Asia |South East Asia |
| East China |North China |
| North China |East China |
| Japan East |Japan West |
| Japan West |Japan East |
| Brazil South |South Central US |
| Australia East |Australia Southeast |
| Australia Southeast |Australia East |
| India South |India Central |
| India Central |India South |
| India West |India South |
| US Gov Iowa |US Gov Virginia |
| US Gov Virginia |US Gov Texas |
| US Gov Texas |US Gov Arizona |
| US Gov Arizona |US Gov Texas |
| Canada Central |Canada East |
| Canada East |Canada Central |
| UK West |UK South |
| UK South |UK West |
| Germany Central |Germany Northeast |
| Germany Northeast |Germany Central |
| West US 2 |West Central US |
| West Central US |West US 2 |

For up-to-date information about regions supported by Azure, see [Azure regions](https://azure.microsoft.com/regions/).

>[!NOTE]  
> US Gov Virginia secondary region is US Gov Texas. Previously, US Gov Virginia utilized US Gov Iowa as a secondary region. Storage accounts still leveraging US Gov Iowa as a secondary region are being migrated to US Gov Texas as a seconday region. 
> 
> 