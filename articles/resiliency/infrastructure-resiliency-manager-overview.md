---
title: Infrastructure Resiliency Manager overview - Azure
description: Learn about Infrastructure Resiliency Manager in Resiliency in Azure and how to view resiliency posture across your resources and service groups at scale.
ms.topic: overview
ms.service: resiliency
ms.date: 07/28/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand Infrastructure Resiliency Manager and how to view my resiliency posture at scale across resources and service groups."
---

# Infrastructure Resiliency Manager overview (preview)

Infrastructure Resiliency Manager is the unified experience within Resiliency in Azure that helps you protect your applications from infrastructure outages with zone resiliency. It provides at-scale visibility into resiliency gaps across your Azure estate and offers integrated capabilities to define, validate, and achieve your applications' resiliency goals.

> [!NOTE]
> Infrastructure Resiliency Manager is a global, nonregional service that operates independently of any specific Azure region, enabling it to manage and orchestrate resources across all Azure regions.

## Supported capabilities

Infrastructure Resiliency Manager brings together the following capabilities under a single experience:

| Capability | Description |
|-----------|-------------|
| [At-scale resiliency posture](#view-resiliency-posture-at-scale) | View a summary of zone resiliency posture across all your resources and [service groups](goals-recommendations-assign-goals-view-posture.md) from a centralized overview. |
| [Goals and recommendations](goals-recommendations-about.md) | Set zonal resiliency goals for [service groups](goals-recommendations-assign-goals-view-posture.md), review targeted [recommendations](goals-recommendations-review-recommendations.md), and track progress toward meeting those goals. |
| [Availability Zone Down Drills](availability-zone-down-drills-about.md) | Simulate zone outages to assess the cross-zone resiliency of your applications and identify improvement areas. |
| [Recovery orchestration plan](recovery-orchestration-plan-about.md) | Orchestrate recovery across multiple resources within an application during zonal outages. |

## View resiliency posture at scale

Use **Resiliency** in the Azure portal to get comprehensive visibility into resiliency gaps across your Azure estate. The at-scale view shows a summary of your zone resiliency posture and associated recommendations.

Resiliency in Azure supports both resource-level and [service group-level](#manage-resiliency-at-a-service-group-level) perspectives. If you didn't yet create service groups, use the resource-level views to get a summary.

### Manage resiliency for your resources

The resource-level view provides a count of resources across your Azure estate, categorized by their zone resiliency status:

- **Zone resilient resources**: Resources configured with a zone resiliency solution.
- **Non-zone resilient resources**: Resources for which the system didn't detect the configuration of a zone resilient solution.

From this view, you can drill into individual resources, see their zone resiliency status, and access Advisor recommendations for non-resilient resources.

For step-by-step instructions on navigating the resource-level view, see [View resiliency at scale - Resource-level view](goals-recommendations-review-recommendations.md#resource-level-view).

> [!TIP]
> If you want a more tailored view for your scenario that ensures non-critical resources aren't flagged and you can manually attest resources that are made zone resilient through a custom setup, create [service groups](goals-recommendations-assign-goals-view-posture.md). You can create service groups directly from the Resiliency experience.

### Create a service group from resource view

You can create a service group directly from the resource resiliency view by selecting resources and grouping them into an application. After the service group is created, [assign goals](goals-recommendations-assign-goals-view-posture.md) to it for zone resiliency evaluation.

For step-by-step instructions, see [Create a service group from the at-scale view](goals-recommendations-review-recommendations.md#create-a-service-group-from-the-at-scale-view).

### Manage resiliency at a service group level

After you create the required [service groups](goals-recommendations-assign-goals-view-posture.md) and [assign goals](goals-recommendations-assign-goals-view-posture.md), you can view the resiliency summary across service groups. You can view the following information:

- **Zone resilient service groups**: Service groups where all resources (that aren't excluded) are configured with zone resiliency or manually attested by the user.
- **Non-zone resilient service groups**: Service groups where one or more resources aren't configured for zone resiliency.
- **Goals not assigned**: Service groups where goals aren't assigned yet.
- **Not evaluated service groups**: Service groups where one or more resources aren't supported by the Resiliency service and couldn't be evaluated.

From this view, you can drill into individual service groups to see detailed resiliency information, [include or exclude resources](goals-recommendations-assign-goals-view-posture.md), [manually attest resources](goals-recommendations-assign-goals-view-posture.md), and [review recommendations](goals-recommendations-review-recommendations.md).

For step-by-step instructions, see [View resiliency at scale - Service group–level view](goals-recommendations-review-recommendations.md#service-grouplevel-view).

## When to use service groups

Create service groups for scenarios where you want to:

- **Get an application-centric view of resiliency posture.** Understand gaps and misses at an application level rather than reviewing individual resources in isolation.
- **Model shared resources across applications.** Represent scenarios where a single resource is shared across multiple applications by including it in more than one service group.
- **Group resources across subscriptions, resource groups, and tags.** Define application boundaries that span different subscriptions, resource groups, or tag values within your Azure estate.
- **Scope out non-critical resources.** Exclude resources that don't require zone resiliency from evaluation to reduce noise and focus on what matters.

## Next steps

- [About goals and recommendations](goals-recommendations-about.md)
- [About Availability Zone Down Drills](availability-zone-down-drills-about.md)
- [About Recovery Orchestration Plan](recovery-orchestration-plan-about.md)
- [Assign goals and view resiliency posture](goals-recommendations-assign-goals-view-posture.md)
