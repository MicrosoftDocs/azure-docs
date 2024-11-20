---
title: Reliability in Azure Logic Apps
description: Learn about reliability in Azure Logic Apps, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
services: logic-apps
ms.service: azure-logic-apps
ms.date: 11/19/2024
zone_pivot_groups: logic-app-hosting-types
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Logic Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Logic Apps


This article describes reliability support in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Logic app workflows help you more easily integrate and orchestrate data between apps, cloud services, and on-premises systems by reducing how much code that you have to write. When you plan for resiliency, make sure that you consider not just your logic apps, but also these Azure resources that you use with your logic apps:

* [Connections](../connectors/introduction.md) that you create from logic app workflows to other apps, services, and systems. For more information, see [Connections to resources](/azure/logic-apps/business-continuity-disaster-recovery-guidance#connections-to-resources) later in this topic.

* [On-premises data gateways](../logic-apps/connect-on-premises-data-sources.md), which are Azure resources that you create and use in your logic apps to access data in on-premises systems. Each gateway resource represents a separate [data gateway installation](/azure/logic-apps/logic-apps-gateway-install) on a local computer. For more information, see [On-premises data gateways](/azure/logic-apps/business-continuity-disaster-recovery-guidance#on-premises-data-gateways) later in this topic.

* [Integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-create-integration-account) where you define and store the artifacts that logic apps use for [business-to-business (B2B) enterprise integration](/azure/logic-apps/logic-apps-enterprise-integration-overview) scenarios. For example, you can [set up cross-region disaster recovery for integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-b2b-business-continuity).

::: zone pivot="consumption"

Azure Logic Apps Consumption manages the compute infrastructure and resources for your workflows automatically. You don't need to configure or manage any virtual machines (VMs). Logic Apps Consumption shares compute infrastructure between many customers.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

Azure Logic Apps Standard runs your workflows on compute resources that are dedicated to you, called *plans*. Each plan can have multiple instances, and those instances can optionally be spread across multiple availability zones. Your workflows run on instances of your plan.

::: zone-end

## Production deployment recommendations

::: zone pivot="consumption"

For enterprise and secure workflows with isolation or network security requirements, we recommended that you use Logic Apps Standard instead of Logic Apps Consumption. For more information, see [Create and deploy to different environments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

For production deployments with Logic Apps Standard, you should [enable zone redundancy](#availability-zone-support) to spreads your logic app resources across multiple availability zones.

::: zone-end

## Transient faults 

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For more information on how to change or disable the retry policy for your logic app, see [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling?tabs=standard).

Many triggers and actions automatically support *retry policies*, which automatically retry requests that fail due to transient faults. You can change or disable the default retry policy for your logic app. 

If an action fails, you can customize the behavior of subsequent actions. You can also create *scopes* to group related actions that might fail or succeed together.

For more information on fault handling in Logic Apps, see [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

You can set up zone redundancy for Azure Logic Apps to spread resources across multiple [availability zones](../reliability/availability-zones-overview.md). When you distribute logic app workload resources across availability zones, you improve resiliency and reliability for your production logic app workloads.

::: zone pivot="consumption"

Zone redundancy is automatically enabled for new and existing Consumption logic app workflows.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

When you use Logic Apps Standard with a Workflow Service Plan, you can optionally enable zone redundancy.

::: zone-end

::: zone pivot="standard-app-service-environment"

When you use Logic Apps Standard with an App Service Environment v3, you can optionally enable zone redundancy. For more information on how App Service Environments v3 supports availability zones, see [Reliability in App Service](./reliability-app-service.md?pivots=isolated).

::: zone-end

### Regions supported

::: zone pivot="consumption,standard-workflow-service-plan"

Zone-redundant logic apps can be deployed in [any region that supports availability zones](./availability-zones-service-support.md#azure-regions-with-availability-zone-support).

::: zone-end

::: zone pivot="standard-app-service-environment"

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

### Requirements

You must deploy a minimum of three instances of your plan.

::: zone-end

### Considerations 

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

- **Storage**. When you configure external storage for stateful workflows, you must configure your storage account for zone redundancy. For more information, see [Storage considerations for Azure Functions](../azure-functions/storage-considerations.md#storage-account-requirements).

::: zone-end

- **Connectors**. Built-in connectors are automatically zone redundant when your logic app is zone redundant.

- **Integration accounts**. [Premium SKU integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-overview) are zone redundant by default.

### Cost

::: zone pivot="consumption"

No additional cost applies to use zone redundancy, which is automatically enabled for new and existing Logic Apps Consumption workflows.

::: zone-end

::: zone pivot="standard-workflow-service-plan"

When you're using Logic Apps Standard with a Workflow Service Plan, there's no additional cost associated with enabling availability zones as long as you have three or more instances of your plan. You'll be charged based on your plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform enforces a minimum instance count of three and charges you for those three instances.

::: zone-end

::: zone pivot="standard-app-service-environment"

App Service Environment v3 has a specific pricing model for zone redundancy. For pricing information for App Service Environment v3, see [Pricing](../app-service/environment/overview.md#pricing).

::: zone-end

### Configure availability zone support 

::: zone pivot="consumption"

Consumption logic apps support zone redundancy automatically, so no configuration is required.

::: zone-end

::: zone pivot="standard-workflow-service-plan,standard-app-service-environment"

**Create a new workflow with zone-redundancy.** To enable zone-redundancy for Standard logic apps, see [Enable zone redundancy for your logic app](../logic-apps/set-up-zone-redundancy-availability-zones.md).

**Migration.** It's not possible to enable zone redundancy to on existing plan after it's created. Instead, you need to create a new plan with zone redundancy enabled and delete the old one.

**Disable zone redundancy.** It's not possible to disable zone redundancy on an existing plan after it's created. Instead, you need to create a new plan with zone redundancy disabled and delete the old one.

### Capacity planning and management

To prepare for availability zone failure, you should over-provision capacity of service to ensure that the solution can tolerate 1/3 loss of capacity and continue to function without degraded performance during zone-wide outages. Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.

::: zone-end

### Traffic routing between zones

<!-- TODO verify; also how does this work for consumption? -->
During normal operations, workflow invocations are spread among all of your available plan instances across all availability zones.

### Zone-down experience

**Detection and response:** The Logic Apps platform is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

**Active requests:** When an availability zone is unavailable, any workflow invocations in progress that are running on a VM in the faulty availability zone are terminated. The Azure Logic Apps platform automatically resumes the workflow on another VM in a different availability zone. Because of this behavior, active workflows might experience some [transient faults](#transient-faults) or higher latency as new VMs are added to the remaining availability zones.

### Failback

When the availability zone recovers, Azure Logic Apps automatically restores instances in the availability zone, removes any temporary instances created in the other availability zones, and reroutes traffic between your instances as normal.

### Testing for zone failures  

The Azure Logic Apps platform manages traffic routing, failover, and failback for zone-redundant Logic Apps resources. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Each logic app is deployed into a single Azure region. If the region becomes unavailable, your logic app is also unavailable.

### Alternative multi-region approaches 

For higher resiliency, you can deploy a standby or backup logic app in another (secondary) region, and fail over to the secondary region if the primary region is unavailable. To do this, you should:

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
- [Handle errors and exceptions in Azure Logic Apps](/azure/logic-apps/error-exception-handling)
