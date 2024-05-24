---
title: Reliability in Azure API Center 
description: Find out about reliability features in the Azure API Center service.  
author: dlepow 
ms.author: danlep
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: api-management
ms.date: 04/15/2024
---


# Reliability in Azure API Center

This article describes reliability support in Azure API Center. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

In each [region](../api-center/overview.md) where it's available, Azure API Center supports zone redundancy by default. The Azure API Center service runs in a multitenant environment on availability zone-enabled components. You don't need to set it up or reconfigure for availability zone support. 


### Zone down experience

During a zone-wide outage, the customer should expect a brief degradation of performance, until the service's self-healing rebalances underlying capacity to adjust to healthy zones. This isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state compensates for a lost zone, using capacity from other zones.

## Cross-region disaster recovery in multi-region geography

Currently, Azure API Center supports only a single-region configuration. There is no capability for automatic or customer-enabled cross-region failover for Azure API Center. Should a regional disaster occur, the service will be unavailable until the region is restored.

## Data residency

All customer data stays in the region where you deploy an API center. Azure API Center doesn't replicate data across regions. 

## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)
