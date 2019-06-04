---
 title: include file
 description: include file
 services: search
 author: HeidiSteen
 ms.service: search
 ms.topic: include
 ms.date: 05/06/2019
 ms.author: heidist
 ms.custom: include file
---

You can create multiple services within a subscription. Each one can be provisioned at a specific tier. You're limited only by the number of services allowed at each tier. For example, you could create up to 12 services at the Basic tier and another 12 services at the S1 tier within the same subscription. For more information about tiers, see [Choose an SKU or tier for Azure Search](../articles/search/search-sku-tier.md).

Maximum service limits can be raised upon request. If you need more services within the same subscription, contact Azure Support.

| Resource            | Free<sup>1</sup> | Basic | S1  | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| ------------------- | ---- | ----- | --- | -- | -- | ----- | -- | -- |
| Maximum services    |1     | 16    | 16  | 8  | 6  | 6     | 6  | 6  |
| Maximum scale in search units (SU)<sup>2</sup> |N/A |3 SU |36 SU |36 SU |36 SU |36 SU |36 SU |36 SU |

<sup>1</sup> Free is based on shared, not dedicated, resources. Scale-up is not supported on shared resources.

<sup>2</sup> Search units are billing units, allocated as either a *replica* or a *partition*. You need both resources for storage, indexing, and query operations. To learn more about SU computations, see [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md). 