---
title: Azure resiliency terminology
description: Understanding terms
author: mamccrea
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: mamccrea
ms.reviewer: cynthn
ms.custom: fasttrack-edit, mvc
---

# Terminology

To better understand regions and availability zones in Azure, it helps to understand key terms or concepts.

| Term or concept | Description |
| --- | --- |
| region | A set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. |
| geography | An area of the world that contains at least one Azure region. Geographies define a discrete market that preserves data-residency and compliance boundaries. Geographies allow customers with specific data-residency and compliance needs to keep their data and applications close. Geographies are fault tolerant to withstand complete region failure through their connection to our dedicated high-capacity networking infrastructure. |
| availability zone | Unique physical locations within a region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. |
| recommended region | A region that provides the broadest range of service capabilities and is designed to support availability zones now, or in the future. These regions are designated in the Azure portal as **Recommended**. |
| alternate (other) region | A region that extends Azure's footprint within a data-residency boundary where a recommended region also exists. Alternate regions help to optimize latency and provide a second region for disaster recovery needs. They aren't designed to support availability zones, although Azure conducts regular assessment of these regions to determine if they should become recommended regions. These regions are designated in the Azure portal as **Other**. |
| cross-region replication (formerly paired region) | A reliability strategy and implementation that combines high availability of availability zones with protection from region-wide incidents to meet both disaster recovery and business continuity needs. |
| foundational service | A core Azure service that's available in all regions when the region is generally available. |
| mainstream service | An Azure service that's available in all recommended regions within 90 days of the region general availability or demand-driven availability in alternate regions. |
| strategic service | An Azure service that's demand-driven availability across regions backed by customized/specialized hardware. |
| regional service | An Azure service that's deployed regionally and enables the customer to specify the region into which the service will be deployed. For a complete list, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all). |
| non-regional service | An Azure service for which there's no dependency on a specific Azure region. Non-regional services are deployed to two or more regions. If there's a regional failure, the instance of the service in another region continues servicing customers. For a complete list, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all). |
| zonal service | An Azure service that supports availability zones, and that enables a resource to be deployed to a specific, self-selected availability zone to achieve more stringent latency or performance requirements. |
| zone-redundant service | An Azure service that supports availability zones, and that enables resources to be replicated or distributed across zones automatically. |
| always-available service | An Azure service that supports availability zones, and that enables resources to be always available across all Azure geographies as well as resilient to zone-wide and region-wide outages. |
