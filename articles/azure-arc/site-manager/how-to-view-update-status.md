---
title: "How to view update status for site"
description: "How to view update status for site"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: how-to #Don't change
ms.date: 04/18/2024

# As a site admin, I want to know how to view update status for sites so that I can use my site.

---

# How to view update status for an Arc site

This article details how to view update status for an Arc site. A site's update status reflects the status of the underlying resources. From the site status view, you can find detailed status information for the supported resources as well.

## Prerequisites

* An Azure subscription. If you don't have a service subscription, create a [free trial account in Azure](https://azure.microsoft.com/free/).
* Azure portal access
* Internet connectivity
* A resource group or subscription in Azure with at least one resource for a site. For more information, see [Supported resource types](./overview.md#supported-resource-types).
* A site created for the associated resource group or subscription. If you don't have one, see [Create and manage sites](./how-to-crud-site.md).

## Update status colors and meanings

In the Azure portal, status is indicated using color.

* Green: **Up to Date**
* Blue: **Update Available**
* Yellow: **Update In Progress**
* Red: **Needs Attention**

This update status comes from the resources within each site and is provided by Azure Update Manager.

## View update status

You can view update status for an Arc site as a whole from the main page of Azure Arc site manager (preview).

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page.

   :::image type="content" source="./media/how-to-view-update-status/overview-sites-page.png" alt-text="Screenshot that shows selecting the Overview page in site manager.":::

1. On the **Overview** page, you can view the summarized update statuses of your sites. This site-level status is aggregated from the statuses of its managed resources. In the following example, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-update-status/site-manager-update-status-overview-page.png" alt-text="Screenshot that shows the update status summary on the view page." lightbox="./media/how-to-view-update-status/site-manager-update-status-overview-page.png":::

1. To understand which site has which status, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.

   :::image type="content" source="./media/how-to-view-update-status/click-update-status-site-details.png" alt-text="Screenshot that shows selecting the Sites tab to get more detail about update status." lightbox="./media/how-to-view-update-status/click-update-status-site-details.png":::

1. On the **Sites** page, you can view the top-level status for each site. This site-level status reflects the most significant resource-level status for the site.

1. Select the **Needs attention** link to view the resource details.

   :::image type="content" source="./media/how-to-view-update-status/site-update-status-from-sites-page.png" alt-text="Screenshot that shows selecting the update status for a site to see the resource details." lightbox="./media/how-to-view-update-status/site-update-status-from-sites-page.png" :::

1. On the site's resource page, you can view the update status for each resource within the site, including the resource responsible for the top-level most significant status.

   :::image type="content" source="./media/how-to-view-update-status/los-angeles-resource-status-updates.png" alt-text="Screenshot that shows using the site details page to identify resources with pending or in progress updates." lightbox="./media/how-to-view-update-status/los-angeles-resource-status-updates.png" :::
