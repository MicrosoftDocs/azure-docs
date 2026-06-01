---
title: Understanding Azure API Management Service Limits
description: Learn about service limits in Azure API Management, including their purpose, how they're enforced, and guidelines for managing your service.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/17/2026
ms.author: danlep
ai-usage: ai-assisted
---

# Understanding Azure API Management service limits

Azure API Management enforces various [limits on resources](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json#azure-api-management-limits) such as API operations and other entities. This article explains why these limits exist and how to use the service effectively within these constraints. 

## Why are there service limits?

Azure API Management operates on finite physical infrastructure. To ensure reliable performance for all customers, the service enforces limits calibrated based on:

* Azure platform capacity and performance characteristics
* Service tier capabilities
* Typical customer usage patterns

Resource limits are interrelated and tuned to prevent any single aspect from disrupting overall service performance.

## Changes to service limits - 2026 update

Starting March 2026 and over the following several months, Azure API Management is introducing updated resource limits for instances across all tiers. The limits are shown in the following table.

[!INCLUDE [api-management-service-limits](../../includes/api-management-service-limits.md)]

### What's changing

* Limits in the classic tiers now align with those set in the v2 tiers.
* Limits are enforced for a smaller set of resource types that are directly related to service capacity and performance, such as API operations, tags, products, and subscriptions.

> [!NOTE]
> Resource limits could be adjusted over time to reflect the latest service capabilities.

### Rollout process

New limits roll out in a phased approach by tier as follows:

|Tier  |Expected rollout date  |
|---------|---------|
|Consumption<br/>Developer<br/>Basic<br/>Basic v2     | March 15, 2026     |
|Standard<br/>Standard v2      |  April 15,  2026       |
|Premium<br/>Premium v2     |  May 15, 2026       |

### Limits policy for existing classic tier customers

After the new limits take effect, you can continue using your preexisting API Management resources without interruption. 

* Existing classic tier services, where current usage exceeds the new limits, are "grandfathered" when the new limits are introduced. (Instances in the v2 tiers are already subject to the new limits.) 
* Limits in grandfathered services will be set 10% higher than the customer's observed usage at the time new limits take effect. 
* Grandfathering applies per service and service tier.
* Other existing services and new services are subject to the new limits when they take effect. 

## Manage resources within limits

If you're reaching resource limits, you might notice impacts such as being unable to create new resources or update existing ones. You might also experience degraded performance in some service operations.

The following are guidelines to help you manage your resources effectively in these cases.

### Improve resource management

* Implement a regular cleanup process for unused resources.
* Use tags effectively to identify resources that you can consolidate or remove.
* Review [capacity metrics](api-management-capacity.md) to understand resource utilization and potential bottlenecks.

### Optimize API and operation organization

When counting API-related resources (such as API operations and tags), API Management also includes API versions and revisions. The following strategies can help when approaching limits for these resources:

* Remove unused API versions or revisions.
* Consolidate or remove operations where appropriate.
* Use API versions and revisions strategically.

### Evaluate your service tier

If you consistently reach resource limits or capacity issues, evaluate your current service tier. Certain limits, such as those for API operations, vary by service tier.

* Consider options to add units or upgrade your tier. 
* Consider deploying an additional API Management instance in the current tier.

To evaluate the costs associated with these options, see [Azure API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

## Guidelines for limit increases

In some cases, you might want to increase a service limit. Before requesting a limit increase, note the following guidelines:

* Explore strategies to address the issue proactively before requesting a limit increase. See the preceding section [Manage resources within limits](#manage-resources-within-limits).

* Consider potential impacts of the limit increase on overall service performance and stability. Increasing a limit might affect your service's capacity or increase latency in some service operations.

### Requesting a limit increase

The product team considers requests for limit increases only for customers using services in the following tiers that are designed for medium to large production workloads:

* Standard and Standard v2
* Premium and Premium v2

Requests for limit increases are evaluated on a case-by-case basis and aren't guaranteed. The product team prioritizes Premium and Premium v2 tier customers for limit increases.

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/).


## Related content

* [Capacity of an API Management instance](api-management-capacity.md)
* [Upgrade and scale an API Management instance](upgrade-and-scale.md)
