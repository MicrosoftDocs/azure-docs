---
title: Assign goals and view resilience posture in Infrastructure Resiliency Manager
description: Learn how to set up prerequisites, assign resilience goals, view posture, exclude or attest resources, and rediscover resources in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 10/12/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to assign resilience goals and view posture so that I can track and manage the zone resilience of my service group resources.
---

# Assign goals and view resilience posture in Infrastructure Resiliency Manager (preview)

This article describes how to assign resilience goals to a service group, view your resilience posture, and manage resource evaluation. It covers key concepts, supported scenarios, and how to exclude or manually attest resources to improve the accuracy of your resilience posture and receive more targeted recommendations.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- A service group created with the required resources. For more information, see [Create a service group](../governance/service-groups/create-service-group-portal.md).
- **Service Group Contributor** (or alternately, **Azure Resilience Management Goals Contributor**) access to the service group for assigning goals. See the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations) for role requirements per scenario.

> [!NOTE]
> You don't need a usage plan to assign goals, view resilience posture, or review recommendations. A usage plan is required only for advanced capabilities such as Zone Down Drills and Recovery Orchestration Plans.

## Supported scenario

You can assign goals to service groups with up to **500** resources.

[Learn more about the supported scenarios, limitations, and Azure role-based access control (RBAC) roles for goals and recommendations (preview)](goals-recommendations-support-matrix.md).

## Assign goals to a service group

To understand your service group's resilience status and receive tailored recommendations, you must first assign goals. Follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **service group**.

2. Select the **Goals and Recommendations** tab > **Assign goals**.

    A **confirmation** pane appears. 

3. Select **Save** to confirm. The system begins to discover resources in the service group and assigns goals. This process might take a few minutes to complete.

4. After discovery completes, you can see a summary of your protection status and any recommendations.

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

2. The resource list shows:
   - The zone-resilience solution configured for each resource.
   - Whether each resource is included or excluded from evaluation.

## Override resilience assessment

In some cases, you might need to override the default resilience assessment provided by the service. This operation helps ensure that recommendations align with your architectural decisions and operational context.

### Exclude noncritical resources

Not all resources in a service group require zone resilience. You can exclude noncritical resources from evaluation so that they don't affect your resilience posture summary. For example, storage accounts used solely for telemetry logging might not require zone resilience and can be excluded from evaluation.

To exclude resources, you need the **Service Group Contributor** role. [Learn more about the role requirements in the support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

To exclude resources from evaluation, follow these steps:

1. Go to the **resilience summary** tile and open the **resource list** view.

2. Select the resource you want to exclude, and then select **Include/Exclude Resources**.

3. Set **Target State** to **Excluded** and select the reason: **Zone resiliency not required for this resource**.

4. After you save, the exemption status for the resource shows as **Excluded** and is counted under **Not Evaluated** in the **resilience summary**.

### Manually attest resources

Some resources are resilient by design, even if Azure can't automatically detect their configuration. For example, single-instance virtual machines (VMs) deployed across multiple zones, where resilience is managed at the application level. In such cases, you can manually mark these VMs as compliant to prevent them from being flagged in recommendations.

**Required permissions:** **Service Group Contributor** (or alternately **Azure Resilience Management Goals Contributor**) role. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. Go to the **resilience summary** tile in the service group and open the **resource list** view.

2. Select the resource you want to attest, and then select **Include/Exclude Resources**.

3. Set **Target State** to **Excluded** and select the reason: **Ensuring zone resilience via custom solution**.

4. After you save, the exemption status for the resource shows as **Manually attested** and is counted under **Zone resilient** in the **resilience summary**.

## Rediscover resources

Over time, there might be changes to your service group, such as resources being added or deleted. To ensure that your resilience posture view reflects the latest state of the service group, trigger **Re-discover resources** to evaluate new resources for their zone resilience status.

**Required permissions:** **Service Group Contributor** role (or alternately, **Azure Resilience Management Goals Contributor**) and **Microsoft.Relationship/ServiceGroupMember/read** on the resources. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. In the [Azure portal](https://portal.azure.com/), go to your **service group**.

2. Under **Resilience**, select **Goals and Recommendations**.

3. Select **Re-discover resources**.

## Important considerations

- The current release of Infrastructure Resiliency Manager supports only zone resilience goals.
- Infrastructure Resiliency Manager is free to use during the preview period.
- Enabling zone resilience for a specific service (for example, PostgreSQL) might incur more charges based on that service's own pricing.
- Newly added resources aren't automatically refreshed after goal assignment. [Rediscovery](#rediscover-resources) is required to include them. 
- By default, all supported resource types are included in the goal evaluation.
- There might be a temporary discrepancy between the recommendation count and the nonresilient resource count. This discrepancy occurs because the recommendations take a few hours to get updated. Use the summary tile to get the latest resilience posture of the service group.
- Resource types that the service doesn't support are automatically excluded from goal evaluation and can't be included. If resilience is already in place for these resources, you can manually attest them to show their status in the summary view.
- Rediscovery evaluates only the resources accessible to the user who starts the action. Different users with different access levels can produce different rediscovery results. 
- For example, if User 1 has service group membership read access to resources A, B, and C and runs rediscovery, the service evaluates A, B, and C. If User 2 later runs rediscovery and the user has access only to resources B and C, only B and C are evaluated.

## Recommendation

Limit rediscovery permissions to specific users, and ensure these users have access to the complete set of service group resources to maintain consistent and complete rediscovery results.

## Supported resource types and solutions

To understand the supported resource types and the zone resilience solutions that the system detects, see the [Goals and recommendations support matrix (preview)](goals-recommendations-support-matrix.md).

## Data handling and security

Infrastructure Resiliency Manager uses on-behalf-of (OBO) tokens to securely perform actions in your Azure environment based on your permissions. These tokens ensure operations are authorized and scoped to your access.

OBO tokens are stored securely, aren't directly accessible, and are used only to support service workflows. They're automatically deleted within 28 days, in line with applicable data protection requirements.

## Next step

- [Review recommendations](goals-recommendations-review-recommendations.md)