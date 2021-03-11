---
title: How to Query Logs from Container insights | Microsoft Docs
description: Container insights collects metrics and log data and this article describes the records and includes sample queries.
ms.topic: conceptual
ms.date: 03/03/2021

---

# How to query logs from Container insights

Container insights collects performance metrics, inventory data, and health state information from container hosts and containers. The data is collected every three minutes and forwarded to the Log Analytics workspace in Azure Monitor. This data is available for [query](../logs/log-query-overview.md) in Azure Monitor. You can apply this data to scenarios that include migration planning, capacity analysis, discovery, and on-demand performance troubleshooting.

## Container records

In the following table, details of records collected by Container insights are provided. For a listing of the column descriptions, see the reference for the [ContainerInventory](/azure/azure-monitor/reference/tables/containerinventory) and [ContainerLog](/azure/azure-monitor/reference/tables/containerlog) tables.

| Data | Data source | Data type | Fields |
|------|-------------|-----------|--------|
| Container inventory | Kubelet | `ContainerInventory` | TimeGenerated, Computer, Name, ContainerHostname, Image, ImageTag, ContainerState, ExitCode, EnvironmentVar, Command, CreatedTime, StartedTime, FinishedTime, SourceSystem, ContainerID, ImageID |
| Container log | Docker | `ContainerLog` | TimeGenerated, Computer, image ID, Name, LogEntrySource, LogEntry, SourceSystem, ContainerID |
| Container node inventory | Kube API | `ContainerNodeInventory`| TimeGenerated, Computer, ClassName_s, DockerVersion_s, OperatingSystem_s, Volume_s, Network_s, NodeRole_s, OrchestratorType_s, InstanceID_g, SourceSystem|
| Inventory of pods in a Kubernetes cluster | Kube API | `KubePodInventory` | TimeGenerated, Computer, ClusterId, ContainerCreationTimeStamp, PodUid, PodCreationTimeStamp, ContainerRestartCount, PodRestartCount, PodStartTime, ContainerStartTime, ServiceName, ControllerKind, ControllerName, ContainerStatus,  ContainerStatusReason, ContainerID, ContainerName, Name, PodLabel, Namespace, PodStatus, ClusterName, PodIp, SourceSystem |
| Inventory of nodes part of a Kubernetes cluster | Kube API | `KubeNodeInventory` | TimeGenerated, Computer, ClusterName, ClusterId, LastTransitionTimeReady, Labels, Status, KubeletVersion, KubeProxyVersion, CreationTimeStamp, SourceSystem | 
|Inventory of persistent volumes in a Kubernetes cluster |Kube API |`KubePVInventory` |	TimeGenerated, PVName, PVCapacityBytes, PVCName, PVCNamespace, PVStatus, PVAccessModes, PVType, PVTypeInfo, PVStorageClassName, PVCreationTimestamp, ClusterId, ClusterName, _ResourceId, SourceSystem |
| Kubernetes Events | Kube API | `KubeEvents` | TimeGenerated, Computer, ClusterId_s, FirstSeen_t, LastSeen_t, Count_d, ObjectKind_s, Namespace_s, Name_s, Reason_s, Type_s, TimeGenerated_s, SourceComponent_s, ClusterName_s, Message,  SourceSystem | 
| Services in the Kubernetes cluster | Kube API | `KubeServices` | TimeGenerated, ServiceName_s, Namespace_s, SelectorLabels_s, ClusterId_s, ClusterName_s, ClusterIP_s, ServiceType_s, SourceSystem | 
| Performance metrics for nodes part of the Kubernetes cluster | Usage metrics are obtained from cAdvisor and limits from Kube api | `Perf \| where ObjectName == "K8SNode"` | Computer, ObjectName, CounterName &#40;cpuAllocatableNanoCores, memoryAllocatableBytes, cpuCapacityNanoCores, memoryCapacityBytes, memoryRssBytes, cpuUsageNanoCores, memoryWorkingsetBytes, restartTimeEpoch&#41;, CounterValue, TimeGenerated, CounterPath, SourceSystem | 
| Performance metrics for containers part of the Kubernetes cluster | Usage metrics are obtained from cAdvisor and limits from Kube api | `Perf \| where ObjectName == "K8SContainer"` | CounterName &#40;cpuRequestNanoCores, memoryRequestBytes, cpuLimitNanoCores, memoryWorkingSetBytes, restartTimeEpoch, cpuUsageNanoCores, memoryRssBytes&#41;, CounterValue, TimeGenerated, CounterPath, SourceSystem | 
| Custom Metrics ||`InsightsMetrics` | Computer, Name, Namespace, Origin, SourceSystem, Tags<sup>1</sup>, TimeGenerated, Type, Va, _ResourceId | 

<sup>1</sup> The *Tags* property represents [multiple dimensions](../essentials/data-platform-metrics.md#multi-dimensional-metrics) for the corresponding metric. For more information about the metrics collected and stored in the `InsightsMetrics` table and a description of the record properties, see [InsightsMetrics overview](https://github.com/microsoft/OMS-docker/blob/vishwa/june19agentrel/docs/InsightsMetrics.md).

## Search logs to analyze data

Azure Monitor Logs can help you look for trends, diagnose bottlenecks, forecast, or correlate data that can help you determine whether the current cluster configuration is performing optimally. Pre-defined log searches are provided for you to immediately start using or to customize to return the information the way you want.

You can interactively analyze data in the workspace by selecting the **View Kubernetes event logs** or **View container logs** option in the preview pane from the **View in analytics** drop-down list. The **Log Search** page appears to the right of the Azure portal page that you were on.

![Analyze data in Log Analytics](./media/container-insights-analyze/container-health-log-search-example.png)

The container logs output that's forwarded to your workspace are STDOUT and STDERR. Because Azure Monitor is monitoring Azure-managed Kubernetes (AKS), Kube-system isn't collected today because of the large volume of generated data. 

### Example log search queries

It's often useful to build queries that start with an example or two and then modify them to fit your requirements. To help build more advanced queries, you can experiment with the following sample queries:

### List all of a container's lifecycle information

```kusto
ContainerInventory
| project Computer, Name, Image, ImageTag, ContainerState, CreatedTime, StartedTime, FinishedTime
| render table
```

### Kubernetes events

``` kusto
KubeEvents_CL
| where not(isempty(Namespace_s))
| sort by TimeGenerated desc
| render table
```
### Image inventory

``` kusto
ContainerImageInventory
| summarize AggregatedValue = count() by Image, ImageTag, Running
```

### Container CPU

**Select the Line chart display option**

``` kusto
Perf
| where ObjectName == "K8SContainer" and CounterName == "cpuUsageNanoCores" 
| summarize AvgCPUUsageNanoCores = avg(CounterValue) by bin(TimeGenerated, 30m), InstanceName 
```

### Container memory

**Select the Line chart display option**

```kusto
Perf
| where ObjectName == "K8SContainer" and CounterName == "memoryRssBytes"
| summarize AvgUsedRssMemoryBytes = avg(CounterValue) by bin(TimeGenerated, 30m), InstanceName
```

### Requests Per Minute with Custom Metrics

```kusto
InsightsMetrics
| where Name == "requests_count"
| summarize Val=any(Val) by TimeGenerated=bin(TimeGenerated, 1m)
| sort by TimeGenerated asc<br> &#124; project RequestsPerMinute = Val - prev(Val), TimeGenerated
| render barchart 
```

## Query Prometheus metrics data

The following example is a Prometheus metrics query showing disk reads per second per disk per node.

```
InsightsMetrics
| where Namespace == 'container.azm.ms/diskio'
| where TimeGenerated > ago(1h)
| where Name == 'reads'
| extend Tags = todynamic(Tags)
| extend HostName = tostring(Tags.hostName), Device = Tags.name
| extend NodeDisk = strcat(Device, "/", HostName)
| order by NodeDisk asc, TimeGenerated asc
| serialize
| extend PrevVal = iif(prev(NodeDisk) != NodeDisk, 0.0, prev(Val)), PrevTimeGenerated = iif(prev(NodeDisk) != NodeDisk, datetime(null), prev(TimeGenerated))
| where isnotnull(PrevTimeGenerated) and PrevTimeGenerated != TimeGenerated
| extend Rate = iif(PrevVal > Val, Val / (datetime_diff('Second', TimeGenerated, PrevTimeGenerated) * 1), iif(PrevVal == Val, 0.0, (Val - PrevVal) / (datetime_diff('Second', TimeGenerated, PrevTimeGenerated) * 1)))
| where isnotnull(Rate)
| project TimeGenerated, NodeDisk, Rate
| render timechart

```

To view Prometheus metrics scraped by Azure Monitor filtered by Namespace, specify "prometheus". Here's a sample query to view Prometheus metrics from the `default` kubernetes namespace.

```
InsightsMetrics 
| where Namespace == "prometheus"
| extend tags=parse_json(Tags)
| summarize count() by Name
```

Prometheus data can also be directly queried by name.

```
InsightsMetrics 
| where Namespace == "prometheus"
| where Name contains "some_prometheus_metric"
```

### Query config or scraping errors

To investigate any configuration or scraping errors, the following example query returns informational events from the `KubeMonAgentEvents` table.

```
KubeMonAgentEvents | where Level != "Info" 
```

The output shows results similar to the following example:

![Log query results of informational events from agent](./media/container-insights-log-search/log-query-example-kubeagent-events.png)

## Next steps

Container insights does not include a predefined set of alerts. Review the [Create performance alerts with Container insights](./container-insights-log-alerts.md) to learn how to create recommended alerts for high CPU and memory utilization to support your DevOps or operational processes and procedures.