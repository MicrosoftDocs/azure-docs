---
title: Known issues
description: "Known issues in site manager"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: troubleshooting-known-issue #Don't change
ms.date: 04/18/2024

#customer intent: As a customer, I want to understand how to resolve known issues I experience in site manager.

---


# Known issues in Azure Arc site manager (preview)

This article identifies the known issues and when applicable their workarounds in Azure Arc site manager.

This page is continuously updated, and as known issues are discovered, they're added.  

> [!IMPORTANT]
> Azure Arc site manager is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Known issues 

|Feature  |Issue  |Workaround  |
|---------|---------|---------|
| Filtering | When you select on sites with connectivity issues, it isn't possible to filter the sites list view into those with connectivity issues. Similar issue at the resource level. | This is a known issue with no current workaround. |
| Microsoft.Edge Resource Provider | "Not Registered" occurs. User doesn't have the right permissions to register the Common Edge resource provider, they run into issues with the monitoring areas within sites | Request that your subscription administrator register the Microsoft.Edge resource provider. |
| Site Creation | During site creation, resource group is greyed out and unable to be selected. | This is presently by design, resource groups can't be associated to duplicate sites. This indicates that the resource group has already been associated to a site previously. Locate that associated site and make the desired changes to that site. |
| Site Creation | Error: "Site already associated with subscription scope" occurs during site creation | This is presently by design, subscriptions can't be associated to duplicate sites. This indicates that the subscription has already been associated to a site previously. Locate that associated site and make the desired changes to that site. |
| Sites tab view | In the sites tab view, a resource isn't showing up (visible) | Ensure that the resource is a supported resource type for sites. This likely is occurring as the resource isn't currently supported for sites |
| Site manager | Site manager isn't displaying, or searching, or visible anywhere in Azure portal | Check the url being used while in the Azure portal, you might have a text in the url that is preventing site manager from displaying or being searchable. Try to restart your Azure portal session and ensure your url doesn't have any extra text. |
| Resource status in site manager | Connectivity, alerts, and/or update status aren't showing | Site manager is unable to display status for resources in the following regions: Brazil South, UAE North, South Africa North |


