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
[Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no per-configured alert rules for virtual machines, but you can create your own based on collected telemetry. This article provides guidance on creating alert rules, including a set of sample queries.

> [!IMPORTANT]
> The alerts described in this article do not include alerts created by [Azure Monitor for VM guest health](vminsights-health-overview.md) which is a feature currently in public preview. As this feature nears general availability, guidance for alerting will be consolidated.


## Alerts
[Alerts](../alerts/alerts-overview.md) in Azure Monitor proactively notify you when important conditions are found in your monitoring data and potentially launch an action such as starting a Logic App or calling a webhook. Alert rules define the logic used to determine when an alert should be created. Azure Monitor collects the data used by alert rules, but you need to create rules to define alerting conditions in your Azure subscription.

The following sections describe the types of alert rules and recommendations on when you should use each. This recommendation is based on the functionality and cost of the alert rule type. For details pricing of alerts, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Alert rule types

| Type | Cost | Stateful | Description  |
|:---|:--|:---|:---|
| Activity log | Free | No | Creates an alert when an event matching certain criteria is created in the Activity log. You could create an alert, for example, when a virtual machine is stopped, but metric and log alerts are typically going to provide more reliable alerting for virtual machines. |
| Metric | Lower cost | Yes | Fire an alert when a metric value exceeds a threshold. A single metric alert rule can be applied to multiple machines and create a separate alert for each. As a general rule, you should use a metric alert instead of a log alert if you're collecting the required data in Metrics, and you can define the required logic. More complex logic will require a log alert rule. |
| Log query | Higher cost | No | Fire an alert when the result of a log query matches certain criteria. Use a metric measurement alert rule to create a separate alert for each computer. Use log query alerts for any data that isn't stored in Metrics or if you require more complex logic than you can implement with a metric alert rule. |

### Activity log alert rules
[Activity log alert rules](../alerts/alerts-activity-log.md) fire when an entry matching particular criteria is created in the activity log. They have no cost so they should be your first choice if the logic you require is in the activity log. 

The target resource for activity log alerts can be a specific virtual machine, all virtual machines in a resource group, or all virtual machines in a subscription.

For example, create an alert if a critical virtual machine is stopped by selecting the *Power Off Virtual Machine* for the signal name.


### Metric alert rules
[Metric alert rules](../alerts/alerts-metric.md) fire when a metric value exceeds a threshold. You can define a specific threshold value or allow Azure Monitor to dynamically determine a threshold based on historical data.  Use metric alerts whenever possible with metric data since they cost less and are more responsive than log alert rules. They are also stateful meaning they will resolve themselves when the metric drops below the threshold.

The target resource for activity log alerts can be a specific virtual machine or all virtual machines in a resource group.

For example, to create an alert when the processor of a virtual machine exceeds a particular value, create a metric alert rule using *Percentage CPU* as the signal type. Set either a specific threshold value or allow Azure Monitor to set a dynamic threshold. 
l
### Log alerts
[Log alert rules](../alerts/alerts-log.md) fire when the results of a scheduled log query match certain criteria. Log query alerts are the most expensive and least responsive of the alert rules, but they have access to the most diverse data and can perform complex logic that can't be performed by the other alert rules. 

The target resource for a log query is a Log Analytics workspace. Filter for specific computers in the query.

For example, to create an alert that checks if any virtual machines in a particular resource group are offline, use the following query which returns a record for each computer that's missed a heartbeat in the last ten minutes. Use a threshold of 1 which fires if at least one computer has a missed heartbeat.

```kusto
Heartbeat
| where TimeGenerated > ago(10m)
| where ResourceGroup == "my-resource-group"
| summarize max(TimeGenerated) by Computer
```

![Log alert for missed heartbeat](media/monitor-vm-azure/log-alert-01.png)

To create an alert if an excessive number of failed logons have occurred on any Windows virtual machines in the subscription, use the following query which returns a record for each failed logon event in the past hour. Use a threshold set to the number of failed logons that you'll allow. 

```kusto
Event
| where TimeGenerated > ago(1hr)
| where EventID == 4625
```

![Log alert for failed logons](media/monitor-vm-azure/log-alert-02.png)





### Log alert rules
Azure Monitor has [different types of alert rules](../alerts/alerts-overview.md#what-you-can-alert-on) based on the data being used to create the alert. All data collected by VM insights is stored in Azure Monitor Logs which supports [log alerts](../alerts/alerts-log.md). You cannot currently use [metric alerts](../alerts/alerts-log.md) with performance data collected from VM insights because the data is not collected into Azure Monitor Metrics. To collect data for metric alerts, install the [diagnostics extension](../agents/diagnostics-extension-overview.md) for Windows VMs or the [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) for Linux VMs to collect performance data into Metrics.

There are two types of log alerts in Azure Monitor:

- [Number of results alerts](../alerts/alerts-unified-log.md#count-of-the-results-table-rows) create a single alert when a query returns at least a specified number of records. These are ideal for non-numeric data such and Windows and Syslog events collected by the [Log Analytics agent](../agents/log-analytics-agent.md) or for analyzing performance trends across multiple computers.
- [Metric measurement alerts](../alerts/alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value) create a separate alert for each record in a query that has a value that exceeds a threshold defined in the alert rule. These alert rules are ideal for performance data collected by VM insights since they can create individual alerts for each computer.




## Target resource
Log query alerts will be associated with the workspace resource instead of the machine. You need to view the details of the alert to view the computer that was affected. The computer name can be included in notifications that fire in response to the alert. Create a workbook to create a custom view that shows alerts with computer names. Example in workbooks section.

You can associate a log query alert with a computer if you create a resource centric alert rule. The workspace must be set to resource-centric or workspace permissions as described in Manage Log Analytics workspaces in Azure Monitor.  The  target resource must be set to a particular virtual machine meaning that you require a separate rule for each. This isn’t a scalable solution and should only be used for particular high priority computers.


| Resource | Data sources |
|:---|:---|
| Single VM | Metrics (Host)<br>Activity Log |
| All virtual machines in a resource group | Metrics (Host)<br>Activity Log |
| 
| Workspace | Metrics (Guest OS)<br>Log query |



> [!IMPORTANT]
> This section assumes the Log Analytics agent 

## VM unresponsive
The most basic type of alert for a virtual machine is whether it's responsive or not running. This could be that the machine is stopped 

### Log query alert
Each virtual machine sends a record to the Heartbeat table in the Log Analytics workspace every minute. You can create a log query that retrieves the last heartbeat for each computer and alerts on those that have exceeded a particular threshold. There are two methods for this depending on whether you want to receive a single alert for multiple computers or a separate alert for each computer.

Negatives
- Not stateful. Alert not automatically resolved once the machine is healthy again. (Stateful alerts available soon)
- Minimum frequency of 5 minutes.
- Alert associated with the workspace instead of the computer.

Positives
- Same cost regardless of number of machines.
- More selective with included machines.
- Could use complex logic.

#### Alert for each computer


## Alert rule walkthrough
This section walks through the creation of a metric measurement alert rule using performance data from VM insights. You can use this basic process with a variety of log queries to alert on different performance counters.

Start by creating a new alert rule following the procedure in [Create, view, and manage log alerts using Azure Monitor](../alerts/alerts-log.md). For the **Resource**, select the Log Analytics workspace that Azure Monitor VMs uses in your subscription. Since the target resource for log alert rules is always a Log Analytics workspace, the log query must include any filter for particular virtual machines or virtual machine scale sets. 

For the **Condition** of the alert rule, use one of the queries in the [section below](#sample-alert-queries) as the **Search query**. The query must return a numeric property called *AggregatedValue*. It should summarize the data by computer so that you can create a separate alert for each virtual machine that exceeds the threshold.

In the **Alert logic**, select **Metric measurement** and then provide a **Threshold value**. In **Trigger Alert Based On**, specify how many times the threshold must be exceeded before an alert is created. For example, you probably don't care if the processor exceeds a threshold once and then returns to normal, but you do care if it continues to exceed the threshold over multiple consecutive measurements.

The **Evaluated based on** section defines how often the query is run and the time window for the query. In the example shown below, the query will run every 15 minutes and evaluate performance values collected over the previous 15 minutes.


![Metric measurement alert rule](media/vminsights-alerts/metric-measurement-alert.png)

## VM available
One of the most basic alerts is to determine whether a machine is responsive. You could use the Activity log to determine that a machine was stopped 


## CPU utilization

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

## Memory

### Available Memory in MB

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

### Available Memory in percentage

```kusto
InsightsMetrics 
| where Origin == "vm.azm.ms" 
| where Namespace == "Memory" and Name == "AvailableMB" 
| extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"])
| extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0 
| summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

## Disk
### Logical disk used - all disks on each computer

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

### Logical disk used - individual disks

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk
```

### Logical disk IOPS

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "TransfersPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) ), Computer, _ResourceId, Disk
```

### Logical disk data rate

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "BytesPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) , Computer, _ResourceId, Disk
```

## Network
### Network interfaces bytes received - all interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId 
```

### Network interfaces bytes received - individual interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface
```

### Network interfaces bytes sent - all interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId
```

### Network interfaces bytes sent - individual interfaces

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface
```

##
### Virtual machine scale set
Modify with your subscription ID, resource group, and virtual machine scale set name.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/my-vm-scaleset" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```

### Specific virtual machine
Modify with your subscription ID, resource group, and VM name.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId =~ "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m)
```

### CPU utilization for all compute resources in a subscription
Modify with your subscription ID.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" and (_ResourceId contains "/providers/Microsoft.Compute/virtualMachines/" or _ResourceId contains "/providers/Microsoft.Compute/virtualMachineScaleSets/")
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```

### CPU utilization for all compute resources in a resource group
Modify with your subscription ID and resource group.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/"
or _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/" 
| where Namespace == "Processor" and Name == "UtilizationPercentage"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId

```



## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)