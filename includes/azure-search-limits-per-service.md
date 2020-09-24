---
 title: include file
 description: include file
 services: search
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 05/11/2020
 ms.author: heidist
 ms.custom: include file
---

A search service is constrained by disk space or by a hard limit on the maximum number of indexes or indexers, whichever comes first. The following table documents storage limits. For maximum object limits, see [Limits by resource](../articles/search/search-limits-quotas-capacity.md#index-limits).

| Resource | Free | Basic<sup>1</sup> | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service level agreement (SLA)<sup>2</sup>  |No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage per partition |50 MB |2 GB |25 GB |100 GB |200 GB |200 GB |1 TB |2 TB |
| Partitions per service |N/A |1 |12 |12 |12 |3 |12 |12 |
| Partition size |N/A |2 GB |25 GB |100 GB |200 GB |200 GB |1 TB |2 TB |
| Replicas |N/A |3 |12 |12 |12 |12 |12 |12 |

<sup>1</sup> Basic has one fixed partition. Additional search units can be used to add replicas for larger query volumes.

<sup>2</sup> Service level agreements are in effect for billable services on dedicated resources. Free services and preview features have no SLA. For billable services, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLAs. Three or more replicas are required for query and indexing (read-write) SLAs. The number of partitions isn't an SLA consideration. 