---
title: Reliability in Azure Logic Apps
description: Learn about reliability in Azure Logic Apps, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 01/06/2025
zone_pivot_groups: logic-app-hosting-types
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Logic Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Logic Apps

This article describes reliability support in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Logic app workflows help you more easily integrate and orchestrate data between apps, cloud services, and on-premises systems by reducing how much code that you have to write. When you plan for resiliency, make sure that you consider not just your logic apps, but also these Azure resources that you use with your logic apps:

* [Connections](../connectors/introduction.md) that you create from logic app workflows to other apps, services, and systems. For more information, see [Connections to resources](/azure/logic-apps/business-continuity-disaster-recovery-guidance#connections-to-resources) later in this topic.

* [On-premises data gateways](../logic-apps/connect-on-premises-data-sources.md), which are Azure resources that you create and use in your logic apps to access data in on-premises systems. Each gateway resource represents a separate [data gateway installation](../logic-apps/install-on-premises-data-gateway-workflows.md) on a local computer. You can configure an on-premises data gateway for high availability by using multiple computers. For more information, see [High availability support](../logic-apps/install-on-premises-data-gateway-workflows.md#high-availability-support).

* [Integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-create-integration-account) where you define and store the artifacts that logic app workflows use for [business-to-business (B2B) enterprise integration](/azure/logic-apps/logic-apps-enterprise-integration-overview) scenarios. For example, you can [set up cross-region disaster recovery for integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-b2b-business-continuity).

::: zone pivot="consumption"

Multitenant Azure Logic Apps automatically manages the compute infrastructure and resources for Consumption workflows. You don't need to configure or manage any virtual machines (VMs). Consumption workflows share compute infrastructure between many customers.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

Single-tenant Azure Logic Apps runs Standard workflows on dedicated compute resources, which are dedicated to you and are called *plans*. Each plan can have multiple instances, and those instances can optionally be spread across multiple availability zones. Your workflows run on instances of your plan.

::: zone-end

## Production deployment recommendations

::: zone pivot="consumption"

For enterprise and secure workflows with isolation or network security requirements, we recommended that you create and run Standard workflows in single-tenant Azure Logic Apps, rather than Consumption workflows in multitenant Azure Logic Apps. For more information, see [Create and deploy to different environments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

For production deployments with single-tenant Azure Logic Apps, you should [enable zone redundancy](#availability-zone-support) to spread your logic app resources across multiple availability zones.

::: zone-end

## Transient faults 

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

In Azure Logic Apps, many triggers and actions automatically support *retry policies*, which automatically retry requests that fail due to transient faults. To learn how to change or disable retry policies for your logic app, see [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling?tabs=standard).

If an action fails, you can customize the behavior of subsequent actions. You can also create *scopes* to group related actions that might fail or succeed together.

For more information on fault handling in Azure Logic Apps, see [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Logic Apps supports *zone redundancy*, which spreads compute resources across multiple [availability zones](../reliability/availability-zones-overview.md). When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.

::: zone pivot="consumption"

New and existing Consumption logic app workflows in multitenant Azure Logic Apps automatically have zone redundancy enabled.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

For Standard workflows with the Workflow Service Plan hosting option in single-tenant Azure Logic Apps, you can optionally enable zone redundancy.

::: zone-end

::: zone pivot="standard-app-service-environment"

For Standard workflows with the App Service Environment v3 hosting option, you can optionally enable zone redundancy. For more information on how App Service Environments v3 supports availability zones, see [Reliability in App Service](./reliability-app-service.md?pivots=isolated).

::: zone-end

### Regions supported

::: zone pivot="consumption"

Consumption logic apps that are deployed in [any region that supports availability zones](./availability-zones-region-support.md) are automatically zone redundant. Japan West is the exception, which currently doesn't support zone-redundant logic apps because some dependency services don't yet support zone redundancy.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

You can deploy zone-redundant Standard logic apps with Workflow Service Plans in any region that supports availability zones for Azure App Service. Japan West is the exception, which currently doesn't support zone-redundant logic apps. For more information, see [Reliability in Azure App Service](./reliability-app-service.md).


::: zone-end

::: zone pivot="standard-app-service-environment"

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

### Requirements

You must deploy at least three instances of your Workflow Service Plan. Each instance roughly corresponds to one VM. To distribute these instances (VMs) across availability zones, you must have a minimum of three instances.

::: zone-end

### Considerations 

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Storage**: When you configure external storage for stateful Standard workflows, you must configure your storage account for zone redundancy. For more information, see [Storage considerations for Azure Functions](../azure-functions/storage-considerations.md#storage-account-requirements).

::: zone-end

- **Connectors**: Built-in connectors are automatically zone redundant when your logic app is zone redundant.

- **Integration accounts**: [Premium SKU integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-overview) are zone redundant by default.

### Cost

::: zone pivot="consumption"

No additional cost applies to use zone redundancy, which is automatically enabled for new and existing Consumption workflows in multitenant Azure Logic Apps.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

When you have Standard workflows with the Workflow Service Plan in single-tenant Azure Logic Apps, no additional cost applies to enabling availability zones as long as you have three or more instances of the plan. You are charged based on your plan SKU, the specified capacity, and any instances that you scale up or down, based on your autoscale criteria. If you enable availability zones but specify a capacity of fewer than three instances, the platform enforces the minimum three instances and charges you for these three instances.

::: zone-end

::: zone pivot="standard-app-service-environment"

App Service Environment v3 has a specific pricing model for zone redundancy. For pricing information for App Service Environment v3, see [Pricing](../app-service/environment/overview.md#pricing).

::: zone-end

### Configure availability zone support 

::: zone pivot="consumption"

Consumption logic app workflows automatically support zone redundancy, so no configuration is required.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Create a new workflow with zone redundancy.**

  To enable zone redundancy for Standard logic app workflows, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

- **Migration**

  You can't enable zone redundancy after you create a service plan. Instead, you need to create a new plan with zone redundancy enabled and delete the old one.

- **Disable zone redundancy.**

  You can't disable zone redundancy after you create a Workflow Service Plan. Instead, you need to create a new plan with zone redundancy disabled and delete the old one.

### Capacity planning and management

[!INCLUDE [Over-provisioning description](includes/reliability-over-provisioning-calculation-include.md)]

::: zone-end

### Traffic routing between zones

::: zone pivot="consumption"

During normal operations, workflow invocations can use compute resources in any of the availability zones within the region.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

During normal operations, workflow invocations are spread among all your available plan instances across all availability zones.

::: zone-end

### Zone-down experience

**Detection and response:** The Azure Logic Apps platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

**Active requests:** If an availability zone becomes unavailable, any in-progress workflow executions that run on a VM in the faulty availability zone are terminated. The Azure Logic Apps platform automatically resumes the workflow on another VM in a different availability zone. Due to this behavior, active workflows might experience some [transient faults](#transient-faults) or higher latency as new VMs are added to the remaining availability zones.

### Failback

When the availability zone recovers, Azure Logic Apps automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.

### Testing for zone failures  

The Azure Logic Apps platform manages traffic routing, failover, and failback for zone-redundant logic app resources. You don't need to initiate anything. This feature is fully managed, so you don't need to validate availability zone failure processes.

## Multi-region support

Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

### Alternative multi-region approaches 

For higher resiliency, you can deploy a standby or backup logic app in a secondary region and fail over to that other region if the primary region is unavailable. To enable this capability, complete the following tasks:

- Deploy your logic app in both primary and secondary regions.
- Reconfigure connections to resources as needed.
- Configure load balancing and failover policies. 
- Plan to monitor the primary instance health and initiate failover.

For more information on multi-region deployments for your logic app workflows, see the following documentation:

- [Multi-region deployments in Azure Logic Apps](/azure/logic-apps/business-continuity-disaster-recovery-guidance)
- [Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](/azure/logic-apps/logic-apps-enterprise-integration-b2b-business-continuity)
- [Create replication tasks for Azure resources using Azure Logic Apps](/azure/logic-apps/create-replication-tasks-azure-resources)

## Service-level agreement

The service-level agreement (SLA) for Azure Logic Apps describes the expected availability of the service. This agreement also describes the conditions to meet for achieving this expectation. To understand these conditions, make sure that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Reliability in Azure](../reliability/overview.md)
- [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling)
