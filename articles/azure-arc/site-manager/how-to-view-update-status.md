---
title: "How to view update status for site"
description: "How to view update status for site"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 03/24/2024

# As a site admin, I want to know how to view update status for sites so that I can use my site.

---

# How to view update status for an Arc Site

This article details how to view update status for an Arc Site, which reflects the status for the overall site and enables the ability to view the update status for support resources as well. The status of an overall site is based upon the underlying resources.

## Prerequisites

* Azure portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least one compatible resource type for Site that reflects and supports update status
* A site created for the associated resource group or subscription

## Update status colors and meanings

* If the color in the portal is red, this means **Needs Attention**
* If the color in the portal is blue, this means **Update Available**
* If the color in the portal is yellow, this means **Update In Progress**
* If the color in the portal is green, this means **Up to Date**

## View update status: site

To view update status for an Arc site as a whole, the below steps can be followed from the main page of Azure Arc site manager. For this example, two sites have already been created, a **London** site and a **California** site. 

1. From Azure Arc site manager, navigate to the **Overview** page. 
![Site_Manager_Overview](./media/Overview_Sites_page.png)
2. In the **Overview** page, the update statuses of the sites are shown below. This is the update status of resources aggregated by sites. In the example below, this indicates that one site is **up to date** and one site **needs attention**
![Site_Manager_Overview_updates](./media/site_manager_update_status_overview_page.png)
3. To understand which site is **up to date** and which site **needs attention**, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.
![Site_Manager_Overview_updates_details](./media/click_update_status_site_details.png)
4. The **sites** page will appear and show the top-level status for each site, this reflects the most important status for the site. 
![Site_Manager_Overview_updates_details_status_site_page](./media/site_update_status_from_sites_page.png)

## View update status: resource

1. Navigate to the main **site manager** page in **Azure Arc** and then to the **sites** tab at the top of Azure Arc site manager. 
![Site_Manager_Overview_button_Page_again](./media/sites_button_from_site_manager.png)
2. Navigate next to the **sites** tab, view the top-level status for each site, this tab reflects the most important status for the site. To see resource status, select this. For this example, **London's** update status is clicked.
![Site_Manager_Overview_updates_details_status_site_page_again](./media/site_update_status_from_sites_page.png)
3. Finally, the update status for each resource within **London** is visible, including the resource that had resulted in the top-level most important status. Which for **London** is **needs attention**
![Site_Manager_Overview_updates_details_status_london](./media/london_resource_status_updates.png)
