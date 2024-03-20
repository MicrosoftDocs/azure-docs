---
 title: Include file
 description: Include file
 services: search
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 04/01/2024
 ms.author: heidist
 ms.custom: include file
---

A search service is subject to a maximum storage limit (partition size multiplied by the number of partitions) or by a hard limit on the [maximum number of indexes](../articles/search/search-limits-quotas-capacity.md#index-limits) or [indexers](../articles/search/search-limits-quotas-capacity.md#indexer-limits), whichever comes first. 

| Resource | Free | Basic  | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service level agreement (SLA) <sup>1</sup>  | No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size) <sup>2</sup> | 50 MB |2 or 15 GB |25 or 160 GB |100 or 350 GB |200 or 700 GB |200 GB |1 or 5 TB |2 or 10 TB |
| Partitions | N/A |1 or 3 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A | 1 or 3 |12 |12 |12 |12 |12 |12 |

<sup>1</sup> Service level agreements apply to billable services having dedicated resources. Free services and preview features have no SLA. For billable services, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLAs. Three or more replicas are required for query and indexing (read-write) SLAs. The number of partitions isn't an SLA consideration. See [Reliability in Azure AI Search](/azure/search/search-reliability#high-availability) to learn more about replicas and high availability.

<sup>2</sup> Partition size varies by service creation date. Lower sizes apply to services created before April 1, 2024. Higher partition sizes apply to services created after April 1, 2024, [in supported regions](search-create-service-portal.md#choose-a-region). 