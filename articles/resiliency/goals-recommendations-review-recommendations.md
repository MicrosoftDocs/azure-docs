---
title: Review recommendations in Infrastructure Resiliency Manager
description: Learn how to review and act on resiliency recommendations for your service group resources. Also, view resiliency at scale in Infrastructure Resiliency Manager.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 11/02/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to review resiliency recommendations so that I can understand what actions to take to improve my application's zone resiliency.
---

# Review recommendations in Infrastructure Resiliency Manager

After you assign goals to a service group, Infrastructure Resiliency Manager shows targeted recommendations for resources that don't meet your resiliency goals. You can also view resiliency at scale across your resources and service groups from the **Resiliency** overview.

## Prerequisites

- For service group–level goal-based recommendations, a service group with goals assigned. For more information, see [Create a service group](../governance/service-groups/create-service-group-portal.md) and [Assign goals](goals-recommendations-assign-goals-view-posture.md#assign-goals-to-a-service-group). You don't need to create a service group to use the resource-level overview.
- Required Azure role-based access control (RBAC) permissions: **Service Group Reader** role to view service group–level recommendations, and **Reader** on resources for resource-level recommendations. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

> [!NOTE]
> You don't need a usage plan to view resilience posture or recommendations at no additional cost. If a service group with assigned goals is enrolled in a valid usage plan, it's billed even without drills or recovery plans. To retain only the free capabilities without these charges, remove the service group's usage-plan enrollment. See [Billing and pricing](infrastructure-resiliency-manager-pricing.md).

## View recommendations

To view recommendations, follow these steps:

1. Go to your **service group** and select **Goals and Recommendations**.

2. Scroll to the **Recommendations** section. The list shows all recommendations for resources that aren't zone resilient.

## View recommendation details

To view recommendation details, follow these steps:

1. Select a recommendation to view its details, including:
   - Impacted resources
   - Rationale for the recommendation
   - Step-by-step remediation guidance

2. Review **cost implications** where available to understand the potential impact of implementing the recommendation.

## View resiliency at scale

The **Resiliency** overview provides resource-level and service group–level views of resilience posture, backup protection, and recommendations. For more details, see [View resilience posture at scale](infrastructure-resiliency-manager-overview.md#view-resilience-posture-at-scale).

### Resource-level view

To view resilience status at scale for your resources, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), search for **Resiliency** and open it.

2. Select **Overview** in the left menu, and then select the **Resource resiliency** tab.

3. Under **Resiliency insights**, review the **Zonally Resilient** and **Backup Enabled** summaries. Zone resilience and backup protection are separate indicators.

4. Under **Top resource recommendations**, review recommendations by impact. Select **View all resource recommendation** to open the resource recommendations list.

5. In **Recent Resources**, review individual resources and their **Zonal resilient state** and **Backup enabled** values. Select **View recommendation** for a resource to review the relevant recommendation.

To open the infrastructure-specific resource view, expand **Infrastructure resiliency** in the left menu and select **Resources**.

### Create a service group from the at-scale view

To create a service group from the at-scale view, follow these steps:

1. On **Overview**, go to **Service Group Resiliency** or **Resource Resiliency** views.

2. Select **Create Service Group** and enter the basic details.

3. Assign the appropriate **Criticality** to your service group.

4. Add members to the service group and select **Create**.

### Service group–level view

1. In **Resiliency**, select **Overview** in the left menu, and then select the **Service group resiliency** tab.

2. Under **Service group resiliency**, review **Criticality and Goals**, **Resilience State**, and **Drills and Recovery Plan State** to identify resilience configuration and validation recovery gaps.

3. Under **Top recommendations**, review recommendations by impact. Select **View all** to open the recommendations list.

4. In **Recent Service groups**, review each service group's criticality tier, zonal resilience state, last drill information, and backup-enabled resources. Select a service group name to view its details, or select **View recommendation** to review its recommendations.

To open the infrastructure-specific service group view, expand **Infrastructure resiliency** in the left menu and select **Service groups**. For guidance on goal-based evaluation and resource overrides, see [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md).

## Related content

- [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md)
- [Use the Resiliency agent](goals-recommendations-use-agent.md)
- [About goals and recommendations in Infrastructure Resiliency Manager](goals-recommendations-about.md)
