---
title: Optimizing log alert queries | Microsoft Docs
description:  Recommendations for writing efficient alert queries
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 09/22/2020
---
# Compare log query alert types
[Log query alerts](alerts-log-query.md) in Azure Monitor can use two different types of logic, **Number of results** and **Metric measurement**. This article compares the two, gives  guidance on when you would use each one, and provides a walk through of creating each.

## Log query alert types

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
- Learn about [log alerts](alerts-log.md) in Azure Monitor.
- Learn about [log queries](../logs/log-query-overview.md).