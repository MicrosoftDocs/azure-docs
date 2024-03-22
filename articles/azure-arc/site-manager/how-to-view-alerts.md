---
title: "How to view and create alerts for a site"
description: "How to view and create alerts for a site"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 02/16/2024

---

# How to view alert status for a Arc Site

This article will detail how to view alert status for a Arc Site, which reflects the status for the overall site and enables the ability to view the alert status for support resources as well. The status of a overall site is based upon the underlying resources.

## Prerequisites

* Azure Portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least 1 compatible resource type for Site that reflects and supports alert status
* A site created for the associated resource group or subscription

## Alert status colors and meanings

* If the color in the portal is red, this means "Critical"
* If the color in the portal is orange, this means "Error"
* If the color in the portal is yellow, this means "Warning"
* If the color in the portal is blue, this means "Info"
* If the color in the portal is purple, this means "Verbose"
* If the color in the portal is green, this means "Up to Date"

## View alert status: site

To view alert status for a Arc site as a whole, the below steps can be followed from the main page of Azure Arc site manager. For this example, two sites have already been created, a "London" site and a "California" site. 

1. From Azure Arc site manager, navigate to the "Overview" page. 
![Site_Manager_Overview](./media/Overview_Sites_page.png)
2. In the "Overview" page, the alert status of the sites are shown below. This is the alert status of resources aggregated by sites. In the example below, this indicates that one site is "up to date" and one site "needs attention"
![Site_Manager_Overview_alerts](./media/site_manager_alert_status_overview_page.png)
3. To understand which site is "up to date" and which site "needs attention", click either the "sites" tab or the blue colored status text to be directed to the "sites" page.
![Site_Manager_Overview_alerts_details](./media/click_alert_status_site_details.png)
4. The "sites" page will appear and show the top-level status for each site, this reflects the most important status for the site. 
![Site_Manager_Overview_alerts_details_status_site_page](./media/site_alert_status_from_sites_page.png)

## View alert status: resource

1. Navigate to the main "site manager" page in "Azure Arc" and then to the "Sites" tab at the top of Azure Arc site manager. 
![Site_Manager_Overview_button_Page_again](./media/sites_button_from_site_manager.png)
2. From the "Sites" tab, view the top-level status for each site, this reflects the most important status for the site. To see resource status, click this. For this example, "London"'s alert status is clicked.
![Site_Manager_Overview_alerts_details_status_site_page_again](./media/site_alert_status_from_sites_page.png)
3. The alert status for each resource within "London" is visible, including the resource that had resulted in the top-level most important status. Which for "London" is "needs attention"
![Site_Manager_Overview_alerts_details_status_london](./media/london_resource_status_alerts.png)
