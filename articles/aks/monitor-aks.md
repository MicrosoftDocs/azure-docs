---
title: Monitoring Azure Kubernetes Service (AKS)
description: Describes how to use Azure Monitor monitor the health and performance of your Azure Kubernetes Service (AKS) cluster.
ms.service: container-service
ms.topic: article
ms.custom: subject-monitoring
ms.date: 06/21/2021
---

# Monitoring Azure Kubernetes Service (AKS)
This article describes how to monitor an AKS cluster using [Azure Monitor](/azure/azure-monitor/overview). If you are unfamiliar with the features of Azure Monitor common to all Azure services that use it, read [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).

When you have critical applications and business processes relying on Azure resources, you want to monitor those resources for their availability, performance, and operation.



## *AKS* insights

Some services in Azure have a special focused pre-built monitoring dashboard in the Azure portal that provides a starting point for monitoring your service. These special dashboards are called "insights".

The AKS insights dashboard provides quick access to metrics about the cluster, nodes, controllers, and containers.

## Monitoring data

AKS collects the same kinds of monitoring data as other Azure resources that are described in [Monitoring data from Azure resources](/azure/azure-monitor/insights/monitor-azure-resource#monitoring-data-from-Azure-resources). AKS provides a set of metrics for the control plane, including the API Server and cluster autoscaler, and cluster nodes. These metrics allow you to monitor the health of your cluster and troubleshoot issues. You can view the metrics for your cluster using the Azure portal.

> [!NOTE]
> These AKS cluster metrics overlap with a subset of the [metrics provided by Kubernetes](https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/).

See [Monitoring *AKS* data reference](monitor-aks-reference.md) for detailed information on the metrics and logs metrics created by AKS.

AKS also provides additional resource logging data, such as [control plane component logs](view-control-plane-logs.md), [kubelet logs](kubelet-logs.md), and [real-time container data](/azure/azure-monitor/containers/container-insights-livedata-overview.md).

## Collection and routing

Platform metrics and the Activity log are collected and stored automatically, but can be routed to other locations by using a diagnostic setting.  

Resource Logs are not collected and stored until you create a diagnostic setting and route them to one or more locations.

See [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/platform/diagnostic-settings) for the detailed process for creating a diagnostic setting using the Azure portal, CLI, or PowerShell. When you create a diagnostic setting, you specify which categories of logs to collect. The categories for *AKS* are listed in [AKS monitoring data reference](monitor-aks-reference.md#resource-logs).

The metrics and logs you can collect are discussed in the following sections.

## Analyzing metrics

To view the metrics for your AKS cluster:

1. Sign in to the [Azure portal][azure-portal] and navigate to your AKS cluster.
1. On the left side under *Monitoring*, select *Metrics*.
1. Create a chart for the metrics you want to view. For example, create a chart:
    1. For *Scope*, choose your cluster.
    1. For *Metric Namespace*, choose *Container service (managed) standard metrics*.
    1. For *Metric*, under *Pods* choose *Number of Pods by phase*.
    1. For *Aggregation* choose *Avg*.

:::image type="content" source="media/metrics/metrics-chart.png" alt-text="{alt-text}":::

The above example shows the metrics for the average number of pods for the *myAKSCluster*.

For a list of the platform metrics collected for AKS, see [Metrics](monitor-aks-reference.md#metrics) and [[Metric dimensions](monitor-aks-reference.md#metric-dimensions)] in the Monitoring AKS data reference.


## Analyzing logs

Data in Azure Monitor Logs is stored in tables where each table has its own set of unique properties.  

The [Activity log](/azure/azure-monitor/platform/activity-log) is a type of platform log in Azure that provides insight into subscription-level events. You can view it independently or route it to Azure Monitor Logs, where you can do much more complex queries using Log Analytics.  

For a list of the types of resource logs collected for AKS, see [Monitoring AKS data reference](monitor-aks-reference.md#resource-logs)  

For a list of the tables used by Azure Monitor Logs and queryable by Log Analytics, see [Monitoring AKS data reference](monitor-aks-reference.md#azure-monitor-logs-tables).

### Sample Kusto queries

> [!IMPORTANT]
> When you select **Logs** from the AKS menu, Log Analytics is opened with the query scope set to the current AKS. This means that log queries will only include data from that resource. If you want to run a query that includes data from other clusters or data from other Azure services, select **Logs** from the **Azure Monitor** menu. See [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope/) for details.

Following is an [example query to list all container images and their status](https://github.com/microsoft/AzureMonitorCommunity/blob/master/Azure%20Services/Kubernetes%20services/Queries/Diagnostics/Image%20inventory.kql).

```Kusto
ContainerImageInventory
| summarize AggregatedValue = count() by Image, ImageTag, Running, _ResourceId
```

For a full list of example queries, see the [AKS Queries section in the AzureMonitorCommunity GitHub repo](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Kubernetes%20services/Queries). These examples are also available in the Azure portal.

## Alerts

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/platform/alerts-metric-overview), [logs](/azure/azure-monitor/platform/alerts-unified-log), and the [activity log](/azure/azure-monitor/platform/activity-log-alerts). Different types of alerts have benefits and drawbacks

The following table lists common and recommended alert rules for AKS.

| Rule Name | Condition | Description  |
|:---|:---|
| Completed job count | Number of completed jobs(more than 6 hours ago) are greater than 0 |
| Container CPU % | Average container CPU is greater than 95% |
| Container working set memory % | Average container working set memory is greater than 95% |
| Failed Pod counts | Number of Pods in Failed state are greater than 0 |
| Node CPU % | Average node CPU is greater than 80% |
| Node Disk Usage % | Average disk usage for a node is greater than 80% |
| Node NotReady status | Number of nodes in not ready state are greater than 0 |
| Node working set memory % | Average node working set memory is greater than 80% |
| OOM Killed Containers | Number of OOM killed containers are greater than  0 |
| Persistent Volume Usage % | Average PV usage is greater than 80% |
| Pods ready % | Average ready state pods are less than 80% |
| Restarting container count | Number of restarting containers are greater than 0 |

These alerts are also available as *Recommended alerts (Preview)* in the *Insights* area under *Monitoring* in the Azure portal.

## Next steps

- See [Monitoring AKS data reference](monitor-aks-reference.md) for a reference of the metrics, logs, and other important values created by AKS.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resource) for details on monitoring Azure resources.
