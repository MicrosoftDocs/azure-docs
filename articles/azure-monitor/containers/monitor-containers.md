---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of Kubernetes clusters and their workloads.
ms.service:  azure-monitor
ms.custom: ignite-2022
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2023
---

# Monitor Kubernetes with Azure Monitor

This article describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

## Cloud native

Cloud native refers to technologies supporting scalable applications in modern, dynamic cloud environments. This includes container based applications managed by [kubernetes](https://kubernetes.io) and tools used to monitor their performance and health such as [Prometheus]() and [Grafana]().

Your choice of monitoring tools will depend on the requirements of your particular environment in addition to any existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/). Azure includes managed versions of the most standard tools and features that help you integrate your kubernetes clusters and workloads.



## Azure services
The following Azure services are used to monitor Kubernetes clusters. 

| Service | Description | Decision Criteria |
|:---|:---|:---|
| Azure Monitor managed service for Prometheus | Prometheus is a project from the Cloud Native Compute Foundation and is the most common tool used for collecting and analyzing metric data from Kubernetes clusters. [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) is a fully managed Prometheus-compatible monitoring solution that allows you to monitor Kubernetes clusters at scale whether they're running in [Azure Kubernetes service]() or in another cloud. | 
| Container Insights | [Container Insights](container-insights-overview.md) is a feature in Azure Monitor that monitors the health and performance of managed Kubernetes clusters. It collects log data from your clusters and provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios. |
| Azure Arc-enabled Kubernetes | [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) allows you to attach Kubernetes clusters running anywhere so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools. |
| Azure Managed Grafana | [Azure Managed Grafana](../../managed-grafana/overview.md) is a data visualization platform built on top of the [Grafana](https://grafana.com/), which is an open-source tool commonly used to present Prometheus data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes.  |


## Decision criteria

Prometheus metrics - Requirement for monitoring Kubernetes clusters. Azure Monitor managed service for Prometheus is recommended in all scenarios. If customer already has a Prometheus environment, then use remote write to send from Azure to existing environment.
Grafana - Requirement for visualization of Prometheus metrics. If customer already has a Grafana environment, then configure appropriate Prometheus environment as a data source. If customer does not have a Grafana environment, then use Azure Managed Grafana.
Container insights - Use for collection of Kubernetes logs (including stderr/stdout) and for included workbooks. If customer already has a solution for collection of Kubernetes logs, then use that solution. If they prefer to focus on Grafana, they may choose 




## Data

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
| Application logs | Application insights |


- If you have no existing solution for collection of your Kubernetes logs, then you should use Container insights to collect the logs in a Log Analytics workspace.
- If you have an existing solution for collection of your Kubernetes logs such as Datadog and Splunk, then follow their documentation for collection of logs from your Azure Kubernetes clusters. You may also choose to use Container insights for your AKS logs but also forward those logs to another system using [data export](../logs/logs-data-export.md).



## Security monitoring

Azure Monitor was designed to monitor the availability and performance of cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring for AKS is done with [Microsoft Sentinel](../../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). See [Monitor virtual machines with Azure Monitor - Security monitoring](..//vm/monitor-virtual-machine-security.md) for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.
>
> For information on using the security services to monitor AKS, see [Microsoft Defender for Kubernetes - the benefits and features](../../defender-for-cloud/defender-for-kubernetes-introduction.md) and  [Connect Azure Kubernetes Service (AKS) diagnostics logs to Microsoft Sentinel](../../sentinel/data-connectors/azure-kubernetes-service-aks.md).





## Prerequisites

| Component | Description |
|:---|:---|
| Azure Monitor workspace | You require at least one [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) to support Managed Prometheus.  There's no cost for the workspaces, but you do incur ingestion and retention costs when you collect data. See [Azure Monitor Logs pricing details](../logs/cost-logs.md) for details. For information on design considerations for a workspace configuration, see [Azure Monitor workspace architecture](../essentials/azure-monitor-workspace-overview.md#azure-monitor-workspace-architecture). |
| Log Analytics workspace | You require at least one [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) if you enable Container insights or if you collect resource logs.There's no cost for the workspaces, but you do incur ingestion costs when you collect data. See [Azure Monitor pricing](https://aka.ms/azmonpricing) for details. For information on design considerations for a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/workspace-design.md). |

### Send Activity log to Log Analytics workspace
Configuration changes to your AKS cluster are stored in the [Activity log](../essentials/activity-log-overview.md). [Send this data to your Log Analytics workspace](../essentials/activity-log.md) to analyze it with other monitoring data.  There is no cost for this data collection.


### Configure collection from Prometheus
Prometheus is part of the Cloud Native Computing Foundation (CNCF) and is the industry standard for monitoring Kubernetes clusters. Prometheus uses a pull model to scrape metrics from your Kubernetes workloads and supports alerting and analysis through Grafana.

[Azure Monitor managed service for Prometheus](..//essentials/prometheus-metrics-overview.md) is a fully managed service that scrapes metrics from your AKS and Azure-enabled clusters. It's compatible with the Prometheus query language (PromQL) and Prometheus alerts in addition to integration with Azure Managed Grafana for visualization. This service allows you to adhere to cloud native principles without the complexity of managing your own Prometheus environment.

When you configure your AKS or Azure Arc-enabled Kubernetes cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the [Azure Monitor agent]() is installed with a [metrics extension](container-insights-prometheus.md). This is the same agent used by Container insights, and you can enable Prometheus metrics as part of the Container insights onboarding process.

If you're not using Container insights, then see [Collect Prometheus metrics from an AKS cluster](../essentials/prometheus-metrics-enable.md) or [Collect Prometheus metrics from an Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md) for details on enabling Prometheus on its own.

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection and [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md) for customizing the configuration beyond defaults.

If you already have a Prometheus environment that you want

### Configure Container Insights

Container insights is a monitoring solution for AKS and Azure Arc-enabled Kubernetes clusters that provides performance visibility and diagnostics. It collects stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster and stores them in a Log Analytics workspace. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using the [Log Analytics query language](../logs/log-analytics-query-language.md).

When you enable Container Insights for your AKS cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/..//agents/log-analytics-agent.md) that sends data to Azure Monitor. For prerequisites and configuration options, see [Enable cost optimization settings in Container insights (preview)](container-insights-cost-config.md).

- Collect stdout/stderr logs from containers.
- Use Container insights workbooks

### Cost optimization


- You can reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Reduce costs for Azure Monitor Logs](../logs/cost-reduce-data.md) for details.
- [Enable the ContainerLogV2](container-insights-logging-v2.md) schema for improved query experience and reduce collection costs. 
- If your priority is cost, then configure ContainerLogV2 as basic logs.
- Use [Reduce costs for Azure Monitor Logs](../logs/cost-reduce-data.md) to remove collection of metrics since these are the same metrics being collection in Prometheus. In this case, you would use Grafana for visualization since the Container insights workbooks use data from the Log Analytics workspace. Container insights in this case would only be used for log collection.


### Collect control plane logs

The logs for AKS control plane components are implemented in Azure as [resource logs](..//essentials/resource-logs.md). Container Insights doesn't use these logs, so you need to create your own log queries to view and analyze them. For details on log structure and queries, see [How to query logs from Container Insights](container-insights-log-query.md#resource-logs).

You need to create a diagnostic setting to collect resource logs. You can create multiple diagnostic settings to send different sets of logs to different locations. To create diagnostic settings for your AKS cluster, see [Create diagnostic settings to send platform logs and metrics to different destinations](..//essentials/diagnostic-settings.md).

There's a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs. You can send logs to an Azure storage account to reduce costs if you need to retain the information. For a description of the categories that are available for AKS, see [Resource logs](../../aks/monitor-aks-reference.md#resource-logs). For details on the cost of ingesting and retaining log data, see [Azure Monitor Logs pricing details](..//logs/cost-logs.md).

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

## Access Azure Monitor features

Access Azure Monitor features for all AKS clusters in your subscription from the **Monitoring** menu in the Azure portal, or for a single AKS cluster from the **Monitor** section of the **Kubernetes services** menu. The following image shows the **Monitoring** menu for your AKS cluster:

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

## Monitor layers of Kubernetes

Your monitoring approach should be based on your unique workload requirements, and factors such as scale, topology, organizational roles, and multi-cluster tenancy. This section presents a common bottoms-up approach, starting from infrastructure up through applications. Each layer has distinct monitoring requirements, and different roles in your organization will focus on different layers.

:::image type="content" source="media/monitor-containers/layers.png" alt-text="Diagram of AKS layers" lightbox="media/monitor-containers/layers.png"  border="false":::


### Level 1 - Cluster level components

The cluster level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, disk and IP usage for each node and proactively monitor their usage trends before deploying any workloads. |

Use existing views and reports in Container Insights to monitor cluster level components.

- Use the **Cluster** view to see the performance of the nodes in your cluster, including CPU and memory utilization.
- Use the **Nodes** view to see the health of each node and the health and performance of the pods running on them. For more information on analyzing node health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md).
- Under **Reports**, use the **Node Monitoring** workbooks to analyze disk capacity, disk IO, and GPU usage. For more information about these workbooks, see [Node Monitoring workbooks](container-insights-reports.md#node-monitoring-workbooks).

    :::image type="content" source="media/monitor-containers/container-insights-cluster-view.png" alt-text="Container Insights cluster view" lightbox="media/monitor-containers/container-insights-cluster-view.png":::

- Under **Monitoring**, you can select **Workbooks**, then **Subnet IP Usage** to see the IP allocation and assignment on each node for a selected time-range.

    :::image type="content" source="media/monitor-containers/monitoring-workbooks-subnet-ip-usage.png" alt-text="Container Insights workbooks" lightbox="media/monitor-containers/monitoring-workbooks-subnet-ip-usage.png":::

For troubleshooting scenarios, you may need to access the AKS nodes directly for maintenance or immediate log collection. For security purposes, the AKS nodes aren't exposed to the internet but you can use the `kubectl debug` command to SSH to the AKS nodes. For more information on this process, see [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md).

### Level 2 - Managed AKS components

The managed AKS level includes the following components:

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server and identify any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitor Kubelet to help troubleshoot pod management issues, pods not starting, nodes not ready, or pods getting killed.  |

Azure Monitor and Container Insights don't provide full monitoring for the API server.

- Under **Monitoring**, you can select **Metrics** to view the **Inflight Requests** counter, but you should refer to metrics in Prometheus for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.
- To see critical metrics for the API server, see [Grafana Labs](https://grafana.com/grafana/dashboards/12006) to set up a dashboard on your existing Grafana server or set up a new Grafana server in Azure using [Monitor your Azure services in Grafana](..//visualize/grafana-plugin.md).

    :::image type="content" source="media/monitor-containers/grafana-api-server.png" alt-text="Grafana API server" lightbox="media/monitor-containers/grafana-api-server.png":::

- Under **Reports**, use the **Kubelet** workbook to see the health and performance of each kubelet. For more information about these workbooks, see [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks). For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).

### Resource logs

Use [log queries with resource logs](container-insights-log-query.md#resource-logs) to analyze control plane logs generated by AKS components.

### Level 3 - Kubernetes objects and workloads

The Kubernetes objects and workloads level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  |
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor resource utilization, including CPU and memory, of the containers running on your AKS cluster. |

Use existing views and reports in Container Insights to monitor containers and pods.

- Use the **Nodes** and **Controllers** views to see the health and performance of the pods running on them and drill down to the health and performance of their containers.
- Use the **Containers** view to see the health and performance for the containers. For more information on analyzing container health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md#analyze-nodes-controllers-and-container-health).

    :::image type="content" source="media/monitor-containers/container-insights-containers-view.png" alt-text="Container Insights containers view" lightbox="media/monitor-containers/container-insights-containers-view.png":::

- Under **Reports**, use the **Deployments** workbook to see deployment metrics. For more information, ee [Deployment & HPA metrics with Container Insights](container-insights-deployment-hpa-metrics.md).

    :::image type="content" source="media/monitor-containers/container-insights-deployments-workbook.png" alt-text="Container Insights deployments workbook" lightbox="media/monitor-containers/container-insights-deployments-workbook.png":::

#### Live data

In troubleshooting scenarios, Container Insights provides access to live AKS container logs (stdout/stderror), events and pod metrics. For more information about this feature, see [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md).

:::image type="content" source="media/monitor-containers/container-insights-live-data.png" alt-text="Container insights live data" lightbox="media/monitor-containers/container-insights-live-data.png":::

### Level 4 - Applications

The application level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Applications | Monitor microservice application deployments to identify application failures and latency issues, including information like request rates, response times, and exceptions. |

Application Insights provides complete monitoring of applications running on AKS and other environments. If you have a Java application, you can provide monitoring without instrumenting your code by following [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](..//app/kubernetes-codeless.md).

If you want complete monitoring, you should configure code-based monitoring depending on your application:

- [ASP.NET applications](..//app/asp-net.md)
- [ASP.NET Core applications](..//app/asp-net-core.md)
- [.NET Console applications](..//app/console.md)
- [Java](..//app/opentelemetry-enable.md?tabs=java)
- [Node.js](..//app/nodejs.md)
- [Python](..//app/opencensus-python.md)
- [Other platforms](..//app/app-insights-overview.md#supported-languages)

For more information, see [What is Application Insights?](..//app/app-insights-overview.md).

### Level 5 - External components

The components external to AKS include the following:

| Component | Monitoring requirements |
|:---|:---|
| Service Mesh, Ingress, Egress | Metrics based on component. |
| Database and work queues | Metrics based on component. |

Monitor external components such as Service Mesh, Ingress, Egress with Prometheus and Grafana, or other proprietary tools. Monitor databases and other Azure resources using other features of Azure Monitor.

[Network Observability add-on](https://techcommunity.microsoft.com/t5/azure-observability-blog/comprehensive-network-observability-for-aks-through-azure/ba-p/3825852)

## Analyze metric data with the Metrics explorer

Use the **Metrics** explorer to perform custom analysis of metric data collected for your containers. It allows you plot charts, visually correlate trends, and investigate spikes and dips in your metrics values. You can create metrics alert to proactively notify you when a metric value crosses a threshold and pin charts to dashboards for use by different members of your organization.

For more information, see [Getting started with Azure Metrics Explorer](..//essentials/metrics-getting-started.md). For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). When Container Insights is enabled for a cluster, [addition metric values](container-insights-update-metrics.md) are available.

:::image type="content" source="media/monitor-containers/metrics-explorer.png" alt-text="Metrics explorer" lightbox="media/monitor-containers/metrics-explorer.png":::

## Analyze log data with Log Analytics

Select **Logs** to use the Log Analytics tool to analyze resource logs or dig deeper into data used to create the views in Container Insights. Log Analytics allows you to perform custom analysis of your log data.

For more information on Log Analytics and to get started with it, see:

- [How to query logs from Container Insights](container-insights-log-query.md)
- [Using queries in Azure Monitor Log Analytics](..//logs/queries.md)
- [Monitoring AKS data reference logs](../../aks/monitor-aks-reference.md#azure-monitor-logs-tables)
- [Log Analytics tutorial](..//logs/log-analytics-tutorial.md)

You can also use log queries to analyze resource logs from AKS. For a list of the log categories available, see [AKS data reference resource logs](../../aks/monitor-aks-reference.md#resource-logs). You must create a diagnostic setting to collect each category as described in [Configure monitoring](#configure-monitoring) before the data can be collected.


## Monitor costs

The cluster administrator is responsible for the cost of the cluster. They need to answer questions such as whether the cluster is running efficiently and that the full capacity of its nodes is being used. It may be more efficient to have fewer large nodes as opposed to many smaller nodes.

Am I densely packing my workloads?  Prometheus and Grafana. CPU, memory, storage, etc. Set an alert if we go above/below capacity.

The cluster administrator may also be tasked with allocating the cost of the cluster to different teams based on their relative usage.


[OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility


## Alerts

[Alerts in Azure Monitor](..//alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. 

> [!IMPORTANT]
> Most alert rules have a cost dependent on the type of rule, how many dimensions it includes, and how frequently it runs. Refer to **Alert rules** in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before creating any alert rules.

### Recommended alerts
Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) 


### Can I use my own alerting?



### Choose an alert type

The most common types of alert rules in Azure Monitor are [metric alerts](..//alerts/alerts-metric.md) and [log query alerts](..//alerts/alerts-log-query.md). The type of alert rule that you create for a particular scenario will depend on where the data is located that you want to set an alert for.

You may have cases where data for a particular alerting scenario is available in both **Metrics** and **Logs**, and you need to determine which rule type to use. It's typically the best strategy to use metric alerts instead of log alerts when possible, because metric alerts are more responsive and stateful. You can create a metric alert on any values you can analyze in the Metrics explorer. If the logic for your alert rule requires data in **Logs**, or if it requires more complex logic, then you can use a log query alert rule.

For example, if you want an alert when an application workload is consuming excessive CPU, you can create a metric alert using the CPU metric. If you need an alert when a particular message is found in a control plane log, then you'll require a log alert.

### Metric alert rules

Metric alert rules use the same metric values as the Metrics explorer. In fact, you can create an alert rule directly from the metrics explorer with the data you're currently analyzing. You can use any of the values in [AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics) for metric alert rules.

Container Insights includes a feature that creates a recommended set of metric alert rules for your AKS cluster. This feature creates new metric values used by the alert rules that you can also use in the Metrics explorer. For more information, see [Recommended metric alerts (preview) from Container Insights](container-insights-metric-alerts.md).

### Log alert rules

Use log alert rules to generate an alert from the results of a log query. This may be data collected by Container Insights or from AKS resource logs. For more information, see [How to create log alerts from Container Insights](container-insights-log-alerts.md) and [How to query logs from Container Insights](container-insights-log-query.md).

### Virtual machine alerts

AKS relies on a Virtual Machine Scale Set that must be healthy to run AKS workloads. You can alert on critical metrics such as CPU, memory, and storage for the virtual machines using the guidance at [Monitor virtual machines with Azure Monitor: Alerts](..//vm/monitor-virtual-machine-alerts.md).

### Prometheus alerts

You can configure Prometheus alerts to cover scenarios where Azure Monitor either doesn't have the data required for an alerting condition or the alerting may not be responsive enough. For example, Azure Monitor doesn't collect critical information for the API server. You can create a log query alert using the data from the kube-apiserver resource log category, but it can take up to several minutes before you receive an alert, which may not be sufficient for your requirements. In this case, we recommend configuring Prometeus alerts.


## Personas

| Persona | Levels | Description |
|:---|:---|:---|
| Platform Engineer / Cluster admin | 1-3 | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| Developer | 4 | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| Network engineer | 5 | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

### Platform Engineer

#### Fleet Architect
The Fleet Architect is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. 

**How can I monitor overall patch status of the clusters?**
This information is available in the Activity log. 

``` kql
AzureActivity
| where CategoryValue == "Administrative"
| where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
| extend properties=parse_json(Properties_d) 
| where properties.message == "Upgrade Succeeded"
| order by TimeGenerated desc
```

**How can I monitor the health of multiple clusters?**
Use either workbooks in Container insights or dashboards in Grafana.

## Next steps

- For more information about AKS metrics, logs, and other important values, see [Monitoring AKS data reference](../../aks/monitor-aks-reference.md).


## Old stuff

AKS generates [platform metrics and resource logs](../../aks/monitor-aks-reference.md) that you can use to monitor basic health and performance. Enable [Container Insights](container-insights-overview.md) to expand on this monitoring. Container Insights is a feature in Azure Monitor that monitors the health and performance of managed Kubernetes clusters hosted on AKS and provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios.

AKS exposes many metrics in Prometheus format, which makes Prometheus a popular choice for monitoring. [Container Insights](container-insights-overview.md) has native integration with AKS, like collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks. It also collects certain Prometheus metrics. Many native Azure Monitor insights are built on top of Prometheus metrics. Container Insights complements and completes E2E monitoring of AKS, including log collection, which Prometheus as stand-alone tool doesn’t provide. You can use Prometheus integration and Azure Monitor together for E2E monitoring.

To learn more about using Container Insights, see the [Container Insights overview](container-insights-overview.md). To learn more about features and monitoring scenarios of Container Insights, see [Monitor layers of AKS with Container Insights](#monitor-layers-of-aks-with-container-insights).