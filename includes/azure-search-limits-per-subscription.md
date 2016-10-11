You can create multiple services within a subscription, each one provisioned at a specific tier, limited only by the number of services allowed at each tier. For example, you could create up to 12 services at the Basic tier and another 12 services at the S1 tier within the same subscription. 

Maximum service limits can be raised upon request. Contact Azure Support if you need more services within the same subscription.

Resource|Free|Basic|S1|S2|S3 <br/>(Preview) <sup>1</sup>  |S3 HD <br/>(Preview) <sup>1</sup> 
---|---|---|---|----|---|----
Maximum services |1 |12 |12  |6 |6 |6 
Maximum scale in SU <sup>2</sup>|N/A <sup>3</sup>|3 SU <sup>4</sup> |36 SU|36 SU|36 SU|12 SU <sup>5</sup>

<sup>1</sup> Preview tiers are billed at an introductory rate of 50% and become full price when the tier graduates to general availability (GA). During Preview, there is no service level agreement (SLA). For more information about tiers, see [Choose a SKU or tier for Azure Search](../articles/search/search-sku-tier.md).

<sup>2</sup> Search units (SU) are billable units per service, allocated as either a *replica* or a *partition*. You need both resources for storage, indexing, and query operations. To learn more about valid combinations that stay under the maximum limits, see [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md). 

<sup>3</sup> Free is based on shared resources used by multiple subscribers. At this tier, there are no dedicated resources for an individual subscriber. For this reason, maximum scale is marked as not applicable.

<sup>4</sup> Basic has one fixed partition. At this tier, additional SUs are used for allocating more replicas for increased query workloads.

<sup>5</sup> S3 HD is based on the same hardware as S3, but in a configuration that's optimized for a large number of smaller indexes. Similar to Basic, it has 1 very large partition with additional search units that can be used for replicas.




