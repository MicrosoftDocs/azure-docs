---
title: Azure Service Health portal update
description: We're updating the Azure Service Health portal experience to let users engage with service events and manage actions to maintain the business continuity of impacted applications.
ms.topic: overview
ms.date: 06/10/2022
---

# Azure Service Health portal update

We're updating the Azure Service Health portal experience. The new experience lets users engage with service events and manage actions to maintain the business continuity of impacted applications.

We are rolling out the new experience in phases. Some users will see the updated experience below. Others will still see the [classic Service Health portal experience](service-health-overview.md). 

## Highlights of the new experience

-   **Tenant level view** - Users who are Tenant Admins can now see Service Issues that happen at a Tenant level. Service Issues blade and Health History blades are updated to show incidents both at Tenant and Subscription levels. Users can filter on the scope (Tenant or Subscription) within the blades. The scope column indicates when an event is at the Tenant or Subscription level. Classic view does not support tenant-level events. Tenant-level events are only available in the new user interface.
-   **Enhanced Map** - The Service Issues blade shows an enhanced version of the map with all the user services across the world. This version helps you find services that might be impacted by an outage easily.
-   **Issues Details** - The issues details look and feel has been updated, for better readability.
-   **Removal of personalized dashboard** - Users can no longer pin a personalized map to the dashboard. This feature has been deprecated in the new experience.

## Coming soon

The following user interfaces are updated to the new experience.

> [!div class="checklist"]
> * Security Advisories
> * Planned Maintenance
> * Health Advisories

## Service issues window

Groups of users will be automatically switched to the new Service Health experience over time. In the new experience, you can select \*\*Switch to Classic\*\* to switch back to the old experience.

:::image type="content" source="media/service-health-portal-update/services-issue-window-1.png" alt-text="A screenshot of the services issue user interface highlighting the switch to classic button.":::

In the new experience, you can now see events at both Tenant and Subscription level scope. If you have [tenant admin access](admin-access-reference.md#roles-with-tenant-admin-access), you can view events at the Tenant scope.

If you have Subscription access, then you can view events that impact all the subscriptions you have access to.

:::image type="content" source="media/service-health-portal-update/services-issue-window-2.png" alt-text="A screenshot of the services issue user interface highlighting the scope selection boxes of tenant and subscription.":::

You can use the scope column in the details view to filter on scope (Tenant vs Subscriber).

:::image type="content" source="media/service-health-portal-update/services-issue-window-3.png" alt-text="A screenshot of the services issue user interface highlighting the scope column.":::

## Health history window

You can now see events at both Tenant and Subscription level scope in Health History blade if you have Tenant level administrator access. The scope column in the details view indicates if the incident is a Tenant or Subscription level incident. You can also filter on scope (Tenant vs Subscriber).

:::image type="content" source="media/service-health-portal-update/health-history-window-1.png" alt-text="A screenshot of the health history user interface.":::
