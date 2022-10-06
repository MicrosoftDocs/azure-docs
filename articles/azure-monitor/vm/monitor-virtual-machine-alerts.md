---
title: 'Monitor virtual machines with Azure Monitor: Alerts'
description: Learn how to create alerts from virtual machines and their guest workloads by using Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/28/2022
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Alerts

This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It provides guidance on creating alert rules for your virtual machines and their guest operating systems. [Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on data collected by VM insights. 

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md), [Tutorial: Create a metric alert for an Azure resource](../alerts/tutorial-metric-alert.md), or [Tutorial: Create alert when Azure virtual machine is unavailable](tutorial-monitor-vm-alert.md). 

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Before you create any alert rules, refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Choose the alert type
The most common types of alert rules in Azure Monitor are [metric alerts](../alerts/alerts-metric.md) and [log query alerts](../alerts/alerts-log-query.md). 
The type of alert rule that you create for a particular scenario depends on where the data is located that you're alerting on. You might have cases where data for a particular alerting scenario is available in both Metrics and Logs, and you'll need to determine which rule type to use. You might also have flexibility in how you collect certain data and let your decision of alert rule type drive your decision for data collection method.

Typically, the best strategy is to use metric alerts instead of log alerts when possible because they're more responsive and stateful. To use metric alerts, the data you're alerting on must be available in Metrics. VM insights currently sends all of its data to Logs, so you must install the Azure Monitor agent to use metric alerts with data from the guest operating system. Use Log query alerts with metric data when it's unavailable in Metrics or if you require logic beyond the relatively simple logic for a metric alert rule.

### Metric alerts
[Metric alert rules](../alerts/alerts-metric.md) are useful for alerting when a particular metric exceeds a threshold. An example is when the CPU of a machine is running high. The target of a metric alert rule can be a specific machine, a resource group, or a subscription. In this instance, you can create a single rule that applies to a group of machines.

Metric rules for virtual machines can use the following data:

- Host metrics for Azure virtual machines, which are collected automatically. 
- Metrics that are collected by the Azure Monitor agent from the guest operating system. 

> [!NOTE]
> When VM insights supports the Azure Monitor agent, which is currently in public preview, it sends performance data from the guest operating system to Metrics so that you can use metric alerts.

### Log alerts
[Log alerts](../alerts/alerts-unified-log.md) can measure two different things which can be used to monitor virtual machines in different scenarios:

- [Result count](../alerts/alerts-unified-log.md#result-count): Counts the number of rows returned by the query, and can be used to work with events such as Windows event logs, syslog, application exceptions.
- [Calculation of a value](../alerts/alerts-unified-log.md#calculation-of-a-value): Makes a calculation based on a numeric column, and can be used to include any number of resources. For example, CPU percentage.

### Targeting resources and dimensions

You can monitor multiple instances’ values with one rule using dimensions. You would use dimensions if, for example, you want to monitor CPU usage on multiple instances running your web site or app for CPU usage over 80%. 

To create resource-centric alerts at scale for a subscription or resource group, you can **Split by dimensions**.  When you want to monitor the same condition on multiple Azure resources, splitting by dimensions splits the alerts into separate alerts by grouping unique combinations using numerical or string columns. Splitting on Azure resource ID column makes the specified resource into the alert target.

You may also decide not to split when you want a condition on multiple resources in the scope, for example, if you want to alert if at least five machines in the resource group scope have CPU usage over 80%.

:::image type="content" source="media/monitor-virtual-machines/log-alert-rule.png" alt-text="Screenshot of new log alert rule with split by dimensions.":::

You might want to see a list of the alerts with the affected computers. You can use a custom workbook that uses a custom [Resource Graph](../../governance/resource-graph/overview.md) to provide this view. Use the following query to display alerts, and use the data source **Azure Resource Graph** in the workbook.

```kusto
alertsmanagementresources
| extend dimension = properties.context.context.condition.allOf
| mv-expand dimension
| extend dimension = dimension.dimensions
| mv-expand dimension
| extend Computer = dimension.value
| extend AlertStatus = properties.essentials.alertState
| summarize count() by Alert=name, tostring(AlertStatus), tostring(Computer)
| project Alert, AlertStatus, Computer
```
## Common alert rules
The following section lists common alert rules for virtual machines in Azure Monitor. Details for metric alerts and log metric measurement alerts are provided for each. For guidance on which type of alert to use, see [Choose the alert type](#choose-the-alert-type).

If you're unfamiliar with the process for creating alert rules in Azure Monitor, see the [instructions to create a new alert rule](../alerts/alerts-create-new-alert-rule.md).

### Machine unavailable
The most basic requirement is to send an alert when a machine is unavailable. It could be stopped, the guest operating system could be unresponsive, or the agent could be unresponsive. There are various ways to configure this alerting, but the most common is to use the heartbeat sent from the Log Analytics agent. 

#### Log query alert rules
Log query alerts use the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat), which should have a heartbeat record every minute from each machine. 

Use a rule with the following query.

```kusto
Heartbeat
| summarize TimeGenerated=max(TimeGenerated) by Computer, _ResourceId
| extend Duration = datetime_diff('minute',now(),TimeGenerated)
| summarize AggregatedValue = min(Duration) by Computer, bin(TimeGenerated,5m), _ResourceId
```
#### Metric alert rules
A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace sends a heartbeat metric value each minute. Because the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. Set the **Aggregation type** to **Count** and the **Threshold** value to match the **Evaluation granularity**.

### CPU alerts
#### Metric alert rules

| Target | Metric |
|:---|:---|
| Host | Percentage CPU |
| Windows guest | \Processor Information(_Total)\% Processor Time |
| Linux guest | cpu/usage_active |

#### Log alert rules

**CPU utilization** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```
### Memory alerts

#### Metric alert rules

| Target | Metric |
|:---|:---|
| Windows guest | \Memory\% Committed Bytes in Use<br>\Memory\Available Bytes |
| Linux guest | mem/available<br>mem/available_percent |

#### Log alert rules

**Available memory in MB** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

**Available memory in percentage** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"]) | extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0
| summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer, _ResourceId  
``` 

### Disk alerts

#### Metric alert rules

| Target | Metric |
|:---|:---|
| Windows guest | \Logical Disk\(_Total)\% Free Space<br>\Logical Disk\(_Total)\Free Megabytes |
| Linux guest | disk/free<br>disk/free_percent |

#### Log query alert rules

**Logical disk used - all disks on each computer** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

**Logical disk used - individual disks** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk 
```

**Logical disk IOPS**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "TransfersPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk 
```
**Logical disk data rate**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "BytesPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk 
```

## Network alerts

#### Metric alert rules

| Target | Metric |
|:---|:---|
| Windows guest | \Network Interface\Bytes Sent/sec<br>\Logical Disk\(_Total)\Free Megabytes |
| Linux guest | disk/free<br>disk/free_percent |

### Log query alert rules

**Network interfaces bytes received - all interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId  
```

**Network interfaces bytes received - individual interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface 
```

**Network interfaces bytes sent - all interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

**Network interfaces bytes sent - individual interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface 
```

## Example log query alert
Here's a walk-through of creating a log alert for when the CPU of a virtual machine exceeds 80 percent. The data you need is in the [InsightsMetrics table](/azure/azure-monitor/reference/tables/insightsmetrics). The following query returns the records that need to be evaluated for the alert. Each type of alert rule uses a variant of this query.
### Create the log alert rule
 1. In the portal, select the relevant resource. We recommend scaling resources by using subscriptions or resource groups. 
 1. In the Resource menu, select **Logs**.
 1. Use this query to monitor for virtual machines CPU usage:
 
    ```kusto
    InsightsMetrics
    | where Origin == "vm.azm.ms"
    | where Namespace == "Processor" and Name == "UtilizationPercentage"
    | summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
    ```
 1. Run the query to make sure you get the results you were expecting.
 1. From the top command bar, Select **+ New alert rule** to create a rule using the current query.
 1. The **Create an alert rule** page opens with your query. We try to detect summarized data from the query results automatically. If detected, the appropriate values are automatically selected. 
     :::image type="content" source="media/monitor-virtual-machines/log-alert-rule-query.png" alt-text="Screenshot of new log alert rule query.":::
 1. In the **Measurement** section, select the values for these fields if they are not already automatically selected.
 
    |Field  |Description  |Value for this scenario |
    |---------|---------|---------|
    |Measure| The number of table rows or a numeric column to aggregate |AggregatedValue|
    |Aggregation type|The type of aggregation to apply to the data points in aggregation granularity|Average|
    |Aggregation granularity|The interval over which data points are grouped by the aggregation type|15 minutes|
    
    :::image type="content" source="media/monitor-virtual-machines/log-alert-rule-measurement.png" alt-text="Screenshot of new log alert rule measurement. ":::
 1. In the **Split by dimensions** section, select the values for these fields if they are not already automatically selected.
     
    |Field|Description  |Value for this scenario |
    |---------|---------|---------|
    |Resource ID column|An Azure Resource ID column that will split the alerts and set the fired alert target scope.|_Resourceid|
    |Dimension name|Dimensions monitor specific time series and provide context to the fired alert. Dimensions can be either number or string columns. If you select more than one dimension value, each time series that results from the combination will trigger its own alert and will be charged separately. The displayed dimension values are based on data from the last 48 hours. Custom dimension values can be added by clicking 'Add custom value'.|Computer|
    |Operator|The operator to compare the dimension value|=|
    |Dimension value| The list of dimension column values |All current and future values| 
    
    :::image type="content" source="media/monitor-virtual-machines/log-alert-rule-dimensions.png" alt-text="Screenshot of new log alert rule with dimensions. ":::
 1. In the **Alert Logic** section, select the values for these fields if they are not already automatically selected.
      
    |Field  |Description  |Value for this scenario |
    |---------|---------|---------|
    |Operator |The operator to compare the metric value against the threshold|Greater than|
    |Threshold value| The value that the result is measured against.|80|
    |Frequency of evaluation|How often the alert rule should run. A frequency smaller than the aggregation granularity results in a sliding window evaluation.|15 minutes|
  1. (Optional) In the **Advanced options** section, set the **Number of violations to trigger alert**.
     :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-rule-preview-advanced-options.png" alt-text="Screenshot of alerts rule preview advanced options.":::

  1. The **Preview** chart shows query evaluations results over time. You can change the chart period or select different time series that resulted from unique alert splitting by dimensions.
     :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-create-alert-rule-preview.png" alt-text="Screenshot of alerts rule preview.":::

  1. From this point on, you can select the **Review + create** button at any time. 
  1. In the **Actions** tab, select or create the required [action groups](../alerts/action-groups.md).
     :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-rule-actions-tab.png" alt-text="Screenshot of alerts rule preview actions tab.":::

  1. In the **Details** tab, define the **Project details** and the **Alert rule details**.
  1. (Optional) In the **Advanced options** section, you can set several options, including whether to **Enable upon creation**, or to **mute actions** for a period after the alert rule fires.
     :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-log-rule-details-tab.png" alt-text="Screenshot of alerts rule preview details tab.":::
    > [!NOTE]
    > If you or your administrator assigned the Azure Policy **Azure Log Search Alerts over Log Analytics workspaces should use customer-managed keys**, you must select **Check workspace linked storage** option in **Advanced options**, or the rule creation will fail as it will not meet the policy requirements.

1. In the **Tags** tab, set any required tags on the alert rule resource.
   :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-rule-tags-tab.png" alt-text="Screenshot of alerts rule preview tags tab.":::

1. In the **Review + create** tab, a validation will run and inform you of any issues.
1. When validation passes and you have reviewed the settings, click the **Create** button.    
   :::image type="content" source="../alerts/media/alerts-create-new-alert-rule/alerts-rule-review-create.png" alt-text="Screenshot of alerts rule preview review and create tab.":::
## Next steps

* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)
* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
