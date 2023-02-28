---
title: Reliability in Azure Microsoft Energy Data Services
description: Find out about reliability in Microsoft Energy Data Services
author: bharathim 
ms.author: anaharris
ms.topic: conceptual
ms.service: energy-data-services
ms.custom: subject-reliability, references_regions
ms.date: 01/13/2023
---


# Reliability in Microsoft Energy Data Services

This article describes reliability support in Microsoft Energy Data Services, and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](../reliability/overview.md).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. If there's a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](availability-zones-overview.md).

Microsoft Energy Data Services Preview supports zone-redundant instance by default and there's no setup required by the Customer.

### Prerequisites

The Microsoft Energy Data Services Preview supports availability zones in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| South Central US | North Europe         |               |                    |                |
| East US          | West Europe          |               |                    |                |

### Zone down experience
During a zone-wide outage, no action is required during zone recovery. There may be a brief degradation of performance until the service self-heals and re-balances underlying capacity to adjust to healthy zones. 

If you're experiencing failures with Microsoft Energy Data Services APIs, you may need to implement a retry mechanism for 5XX errors.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](availability-zones-overview.md)