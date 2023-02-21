---
title: Reliability in Azure Bot Service 
description: Find out about reliability in Azure Bot Service  
author: anaharris-ms 
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: service-reliability
ms.date: 01/06/2022 
---


# Reliability in Azure App Service Environment


This article describes reliability support in [Azure App Service](/azure/app-service/overview), and covers intra-regional resiliency with availability zones. Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. 

Azure App Service adds the power of Microsoft Azure to your application, such as:

- Security
- Load balancing
- Autoscaling
- Automated management

To explore how Azure App Service can bolster the resiliency of your application workload, see [Why use App Service?](/azure/app-service/overview#why-use-app-service)

>[!IMPORTANT]
>This article is about App Service Environment v2, which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). App Service Environment v3 is easier to use and runs on more powerful infrastructure. To learn more about App Service Environment v3, see [App Service Environment overview](https://learn.microsoft.com/en-us/azure/app-service/environment/overview). If you're currently using App Service Environment v2 and you want to upgrade to v3, please follow the [steps in this article](/azure/app-service/environment/migration-alternatives) to migrate to the new version.

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure services that offer availability zones are designed to provide the right level of reliability and flexibility. Availability zones may be configured in two ways:  zone redundant, with automatic replication across zones; or zonal, with instances pinned to a specific zone. 

### Prerequisites

 - You can only configure availability zone support when you create your App Service Environment.  A pre-existing App Service Environment can't be converted to use availability zones. 

- App Service Environment (ASE) has three versions. This arti
    
    - **ASE v1**, which doesn't support availability zones.
    - **ASE v2**, which supports zone-pinned or zonal deployment of your App Services.
    - **ASE v3**, which does support zone redundant App Service deployment and spreads instances to across zones in that region
    
- Applications are hosted in App Service plans, which are created in an App Service Environment.  Besides using correct version of App Service Environment, you need to select the correct tier of App Service Plan.

### Zone down experience

During a zone-wide outage, the customer should expect a brief degradation of performance, until the service's self-healing re-balances underlying capacity to adjust to healthy zones. This is not dependent on zone restoration; it is expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.


### Cross-region disaster recovery in multi-region geography

Azure Bot Service runs in active-active mode for both global and regional services. When an outage occurs, you don't need to detect errors or manage the service. Azure Bot Service automatically performs auto-failover and auto recovery in a multi-region geographical architecture. For the EU bot regional service, Azure Bot Service provides two full regions inside Europe with active/active replication to ensure redundancy. For the global bot service, all available regions/geographies can be served as the global footprint.


## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview)
