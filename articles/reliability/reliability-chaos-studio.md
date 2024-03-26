---
title: Reliability in Azure Chaos Studio
description: Find out about reliability in Azure Chaos Studio.
author: prasha-microsoft 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: chaos-studio
ms.date: 01/23/2024 
---


# Reliability in Azure Chaos Studio


This article describes reliability and availability zones support in [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Chaos Studio supports zone redundancy as the default configuration within a region.  Chaos Studio resources are automatically duplicated or distributed across different zones. 

### Prerequisites

The following regions support availability zones for Chaos Studio:

| Americas         | Europe               | Asia Pacific   |
|------------------|----------------------|----------------|
| Brazil South     | Sweden Central  | Australia East      |
| Central US       | UK South        | Japan East          |
| East US          |                 | Southeast Asia      |
| East US 2        |                 |                     |
| West US 2        |                 |                     |
| West US 3        |                 |                     |


For detailed information on the regional availability model for Azure Chaos Studio see [Regional availability of Azure Chaos Studio](/azure/chaos-studio/chaos-studio-region-availability).

### Zone down experience

In the event of a zone-wide outage, you should anticipate a brief degradation in performance and availability as the service transitions to a functioning zone. This interruption does not depend on the restoration of the affected zone, as Microsoft-managed services mitigate zone losses by using capacity from alternative zones. In the event of an availability zone outage, it's possible that a chaos experiment could encounter errors or disruptions, but crucial experiment metadata, historical data, and specific details should remain accessible, and the service should not experience a complete outage. 

## Cross-region disaster recovery and business continuity

Chaos Studio supports single-region geography only, and doesn't support service enabled cross-region failover.

## Next steps

- [Create and run your first experiment](/azure/chaos-studio/chaos-studio-quickstart-azure-portal).
- [Learn more about chaos engineering](/azure/chaos-studio/chaos-studio-chaos-engineering-overview).
- [Reliability in Azure](/azure/availability-zones/overview)
