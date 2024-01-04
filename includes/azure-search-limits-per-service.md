---
 title: include file
 description: include file
 services: search
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 01/02/2024
 ms.author: heidist
 ms.custom: include file
---

A search service is subject to a maximum storage limit (partition size multiplied by the number of partitions) or by a hard limit on the [maximum number of indexes](../articles/search/search-limits-quotas-capacity.md#index-limits) or [indexers](../articles/search/search-limits-quotas-capacity.md#indexer-limits), whichever comes first. 

| Resource | Free <sup>1</sup> | Basic <sup>1</sup> | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service level agreement (SLA) <sup>2</sup>  |No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size) |50 MB <sup>3</sup> |2 GB |25 GB |100 GB |200 GB |200 GB |1 TB |2 TB |
| Partitions | N/A |1 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A |3 |12 |12 |12 |12 |12 |12 |

<sup>1</sup> Basic has one fixed partition. You can specify up to 3 more search units to add replicas for larger query volumes and high availability.

<sup>2</sup> Service level agreements apply to billable services having dedicated resources. Free services and preview features have no SLA. For billable services, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLAs. Three or more replicas are required for query and indexing (read-write) SLAs. The number of partitions isn't an SLA consideration. See [Reliability in Azure AI Search](/azure/search/search-reliability#high-availability) to learn more about replicas and high availability.

<sup>3</sup> Free services don't have a dedicated partition. The 50-MB storage limit refers to the maximum space allocated to a free search service on infrastructure shared with other customers.