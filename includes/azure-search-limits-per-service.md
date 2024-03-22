---
 title: Include file
 description: Include file
 services: search
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 04/03/2024
 ms.author: heidist
 ms.custom: include file
---

A search service is subject to a maximum storage limit (partition size multiplied by the number of partitions) or by a hard limit on the [maximum number of indexes](../articles/search/search-limits-quotas-capacity.md#index-limits) or [indexers](../articles/search/search-limits-quotas-capacity.md#indexer-limits), whichever comes first. 

| Resource | Free | Basic  | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service level agreement (SLA) <sup>1</sup>  | No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size) <sup>2</sup> | 50&nbsp;MB |2&nbsp;GB or 15&nbsp;GB |25&nbsp;GB or 160&nbsp;GB |100&nbsp;GB or 350&nbsp;GB |200&nbsp;GB or 700&nbsp;GB |200&nbsp;GB| 1&nbsp;TB | 2&nbsp;TB  |
| Partitions | N/A |1 or 3 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A | 1 or 3 |12 |12 |12 |12 |12 |12 |

<sup>1</sup> Service level agreements apply to billable services having dedicated resources. Free services and preview features have no SLA. For billable services, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLAs. Three or more replicas are required for query and indexing (read-write) SLAs. The number of partitions isn't an SLA consideration. See [Reliability in Azure AI Search](/azure/search/search-reliability#high-availability) to learn more about replicas and high availability.

<sup>2</sup> Partition size varies by service creation date. Lower sizes apply to services created before April 1, 2024. Higher partition sizes apply to services created after April 1, 2024 [in supported regions](/azure/search/search-create-service-portal#choose-a-region). 