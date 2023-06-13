---
title: Reliability in Azure Operator Nexus
description: Find out about reliability in Azure Operator Nexus
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: operator-nexus
ms.date: 06/13/2023
#Customer intent: I want to understand reliability support in Azure Operator Nexus so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Operator Nexus

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the supplemental terms of use.

This article describes reliability support in Azure Operator Nexus and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. Availability zones are designed to ensure high availability in the case of a local zone failure.  When one zone experiences a failure, the remaining two zones support all regional services, capacity, and high availability. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](availability-zones-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](availability-zones-service-support.md#azure-services-with-availability-zone-support).

Azure Operator Nexus offers zone-redundant deployments by default for all SKU offerings. Operator Nexus Components, such as Cluster Manager, Fabric Controller, and Proxy services are all deployed on an Azure Kubernetes Service (AKS) cluster that's enabled with availability zones. Other service dependencies, such as Resource Provider as a Service (RPaaS), Storage Account Service, and KeyVault are also configured with zone-redundancy.

>[!NOTE]
>Operator Nexus On-Premises Clusters implements a multi-rack design that provides physical redundancy at all levels of the stack. Each rack is designed as a failure domain or Nexus zone. Customer workloads can be deployed across multiple racks/nodes, essentially providing a similar multi-availability zone experience.

### Zone down experience

In a zone-down scenario, API calls against the cluster and resource providers would continue to work without interruption. There would be no ​impact to the currently running on-premises tenant workloads or to the ability to create new tenant workloads. ​ Also, no data loss should occur, as the RPaaS ensure the resilience of the Operator Nexus, and other resource types. 

### Zonal failover support

In the case of a zonal failure, reconnection to an Azure zone is automatic and requires no interaction from the user.

## Next steps

>[!div class="nextstepaction"]
>[Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

>[!div class="nextstepaction"]
>[Reliability in Azure](./overview.md)