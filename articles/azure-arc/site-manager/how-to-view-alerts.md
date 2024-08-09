---
title: "How to view alerts for a site"
description: "How to view and create alerts for a site"
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: how-to #Don't change
ms.date: 04/18/2024

---

# How to view alert status for an Azure Arc site

This article details how to view the alert status for an Azure Arc site. A site's alert status reflects the status of the underlying resources. From the site status view, you can find detailed status information for the supported resources as well.

## Prerequisites

* An Azure subscription. If you don't have a service subscription, create a [free trial account in Azure](https://azure.microsoft.com/free/).
* Azure portal access
* Internet connectivity
* A resource group or subscription in Azure with at least one resource for a site. For more information, see [Supported resource types](./overview.md#supported-resource-types).
* A site created for the associated resource group or subscription. If you don't have one, see [Create and manage sites](./how-to-crud-site.md).

## Alert status colors and meanings

In the Azure portal, status is indicated using color.

* Green: **Up to Date**
* Blue: **Info**
* Purple: **Verbose**
* Yellow: **Warning**
* Orange: **Error**
* Red: **Critical**

## View alert status

View alert status for an Arc site from the main page of Azure Arc site manager (preview).

1. From the [Azure portal](https://portal.azure.com), navigate to **Azure Arc** and select **Site manager (preview)** to open site manager.

1. From Azure Arc site manager, navigate to the **Overview** page.

   :::image type="content" source="./media/how-to-view-alerts/overview-sites-page.png" alt-text="Screenshot that shows selecting the overview page from site manager.":::

1. On the **Overview** page, you can view the summarized alert statuses of all sites. This site-level alert status is an aggregation of all the alert statuses of the resources in that site. In the following example, sites are shown with different statuses.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts.png" alt-text="Screenshot that shows viewing the alert status on the site manager overview page." lightbox="./media/how-to-view-alerts/site-manager-overview-alerts.png":::

1. To understand which site has which status, select either the **Sites** tab or the blue status text.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details.png" alt-text="Screenshot of site manager overview page directing to the sites page to view more details." lightbox="./media/how-to-view-alerts/site-manager-overview-alerts-details.png":::

1. The **sites** page shows the top-level status for each site, which reflects the most significant status for the site.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-site-page.png" alt-text="Screenshot that shows the top level alerts status for each site." lightbox="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-site-page.png":::

1. If there's an alert, select the status text to open details for a given site. You can also select the name of the site to open its details.

1. On a site's resource page, you can view the alert status for each resource within the site, including the resource responsible for the top-level most significant status.

   :::image type="content" source="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-los-angeles.png" alt-text="Screenshot that shows the site detail page with alert status for each resource." lightbox="./media/how-to-view-alerts/site-manager-overview-alerts-details-status-los-angeles.png":::
