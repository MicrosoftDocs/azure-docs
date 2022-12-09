---
title: Resiliency in Azure Bot Service 
description: Find out about reliability in Azure Bot Service  
author: hibrenda 
ms.author: anaharris-ms
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 12/09/2022 
---


# What is reliability in Azure Bot Service?

Azure Bot Service is a global Azure service that supports regional compliance options. With those options, customers can connect their applications (bots) to their end-users on a variety of 1st and 3rd party chat services within certain geographic boundaries.

This article describes reliability support in Azure Bot Service, and covers both regional reliability with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

Azure Bot Service delivered “Zone Redundant by Default” scenario to [Regional ABS](https://learn.microsoft.com/en-us/azure/bot-service/bot-builder-concept-regionalization?view=azure-bot-service-4.0) (for tiers where supported). 

### Prerequisites

No availablity zone enabled for Global Azure Bot Service. 
No availablity zone enabled for "Standard channels" in Regional Bot Service.
Only EU is the current supported region in Regional Azure Bot Service. 

The Availability Zones is default enabled for "Premium channels" in Regional Azure Bot Service. User do not need to set it up or reconfigurating AZ's by themselves. All the configurations for AZ's are deployed behind the scene by Azure Bot Service. 

### Zone down experience

During a zone-wide outage, the customer should expect a brief degradation of performance, until the service's self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.


### Cross-region disaster recovery in multi-region geography

Azure Bot Service runs Active-Active mode for both global and regional services. No customer action is required to detect and manage the outage. Azure Bot Service will auto-failover and auto recovery in multi-region geographically


## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)