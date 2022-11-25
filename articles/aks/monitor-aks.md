---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of AKS clusters and their workloads.
ms.service:  azure-monitor
ms.custom: ignite-2022
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/29/2021
---

# Monitoring Azure Kubernetes Service (AKS) with Azure Monitor
This scenario describes how to use Azure Monitor to monitor the health and performance of Azure Kubernetes Service (AKS). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

The [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) defines the [primary monitoring objectives](/azure/cloud-adoption-framework/strategy/monitoring-strategy#formulate-monitoring-requirements) you should focus on for your Azure resources. This scenario focuses on Health and Status monitoring using Azure Monitor.

## Scope of the scenario
This scenario is intended for customers using Azure Monitor to monitor AKS. It does not include the following, although this content may be added in subsequent updates to the scenario.

- Monitoring of Kubernetes clusters outside of Azure except for referring to existing content for Azure Arc-enabled Kubernetes. 
- Monitoring of AKS with tools other than Azure Monitor except to fill gaps in Azure Monitor and Container Insights.

> [!NOTE]
> Azure Monitor was designed to monitor the availability and performance of cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring for AKS is done with [Microsoft Sentinel](../sentinel/overview.md) and [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md). See [Monitor virtual machines with Azure Monitor - Security monitoring](../azure-monitor/vm/monitor-virtual-machine-security.md) for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.
>
> For information on using the security services to monitor AKS, see [Microsoft Defender for Kubernetes - the benefits and features](../defender-for-cloud/defender-for-kubernetes-introduction.md) and  [Connect Azure Kubernetes Service (AKS) diagnostics logs to Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-kubernetes-service-aks).
## Container insights
AKS generates [platform metrics and resource logs](monitor-aks-reference.md), like any other Azure resource, that you can use to monitor its basic health and performance. Enable [Container insights](../azure-monitor/containers/container-insights-overview.md) to expand on this monitoring. Container insights is a feature in Azure Monitor that monitors the health and performance of managed Kubernetes clusters hosted on AKS in addition to other cluster configurations. Container insights provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios. 

[Prometheus](https://aka.ms/azureprometheus-promio) and [Grafana](https://aka.ms/azureprometheus-promio-grafana) are CNCF backed widely popular open source tools for kubernetes monitoring. AKS exposes many metrics in Prometheus format which makes Prometheus a popular choice for monitoring. [Container insights](../azure-monitor/containers/container-insights-overview.md) has native integration with AKS, collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks. It also collects certain Prometheus metrics, and many native Azure Monitor Insights are built-up on top of Prometheus metrics. Container insights complements and completes E2E monitoring of AKS including log collection which Prometheus as stand-alone tool doesn’t provide. Many customers use Prometheus integration and Azure Monitor together for E2E monitoring.

Learn more about using Container insights at [Container insights overview](../azure-monitor/containers/container-insights-overview.md). [Monitor layers of AKS with Container insights](#monitor-layers-of-aks-with-container-insights) below introduces various features of Container insights and the monitoring scenarios that they support.

:::image type="content" source="media/monitor-aks/container-insights.png" alt-text="Container insights" lightbox="media/monitor-aks/container-insights.png":::


## Configure monitoring
The following sections describe the steps required to configure full monitoring of your AKS cluster using Azure Monitor.
### Create Log Analytics workspace
You require at least one Log Analytics workspace to support Container insights and to collect and analyze other telemetry about your AKS cluster. There is no cost for the workspace, but you do incur ingestion and retention costs when you collect data. See [Azure Monitor Logs pricing details](../azure-monitor/logs/cost-logs.md) for details.

If you're just getting started with Azure Monitor, then start with a single workspace and consider creating additional workspaces as your requirements evolve. Many environments will use a single workspace for all the Azure resources they monitor. You can even share a workspace used by [Microsoft Defender for Cloud and Microsoft Sentinel](../azure-monitor/vm/monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. 

See [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/workspace-design.md) for details on logic that you should consider for designing a workspace configuration.

### Enable container insights
When you enable Container insights for your AKS cluster, it deploys a containerized version of the [Log Analytics agent](../agents/../azure-monitor/agents/log-analytics-agent.md) that sends data to Azure Monitor. There are multiple methods to enable it depending whether you're working with a new or existing AKS cluster. See [Enable Container insights](../azure-monitor/containers/container-insights-onboard.md) for prerequisites and configuration options.


### Configure collection from Prometheus
Container insights allows you to send Prometheus metrics to [Azure Monitor managed service for Prometheus](../azure-monitor/essentials/prometheus-metrics-overview.md) or to your Log Analytics workspace without requiring a local Prometheus server. You can analyze this data using Azure Monitor features along with other data collected by Container insights. See [Collect Prometheus metrics with Container insights](../azure-monitor/containers/container-insights-prometheus.md) for details on this configuration.


### Collect resource logs
The logs for AKS control plane components are implemented in Azure as [resource logs](../azure-monitor/essentials/resource-logs.md). Container insights doesn't currently use these logs, so you do need to create your own log queries to view and analyze them. See [How to query logs from Container insights](../azure-monitor/containers/container-insights-log-query.md#resource-logs) for details on the structure of these logs and how to write queries for them.

You need to create a diagnostic setting to collect resource logs. Create multiple diagnostic settings to send different sets of logs to different locations. See [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md) to create diagnostic settings for your AKS cluster. 

There is a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. Send logs to an Azure storage account to reduce costs if you need to retain the information but don't require it to be readily available for analysis.  See [Resource logs](monitor-aks-reference.md#resource-logs) for a description of the categories that are available for AKS and See [Azure Monitor Logs pricing details](../azure-monitor/logs/cost-logs.md) for details on the cost of ingesting and retaining log data. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs.

If you're unsure about which resource logs to initially enable, use the recommendations in the following table which are based on the most common customer requirements. Enable the other categories if you later find that you require this information.

| Category | Enable? | Destination |
|:---|:---|:---|
| cluster-autoscaler      | Enable if autoscale is enabled | Log Analytics workspace |
| guard                   | Enable if Azure Active Directory is enabled | Log Analytics workspace |
| kube-apiserver          | Enable | Log Analytics workspace |
| kube-audit              | Enable | Azure storage. This keeps costs to a minimum yet retains the audit logs if they're required by an auditor. |
| kube-audit-admin        | Enable | Log Analytics workspace |
| kube-controller-manager | Enable | Log Analytics workspace |
| kube-scheduler          | Disable | |
| AllMetrics              | Enable | Log Analytics workspace |





## Access Azure Monitor features

Access Azure Monitor features for all AKS clusters in your subscription from the **Monitoring** menu in the Azure portal or for a single AKS cluster from the **Monitor** section of the **Kubernetes services** menu. The screenshot below shows the cluster's **Monitor** menu.

:::image type="content" source="media/monitor-aks/monitoring-menu.png" alt-text="AKS Monitoring menu" lightbox="media/monitor-aks/monitoring-menu.png":::

| Menu option | Description |
|:---|:---|
| Insights | Opens container insights for the current cluster. Select **Containers** from the **Monitor** menu to open container insights for all clusters.  |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the current cluster. |
| Diagnostic settings | Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | Recommendations for the current cluster from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data and access prebuilt queries. |
| Workbooks | Open workbook gallery for Kubernetes service. |




## Monitor layers of AKS with Container insights
Because of the wide variance in Kubernetes implementations, each customer will have unique requirements for AKS monitoring. The approach you take should be based on factors including scale, topology, organizational roles, and multi-cluster tenancy. This section presents a common strategy that is a bottoms-up approach starting from infrastructure up through applications. Each layer has distinct monitoring requirements. These layers are illustrated in the following diagram and discussed in more detail in the following sections.

:::image type="content" source="media/monitor-aks/layers.png" alt-text="AKS layers"  border="false":::

### Level 1 - Cluster level components
Cluster level includes the following components.

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, and disk for each node and proactively monitor their usage trends before deploying any workloads. |


Use existing views and reports in Container Insights to monitor cluster level components. The **Cluster** view gives you a quick view of the performance of the nodes in your cluster including their CPU and memory utilization. Use the **Nodes** view to view the health of each node in addition to the health and performance of the pods running on each. See [Monitor your Kubernetes cluster performance with Container insights](../azure-monitor/containers/container-insights-analyze.md) for details on using this view and analyzing node health and performance.

:::image type="content" source="media/monitor-aks/container-insights-cluster-view.png" alt-text="Container insights cluster view" lightbox="media/monitor-aks/container-insights-cluster-view.png":::

Use **Node** workbooks in Container Insights to analyze disk capacity and IO in addition to GPU usage. See [Node workbooks](../azure-monitor/containers/container-insights-reports.md#node-workbooks) for a description of these workbooks.

:::image type="content" source="media/monitor-aks/container-insights-node-workbooks.png" alt-text="Container insights node workbooks" lightbox="media/monitor-aks/container-insights-node-workbooks.png":::


For troubleshooting scenarios, you may need to access the AKS nodes directly for maintenance or immediate log collection. For security purposes, the AKS nodes aren't exposed to the internet but you can `kubectl debug` to SSH to the AKS nodes. See [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](ssh.md) for details on this process.



### Level 2 - Managed AKS components
Managed AKS level includes the following components.

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server, identifying any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitoring Kubelet helps in troubleshooting of pod management issues, pods not starting, nodes not ready or pods getting killed.  |

Azure Monitor and container insights don't yet provide full monitoring for the API server. You can use metrics explorer to view the **Inflight Requests** counter, but you should refer to metrics in Prometheus for a complete view of API Server performance. This includes such values as request latency and workqueue processing time. A Grafana dashboard that provides views of the critical metrics for the API server is available at [Grafana Labs](https://grafana.com/grafana/dashboards/12006). Use this dashboard on your existing Grafana server or setup a new Grafana server in Azure using [Monitor your Azure services in Grafana](../azure-monitor/visualize/grafana-plugin.md)

:::image type="content" source="media/monitor-aks/grafana-api-server.png" alt-text="Grafana API server" lightbox="media/monitor-aks/grafana-api-server.png":::

Use the **Kubelet** workbook to view the health and performance of each kubelet. See [Resource Monitoring workbooks](../azure-monitor/containers/container-insights-reports.md#resource-monitoring-workbooks) for details on this workbook. For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](kubelet-logs.md).

:::image type="content" source="media/monitor-aks/container-insights-kubelet-workbook.png" alt-text="Container insights kubelet workbook" lightbox="media/monitor-aks/container-insights-kubelet-workbook.png":::

### Resource logs
Use [log queries with resource logs](../azure-monitor/containers/container-insights-log-query.md#resource-logs) to analyze control plane logs generated by AKS components. 

### Level 3 - Kubernetes objects and workloads
Kubernetes objects and workloads level include the following components.

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  | 
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor the resource utilization, including CPU and memory, of the containers running on your AKS cluster. |


Use existing views and reports in Container Insights to monitor containers and pods. Use the **Nodes** and **Controllers** views to view the health and performance of the pods running on them and drill down to the health and performance of their containers. View the health and performance for containers directly from the **Containers** view. See [Monitor your Kubernetes cluster performance with Container insights](../azure-monitor/containers/container-insights-analyze.md) for details on using this view and analyzing container health and performance.

:::image type="content" source="media/monitor-aks/container-insights-containers-view.png" alt-text="Container insights containers view" lightbox="media/monitor-aks/container-insights-containers-view.png":::

Use the **Deployment** workbook in Container insights to view metrics collected for deployments. See [Deployment & HPA metrics with Container insights](../azure-monitor/containers/container-insights-deployment-hpa-metrics.md) for details.

> [!NOTE]
> Deployments view in Container insights is currently in public preview.

:::image type="content" source="media/monitor-aks/container-insights-deployments-workbook.png" alt-text="Container insights deployments workbook" lightbox="media/monitor-aks/container-insights-deployments-workbook.png":::

#### Live data
In troubleshooting scenarios, Container insights provides access to live AKS container logs (stdout/stderror), events, and pod metrics. See [How to view Kubernetes logs, events, and pod metrics in real-time](../azure-monitor/containers/container-insights-livedata-overview.md) for details on using this feature.

:::image type="content" source="media/monitor-aks/container-insights-live-data.png" alt-text="Container insights live data" lightbox="media/monitor-aks/container-insights-live-data.png":::

### Level 4- Applications
The application level includes the application workloads running in the AKS cluster.

| Component | Monitoring requirements |
|:---|:---|
| Applications | Monitor microservice application deployments to identify application failures and latency issues. Includes such information as request rates, response times, and exceptions. |

Application Insights provides complete monitoring of applications running on AKS and other environments. If you have a Java application, you can provide monitoring without instrumenting your code following [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](../azure-monitor/app/kubernetes-codeless.md). For complete monitoring though, you should configure code-based monitoring depending on your application.

- [ASP.NET Applications](../azure-monitor/app/asp-net.md)
- [ASP.NET Core Applications](../azure-monitor/app/asp-net-core.md)
- [.NET Console Applications](../azure-monitor/app/console.md)
- [Java](../azure-monitor/app/java-in-process-agent.md)
- [Node.js](../azure-monitor/app/nodejs.md)
- [Python](../azure-monitor/app/opencensus-python.md)
- [Other platforms](../azure-monitor/app/platforms.md)

See [What is Application Insights?](../azure-monitor/app/app-insights-overview.md) 

### Level 5- External components
Components external to AKS include the following.

| Component | Monitoring requirements |
|:---|:---|
| Service Mesh, Ingress, Egress | Metrics based on component. |
| Database and work queues | Metrics based on component. |

Monitor external components such as Service Mesh, Ingress, Egress with Prometheus and Grafana or other proprietary tools. Monitor databases and other Azure resources using other features of Azure Monitor.

## Analyze metric data with metrics explorer
Use metrics explorer when you want to perform custom analysis of metric data collected for your containers. Metrics explorer allows you plot charts, visually correlate trends, and investigate spikes and dips in metrics' values. Create a metrics alert to proactively notify you when a metric value crosses a threshold, and pin charts to dashboards for use by different members of your organization.

See [Getting started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md) for details on using this feature. For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](monitor-aks-reference.md#metrics). When Container insights is enabled for a cluster, [addition metric values](../azure-monitor/containers/container-insights-update-metrics.md) are available.

:::image type="content" source="media/monitor-aks/metrics-explorer.png" alt-text="Metrics explorer" lightbox="media/monitor-aks/metrics-explorer.png":::



## Analyze log data with Log Analytics
Use Log Analytics when you want to analyze resource logs or dig deeper into the data used to create the views in Container insights. Log Analytics allows you to perform custom analysis of your log data. 

See [How to query logs from Container insights](../azure-monitor/containers/container-insights-log-query.md) for details on using log queries to analyze data collected by Container insights. See [Using queries in Azure Monitor Log Analytics](../azure-monitor/logs/queries.md) for information on using these queries and [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md) for a complete tutorial on using Log Analytics to run queries and work with their results.

For a list of the tables collected for AKS that you can analyze in metrics explorer, see [Monitoring AKS data reference logs](monitor-aks-reference.md#azure-monitor-logs-tables).

:::image type="content" source="media/monitor-aks/log-analytics-queries.png" alt-text="Log Analytics queries for Kubernetes" lightbox="media/monitor-aks/log-analytics-queries.png":::

In addition to Container insights data, you can use log queries to analyze resource logs from AKS. For a list of the log categories available, see [AKS data reference resource logs](monitor-aks-reference.md#resource-logs). You must create a diagnostic setting to collect each category as described in [Configure monitoring](#configure-monitoring) before that data will be collected. 




## Alerts
[Alerts in Azure Monitor](../azure-monitor/alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. There are no preconfigured alert rules for AKS clusters, but you can create your own based on data collected by Container insights.

> [!IMPORTANT]
> Most alert rules have a cost that's dependent on the type of rule, how many dimensions it includes, and how frequently it's run. Refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before you create any alert rules.


### Choosing the alert type
The most common types of alert rules in Azure Monitor are [metric alerts](../azure-monitor/alerts/alerts-metric.md) and [log query alerts](../azure-monitor/alerts/alerts-log-query.md). The type of alert rule that you create for a particular scenario will depend on where the data is located that you're alerting on. You may have cases though where data for a particular alerting scenario is available in both Metrics and Logs, and you need to determine which rule type to use. 

It's typically the best strategy to use metric alerts instead of log alerts when possible since they're more responsive and stateful. You can create a metric alert on any values you can analyze in metrics explorer. If the logic for your alert rule requires data in Logs, or if it requires more complex logic, then you can use a log query alert rule.

For example, if you want to alert when an application workload is consuming excessive CPU then you can create a metric alert using the CPU metric. If you need an alert when a particular message is found in a control plane log, then you'll require a log alert.
### Metric alert rules
Metric alert rules use the same metric values as metrics explorer. In fact, you can create an alert rule directly from metrics explorer with the data you're currently analyzing. You can use any of the values in [AKS data reference metrics](monitor-aks-reference.md#metrics) for metric alert rules.

Container insights includes a feature in public preview that creates a recommended set of metric alert rules for your AKS cluster. This feature creates new metric values (also in preview) used by the alert rules that you can also use in metrics explorer. See [Recommended metric alerts (preview) from Container insights](../azure-monitor/containers/container-insights-metric-alerts.md) for details on this feature and on creating metric alerts for AKS.


### Log alerts rules
Use log alert rules to generate an alert from the results of a log query. This may be data collected by Container insights or from AKS resource logs. See [How to create log alerts from Container insights](../azure-monitor/containers/container-insights-log-alerts.md) for details on log alert rules for AKS and  a set of sample queries designed for alert rules. You can also refer to [How to query logs from Container insights](../azure-monitor/containers/container-insights-log-query.md) for details on log queries that could be modified for alert rules.

### Virtual machine alerts
AKS relies on a virtual machine scale set that must be healthy to run AKS workloads. You can alert on critical metrics such as CPU, memory, and storage for the virtual machines using the guidance at [Monitor virtual machines with Azure Monitor: Alerts](../azure-monitor/vm/monitor-virtual-machine-alerts.md).

### Prometheus alerts
For those conditions where Azure Monitor either doesn't have the data required for an alerting condition, or where the alerting may not be responsive enough, you should configure alerts in Prometheus. One example is alerting for the API server. Azure Monitor doesn't collect critical information for the API server including whether it's available or experiencing a bottleneck. You can create a log query alert using the data from the kube-apiserver resource log category, but this can take up to several minutes before you receive an alert which may not be sufficient for your requirements. 


## Next steps

- See [Monitoring AKS data reference](monitor-aks-reference.md) for a reference of the metrics, logs, and other important values created by AKS.
