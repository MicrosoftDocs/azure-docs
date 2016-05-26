Resource|Free|Basic (Preview)|S1|S2
---|---|---|---|----
Maximum tiers per subscription <sup>1</sup>|1 |12 |12  |1
Maximum scale per tier <sup>2</sup>||N/A|Up to 3 units (3 replicas and 1 partition)|36 units|36 units  

<sup>1</sup> Each service is provisioned at a given pricing tier, with limits on the number of services you can provision at each tier within a single Azure subscription. During the Preview period, tiers are available at an introductory rate of 50% off the full price.

<sup>2</sup> Scale out limits are defined in terms of maximum number of Search Units (SU) per tier. Search units are the billable unit for either a **replica** or a **partition**. You need both for storage, indexing, and query operations. Visit [Capacity Planning](../articles/search/search-capacity-planning.md) for valid combinations of replicas and partitions that keep you within the maximum limit of 3 or 36 units, for **Basic** and **Standard** respectively. Because **Free** is based on shared resources used by multiple subscribers, scale out is not provided at this level.




