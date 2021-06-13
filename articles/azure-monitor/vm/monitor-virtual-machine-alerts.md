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

## CPU Alerts

| Description | Metric |
|:---|:---|
| CPU utilization | Percentage CPU |

| Description | Query |
|:---|:---|
| CPU utilization | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Processor" and Name == "UtilizationPercentage"<br> \| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId`  |
| CPU utilization for all compute resources in a subscription | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" and (_ResourceId contains "/providers/Microsoft.Compute/virtualMachines/" or _ResourceId contains "/providers/Microsoft.Compute/virtualMachineScaleSets/") \| where Namespace == "Processor" and Name == "UtilizationPercentage"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId |
| CPU utilization for all compute resources in a resource group | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/" or _ResourceId startswith "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachineScaleSets/"<br>\| where Namespace == "Processor" and Name == "UtilizationPercentage"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), _ResourceId |

### Memory

| Description | Query |
|:---|:---|
| Available Memory in MB | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Memory" and Name == "AvailableMB"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId | 
| Available Memory in percentage | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Memory" and Name == "AvailableMB"<br>\| extend TotalMemory = toreal(todynamic(Tags)["vm.azm.ms/memorySizeMB"])<br>\| extend AvailableMemoryPercentage = (toreal(Val) / TotalMemory) * 100.0<br>\| summarize AggregatedValue = avg(AvailableMemoryPercentage) by bin(TimeGenerated, 15m), Computer, _ResourceId  |
| 

### Disk

| Description | Query |
|:---|:---|
| Logical disk used - all disks on each computer | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId  |
| Logical disk used - individual disks | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "LogicalDisk" and Name == "FreeSpacePercentage"<br>\| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, Disk |
| Logical disk IOPS | InsightsMetrics<br>\| where Origin == "vm.azm.ms" <br>\| where Namespace == "LogicalDisk" and Name == "TransfersPerSecond"<br>\| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) ), Computer, _ResourceId, Disk |
| Logical disk data rate | InsightsMetrics<br>\| where Origin == "vm.azm.ms" <br>\| where Namespace == "LogicalDisk" and Name == "BytesPerSecond"<br>\| extend Disk=tostring(todynamic(Tags)["vm.azm.ms/mountId"])<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m) , Computer, _ResourceId, Disk |


### Network

| Description | Query |
|:--|:---|
| Network interfaces bytes received - all interfaces | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Network" and Name == "ReadBytesPerSecond"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId  |
| Network interfaces bytes received - individual interfaces | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Network" and Name == "ReadBytesPerSecond"<br>\| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface |
| Network interfaces bytes sent - all interfaces | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Network" and Name == "WriteBytesPerSecond"<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId |
| Network interfaces bytes sent - individual interfaces | InsightsMetrics<br>\| where Origin == "vm.azm.ms"<br>\| where Namespace == "Network" and Name == "WriteBytesPerSecond"<br>\| extend NetworkInterface=tostring(todynamic(Tags)["vm.azm.ms/networkDeviceId"])<br>\| summarize AggregatedValue = avg(Val) by bin(TimeGenerated, 15m), Computer, _ResourceId, NetworkInterface |

## Log query alerts

There are two types of log query alert rule in Azure Monitor:

- [Metric measurement alerts](../alerts/alerts-unified-log.md#calculation-of-measure-based-on-a-numeric-column-such-as-cpu-counter-value) create a separate alert for each record in a query that has a value that exceeds a threshold defined in the alert rule. 
- [Number of results alerts](../alerts/alerts-unified-log.md#count-of-the-results-table-rows) create a single alert when a query returns at least a specified number of records. These are ideal for non-numeric data such and Windows and Syslog events collected by the [Log Analytics agent](../agents/log-analytics-agent.md) or for analyzing performance trends across multiple computers.

## Comparison example
For this comparison, we'll create an alert rule that uses performance data from VM insights to alert when the CPU of a virtual machine exceeds 80%. The data we need is in the [InsightsMetrics table](/azure/azure-monitor/reference/tables/insightsmetrics). Following is a simple query that returns the records that need to be evaluated for the alert. Each type of alert rule will use a variant of this query.

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
```

## Number of results rule
The **number of results** rule will create a single alert when a query returns at least a specified number of records. These are ideal for non-numeric data such and Windows and Syslog events collected by the Log Analytics agent or for analyzing performance trends across multiple computers. You may also choose this strategy if you want to minimize your number of alerts or possibly create an alert only when multiple machines have the same error condition. The log query in this type of alert rule will typically identify the alerting condition, while the threshold for the alert rule determines if a sufficient number of records are returned.


### Query
In this example, the threshold for the CPU utilization will be in the query. The number of records returned from the query will be the number of machines exceeding that threshold. The threshold for the alert rule will be the minimum number of machines required to fire the alert. If you want an alert when a single machine is in error, then the threshold for the alert rule will be zero.

The query needs to determine a value for each machine and return only those that exceed the threshold. When the alert rule runs the query, it will use records over a specific time period, the previous 5 minutes or previous hour for example. The logic of the query determines which value for each machine that should be used. Following are common examples that you may use:

**Use the last sampled value.**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize LastUtilization = arg_max(TimeGenerated,Val) by Computer
| where LastUtilization > 80
```


**Use the average value over time period.**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize AverageUtilization = avg(Val) by Computer
| where AverageUtilization > 80
```

**Use the maximum value over the time period.**

```kusto
InsightsMetrics
| where Origin == "vm.azm.ms" 
| where Namespace == "Processor" and Name == "UtilizationPercentage" 
| summarize MaximumUtilization = max(Val) by Computer
| where MaximumUtilization > 80
```

### Create the alert rule
Select **Logs** from the Azure Monitor menu to Open Log Analytics. Make sure that the correct workspace is selected for your scope. If not, click **Select scope** in the top left and select the correct workspace. Paste in the query that has the logic you want and click **Run** to verify that it returns the correct results.

![]()

Click **New alert rule** to create a rule with the current query. The rule will use your workspace for the **Resource**.

Click the **Condition** to view the configuration. The query is already filled in with a graphical view of the number of records that would have been returned from that query over the past several minutes. 

Scroll down to **Alert logic** and select **Number of results** for the **Based on** property. For this example, we want an alert if any records are returned, which means that at least one virtual machine has a processor above 80%. Select *Greater than* for the **Operator** and *0* for the **Threshold value**.

Scroll down to **Evaluated based on**. **Period** specifies the time span for the query. Specify a value of **15** minutes, which means that the query will only use data collected in the last 15 minutes. **Frequency** specifies how often the query is run. A lower value will make the alert rule more responsive but also have a higher cost. Specify **15** to run the query every minutes.

![]()

### Resulting alert




## Metric measurement rule
The **metric measurement** rule will create a separate alert for each record in a query that has a value that exceeds a threshold defined in the alert rule. These alert rules are ideal for virtual machine performance data since they create individual alerts for each computer. The log query in this type of alert rule needs to return a value for each machine. The threshold in the alert rule will determine if the value should fire an alert.

### Query
The query for metric measurement rules must include a numeric property called *AggregatedValue*. This is the value that's compared to the threshold in the alert rule. 




### Create the alert rule
Select **Logs** from the Azure Monitor menu to Open Log Analytics. Make sure that the correct workspace is selected for your scope. If not, click **Select scope** in the top left and select the correct workspace. Paste in the query that has the logic you want and click **Run** to verify that it returns the correct results.

![]()

Click **New alert rule** to create a rule with the current query. The rule will use your workspace for the **Resource**.

Click the **Condition** to view the configuration. The query is already filled in with a graphical view of the value returned from the query for each computer. You can select the computer in the **Pivoted on** dropdown.

Scroll down to **Alert logic** and select **Metric measurement** for the **Based on** property. Since we want to alert when the utilization exceeds 80%, set the **Aggregate value** to *Greater than* and the **Threshold value** to *80*.

Scroll down to **Alert logic** and select **Metric measurement** for the **Based on** property. Provide a **Threshold** value to compare to the value returned from the query. In this example, we'll use *80*. In **Trigger Alert Based On**, specify how many times the threshold must be exceeded before an alert is created. For example, you may not care if the processor exceeds a threshold once and then returns to normal, but you do care if it continues to exceed the threshold over multiple consecutive measurements. For this example, we'll set **Consecutive breaches** to *3*.

Scroll down to **Evaluated based on**. **Period** specifies the time span for the query. Specify a value of **15** minutes, which means that the query will only use data collected in the last 15 minutes. **Frequency** specifies how often the query is run. A lower value will make the alert rule more responsive but also have a higher cost. Specify **15** to run the query every minutes.




## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)