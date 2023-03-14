---
title: 'Monitor virtual machines with Azure Monitor: Alerts'
description: Learn how to create alerts from virtual machines and their guest workloads by using Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/11/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Alerts

This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). [Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on data you collect from the Azure Monitor agent. This article presents alerting concepts specific to virtual machines and common alert rules used by other Azure Monitor customers.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md). To quickly enable a recommended set of alerts, see [Enable recommended alert rules for Azure virtual machine](tutorial-monitor-vm-alert-recommended.md)

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Before you create any alert rules, refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Data collection
Alert rules inspect data that's already been collected in Azure Monitor. You need to ensure that data is being collected for a particular scenario before you can create an alert rule. See [Monitor virtual machines with Azure Monitor: Collect data](monitor-virtual-machine-data-collection.md) for guidance on configuring data collection for a variety of scenarios including all of the alert rules in this article.

## Recommended alert rules
Azure Monitor provides a set of [recommended alert rules](tutorial-monitor-vm-alert-availability.md) that you can quickly enable for any Azure virtual machine. These are a great starting point for basic monitoring but alone will not provide sufficient alerting for most enterprise implementations for the following reasons:

- Recommended alerts only apply to Azure virtual machines and not hybrid machines.
- Recommended alerts only include host metrics and not guest metrics or logs. These are useful to monitor the health of the machine itself but give you minimal visibility into the workloads and applications running on the machine.
- Recommended alerts are associated with individual machines creating an excessive number of alert rules. Instead of relying on this method for each machine, see [Scaling alert rules](#scaling-alert-rules) for strategies on using a minimal number of alert rules for multiple machines.

## Alert types

The most common types of alert rules in Azure Monitor are [metric alerts](../alerts/alerts-metric.md) and [log query alerts](../alerts/alerts-log-query.md).
The type of alert rule that you create for a particular scenario depends on where the data that you're alerting on is located. You might have cases where data for a particular alerting scenario is available in both Metrics and Logs, and you'll need to determine which rule type to use. You might also have flexibility in how you [collect certain data]() and let your decision of alert rule type drive your decision for data collection method.


### Metric alerts
Common uses for metric alerts include:
- Alert when a particular metric exceeds a threshold. An example is when the CPU of a machine is running high.

Data sources for metric alerts include:
- Host metrics for Azure virtual machines, which are collected automatically.
- Metrics collected by the Azure Monitor agent from the guest operating system

### Log alerts
Common uses for log alerts include:
- Alert when a particular event or pattern of events from Windows event log or syslog are found. These alert rules will typically measure table rows returned from the query.
- Alert based on a calculation of numeric data across multiple machines. These alert rules will typically measure the calculation of a numeric column in the query results.

Data sources for metric alerts include:
- All data collected in a Log Analytics workspace.
## Scaling alert rules
Since you may have many virtual machines that require the same monitoring, you don't want to have to create individual alert rules for each one. You also want to ensure  There are different strategies to limit the number of alert rules you need to manage, depending on the type of rule. Each of these strategies depends on understanding the target resource of the alert rule.

### Metric alert rules
Virtual machines support multiple resource metric alert rules as described in [Monitor multiple resources](../alerts/alerts-types.md#metric-alerts). This allows you to create a single metric alert rule that applies to all virtual machines in a resource group or subscription within the same region. Start with the [recommended alerts](#recommended-alert-rules) and [create a corresponding rule]() for each using your subscription or a resource group as the target resource. You will need to create duplicate rules for each region if you have machines in multiple regions.

As you identify requirements for additional metric alert rules, use this same strategy of using a subscription or resource group as the target resource to minimize the number of alert rules you need to manage and ensure that they're automatically applied to any new machines.

### Log alert rules

If you set the target resource of a log alert rule to a specific machine, then queries are limited to data associated with that machine giving you individual alerts for it. This would require a separate alert rule for each machine.

If you set the target resource of a log alert rule to a Log Analytics workspace, you have access to all data in that workspace which allows you to alert on data from all machines in the workgroup with a single rule. This gives you the option of creating a single alert for all machines. You can then use dimensions to create a separate alert for each machine. 

For example, you may want to alert when an error event is created in the Windows event log by any machine. You would first need to create a data collection rule as described in [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) to send these events to the `Event` table in the Log Analytics workspace. You could then create an alert rule that queries this table using the workspace as the target resource and the condition shown below. 

The query will return a record for any error messages on any machine. Use the **Split by dimensions** option and specify **_ResourceId** to instruct the rule to create an alert for each machine if multiple machines are returned in the results.

:::image type="content" source="media/monitor-virtual-machines/log-alert-rule.png" alt-text="Screenshot of new log alert rule with split by dimensions.":::

#### Dimensions

Depending on the information you would like to include in the alert, you might need to split using different dimensions. In this case, make sure the necessary dimensions are projected in the query using the [project](/azure/data-explorer/kusto/query/projectoperator) or [extend](/azure/data-explorer/kusto/query/extendoperator) operator. Set the **Resource ID column** field to **Don't split** and include all the meaningful dimensions in the list. Make sure the **Include all future values** is selected, so any value returned from the query will be included.

:::image type="content" source="media/monitor-virtual-machines/log-alert-rule-multiple-dimensions.png" alt-text="Screenshot of new log alert rule with split by multiple dimensions.":::

#### Dynamic thresholds
An additional benefit using log alert rules is the ability to include complex logic in the query for determining the threshold value. This threshold could be hardcoded, applied to all resources, or calculated dynamically based on some field or calculated value. This allows the threshold to be applied to only resources according to specific conditions. For example, you might create an alert based on available memory but only for machines with a particular amount of total memory.

## Common alert rules

The following section lists common alert rules for virtual machines in Azure Monitor. Details for metric alerts and log alerts are provided for each. For guidance on which type of alert to use, see [Alert types](#alert-types). If you're unfamiliar with the process for creating alert rules in Azure Monitor, see [instructions to create a new alert rule](../alerts/alerts-create-new-alert-rule.md).

> [!NOTE]
> The details for log alerts provided below are using data collected using [VM Insights](vminsights-overview.md) which provides a set of common performance counters for the client operating system. This name is independent of the operating system type.

### Machine unavailable
One of the most common monitoring requirements for a virtual machine is to create an alert if it stops running. The best method for this is to create a metric alert rule in Azure Monitor using the VM availability metric which is currently in public preview. See [Create availability alert rule for Azure virtual machine](tutorial-monitor-vm-alert-availability.md) for a complete walk-through on this metric.

As described in [Scaling alert rules](#scaling-alert-rules), create an availability alert rule using a subscription or resource group as the target resource to have the rule apply to multiple virtual machines, including new machines that you create after the alter rule.

### Agent heartbeat
The agent heartbeat is slightly different than the machine unavailable alert because it relies on the Azure Monitor agent to send a heartbeat. This can alert you if the machine is running, but the agent is unresponsive.

#### Metric alert rules

A metric called *Heartbeat* is included in each Log Analytics workspace. Each virtual machine connected to that workspace sends a heartbeat metric value each minute. Because the computer is a dimension on the metric, you can fire an alert when any computer fails to send a heartbeat. Set the **Aggregation type** to **Count** and the **Threshold** value to match the **Evaluation granularity**.


#### Log alert rules

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

### Windows and Linux events
The following sample creates an alert when a specific Windows event is created. It uses a metric measurement alert rule to create a separate alert for each computer.

- **Create an alert rule on a specific Windows event.**

   This example shows an event in the Application log. Specify a threshold of 0 and consecutive breaches greater than 0.

    ```kusto
    Event 
    | where EventLog == "Application"
    | where EventID == 123 
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

- **Create an alert rule on Syslog events with a particular severity.**

   The following example shows error authorization events. Specify a threshold of 0 and consecutive breaches greater than 0.

    ```kusto
    Syslog
    | where Facility == "auth"
    | where SeverityLevel == "err"
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

### Custom performance counters

- **Create an alert on the maximum value of a counter.**
    
    ```kusto
    Perf 
    | where CounterName == "My Counter" 
    | summarize AggregatedValue = max(CounterValue) by Computer
    ```

- **Create an alert on the average value of a counter.**

    ```kusto
    Perf 
    | where CounterName == "My Counter" 
    | summarize AggregatedValue = avg(CounterValue) by Computer
    ```


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
