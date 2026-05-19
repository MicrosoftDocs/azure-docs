---
title: Review recommendations in Infrastructure Resiliency Manager
description: Learn how to review and act on resiliency recommendations for your service group resources and view resiliency at scale in Infrastructure Resiliency Manager (preview).
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 05/19/2026
ms.topic: how-to
ms.service: resiliency
#customer intent: As a cloud administrator, I want to review resiliency recommendations so that I can understand what actions to take to improve my application's zone resiliency.
---

# Review recommendations in Infrastructure Resiliency Manager (preview)

After goals are assigned to a service group, Infrastructure Resiliency Manager surfaces targeted recommendations for resources that don't meet your resiliency goals. You can also view resiliency at scale across all your service groups from a centralized overview.

## Prerequisites

- A service group with goals assigned. For more information, see [Create a service group](https://learn.microsoft.com/azure/governance/service-groups/create-service-group-portal).
- Required RBAC permissions: **Service Group Reader** role to view service group–level recommendations, and **Reader** on resources for resource-level recommendations. For more information, see the [support matrix](goals-recommendations-support-matrix.md#rbac-requirements-for-goals-and-recommendations).
- A usage plan enrolled for the service group.

## View recommendations

1. Navigate to your service group and open the **Goals and Recommendations** page.

2. Scroll to the **Recommendations** section. The list shows all recommendations for resources that aren't zone-resilient.

## View recommendation details

1. Select a recommendation to view its details, including:
   - Impacted resources
   - Rationale for the recommendation
   - Step-by-step remediation guidance

2. Review **cost implications** where available to understand the potential impact of implementing the recommendation.

## View resiliency at scale

Infrastructure Resiliency Manager provides a centralized overview that lets you monitor resiliency across all your resources and service groups from a single pane of glass.

### Resource-level view

1. In the Azure portal, search for **Resiliency** and navigate to the Resiliency dashboard. In the left navigation, expand **Infrastructure Resiliency** to see the following menu items: **Overview**, **Resource Resiliency**, **Service Group Resiliency**, **Recommendations**, **Recovery Plans**, **Drills**, and **Usage Plans**.

2. Under **Resource resiliency**, view the counts of resources across all service groups by resiliency status.

3. Select the tile to see individual resources and their zone-resiliency status.

4. For non-resilient resources, select **View Recommendation** to see the relevant recommendation details.

### Create a service group from the at-scale view

1. In the resource-level view, select the resources you want to group and select **Create Service group**.

2. Enter the service group name and parent service group.

3. Review the pre-populated members and select **Create**.

### Service group–level view

1. In the resiliency overview, navigate to the **Service group resiliency** section.

2. View the counts of service groups by their resiliency status.

3. Select a tile to view the detailed list of service groups and their posture.

> [!NOTE]
> Manually attested resources may display differently across the resource-level and service group–level views.

## Related content

- [Assign goals and view resiliency posture](goals-recommendations-assign-goals-view-posture.md)
- [Use the Resiliency agent](goals-recommendations-use-agent.md)
- [About goals and recommendations in Infrastructure Resiliency Manager (preview)](goals-recommendations-about.md)
