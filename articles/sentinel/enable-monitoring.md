---
title: Turn on auditing and health monitoring in Microsoft Sentinel
description: Monitor supported data connectors by using the SentinelHealth data table.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 10/17/2024
appliesto: Microsoft Sentinel in the Azure portal and the Microsoft Defender portal

#Customer intent: As a security engineer, I want to configure auditing and health monitoring for my Microsoft Sentinel resources so that I can ensure the integrity and health of our security infrastructure.

---

# Turn on auditing and health monitoring for Microsoft Sentinel (preview)

Monitor the health and audit the integrity of supported Microsoft Sentinel resources by turning on the auditing and health monitoring feature in Microsoft Sentinel's **Settings** page. Get insights on health drifts, such as the latest failure events or changes from success to failure states, and on unauthorized actions, and use this information to create notifications and other automated actions.

To get health data from the [*SentinelHealth*](health-table-reference.md) data table, or to get auditing information from the [*SentinelAudit*](audit-table-reference.md) data table, you must first turn on the Microsoft Sentinel auditing and health monitoring feature for your workspace. This article instructs you how to turn on these features.

To implement the health and audit feature using API (Bicep/AZURE RESOURCE MANAGER (ARM)/REST), review the [Diagnostic Settings operations](/rest/api/monitor/diagnostic-settings). To configure the retention time for your audit and health events, see [Manage data retention in a Log Analytics workspace](/azure/azure-monitor/logs/data-retention-configure).

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

- Before you start, learn more about health monitoring and auditing in Microsoft Sentinel. For more information, see [Auditing and health monitoring in Microsoft Sentinel](health-audit.md).

## Turn on auditing and health monitoring for your workspace

To get started, enable auditing and health monitoring from the Microsoft Sentinel settings.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Settings** > **Settings**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), under **System**, select **Settings** > **Microsoft Sentinel**.

1. Select **Auditing and health monitoring**.

1. Select **Enable** to enable auditing and health monitoring across all resource types and to send the auditing and monitoring data to your Microsoft Sentinel workspace (and nowhere else). 

    Or, select the **Configure diagnostic settings** link to enable health monitoring only for the data collector and/or automation resources, or to configure advanced options, like more places to send the data.

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="media/enable-monitoring/enable-health-monitoring.png" alt-text="Screenshot shows how to get to the health monitoring settings.":::

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="media/enable-monitoring/enable-health-monitoring-defender.png" alt-text="Screenshot shows how to get to the health monitoring settings in the Defender portal.":::

    ---

    If you selected **Enable**, then the button will gray out and change to read **Enabling...** and then **Enabled**. At that point, auditing and health monitoring is enabled, and you're done! The appropriate diagnostic settings were added behind the scenes, and you can view and edit them by selecting the **Configure diagnostic settings** link.

1. If you selected **Configure diagnostic settings**, then in the **Diagnostic settings** screen, select **+ Add diagnostic setting**.

    (If you're editing an existing setting, select it from the list of diagnostic settings.)

    - In the **Diagnostic setting name** field, enter a meaningful name for your setting.

    - In the **Logs** column, select the appropriate **Categories** for the resource types you want to monitor, for example **Data Collection - Connectors**. Select **allLogs** if you want to monitor analytics rules.

    - Under **Destination details**, select **Send to Log Analytics workspace**, and select your **Subscription** and **Log Analytics workspace** from the dropdown menus.

        :::image type="content" source="media/enable-monitoring/diagnostic-settings.png" alt-text="Screenshot of diagnostic settings screen for enabling auditing and health monitoring.":::

        If you require, you might select other destinations to which to send your data, in addition to the Log Analytics workspace.

1. Select **Save** on the top banner to save your new setting.

The *SentinelHealth* and *SentinelAudit* data tables are created at the first event generated for the selected resources.

## Verify that the tables are receiving data

Run Kusto Query Language (KQL) queries in the Azure portal or the Defender portal to make sure you're getting health and auditing data.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **General**, select **Logs**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), under **Investigation & response**, select **Hunting** > **Advanced hunting**.

1. Run a query on the  *SentinelHealth* table. For example:

   ```kusto
   _SentinelHealth()
    | take 20
   ```

1. Run a query on the  *SentinelAudit* table. For example:

   ```kusto
   _SentinelAudit()
    | take 20
   ```

## Supported data tables and resource types

When the feature is turned on, the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) data tables are created at the first event generated for the selected resources.

Microsoft Sentinel health monitoring currently supports the following types of resources:

- Analytics rules
- Data connectors
- Automation rules
- Playbooks (Azure Logic Apps workflows)

> [!NOTE]
> When monitoring playbook health, make sure to collect Azure Logic Apps diagnostic events from your playbooks to get the full picture of your playbook activity. For more information, see [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).

Only the analytics rule resource type is currently supported for auditing.

## Next steps

- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- [Monitor the health and integrity of your analytics rules](monitor-analytics-rule-integrity.md).
