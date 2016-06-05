Resource|Free|Basic|S1|S2|S3 <sup>1</sup> (Preview) |S3 HD <sup>1</sup> (Preview) 
---|---|---|---|----|---|----
Service Level Agreement (SLA)|No |Yes |Yes  |Yes |No|No
Maximum services per tier <sup>2</sup>|1 |12 |12  |1 <sup>4</sup> |1 <sup>4</sup>|1 <sup>4</sup>
Maximum scale per tier <sup>4</sup>|N/A|3 SU (maximum of 3 replicas and 1 partition)|36 SU|36 SU|36 SU|12 (maximum of 12 replicas and 1 very large partition).

<sup>1</sup> Tiers are first introduced as a Preview feature. During Preview, tiers are billed at an introductory rate of 50% off the full price. There is no SLA for preview.

<sup>2</sup> Each service is provisioned at a given tier, with limits on the number of services you can provision at each tier within a single Azure subscription. For example, you could have 12 services at the Basic tier in the same subscription.

<sup>4</sup> You can contact Azure Support if you need more than one S2, S3, or S3 HD per service.

<sup>3</sup> For some tiers, scale out limits are defined in terms of Search Units (SU). Search units are billable units for either a **replica** or a **partition**. You need both for storage, indexing, and query operations. Visit [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md) for valid combinations of replicas and partitions that stay under the maximum limits. Because **Free** is based on shared resources used by multiple subscribers, scalability is not provided at this level.




