---
title: Turn on health monitoring in Microsoft Sentinel
description: Monitor supported data connectors by using the SentinelHealth data table.
ms.topic: how-to
ms.date: 7/28/2022
author: limwainstein
ms.author: lwainstein
ms.service: microsoft-sentinel
---

# Turn on health monitoring for Microsoft Sentinel (preview)

Monitor the health of supported data connectors by turning on health monitoring in Microsoft Sentinel. Get insights on health drifts, such as the latest failure events, or changes from success to failure states. Use this information to create alerts and other automated actions.

To get health data from the *SentinelHealth* data table, you must first turn on the Microsoft Sentinel health feature for your workspace.

When the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for supported data connectors.

To configure the retention time for your health events, see [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md).

> [!IMPORTANT]
>
> The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Turn on health monitoring for your workspace

1. In Microsoft Sentinel, under the **Configuration** menu on the left, select **Settings** and expand the **Health** section.

1. Select **Configure Diagnostic Settings** and create a new diagnostic setting.

    - In the **Diagnostic setting name** field, enter a meaningful name for your setting.

    - In the **Category details** column, select the appropriate category like **Data Connector**.

    - Under **Destination details**, select **Send to Log Analytics workspace**, and select your subscription and workspace from the dropdown menus.

1. Select **Save** to save your new setting.

The *SentinelHealth* data table is created at the first success or failure event generated for supported resources.

## Access the *SentinelHealth* table

In the Microsoft Sentinel **Logs** page, run a query on the  *SentinelHealth* table. For example:

```kusto
SentinelHealth
 | take 20
```

## Next steps

[Monitor the health of your Microsoft Sentinel data connectors](monitor-data-connector-health.md)