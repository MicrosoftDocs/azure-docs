---
title: Assign goals and view resiliency posture in Infrastructure Resiliency Manager
description: Learn how to set up prerequisites, assign resiliency goals, view posture, exclude or attest resources, and rediscover resources in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 05/19/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to assign resiliency goals and view posture so that I can track and manage the zone resiliency of my service group resources.
---

# Assign goals and view resiliency posture in Infrastructure Resiliency Manager (preview)

This article describes how to  assign resiliency goals to a service group, view your resiliency posture, and manage resource evaluation. It covers key concepts, supported scenarios, and how to exclude or manually attest resources to improve the accuracy of your resilience posture and receive more targeted recommendations.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- A service group created with the required resources. For more information, see [Create a service group](../governance/service-groups/create-service-group-portal).
- A [usage plan](#enroll-in-a-usage-plan) enrolled for the service group.
- **Service Group Contributor** (or alternately, **Azure Resilience Management Goals Contributor**) access to the service group for assigning goals. See the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations) for role requirements per scenario.

## Supported scenarios

- Goals can't be assigned to service groups that contain 500 or more resources.

## Enroll in a usage plan

Before you assign goals or use any capabilities, you must enroll your service group in a usage plan. If you don’t configure a usage plan, a callout appears in the portal prompting you to enroll.

A usage plan tells Azure which subscription should be billed when pricing takes effect at General Availability (GA). Setting up a usage plan now means you won't need to configure it later.

Infrastructure Resiliency Manager offers two usage plan tiers:

| Tier | Capabilities included |
|---|---|
| **Basic** | Goals and resiliency summaries — resiliency posture tracking along with actionable recommendations for your service groups. |
| **Standard** | Everything in Basic, plus recovery and drill capabilities — run simulated outage drills and validate your recovery readiness. |

You can change your tier at any time, so start with whichever fits your current needs.

## Assign goals to a service group

To understand your service group's resiliency status and receive tailored recommendations, you must first assign goals. Follow these steps:

1. Navigate to your service group in the Azure portal.

2. Select the **Goals and Recommendations** tab > **Assign goals**. A confirmation pane appears. 

3. Select **Save** to confirm. The system begins to discover resources in the service group and assigns goals. This process might take a few minutes to complete.

4. After discovery completes, you can see a summary of your protection status and any recommendations.

## View resiliency summary

After you assign goals to a service group, you can view the resiliency posture summary to understand the distribution of resources by their zone-resiliency status.

**Required permissions:** **Service Group Reader** role to view counts, and **Reader** on resources to view the detailed resource list. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

The resource count reflects all resources under the service group that the user assigning the goal (or triggering rediscovery) has access to. This count includes resources under any child service groups, subscriptions, or resource groups that belong to the service group, with each resource counted only once.

The summary view shows the distribution of resources by zone-resiliency status:

- **Zone resilient** — Resources configured with an Azure-recommended solution for zone resiliency. You can also manually attest resources by using custom solutions that the service can’t detect.
- **Non zone-resilient** — Resources for which no zone resiliency solution is detected.
- **Not evaluated** — Resources excluded from evaluation by the user, or unsupported by the service.

### View the detailed resource list

1. Select the summary tile to view the detailed resource list.

2. The resource list shows:
   - The zonal resiliency solution configured for each resource.
   - Whether each resource is included or excluded from evaluation.

## Override resiliency assessment

In some cases, you might need to override the default resiliency assessment provided by the service. This helps ensure that recommendations align with your architectural decisions and operational context.

### Exclude non-critical resources

Not all resources in a service group require zonal resiliency. You can exclude non-critical resources from evaluation so that they don't affect your resiliency posture summary. For example, storage accounts used solely for telemetry logging might not require zone resiliency and can be excluded from evaluation.

**Required permissions:** **Service Group Contributor** role. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. Navigate to the resiliency summary tile and open the resource list view.

2. Select the resource you want to exclude, and then select **Include/Exclude Resources**.

3. Set **Target State** to **Excluded** and select the reason: **Zone resiliency not required for this resource**.

4. After you save, the exemption status for the resource shows as **Excluded** and is counted under **Not Evaluated** in the resiliency summary.

### Manually attest resources

Some resources are resilient by design, even if Azure can't automatically detect their configuration. For example, single-instance virtual machines (VMs) deployed across multiple zones, where resiliency is managed at the application level. In such cases, you can manually mark these VMs as compliant to prevent them from being flagged in recommendations.

**Required permissions:** **Service Group Contributor** (or alternately **Azure Resilience Management Goals Contributor**) role. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. Navigate to the resiliency summary tile in the service group and open the resource list view.

2. Select the resource you want to attest, and then select **Include/Exclude Resources**.

3. Set **Target State** to **Excluded** and select the reason: **Ensuring zone resilience via custom solution**.

4. After you save, the exemption status for the resource shows as **Manually attested** and is counted under **Zone resilient** in the resiliency summary.

## Rediscover resources

Over time, there might be changes to your service group, such as resources being added or deleted. To ensure that your resiliency posture view reflects the latest state of the service group, trigger **Re-discover resources** to evaluate new resources for their zone resiliency status.

**Required permissions:** **Service Group Contributor** role (or alternately, **Azure Resilience Management Goals Contributor**) and **Microsoft.Relationship/ServiceGroupMember/read** on the resources. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

1. Navigate to your service group in the Azure portal.

2. Under **Resilience**, select **Goals and Recommendations**.

3. Select **Re-discover resources**.

## Important considerations

- The current release of Infrastructure Resiliency Manager supports only zonal resilience goals. 
- Infrastructure Resiliency Manager is completely free to use during the preview period. Creating a usage plan doesn't incur any charges during preview. 
- Enabling zonal resiliency for a specific service (for example, PostgreSQL) might incur additional charges based on that service's own pricing.
- Newly added resources are not automatically refreshed after goal assignment. [Rediscovery](#rediscover-resources) is required to include them. 
- By default, all supported resource types are included in the goal evaluation.
- There might be a temporary discrepancy between the recommendation count and the non-resilient resource count. This is because the recommendations take a few hours to get updated. Use the summary tile to get the latest resilience posture of the service group.
- Resource types that aren't supported by the service are automatically excluded from goal evaluation and can't be included. However, if you are already ensured resiliency for these resources, you can manually attest them to reflect their resiliency status in the summary view.
- Rediscovery evaluates only the resources accessible to the user who starts the action. Different users with different access levels can produce different rediscovery results. 
- For example, if User 1 has service group membership read access to resources A, B, and C and runs rediscovery, the service evaluates A, B, and C. If User 2 later runs rediscovery and has access only to resources B and C, only B and C are evaluated.
- **Recommendation:** Limit who can run rediscovery and ensure those users have access to the full set of service group resources. This helps keep rediscovery results consistent and complete.

## Supported resource types and solutions

Refer to the Goals and Recommendations support matrix to understand the supported resource types and the zonal resiliency solutions that the system detects today.

## Data handling and security

Infrastructure Resiliency Manager uses on-behalf-of (OBO) tokens to securely perform actions in your Azure environment based on your permissions. These tokens ensure operations are authorized and scoped to your access.

OBO tokens are stored securely, aren't directly accessible, and are used only to support service workflows. They're automatically deleted within 28 days, in line with applicable data protection requirements.

## Next step

- [Review recommendations](goals-recommendations-review-recommendations.md)