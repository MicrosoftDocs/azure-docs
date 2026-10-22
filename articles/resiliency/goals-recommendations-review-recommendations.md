---
title: Review recommendations in Infrastructure Resiliency Manager
description: Learn how to review and act on resiliency recommendations for your service group resources. Also, view resiliency at scale in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 10/12/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to review resiliency recommendations so that I can understand what actions to take to improve my application's zone resiliency.
---

# Review recommendations in Infrastructure Resiliency Manager (preview)

After you assign goals to a service group, Infrastructure Resiliency Manager shows targeted recommendations for resources that don't meet your resiliency goals. You can also view resiliency at scale across all your service groups from a centralized overview.

## Prerequisites

- A service group with goals assigned. For more information, see [Create a service group](../governance/service-groups/create-service-group-portal.md).
- Required Azure role-based access control (RBAC) permissions: **Service Group Reader** role to view service group–level recommendations, and **Reader** on resources for resource-level recommendations. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).

> [!NOTE]
> You don't need a usage plan to view resilience posture or recommendations.

## View recommendations

To view recommendations, follow these steps:

1.	Go to your **service group** and select **Goals and Recommendations**.

2. Scroll to the **Recommendations** section. The list shows all recommendations for resources that aren't zone resilient.

## View recommendation details

To view recommendation details, follow these steps:

1. Select a recommendation to view its details, including:
   - Impacted resources
   - Rationale for the recommendation
   - Step-by-step remediation guidance

2. Review **cost implications** where available to understand the potential impact of implementing the recommendation.

## View resiliency at scale

Infrastructure Resiliency Manager provides a centralized overview that you can use to monitor resilience across all your resources and service groups from a single pane of glass.

### Resource-level view

To view resilience status at scale for your resources, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), search for **Resiliency** and go to the **Resiliency** dashboard. In the left menu, expand **Infrastructure Resiliency** to see the following menu items: **Overview**, **Resource Resiliency**, **Service Group Resiliency**, **Recommendations**, **Recovery Plans**, **Drills**, and **Usage Plans**.

2. Under **Resource resiliency**, view the counts of resources across all service groups by resilience status.

3. Select the **Resource resiliency** tile to see individual resources and their zone-resilience status.

4. For nonresilient resources, select **View Recommendation** to see the relevant recommendation details.

### Create a service group from the at-scale view

To create a service group from the at-scale view, follow these steps:

1. In the **resource-level** view, select the resources you want to group and select **Create Service group**.

2. Enter the **service group name** and **parent service group**.

3.	Review the prepopulated members and select **Create**.

### Service group–level view

1. In the **Resiliency overview**, go to **Service group resiliency**.

2. View the counts of service groups by their resilience status.

3. Select a tile to view the detailed list of service groups and their posture.

## Related content

- [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md)
- [Use the Resiliency agent](goals-recommendations-use-agent.md)
- [About goals and recommendations in Infrastructure Resiliency Manager (preview)](goals-recommendations-about.md)
