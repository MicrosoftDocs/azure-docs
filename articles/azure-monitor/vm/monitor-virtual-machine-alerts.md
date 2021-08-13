---
title: 'Monitor virtual machines with Azure Monitor: Alerts'
description: Learn how to create alerts from virtual machines and their guest workloads by using Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor: Alerts

This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It provides guidance on creating alert rules for your virtual machines and their guest operating systems. [Alerts in Azure Monitor](../alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. There are no preconfigured alert rules for virtual machines, but you can create your own based on data collected by VM insights. 

> [!NOTE]
> The alerts described in this article don't include alerts created by [Azure Monitor for VM guest health](vminsights-health-overview.md), which is a feature currently in public preview. As this feature nears general availability, guidance for alerting will be consolidated.

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Before you create any alert rules, refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Choose the alert type
The most common types of alert rules in Azure Monitor are [metric alerts](../alerts/alerts-metric.md) and [log query alerts](../alerts/alerts-log-query.md). 
The type of alert rule that you create for a particular scenario depends on where the data is located that you're alerting on. You might have cases where data for a particular alerting scenario is available in both Metrics and Logs, and you'll need to determine which rule type to use. You might also have flexibility in how you collect certain data and let your decision of alert rule type drive your decision for data collection method.

Typically, the best strategy is to use metric alerts instead of log alerts when possible because they're more responsive and stateful. To use metric alerts, the data you're alerting on must be available in Metrics. VM insights currently sends all of its data to Logs, so you must install the Azure Monitor agent to use metric alerts with data from the guest operating system. Use Log query alerts with metric data when it's unavailable in Metrics or if you require logic beyond the relatively simple logic for a metric alert rule.

### Metric alert rules
[Metric alert rules](../alerts/alerts-metric.md) are useful for alerting when a particular metric exceeds a threshold. An example is when the CPU of a machine is running high. The target of a metric alert rule can be a specific machine, a resource group, or a subscription. In this instance, you can create a single rule that applies to a group of machines.

Metric rules for virtual machines can use the following data:

- Host metrics for Azure virtual machines, which are collected automatically. 
- Metrics that are collected by the Azure Monitor agent from the guest operating system. 

> [!NOTE]
> When VM insights supports the Azure Monitor agent, which is currently in public preview, it sends performance data from the guest operating system to Metrics so that you can use metric alerts.

### Log alerts
[Log alerts](../alerts/alerts-metric.md) can perform two different measurements of the result of a log query, each of which supports distinct scenarios for monitoring virtual machines:

- [Metric measurements](../alerts/alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value): Creates a separate alert for each record in the query results that has a numeric value that exceeds a threshold defined in the alert rule. Metric measurements are ideal for non-numeric data such as Windows and Syslog events collected by the Log Analytics agent or for analyzing performance trends across multiple computers.
- [Number of results](../alerts/alerts-unified-log.md#count-of-the-results-table-rows): Creates a single alert when a query returns at least a specified number of records. Number of results measurements are ideal for non-numeric data such as Windows and Syslog events collected by the [Log Analytics agent](../agents/log-analytics-agent.md) or for analyzing performance trends across multiple computers. You might also choose this strategy if you want to minimize your number of alerts or possibly create an alert only when multiple machines have the same error condition.

### Target resource and impacted resource

> [!NOTE]
> Resource-centric log alert rules, currently in public preview, simplify log query alerts for virtual machines and replace the functionality currently provided by metric measurement queries. You can use the machine as a target for the rule, which better identifies it as the affected resource. You can also apply a single alert rule to all machines in a particular resource group or description. When resource-center log query alerts become generally available, the guidance in this scenario will be updated.
> 
Each alert in Azure Monitor has an **Affected resource** property, which is defined by the target of the rule. For metric alert rules, the affected resource is the computer, which allows you to easily identify it in the standard alert view. Log query alerts are associated with the workspace resource instead of the machine, even when you use a metric measurement alert that creates an alert for each computer. You need to view the details of the alert to view the computer that was affected.

The computer name is stored in the **Impacted resource** property, which you can view in the details of the alert. It's also displayed as a dimension in emails that are sent from the alert.

:::image type="content" source="media/monitor-virtual-machines/alert-metric-measurement.png" alt-text="Screenshot that shows an alert with impacted resource." lightbox="media/monitor-virtual-machines/alert-metric-measurement.png":::

You might want to have a view that lists the alerts with the affected computer. You can use a custom workbook that uses a custom [Resource Graph](../../governance/resource-graph/overview.md) to provide this view. Use the following query to display alerts, and use the data source **Azure Resource Graph** in the workbook.

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

If you're unfamiliar with the process for creating alert rules in Azure Monitor, see the following articles for guidance:

- [Create, view, and manage metric alerts using Azure Monitor](../alerts/alerts-metric.md)
- [Create, view, and manage log alerts using Azure Monitor](../alerts/alerts-log.md)

### Machine unavailable
The most basic requirement is to send an alert when a machine is unavailable. It could be stopped, the guest operating system could be unresponsive, or the agent could be unresponsive. There are various ways to configure this alerting, but the most common is to use the heartbeat sent from the Log Analytics agent. 

#### Log query alert rules
Log query alerts use the [Heartbeat table](/azure/azure-monitor/reference/tables/heartbeat), which should have a heartbeat record every minute from each machine. 

**Separate alerts**

Use a metric measurement rule with the following query.

```kusto
Heartbeat
| summarize TimeGenerated=max(TimeGenerated) by Computer
| extend Duration = datetime_diff('minute',now(),TimeGenerated)
| summarize AggregatedValue = min(Duration) by Computer, bin(TimeGenerated,1) |
```

**Single alert**

Use a number of results alert with the following query.

```kusto
Heartbeat
| summarize LastHeartbeat=max(TimeGenerated) by Computer 
| where LastHeartbeat < ago(5m)
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
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer
```

**CPU utilization for all compute resources in a subscription**

```kusto
 InsightsMetrics
 | where Origin == "vm.azm.ms"
 | where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" and (_ResourceId contains "/providers/Microsoft.Compute/virtualMachines/" or _ResourceId contains "/providers/Microsoft.Compute/virtualMachineScaleSets/") 
 | where Namespace == "Processor" and Name == "UtilizationPercentage"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId
```

**CPU utilization for all compute resources in a resource group** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/" or _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/"
| where Namespace == "Processor" and Name == "UtilizationPercentage"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId 
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
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer
```

**Available memory in percentage** 

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Memory" and Name == "AvailableMB"
| extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"])<br>\| extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0
| summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer  
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
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) ), Computer, _ResourceId, Disk |
| Logical disk data rate | InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "LogicalDisk" and Name == "BytesPerSecond"
| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) , Computer, _ResourceId, Disk |
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
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId  |
```

**Network interfaces bytes received - individual interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "ReadBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface |
```

**Network interfaces bytes sent - all interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId |
```

**Network interfaces bytes sent - individual interfaces**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms"
| where Namespace == "Network" and Name == "WriteBytesPerSecond"
| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface |
```

## Comparison of log query alert measures
To compare the behavior of the two log alert measures, here's a walk-through of each to create an alert when the CPU of a virtual machine exceeds 80 percent. The data you need is in the [InsightsMetrics table](/azure/azure-monitor/reference/tables/insightsmetrics). The following query returns the records that need to be evaluated for the alert. Each type of alert rule uses a variant of this query.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
```

### Metric measurement
The **metric measurement** measure creates a separate alert for each record in a query that has a value that exceeds a threshold defined in the alert rule. These alert rules are ideal for virtual machine performance data because they create individual alerts for each computer. The log query for this measure needs to return a value for each machine. The threshold in the alert rule determines if the value should fire an alert.

> [!NOTE]
> Resource-centric log alert rules, currently in public preview, simplify log query alerts for virtual machines and replace the functionality currently provided by metric measurement queries. You can use the machine as a target for the rule, which better identifies it as the affected resource. You can also apply a single alert rule to all machines in a particular resource group or description. When resource-center log query alerts become generally available, the guidance in this scenario will be updated.

#### Query
The query for rules using metric measurement must include a record for each machine with a numeric property called **AggregatedValue**. This value is compared to the threshold in the alert rule. The query doesn't need to compare this value to a threshold because the threshold is defined in the alert rule.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer
```

#### Alert rule
On the Azure Monitor menu, select **Logs** to open Log Analytics. Make sure that the correct workspace is selected for your scope. If not, click **Select scope** in the upper left and select the correct workspace. Paste in the query that has the logic you want, and select **Run** to verify that it returns the correct results.

:::image type="content" source="media/monitor-virtual-machines/log-alert-metric-query-results.png" alt-text="Screenshot that shows metric measurement alert query results." lightbox="media/monitor-virtual-machines/log-alert-metric-query-results.png":::

Select **New alert rule** to create a rule with the current query. The rule uses your workspace for the **Resource**.

Select **Condition** to view the configuration. The query is already filled in with a graphical view of the value returned from the query for each computer. Select the computer from the **Pivoted on** dropdown list.

Scroll down to **Alert logic**, and select **Metric measurement** for the **Based on** property. Because you want to alert when the utilization exceeds 80 percent, set **Aggregate value** to **Greater than** and **Threshold value** to **80**.

Scroll down to **Alert logic**, and select **Metric measurement** for the **Based on** property. Provide a **Threshold** value to compare to the value returned from the query. In this example, use **80**. In **Trigger Alert Based On**, specify how many times the threshold must be exceeded before an alert is created. For example, you might not care if the processor exceeds a threshold once and then returns to normal, but you do care if it continues to exceed the threshold over multiple consecutive measurements. For this example, set **Consecutive breaches** to **3**.

Scroll down to **Evaluated based on**. **Period** specifies the time span for the query. Specify a value of **15** minutes, which means that the query only uses data collected in the last 15 minutes. **Frequency** specifies how often the query is run. A lower value makes the alert rule more responsive but also has a higher cost. Specify **15** to run the query every 15 minutes.

:::image type="content" source="media/monitor-virtual-machines/log-alert-metric-rule.png" alt-text="Screenshot that shows metric measurement alert query rule." lightbox="media/monitor-virtual-machines/log-alert-metric-rule.png":::

### Number of results rule
The **number of results** rule creates a single alert when a query returns at least a specified number of records. The log query in this type of alert rule typically identifies the alerting condition, while the threshold for the alert rule determines if a sufficient number of records are returned.

#### Query
In this example, the threshold for the CPU utilization is included in the query. The number of records returned from the query is the number of machines exceeding that threshold. The threshold for the alert rule is the minimum number of machines required to fire the alert. If you want an alert when a single machine is in error, the threshold for the alert rule is zero.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize AverageUtilization = avg(Val) by Computer
| where AverageUtilization > 80
```

#### Alert rule
On the Azure Monitor menu, select **Logs** to open Log Analytics. Make sure that the correct workspace is selected for your scope. If not, click **Select scope** in the upper left and select the correct workspace. Paste in the query that has the logic you want, and select **Run** to verify that it returns the correct results. You probably don't have a machine currently over threshold, so change to a lower threshold temporarily to verify results. Then set the appropriate threshold before you create the alert rule.

:::image type="content" source="media/monitor-virtual-machines/log-alert-number-query-results.png" alt-text="Screenshot that shows the number of results alert query results." lightbox="media/monitor-virtual-machines/log-alert-number-query-results.png":::

Select **New alert rule** to create a rule with the current query. The rule uses your workspace for the **Resource**.

Select the **Condition** to view the configuration. The query is already filled in with a graphical view of the number of records that have been returned from that query over the past several minutes. 

Scroll down to **Alert logic**, and select **Number of results** for the **Based on** property. For this example, you want an alert if any records are returned, which means that at least one virtual machine has a processor above 80 percent. Select **Greater than** for the **Operator** and **0** for the **Threshold value**.

Scroll down to **Evaluated based on**. **Period** specifies the time span for the query. Specify a value of **15** minutes, which means that the query only uses data collected in the last 15 minutes. **Frequency** specifies how often the query is run. A lower value makes the alert rule more responsive but also has a higher cost. Specify **15** to run the query every 15 minutes.

:::image type="content" source="media/monitor-virtual-machines/log-alert-number-rule.png" alt-text="Screenshot that shows the number of results alert query rule." lightbox="media/monitor-virtual-machines/log-alert-number-rule.png":::

## Next steps

* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)
* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
