---
title: Log alerts from Container insights | Microsoft Docs
description: This article describes how to create custom log alerts for memory and CPU utilization from Container insights.
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec

---

# Create log alerts from Container insights

Container insights monitors the performance of container workloads that are deployed to managed or self-managed Kubernetes clusters. To alert on what matters, this article describes how to create log-based alerts for the following situations with Azure Kubernetes Service (AKS) clusters:

- When CPU or memory utilization on cluster nodes exceeds a threshold
- When CPU or memory utilization on any container within a controller exceeds a threshold as compared to a limit that's set on the corresponding resource
- `NotReady` status node counts
- `Failed`, `Pending`, `Unknown`, `Running`, or `Succeeded` pod-phase counts
- When free disk space on cluster nodes exceeds a threshold

To alert for high CPU or memory utilization, or low free disk space on cluster nodes, use the queries that are provided to create a metric alert or a metric measurement alert. Metric alerts have lower latency than log alerts, but log alerts provide advanced querying and greater sophistication. Log alert queries compare a datetime to the present by using the `now` operator and going back one hour. (Container insights stores all dates in Coordinated Universal Time [UTC] format.)

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Before you create alert rules, see the "Alert rules" section in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

If you aren't familiar with Azure Monitor alerts, see [Overview of alerts in Microsoft Azure](../alerts/alerts-overview.md) before you start. To learn more about alerts that use log queries, see [Log alerts in Azure Monitor](../alerts/alerts-unified-log.md). For more about metric alerts, see [Metric alerts in Azure Monitor](../alerts/alerts-metric-overview.md).

## Log query measurements
[Log alerts](../alerts/alerts-unified-log.md) can measure two different things, which can be used to monitor virtual machines in different scenarios:

- [Result count](../alerts/alerts-unified-log.md#result-count): Counts the number of rows returned by the query and can be used to work with events such as Windows event logs, Syslog, and application exceptions.
- [Calculation of a value](../alerts/alerts-unified-log.md#calculation-of-a-value): Makes a calculation based on a numeric column and can be used to include any number of resources. An example is CPU percentage.

### Target resources and dimensions

You can use one rule to monitor the values of multiple instances by using dimensions. For example, you would use dimensions if you wanted to monitor the CPU usage on multiple instances running your website or app, and create an alert for CPU usage of over 80%.

To create resource-centric alerts at scale for a subscription or resource group, you can *split by dimensions*. When you want to monitor the same condition on multiple Azure resources, splitting by dimensions splits the alerts into separate alerts by grouping unique combinations by using numerical or string columns. Splitting an Azure resource ID column makes the specified resource into the alert target.

You might also decide not to split when you want a condition on multiple resources in the scope. For example, you might want to create an alert if at least five machines in the resource group scope have CPU usage over 80%.

:::image type="content" source="../vm/media/monitor-virtual-machines/log-alert-rule.png" alt-text="Screenshot that shows a new log alert rule with split by dimensions." lightbox="../vm/media/monitor-virtual-machines/log-alert-rule.png":::

You might want to see a list of the alerts by affected computer. You can use a custom workbook that uses a custom [resource graph](../../governance/resource-graph/overview.md) to provide this view. Use the following query to display alerts, and use the data source **Azure Resource Graph** in the workbook.

## Create a log query alert rule
To create a log query alert rule by using the portal, see [this example of a log query alert](../alerts/tutorial-log-alert.md), which provides a complete walkthrough. You can use these same processes to create alert rules for AKS clusters by using queries similar to the ones in this article.

To create a query alert rule by using an Azure Resource Manager (ARM) template, see [Resource Manager template samples for log alert rules in Azure Monitor](../alerts/resource-manager-alerts-log.md). You can use these same processes to create ARM templates for the log queries in this article.

## Resource utilization

Average CPU utilization as an average of member nodes' CPU utilization every minute (metric measurement):

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'cpuCapacityNanoCores';
let usageCounterName = 'cpuUsageNanoCores';
KubeNodeInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
// cluster filter would go here if multiple clusters are reporting to the same Log Analytics workspace
| distinct ClusterName, Computer
| join hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime
  | where TimeGenerated >= startDateTime
  | where ObjectName == 'K8SNode'
  | where CounterName == capacityCounterName
  | summarize LimitValue = max(CounterValue) by Computer, CounterName, bin(TimeGenerated, trendBinSize)
  | project Computer, CapacityStartTime = TimeGenerated, CapacityEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer
| join kind=inner hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime + trendBinSize
  | where TimeGenerated >= startDateTime - trendBinSize
  | where ObjectName == 'K8SNode'
  | where CounterName == usageCounterName
  | project Computer, UsageValue = CounterValue, TimeGenerated
) on Computer
| where TimeGenerated >= CapacityStartTime and TimeGenerated < CapacityEndTime
| project ClusterName, Computer, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize), ClusterName
```

Average memory utilization as an average of member nodes' memory utilization every minute (metric measurement):

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'memoryCapacityBytes';
let usageCounterName = 'memoryRssBytes';
KubeNodeInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
// cluster filter would go here if multiple clusters are reporting to the same Log Analytics workspace
| distinct ClusterName, Computer
| join hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime
  | where TimeGenerated >= startDateTime
  | where ObjectName == 'K8SNode'
  | where CounterName == capacityCounterName
  | summarize LimitValue = max(CounterValue) by Computer, CounterName, bin(TimeGenerated, trendBinSize)
  | project Computer, CapacityStartTime = TimeGenerated, CapacityEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer
| join kind=inner hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime + trendBinSize
  | where TimeGenerated >= startDateTime - trendBinSize
  | where ObjectName == 'K8SNode'
  | where CounterName == usageCounterName
  | project Computer, UsageValue = CounterValue, TimeGenerated
) on Computer
| where TimeGenerated >= CapacityStartTime and TimeGenerated < CapacityEndTime
| project ClusterName, Computer, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize), ClusterName
```

>[!IMPORTANT]
>The following queries use the placeholder values \<your-cluster-name> and \<your-controller-name> to represent your cluster and controller. Replace them with values specific to your environment when you set up alerts.

Average CPU utilization of all containers in a controller as an average of CPU utilization of every container instance in a controller every minute (metric measurement):

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'cpuLimitNanoCores';
let usageCounterName = 'cpuUsageNanoCores';
let clusterName = '<your-cluster-name>';
let controllerName = '<your-controller-name>';
KubePodInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| where ClusterName == clusterName
| where ControllerName == controllerName
| extend InstanceName = strcat(ClusterId, '/', ContainerName),
         ContainerName = strcat(controllerName, '/', tostring(split(ContainerName, '/')[1]))
| distinct Computer, InstanceName, ContainerName
| join hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | where ObjectName == 'K8SContainer'
    | where CounterName == capacityCounterName
    | summarize LimitValue = max(CounterValue) by Computer, InstanceName, bin(TimeGenerated, trendBinSize)
    | project Computer, InstanceName, LimitStartTime = TimeGenerated, LimitEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer, InstanceName
| join kind=inner hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime + trendBinSize
    | where TimeGenerated >= startDateTime - trendBinSize
    | where ObjectName == 'K8SContainer'
    | where CounterName == usageCounterName
    | project Computer, InstanceName, UsageValue = CounterValue, TimeGenerated
) on Computer, InstanceName
| where TimeGenerated >= LimitStartTime and TimeGenerated < LimitEndTime
| project Computer, ContainerName, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize) , ContainerName
```

Average memory utilization of all containers in a controller as an average of memory utilization of every container instance in a controller every minute (metric measurement):

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'memoryLimitBytes';
let usageCounterName = 'memoryRssBytes';
let clusterName = '<your-cluster-name>';
let controllerName = '<your-controller-name>';
KubePodInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| where ClusterName == clusterName
| where ControllerName == controllerName
| extend InstanceName = strcat(ClusterId, '/', ContainerName),
         ContainerName = strcat(controllerName, '/', tostring(split(ContainerName, '/')[1]))
| distinct Computer, InstanceName, ContainerName
| join hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | where ObjectName == 'K8SContainer'
    | where CounterName == capacityCounterName
    | summarize LimitValue = max(CounterValue) by Computer, InstanceName, bin(TimeGenerated, trendBinSize)
    | project Computer, InstanceName, LimitStartTime = TimeGenerated, LimitEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer, InstanceName
| join kind=inner hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime + trendBinSize
    | where TimeGenerated >= startDateTime - trendBinSize
    | where ObjectName == 'K8SContainer'
    | where CounterName == usageCounterName
    | project Computer, InstanceName, UsageValue = CounterValue, TimeGenerated
) on Computer, InstanceName
| where TimeGenerated >= LimitStartTime and TimeGenerated < LimitEndTime
| project Computer, ContainerName, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize) , ContainerName
```

## Resource availability

Nodes and counts that have a status of Ready and NotReady (metric measurement):

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let clusterName = '<your-cluster-name>';
KubeNodeInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| distinct ClusterName, Computer, TimeGenerated
| summarize ClusterSnapshotCount = count() by bin(TimeGenerated, trendBinSize), ClusterName, Computer
| join hint.strategy=broadcast kind=inner (
    KubeNodeInventory
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | summarize TotalCount = count(), ReadyCount = sumif(1, Status contains ('Ready'))
                by ClusterName, Computer,  bin(TimeGenerated, trendBinSize)
    | extend NotReadyCount = TotalCount - ReadyCount
) on ClusterName, Computer, TimeGenerated
| project   TimeGenerated,
            ClusterName,
            Computer,
            ReadyCount = todouble(ReadyCount) / ClusterSnapshotCount,
            NotReadyCount = todouble(NotReadyCount) / ClusterSnapshotCount
| order by ClusterName asc, Computer asc, TimeGenerated desc
```

The following query returns pod phase counts based on all phases: `Failed`, `Pending`, `Unknown`, `Running`, or `Succeeded`.

```kusto
let endDateTime = now(); 
let startDateTime = ago(1h);
let trendBinSize = 1m;
let clusterName = '<your-cluster-name>';
KubePodInventory
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | where ClusterName == clusterName
    | distinct ClusterName, TimeGenerated
    | summarize ClusterSnapshotCount = count() by bin(TimeGenerated, trendBinSize), ClusterName
    | join hint.strategy=broadcast (
        KubePodInventory
        | where TimeGenerated < endDateTime
        | where TimeGenerated >= startDateTime
        | summarize PodStatus=any(PodStatus) by TimeGenerated, PodUid, ClusterName
        | summarize TotalCount = count(),
                    PendingCount = sumif(1, PodStatus =~ 'Pending'),
                    RunningCount = sumif(1, PodStatus =~ 'Running'),
                    SucceededCount = sumif(1, PodStatus =~ 'Succeeded'),
                    FailedCount = sumif(1, PodStatus =~ 'Failed')
                by ClusterName, bin(TimeGenerated, trendBinSize)
    ) on ClusterName, TimeGenerated
    | extend UnknownCount = TotalCount - PendingCount - RunningCount - SucceededCount - FailedCount
    | project TimeGenerated,
              TotalCount = todouble(TotalCount) / ClusterSnapshotCount,
              PendingCount = todouble(PendingCount) / ClusterSnapshotCount,
              RunningCount = todouble(RunningCount) / ClusterSnapshotCount,
              SucceededCount = todouble(SucceededCount) / ClusterSnapshotCount,
              FailedCount = todouble(FailedCount) / ClusterSnapshotCount,
              UnknownCount = todouble(UnknownCount) / ClusterSnapshotCount
| summarize AggregatedValue = avg(PendingCount) by bin(TimeGenerated, trendBinSize)
```

>[!NOTE]
>To alert on certain pod phases, such as `Pending`, `Failed`, or `Unknown`, modify the last line of the query. For example, to alert on `FailedCount`, use `| summarize AggregatedValue = avg(FailedCount) by bin(TimeGenerated, trendBinSize)`.

The following query returns cluster nodes disks that exceed 90% free space used. To get the cluster ID, first run the following query and copy the value from the `ClusterId` property:

```kusto
InsightsMetrics
| extend Tags = todynamic(Tags)            
| project ClusterId = Tags['container.azm.ms/clusterId']   
| distinct tostring(ClusterId)   
``` 

```kusto
let clusterId = '<cluster-id>';
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
InsightsMetrics
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| where Origin == 'container.azm.ms/telegraf'            
| where Namespace == 'container.azm.ms/disk'            
| extend Tags = todynamic(Tags)            
| project TimeGenerated, ClusterId = Tags['container.azm.ms/clusterId'], Computer = tostring(Tags.hostName), Device = tostring(Tags.device), Path = tostring(Tags.path), DiskMetricName = Name, DiskMetricValue = Val   
| where ClusterId =~ clusterId       
| where DiskMetricName == 'used_percent'
| summarize AggregatedValue = max(DiskMetricValue) by bin(TimeGenerated, trendBinSize)
| where AggregatedValue >= 90
```

Individual container restarts (number of results) alert when the individual system container restart count exceeds a threshold for the last 10 minutes:

```kusto
let _threshold = 10m; 
let _alertThreshold = 2;
let Timenow = (datetime(now) - _threshold); 
let starttime = ago(5m); 
KubePodInventory
| where TimeGenerated >= starttime
| where Namespace in ('default', 'kube-system') // the namespace filter goes here
| where ContainerRestartCount > _alertThreshold
| extend Tags = todynamic(ContainerLastStatus)
| extend startedAt = todynamic(Tags.startedAt)
| where startedAt >= Timenow
| summarize arg_max(TimeGenerated, *) by Name
```

## Next steps

- View [log query examples](container-insights-log-query.md) to see predefined queries and examples to evaluate or customize for alerting, visualizing, or analyzing your clusters.
- To learn more about Azure Monitor and how to monitor other aspects of your Kubernetes cluster, see [View Kubernetes cluster performance](container-insights-analyze.md) and [View Kubernetes cluster health](./container-insights-overview.md).