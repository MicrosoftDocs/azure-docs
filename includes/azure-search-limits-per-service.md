---
 title: Include file
 description: Include file
 services: search
 author: HeidiSteen
 ms.service: cognitive-search
 ms.topic: include
 ms.date: 05/21/2024
 ms.author: heidist
ms.custom: include file, build-2024
---

Search service limits for storage, partitions, and replicas vary by service creation date, with higher limits for newer services in supported regions. Limits vary by service creation date:

+ [Before April 3, 2024](#before-april-3-2024)
+ [Between April and May 2024 (Basic, S1, S2, S3, S3 HD)](#after-april-3-2024)
+ [After May 17, 2024 (L1 and L2)](#after-may-17-2024)

A search service is subject to a maximum storage limit (partition size multiplied by the number of partitions) or by a hard limit on the [maximum number of indexes](../articles/search/search-limits-quotas-capacity.md#index-limits) or [indexers](../articles/search/search-limits-quotas-capacity.md#indexer-limits), whichever comes first. 

Service level agreements (SLAs) apply to billable services having two or more replicas for query workloads, or three or more replicas for query and indexing workloads. The number of partitions isn't an SLA consideration. For more information, see [Reliability in Azure AI Search](/azure/search/search-reliability#high-availability).

Free services don't have fixed partitions or replicas and they share resources with other subscribers.

### Before April 3, 2024

| Resource | Free | Basic | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
|----------|-------|------|----|----|----|----------- |----|----|
| Service level agreement (SLA)| No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size) | 50&nbsp;MB |2&nbsp;GB |25&nbsp;GB |100&nbsp;GB |200&nbsp;GB |200&nbsp;GB| 1&nbsp;TB | 2&nbsp;TB  |
| Partitions | N/A |1 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A |3 |12 |12 |12 |12 |12 |12 |

### After April 3, 2024

+ Basic tier supports three partitions and three replicas, for a total of nine search units (SU). It also has larger partitions.
+ S1, S2, S3, and S3 HD have larger partitions, ranging from 3-7 times more, depending on the tier.
+ Higher capacity is limited to [new search services](/azure/search/search-create-service-portal) in [supported regions](#supported-regions-with-higher-storage-limits). There is no in-place upgrade at this time.

| Resource | Free | Basic  | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
|----------|------|--------|----|----|----|------------|----|----|
| Service level agreement (SLA) | No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size)  | 50&nbsp;MB | **15&nbsp;GB** | **160&nbsp;GB** | **512&nbsp;GB** | **1&nbsp;TB** | **1&nbsp;TB** | 1&nbsp;TB | 2&nbsp;TB  |
| Partitions | N/A |3 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A | 3 |12 |12 |12 |12 |12 |12 |

### After May 17, 2024

+ L1 and L2 have more partition storage and compute power.
+ Higher capacity is limited to [new search services](/azure/search/search-create-service-portal) in [supported regions](#supported-regions-with-higher-storage-limits). There is no in-place upgrade at this time.

| Resource | Free | Basic  | S1 | S2 | S3 | S3&nbsp;HD | L1 | L2 |
|----------|------|--------|----|----|----|------------|----|----|
| Service level agreement (SLA) | No |Yes |Yes |Yes |Yes |Yes |Yes |Yes |
| Storage (partition size)  | 50&nbsp;MB | 15&nbsp;GB | 160&nbsp;GB | 512&nbsp;GB | 1&nbsp;TB | 1&nbsp;TB | **2&nbsp;TB** | **4&nbsp;TB**  |
| Partitions | N/A |3 |12 |12 |12 |3 |12 |12 |
| Replicas | N/A | 3 |12 |12 |12 |12 |12 |12 |

### Supported regions with higher storage limits

Services must be in one of the following regions to get the extra storage. Watch for announcements in [What's New in Azure AI Search](/azure/search/whats-new) for expansion to other regions.

### Available starting on May 17, 2024

| Country | Regions providing extra capacity per partition |
|---------|------------------------------------------------|
| **Switzerland** | Switzerland West​ |
| **South Africa** | South Africa North​ |
| **Germany** | Germany North​, Germany West Central​ ​|
| **Azure Government** | Texas, Arizona, Virginia |

### Available starting on April 3, 2024

| Country | Regions providing extra capacity per partition |
|---------|------------------------------------------------|
| **United States** | East US​, East US 2, ​Central US​, North Central US​, South Central US​, West US​, West US 2​, West US 3​, West Central US​ |
| **United Kingdom** | UK South​, UK West​ ​ |
| **United Arab Emirates** | UAE North​​ |
| **Switzerland** | Switzerland North​ |
| **Sweden** | Sweden Central​​ |
| **South Africa** | South Africa North​ |
| **Poland** | Poland Central​​ |
| **Norway** | Norway East​​ |
| **Korea** | Korea Central, Korea South​ ​ |
| **Japan** | Japan East, Japan West​ |
| **Italy** | Italy North​​ |
| **India** | Central India, Jio India West​ ​ |
| **France** | France Central​​ |
| **Europe** | North Europe​​ |
| **Canada** | Canada Central​, Canada East​​ |
| **Bazil** | Brazil South​​ |
| **Asia Pacific** |  East Asia, Southeast Asia​ ​ |
| **Australia** | Australia East​, Australia Southeast​​ |
