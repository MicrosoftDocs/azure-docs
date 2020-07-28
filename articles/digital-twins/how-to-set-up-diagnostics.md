---
# Mandatory fields.
title: Set up diagnostics
titleSuffix: Azure Digital Twins
description: See how to enable logging with diagnostics settings.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/27/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable logging with diagnostics settings

You can choose to send your metrics data to [Log Analytics](../azure-monitor/log-query/get-started-portal.md), an [Event Hubs](../event-hubs/event-hubs-about.md) endpoint, or [Azure Storage](../storage/blobs/storage-blobs-overview.md) by enabling logging with diagnostics settings for your instance.

## Turn on diagnostic settings with the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Diagnostic settings** from the menu, then **Add diagnostic setting**.

    :::image type="content" source="media/how-to-view-metrics/diagnostic-settings.png" alt-text="Screenshot showing the diagnostic settings page and button to add":::

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

    :::image type="content" source="media/how-to-set-up-diagnostics/diagnostic-settings-details.png" alt-text="Screenshot showing the diagnostic settings page and button to add":::

New settings take effect in about 10 minutes. After that, logs appear in the configured target back on the **Diagnostic settings** page for your instance. 

## Next steps

* For more information about configuring diagnostics, see [*Collect and consume log data from your Azure resources*](../azure-monitor/platform/platform-logs-overview.md).
* For information about the Azure Digital Twins metrics, see [*How-to: View metrics with Azure Monitor*](how-to-view-metrics.md)