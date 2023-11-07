---
 title: include file
 description: include file
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 07/17/2023
 ms.author: heidist
 ms.custom: include file
---

You can create multiple *billable* search services (Basic and higher), limited only by the number of services allowed at each tier. For example, you could create up to 16 services at the Basic tier and another 16 services at the S1 tier within the same subscription. For more information about tiers, see [Choose an SKU or tier for Azure Cognitive Search](../articles/search/search-sku-tier.md).

Maximum service limits can be raised upon request. If you need more services within the same subscription, [file a support request](../articles/search/search-create-service-portal.md#add-more-services-to-a-subscription).

| Resource            | Free<sup>1</sup> | Basic | S1  | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| ------------------- | ---- | ----- | --- | -- | -- | ----- | -- | -- |
| Maximum services    |1     | 16    | 16  | 8  | 6  | 6     | 6  | 6  |
| Maximum scale in search units (SU)<sup>2</sup> |N/A |3 SU |36 SU |36 SU |36 SU |36 SU |36 SU |36 SU |

<sup>1</sup> You can have one free search service per Azure subscription. The free tier is based on infrastructure that's shared with other customers. Because the hardware isn't dedicated, scale-up isn't supported, and storage is limited to 50 MB.

<sup>2</sup> Search units are billing units, allocated as either a *replica* or a *partition*. You need both resources for storage, indexing, and query operations. To learn more about SU computations, see [Scale resource levels for query and index workloads](../articles/search/search-capacity-planning.md). 
