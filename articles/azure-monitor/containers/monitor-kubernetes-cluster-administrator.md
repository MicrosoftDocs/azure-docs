---
title: Monitor Kubernetes environment - cluster administrator
description: Monitor Kubernetes environment - cluster administrator
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes environment - cluster administrator

The cluster administrator, also known as the platform engineer, is responsible for the Kubernetes cluster. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot any detected issues. They also need to understand the cost of the cluster and its components, and potentially to be able to allocate costs to different teams.

Large organizations may also have a fleet architect, which is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. At scale recommendations for the fleet architect are included in the recommended solutions below.


## Azure services

The primary tools used by the cluster administrator are Container insights, Prometheus, and Grafana. Depending on their particular environment, you may be using the managed offerings in Azure for Prometheus and Grafana or may be using a separate environment. Your organization may also be using alternative tools to Container insights for monitoring and logging. 


| Service | Description |
|:---|:---|
| [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) | Fully managed implementation of [Prometheus](https://prometheus.io), which is a cloud-native metrics solution from the Cloud Native Compute Foundation and the most common tool used for collecting and analyzing metric data from Kubernetes clusters. Azure Monitor managed service for Prometheus is compatible with the Prometheus query language (PromQL) and Prometheus alerts in addition to integration with Azure Managed Grafana for visualization. This service supports your investment in open source tools without the complexity of managing your own Prometheus environment. | 
| [Container Insights](container-insights-overview.md) | Azure service for AKS and Azure Arc-enabled Kubernetes clusters that uses a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) to collect stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using [Log Analytics](../logs/log-analytics-overview.md). |
| [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) | Allows you to attach to Kubernetes clusters running in other clouds so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools, including Container insights. |
| [Azure Managed Grafana](../../managed-grafana/overview.md) | Fully managed implementation of [Grafana](https://grafana.com/), which is an open-source data visualization platform commonly used to present Prometheus data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes and full-stack troubleshooting.  |
| [OpenCost](https://www.opencost.io/docs/azure-opencost) | Open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to [customer-specific Azure pricing](https://www.opencost.io/docs/azure-prices) to Azure storage |

## Using non-Azure services

Azure provides a complete set of services for collecting and analyzing your Kubernetes logs. Container insights collects container stdout, stderr, and infrastructure logs, while you can create diagnostic settings to collect control plan logs for AKS. All logs are stored in a Log Analytics workspace where they can be analyzed using [Kusto Query Language (KQL)]() or visualized in [managed Grafana](). If you have an existing investment in another tool to collect and analyze Kubernetes logs, such as Splunk or Datadog, then follow the guidance for configuration of those tools. You can also use the [Data Export feature of Log Analytics workspace]() to send AKS logs to Event Hub and forward to alternate system. 

## Configuration

### Enable scraping of Prometheus metrics

Enable scraping of Prometheus metrics by Azure Monitor managed service for Prometheus from your cluster using one of the following methods:

- Select the option **Enable Prometheus metrics** when you [create an AKS cluster](../../aks/learn/quick-kubernetes-deploy-portal.md).
- Select the option **Enable Prometheus metrics** when you enable Container insights on an existing [AKS cluster](container-insights-enable-aks.md?tabs=portal-azure-monitor) or [Azure Arc-enabled Kubernetes cluster](container-insights-enable-arc-enabled-clusters.md).
- Enable for an existing [AKS cluster](../essentials/prometheus-metrics-enable.md) or [Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md).


If you already have a Prometheus environment that you want to use for your AKS clusters, then enable Azure Monitor managed service for Prometheus and then use remote-write to send data to your existing Prometheus environment. You can also [use remote-write to send data from your existing self-managed Prometheus environment to Azure Monitor managed service for Prometheus](../essentials/prometheus-remote-write.md). 

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection. If you want to customize the configuration, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md).


### Enable Grafana 

If you have an existing Grafana environment, then you can continue to use it. In this case add, Azure Monitor managed service for Prometheus as a data source. You can [add the Azure Monitor data source to Grafana](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) to use data collected by Container insights in custom Grafana dashboards.

See [Create an Azure Managed Grafana instance using the Azure portal](../../managed-grafana/quickstart-managed-grafana-portal.md) for details on creating an Azure Managed Grafana instance. Once your Grafana instance is created, [link it to your Azure Monitor workspace](../essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace) so that you can use your Prometheus data as a data source. You can manually perform this configuration using [add Azure Monitor managed service for Prometheus as data source](../essentials/prometheus-grafana.md) If you have an existing Grafana environment, then configure appropriate Prometheus environment as a data source using guidance at [Prometheus data source](https://grafana.com/docs/grafana/latest/datasources/prometheus).


[Search the available Grafana dashboards templates](https://grafana.com/grafana/dashboards/?search=kubernetes) to identify dashboards for monitoring Kubernetes and then  [import into Grafana](../../managed-grafana/how-to-create-dashboard.md).


### Enable Container Insights

When you enable Container Insights for your Kubernetes cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/..//agents/log-analytics-agent.md) that sends data to a Log Analytics workspace in Azure Monitor. For prerequisites and configuration options, see [Enable Container insights](../containers/container-insights-onboard.md).

Once Container insights is enabled for a cluster, perform the following actions to optimize your installation.

- To improve your query experience with data collected by Container insights and to reduce collection costs, [enable the ContainerLogV2 schema](container-insights-logging-v2.md) for each cluster. If you only use logs for occasional troubleshooting, then consider configuring this table as [basic logs](../logs/basic-logs-configure.md).
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) for details.

### Collect control plane logs for AKS clusters

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


### OpenCost

Monitoring a complex environment such as Kubernetes involves collecting a significant amount of telemetry, much of which incurs a cost. The cluster administrator should collect the just enough data to meet their requirements and no more. This includes the amount of data collected, the frequency of collection, and the retention period. The following sections on configuring monitoring tools provide guidance on how to configuring each to minimize your costs.

You may be tasked with allocating the cost of the cluster to different teams based on their relative usage, requiring appropriate breakdowns of relative usage. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an  that the administrator can use for this requirement.

The cluster administrator is also responsible for keeping costs to a minimum during regular operation of the cluster and its larger ecosystem. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the cluster administrator can use for these decisions.

### Collect Activity log for AKS clusters
Configuration changes to your AKS clusters are stored in the [Activity log](../essentials/activity-log.md). [Send this data to your Log Analytics workspace](../essentials/activity-log.md#send-to-log-analytics-workspace) to analyze it with other monitoring data.  There's no cost for this data collection, and you can analyze or alert on the data using Log Analytics.


## Level 1 - Cluster level components

The cluster level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, disk and IP usage for each node and proactively monitor their usage trends before deploying any workloads. |

- Use the **Cluster** view to see the performance of the nodes in your cluster, including CPU and memory utilization.
- Use the **Nodes** view to see the health of each node and the health and performance of the pods running on them. For more information on analyzing node health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md).
- Under **Reports**, use the **Node Monitoring** workbooks to analyze disk capacity, disk IO, and GPU usage. For more information about these workbooks, see [Node Monitoring workbooks](container-insights-reports.md#node-monitoring-workbooks).
- Under **Monitoring**, you can select **Workbooks**, then **Subnet IP Usage** to see the IP allocation and assignment on each node for a selected time-range.

Ensure that the cluster is using the full capacity of its nodes by densely packing workloads, using fewer large nodes as opposed to many smaller nodes. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the cluster administrator can use for these decisions.

For troubleshooting scenarios, you may need to access nodes directly for maintenance or immediate log collection. For security purposes, AKS nodes aren't exposed to the internet but you can use the `kubectl debug` command to SSH to the AKS nodes. For more information on this process, see [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md).

## Level 2 - Managed AKS components

The managed AKS level includes the following components:

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server and identify any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitor Kubelet to help troubleshoot pod management issues, pods not starting, nodes not ready, or pods getting killed.  |


- Under **Monitoring**, select **Metrics** to view the **Inflight Requests** counter.
- Under **Reports**, use the **Kubelet** workbook to see the health and performance of each kubelet. For more information about these workbooks, see [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks). 
- [Kubernetes apiserver](https://grafana.com/grafana/dashboards/12006) for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.
- Use [log queries with resource logs](container-insights-log-query.md#resource-logs) to analyze control plane logs generated by AKS components.
- For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).


## Level 3 - Kubernetes objects and workloads

The Kubernetes objects and workloads level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  |
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor resource utilization, including CPU and memory, of the containers running on your AKS cluster. |

- Use the **Nodes** and **Controllers** views to see the health and performance of the pods running on them and drill down to the health and performance of their containers.
- Use the **Containers** view to see the health and performance for the containers. For more information on analyzing container health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md#analyze-nodes-controllers-and-container-health).
- Under **Reports**, use the **Deployments** workbook to see deployment metrics. For more information, ee [Deployment & HPA metrics with Container Insights](container-insights-deployment-hpa-metrics.md).

 
### Live data

- In troubleshooting scenarios, Container Insights provides access to live AKS container logs (stdout/stderror), events and pod metrics. For more information about this feature, see [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md).


## Alerts

[Alerts in Azure Monitor](..//alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. 

Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. 


The following table describes the different types of custom alert rules that you can create based on the data collected by the services described in [Configure Kubernetes monitoring using Azure services](monitor-kubernetes-configure.md)

| Alert type | Description |
|:---|:---|
| Prometheus alerts | [Prometheus alerts](../alerts/prometheus-alerts.md) are written in Prometheus Query Language (Prom QL) and applied on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). Recommended alerts already include the most common Prometheus alerts, but you can [create addition alert rules](../essentials/prometheus-rule-groups.md) as required. |
| Metric alert rules | Metric alert rules use the same metric values as the Metrics explorer. In fact, you can create an alert rule directly from the metrics explorer with the data you're currently analyzing. Metric alert rules can be useful to alert on AKS performance using any of the values in [AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). |
| Log alert rules | Use log alert rules to generate an alert from the results of a log query. For more information, see [How to create log alerts from Container Insights](container-insights-log-alerts.md) and [How to query logs from Container Insights](container-insights-log-query.md). |



### Additional scenarios

**How can I monitor if my cluster upgrade was successful?**

- Any configuration activities for AKS are logged in the Activity log. When you [send the Activity log to a Log Analytics workspace]() you can analyze it with Log Analytics. The following sample query can be used to return records identifying a successful upgrade across all your AKS clusters. 

    ``` kql
    AzureActivity
    | where CategoryValue == "Administrative"
    | where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
    | extend properties=parse_json(Properties_d) 
    | where properties.message == "Upgrade Succeeded"
    | order by TimeGenerated desc
    ```

**How do I monitor attached storage?**

- Use the [Disk Capacity and Disk IO workbooks](container-insights-reports.md#node-monitoring-workbooks) in Container insights to view health and performance of disks attached to each node in your cluster.
- Use Grafana dashboards with [Prometheus metric values](../essentials/prometheus-metrics-scrape-default.md) related to disk such as `node_disk_io_time_seconds_total` and `windows_logical_disk_free_bytes`.
- Use [Storage insights](../../storage/common/storage-insights-overview.md) in Azure Monitor to monitor the performance, capacity, and availability of your Azure storage resources. Configure [metric alerts](../alerts/alerts-metric-logs.md) and [service health notifications](../../service-health/alerts-activity-log-service-notifications-portal.md) to set up automated alerting to proactively detect issues.

**How do I monitor and observe access between services in the cluster (east-west traffic)?**

- For AKS clusters, see the new [Network Observability add-on for AKS](https://techcommunity.microsoft.com/t5/azure-observability-blog/comprehensive-network-observability-for-aks-through-azure/ba-p/3825852) which provides observability across the multiple layers in the Kubernetes networking stack.

**Do I have to use Azure alerting or can I bring my own?**

- [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) supports [Prometheus alerting rules](../essentials/prometheus-rule-groups.md), so you can use any existing Prometheus alerts you might be using.
- If you have an existing [ITSM solution](../alerts/itsmc-overview.md), you can [integrate it with Azure Monitor](../alerts/itsmc-overview.md).
- Use [workspace data export](../logs/logs-data-export.md) to send data sent to the Log Analytics workspace to another location that supports your current alerting solution.

**Which images are currently used inside the cluster?**

- Use the **Image inventory** log query that retrieves data from the [ContainerImageInventory](/azure/azure-monitor/reference/tables/containerimageinventory) table populated by Container insights.

## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).

