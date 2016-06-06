You can create multiple services within a subscription, each one provisioned at a specific tier. There are limits on the number of services you can provision at each tier within a single Azure subscription. You can create up to 12 services at the Basic tier and another 12 services at the S1 tier within the same subscription. 

Other tiers are one per subscription. You can contact Azure Support if you need more than one S2, S3, or S3 HD per service.

Resource|Free|Basic|S1|S2|S3 <sup>1</sup> (Preview) |S3 HD <sup>1</sup> (Preview) 
---|---|---|---|----|---|----
Maximum services |1 |12 |12  |1 |1 |1 
Maximum scale <sup>2</sup>|N/A <sup>3</sup>|3 SU (up to 3 replicas and 1 partition)|36 SU|36 SU|36 SU|12 SU (up to 12 replicas and 1 very large partition).

<sup>1</sup> **Preview** tiers are billed at an introductory rate of 50% off the full price. Prior to general availability (GA) tiers are introduced as a Preview feature. During Preview, there is no service level agreement (SLA).

<sup>2</sup> **Search units (SU)** are billable units per service, allocated as either a **replica** or a **partition**. You need both resource types for storage, indexing, and query operations. See [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md) for valid combinations that stay under the maximum limits. 

<sup>3</sup> **Free** is based on shared resources used by multiple subscribers. For this reason, scalability is not applicable.




