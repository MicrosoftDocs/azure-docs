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

This article is part of the scenario content [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). 

[Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on data you collect from the Azure Monitor agent. 

This article presents alerting concepts specific to virtual machines and common alert rules used by other Azure Monitor customers. See [Monitor virtual machines with Azure Monitor: Workloads](monitor-virtual-machine-workloads.md) for guidance on using these concepts to create other alert rules based on your particular requirements.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md). To quickly enable a recommended set of alerts, see [Enable recommended alert rules for Azure virtual machine](tutorial-monitor-vm-alert-recommended.md)

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Before you create any alert rules, refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Recommended alert rules
Azure Monitor provides a set of [recommended alert rules](tutorial-monitor-vm-alert-availability.md) that you can quickly enable for an Azure virtual machine. These are a good starting point for basic monitoring but will not provide sufficient alerting for most enterprise implementations for the following reasons:

- Recommended alerts only apply to Azure virtual machines and not hybrid machines.
- Recommended alerts only include host metrics and not guest metrics or logs. These are useful to monitor the health of the machine itself but give you minimal visibility into the workloads and applications running on the machine.
- Recommended alerts are associated with individual machines creating an excessive number of alert rules. Instead of relying on this method for each machine, see [Scaling alert rules](#scaling-alert-rules) for strategies on using a minimal number of alert rules for multiple machines.

## Alert types

The most common types of alert rules in Azure Monitor are [metric alerts](../alerts/alerts-metric.md) and [log query alerts](../alerts/alerts-log-query.md).
The type of alert rule that you create for a particular scenario depends on where the data is located that you're alerting on. You might have cases where data for a particular alerting scenario is available in both Metrics and Logs, and you'll need to determine which rule type to use. You might also have flexibility in how you [collect certain data]() and let your decision of alert rule type drive your decision for data collection method.

Typically, the best strategy is to use metric alerts instead of log alerts when possible because they're more responsive and stateful. To use metric alerts, the data you're alerting on must be available in Metrics. Use Log query alerts with metric data when it's unavailable in Metrics or if you require logic beyond the relatively simple logic for a metric alert rule. If you're only using VM insights data collection, you need to create an additional DCR to send performance data to Metrics if you want to create metric alerts from guest performance data. 

| Type | Common uses for virtual machines | Data sources |
|:---|:---|:---|
| [Metric](../alerts/alerts-types.md#metric-alerts) | Alert when a particular metric exceeds a threshold. An example is when the CPU of a machine is running high.  | - Host metrics for Azure virtual machines, which are collected automatically.<br>- Metrics that are collected by the Azure Monitor agent from the guest operating system. |
| [Log](../alerts/alerts-types.md#log-alerts)  | - Alert when a particular event or pattern of events from Windows event log or syslog are found. These alert rules will typically measure table rows returned from the query.<br>- Alert based on a calculation of numeric data across multiple machines. These alert rules will typically measure the calculation of a numeric column. | Data collected in a Log Analytics workspace. |

## Scaling alert rules
Since you may have many virtual machines that require the same monitoring, you don't want to have to create individual alert rules for each one. There are different strategies to limit the number of alert rules you need to manage depending on the type of rule.

### Metric alert rules
Virtual machines support multiple resource metric alert rules as described in [Monitor multiple resources](../alerts/alerts-types.md#metric-alerts). This allows you to create a single metric alert rule that applies to all virtual machines in a resource group or subscription within the same region. Start with the [recommended alerts](#recommended-alert-rules) creating a corresponding rule for each using your subscription or a resource group as the target resource. You will need to create duplicate rules for each region if you have machines in multiple regions.

As you identify requirements for additional metric alert rules, use this same strategy of using a subscription or resource group as the target resource to minimize the number of alert rules you need to manage and ensure that they're automatically applied to any new machines.

### Log alert rules

If you set the target resource of a log alert rule to a specific machine, then queries are limited to data associated with that machine giving you individual alerts for it. This would require a separate alert rule for each machine though.

If you set the target resource of a log alert rule to a Log Analytics workspace, you have access to all data in that workspace which allows you to alert on data from all machines in the workgroup with a single rule. This gives you the option of creating a single alert for all machines or using dimensions to create a separate alert for each machine. 

For example, you may want to alert when an error event is created by any machine in the Windows event log. You would first need to create a data collection rule as described in [XXX]() to send these events to the `Event` table in the Log Analytics workspace. You could then create an alert rule using the workspace as the target resource and the condition shown below. 

The query will return a record for any error messages on any machine. The **Split by dimensions** option specifies the **_ResourceId** meaning that if the query returns records for multiple machines, a separate alert will be created for each.

:::image type="content" source="media/monitor-virtual-machines/log-alert-rule.png" alt-text="Screenshot of new log alert rule with split by dimensions.":::


## Common alert rules

The following section lists common alert rules for virtual machines in Azure Monitor. Details for metric alerts and log metric measurement alerts are provided for each. For guidance on which type of alert to use, see [Choose the alert type](#choose-the-alert-type). If you're unfamiliar with the process for creating alert rules in Azure Monitor, see [instructions to create a new alert rule](../alerts/alerts-create-new-alert-rule.md).

### Machine unavailable
One of the most common monitoring requirements for a virtual machine is to create an alert if it stops running. The best method for this is to create a metric alert rule in Azure Monitor using the VM availability metric which is currently in public preview. See [Create availability alert rule for Azure virtual machine](tutorial-monitor-vm-alert-availability.md) for a complete walk through on this metric.

### Agent heartbeat
The agent heartbeat is slightly different than the machine unavailable alert because it relies on the Azure Monitor agent to send a heartbeat. This can alert you if the machine is running, but the agent is unresponsive.

#### Metric alert rules

A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace sends a heartbeat metric value each minute. Because the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. Set the **Aggregation type** to **Count** and the **Threshold** value to match the **Evaluation granularity**.


#### Log query alert rules

Log query alerts use the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat), which should have a heartbeat record every minute from each machine.

Use a rule with the following query.

```kusto
Heartbeat
| summarize TimeGenerated=max(TimeGenerated) by Computer, _ResourceId
| extend Duration = datetime_diff('minute',now(),TimeGenerated)
| summarize AggregatedValue = min(Duration) by Computer, bin(TimeGenerated,5m), _ResourceId
```


### CPU alerts

#### Metric alert rules

| Target | Metric |
|:---|:---|
| Host | Percentage CPU (included in recommended alerts) |
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
| Host | Available Memory Bytes (preview) (included in recommended alerts) |
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

### Network alerts

#### Metric alert rules

| Target | Metric |
|:---|:---|
| Host | Network In Total, Network Out Total (included in recommended alerts) |
| Windows guest | \Network Interface\Bytes Sent/sec<br>\Logical Disk\(_Total)\Free Megabytes |
| Linux guest | disk/free<br>disk/free_percent |

#### Log query alert rules

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

## Next steps

* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)
* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
