---
title: Configure Kubernetes monitoring using Azure services
description: Describes how to configure monitoring in Azure for the health and performance of Kubernetes clusters and their workloads.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Configure Kubernetes monitoring using Azure services

This article describes how to configure monitoring of the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

## Azure services

Azure has a complete set of services for monitoring the different layers of your Kubernetes infrastructure and the applications that depend on it as described in the following table. These services work in conjunction with each other to provide a complete monitoring solution, or you may integrate them with your existing monitoring tools.

Your choice of monitoring tools will depend on the requirements of your particular environment in addition to any existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/). Azure includes managed versions of the most standard tools and features that help you integrate your kubernetes clusters and workloads.

| Service | Description |
|:---|:---|
| [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) | Fully managed implementation of [Prometheus](https://prometheus.io), which is a cloud-native metrics solution from the Cloud Native Compute Foundation and the most common tool used for collecting and analyzing metric data from Kubernetes clusters. Azure Monitor managed service for Prometheus is compatible with the Prometheus query language (PromQL) and Prometheus alerts in addition to integration with Azure Managed Grafana for visualization. This service supports your investment in open source tools without the complexity of managing your own Prometheus environment. | 
| [Container Insights](container-insights-overview.md) | Azure service for AKS and Azure Arc-enabled Kubernetes clusters that uses a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) to collect stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using [Log Analytics](../logs/log-analytics-overview.md). |
| [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) | Allows you to attach to Kubernetes clusters running in other clouds so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools, including Container insights. |
| [Azure Managed Grafana](../../managed-grafana/overview.md) | Fully managed implementation of [Grafana](https://grafana.com/), which is an open-source data visualization platform commonly used to present Prometheus data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes and full-stack troubleshooting.  |
| [Application insights](../app/app-insights-overview.md) |  Feature of Azure Monitor that provides application performance monitoring (APM) to monitor applications running on your Kubernetes cluster from development, through test, and into production. Quickly identify and mitigate latency and reliability issues using distributed traces. Supports [OpenTelemetry](../app/opentelemetry-overview.md#opentelemetry) for vendor-neutral instrumentation. |
| [Network Watcher](../network-watcher/network-watcher-monitoring-overview..md) | Suite of tools in Azure to monitor the virtual networks used by your Kubernetes clusters and diagnose detected issues. |
| [Network insights](../../network-watcher/network-insights-overview.md) | Feature of Azure Monitor that includes a visual representation of the performance and health of different network components and provides access to the network monitoring tools that are part of Network Watcher. |


## Requied workspaces
You require the following workspaces to support the different monitoring services. You may already have workspaces that you can use instead of creating new ones. There's no cost for the workspaces, but you do incur ingestion and retention costs when you collect data. See [Azure Monitor Logs pricing details](../logs/cost-logs.md) for details.

- [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) to support Azure Monitor managed service for Prometheus.   For information on design considerations for a workspace configuration, see [Azure Monitor workspace architecture](../essentials/azure-monitor-workspace-overview.md#azure-monitor-workspace-architecture).
- [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) to support Container insights and control plane logs. For information on design considerations for a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/workspace-design.md).



## Enable scraping of Prometheus metrics

Enable scraping of Prometheus metrics by Azure Monitor managed service for Prometheus from your cluster using one of the following methods:

- Select the option **Enable Prometheus metrics** when you [create an AKS cluster](../../aks/learn/quick-kubernetes-deploy-portal.md).
- Select the option **Enable Prometheus metrics** when you enable Container insights on an existing [AKS cluster](container-insights-enable-aks.md?tabs=portal-azure-monitor) or [Azure Arc-enabled Kubernetes cluster](container-insights-enable-arc-enabled-clusters.md).
- Enable for an existing [AKS cluster](../essentials/prometheus-metrics-enable.md) or [Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md).


If you already have a Prometheus environment that you want to use for your AKS clusters, then enable Azure Monitor managed service for Prometheus and then use remote-write to send data to your existing Prometheus environment. You can also [use remote-write to send data from your existing self-managed Prometheus environment to Azure Monitor managed service for Prometheus](../essentials/prometheus-remote-write.md). 

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection. If you want to customize the configuration, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md).


## Enable Grafana 

If you have an existing Grafana environment, then you can continue to use it. In this case add, Azure Monitor managed service for Prometheus as a data source. You can [add the Azure Monitor data source to Grafana](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) to use data collected by Container insights in custom Grafana dashboards.

See [Create an Azure Managed Grafana instance using the Azure portal](../../managed-grafana/quickstart-managed-grafana-portal.md) for details on creating an Azure Managed Grafana instance. Once your Grafana instance is created, [link it to your Azure Monitor workspace](../essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace) so that you can use your Prometheus data as a data source. You can manually perform this configuration using [add Azure Monitor managed service for Prometheus as data source](../essentials/prometheus-grafana.md) If you have an existing Grafana environment, then configure appropriate Prometheus environment as a data source using guidance at [Prometheus data source](https://grafana.com/docs/grafana/latest/datasources/prometheus).


[Search the available Grafana dashboards templates](https://grafana.com/grafana/dashboards/?search=kubernetes) to identify dashboards for monitoring Kubernetes and then  [import into Grafana](../../managed-grafana/how-to-create-dashboard.md).


## Enable Container Insights

When you enable Container Insights for your Kubernetes cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/..//agents/log-analytics-agent.md) that sends data to a Log Analytics workspace in Azure Monitor. For prerequisites and configuration options, see [Enable Container insights](../containers/container-insights-onboard.md).

Once Container insights is enabled for a cluster, perform the following actions to optimize your installation.

- To improve your query experience with data collected by Container insights and to reduce collection costs, [enable the ContainerLogV2 schema](container-insights-logging-v2.md) for each cluster. If you only use logs for occasional troubleshooting, then consider configuring this table as [basic logs](../logs/basic-logs-configure.md).
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) for details.


## Collect control plane logs for AKS clusters

The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container Insights doesn't use these logs, so you need to create your own log queries to view and analyze them. For details on log structure and queries, see [How to query logs from Container Insights](container-insights-log-query.md#resource-logs).

[Create diagnostic setting](../essentials/diagnostic-settings.md) for each AKS cluster to send resource logs to a Log Analytics workspace. For a description of the categories that are available for AKS, see [Resource logs](../../aks/monitor-aks-reference.md#resource-logs). 

There's a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs. You can send logs to an Azure storage account to reduce costs if you need to retain the information. For details on the cost of ingesting and retaining log data, see [Azure Monitor Logs pricing details](..//logs/cost-logs.md).

If you're unsure which resource logs to initially enable, use the following recommendations, which are based on the most common customer requirements. You can enable other categories later if you need to.

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


If you have an existing solution for collection of logs, either follow the guidance for that tool or enable Container insights and use the [data export feature of Log Analytics workspace](../logs/logs-data-export.md) to send data to Azure event hub to forward to alternate system.

## Collect Activity log for AKS clusters
Configuration changes to your AKS clusters are stored in the [Activity log](../essentials/activity-log.md). [Send this data to your Log Analytics workspace](../essentials/activity-log.md#send-to-log-analytics-workspace) to analyze it with other monitoring data.  There's no cost for this data collection, and you can analyze or alert on the data using Log Analytics.

## Enable Application insights to monitor your application

See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from the application running ion your cluster and decision criteria on the best method for your particular requirements. Once you have your application instrumented, create an [Availability test](../app/availability-overview.md) to create a recurring test to monitor its availability and responsiveness.


## Configure network monitoring

[Network insights](../../network-watcher/network-insights-overview.md) is enabled by default and requires no configuration. Network Watcher is also typically [enabled by default in each Azure region](../../network-watcher/network-watcher-create.md). 

Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups used by your cluster and then use [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights on this data. You'll most likely use the same Log Analytics workspace for traffic analytics that you use for Container insights and your control plane logs.


## Security monitoring

Azure Monitor was designed to monitor the availability and performance of cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring for AKS is done with [Microsoft Sentinel](../../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). See [Monitor virtual machines with Azure Monitor - Security monitoring](..//vm/monitor-virtual-machine-security.md) for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.

For information on using the security services to monitor AKS, see [Microsoft Defender for Kubernetes - the benefits and features](../../defender-for-cloud/defender-for-kubernetes-introduction.md) and  [Connect Azure Kubernetes Service (AKS) diagnostics logs to Microsoft Sentinel](../../sentinel/data-connectors/azure-kubernetes-service-aks.md).


## Next steps

- See [Monitor Kubernetes clusters with Azure services](monitor-kubernetes-analyze.md) for details on how to use the tools described in this article to monitor your Kubernetes clusters.

