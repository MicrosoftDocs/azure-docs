---
title: Azure resiliency terminology
description: Understanding terms
author: anaharris-ms
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: anaharris
ms.custom: fasttrack-edit, mvc
---

# Reliability terminology

To better understand regions and availability zones in Azure, it helps to understand key terms or concepts.



| Term | Definition |
|-|-|
| Region | A geographic perimeter that contains a set of datacenters. |
| Datacenter | A facility that contains servers, networking equipment, and other hardware to support Azure resources and workloads. |
| Availability zone | [A separated group of datacenters within a region.][availability-zones-overview] Each availability zone is independent of the others, with its own power, cooling, and networking infrastructure. [Many regions support availability zones.][azure-regions-with-availability-zone-support] |
| Paired regions |A relationship between two Azure regions. [Some Azure regions][azure-region-pairs] are connected to another defined region to enable specific types of multi-region solutions. [Newer Azure regions aren't paired.][regions-with-availability-zones-and-no-region-pair] |
| Region architecture | The specific configuration of the Azure region, including the number of availability zones and whether the region is paired with another region. |
| Locally redundant deployment | A deployment model in which a resource is deployed into a single region without reference to an availability zone. In a region that supports availability zones, the resource might be deployed in any of the region's availability zones. |
| Zonal (pinned) deployment | A deployment model in which a resource is deployed into a specific availability zone. |
| Zone-redundant deployment | A deployment model in which a resource is deployed across multiple availability zones. Microsoft manages data synchronization, traffic distribution, and failover if a zone experiences an outage. |
| Multi-region deployment| A deployment model in which resources are deployed into multiple Azure regions. |
| Asynchronous replication | A data replication approach in which data is written and committed to one location. At a later time, the changes are replicated to another location. |
| Synchronous replication | A data replication approach in which data is written and committed to multiple locations. Each location must acknowledge completion of the write operation before the overall write operation is considered complete. |
| Active-active | An architecture in which multiple instances of a solution actively process requests at the same time. |
| Active-passive | An architecture in which one instance of a solution is designated as the *primary* and processes traffic, and one or more *secondary* instances are deployed to serve traffic if the primary is unavailable. |

