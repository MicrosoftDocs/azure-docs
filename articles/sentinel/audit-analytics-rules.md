---
title: Monitor health of your Microsoft Sentinel service and audit user activity 
description: Monitor activity, connectivity, and performance for key resources and key user actions in your environment.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 08/19/2022
ms.service: microsoft-sentinel
---

# Monitor health of your Microsoft Sentinel service and audit user activity 

With the Microsoft Sentinel health and audit feature, you can monitor the activity of key resources in your environment, and get data on the users that performed various actions. This article describes how to use health and audit for deeper monitoring and visibility of actions in your environment. 

- The health component of the feature, represented by the *SentinelHealth* table, verifies that various Microsoft Sentinel resources performs the actions that they were instructed to perform. 
- The audit component of the feature, represented by the *SentinelAudit* table, checks various user actions against the Microsoft Sentinel service. 

Learn more about the [health and audit feature](health-audit.md).

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Health and audit resources and options 

This article describes different options to view, query, and analyze health and audit data:

|Resource  |Uses |Options  |Health  |Audit |
|---------|---------|---------|---------|---------|
|Data connectors     |• Monitor your connector health, viewing any service or data source issues, such as authentication, throttling, and more.<br>• Configure notifications for health drifts for relevant stakeholders who can take action. For example, configure email messages, Microsoft Teams messages, new tickets in your ticketing system, and so on. |• [*SentinelHealth* data table (Public preview)](#use-the-sentinelhealth-data-table-public-preview). Provides insights on health drifts, such as latest failure events per connector, or connectors with changes from success to failure states, which you can use to create alerts and other automated actions. The *SentinelHealth* data table is currently supported only for [selected data connectors](#supported-data-connectors).<br>• [Data connectors health monitoring workbook](#use-the-health-monitoring-workbook-for-data-connectors). Provides additional monitors, detects anomalies, and gives insight regarding the workspace’s data ingestion status. You can use the workbook’s logic to monitor the general health of the ingested data, and to build custom views and rule-based alerts.         |Supported (Public preview)<br>• Export the data into various destinations, like your Log Analytics workspace, archiving to a storage account, and more. Learn about the [supported destinations](../azure-monitor/essentials/diagnostic-settings.md) for your logs.        |Not supported |
|Analytics rules     |TBD  |• [*SentinelHealth* data table (Public preview)](#use-the-sentinelhealth-data-table-public-preview). Provides insights on health drifts, such as latest failure events per rule, or rules with changes from success to failure states, which you can use to create alerts and other automated actions.<br>• [*SentinelAudit* data table (Public preview)](#use-the-sentinelaudit-data-table-public-preview). Provides insights on user audit actions, such as the user name and IP of a user disabling a rule.<br>• Export the data into various destinations, like your Log Analytics workspace, archiving to a storage account, and more. Learn about the [supported destinations](../azure-monitor/essentials/diagnostic-settings.md) for your logs.         |Supported (Public preview)       |Supported (Public preview) |

## Use the SentinelHealth data table (Public preview)

To get health data from the *SentinelHealth* data table, you must first turn on the Microsoft Sentinel health and audit feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](monitor-sentinel-health.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your resource.

### Supported data connectors

The *SentinelHealth* data table is currently supported only for the following data connectors:

- [Amazon Web Services (CloudTrail and S3)](connect-aws.md)
- [Dynamics 365](connect-dynamics-365.md)
- [Office 365](connect-office-365.md)
- [Office ATP](connect-microsoft-defender-advanced-threat-protection.md)
- [Threat Intelligence - TAXII](connect-threat-intelligence-taxii.md)
- [Threat Intelligence Platforms](connect-threat-intelligence-tip.md)

### Understanding SentinelHealth table events

The following types of health events are logged in the *SentinelAudit* table:

|Resource  |Event  |Description  |
|---------|---------|---------|
|Data connectors     |Data fetch status change         |• Logged once an hour as long as a data connector status remains stable, with either continuous success or failure events. For as long as a data connector's status does not change, monitoring only hourly works to prevent redundant auditing and reduce table size. If the data connector's status has continuous failures, additional details about the failures are included in the *ExtendedProperties* column.<br>• If the data connector's status changes, either from a success to failure, from failure to success, or has changes in failure reasons, the event is logged immediately to allow your team to take proactive and immediate action.<br>• Potentially transient errors, such as source service throttling, are logged only after they've continued for more than 60 minutes. These 60 minutes allow Microsoft Sentinel to overcome a transient issue in the backend and catch up with the data, without requiring any user action. Errors that are definitely not transient are logged immediately.         |
|Data connectors     |Failure summary         |Logged once an hour, per connector, per workspace, with an aggregated failure summary. Failure summary events are created only when the connector has experienced polling errors during the given hour. They contain any extra details provided in the *ExtendedProperties* column, such as the time period for which the connector's source platform was queried, and a distinct list of failures encountered during the time period.         |

Learn more from the [SentinelHealth table columns schema](health-audit-table-reference.md).

### Run queries to detect health drifts

Create queries on the *SentinelHealth* table to help you detect health drifts in your resources. 

#### Data connector queries

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

#### Rules analytics queries

TBD

## Use the SentinelAudit data table (Public preview)

To get audit data from the *SentinelAudit* data table, you must first turn on the Microsoft Sentinel health and audit feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](monitor-sentinel-health.md).

Once the health and audit feature is turned on, the *SentinelAudit* data table is created at the first success or failure event generated for your resource.

### Understanding SentinelAudit table events

The following types of health events are logged in the *SentinelHealth* table:

|Resource  |Event  |Description  |
|---------|---------|---------|
|TBD |TBD |TBD |

Learn more from the [SentinelAudit table columns schema](health-audit-table-reference.md).

### Run queries for user audit (analytics rules)

Create queries on the *SentinelAudit* table to help you detect health drifts in your analytics rules. 

TBD - add queries

## Configure alerts and automated actions for health and audit issues

While you can use the Microsoft Sentinel [analytics rules](automate-incident-handling-with-automation-rules.md) to configure automation in Microsoft Sentinel logs, if you want to be notified and take immediate action for health drifts, we recommend that you use [Azure Monitor alert rules](../azure-monitor/alerts/alerts-overview.md).

For example:

1. In an Azure Monitor alert rule, select your Microsoft Sentinel workspace as the rule scope, and **Custom log search** as the first condition.

1. Customize the alert logic as needed, such as frequency or lookback duration, and then use [queries](#run-queries-to-detect-health-drifts) to search for health drifts.

1. For the rule actions, select an existing action group or create a new one as needed to configure push notifications or other automated actions such as triggering a Logic App, Webhook, or Azure Function in your system.

For more information, see [Azure Monitor alerts overview](../azure-monitor/alerts/alerts-overview.md) and [Azure Monitor alerts log](../azure-monitor/alerts/alerts-log.md).

## Use the health monitoring workbook (for data connectors)

1. From the Microsoft Sentinel portal, select **Workbooks** from the **Threat management** menu.

1. In the **Workbooks** gallery, enter *health* in the search bar, and select **Data collection health monitoring** from among the results.

1. Select **View template** to use the workbook as is, or select **Save** to create an editable copy of the workbook. When the copy is created, select **View saved workbook**.

1. Once in the workbook, first select the **subscription** and **workspace** you wish to view, then define the **TimeRange** to filter the data according to your needs. Use the **Show help** toggle to display in-place explanation of the workbook.

    :::image type="content" source="media/monitor-data-connector-health/data-health-workbook-1.png" alt-text="data connector health monitoring workbook landing page" lightbox="media/monitor-data-connector-health/data-health-workbook-1.png":::

There are three tabbed sections in this workbook:

- The **Overview** tab shows the general status of data ingestion in the selected workspace: volume measures, EPS rates, and time last log received.

- The **Data collection anomalies** tab will help you to detect anomalies in the data collection process, by table and data source. Each tab presents anomalies for a particular table (the **General** tab includes a collection of tables). The anomalies are calculated using the **series_decompose_anomalies()** function that returns an **anomaly score**. [Learn more about this function](/azure/data-explorer/kusto/query/series-decompose-anomaliesfunction?WT.mc_id=Portal-fx). Set the following parameters for the function to evaluate:

    - **AnomaliesTimeRange**: This time picker applies only to the data collection anomalies view.
    - **SampleInterval**: The time interval in which data is sampled in the given time range. The anomaly score is calculated only on the last interval's data.
    - **PositiveAlertThreshold**: This value defines the positive anomaly score threshold. It accepts decimal values.
    - **NegativeAlertThreshold**: This value defines the negative anomaly score threshold. It accepts decimal values.

        :::image type="content" source="media/monitor-data-connector-health/data-health-workbook-2.png" alt-text="data connector health monitoring workbook anomalies page" lightbox="media/monitor-data-connector-health/data-health-workbook-2.png":::

- The **Agent info** tab shows you information about the health of the Log Analytics agents installed on your various machines, whether Azure VM, other cloud VM, on-premises VM, or physical. You can monitor the following:

   - System location

   - Heartbeat status and latency

   - Available memory and disk space

   - Agent operations

    In this section you must select the tab that describes your machines’ environment: choose the **Azure-managed machines** tab if you want to view only the Azure Arc-managed machines; choose the **All machines** tab to view both managed and non-Azure machines with the Log Analytics agent installed.

    :::image type="content" source="media/monitor-data-connector-health/data-health-workbook-3.png" alt-text="data connector health monitoring workbook agent info page" lightbox="media/monitor-data-connector-health/data-health-workbook-3.png":::

## Next steps

Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), [connect data sources](connect-data-sources.md), and [get visibility into your data, and potential threats](get-visibility.md).