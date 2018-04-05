---
title: Privileged Identity Management for Azure Resources - Discover and manage Azure resources| Microsoft Docs
description: Describes how to protect Azure resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/30/2018
ms.author: billmath
---


# Discover and manage Azure resources

If your organization is already using Azure AD PIM to protect administrators in your directory or you're a subscription owner looking to secure production resources you're in the right place.

When you first enable PIM for Azure resources, you need to discover and select resources to protect with PIM. There is no limit to the number of resources you can manage with PIM, but we recommend starting with your most critical (production) resources first.

> [!Note]
> Only subscription resources can be searched and selected for management. Choosing to manage a Subscription in PIM will enable management for all child resources as well.

## Discover resources

Navigate to Azure AD PIM and select Azure resources in the Manage section of the left navigation menu.

![](media/azure-pim-resource-rbac/aadpim_manage_azure_resources.png)

If this is your first time using PIM for Azure resources you'll need to run discovery to find resources to manage.
Click the "Discover resources" button in the center of the screen to launch the discovery experience.

![](media/azure-pim-resource-rbac/aadpim_first_run_discovery.png)

If another resource or directory administrator in your organization is already managing an Azure resource with PIM, or you have an eligible role assignment for a resource, the list view will contain the message: "Discover resources or activate an eligible role assignment to continue". 

![](media/azure-pim-resource-rbac/aadpim_discover_eligible_not_active.png)

When you select the button, in the action bar, or the middle of the screen to Discover resources, you'll see a list of subscriptions available for management. At this point, if you see highlighted subscriptions it indicates they are protected by PIM.

> [!Note]
> To prevent another resource administrator from removing PIM settings, once a subscription is managed it cannot be unmanaged.

![](media/azure-pim-resource-rbac/aadpim_discovery_some_selected.png)

Hover over a subscription you would like to protect with PIM and select the box on the far left of the row. You may select multiple subscriptions at a time.

![](media/azure-pim-resource-rbac/aadpim_discovery_all_selected.png)

To initiate the onboarding process select the "Manage resource" button in the bar at the top of the screen.

![](media/azure-pim-resource-rbac/aadpim_discovery_click_manage.png)

The selected resources are now managed by PIM. Close the discovery screen using the "X" in the upper right corner of the page, and click refresh in the bar at the top of the Manage Azure resources screen to begin managing PIM settings and assigning members.

![](media/azure-pim-resource-rbac/aadpim_discovery_resources_refresh.png)

## Next steps

[Configure role settings](pim-resource-roles-configure-role-settings.md)

[Assign roles in PIM](pim-resource-roles-assign-roles.md)
