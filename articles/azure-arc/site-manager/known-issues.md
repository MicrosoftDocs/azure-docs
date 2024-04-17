---
title: Known issues
description: "Known issues in site manager"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: issues #Don't change
ms.date: 03/29/2024

#customer intent: As a customer, I want to understand how to resolve known issues I experience in site manager.

---


# View known issues in Azure Arc site manager public preview

This article identifies the known issues and when applicable their workarounds in Azure Arc site manager.

This page is continuously updated, and as known issues are discovered, they're added.  

> [!IMPORTANT]
> This release is the first iteration of Public Preview and represents what is currently possible in Azure Arc site manager.

## Known issues 

|Feature  |Issue  |Workaround  |
|---------|---------|---------|
| Filtering | When you select on sites with connectivity issues, it isn't possible to filter the sites list view into those with connectivity issues. Similar issue at the resource level. | This is a known issue with no current workaround.
| Microsoft.Edge Resource Provider | "Not Registered" occurs. User doesn't have the right permissions to register the Common Edge RP, they run into issues with the monitoring areas within sites | This is a known issue with no current workaround. |
| Site Creation | During site creation, resource group is greyed out and unable to be selected. | This is presently by design, resource groups can't be associated to duplicate sites. This indicates that the resource group has already been associated to a site previously. Locate that associated site and make the desired changes to that site. 
| Site Creation | Error: "Site already associated with subscription scope" occurs during site creation | This is presently by design, subscriptions can't be associated to duplicate sites. This indicates that the subscription has already been associated to a site previously. Locate that associated site and make the desired changes to that site. |
| Sites tab view | In the sites tab view, a resource isn't showing up (visible) | Ensure that the resource is a supported resource type for sites. This likely is occurring as the resource isn't currently supported for sites |
| Site manager | Site manager isn't displaying, or searching, or visible anywhere in Azure portal | Check the url being used while in the Azure portal, you might have a text in the url that is preventing site manager from displaying or being searchable. Try to restart your Azure portal session and ensure your url doesn't have any extra text. 
| Resource status in site manager | Connectivity, alerts, and/or update status aren't showing | Site manager is unable to display resource status in the following regions: 


