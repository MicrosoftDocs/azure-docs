---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of Kubernetes clusters and their workloads.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2023
---

# Monitor Kubernetes clusters using Azure services

This article describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

Your choice of monitoring tools will depend on the requirements of your particular environment in addition to any existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/). Azure includes managed versions of the most standard tools and features that help you integrate your kubernetes clusters and workloads.

## Azure services

Azure has a complete set of services for monitoring your Kubernetes infrastructure and the applications that depend on it as described in the following table. These services work in conjunction with each other to provide a complete monitoring solution, or you may integrate them with your existing monitoring tools.

| Service | Description |
|:---|:---|
| [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) | Fully managed implementation of [Prometheus](https://prometheus.io) to ingest, alert on, and query metrics, providing visibility to the health and performance of your from your Kubernetes cluster and its applications. Prometheus is a  cloud-native metrics solution  from the Cloud Native Compute Foundation and the most common tool used for collecting and analyzing metric data from Kubernetes clusters. Azure Monitor managed service for Prometheus is compatible with the Prometheus query language (PromQL) and Prometheus alerts in addition to integration with Azure Managed Grafana for visualization. This service supports your investment in open source tools without the complexity of managing your own Prometheus environment. | 
| [Container Insights](container-insights-overview.md) | Azure service for AKS and Azure Arc-enabled Kubernetes clusters that uses a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) to collect stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster and stores them in a Log Analytics workspace. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using [Log Analytics](../logs/log-analytics-overview.md). |
| [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) | Allows you to attach Kubernetes clusters running anywhere so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools, including Container insights. |
| [Azure Managed Grafana](../../managed-grafana/overview.md) | Fully managed implementation of [Grafana](https://grafana.com/), which is an open-source data visualization platform commonly used to present Prometheus data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes and full-stack troubleshooting.  |
| [Application insights](../app/app-insights-overview.md) |  Feature of Azure Monitor that provides application performance monitoring (APM) to monitor applications running on your Kubernetes cluster from development, through test, and into production. Quickly identify and mitigate latency and reliability issues using distributed traces. Supports [OpenTelemetry](../app/opentelemetry-overview.md#opentelemetry) for vendor-neutral instrumentation. |
| [Network Watcher](../network-watcher/network-watcher-monitoring-overview..md) | Provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in the virtual network used by your Kubernetes clusters. |


## Configure monitoring

### Prerequisites
The following table lists the prerequisites before configuring Azure services to monitor Kubernetes. You may already have these prerequisites in place.

| Component | Description |
|:---|:---|
| Azure Monitor workspace | You require at least one [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) to support Managed Prometheus.  There's no cost for the workspaces, but you do incur ingestion and retention costs when you collect data. See [Azure Monitor Logs pricing details](../logs/cost-logs.md) for details. For information on design considerations for a workspace configuration, see [Azure Monitor workspace architecture](../essentials/azure-monitor-workspace-overview.md#azure-monitor-workspace-architecture). |
| Log Analytics workspace | You require at least one [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) if you enable Container insights or if you collect resource logs.There's no cost for the workspaces, but you do incur ingestion costs when you collect data. See [Azure Monitor pricing](https://aka.ms/azmonpricing) for details. For information on design considerations for a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/workspace-design.md). |


### Send Activity log for AKS clusters to Log Analytics workspace
Configuration changes to your AKS clusters are stored in the [Activity log](../essentials/activity-log.md). [Send this data to your Log Analytics workspace](../essentials/activity-log.md#send-to-log-analytics-workspace) to analyze it with other monitoring data.  There's no cost for this data collection, and you can analyze or alert on the data using Log Analytics.


### Enable scraping of Prometheus metrics

Enable scraping of Prometheus metrics from your AKS cluster using one of the following methods:

- Select the option **Enable Prometheus metrics** when you [create an AKS cluster]().
- Select the option **Enable Prometheus metrics** when you enable Container insights on an [AKS cluster]() or [Azure Arc-enabled Kubernetes cluster]().
- Enable for an existing [AKS cluster](../essentials/prometheus-metrics-enable.md) or [Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md).


If you already have a Prometheus environment that you want to use for your AKS clusters, then enable Azure Monitor managed service for Prometheus and then use remote-write to send data to your existing Prometheus environment. 

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection. If you want to customize the configuration, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md).



### Enable Container Insights

When you enable Container Insights for your AKS cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/..//agents/log-analytics-agent.md) that sends data to Azure Monitor. For prerequisites and configuration options, see [Enable Container insights](../containers/container-insights-onboard.md).

Once Container insights is enabled for a cluster, perform the following actions oto optimize your installation.

- To improve your query experience with data Collected by Container insights and to reduce collection costs, [enable the ContainerLogV2 schema](container-insights-logging-v2.md) for each cluster. If you only use logs for occasional troublshooting, then consider configuring this table as [basic logs](../logs/basic-logs-configure.md).
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) for details.


### Collect control plane logs for AKS clusters

The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container Insights doesn't use these logs, so you need to create your own log queries to view and analyze them. For details on log structure and queries, see [How to query logs from Container Insights](container-insights-log-query.md#resource-logs).

- [Create diagnostic setting](../essentials/diagnostic-settings.md) for each AKS cluster to send resource logs to a Log Analytics workspace.
- For a description of the categories that are available for AKS, see [Resource logs](../../aks/monitor-aks-reference.md#resource-logs). 

There's a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs. You can send logs to an Azure storage account to reduce costs if you need to retain the information. For details on the cost of ingesting and retaining log data, see [Azure Monitor Logs pricing details](..//logs/cost-logs.md).

If you're unsure which resource logs to initially enable, use the following recommendations:

| Category | Enable? | Destination |
|:---|:---|:---|
| kube-apiserver          | Enable | Log Analytics workspace |
| kube-audit              | Enable | Azure storage. This keeps costs to a minimum yet retains the audit logs if they're required by an auditor. |
| kube-audit-admin        | Enable | Log Analytics workspace |
| kube-controller-manager | Enable | Log Analytics workspace |
| kube-scheduler          | Disable | |
| cluster-autoscaler      | Enable if autoscale is enabled | Log Analytics workspace |
| cloud-controller-manager| | |
| guard                   | Enable if Azure Active Directory is enabled | Log Analytics workspace |
| csi-azuredisk-controller | | |
| csi-azurefile-controller | | |
| csi-snapshot-controller  | | |
| AllMetrics              | Disable since metrics are collected in Managed Prometheus | Log Analytics workspace |

The recommendations are based on the most common customer requirements. You can enable other categories later if you need to.


## Monitor layers of Kubernetes and monitoring services

Your monitoring approach should be based on your unique workload requirements, and factors such as scale, topology, organizational roles, and multi-cluster tenancy. Following is an illustration of a common bottoms-up approach, starting from infrastructure up through applications. Each layer has distinct monitoring requirements that are addressed by different Azure services. 

:::image type="content" source="media/monitor-containers/layers.png" alt-text="Diagram of AKS layers" lightbox="media/monitor-containers/layers.png"  border="false":::

## Kubernetes telemetry


### Metrics
 Sources | Description |
|:---|:---|
| Platform metrics | [Platform metrics](../../aks/monitor-aks-reference.md#metrics) are automatically collected for AKS clusters at no cost. You can analyze these metrics with [metrics explorer](../essentials/metrics-getting-started.md) or use them for [metric alerts](../alerts/alerts-types.md#metric-alerts). Platform metrics are not collected tor hybrid clusters. |
| Prometheus metrics | Prometheus metrics are stored in [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). Scrape this data from your cluster using the Azure Monitor agent. Use Azure Arc for Kubernetes with the Azure Monitor agent for hybrid clusters. |


### Logs

 Sources | Description |
|:---|:---|
| Activity logs | [Activity log](../../aks/monitor-aks-reference.md) is collected automatically for  AKS clusters at no cost. These logs track information such as when a cluster is created or has a configuration change. Activity logs are not collected for hybrid clusters. |
| Cluster inventory | Container insights collects  |
| stderr/stdout logs | Containerized applications in the cluster send their logs to standard output (stdout) and standard error (stderr) streams. Container insights collects these logs and stores them in the **ContainerLogs**  in a Log Analytics workspace. [Enable the ContainerLogV2](container-insights-logging-v2.md) schema for improved query experience and reduce collection costs.  |
| Control plane logs | [Control plane logs](../../aks/monitor-aks-reference.md#resource-logs) for AKS are implemented as resource logs. These aren't used by Container insights, but you can create a diagnostic setting to send them to Log Analytics workspace. |
| Application logs | Application usage and traces |



## Security monitoring

Azure Monitor was designed to monitor the availability and performance of cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring for AKS is done with [Microsoft Sentinel](../../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). See [Monitor virtual machines with Azure Monitor - Security monitoring](..//vm/monitor-virtual-machine-security.md) for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.
>
> For information on using the security services to monitor AKS, see [Microsoft Defender for Kubernetes - the benefits and features](../../defender-for-cloud/defender-for-kubernetes-introduction.md) and  [Connect Azure Kubernetes Service (AKS) diagnostics logs to Microsoft Sentinel](../../sentinel/data-connectors/azure-kubernetes-service-aks.md).





## Access Container insights

- Access Container insights features for all AKS and Arc-enabled Kubernetes clusters in your subscription from the **Monitoring** menu in the Azure portal. 
- Access Container insights features for a single AKS and Arc-enabled Kubernetes cluster from the **Monitor** section of the **Kubernetes services** menu. 

:::image type="content" source="media/monitor-containers/monitoring-menu.png" alt-text="AKS Monitoring menu" lightbox="media/monitor-containers/monitoring-menu.png":::

| Menu option | Description |
|:---|:---|
| Insights | Opens Container Insights for the current cluster. Select **Containers** from the **Monitor** menu to open Container Insights for all clusters.  |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the current cluster. |
| Diagnostic settings | Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | Recommendations for the current cluster from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data and access prebuilt queries. |
| Workbooks | Open workbook gallery for Kubernetes service. |

## Monitor Kubernetes layers

### Level 1 - Cluster level components

The cluster level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, disk and IP usage for each node and proactively monitor their usage trends before deploying any workloads. |

#### Container Insights views and reports

- Use the **Cluster** view to see the performance of the nodes in your cluster, including CPU and memory utilization.
- Use the **Nodes** view to see the health of each node and the health and performance of the pods running on them. For more information on analyzing node health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md).
- Under **Reports**, use the **Node Monitoring** workbooks to analyze disk capacity, disk IO, and GPU usage. For more information about these workbooks, see [Node Monitoring workbooks](container-insights-reports.md#node-monitoring-workbooks).
- Under **Monitoring**, you can select **Workbooks**, then **Subnet IP Usage** to see the IP allocation and assignment on each node for a selected time-range.

#### Grafana dashboards

- Any?

For troubleshooting scenarios, you may need to access nodes directly for maintenance or immediate log collection. For security purposes, AKS nodes aren't exposed to the internet but you can use the `kubectl debug` command to SSH to the AKS nodes. For more information on this process, see [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md).

### Level 2 - Managed AKS components

The managed AKS level includes the following components:

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server and identify any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitor Kubelet to help troubleshoot pod management issues, pods not starting, nodes not ready, or pods getting killed.  |

#### Container Insights views and reports

- Under **Monitoring**, you can select **Metrics** to view the **Inflight Requests** counter.
- Under **Reports**, use the **Kubelet** workbook to see the health and performance of each kubelet. For more information about these workbooks, see [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks). For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).

#### Grafana dashboards

- [Kubernetes apiserver](https://grafana.com/grafana/dashboards/12006) for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.


#### Resource logs

Use [log queries with resource logs](container-insights-log-query.md#resource-logs) to analyze control plane logs generated by AKS components.

### Level 3 - Kubernetes objects and workloads

The Kubernetes objects and workloads level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  |
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor resource utilization, including CPU and memory, of the containers running on your AKS cluster. |

#### Container Insights views and reports

- Use the **Nodes** and **Controllers** views to see the health and performance of the pods running on them and drill down to the health and performance of their containers.
- Use the **Containers** view to see the health and performance for the containers. For more information on analyzing container health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md#analyze-nodes-controllers-and-container-health).
- Under **Reports**, use the **Deployments** workbook to see deployment metrics. For more information, ee [Deployment & HPA metrics with Container Insights](container-insights-deployment-hpa-metrics.md).

#### Grafana dashboards

- Any?
#### Live data

- In troubleshooting scenarios, Container Insights provides access to live AKS container logs (stdout/stderror), events and pod metrics. For more information about this feature, see [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md).

### Level 4 - Applications

The application level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Applications | Monitor microservice application deployments to identify application failures and latency issues, including information like request rates, response times, and exceptions. |

[Application Insights](../app/app-insights-overview.md) provides complete monitoring of applications running on AKS and other environments. 

- If you have a Java application, you can provide complete monitoring without instrumenting your code by following [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](../app/kubernetes-codeless.md).
- For other languages, you can determine whether to use automatic or manual instrumentation with the guidance at  [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md)


### Level 5 - External components

The components external to AKS include the following:

| Component | Monitoring requirements |
|:---|:---|
| Service Mesh, Ingress, Egress | Metrics based on component. |
| Database and work queues | Metrics based on component. |

Monitor external components such as Service Mesh, Ingress, Egress with Prometheus and Grafana, or other proprietary tools. Monitor databases and other Azure resources using other features of Azure Monitor.

#### Network monitoring

- [Network Observability add-on for AKS](../../network-watcher/network-watcher-monitoring-overview.md)
- [Network Watcher](/azure/network-watcher/)

## Analyze Data 

### Analyze log data with Log Analytics

Select **Logs** to use the Log Analytics tool to analyze resource logs or dig deeper into data used to create the views in Container Insights. Log Analytics allows you to perform custom analysis of your log data.

For more information on Log Analytics and to get started with it, see:

- [How to query logs from Container Insights](container-insights-log-query.md)
- [Using queries in Azure Monitor Log Analytics](../logs/queries.md)
- [Monitoring AKS data reference logs](../../aks/monitor-aks-reference.md#azure-monitor-logs-tables)
- [Log Analytics tutorial](../logs/log-analytics-tutorial.md)

You can also use log queries to analyze resource logs from AKS. For a list of the log categories available, see [AKS data reference resource logs](../../aks/monitor-aks-reference.md#resource-logs). You must create a diagnostic setting to collect each category as described in [Configure monitoring](#configure-monitoring) before the data can be collected.

### Analyze metric data with the Metrics explorer

Use the **Metrics** explorer to perform custom analysis of metric data collected for your containers. It allows you plot charts, visually correlate trends, and investigate spikes and dips in your metrics values. You can create metrics alert to proactively notify you when a metric value crosses a threshold and pin charts to dashboards for use by different members of your organization.

For more information, see [Getting started with Azure Metrics Explorer](..//essentials/metrics-getting-started.md). For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). When Container Insights is enabled for a cluster, [addition metric values](container-insights-update-metrics.md) are available.

:::image type="content" source="media/monitor-containers/metrics-explorer.png" alt-text="Metrics explorer" lightbox="media/monitor-containers/metrics-explorer.png":::




## Alerts

[Alerts in Azure Monitor](..//alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. 

### Recommended alerts
Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. 



### Additional alerts




| Alert type | Description |
|:---|:---|
| Prometheus alerts | [Prometheus alerts](../alerts/prometheus-alerts.md) are written in Prometheus Query Language (Prom QL) and applied on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). Recommended alerts already include the most common Prometheus alerts, but you can [create addition alert rules](../essentials/prometheus-rule-groups.md) as required. |
| Metric alert rules | Metric alert rules use the same metric values as the Metrics explorer. In fact, you can create an alert rule directly from the metrics explorer with the data you're currently analyzing. Metric alert rules can be useful to alert on AKS performance using any of the values in [AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). |
| Log alert rules | Use log alert rules to generate an alert from the results of a log query. This may include any of the log data stored in the Log Analytics workspace described in [Kubernetes telemetry](#kubernetes-telemetry). For more information, see [How to create log alerts from Container Insights](container-insights-log-alerts.md) and [How to query logs from Container Insights](container-insights-log-query.md). |



## Next steps

- For more information about AKS metrics, logs, and other important values, see [Monitoring AKS data reference](../../aks/monitor-aks-reference.md).



## Extra

[Cloud native](https://azure.microsoft.com/blog/accelerate-your-cloudnative-journey-with-azure-monitor/) refers to technologies supporting scalable applications in modern, dynamic cloud environments. This includes container based applications managed by [kubernetes](https://kubernetes.io) and tools used to monitor their performance and health such as [Prometheus]() and [Grafana]().