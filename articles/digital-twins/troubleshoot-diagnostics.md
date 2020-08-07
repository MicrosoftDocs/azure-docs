---
# Mandatory fields.
title: Set up diagnostics
titleSuffix: Azure Digital Twins
description: See how to enable logging with diagnostics settings.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/28/2020
ms.topic: troubleshooting
ms.service: digital-twins
---

# Troubleshooting Azure Digital Twins: Diagnostics logging

Azure Digital Twins collects [metrics](troubleshoot-metrics.md) for your service instance that give information about the state of your resources. You can use these metrics to assess the overall health of Azure Digital Twins service and the resources connected to it. These user-facing statistics help you see what is going on with your Azure Digital Twins and help perform root-cause analysis on issues without needing to contact Azure support.

This article shows you how to turn on **diagnostics logging** for your metrics data from your Azure Digital Twins instance. You can use these logs to help you troubleshoot service issues, and configure diagnostic settings to send Azure Digital Twins metrics to different destinations. You can read more about these settings in [*Create diagnostic settings to send platform logs and metrics to different destinations*](../azure-monitor/platform/diagnostic-settings.md).

## Turn on diagnostic settings with the Azure portal

Here is how to enable diagnostic settings for your Azure Digital Twins instance:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Diagnostic settings** from the menu, then **Add diagnostic setting**.

    :::image type="content" source="media/troubleshoot-diagnostics/diagnostic-settings.png" alt-text="Screenshot showing the diagnostic settings page and button to add":::

3. On the page that follows, fill in the following values:
     * **Diagnostic setting name**: Give the diagnostic settings a name.
     * **Category details**: Choose which operations you want to monitor, and check the boxes to enable diagnostics for those operations. The operations that diagnostic settings can report on are:
        - DigitalTwinsOperation
        - EventRoutesOperation
        - ModelsOperation
        - QueryOperation
        - AllMetrics
     * **Destination details**: Choose where you want to send the logs. You can select any combination of the three options:
        - Send to Log Analytics
        - Archive to a storage account
        - Stream to an event hub

        You may be asked to fill in additional details if they are necessary for your destination selection.  
    
4. Save the new settings. 

    :::image type="content" source="media/troubleshoot-diagnostics/diagnostic-settings-details.png" alt-text="Screenshot showing the diagnostic settings page and button to add":::

New settings take effect in about 10 minutes. After that, logs appear in the configured target back on the **Diagnostic settings** page for your instance. 

## Next steps

* For more information about configuring diagnostics, see [*Collect and consume log data from your Azure resources*](../azure-monitor/platform/platform-logs-overview.md).
* For information about the Azure Digital Twins metrics, see [*Troubleshooting: View metrics with Azure Monitor*](troubleshoot-metrics.md).
* To see how to enable alerts for your metrics, see [*Troubleshooting: Set up alerts*](troubleshoot-alerts.md).
