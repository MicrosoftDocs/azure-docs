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

Storage is constrained by disk space or by a hard limit on the *maximum number* of indexes, document, or other high-level resources, whichever comes first. The following table documents storage limits. For maximum limits on indexes, documents, and other objects, see [Limits by resource](../articles/search/search-limits-quotas-capacity.md#index-limits).

| Resource | Free | Basic<sup>1</sup> | S1 | S2 | S3 | S3&nbsp;HD<sup>2</sup> | L1 | L2 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service level agreement (SLA)<sup>3</sup>  |No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage per partition |50 MB |2 GB |25 GB |100 GB |200 GB |200 GB |1 TB |2 TB |
| Partitions per service |N/A |1 |12 |12 |12 |3 |12 |12 |
| Partition size |N/A |2 GB |25 GB |100 GB |200 GB |200 GB |1 TB |2 TB |
| Replicas |N/A |3 |12 |12 |12 |12 |12 |12 |

<sup>1</sup> Basic has one fixed partition. At this tier, additional search units are used for allocating more replicas for increased query workloads.

<sup>2</sup> S3 HD has a hard limit of three partitions, which is lower than the partition limit for S3. The lower partition limit is imposed because the index count for S3 HD is substantially higher. Given that service limits exist for both computing resources (storage and processing) and content (indexes and documents), the content limit is reached first.

<sup>3</sup> Service level agreements are offered for billable services on dedicated resources. Free services and preview features have no SLA. For billable services, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLAs. Three or more replicas are required for query and indexing (read-write) SLAs. The number of partitions isn't an SLA consideration. 