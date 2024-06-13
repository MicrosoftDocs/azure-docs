---
title: Reliability in Azure AI Health Insights
titleSuffix: Azure AI Health Insights
description: This article describes Reliability in Azure AI Health Insights service.
services: azure-health-insights
author: adishachar
manager: urieinav
ms.service: azure-health-insights
ms.topic: reliability-article
ms.date: 02/06/2024
ms.author: adishachar
---


# Reliability in Azure AI Health Insights

This article describes reliability support in Azure AI Health Insights, and covers both regional reliability with availability zones and cross-region resiliency with disaster recovery . For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

When you create a Health Insights resource in the Azure portal, you specify a region. From then on, your resource and all of its operations stay associated with that particular Azure region. It's rare, but not impossible, to encounter a network issue that hits an entire region. 
If your solution needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. 


## Availability zone support
Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if the one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see Regions and availability zones.

Azure availability zones-enabled services are designed to provide the right level of reliability and flexibility. Azure AI Health Insights support 'zonal' configuration, which means instances are pinned to a specific zone. 



## Zone down experience
During a zone-wide outage, the customer should expect a brief degradation of performance, until the service's self-healing rebalances underlying capacity to adjust to healthy zones. This isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state compensates for a lost zone, using capacity from other zones.



## Cross-region disaster recovery in multi-region geography
Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments that result in downtime. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR.

When it comes to DR, Microsoft uses the [shared responsibility model](/azure/reliability/business-continuity-management-program#shared-responsibility-model). In a shared responsibility model, Microsoft ensures that the baseline infrastructure and platform services are available. For those services, you are responsible for setting up a disaster recovery plan that works for your workload. 

For Azure AI Health Insights, the service does not store data for a long period, rather only when processing of the data. If a region failure occurs, all data associated to the requests that are in progress will be lost. 
If your solution needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. When you plan to deploy your application for DR, it's helpful to understand Azure regions and geographies. For more information, see [Azure cross-region replication](/azure/reliability/cross-region-replication-azure).



## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)