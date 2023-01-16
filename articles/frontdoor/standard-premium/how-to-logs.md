---
title: 'Logs - Azure Front Door'
description: This article explains how Azure Front Door tracks and monitor your environment with logs.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 01/09/2023
ms.author: duau
---

# Azure Front Door logs

TODO

## Configure log storage

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for Azure Front Door and select the Azure Front Door profile.

1. In the profile, go to **Monitoring**, select **Diagnostic Setting**. Select **Add diagnostic setting**.

   :::image type="content" source="../media/how-to-logging/front-door-logging-1.png" alt-text="Screenshot of diagnostic settings landing page.":::

1. Under **Diagnostic settings**, enter a name for **Diagnostic settings name**.

1. Select the **log** from **FrontDoorAccessLog**, **FrontDoorHealthProbeLog**, and **FrontDoorWebApplicationFirewallLog**.

1. Select the **Destination details**. Destination options are: 

    * **Send to Log Analytics**
        * Select the *Subscription* and *Log Analytics workspace*.
    * **Archive to a storage account**
        * Select the *Subscription* and the *Storage Account*. and set **Retention (days)**.
    * **Stream to an event hub**
        * Select the *Subscription, Event hub namespace, Event hub name (optional)*, and *Event hub policy name*. 

     :::image type="content" source="../media/how-to-logging/front-door-logging-2.png" alt-text="Screenshot of diagnostic settings page.":::

1. Click on **Save**.

## Activity logs

To view activity logs:

1. Select your Front Door profile.

1. Select **Activity log.**

1. Choose a filtering scope and then select **Apply**.

## Next steps

- Learn about [Azure Front Door reports](how-to-reports.md).
- Learn about [Azure Front Door real time monitoring metrics](how-to-monitor-metrics.md).
