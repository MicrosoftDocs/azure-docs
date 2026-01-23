---
title: Reliability in Azure Logic Apps
description: Learn to make Azure Logic Apps resilient to potential outages and problems, including transient faults, availability zone outages, and region outages.
author: ecfan
ms.author: estfan
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 12/03/2025
zone_pivot_groups: logic-app-hosting-types
ai-usage: ai-assisted
---

# Reliability in Azure Logic Apps

[Azure Logic Apps](/azure/logic-apps/logic-apps-overview) helps you more easily integrate and orchestrate data between apps, cloud services, and on-premises systems by reducing how much code that you have to write.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

This article describes how to make logic app workflows resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also highlights key information about the Azure Logic Apps service-level agreement (SLA).

## Production deployment recommendations for reliability

::: zone pivot="consumption"

For enterprise and secure workflows that have isolation or network security requirements, we recommend that you create and run Standard workflows in single-tenant Azure Logic Apps, rather than Consumption workflows in multitenant Azure Logic Apps. For more information, see [Create and deploy to different environments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

For production deployments that have single-tenant Azure Logic Apps, we recommend that you [set up zone redundancy](#resilience-to-availability-zone-failures) to spread your logic app resources across multiple availability zones.

::: zone-end

## Reliability architecture overview

[!INCLUDE [Introduction to reliability architecture overview section](includes/reliability-architecture-overview-introduction-include.md)]

### Logical architecture

The primary resource that you deploy is a *logic app*. Consumption logic apps have only one workflow, while Standard logic apps can have more than one workflow. Most workflows use one or more [connections](../connectors/introduction.md) to access other apps, services, and systems.

If you access data in on-premises systems, you might deploy an [on-premises data gateway](../logic-apps/connect-on-premises-data-sources.md). Each gateway resource represents a separate [data gateway installation](../logic-apps/install-on-premises-data-gateway-workflows.md) on a local computer. You can configure an on-premises data gateway for high availability by using multiple computers. For more information, see [High availability support](../logic-apps/install-on-premises-data-gateway-workflows.md#high-availability-support).

When you use Azure Logic Apps for [business-to-business (B2B) enterprise integration](/azure/logic-apps/logic-apps-enterprise-integration-overview) scenarios, you might deploy [integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-create-integration-account) where you define and store the artifacts that logic app workflows use.

### Physical architecture

::: zone pivot="consumption"

For Consumption logic apps, Azure Logic Apps automatically manages the compute infrastructure, state storage, and other resources. You don't need to configure or manage any virtual machines (VMs). Consumption logic apps share compute infrastructure between many customers.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

For Standard logic apps, Azure Logic Apps uses compute resources called *Workflow Service Plans*, or *plans*, which are dedicated to you. Each plan can have multiple instances, which you can optionally spread across multiple availability zones. Each instance roughly maps to a virtual machine (VM), but you don't see those VMs and you don't need to configure or manage them directly. Your workflows run on instances of your plan.

Standard logic apps require that you configure storage to maintain the state for stateful workflows. For more information, see [Stateful and stateless workflows](../logic-apps/single-tenant-overview-compare.md#stateful-and-stateless-workflows).

Standard logic apps use similar underlying infrastructure to Azure Functions and Azure App Service. But some differences exist in the way you configure plans for logic apps compared to other services.

For more information, see [Differences between Standard logic apps versus Consumption logic apps](../logic-apps/single-tenant-overview-compare.md).

::: zone-end

## Resilience to transient faults 

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

In Azure Logic Apps, many workflow triggers and actions automatically support *retry policies*, which automatically retry requests that fail because of transient faults. For more information about how to change or turn off retry policies, see [Handle errors and exceptions in Azure Logic Apps](../logic-apps/error-exception-handling.md).

If an action fails, you can customize the behavior of subsequent actions. You can also create *scopes* to group related actions that might fail or succeed together.

For more information, see [Handle errors and exceptions in Azure Logic Apps](../logic-apps/error-exception-handling.md).

## Resilience to availability zone failures

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

::: zone pivot="consumption"

Azure Logic Apps supports *zone redundancy*, which spreads compute resources and state across multiple availability zones. When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.

New and existing Consumption logic app workflows in multitenant Azure Logic Apps are automatically zone-redundant.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

Azure Logic Apps supports *zone redundancy*, which spreads compute resources across multiple [availability zones](../reliability/availability-zones-overview.md). You can optionally configure zone redundancy for the state that your logic app workflows store. When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

For Standard workflows that have the Workflow Service Plan hosting option in single-tenant Azure Logic Apps, you can optionally enable zone redundancy.

::: zone-end

::: zone pivot="standard-app-service-environment"

For Standard workflows that have the App Service Environment hosting option, you can optionally enable zone redundancy. For more information about how App Service Environment supports availability zones, see [Reliability in App Service Environment](./reliability-app-service-environment.md).

::: zone-end

### Requirements

::: zone pivot="consumption"

- **Region support**: Consumption logic apps deployed in [any region that supports availability zones](./regions-list.md) are automatically zone redundant. Japan West is the exception. It doesn't support zone-redundant logic apps because some dependent services don't support zone redundancy.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

- **Region support**: You can deploy zone-redundant Standard logic apps with Workflow Service Plans in any region that supports availability zones for App Service. Japan West is the exception. It doesn't support zone-redundant logic apps because some dependent services don't support zone redundancy. For more information, see [Reliability in App Service](./reliability-app-service.md).

::: zone-end

::: zone pivot="standard-app-service-environment"

- **Region support**: To see which regions support availability zones for App Service Environment, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

::: zone pivot="standard-workflow-service-plan, standard-app-service-environment"

- **Instance count**: You must deploy at least two instances of your Workflow Service Plan. Each instance roughly corresponds to one VM, so to distribute these instances (VMs) across multiple availability zones, you must have two instances at minimum.

::: zone-end

### Considerations 

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Storage**: When you configure external storage for stateful Standard workflows, you must configure your storage account for zone redundancy. For more information, see [Storage considerations for Azure Functions](../azure-functions/storage-considerations.md#storage-account-requirements).

::: zone-end

- **Connectors**: Built-in connectors are automatically zone redundant when your logic app is zone redundant.

- **Integration accounts**: [Premium SKU integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-overview) are zone redundant by default.

### Cost

::: zone pivot="consumption"

No extra cost applies to use zone redundancy. All new and existing Consumption logic apps are zone-redundant automatically.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

When you have Standard logic apps with the Workflow Service Plan in single-tenant Azure Logic Apps, no extra cost applies to enabling zone redundancy if you have two or more plan instances. You're charged based on your plan SKU, the specified capacity, and any instances that you scale up or down, based on your autoscale criteria. If you enable availability zones but specify fewer than two instances, the platform enforces the minimum two instances and charges you for these two instances.

::: zone-end

::: zone pivot="standard-app-service-environment"

App Service Environment has a specific pricing model for zone redundancy. For more information, see [Pricing](../app-service/environment/overview.md#pricing).

::: zone-end

### Configure availability zone support 

::: zone pivot="consumption"

Consumption logic app workflows automatically support zone redundancy, so no configuration is required.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Create a new zone-redundant logic app**: To enable zone redundancy for Standard logic apps, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

- **Enable zone redundancy on an existing logic app**: You can't enable zone redundancy after you create a service plan. Instead, you need to create a new plan that has zone redundancy enabled and delete the old one.

- **Disable zone redundancy**: You can't disable zone redundancy after you create a Workflow Service Plan. Instead, you need to create a new plan that has zone redundancy disabled and delete the old one.

### Capacity planning and management

To prepare for availability zone failure, consider *over-provisioning* the capacity of your plan. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. For more information, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

::: zone-end

### Behavior when all zones are healthy

This section describes what to expect when logic app resources are configured for zone redundancy and all availability zones are operational.

::: zone pivot="consumption"

- **Traffic routing between zones**: During normal operations, workflow invocations can use compute resources from any availability zone in the region.

- **Data replication between zones**: For stateful workflows, workflow state is synchronously replicated between availability zones by using zone-redundant storage (ZRS).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Traffic routing between zones**: During normal operations, workflow invocations are spread among all your available plan instances across all availability zones.

- **Data replication between zones**: For stateful workflows, workflow state is stored based on the state storage you configured. When you use Azure Storage as your external storage system, you need to use zone-redundant storage (ZRS), which synchronously replicates the workflow state between availability zones.

::: zone-end

### Behavior during a zone failure

This section describes what to expect when an availability zone outage occurs and logic app resources are configured for zone redundancy.

- **Detection and response**: Azure Logic Apps is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

[!INCLUDE [Availability zone down notification (Service Health only)](./includes/reliability-availability-zone-down-notification-service-include.md)]

- **Active requests**: If an availability zone becomes unavailable, Azure Logic Apps terminates any in-progress workflow executions that run on a VM in the faulty availability zone. The platform automatically resumes the workflow on another VM in a different availability zone. Because of this behavior, active workflows might experience some [transient faults](#resilience-to-transient-faults) or higher latency when new VMs are added to the remaining availability zones.

- **Expected downtime**: No downtime is expected in Azure Logic Apps. But if dependencies exist on other services that experience downtime, your logic app might also be affected. 

- **Expected data loss**: No data loss is expected.

::: zone pivot="consumption"

- **Traffic rerouting**: Incoming traffic is automatically distributed to infrastructure in healthy zones.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

- **Traffic rerouting**: Incoming traffic is automatically distributed to new plan instances in healthy zones when they're available. For more information, see [Behavior during a zone failure](./reliability-app-service.md#behavior-during-a-zone-failure).

::: zone-end

::: zone pivot="standard-workflow-service-plan"

- **Nonruntime behaviors**: Logic app workflows in a zone-redundant plan continue to run even if an availability zone experiences an outage. But nonruntime behaviors might be affected during an availability zone outage. For more information and a list of these behaviors, see [Behavior during a zone failure](./reliability-app-service.md#behavior-during-a-zone-failure).

::: zone-end

::: zone pivot="standard-app-service-environment"

- **Nonruntime behaviors**: Logic app workflows in a zone-redundant plan continue to run even if an availability zone experiences an outage. But nonruntime behaviors might be affected during an availability zone outage. For more information and a list of these behaviors, see [Environment - Behavior during a zone failure](./reliability-app-service-environment.md#behavior-during-a-zone-failure).

::: zone-end

### Zone recovery

When the availability zone recovers, Azure Logic Apps automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.

### Test for zone failures

Azure Logic Apps manages traffic routing, failover, and failback for zone-redundant logic app resources. You don't need to initiate anything. This feature is fully managed, so you don't need to validate availability zone failure processes.

## Resilience to region-wide failures

Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

### Custom multi-region solutions for resiliency

For higher resiliency, you can deploy a standby or backup logic app in a secondary region and fail over to that other region if the primary region is unavailable. To set up this capability, complete the following tasks:

- Deploy your logic app in both primary and secondary regions.
- Reconfigure connections to resources as needed.
- Configure load balancing and failover policies. 
- Plan to monitor the primary instance health and initiate failover.

For more information about multi-region deployments for your logic app workflows, see the following articles:

- [Multi-region deployments in Azure Logic Apps](../logic-apps/multi-region-disaster-recovery.md)
- [Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-b2b-business-continuity.md)
- [Create replication tasks for Azure resources by using Azure Logic Apps](../logic-apps/create-replication-tasks-azure-resources.md)

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
- [Handle errors and exceptions in Azure Logic Apps](../logic-apps/error-exception-handling.md)