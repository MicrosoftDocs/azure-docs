---
title: Monitor Azure virtual machines with Azure Monitor - Alerts
description: Describes how to create alerts from virtual machines and their guest workloads using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/26/2021

---

# Monitoring virtual machines with Azure Monitor - Alerts
[Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on collected telemetry. This article provides guidance on creating alert rules for alerting on the guest operating system of virtual machines and provides a set of recommended alerts.

> [!IMPORTANT]
> The alerts described in this article do not include alerts created by [Azure Monitor for VM guest health](vminsights-health-overview.md) which is a feature currently in public preview. As this feature nears general availability, guidance for alerting will be consolidated.


## Types of alert rules
Alert rules define the logic used to determine when an alert should be created. VM insights and other configuration in Azure Monitor collects the data used by alert rules, but you need to create rules to define alerting conditions in your Azure subscription.



| Type | Stateful | Description  |
|:---|:--|:---|
| [Activity log](../alerts/alerts-activity-log.md) | No | Creates an alert when an event matching certain criteria is created in the Activity log. You could create an alert, for example, when a virtual machine is stopped, but metric and log alerts are typically going to provide more reliable alerting for virtual machines. |
| [Metric](../alerts/alerts-metric.md) | Yes | Fire an alert when a metric value exceeds a threshold. A single metric alert rule can be applied to multiple machines and create a separate alert for each. As a general rule, you should use a metric alert instead of a log alert if you're collecting the required data in Metrics, and you can define the required logic. More complex logic will require a log alert rule. |
| [Log query](../alerts/alerts-log.md)   | No | Fire an alert when the result of a log query matches certain criteria. Use a metric measurement alert rule to create a separate alert for each computer. Use log query alerts for any data that isn't stored in Metrics or if you require more complex logic than you can implement with a metric alert rule. |

### Metric alert rules
It's typically the best strategy to use metric alerts instead of log alerts when possible since they're more responsive and stateful. This of course requires that the data you're alerting on is available in metrics. VM insights currently send all of its data to Logs so you may not have the data you require in Metrics.

- Host metrics which are collected automatically. **Percentage CPU** is a common metric that reflects the same value in the guest operating system, but most of the host metrics are not going to be as valuable for alerting at the guest operating system metrics.
- Metrics that are collected by the diagnostic extension from the quest operating system. These will only be collected if you have the diagnostic extension installed.
- Certain performance counters stored in logs using the process described at [Create Metric Alerts for Logs in Azure Monitor](../alerts/alerts-metric-logs.md). These counters must be collected from the Log Analytics workspace and stored in the **Perf** table as described in []().

> [!NOTE]
> When VM insights supports the Azure Monitor Agent which is currently in public preview, then it will send performance data from the guest operating system to Metrics so that you can use metric alerts.


### Log alert rules
Azure Monitor has [different types of alert rules](../alerts/alerts-overview.md#what-you-can-alert-on) based on the data being used to create the alert. All data collected by VM insights is stored in Azure Monitor Logs which supports [log alerts](../alerts/alerts-log.md). You cannot currently use [metric alerts](../alerts/alerts-log.md) with performance data collected from VM insights because the data is not collected into Azure Monitor Metrics. To collect data for metric alerts, install the [diagnostics extension](../agents/diagnostics-extension-overview.md) for Windows VMs or the [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) for Linux VMs to collect performance data into Metrics.

There are two types of log alerts in Azure Monitor:

- [Number of results alerts](../alerts/alerts-unified-log.md#count-of-the-results-table-rows) create a single alert when a query returns at least a specified number of records. These are ideal for non-numeric data such and Windows and Syslog events collected by the [Log Analytics agent](../agents/log-analytics-agent.md) or for analyzing performance trends across multiple computers.
- [Metric measurement alerts](../alerts/alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value) create a separate alert for each record in a query that has a value that exceeds a threshold defined in the alert rule. These alert rules are ideal for performance data collected by VM insights since they can create individual alerts for each computer.



### Metric measurement rule walkthrough
This section walks through the creation of a metric measurement alert rule using performance data from VM insights. You can use this basic process with a variety of log queries to alert on different performance counters.

Start by creating a new alert rule following the procedure in [Create, view, and manage log alerts using Azure Monitor](../alerts/alerts-log.md). For the **Resource**, select the Log Analytics workspace that Azure Monitor VMs uses in your subscription. Since the target resource for log alert rules is always a Log Analytics workspace, the log query must include any filter for particular virtual machines or virtual machine scale sets. 

For the **Condition** of the alert rule, use one of the queries in the [section below](#sample-alert-queries) as the **Search query**. The query must return a numeric property called *AggregatedValue*. It should summarize the data by computer so that you can create a separate alert for each virtual machine that exceeds the threshold.

In the **Alert logic**, select **Metric measurement** and then provide a **Threshold value**. In **Trigger Alert Based On**, specify how many times the threshold must be exceeded before an alert is created. For example, you probably don't care if the processor exceeds a threshold once and then returns to normal, but you do care if it continues to exceed the threshold over multiple consecutive measurements.

The **Evaluated based on** section defines how often the query is run and the time window for the query. In the example shown below, the query will run every 15 minutes and evaluate performance values collected over the previous 15 minutes.


![Metric measurement alert rule](media/vminsights-alerts/metric-measurement-alert.png)



## Target resource and impacted resource
Each alert in Azure Monitor has an **Affected resource** 
When you create an alert rule, you specify a target resource, which is the Azure resource with the data to analyze for the alert. This resource will typically define the **Affected resource** for the alert which is 

Log query alerts will be associated with the workspace resource instead of the machine. You need to view the details of the alert to view the computer that was affected. The computer name can be included in notifications that fire in response to the alert. Create a workbook to create a custom view that shows alerts with computer names. Example in workbooks section.

You can associate a log query alert with a computer if you create a resource centric alert rule. The workspace must be set to resource-centric or workspace permissions as described in Manage Log Analytics workspaces in Azure Monitor.  The  target resource must be set to a particular virtual machine meaning that you require a separate rule for each. This isn’t a scalable solution and should only be used for particular high priority computers.


| Resource | Data sources |
|:---|:---|
| Single VM | Metrics (Host)<br>Activity Log |
| All virtual machines in a resource group | Metrics (Host)<br>Activity Log |
| Workspace | Metrics (Guest OS)<br>Log query |


### Custom workbook
Since the default alert view doesn't show the affected computer with the list of alerts, you can create a custom workbook that uses a custom [Resource Graph](../../governance/resource-graph/overview.md) to provide this view. 

Following is a query that can be used to display alerts. 

Data source: Azure Resource Graph
Query: 


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


## VM available
One of the most basic alerts is to determine whether a machine is available. You shouldn't just check if the machine is running, because it could be running but the guest operating system or agent is unresponsive. There are multiple methods for this alert.

| Method | Min Frequency | Stateful | Description |
|:---|:---|:---|:---|
| Log query alert | 5 minutes | No | Each virtual machine sends a record to the [Heartbeat]() table in the Log Analytics workspace every minute. Create a log query that retrieves the last heartbeat for each computer and alerts on those that have exceeded a particular threshold. There are two methods for this depending on whether you want to receive a single alert for multiple computers or a separate alert for each computer. |
| Metric heartbeat | 1 minutes | Yes | A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace will send a heartbeat metric value each minute. Since the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. |
| Activity log | Immediate | No | Only checks when the machine is stopped. Doesn't detect when the guest operating system or agent is unresponsive. |


### Log query alert

**Separate alert for each computer**
Using a metric measurement alert rule, you can create a separate alert for computer. This type of alert rule requires a query with a particular format, and you set the threshold in the rule definition as opposed to the query itself.

| Property | Value |
|:---|:---|
| Resource | Log Analytics workspace |
| Dimension name | Computer = All current and future values |
| Alert logic | Metric measurement Greater than 5 | The numeric value is number of minutes since last heartbeat. Change this value to change the threshold. |
| Trigger alert | Total breaches Greater than 0 |
| Query | `Heartbeat | summarize TimeGenerated=max(TimeGenerated) by Computer | extend Duration = datetime_diff 'minute',now(),TimeGenerated) | summarize AggregatedValue = min(Duration) by Computer, bin(TimeGenerated,1)` |
| Evaluation period | 1440 | This evaluates any computers that sent a heartbeat in the last 24 hours. If the computer didn’t send a heartbeat within this window, then it won’t be included in the query. |
| Evaluated frequency | 5 | Query is run and evaluation performed every 5 minutes. |

**Single alert for all computers**
Create a query that returns a single record for all machines with a last heartbeat that exceeds the threshold. The alert rule will fire if the query returns any records. This is useful if you have a set of computers that work together. 

| Property | Value |
|:---|:---|
| Resource | Log Analytics workspace |
| Dimension name | Computer = All current and future values |
| Alert logic | Metric measurement Greater than 5 | The numeric value is number of minutes since last heartbeat. Change this value to change the threshold. |
| Trigger alert | Total breaches Greater than 0 |
| Query | `Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer | where LastHeartbeat < ago(5m)` |
| Evaluation period | 1440 | This evaluates any computers that sent a heartbeat in the last 24 hours. If the computer didn’t send a heartbeat within this window, then it won’t be included in the query. |
| Evaluated frequency | 5 | Query is run and evaluation performed every 5 minutes. |

### Metric heartbeat
A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace will send a heartbeat metric value each minute. Since the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. 

| Property | Value |
|:---|:---|
| Resource | Log Analytics workspace |
| Signal | Heartbeat metric |
| Dimension name | Computer = All current and future values. |
| Alert logic  | Threshold: Static<br>Operator: Less than or equal to<br>Aggregation type: Count<br>Threshold value: 5 (should match the granularity. 1 per minute)<br>Unit: Count |
| Evaluation granularity | 5 minutes |
| Evaluation frequency | 1 minute |

## Performance alerts


Use the guidance above to create metric measurement alert rules using each of the following queries. You can also modify these queries according to your particular requirements.

### CPU
#### CPU utilization for all machines

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

#### CPU utilization for Virtual machine scale set
Modify with your subscription ID, resource group, and virtual machine scale set name.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/my-vm-scaleset" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```

#### CPU utilization for specific virtual machine
Modify with your subscription ID, resource group, and VM name.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId =~ "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m)
```

#### CPU utilization for all compute resources in a subscription
Modify with your subscription ID.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" and (_ResourceId contains "/providers/Microsoft.Compute/virtualMachines/" or _ResourceId contains "/providers/Microsoft.Compute/virtualMachineScaleSets/")
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```

#### CPU utilization for all compute resources in a resource group
Modify with your subscription ID and resource group.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/"
or _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```
### Memory

#### Available Memory in MB

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

#### Available Memory in percentage

```kusto
InsightsMetrics 
| where Origin == "vm.azm.ms" 
| where Namespace == "Memory" and Name == "AvailableMB" 
| extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"])
| extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0 
| summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

### Disk
#### Logical disk used - all disks on each computer

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

#### Logical disk used - individual disks

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk
```

#### Logical disk IOPS

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "TransfersPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) ), Computer, _ResourceId, Disk
```

#### Logical disk data rate

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "BytesPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) , Computer, _ResourceId, Disk
```

### Network
#### Network interfaces bytes received - all interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

#### Network interfaces bytes received - individual interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface
```

#### Network interfaces bytes sent - all interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

#### Network interfaces bytes sent - individual interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface
```



## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)