---
title: 'Logs - Azure Front Door'
description: This article explains how to configure Azure Front Door logs.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/23/2023
ms.author: duau
---

# Configure Azure Front Door logs

Azure Front Door captures several types of logs. Logs can help you monitor your application, track requests, and debug your Front Door configuration. For more information about Azure Front Door's logs, see [Monitor metrics and logs in Azure Front Door](../front-door-diagnostics.md).

Access logs, health probe logs, and WAF logs aren't enabled by default. In this article, you'll learn how to enable diagnostic logs for your Azure Front Door profile.

## Configure logs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for Azure Front Door and select the Azure Front Door profile.

1. In the profile, go to **Monitoring**, select **Diagnostic Setting**. Select **Add diagnostic setting**.

   :::image type="content" source="../media/how-to-logging/front-door-logging-1.png" alt-text="Screenshot of diagnostic settings landing page.":::

1. Under **Diagnostic settings**, enter a name for **Diagnostic settings name**.

1. Select the **log** from **FrontDoorAccessLog**, **FrontDoorHealthProbeLog**, and **FrontDoorWebApplicationFirewallLog**.

1. Select the **Destination details**. Destination options are: 

    * **Send to Log Analytics**
      * Azure Log Analytics in Azure Monitor is best used for general real-time monitoring and analysis of Azure Front Door performance.
      * Select the *Subscription* and *Log Analytics workspace*.
    * **Archive to a storage account**
      * Storage accounts are best used for scenarios when logs are stored for a longer duration and are reviewed when needed.
      * Select the *Subscription* and the *Storage Account*. and set **Retention (days)**.
    * **Stream to an event hub**
      * Event hubs are a great option for integrating with other security information and event management (SIEM) tools or external data stores, such as Splunk, DataDog, or Sumo. 
      * Select the *Subscription, Event hub namespace, Event hub name (optional)*, and *Event hub policy name*. 

    > [!TIP]
    > Most Azure customers use Log Analytics.

     :::image type="content" source="../media/how-to-logging/front-door-logging-2.png" alt-text="Screenshot of diagnostic settings page.":::

1. Click on **Save**.

## View your activity logs

To view activity logs:

1. Select your Front Door profile.

1. Select **Activity log.**

1. Choose a filtering scope and then select **Apply**.

## Next steps

- Learn about [Azure Front Door reports](how-to-reports.md).
- Learn about [Azure Front Door real time monitoring metrics](how-to-monitor-metrics.md).
