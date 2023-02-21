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


# Reliability in Azure App Service


This article describes reliability support in [Azure App Service](/azure/app-service/overview), and covers intra-regional resiliency with availability zones. Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. 

Azure App Service adds the power of Microsoft Azure to your application, such as:

- Security
- Load balancing
- Autoscaling
- Automated management

To explore how Azure App Service can bolster the resiliency of your application workload, see [Why use App Service?](/azure/app-service/overview#why-use-app-service)

> [!NOTE]
> This article is about App Service Environment v3, which is used with Isolated v2 App Service plans. Availability zones are only supported on App Service Environment v3. If you're using App Service Environment v1 or v2 and want to use availability zones, you'll need to migrate to App Service Environment v3.

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview).

Azure App Service Environment can be deployed across [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

### Prerequisites

- All App Service plans created in that App Service Environment will need a minimum of 3 instances and those will automatically be zone redundant.
- You can only specify availability zones when creating a **new** App Service Environment. A pre-existing App Service Environment can't be converted to use availability zones.
- Availability zones are only supported in a [subset of regions](../app-service/environment/overview.md#regions).

- Your App Service Environment must be either v2 or v3. ASE v1 doesn't support availability zones.

- Your App Services plan must be one of the following plans that support availability zones:

     - Premium v2 
     - Premium v3 
     - Isolated
     - Isolated v2
    
- Your App Service Environment must be running in a region that supports availability zones. To see which regions support availability zones, see [Regions](/azure/app-service/environment/overview#regions).

### Create a resource with availability zone enabled

- For *Premium v2*, *Premium v3*, and *Isolated v2* plans, hosted on App Service Environment v3, see [Create an App Service Environment](/azure/app-service/environment/creation).

- For *Isolated* plan hosted on App Service Environment v2, see [Availability zone support for App Service Environment v2](/azure/app-service/environment/zone-redundancy).


>[!IMPORTANT]
>[App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). App Service Environment v3 is easier to use and runs on more powerful infrastructure. To learn more about App Service Environment v3, see [App Service Environment overview](azure/app-service/environment/overview). If you're currently using App Service Environment v2 and you want to upgrade to v3, please follow the [steps in this article](/azure/app-service/environment/migration-alternatives) to migrate to the new version.

#### Deploy a zone-redundant App Service

To learn how to deploy a zone-redundant App Service, see [Migrate Azure App Service to availability zone support](/azure/reliability/migrate-app-service#how-to-redeploy).

#### Deploy a zonal App Service

To learn how to deploy a zonal App Service, see [Availability zone support for App Service Environment v2](/azure/app-service/environment/zone-redundancy).

### Fault tolerance

To prepare for availability zone failure, you should over-provision capacity of service to ensure that the solution can tolerate 1/3 loss of capacity and continue to function without degraded performance during zone-wide outages. Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.

### Zone down experience

- For zone-redundant App Service deployments, see [Downtime requirements](/azure/reliability/migrate-app-service#downtime-requirements).


- Zonal ILB (Internal Load Balancing) ASE deployments will continue to run and serve traffic on that ASE even when other zones in the same region suffer an outage. 

In order to attain end-to-end zone resiliency for apps created on a zonal ILB ASE, you must do the following:

1. Deploy at least two zonal ILB ASEs, where each ILB ASE is pinned to a different zone. 
1. Create and publish copies of your application onto each of the zonal ILB ASEs.  
1. Deploy a load balancing solution upstream of the zonal ILB ASEs so that traffic bound for an application is load-balanced and distributed across all of the zonal ILB ASEs. The recommended solution is to deploy a zone redundant Application Gateway upstream of the zonal ILB ASEs. To learn more details about Application Gateway v2 and its zone redundant configuration, see [Scaling Application Gateway v2 and WAF v2](azure/application-gateway/application-gateway-autoscaling-zone-redundant).

### Availability zone redeployment and migration

To learn how to migrate Azure App Service Environment to availability zone support, see 9Migrate App Service Environment to availability zone support](/azure/reliability/migrate-app-service-environment).


## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)
