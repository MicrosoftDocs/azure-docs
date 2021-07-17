---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Analyze
description: Describes the different features of Azure Monitor that allow you to analyze the health and performance of your AKS cluster.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Analyze data
This article is part of the Monitoring AKS in Azure Monitor scenario. It describes using Container insights and other tools to analyze monitoring data to determine the health and performance of your AKS clusters.

## Monitor menu options

Access Azure Monitor features for all AKS clusters in your subscription from the **Monitor** menu in the Azure portal or for a single AKS cluster from the **Monitor** section of the **Kubernetes services** menu. The screenshot below shows the cluster's **Monitor** menu.

:::image type="content" source="media/monitor-aks/monitoring-menu.png" alt-text="AKS Monitoring menu" lightbox="media/monitor-aks/monitoring-menu.png":::

| Menu option | Description |
|:---|:---|
| Insights | Opens container insights for the current cluster. Select **Containers** from the **Monitor** menu to open container insights for all clusters.  |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the current cluster. |
| Diagnostic settings | Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | recommendations	Recommendations for the current virtual machine from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data. |
| Workbooks | Open workbook gallery for Kubernetes service. |

## Monitor layers of AKS with Container insights
The approach you take to AKS monitoring should be based on factors including scale, topology, organizational roles, and multi-cluster tenancy. This section presents a common strategy that is a bottoms-up approach starting from infrastructure up through applications. Each layer has distinct monitoring requirements. These layers are illustrated in the following diagram and discussed in more detail in the following sections.

:::image type="content" source="media/monitor-aks/layers.png" alt-text="AKS layers":::

### Level 1 - Cluster level components
Cluster level includes the following components.

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, and disk for each node and proactively monitor their usage trends before deploying any workloads. |


Use existing views and reports in Container Insights to monitor cluster level components. The **Cluster** view gives you a quick view of the performance of the nodes in your cluster including their CPU and memory utilization. Use the **Nodes** view to view the health of each node in addition to the health and performance of the pods running on each. See [Monitor your Kubernetes cluster performance with Container insights](container-insights-analyze.md) for details on using this view and analyzing node health and performance.

:::image type="content" source="media/monitor-aks/container-insights-cluster-view.png" alt-text="Container insights cluster view" lightbox="media/monitor-aks/container-insights-cluster-view.png":::

Use **Node** workbooks in Container Insights to analyze disk capacity and IO in addition to GPU usage. See [Node workbooks](container-insights-reports.md#node-workbooks) for a description of these workbooks.

:::image type="content" source="media/monitor-aks/container-insights-node-workbooks.png" alt-text="Container insights node workbooks" lightbox="media/monitor-aks/container-insights-node-workbooks.png":::


For troubleshooting scenarios, you may need to access the AKS nodes directly for maintenance or immediate log collection. For security purposes, the AKS nodes aren't exposed to the internet but you can `kubectl debug` to SSH to the AKS nodes. See [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md) for details on this process.

### Level 2 - Managed AKS components
Managed AKS level includes the following components.

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server, identifying any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitoring Kubelet helps in troubleshooting of pod management issues, pods not starting, nodes not ready or pods getting killed.  |

Azure Monitor and container insights don't yet provide full monitoring for the API server. You can use metrics explorer to view the **Inflight Requests** counter, but you should refer to metrics in Prometheus for a complete view of API Server performance. This includes such values as request latency and workqueue processing time. A Grafana dashboard that provides views of the critical metrics for the API server is available at [Grafana Labs](https://grafana.com/grafana/dashboards/12006).

:::image type="content" source="media/monitor-aks/grafana-api-server.png" alt-text="Grafana API server" lightbox="media/monitor-aks/grafana-api-server.png":::

Use the Kubelet workbook to view the health and performance of each kubelet. See [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks) for details on this workbooks. For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).

:::image type="content" source="media/monitor-aks/container-insights-kubelet-workbook.png" alt-text="Container insights kubelet workbook" lightbox="media/monitor-aks/container-insights-kubelet-workbook.png":::



### Level 3 - Kubernetes objects and workloads
Kubernetes objects and workloads level include the following components.

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  | 
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor the resource utilization, including CPU and memory, of the containers running on your AKS cluster. |


Use existing views and reports in Container Insights to monitor containers and pods. Use the **Nodes** and **Controllers** views to view the health and performance of the pods running on them and drill down to the health and performance of their containers. View the health and performance for containers directly from the **Containers** view. See [Monitor your Kubernetes cluster performance with Container insights](container-insights-analyze.md) for details on using this view and analyzing container health and performance.

:::image type="content" source="media/monitor-aks/container-insights-containers-view.png" alt-text="Container insights containers view" lightbox="media/monitor-aks/container-insights-containers-view.png":::

Use the **Deployment** workbook in Container insights to view metrics collected for deployments. See [Deployment & HPA metrics with Container insights](container-insights-deployment-hpa-metrics.md) for details.

> [!NOTE]
> Deployments view in Container insights is currently in public preview.

:::image type="content" source="media/monitor-aks/container-insights-deployments-workbook.png" alt-text="Container insights deployments workbook" lightbox="media/monitor-aks/container-insights-deployments-workbook.png":::

#### Live data
In troubleshooting scenarios, Container insights provides access to live AKS container logs (stdout/stderror), events, and pod metrics. See [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md) for details on using this feature.

:::image type="content" source="media/monitor-aks/container-insights-live-data.png" alt-text="Container insights live data" lightbox="media/monitor-aks/container-insights-live-data.png":::

### Level 4- Applications
The application level includes the application workloads running in the AKS cluster.

| Component | Monitoring requirements |
|:---|:---|
| Applications | Monitor microservice application deployments to identify application failures and latency issues. Includes such information as request rates, response times, and exceptions. |

Application Insights provides complete monitoring of applications running on AKS and other environments. If you have a Java application, you can provide monitoring without instrumenting your code following [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](../app/kubernetes-codeless.md). For complete monitoring though, you should configure code-based monitoring depending on your application.

- [ASP.NET Applications](../app/asp-net.md)
- [ASP.NET Core Applications](../app/asp-net-core.md)
- [.NET Console Applications](../app/console.md)
- [Java](../app/java-in-process-agent.md)
- [Node.js](../app/nodejs.md)
- [Python](../app/opencensus-python.md)
- [Other platforms](../app/platforms.md)


## Analyze metric data with metrics explorer
Use metrics explorer when you want to perform custom analysis of metric data collected for your containers. Metrics explorer allows you plot charts, visually correlate trends, and investigate spikes and dips in metrics' values. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool.

For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics).

:::image type="content" source="media/monitor-aks/metrics-explorer.png" alt-text="Metrics explorer" lightbox="media/monitor-aks/metrics-explorer.png":::

## Analyze log data with Log Analytics
Use Log Analytics when you want to analyze resource logs or dig deeper into the data used to create the views in Container insights. Log Analytics allows you to perform custom analysis of your log data. 

See [How to query logs from Container insights](container-insights-log-query.md) for details on using log queries to analyze data collected by Container insights. See [Using queries in Azure Monitor Log Analytics](../logs/queries.md) for information on using these queries and [Log Analytics tutorial](../logs/log-analytics-tutorial.md) for a complete tutorial on using Log Analytics to run queries and work with their results.

For a list of the tables collected for AKS that you can analyze in metrics explorer, see [Monitoring AKS data reference logs](../../aks/monitor-aks-reference.md#azure-monitor-logs-tables).

:::image type="content" source="media/monitor-aks/log-analytics-queries.png" alt-text="Log Analytics queries for Kubernetes" lightbox="media/monitor-aks/log-analytics-queries.png":::

In addition to Container insights data, you can use log queries to analyze resource logs from AKS. For a list of the log categories available, see [AKS data reference resource logs](monitor-aks-reference.md#resource-logs). You must create a diagnostic setting to collect each category as described in [Collect resource logs](../../aks/monitor-aks-configure.md#collect-resource-logs) before that data will be collected. 

Resource logs for AKS are stored in the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table You can distinguish different logs with the **Category** column. For example, retrieve **kube-apiserver** logs with the following query.


```kusto
AzureDiagnostics 
| where Category == "kube-audit"
```

Retrieve **kube-audit** with the following command.

```kusto
AzureDiagnostics 
| where Category == "kube-apiserver"
```

## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-aks-analyze.md)
