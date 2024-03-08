---
title: Azure Service Health portal update
description: We're updating the Azure Service Health portal experience to let users engage with service events and manage actions to maintain the business continuity of impacted applications.
ms.topic: overview
ms.date: 06/10/2022
---

# Azure Service Health portal update

We're updating the Azure Service Health portal experience. The new experience lets users engage with service events and manage actions to maintain the business continuity of impacted applications.

The new experience will be rolled out in phases. Some users will see the updated experience, while others will still see the [classic Service Health portal experience](service-health-overview.md). In the new experience, you can select \*\*Switch to Classic\*\* to switch back to the old experience.

:::image type="content" source="media/service-health-portal-update/services-issue-window-1.png" alt-text="A screenshot of the services issue user interface highlighting the switch to classic button." lightbox="media/service-health-portal-update/services-issue-window-1.png":::

## Highlights of the new experience

##### Health Alerts Blade
The Health Alerts blade has been updated for better usability. Users can search for and sort their alert rule by name. Users can also group their alert rules by subscription and status.

:::image type="content" source="media/service-health-portal-update/health-alerts-filter.png" alt-text="A screenshot highlighting the health alerts blade filters." lightbox="media/service-health-portal-update/health-alerts-filter.png":::

In the new updated Health Alerts experience, users can click on their alert rule for additional details and see their alert firing history. 

:::image type="content" source="media/service-health-portal-update/health-alerts-history.png" alt-text="A screenshot highlighting alerts history" lightbox="media/service-health-portal-update/health-alerts-history.png":::

>[!Note]
>The classic experience for the Health Alerts blade will be retired. Users will not be able to switch back from the new experience once it is rolled out.

##### Tenant Level View
  Users with [tenant admin access](admin-access-reference.md#roles-with-tenant-admin-access), can now view events at the tenant scope. The Service Issues, Health Advisories, Security Advisories, and Health History blades are updated to show events both at tenant and subscription levels. 

:::image type="content" source="media/service-health-portal-update/services-issue-window-2.png" alt-text="A screenshot of the services issue user interface highlighting the scope selection boxes of tenant and subscription." lightbox="media/service-health-portal-update/services-issue-window-2.png":::

##### Filtering and Sorting
Users can filter on the scope (tenant or subscription) within the blades. The scope column indicates when an event is at the tenant or subscription level. Classic view does not support tenant-level events. Tenant-level events are only available in the new user interface.

:::image type="content" source="media/service-health-portal-update/services-issue-window-3.png" alt-text="A screenshot of the services issue user interface highlighting the scope column." lightbox="media/service-health-portal-update/services-issue-window-3.png":::

##### Enhanced Map
The Service Issues blade shows an enhanced version of the map with all the user services across the world. This version helps you find services that might be impacted by an outage easily. 

##### Issues Details
The issues details look and feel has been updated, for better readability. 

##### Removal of Personalized Dashboard
Users can no longer pin a personalized map to the dashboard. This feature has been deprecated in the new experience.

## Coming Soon

The following user interface(s) will be updated to the new experience.

> [!div class="checklist"]
> * Planned Maintenance
