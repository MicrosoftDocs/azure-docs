---
title: Configure Azure Front Door Logs
description: Learn how to configure Azure Front Door diagnostic logs to enable access logs, health probe logs, and Web Application Firewall (WAF) logs.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 05/21/2025
---

# Configure Azure Front Door logs

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door captures several types of logs. Logs can help you monitor your application, track requests, and debug your Front Door configuration. For more information about Azure Front Door's logs, see [Monitor metrics and logs in Azure Front Door](../front-door-diagnostics.md).

Access logs, health probe logs, and Web Application Firewall (WAF) logs aren't enabled by default. In this article, you learn how to enable diagnostic logs for your Azure Front Door profile.

## Configure logs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, search for **Front Door** and then select the relevant Azure Front Door profile.

1. Under **Monitoring**, select **Diagnostic settings** and then select **+ Add diagnostic setting**.

1. In **Diagnostic setting**, enter a name for **Diagnostic setting name**.

1. Under **Logs**, select **audit**, **allLogs**, or the individual log you want. Available logs are: **FrontDoor Access Log**, **FrontDoor Health Probe Log**, and **FrontDoor WebApplicationFirewall Log**.

1. Select the **Destination details**. The destination options are: 

    - **Send to Log Analytics**
      - Azure Log Analytics in Azure Monitor is best used for general real-time monitoring and analysis of Azure Front Door performance.
      - Select the *Subscription* and *Log Analytics workspace*.
    - **Archive to a storage account**
      - Storage accounts are best used for scenarios when logs are stored for a longer duration and are reviewed when needed.
      - Select the *Subscription* and *Storage Account*.
    - **Stream to an event hub**
      - Event hubs are a great option for integrating with other security information and event management (SIEM) tools or external data stores, such as Splunk, Datadog, or Sumo. 
      - Select the *Subscription*, *Event hub namespace*, *Event hub name (optional)*, and *Event hub policy name*. 
    - **Send to partner solution**
      - Partner solutions are fully integrated solutions with Azure. For more information, see [Destinations in Azure Monitor diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings#destinations) and [Azure Monitor partner solutions](/azure/partner-solutions/partners#observability).
      - Select the *Subscription* and *Destination*.

    > [!TIP]
    > Microsoft recommends using Log Analytics for real-time monitoring and analysis of Azure Front Door performance.

     :::image type="content" source="../media/how-to-logs/front-door-diagnostic-settings.png" alt-text="Screenshot that shows the Diagnostic settings page of Azure Front Door." lightbox="../media/how-to-logs/front-door-diagnostic-settings.png":::

1. Select **Save** to begin logging.

## View your activity logs

To view activity logs:

1. Select your Azure Front Door profile.

1. Select **Activity log**.

1. Choose a filtering scope.

## Related content

- [Monitor Azure Front Door](../monitor-front-door.md)
- [Azure Front Door reports](how-to-reports.md)
- [Azure Front Door monitoring data reference](../monitor-front-door-reference.md)
