---
title: "How to view connectivity status"
description: "How to view connectivity status "
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 02/16/2024



---
# How to view connectivity status for an Arc Site

This article details how to view connectivity status for an Arc Site, which reflects the status for the overall site and enables the ability to view the connectivity status for support resources as well. The status of an overall site is based upon the underlying resources.

## Prerequisites

* Azure portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least one compatible resource type for Site that reflects and supports connectivity status
* A site created for the associated resource group or subscription

## Connectivity status colors and meanings

* If the color in the portal is red, this means **Needs Attention**
* If the color in the portal is yellow, this means **Not Connected Recently**
* If the color in the portal is green, this means **Connected**

## View connectivity status: site

To view connectivity status for an Arc site as a whole, the below steps can be followed from the main page of Azure Arc site manager. For this example, two sites have already been created, a **London** site and a **California** site. 

1. From Azure Arc site manager, navigate to the **Overview** page. 
![Site_Manager_Overview](./media/Overview_Sites_page.png)
2. In the **Overview** page, the connectivity statuses of the sites are shown below. This is the connectivity status of resources aggregated by sites. In the example below, this indicates that one site is **up to date** and one site **needs attention**
![Site_Manager_Overview_connectivity](./media/site_connection_overview.png)
3. To understand which site is **up to date** and which site **needs attention**, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.
![Site_Manager_Overview_connectivity_details](./media/click_connectivity_status_site_details.png)
4. The **sites** page will appear and show the top-level status for each site, this reflects the most important status for the site. 
![Site_Manager_Overview_connectivity_details_status_site_page](./media/site_connectivity_status_from_sites_page.png)

## View connectivity status: resource

1. Navigate to the main **site manager** page in **Azure Arc** and then to the **Sites** tab at the top of Azure Arc site manager. 
![Site_Manager_Overview_button_Page_again](./media/sites_button_from_site_manager.png)
2. From the **Sites** tab, view the top-level status for each site, this reflects the most important status for the site. To see resource status, select this. For this example, **London's** connectivity status is clicked.
![Site_Manager_Overview_connectivity_details_status_site_page_again](./media/site_connectivity_status_from_sites_page.png)
3. The connectivity status for each resource within **London** is visible, including the resource that had resulted in the top-level most important status. Which for **London** is **needs attention**
![Site_Manager_Overview_connectivity_details_status_london](./media/london_resource_status_connectivity.png)
