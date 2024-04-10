---
title: "How to view connectivity status"
description: "How to view the connectivity status of an Arc Site and all of its managed resources through the Azure portal."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 03/24/2024

# As a site admin, I want to know how to view update status so that I can use my site.

---
# How to view connectivity status for an Arc site

This article details how to view the connectivity status for an Arc site. A site's connectivity status reflects the status of the underlying resources. From the site status view, you can find detailed status information for the supported resources as well.

## Prerequisites

* Azure portal access
* Internet connectivity
* Subscription
* Resource group or subscription with at least one resource for a site
* A site created for the associated resource group or subscription

## Connectivity status colors and meanings

In the Azure portal, status is indicated using color.

* Red: **Needs Attention**
* Yellow: **Not Connected Recently**
* Green: **Connected**

## View connectivity status

You can view connectivity status for an Arc site as a whole from the main page of Azure Arc site manager (preview).

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page.

   :::image type="content" source="./media/how-to-view-connectivity-status/overview-sites-page.png" alt-text="Screenshot that shows selecting the Overview page in site manager.":::

1. On the **Overview** page, you can see a summary of the connectivity statuses of all your sites. The connectivity status of a given site is an aggregation of the connectivity status of its resources. In the example below, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-connectivity-status/site-connection-overview.png" alt-text="Screenshot that shows the connectivity view in the sites overview page.":::

1. To understand which site has which status, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.

   :::image type="content" source="./media/how-to-view-connectivity-status/click-connectivity-status-site-details.png" alt-text="Screenshot that shows selecting the Sites tab to get more detail about connectivity status.":::

1. On the **Sites** page, you can view the top-level status for each site. This site-level status reflects the most important resource-level status for the site.

1. Select the **Needs attention** link to view the resource details.

   :::image type="content" source="./media/how-to-view-connectivity-status/site-connectivity-status-from-sites-page.png" alt-text="Screenshot that shows selecting the connectivity status for a site to see the resource details.":::

1. On the site's resource page, you can view the connectivity status for each resource within the site, including the resource responsible for the top-level most important status.

   :::image type="content" source="./media/how-to-view-connectivity-status/london-resource-status-connectivity.png" alt-text="Screenshot that shows using the site details page to identify resources with connectivity issues.":::
