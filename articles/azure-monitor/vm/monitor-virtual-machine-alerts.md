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
[Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on data collected by VM insights. This article provides guidance on creating alert rules for alerting on the guest operating system of virtual machines.

> [!NOTE]
> This article is part of the [Monitoring virtual machines and their workloads in Azure Monitor scenario](monitor-virtual-machine.md).

> [!NOTE]
> This article doesn't describe how to alert on workloads running on the virtual machine. The same types of alert rules are used to alert on workloads. See [Monitoring virtual machines with Azure Monitor - Workloads](monitor-virtual-machine-workloads.md) for details on the different kinds of data that can be collected and sample alert rules for each.

> [!NOTE]
> The alerts described in this article do not include alerts created by [Azure Monitor for VM guest health](vminsights-health-overview.md) which is a feature currently in public preview. As this feature nears general availability, guidance for alerting will be consolidated.

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before you create any alert rules.
## Types of alert rules
Alert rules in Azure Monitor define the logic used to determine when an alert should be created. Alert rules use data that's already collected by Azure Monitor. For virtual machines, this is data collected by VM insights potentially [workloads that you've configured](monitor-virtual-machine-workloads.md). Once the data is being collected, you need to create alert rules to identify which data should generate an alert.

The type of alert rule is determined by the type of data it uses. Virtual machines will typically use the alerts in the following table.


| Type | Stateful | Description  |
|:---|:--|:---|
| [Activity log](../alerts/alerts-activity-log.md) | No | Fire an alert when an event matching certain criteria is created in the Activity log. You could create an alert, for example, when a virtual machine is stopped, but metric and log alerts are typically going to provide more reliable alerting for virtual machines. |
| [Metric](../alerts/alerts-metric.md) | Yes | Fire an alert when a metric value exceeds a threshold. A single metric alert rule can be applied to multiple machines and create a separate alert for each. As a general rule, you should use a metric alert instead of a log alert if you're collecting the required data in Metrics, and you can define the required logic. More complex logic will require a log alert rule. |
| [Log query](../alerts/alerts-log.md)   | No | Fire an alert when the result of a log query matches certain criteria. Use a metric measurement alert rule to create a separate alert for each computer. Use log query alerts for any data that isn't stored in Metrics or if you require more complex logic than you can implement with a metric alert rule. |

### Choosing the alert type
The type of rule that you create will depend on where the data is located that you're alerting on. You may have cases though where data for a particular alerting scenario is available in both Metrics and Logs, and you need to determine which rule type to use. You may also have flexibility in how you collect certain data ad let your decision of alert rule type drive your decision for data collection method.

It's typically the best strategy to use metric alerts instead of log alerts when possible since they're more responsive and stateful. This of course requires that the data you're alerting on is available in metrics. Since VM insights currently sends all of its data to Logs, you may not have the data you require in Metrics. Use Log query alerts with metric data when its either not available in Metrics or you require additional logic beyond the relatively simple logic for a metric alert rule.

You may also have a condition where you have different data available for different machines. For example, you may want an alert rule for high CPU applied to a combination of Azure and hybrid virtual machines. You could use a metric alert rule for the Azure virtual machines, but host metrics aren't collected for hybrid machines. Instead of creating a metric and log alert rule, you may choose to standardize on a sing log query alert rule that applies to all machines.

> [!NOTE]
> The Azure Monitor Agent, currently in public preview, will replace the Log Analytics agent and have the ability to send client performance data to both Logs and Metrics. When this agent becomes generally available with VM insights, then all performance data will sent to both Logs and Metrics significantly simplifying this logic. 
### Metric alert rules
[Metric alert rules](../alerts/alerts-metric.md) are useful for alerting when a particular metric exceeds a threshold. For example, when the CPU of a machine is running high. Metric rules for virtual machines can use the following data:

- Host metrics for Azure virtual machines which are collected automatically. Some of these values reflect the same value as the guest operating system making them useful for alerting. The metrics displayed on the **Overview** page of the virtual machine, including **CPU**, **Network**, **Disk Bytes**, and **Disk operations/sec**, are good examples of host metrics valuable for alerting.
- Metrics that are collected by the diagnostic extension from the quest operating system. These will only be collected if you have the [diagnostic extension](monitor-virtual-machine-onboard.md#send-guest-performance-data-to-metrics-optional) installed.
- Certain performance counters stored in logs using the process described at [Create Metric Alerts for Logs in Azure Monitor](../alerts/alerts-metric-logs.md). These counters must be collected from the Log Analytics workspace and stored in the **Perf** table as described in [Monitoring virtual machines with Azure Monitor - Workloads](monitor-virtual-machine-workloads.md#custom-performance-counters). This will result in additional cost since this is the same data being collected by VM insights and sent to Logs.

> [!NOTE]
> When VM insights supports the Azure Monitor Agent which is currently in public preview, then it will send performance data from the guest operating system to Metrics so that you can use metric alerts.


## Target resource and impacted resource
Each alert in Azure Monitor has an **Affected resource** property. When you create an alert rule, you specify a target resource, which is the Azure resource with the data to analyze for the alert. This resource will typically define the **Affected resource** for the alert which is which is displayed in the standard alert view.

![Alert view]()

Log query alerts will be associated with the workspace resource instead of the machine, even when you use a metric measurement alert that creates an alert for each computer. You need to view the details of the alert to view the computer that was affected. 

The computer name is stored in the **Impacted resource** property. You can be included this value in notifications that fire in response to the alert. Create a workbook to create a custom view that shows alerts with computer names. 


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


## Alert on VM down
One of the most basic alerts is to determine whether a machine is available. You shouldn't just check if the machine is running, because it could be running but the guest operating system or agent is unresponsive. THe most common strategy for this alert is a metric measurement alert rule using the *Heartbeat* table from VM insights. 

| Property | Value |
|:---|:---|
| Resource | Log Analytics workspace |
| Dimension name | Computer = All current and future values |
| Alert logic | Metric measurement Greater than 5 | The numeric value is number of minutes since last heartbeat. Change this value to change the threshold. |
| Trigger alert | Total breaches Greater than 0 |
| Query | `Heartbeat | summarize TimeGenerated=max(TimeGenerated) by Computer | extend Duration = datetime_diff 'minute',now(),TimeGenerated) | summarize AggregatedValue = min(Duration) by Computer, bin(TimeGenerated,1)` |
| Evaluation period | 1440 | This evaluates any computers that sent a heartbeat in the last 24 hours. If the computer didn’t send a heartbeat within this window, then it won’t be included in the query. |
| Evaluated frequency | 5 | Query is run and evaluation performed every 5 minutes. |

Other methods 

| Method | Min Frequency | Stateful | Description |
|:---|:---|:---|:---|
| Log query alert | 5 minutes | No | Each virtual machine sends a record to the [Heartbeat]() table in the Log Analytics workspace every minute. Create a log query that retrieves the last heartbeat for each computer and alerts on those that have exceeded a particular threshold. There are two methods for this depending on whether you want to receive a single alert for multiple computers or a separate alert for each computer. |
| Metric heartbeat | 1 minutes | Yes | A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace will send a heartbeat metric value each minute. Since the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. |
| Activity log | Immediate | No | Only checks when the machine is stopped. Doesn't detect when the guest operating system or agent is unresponsive. |


| Method | Description |
|:---|:---|
| Log query alert - separate alerts | Create a metric measurement alert using the process described above. |
| Log query alert - single alert | This also uses the *Heartbeat* table from VM insights, but it creates a single alert for all computers instead of a separate alert for each computer. Create a **Number of Results** alert rule using the query `Heartbeat | summarize LastHeartbeat=max(TimeGenerated) by Computer | where LastHeartbeat < ago(5m)`. The **Trigger alert** property should be **Total breaches Greater than 0**. |
| Metric heartbeat | A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace will send a heartbeat metric value each minute. Since the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. |
| Activity log |  |

### Log query alert


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

| Description | Query |
|:---|:---|
| CPU utilization | `InsightsMetrics | where Origin == "vm.azm.ms" | where Namespace == "Processor" and Name == "UtilizationPercentage" | summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId`  |
| CPU utilization for all compute resources in a subscription | `InsightsMetrics | where Origin == "vm.azm.ms" | where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" and (_ResourceId contains "/providers/Microsoft.Compute/virtualMachines/" or _ResourceId contains "/providers/Microsoft.Compute/virtualMachineScaleSets/") | where Namespace == "Processor" and Name == "UtilizationPercentage" | summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId` |
| CPU utilization for all compute resources in a resource group | `InsightsMetrics | where Origin == "vm.azm.ms" | where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/" or _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/" | where Namespace == "Processor" and Name == "UtilizationPercentage" | summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId` |
| Available Memory in MB | `InsightsMetrics | where Origin == "vm.azm.ms" | where Namespace == "Memory" and Name == "AvailableMB" | summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId` | 
| Available Memory in percentage | `InsightsMetrics | where Origin == "vm.azm.ms" | where Namespace == "Memory" and Name == "AvailableMB" | extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"]) | extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0 | summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer, _ResourceId ` |


##
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