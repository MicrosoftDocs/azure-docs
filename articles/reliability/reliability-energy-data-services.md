---
title: Resiliency in Microsoft Energy Data Services #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Microsoft Energy Data Services #Required; 
author: bharathim #Required; your GitHub user alias, with correct capitalization.
ms.author: bselvaraj #Required; Microsoft alias of author; optional team alias.
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 12/05/2022 #Required; mm/dd/yyyy format.
---

<!--#Customer intent: As a customer, I want to understand reliability support for Microsoft Energy Data Services so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->

<!--

Template for the main reliability article for Azure services. 
Keep the required sections and add/modify any content for any information specific to your service. 
This article should live in the reliability content area of azure-docs-pr.
This article should be linked to in your TOC. Under a Reliability node or similar. The name of this page should be *reliability-Microsoft Energy Data Services.md* and the TOC title should be "Reliability in Microsoft Energy Data Services". 
Keep the headings in this order. 

This template uses comment pseudo code to indicate where you must choose between two options or more. 

Conditions are used in this document in the following manner and can be easily searched for: 
-->

<!-- IF (AZ SUPPORTED) -->
<!-- some text -->
<!-- END IF (AZ SUPPORTED)-->

<!-- BEGIN IF (SLA INCREASE) -->
<!-- some text -->
<!-- END IF (SLA INCREASE) -->

<!-- IF (SERVICE IS ZONAL) -->
<!-- some text -->
<!-- END IF (SERVICE IS ZONAL) -->

<!-- IF (SERVICE IS ZONE REDUNDANT) -->
<!-- some text -->
<!-- END IF (SERVICE IS ZONAL) -->

<!--

IMPORTANT: 
- Do a search and replace of TODO-service-name  with the name of your service. That will make the template easier to read.
- ALL sections are required unless noted otherwise.
- MAKE SURE YOU REMOVE ALL COMMENTS BEFORE PUBLISH!!!!!!!!

-->

<!-- 1. H1 -----------------------------------------------------------------------------
Required: Uses the format "What is reliability in X?"
The "X" part should identify the product or service.
-->

# What is reliability in Microsoft Energy Data Services?

<!-- 2. Introductory paragraph ---------------------------------------------------------
Required: Provide an introduction. Use the following placeholder as a suggestion, but elaborate.
-->

This article describes reliability support in Microsoft Energy Data Services, and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](../reliability/overview.md).

## Availability zone support
<!-- IF (AZ SUPPORTED) -->
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. If there's a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Microsoft Energy Data Services Preview supports zone-redundant instance by default and there's no setup required by the Customer.

### Prerequisites

The Microsoft Energy Data Services Preview supports availability zones in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. Customer may however experience brief degradation of performance, until the service self-heals and rebalances underlying capacity to adjust to healthy zones. Customers experiencing failures with Microsoft Energy Data Services APIs may need to be retried for 5XX errors.

## Next steps
> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)