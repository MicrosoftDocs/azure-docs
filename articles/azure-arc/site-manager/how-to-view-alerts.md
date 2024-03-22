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

# How to view alert status for an Arc Site

This article details how to view alert status for an Arc Site, which reflects the status for the overall site and enables the ability to view the alert status for support resources as well. The status of an overall site is based upon the underlying resources.

## Prerequisites

* Azure portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least one compatible resource type for Site that reflects and supports alert status
* A site created for the associated resource group or subscription

## Alert status colors and meanings

* If the color in the portal is red, this means **Critical**
* If the color in the portal is orange, this means **Error**
* If the color in the portal is yellow, this means **Warning**
* If the color in the portal is blue, this means **Info**
* If the color in the portal is purple, this means **Verbose**
* If the color in the portal is green, this means **Up to Date**

## View alert status: site

To view alert status for an Arc site as a whole, the below steps can be followed from the main page of Azure Arc site manager. For this example, two sites have already been created, a **London** site and a **California** site. 

1. From Azure Arc site manager, navigate to the **Overview** page. 
![site manager get started page directing to overview page](./media/how-to-view-alerts/overview_sites_page.png)
2. In the **Overview** page, the alert statuses of the sites are shown below. This is the alert status of resources aggregated by sites. In the example below, this indicates that one site is **up to date** and one site **needs attention**
![overview page showing the alerts area](./media/how-to-view-alerts/site_manager_overview_alerts.png)
3. To understand which site is **up to date** and which site **needs attention**, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.
![site manager overview page directing to the sites page to view more details](./media/how-to-view-alerts/site_manager_overview_alerts_details.png)
4. The **sites** page will appear and show the top-level status for each site, this reflects the most important status for the site. 
![site manager sites page showing the top level status for each site](./media/how-to-view-alerts/site_manager_overview_alerts_details_status_site_page.png)

## View alert status: resource

1. Navigate to the main **site manager** page in **Azure Arc** and then to the **Sites** tab at the top of Azure Arc site manager. 
![site manager main page highlighting the site button tab](./media/how-to-view-alerts/sites_button_from_site_manager.png)
2. From the **Sites** tab, view the top-level status for each site, this reflects the most important status for the site. To see resource status, select this. For this example, **London's** alert status is clicked.
![site tab inside site manager showing the alert status](./media/how-to-view-alerts/site_manager_overview_alerts_details_status_site_page.png)
3. The alert status for each resource within **London** is visible, including the resource that had resulted in the top-level most important status. Which for **London** is **needs attention**
![alert status for each resource inside the london site](./media/how-to-view-alerts/site_manager_overview_alerts_details_status_london.png)
