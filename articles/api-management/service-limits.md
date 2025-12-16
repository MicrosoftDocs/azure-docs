---
title: Understanding Azure API Management Service Limits
description: Learn about service limits in Azure API Management, including their purpose, how they're enforced, and guidelines for managing your service.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 12/15/2025
ms.author: danlep
ai-usage: ai-assisted
---

# Understanding Azure API Management service limits

Azure API Management enforces various [limits on resources](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json&branch=pr-en-us-304099#azure-api-management-limits) such as APIs, operations, and other entities. This article explains why they exist and how to use the service effectively within these constraints. 

## Why are there service limits?

Service limits in Azure API Management exist, as they do for all Azure services, because even cloud services operate on physical infrastructure with finite resources. While Azure provides tremendous scalability and flexibility, the underlying hardware and system architecture have inherent constraints that we manage to ensure reliable performance for our customers.

Service limits in Azure API Management aren't arbitrary constraints but are calibrated based on:

* Azure platform capacity and performance characteristics
* Service tier capabilities
* Typical customer usage patterns

Resource limits are interrelated and tuned to work together. They prevent any single aspect of the service from disrupting overall performance of the service.

## Changes to service limits in Classic tiers

Starting March 2026, Azure API Management will publish and apply updated limits to instances in the Classic tiers (Developer, Basic, Standard, and Premium) and the Consumption tier. These updates will align with each tier’s capabilities and help customers choose the right option for their needs.

### What's changing

* New limits for Classic tier resources will be more easily compared with the limits in the [V2 service tiers](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json#limits---api-management-v2-tiers).
* Previously, limits for certain resources in Classic tiers weren't defined explicitly or enforced. In practice, these resources were always constrained by service configuration, service capacity, number of scale units, policy configuration, and other factors. The new limits will make these constraints explicit and predictable.

### Limits policy for existing customers

After the new Classic tier limits take effect, you can continue using your resources without interruption. This means:

* Existing Classic tier services that already exceed published limits won't be impacted.
* You'll be able to make changes to existing resources and add new resources up to a small threshold above your current usage.

This approach ensures that existing workloads aren't disrupted while still encouraging alignment with the new limits over time.

## Strategies to manage resources

If you're approaching or have reached certain resource limits, consider these strategies:

### Improve resource management

* Implement a regular cleanup process for unused resources
* Use tags effectively to identify resources that can be consolidated or removed
* Review [capacity metrics](api-management-capacity.md) to understand resource utilization and identify potential bottlenecks.

### Optimize API and operation organization

When counting the number of APIs and API-related resources (such as API operations, backends, tags, and so on), API Management also includes API versions and revisions. Consider the following strategies when approaching limits for these resources:

* Remove unused API versions or revisions
* Consolidate or remove operations where appropriate
* Reorganize APIs with large numbers of operations into multiple smaller, more focused APIs
* Use API versions and revisions strategically

### Evaluate your service tier

If you're consistently hitting resource limits, it may be worth evaluating your current service tier. Certain limits such as for APIs vary by service tier.

* Consider options to add units or upgrade your tier. 
* Consider deploying an additional API Management instance in the current tier.

## Guidelines for limit increases

In some cases, you may want to request an increase to certain service limits. Before doing so, note the following guidelines:

* Explore strategies to address the issue proactively before requesting a limit increase. See the preceding [Strategies to manage resources](#strategies-to-manage-resources) section for more information.

* Consider potential impacts of the limit increase on overall service performance and stability. Increasing a limit might affect your service's capacity or cause increased latency in some service operations.

### Requesting a limit increase

To request a limit increase, create a support request from the Azure portal. For more information, see [Azure support plans](https://azure.microsoft.com/support/).

Requests for limit increases are evaluated on a case-by-case basis and aren't guaranteed. We prioritize Premium tier customers for limit increases.

## Related content

* [Capacity of an API Management instance](api-management-capacity.md)
* [Upgrade and scale an API Management instance](upgrade-and-scale.md)
