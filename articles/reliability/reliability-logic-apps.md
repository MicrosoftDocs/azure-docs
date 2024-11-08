---
title: Reliability in Azure Logic Apps
description: Learn about reliability in Azure Logic Apps, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 11/08/2024
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Logic Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.

---


# Reliability in Azure Logic Apps


This article describes reliability support in Azure Logic Apps, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Logic Apps is a cloud platform where you can create and run automated workflows with little to no code. By using the visual designer and selecting from prebuilt operations, you can quickly build a workflow that integrates and manages your apps, data, services, and systems.


## Production deployment recommendations

For production deployments, you should:

- [Enable zone redundancy](#availability-zone-support), which spreads logic app resources across multiple availability zones.


## Transient faults 

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.


## Availability zone support

You can set up zone redundancy for Azure Logic Apps to spread resources across multiple [availability zones](../reliability/availability-zones-overview.md). When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.


The following logic app workflows support zone redundancy:

| Logic app workflow | Hosting option | Description |
|-----------|----------------|-------------|
| Consumption | Multitenant | Zone redundancy is automatically enabled for new and existing Consumption logic app workflows. |
| Standard | Workflow Service Plan | See [Reliability in Azure Functions](reliability-functions.md?tabs=azure-portal#availability-zone-support).|
| Standard | App Service Environment V3 | See [Reliability in App Service](./reliability-app-service.md). |



### Requirements

To enable zone redundancy for your logic app, you must use make sure that you meet the following requirements:

- The region must support availability zones. To see which regions support availability zones, see [Azure regions that support availability zones](availability-zones-service-support.md#azure-regions-with-availability-zone-support).


###  Considerations 

<!-- may need some more clarity on this -->
Zone redundancy is available only for built-in connectors, which are designed to run directly and natively inside Azure Logic Apps runtime. Zone redundancy isn't available for managed Azure-hosted connector operations. For more information on connector types, see [Built-in connectors versus managed connectors](/azure/connectors/introduction#built-in-connectors-versus-managed-connectors).


### Cost

| Logic app workflow | Hosting option | Description |
|-----------|----------------|-------------|
| Consumption | Multitenant | No additional cost applies to use zone redundancy, which is automatically enabled for new and existing Consumption workflows. |
| Standard | Workflow Service Plan | No additional cost applies to use zone redundancy. |
| Standard | App Service Environment V3 | See [Reliability in App Service](./reliability-app-service.md). |


### Configure availability zone support 

**Create a new workflow with zone-redundancy.** Consumption logic apps support zone redundancy automatically, so no configuration is required. To enable zone-redundancy for Standard logic apps, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

**Migration.** It's not possible to enable zone-redundancy to an existing workflow after it's created. Instead, you need to create the Azure Logic App workflow in the new region and delete the old one.

<!-- is this true? -->
**Disable zone redundancy.** If you need to disable zone redundancy for a logic app, you can't do this after the logic app is created. Instead, you need to create a new logic app in the same region without zone redundancy enabled.


### Zone-down experience

The Logic Apps platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.


### Failback

<!-- is this true? -->
When the availability zone recovers, Logic Apps automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.


### Testing for zone failures  

<!-- is this true? -->
The Azure Logic Apps platform manages traffic routing, failover, and failback for zone-redundant X resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.


## Multi-region support 


Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

For higher resiliency, you can setup your primary logic app to failover to either a standby or backup logic app in an another (secondary) region.



### Alternative multi-region approaches 


To ensure that your logic app becomes less susceptible to a single-region failure, you'll need to deploy your logic app workloads to multiple regions. To do this, you should:

- Deploy your logic app in both both primary and secondary regions.
- Reconfigure connections to resources as needed.
- Configure load balancing and failover policies. 
- Plan to monitor primary instance health and initiate failover.


For more information on multi-region deployments for your logic app workflows see:

- [Business continuity and disaster recovery for Azure Logic Apps](/azure/logic-apps/business-continuity-disaster-recovery-guidance).
- [Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](/azure/logic-apps/logic-apps-enterprise-integration-b2b-business-continuity).
- [Create replication tasks for Azure resources using Azure Logic Apps](/azure/logic-apps/create-replication-tasks-azure-resources)


## Service-level agreement

The service-level agreement (SLA) for Azure Logic Apps describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content


- [Reliability in Azure](../reliability/overview.md)
