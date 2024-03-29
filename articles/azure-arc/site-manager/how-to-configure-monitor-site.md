---
title: "How to configure monitor for a site"
description: "How to configure monitor for a site."
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 03/24/2024

#customer intent: As a site admin, I want to know where to create a alert in Azure for my site so that I can deploy monitoring for resources in my site.

---

# Monitor sites in Azure Arc

Sites within Azure Arc aren't able to have monitoring set up on the site overall. Instead, customers can set up alerts and monitoring for supported resources within a site. Once alerts are set up and triggered depending on the alert criteria, site manager makes the resource alert status visible within the Azure Arc site manager (preview) pages.

## Prerequisites

* Azure portal access
* Internet connectivity
* Subscription
* Resource group or subscription with at-least one resource for sites that supports alerts

## Configure monitoring and alerts for sites in Azure Arc

To configure monitoring and alerts for sites in Azure Arc, follow the below steps.

1. Navigate to Azure Monitor by searching for **monitor** within the Azure portal. Select **Monitor** as shown.

   :::image type="content" source="./media/how-to-configure-monitor-site/search-monitor.png" alt-text="Screenshot that shows searching for monitor within the Azure portal.":::

1. On the **Monitor** overview, select **Alerts** in either the navigation menu or the boxes shown in the primary screen.

   :::image type="content" source="./media/how-to-configure-monitor-site/select-alerts-monitor.png" alt-text="Screenshot that shows selecting the Alerts option on the Monitor overview.":::

1. On  the **Alerts** page, you can manage existing alerts or create new ones.

   Select **Alert rules** to see all of the alerts currently in effect in your subscription.

   Select **Create** to create an alert rule for a specific resource. If a resource is managed as part of a site, any alerts triggered via its rule appear in the site manager overview.

   :::image type="content" source="./media/how-to-configure-monitor-site/create-alert-monitor.png" alt-text="Screenshot that shows the Create and Alert rules actions on the Alerts page.":::

## Next steps

To learn how to view alerts triggered from Azure Monitor for supported resources within site manager, see [How to view alerts in site manager](./how-to-view-alerts.md).