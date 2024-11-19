---
title: Reliability in Sustainability Data Solutions in Fabric
description: Find out about reliability in Sustainability data solutions in Fabric, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: microsoft-cloud-sustainability
ms.date: 11/19/2024
---

# Reliability in Sustainability data solutions in Fabric

This article describes reliability support in [Sustainability data solutions in Fabric](/industry/sustainability/sustainability-data-solutions-fabric/get-started-overview), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Sustainability data solutions in Fabric has multiple capabilities to help you to manage your sustainability data scenarios. Most of the capabilities are covered by the [Microsoft Fabric reliability guide](./reliability-fabric.md), except for Microsoft Azure emissions insights. This guide focuses on emissions insights.

[Microsoft Azure emissions insights](/industry/sustainability/sustainability-data-solutions-fabric/azure-emissions-insights-overview) enables you to retrieve and access your Azure emissions data from Microsoft's Cloud for Sustainability services. Emission insights are loaded into your Microsoft Fabric instance at regular intervals. This guide describes how the platform supports resiliency in the ingestion of data. After data is loaded into your Microsoft Fabric instance, it's covered by the [Microsoft Fabric reliability guide](./reliability-fabric.md).

## Transient faults

[!INCLUDE[introduction to transient faults](includes/reliability-transient-faults-description-include.md)]

If a transient fault occurs during ingestion of emissions data, you need to manually trigger the job again. You can monitor the ingestion job from the Microsoft Fabric monitoring hub.

## Availability zone support

Sustainability data solutions in Fabric is zone-redundant by default.

### Region support

Zone redundancy for the emissions data source is automatically enabled when you use [any region that supports availability zones](./availability-zones-service-support.md#azure-regions-with-availability-zone-support).

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

- [Overview of Sustainability data solutions in Fabric](/industry/sustainability/sustainability-data-solutions-fabric/get-started-overview)
- [Ingest emissions data](/industry/sustainability/sustainability-data-solutions-fabric/azure-emissions-insights-ingest)
