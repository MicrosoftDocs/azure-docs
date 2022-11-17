---
title: Turn on health monitoring in Microsoft Sentinel
description: Monitor supported data connectors by using the SentinelHealth data table.
ms.topic: how-to
ms.date: 11/07/2022
author: limwainstein
ms.author: lwainstein
ms.service: microsoft-sentinel
---

# Turn on health monitoring for Microsoft Sentinel (preview)

Monitor the health of supported Microsoft Sentinel resources by turning on the health monitoring feature in Microsoft Sentinel's **Settings** page. Get insights on health drifts, such as the latest failure events or changes from success to failure states, and use this information to create notifications and other automated actions.

To get health data from the *SentinelHealth* data table, you must first turn on the Microsoft Sentinel health feature for your workspace.

When the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for supported resource types.

The following resource types are currently supported:
- Data connectors
- Automation rules
- Playbooks (Azure Logic Apps workflows)
    > [!NOTE]
    > When monitoring playbook health, you'll also need to collect Azure Logic Apps diagnostic events from your playbooks in order to get the full picture of your playbook activity. See [**Monitor the health of your automation rules and playbooks**](monitor-automation-health.md) for more information.

To configure the retention time for your health events, see [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md).

> [!IMPORTANT]
>
> The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Turn on health monitoring for your workspace

1. In Microsoft Sentinel, under the **Configuration** menu on the left, select **Settings**.

1. Select **Settings** from the banner.

1. Scroll down to the **Health monitoring** section that appears below, and select it to expand.

1. Select **Configure Diagnostic Settings**.

    :::image type="content" source="media/enable-monitoring/enable-health-monitoring.png" alt-text="Screenshot shows how to get to the health monitoring settings.":::

1. In the **Diagnostic settings** screen, select **+ Add diagnostic setting**.

    - In the **Diagnostic setting name** field, enter a meaningful name for your setting.

    - In the **Logs** column, select the appropriate **Categories** for the resource types you want to monitor, for example **Data Collection - Connectors**.

    - Under **Destination details**, select **Send to Log Analytics workspace**, and select your **Subscription** and **Log Analytics workspace** from the dropdown menus.

1. Select **Save** on the top banner to save your new setting.

The *SentinelHealth* data table is created at the first success or failure event generated for the selected resources.

## Access the *SentinelHealth* table

In the Microsoft Sentinel **Logs** page, run a query on the  *SentinelHealth* table. For example:

```kusto
SentinelHealth
 | take 20
```

## Next steps

- Learn what [health monitoring in Microsoft Sentinel](health-audit.md) can do for you.
- [Monitor the health of your Microsoft Sentinel data connectors](monitor-data-connector-health.md).
- [Monitor the health of your Microsoft Sentinel automation rules](monitor-automation-health.md).
- See more information about the [*SentinelHealth* table schema](health-table-reference.md).
