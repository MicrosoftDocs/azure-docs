---
title: "How to CRUD a site"
description: "Describes how to CRUD a site."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 02/16/2024

#customer intent: As a <role>, I want <what> so that <why>.

---

# Create a site

This how to will guide you through how to create, modify, and delete a site.

## Prerequisites

* Azure Portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at-least 1 resource for Site

## Open Azure Arc site manager

Navigate to Azure Arc site manager either via the "Azure Arc" pane in Azure in which "Site manager" will be displayed on the left side. Alternatively, you can also search for "Azure Arc site manager" in the Azure Portal or "Sites - Azure Arc".

Once you locate "Azure Arc site manager", click to open the main page.

## Create your site

1. Click the blue box icon that says "Create a site"
2. Fill in the details for your first site. While these details may change, at the time of this article the required details are:
    * Site scope: subscription or resource group
     *Note:* The scope can be defined only at the time of creating a site and cannot be modified later. By defining the scope for a site, all the resources in the scope can be viewed and managed from site manager.
    * Site name: custom name for site
    * Display name: custom display name for site
    * Subscription: subscription for the site to be created under
    * Address: Physical address for a site
3. Once these details are provided, click "Review + create" and you will be brough to a summary page to review and confirm the site details prior to creation.
4. Click "Create" to create your site.

## View and Delete your site

1. Navigate to the "Sites" tab at the top of Azure Arc site manager.
2. Here you should find your created sites.
3. To manage your site, you can click the site to navigate to the specific site’s resource page and perform the delete action. If you wish to delete your site, you can also do so from within the created site.

    *Note:* Deleting a site does not affect the resources or the resource group and subscription in its scope. After a site is deleted, the resources of that site cannot be viewed or managed from site manager.

    *Note:* A new site can be created for the resource group or the subscription after the original site is deleted.
4. To view insights on your site, you can navigate to the "Overview" tab at the top of site manager.

## View and Modify your site

1. Navigate to the "Sites" tab at the top of Azure Arc site manager.
2. Here you should find your created sites.
3. To manage your site, you can click the site to navigate to the specific site’s resource page.

## Use your site

From within your site, you have the ability to certain function listed below:
* View resources
* Modify resources (modifications will effect the resources elsewhere as well)
* View connectivity status (when supported by resources)
* View update status (when supported by resources)
* View alerts (when supported by resources)

To access these functions:
1. Navigate to the "Sites" tab at the top of Azure Arc site manager.
2. You can click the site to navigate to the specific site’s resource page and perform the respective above actions. Some of these actions should also present themselves in the "Overview" at the top of site manager as well, which will provide a overview for many sites once multiple are created.

## Related content

- [Azure Arc](https://azure.microsoft.com/en-us/products/azure-arc/)