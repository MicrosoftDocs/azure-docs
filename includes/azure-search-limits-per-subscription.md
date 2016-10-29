You can create multiple services within a subscription, each one provisioned at a specific tier, limited only by the number of services allowed at each tier. For example, you could create up to 12 services at the Basic tier and another 12 services at the S1 tier within the same subscription. For more information about tiers, see [Choose a SKU or tier for Azure Search](../articles/search/search-sku-tier.md).

Maximum service limits can be raised upon request. Contact Azure Support if you need more services within the same subscription.

Resource|Free|Basic|S1|S2|S3 |S3 HD <sup>1</sup>
---|---|---|---|----|---|----
Maximum services |1 |12 |12  |6 |6 |6 
Maximum scale in SU <sup>2</sup>|N/A <sup>3</sup>|3 SU <sup>4</sup> |36 SU|36 SU|36 SU|36 SU <sup>5</sup>

<sup>1</sup> S3 HD does not support [indexers](../articles/search/search-indexer-overview.md) at this time. 

<sup>2</sup> Search units (SU) are billable units per service, allocated as either a *replica* or a *partition*. You need both resources for storage, indexing, and query operations. To learn more about valid combinations that stay under the maximum limits, see [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md). 

<sup>3</sup> Free is based on shared resources used by multiple subscribers. At this tier, there are no dedicated resources for an individual subscriber. For this reason, maximum scale is marked as not applicable.

<sup>4</sup> Basic has one fixed partition. At this tier, additional SUs are used for allocating more replicas for increased query workloads.

<sup>5</sup> S3 HD has a different allocation structure in terms of allowable combinations. S3 HD has a maximum of 3 partitions and 12 replicas (at 3 x 12 = 36 search units), whereas regular S3 supports additional combinations of replicas and partitions (for example, 6 partitions and 6 replicas). S3 HD is capped at 3 partitions because the substantial increase in index limits (1,000 per partition; 3,000 per service) is at the upper boundary of index support. Contact Microsoft Support if you require more than 1,000 indexes per partition for an S3 HD service.




