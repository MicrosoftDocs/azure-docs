---
title: "How to view connectivity status"
description: "How to view the connectivity status of an Arc Site and all of its managed resources through the Azure portal."
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: how-to #Don't change
ms.date: 04/18/2024

# As a site admin, I want to know how to view update status so that I can use my site.

---
# How to view connectivity status for an Arc site

This article details how to view the connectivity status for an Arc site. A site's connectivity status reflects the status of the underlying resources. From the site status view, you can find detailed status information for the supported resources as well.

## Prerequisites

* An Azure subscription. If you don't have a service subscription, create a [free trial account in Azure](https://azure.microsoft.com/free/).
* Azure portal access
* Internet connectivity
* A resource group or subscription in Azure with at least one resource for a site. For more information, see [Supported resource types](./overview.md#supported-resource-types).
* A site created for the associated resource group or subscription. If you don't have one, see [Create and manage sites](./how-to-crud-site.md).

## Connectivity status colors and meanings

In the Azure portal, status is indicated using color.

* Green: **Connected**
* Yellow: **Not Connected Recently**
* Red: **Needs Attention**

## View connectivity status

You can view connectivity status for an Arc site as a whole from the main page of Azure Arc site manager (preview).

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page.

   :::image type="content" source="./media/how-to-view-connectivity-status/overview-sites-page.png" alt-text="Screenshot that shows selecting the Overview page in site manager.":::

1. On the **Overview** page, you can see a summary of the connectivity statuses of all your sites. The connectivity status of a given site is an aggregation of the connectivity status of its resources. In the following example, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-connectivity-status/site-connection-overview.png" alt-text="Screenshot that shows the connectivity view in the sites overview page." lightbox="./media/how-to-view-connectivity-status/site-connection-overview.png":::

1. To understand which site has which status, select either the **sites** tab or the blue colored status text to be directed to the **sites** page.

   :::image type="content" source="./media/how-to-view-connectivity-status/click-connectivity-status-site-details.png" alt-text="Screenshot that shows selecting the Sites tab to get more detail about connectivity status." lightbox="./media/how-to-view-connectivity-status/click-connectivity-status-site-details.png":::

1. On the **Sites** page, you can view the top-level status for each site. This site-level status reflects the most significant resource-level status for the site.

1. Select the **Needs attention** link to view the resource details.

   :::image type="content" source="./media/how-to-view-connectivity-status/site-connectivity-status-from-sites-page.png" alt-text="Screenshot that shows selecting the connectivity status for a site to see the resource details." lightbox="./media/how-to-view-connectivity-status/site-connectivity-status-from-sites-page.png":::

1. On the site's resource page, you can view the connectivity status for each resource within the site, including the resource responsible for the top-level most significant status.

   :::image type="content" source="./media/how-to-view-connectivity-status/los-angeles-resource-status-connectivity.png" alt-text="Screenshot that shows using the site details page to identify resources with connectivity issues." lightbox="./media/how-to-view-connectivity-status/los-angeles-resource-status-connectivity.png":::
