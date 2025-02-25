---
title: Reliability in Sustainability Data Solutions in Fabric
description: Find out about reliability in Sustainability data solutions in Fabric, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: microsoft-cloud-sustainability
ms.date: 12/03/2024
---

# Reliability in Sustainability data solutions in Fabric

This article describes reliability support in [Sustainability data solutions in Fabric](/industry/sustainability/sustainability-data-solutions-fabric/get-started-overview), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).


Sustainability disclosures, analytics and reduction require rich environmental, social, and governance data that originate from disparate sources and need to be unified to improve its efficiency and value. [Sustainability data solutions](/industry/sustainability/sustainability-data-solutions-fabric/get-started-overview) in Microsoft Fabric provide unique capabilities to ingest, harmonize, and process disparate data for specific sustainability scenarios.

The reliability guidance for most of these capabilities are covered by the [Microsoft Fabric reliability guide](./reliability-fabric.md). However, that document does not include reliability guidance for the ingestion of data in Microsoft Azure emissions insights. This guide focuses specifically on the resiliency of data ingestion process for the [Microsoft Azure emissions insights platform](/industry/sustainability/sustainability-data-solutions-fabric/azure-emissions-insights-overview). After your emissions data is loaded into your Microsoft Fabric instance, you can consult [the Microsoft Fabric reliability guide](./reliability-fabric.md) for the rest of the reliability guidance.



## Transient faults

[!INCLUDE[introduction to transient faults](includes/reliability-transient-fault-description-include.md)]

If a transient fault occurs during ingestion of emissions data, you must manually trigger the job again. You can monitor the ingestion job from the Microsoft Fabric monitoring hub.

## Availability zone support

Sustainability data solutions in Fabric is zone-redundant by default.

### Region support

Zone redundancy for the emissions data source is automatically enabled when you use [any region that supports availability zones](./availability-zones-region-support.md).

### Cost

There's no additional charge for zone redundancy.

### Zone-down experience

The Sustainability data solutions in Fabric platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

A zone failure isn't expected to cause any data loss or downtime to your resources.

## Multi-region support

Internally, Microsoft's Cloud for Sustainability services are partially geo-redundant. If a major region failure occurs, emissions data can be reconstructed in another region.

### Region-down experience

During a region failure, Azure emissions data that's already ingested into Fabric is accessible as long as Microsoft Fabric is available. For information on how to plan for disaster recovery and configure multi-region support in Microsoft Fabric, see [Reliability in Microsoft Fabric ](./reliability-fabric.md).

Ingestion of new Azure emissions data, as well as any missing data, resumes after Microsoft restores services into the region. Although the process of ingesting new and missing data might take several days, previously ingested data is still available.

## Related content
- [Microsoft Fabric reliability guide](./reliability-fabric.md)
- [Overview of Sustainability data solutions in Fabric](/industry/sustainability/sustainability-data-solutions-fabric/get-started-overview)
- [Ingest emissions data](/industry/sustainability/sustainability-data-solutions-fabric/azure-emissions-insights-ingest)
