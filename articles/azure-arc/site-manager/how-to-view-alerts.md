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

# How to view alert status for an Arc site

This article details how to view alert status for an Arc site, which reflects the status for the overall site and enables the ability to view the alert status for support resources as well. The status of an overall site is based upon the underlying resources.

## Prerequisites

* Azure portal access
* Internet connectivity
* Subscription
* Resource group or subscription with at least one resource for a site
* A site created for the associated resource group or subscription

## Alert status colors and meanings

In the Azure portal, status is indicated using color.

* Red: **Critical**
* Orange: **Error**
* Yellow: **Warning**
* Blue: **Info**
* Purple: **Verbose**
* Green: **Up to Date**

## View alert status

View alert status for an Arc site from the main page of Azure Arc site manager.

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page. 

   :::image type="content" source="./media/how-to-view-alerts/overview-sites-page.png" alt-text="Screenshot that shows selecting the overview page from site manager.":::

1. In the **Overview** page, you can view the summarized alert statuses of all sites. This site-level alert status is an aggregation of all the alert statuses of the resources in that site. In the example below, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts.png" alt-text="Screenshot that shows viewing the alert status on the site manager overview page.":::

1. To understand which site has which status, select either the **Sites** tab or the blue status text.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details.png" alt-text="Screenshot of site manager overview page directing to the sites page to view more details.":::

1. The **sites** page shows the top-level status for each site, which reflects the most important status for the site.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-site-page.png" alt-text="Screenshot that shows the top level alerts status for each site.":::

1. If there's an alert, select the status text to open details for a given site. You can also select the name of the site to open its details.

1. On a site's resource page, you can view the alert status for each resource within the site, including the resource that had resulted in the top-level most important status.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-london.png" alt-text="Screenshot that shows the site detail page with alert status for each resource.":::
