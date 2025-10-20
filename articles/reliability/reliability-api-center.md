---
title: Reliability in Azure API Center 
description: Improve reliability in Azure API Center by using availability zones and zone redundancy. Read about disaster recovery and what to expect during an outage. 
author: dlepow 
ms.author: danlep
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-api-management
ms.date: 10/17/2025
---

# Reliability in Azure API Center

This article describes reliability support in Azure API Center, including availability zones, zone redundancy, data residency, and what customers should expect during zone or regional outages. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

In each [region](../api-center/overview.md) where it's available, Azure API Center supports zone redundancy by default. The Azure API Center service runs in a multitenant environment on availability zone-enabled components. You don't need to set it up or reconfigure for availability zone support. 

### Zone down experience

During a zone-wide outage, the customer should expect a brief degradation of performance, until the service's self-healing rebalances underlying capacity to adjust to healthy zones. This period of performance degradation isn't dependent on zone restoration; the Microsoft-managed service self-healing state is expected to compensate for a lost zone, by using capacity from other zones.

## Cross-region disaster recovery limitations

Currently, Azure API Center supports only a single-region configuration. There's no capability for automatic or customer-enabled cross-region failover for Azure API Center. Should a regional disaster occur, the service is unavailable until the region is restored.

## Data residency

All customer data stays in the region where you deploy an API center. Azure API Center doesn't replicate data across regions. 

## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/reliability/overview)
