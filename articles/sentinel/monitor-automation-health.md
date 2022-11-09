---
title: Monitor the health of your Microsoft Sentinel automation rules and playbooks
description: Use the SentinelHealth and AzureDiagnostics data tables to keep track of your automation rules' and playbooks' execution and performance.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/09/2022
ms.service: microsoft-sentinel
---

# Monitor the health of your automation rules and playbooks

To ensure proper functioning and performance of your security orchestration, automation, and response operations in your Microsoft Sentinel service, keep track of the health of your automation rules and playbooks by monitoring their execution logs.

Set up notifications of health drifts for relevant stakeholders, who can then take action. For example, define and send email or Microsoft Teams messages, create new tickets in your ticketing system, and so on.

This article describes how to use Microsoft Sentinel's health monitoring features, which allow you to keep track of your automation rules and playbooks' health from within Microsoft Sentinel.

## Summary

Automation health monitoring in Microsoft Sentinel has two parts:

| Feature | Table | Coverage | Enable from |
| - | - | - | - |
| **Microsoft Sentinel automation health logs** | *SentinelHealth* | - Automation rules run<br>- Playbooks triggered | Microsoft Sentinel settings > Health monitoring |
| **Azure Logic Apps diagnostics logs** | *AzureDiagnostics* | - Playbook run started/ended<br>- Playbook actions/triggers started/ended | Logic Apps resource > [Diagnostics settings](../azure-monitor/essentials/diagnostic-settings.md?tabs=portal#create-diagnostic-settings) |


- **Microsoft Sentinel automation health logs:** These logs are collected in the *SentinelHealth* table in Log Analytics. Querying this table provides information on health drifts, such as automation rules failing to run or playbooks that don't launch.

    > [!IMPORTANT]
    >
    > The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Use the SentinelHealth data table (Public preview)

To get data connector health data from the *SentinelHealth* data table, you must first turn on the Microsoft Sentinel health feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](enable-monitoring.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your data connectors.

### Supported data connectors

The *SentinelHealth* data table is currently supported only for the following data connectors:

- [Amazon Web Services (CloudTrail and S3)](connect-aws.md)
- [Dynamics 365](connect-dynamics-365.md)
- [Office 365](connect-office-365.md)
- [Office ATP](connect-microsoft-defender-advanced-threat-protection.md)
- [Threat Intelligence - TAXII](connect-threat-intelligence-taxii.md)
- [Threat Intelligence Platforms](connect-threat-intelligence-tip.md)

### Understanding SentinelHealth table events

The following types of health events are logged in the *SentinelHealth* table:

- **Data fetch status change**. Logged once an hour as long as a data connector status remains stable, with either continuous success or failure events. For as long as a data connector's status does not change, monitoring only hourly works to prevent redundant auditing and reduce table size. If the data connector's status has continuous failures, additional details about the failures are included in the *ExtendedProperties* column.

    If the data connector's status changes, either from a success to failure, from failure to success, or has changes in failure reasons, the event is logged immediately to allow your team to take proactive and immediate action.

    Potentially transient errors, such as source service throttling, are logged only after they've continued for more than 60 minutes. These 60 minutes allow Microsoft Sentinel to overcome a transient issue in the backend and catch up with the data, without requiring any user action. Errors that are definitely not transient are logged immediately.

- **Failure summary**. Logged once an hour, per connector, per workspace, with an aggregated failure summary. Failure summary events are created only when the connector has experienced polling errors during the given hour. They contain any extra details provided in the *ExtendedProperties* column, such as the time period for which the connector's source platform was queried, and a distinct list of failures encountered during the time period.

For more information, see [SentinelHealth table columns schema](#sentinelhealth-table-columns-schema).

### Run queries to detect health drifts

Create queries on the *SentinelHealth* table to help you detect health drifts in your data connectors. For example:

**Detect latest failure events per connector**:

```kusto
SentinelHealth
| where TimeGenerated > ago(3d)
| where OperationName == 'Data fetch status change'
| where Status in ('Success', 'Failure')
| summarize TimeGenerated = arg_max(TimeGenerated,*) by SentinelResourceName, SentinelResourceId
| where Status == 'Failure'
```

**Detect connectors with changes from fail to success state**:

```kusto
let lastestStatus = SentinelHealth
| where TimeGenerated > ago(12h)
| where OperationName == 'Data fetch status change'
| where Status in ('Success', 'Failure')
| project TimeGenerated, SentinelResourceName, SentinelResourceId, LastStatus = Status
| summarize TimeGenerated = arg_max(TimeGenerated,*) by SentinelResourceName, SentinelResourceId;
let nextToLastestStatus = SentinelHealth
| where TimeGenerated > ago(12h)
| where OperationName == 'Data fetch status change'
| where Status in ('Success', 'Failure')
| join kind = leftanti (lastestStatus) on SentinelResourceName, SentinelResourceId, TimeGenerated
| project TimeGenerated, SentinelResourceName, SentinelResourceId, NextToLastStatus = Status
| summarize TimeGenerated = arg_max(TimeGenerated,*) by SentinelResourceName, SentinelResourceId;
lastestStatus
| join kind=inner (nextToLastestStatus) on SentinelResourceName, SentinelResourceId
| where NextToLastStatus == 'Failure' and LastStatus == 'Success'
```

**Detect connectors with changes from success to fail state**:

```kusto
let lastestStatus = SentinelHealth
| where TimeGenerated > ago(12h)
| where OperationName == 'Data fetch status change'
| where Status in ('Success', 'Failure')
| project TimeGenerated, SentinelResourceName, SentinelResourceId, LastStatus = Status
| summarize TimeGenerated = arg_max(TimeGenerated,*) by SentinelResourceName, SentinelResourceId;
let nextToLastestStatus = SentinelHealth
| where TimeGenerated > ago(12h)
| where OperationName == 'Data fetch status change'
| where Status in ('Success', 'Failure')
| join kind = leftanti (lastestStatus) on SentinelResourceName, SentinelResourceId, TimeGenerated
| project TimeGenerated, SentinelResourceName, SentinelResourceId, NextToLastStatus = Status
| summarize TimeGenerated = arg_max(TimeGenerated,*) by SentinelResourceName, SentinelResourceId;
lastestStatus
| join kind=inner (nextToLastestStatus) on SentinelResourceName, SentinelResourceId
| where NextToLastStatus == 'Success' and LastStatus == 'Failure'
```

### Configure alerts and automated actions for health issues

While you can use the Microsoft Sentinel [analytics rules](automate-incident-handling-with-automation-rules.md) to configure automation in Microsoft Sentinel logs, if you want to be notified and take immediate action for health drifts in your data connectors, we recommend that you use [Azure Monitor alert rules](../azure-monitor/alerts/alerts-overview.md).

For example:

1. In an Azure Monitor alert rule, select your Microsoft Sentinel workspace as the rule scope, and **Custom log search** as the first condition.

1. Customize the alert logic as needed, such as frequency or lookback duration, and then use [queries](#run-queries-to-detect-health-drifts) to search for health drifts.

1. For the rule actions, select an existing action group or create a new one as needed to configure push notifications or other automated actions such as triggering a Logic App, Webhook, or Azure Function in your system.

For more information, see [Azure Monitor alerts overview](../azure-monitor/alerts/alerts-overview.md) and [Azure Monitor alerts log](../azure-monitor/alerts/alerts-log.md).

### SentinelHealth table columns schema

The following table describes the columns and data generated in the SentinelHealth data table for data connectors:

| ColumnName    | ColumnType     | Description|
| ----------------------------------------------- | -------------- | --------------------------------------------------------------------------- |
| **TenantId**      | String         | The tenant ID for your Microsoft Sentinel workspace.                    |
| **TimeGenerated** | Datetime       | The time at which the health event occurred.         |
| <a name="operationname"></a>**OperationName** | String         | The health operation. One of the following values: <br><br>-`Data fetch status change` for health or success indications <br>- `Failure summary` for aggregated health summaries. <br><br>For more information, see [Understanding SentinelHealth table events](#understanding-sentinelhealth-table-events). |
| <a name="sentinelresourceid"></a>**SentinelResourceId**        | String         | The unique identifier of the Microsoft Sentinel workspace and the associated connector on which the health event occurred. |
| **SentinelResourceName**      | String         | The data connector name.                           |
| <a name="status"></a>**Status**        | String         | Indicates `Success` or `Failure` for the `Data fetch status change` [OperationName](#operationname), and `Informational` for the `Failure summary` [OperationName](#operationname).         |
| **Description**   | String         | Describes the operation, including extended data as needed. For example, for failures, this column might indicate the failure reason. |
| **WorkspaceId**   | String         | The workspace GUID on which the health issue occurred. The full Azure Resource Identifier is available in the [SentinelResourceID](#sentinelresourceid) column. |
| **SentinelResourceType**      | String         |The Microsoft Sentinel resource type being monitored: `Data connector`|
| **SentinelResourceKind**      | String         | The type of data connector being monitored, such as `Office365`.               |
| **RecordId**      | String         | A unique identifier for the record that can be shared with the support team for better correlation as needed.                |
| **ExtendedProperties**        | Dynamic (json) | A JSON bag that varies by the [OperationName](#operationname) value and the [Status](#status) of the event: <br><br>- For `Data fetch status change` events with a success indicator, the bag contains a ‘DestinationTable’ property to indicate where data from this connector is expected to land. For failures, the contents vary depending on the failure type.    |
| **Type**          | String         | `SentinelHealth`                         |

## Next steps

Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), [connect data sources](connect-data-sources.md), and [get visibility into your data, and potential threats](get-visibility.md).