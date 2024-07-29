---
title: "How to configure Azure Monitor alerts for a site"
description: "Describes how to create and configure alerts using Azure Monitor to manage resources in an Azure Arc site."
author: torreymicrosoft
ms.author: torreyt
ms.service: azure-arc
ms.subservice: azure-arc-site-manager
ms.topic: how-to #Don't change
ms.date: 04/18/2024

#customer intent: As a site admin, I want to know where to create a alert in Azure for my site so that I can deploy monitoring for resources in my site.

---

# Monitor sites in Azure Arc

Azure Arc sites provide a centralized view to monitor  groups of resources, but don't provide monitoring capabilities for the site overall. Instead, customers can set up alerts and monitoring for supported resources within a site. Once alerts are set up and triggered depending on the alert criteria, Azure Arc site manager (preview) makes the resource alert status visible within the site pages.

If you aren't familiar with Azure Monitor, learn more about how to [monitor Azure resources with Azure Monitor](../../azure-monitor/essentials/monitor-azure-resource.md).

## Prerequisites

* An Azure subscription. If you don't have a service subscription, create a [free trial account in Azure](https://azure.microsoft.com/free/).
* Azure portal access
* Internet connectivity
* A resource group or subscription in Azure with at least one resource for a site. For more information, see [Supported resource types](./overview.md#supported-resource-types).

## Configure alerts for sites in Azure Arc

This section provides basic steps for configuring alerts for sites in Azure Arc. For more detailed information about Azure Monitor, see [Create or edit an alert rule](../../azure-monitor/alerts/alerts-create-metric-alert-rule.yml).

To configure alerts for sites in Azure Arc, follow the below steps.

1. Navigate to Azure Monitor by searching for **monitor** within the Azure portal. Select **Monitor** as shown.

   :::image type="content" source="./media/how-to-configure-monitor-site/search-monitor.png" alt-text="Screenshot that shows searching for monitor within the Azure portal.":::

1. On the **Monitor** overview, select **Alerts** in either the navigation menu or the boxes shown in the primary screen.

   :::image type="content" source="./media/how-to-configure-monitor-site/select-alerts-monitor.png" alt-text="Screenshot that shows selecting the Alerts option on the Monitor overview.":::

1. On  the **Alerts** page, you can manage existing alerts or create new ones.

   Select **Alert rules** to see all of the alerts currently in effect in your subscription.

   Select **Create** to create an alert rule for a specific resource. If a resource is managed as part of a site, any alerts triggered via its rule appear in the site manager overview.

   :::image type="content" source="./media/how-to-configure-monitor-site/create-alert-monitor.png" alt-text="Screenshot that shows the Create and Alert rules actions on the Alerts page.":::

By having either existing alert rules or creating a new alert rule, once the rule is in place for resources supported by Azure Arc site monitor, any alerts that are trigger on that resource will be visible on the sites overview tab.

## Next steps

To learn how to view alerts triggered from Azure Monitor for supported resources within site manager, see [How to view alerts in site manager](./how-to-view-alerts.md).