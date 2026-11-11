---
title: Assign goals and view resilience posture in Infrastructure Resiliency Manager
description: Learn how to set up prerequisites, assign resilience goals, view posture, exclude or attest resources, and rediscover resources in Infrastructure Resiliency Manager.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/11/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to assign resilience goals and view posture so that I can track and manage the zone resilience of my service group resources.
---

# Assign goals and view resilience posture in Infrastructure Resiliency Manager

This article describes how to assign resilience goals to a service group, view your resilience posture, and manage resource evaluation. It covers key concepts, supported scenarios, and how to exclude or manually attest resources to improve the accuracy of your resilience posture and receive more targeted recommendations.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- A service group created with the required resources. For more information, see [Create a service group](../governance/service-groups/create-service-group-portal.md).
- **Service Group Contributor** (or alternately, **Azure Resilience Management Goals Contributor**) access to the service group for assigning goals. See the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations) for role requirements per scenario.

> [!NOTE]
> You don't need a usage plan to assign goals, view resilience posture, or review recommendations at no additional cost. A usage plan is required for paid advanced capabilities such as Zone Down Drills and Recovery Orchestration Plans. If a service group with assigned goals is enrolled in a valid usage plan, it's billed even without drills or recovery plans. To retain only the free capabilities without these charges, remove the service group's usage-plan enrollment. See [Billing and pricing](infrastructure-resiliency-manager-pricing.md).

## Supported scenario

You can assign goals to service groups with up to **500** resources.

[Learn more about the supported scenarios, limitations, and Azure role-based access control (RBAC) roles for goals and recommendations](goals-recommendations-support-matrix.md).

## Assign goals to a service group

To understand your service group's resilience status and receive tailored recommendations, you must first assign goals. As part of assigning goals, you set the service group's criticality and can optionally link service level indicators (SLIs). Follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **service group**.

1. Select the **Goals and Recommendations** tab > **Assign goals**. If goals are already assigned, select **Edit goals** instead.

    The **Edit resiliency goals** page opens.

1. On the **Goal selection** tab, under **Service group details**, review the **Service group name** and set the **Criticality** tier that matches your workload, for example **Tier 0 - Mission-critical**.

    > [!NOTE]
    > All resources in the service group are automatically scoped. You can include or exclude resources separately after the goals are assigned. For more information, see [Override resilience assessment](#override-resilience-assessment).

1. Under **Zonal resiliency**, select the **Track this service group against a zonal resiliency goal** checkbox to enable the zone resilience goal. For **Tier 0 - Mission-critical** service groups, this goal is assigned automatically. For more information, see [Service group criticality](#service-group-criticality).

1. Select **Next** to go to the **Monitoring (SLI)** tab. This step is optional. You can link up to one **Availability SLI** and one **Latency SLI** from Azure Monitor. For more information, see [Track application health with service level indicators](#track-application-health-with-service-level-indicators).

1. Select **Review + Assign** to go to the **Review + assign** tab. Review your selections, and then select **Assign**.

    The system begins to discover resources in the service group and assigns goals. This process might take a few minutes to complete.

1. After discovery completes, you can see a summary of your protection status and any recommendations.

### Service group criticality

Service group criticality is a tier that you assign to show how important the workload in a service group is to your business. Set it on the **Goal selection** tab of the **Edit resiliency goals** page, under **Service group details** > **Criticality**. Infrastructure Resiliency Manager uses a four-tier scale:

- **Tier 0 - Mission-critical**: Workloads that are vital to business continuity, where even brief downtime causes major financial or operational impact.
- **Tier 1 - Business-critical**: Customer-facing or revenue-impacting workloads that tolerate only minimal downtime or data loss.
- **Tier 2 - Business-operational**: Workloads that support internal operations and can tolerate a few hours of downtime.
- **Tier 3 - Administrative**: Internal tools and noncritical services with a higher tolerance for outages.

Criticality applies to the whole service group, so every resource in it is held to the same resilience standard. Infrastructure Resiliency Manager doesn't detect criticality automatically. Choose the tier based on your own business impact analysis.

Criticality affects how goals are assigned and evaluated:

- **Tier 0 service groups get a zone resilience goal automatically.** When you set a service group to **Tier 0 - Mission-critical**, Infrastructure Resiliency Manager automatically assigns the zone resilience goal to it. You don't need to assign the goal manually.
- **A resource shared across service groups follows the higher tier.** A resource can belong to more than one service group. If those service groups have different criticality tiers, the resource is evaluated against the goals of the higher-tier (more critical) service group. This approach makes sure that the most critical service group stays resilient. For example, if a database belongs to both a Tier 0 service group and a Tier 2 service group, it's evaluated against the Tier 0 service group's goals.

### Track application health with service level indicators

A zone resilience goal tells you whether your resources are configured to withstand a zone outage. A service level indicator (SLI) tells you whether your application is meeting its availability or latency target. Add an SLI to your service group's goals to see both in one place.

Infrastructure Resiliency Manager uses SLIs that you create in Azure Monitor. You can add up to one availability SLI and one latency SLI to a goal. SLIs are created and managed separately in Azure Monitor. In Infrastructure Resiliency Manager, you link existing SLIs to your resiliency goals, and their targets and values are read-only.

**Prerequisites:** At least one availability or latency SLI in Azure Monitor. To create one, see [Create service level indicators in Azure Monitor](/azure/azure-monitor/fundamentals/service-level-indicators-create).

You can link SLIs when you first assign goals, or later by editing the goals. To link SLIs to existing goals, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **service group**.
1. Select the **Goals and Recommendations** tab > **Edit goals**.

    The **Edit resiliency goals** page opens.

1. Select the **Monitoring (SLI)** tab.
1. Next to **Availability SLI**, select **Select**, and then choose an availability SLI from Azure Monitor.
1. Next to **Latency SLI**, select **Select**, and then choose a latency SLI from Azure Monitor.

    You can link one SLI of each type, or only one of them. If you don't link an SLI, the field shows **None selected**.

<!-- TODO: Confirm the final button label on the Review + assign tab. -->
6. Select **Review + Assign**. Review your selections, and then select **Assign**.

After you assign the goals, the SLI's target and current value appear with your zone resilience posture. To create or update an SLI, go to [Azure Monitor](/azure/azure-monitor/fundamentals/service-level-indicators-create).

> [!TIP]
> You can also use the Resiliency Agent to find SLIs for your service group, get a recommendation, attach an SLI to your goal, and check how much error budget remains. For more information, see [Use Azure Copilot Resiliency Agent in Infrastructure Resiliency Manager](goals-recommendations-use-agent.md).


## View resilience summary

After you assign goals to a service group, you can view the resilience posture summary to understand the distribution of resources by their zone-resilience status.

**Required permissions:** **Service Group Reader** role to view counts, and **Reader** on resources to view the detailed resource list. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

The resource count reflects all resources under the service group that the user assigning the goal (or triggering rediscovery) has access to. This count includes resources under any child service groups, subscriptions, or resource groups that belong to the service group, with each resource counted only once.

The summary view shows the distribution of resources by zone-resilience status:

- **Zone resilient**: Resources configured with an Azure-recommended solution for zone resilience. You can also manually attest resources by using custom solutions that the service can't detect.
- **Non zone-resilient**: Resources for which no zone resilience solution is detected.
- **Not evaluated**: Resources excluded from evaluation by the user, or unsupported by the service.

### View the detailed resource list

1. Select the **summary** tile to view the detailed resource list.
1. The resource list shows:
   - The zone-resilience solution configured for each resource.
   - Whether each resource is included or excluded from evaluation.

## Override resilience assessment

In some cases, you might need to override the default resilience assessment provided by the service. This operation helps ensure that recommendations align with your architectural decisions and operational context.

### Exclude noncritical resources

Not all resources in a service group require zone resilience. You can exclude noncritical resources from evaluation so that they don't affect your resilience posture summary. For example, storage accounts used solely for telemetry logging might not require zone resilience and can be excluded from evaluation.

To exclude resources, you need the **Service Group Contributor** role. [Learn more about the role requirements in the support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

To exclude resources from evaluation, follow these steps:

1. Go to the **resilience summary** tile and open the **resource list** view.
1. Select the resource you want to exclude, and then select **Include/Exclude Resources**.
1. Set **Target State** to **Excluded** and select the reason: **Zone resiliency not required for this resource**.
1. After you save, the exemption status for the resource shows as **Excluded** and is counted under **Not Evaluated** in the **resilience summary**.

### Manually attest resources

Some resources are resilient by design, even if Azure can't automatically detect their configuration. For example, single-instance virtual machines (VMs) deployed across multiple zones, where resilience is managed at the application level. In such cases, you can manually mark these VMs as compliant to prevent them from being flagged in recommendations.

**Required permissions:** **Service Group Contributor** (or alternately **Azure Resilience Management Goals Contributor**) role. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. Go to the **resilience summary** tile in the service group and open the **resource list** view.
1. Select the resource you want to attest, and then select **Include/Exclude Resources**.
1. Set **Target State** to **Excluded** and select the reason: **Ensuring zone resilience via custom solution**.
1. After you save, the exemption status for the resource shows as **Manually attested** and is counted under **Zone resilient** in the **resilience summary**.

## Rediscover resources

Over time, there might be changes to your service group, such as resources being added or deleted. To ensure that your resilience posture view reflects the latest state of the service group, trigger **Re-discover resources** to evaluate new resources for their zone resilience status.

**Required permissions:** **Service Group Contributor** role (or alternately, **Azure Resilience Management Goals Contributor**) and **Microsoft.Relationship/ServiceGroupMember/read** on the resources. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. In the [Azure portal](https://portal.azure.com/), go to your **service group**.
1. Under **Resilience**, select **Goals and Recommendations**.
1. Select **Rediscover resources**.

## Important considerations

- The current release of Infrastructure Resiliency Manager supports zone resilience goals and optional availability and latency SLIs from Azure Monitor.
- Enabling zone resilience for a specific service (for example, PostgreSQL) might incur more charges based on that service's own pricing.
- Newly added resources aren't automatically refreshed after goal assignment. [Rediscovery](#rediscover-resources) is required to include them.
- By default, all supported resource types are included in the goal evaluation.
- Service groups set to **Tier 0 - Mission-critical** automatically get the zone resilience goal.
- If a resource belongs to multiple service groups with different criticality tiers, the resource follows the goals of the higher-tier service group.
- There might be a temporary discrepancy between the recommendation count and the nonresilient resource count. This discrepancy occurs because the recommendations take a few hours to get updated. Use the summary tile to get the latest resilience posture of the service group.
- Resource types that the service doesn't support are automatically excluded from goal evaluation and can't be included. If resilience is already in place for these resources, you can manually attest them to show their status in the summary view.
- Rediscovery evaluates only the resources accessible to the user who starts the action. Different users with different access levels can produce different rediscovery results.
- For example, if User 1 has service group membership read access to resources A, B, and C and runs rediscovery, the service evaluates A, B, and C. If User 2 later runs rediscovery and the user has access only to resources B and C, only B and C are evaluated.

## Recommendation

Limit rediscovery permissions to specific users, and ensure these users have access to the complete set of service group resources to maintain consistent and complete rediscovery results.

## Supported resource types and solutions

To understand the supported resource types and the zone resilience solutions that the system detects, see the [Goals and recommendations support matrix](goals-recommendations-support-matrix.md).

## Data handling and security

Infrastructure Resiliency Manager uses on-behalf-of (OBO) tokens to securely perform actions in your Azure environment based on your permissions. These tokens ensure operations are authorized and scoped to your access.

OBO tokens are stored securely, aren't directly accessible, and are used only to support service workflows. They're automatically deleted within 28 days, in line with applicable data protection requirements.

## Next step

- [Review recommendations](goals-recommendations-review-recommendations.md)