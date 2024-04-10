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

# How to view update status for an Arc site

This article details how to view update status for an Arc site, which reflects the status for the overall site and enables the ability to view the update status for support resources as well. The status of an overall site is based upon the underlying resources.

## Prerequisites

* Azure portal access
* Internet connectivity
* Subscription
* Resource group or subscription with at least one resource for a site
* A site created for the associated resource group or subscription

## Update status colors and meanings

In the Azure portal, status is indicated using color.

* Red: **Needs Attention**
* Blue: **Update Available**
* Yellow: **Update In Progress**
* Green: **Up to Date**

## View update status

You can view update status for an Arc site as a whole from the main page of Azure Arc site manager.

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page.

   :::image type="content" source="./media/how-to-view-update-status/overview-sites-page.png" alt-text="Screenshot that shows selecting the Overview page in site manager.":::

2. In the **Overview** page, you can view the summarized update statuses of your sites. This site-level status is aggregated from the statuses of its managed resources. In the example below, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-update-status/site-manager-update-status-overview-page.png" alt-text="Screenshot that shows the update status summary on the view page.":::

3. To understand which site has which status, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.

   :::image type="content" source="./media/how-to-view-update-status/click-update-status-site-details.png" alt-text="Screenshot that shows selecting the Sites tab to get more detail about update status.":::

1. On the **Sites** page, you can view the top-level status for each site. This site-level status reflects the most important resource-level status for the site.

1. Select the **Needs attention** link to view the resource details.

   :::image type="content" source="./media/how-to-view-update-status/site-update-status-from-sites-page.png" alt-text="Screenshot that shows selecting the update status for a site to see the resource details.":::

3. On the site's resource page, you can view the update status for each resource within the site, including the resource that had resulted in the top-level most important status.

   :::image type="content" source="./media/how-to-view-update-status/london-resource-status-updates.png" alt-text="Screenshot that shows using the site details page to identify resources with pending or in progress updates.":::
