---
title: "How to configure monitoring for a site"
description: "How to configure monitoring for a site"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 03/24/2024

#customer intent: As a site admin, I want to know where to create a alert in Azure for my site so that I can deploy monitoring for resources in my site.

---

# Monitoring and alerts for sites in Azure Arc

Sites within Azure Arc aren't able to have monitoring setup on the site overall. Instead, customers can set up alerts and monitoring for supported resources within a site. Once alerts are set up and triggered depending on the alert criteria, site manager makes the resource alert status visible within the Azure Arc site manager pages.

## Prerequisites

* Azure portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at-least one resource for Site that supports alerts

## Configuring monitoring and alerts for sites in Azure Arc

To configure monitoring and alerts for sites in Azure Arc, follow the below steps.

1. Navigate to Azure Monitor, via searching for **monitor** within the Azure portal. Select **monitor** as shown.
![screenshot of searching for monitor within the azure portal.](./media/how-to-configure-monitoring-site/search-monitor.png)
2. Once **monitor** is open, navigate to the **alerts** page either via the menu on the left or the boxes shown in the primary screen.
![screenshot of opening alerts from monitor.](./media/how-to-configure-monitoring-site/select-alerts-monitor.png)
3. From the **alerts** page, alerts can be managed if they exist or the can be created via the following **create** button. Alerts can't be created for an entire site, but they can be created for specific supported resources within a site. Once created, any alerts triggered via the rules set in monitor for support resources, will have alerts appear in site manager.
![screenshot of creating alerts from monitor.](./media/how-to-configure-monitoring-site/create-alert-monitor.png)

## Viewing alerts in site manager

To understand more regarding how to view alerts created and triggered from monitor for supported resources within site manager, view this article:

- [How to view alerts in site manager.](./how-to-view-alerts.md)