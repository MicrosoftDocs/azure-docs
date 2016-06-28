You can create multiple services within a subscription, each one provisioned at a specific tier, limited only by the number of services allowed at each tier within a single Azure subscription. Maximum services per tier are noted below. As indicated, you could create up to 12 services at the Basic tier and another 12 services at the S1 tier within the same subscription. 

Other tiers are one per subscription. You can contact Azure Support if you need more than one S2, S3, or S3 HD per subscription.

Resource|Free|Basic|S1|S2|S3 <sup>1</sup> <br/>(Preview) |S3 HD <sup>1</sup> <br/>(Preview) 
---|---|---|---|----|---|----
Maximum services |1 |12 |12  |1 |1 |1 
Maximum scale in SU <sup>2</sup>|N/A <sup>3</sup>|3 SU <sup>4</sup> |36 SU|36 SU|36 SU|12 SU <sup>5</sup>

<sup>1</sup> **Preview** tiers are billed at an introductory rate of 50% off the full price. Prior to general availability (GA) tiers are introduced as a Preview feature. During Preview, there is no service level agreement (SLA). See [Choose a SKU or tier for Azure Search](../articles/search/search-sku-tier.md) for more information about tiers.

<sup>2</sup> **Search units (SU)** are billable units per service, allocated as either a **replica** or a **partition**. You need both resource types for storage, indexing, and query operations. See [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md) for valid combinations that stay under the maximum limits. 

<sup>3</sup> **Free** is based on shared resources used by multiple subscribers. At this tier, there are no dedicated resources for an individual subscriber. For this reason, scalability is not supported.

<sup>4</sup> **Basic** has one fixed partition. SUs are used to allocate replicas for scaling query workloads.

<sup>5</sup> **S3 HD** is based on the same hardware as S3, but in a configuration that's optimized for a large number of smaller indexes. It has 1 very large partition instead of 12 smaller partitions, and it has a maximum of 12 replicas, similar to S3.




