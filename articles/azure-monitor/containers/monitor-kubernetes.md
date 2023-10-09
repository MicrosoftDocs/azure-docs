---
title: Monitor Kubernetes clusters using Azure services and cloud native tools
description: Describes how to monitor the health and performance of the different layers of your Kubernetes environment using Azure Monitor and cloud native services in Azure.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/14/2023
---

# Monitor Kubernetes clusters using Azure services and cloud native tools

This article describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure and cloud native services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). Different sets of guidance are provided for the different roles that typically manage unique components that make up a Kubernetes environment. 


> [!IMPORTANT]
> This article provides complete guidance on monitoring the different layers of your Kubernetes environment based on Azure Kubernetes Service (AKS) or Kubernetes clusters in other clouds. If you're just getting started with AKS or Azure Monitor, see [Monitoring AKS](../../aks/monitor-aks.md) for basic information for getting started monitoring an AKS cluster.

## Layers and roles of Kubernetes environment

Following is an illustration of a common model of a typical Kubernetes environment, starting from the infrastructure layer up through applications. Each layer has distinct monitoring requirements that are addressed by different services and typically managed by different roles in the organization.

:::image type="content" source="media/monitor-kubernetes/layers-with-roles.png" alt-text="Diagram of layers of Kubernetes environment with related administrative roles." lightbox="media/monitor-kubernetes/layers-with-roles.png"  border="false":::

Responsibility for the different layers of a Kubernetes environment and the applications that depend on it are typically addressed by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide the monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Developer](#developer) | Develop and maintaining the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Platform engineer](#platform-engineer) | Responsible for the Kubernetes cluster. Provisions and maintains the platform used by developer. |
| [Network engineer](#network-engineer) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Selection of monitoring tools

Azure provides a complete set of services based on [Azure Monitor](../overview.md) for monitoring the health and performance of different layers of your Kubernetes infrastructure and the applications that depend on it. These services work in conjunction with each other to provide a complete monitoring solution and are recommended both for [AKS](../../aks/intro-kubernetes.md) and your Kubernetes clusters running in other clouds. You may have an existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/), in which case you may choose to integrate Azure tools into your existing environment. 

Your choice of which tools to deploy and their configuration will depend on the requirements of your particular environment. For example, you may use the managed offerings in Azure for Prometheus and Grafana, or you may choose to use your existing installation of these tools with your Kubernetes clusters in Azure. Your organization may also use alternative tools to Container insights to collect and analyze Kubernetes logs, such as Splunk or Datadog.

> [!IMPORTANT]
> Monitoring a complex environment such as Kubernetes involves collecting a significant amount of telemetry, much of which incurs a cost. You should collect just enough data to meet your requirements. This includes the amount of data collected, the frequency of collection, and the retention period. If you're  very cost conscious, you may choose to implement a subset of the full functionality in order to reduce your monitoring spend.

## Network engineer
The *Network Engineer* is responsible for traffic between workloads and any ingress/egress with the cluster. They analyze network traffic and perform threat analysis.

:::image type="content" source="media/monitor-kubernetes/layers-network-engineer.png" alt-text="Diagram of layers of Kubernetes environment for network engineer." lightbox="media/monitor-kubernetes/layers-network-engineer.png"  border="false":::

### Azure services for network administrator

The following table lists the services that are commonly used by the network engineer to monitor the health and performance of the network supporting the Kubernetes cluster.  


| Service | Description |
|:---|:---|
| [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) | Suite of tools in Azure to monitor the virtual networks used by your Kubernetes clusters and diagnose detected issues. |
| [Traffic analytics](../../network-watcher/traffic-analytics.md) | Feature of Network Watcher that analyzes flow logs to provide insights into traffic flow. | 
| [Network insights](../../network-watcher/network-insights-overview.md) | Feature of Azure Monitor that includes a visual representation of the performance and health of different network components and provides access to the network monitoring tools that are part of Network Watcher. |

[Network insights](../../network-watcher/network-insights-overview.md) is enabled by default and requires no configuration. Network Watcher is also typically [enabled by default in each Azure region](../../network-watcher/network-watcher-create.md). 

### Monitor level 1 - Network

Following are common scenarios for monitoring the network.

- Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups used by your cluster and then use [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights on this data. You'll most likely use the same Log Analytics workspace for traffic analytics that you use for Container insights and your control plane logs.
- Using [traffic analytics](../../network-watcher/traffic-analytics.md), you can determine if any traffic is flowing either to or from any unexpected ports used by the cluster and also if any traffic is flowing over public IPs that shouldn't be exposed. Use this information to determine whether your network rules need modification.
- For AKS clusters, use the [Network Observability add-on for AKS (preview)](https://aka.ms/NetObsAddonDoc) to monitor and observe access between services in the cluster (east-west traffic).


## Platform engineer

The *platform engineer*, also known as the cluster administrator, is responsible for the Kubernetes cluster itself. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot any detected issues. They also need to understand the cost to operate the cluster and potentially to be able to allocate costs to different teams.

:::image type="content" source="media/monitor-kubernetes/layers-platform-engineer.png" alt-text="Diagram of layers of Kubernetes environment for platform engineer." lightbox="media/monitor-kubernetes/layers-platform-engineer.png"  border="false":::


Large organizations may also have a *fleet architect*, which is similar to the platform engineer but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. At scale recommendations are included in the guidance below. See [What is Azure Kubernetes Fleet Manager (preview)?](../../kubernetes-fleet/overview.md) for details on creating a Fleet resource for multi-cluster and at-scale scenarios.


### Azure services for platform engineer

The following table lists the Azure services for the platform engineer to monitor the health and performance of the Kubernetes cluster and its components. 

| Service | Description |
|:---|:---|
| [Container Insights](container-insights-overview.md) | Azure service for AKS and Azure Arc-enabled Kubernetes clusters that use a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) to collect stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using [Log Analytics](../logs/log-analytics-overview.md). |
| [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) | [Prometheus](https://prometheus.io) is a cloud-native metrics solution from the Cloud Native Compute Foundation and the most common tool used for collecting and analyzing metric data from Kubernetes clusters. Azure Monitor managed service for Prometheus is a fully managed solution that's compatible with the Prometheus query language (PromQL) and Prometheus alerts and integrates with Azure Managed Grafana for visualization. This service supports your investment in open source tools without the complexity of managing your own Prometheus environment. | 
| [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) | Allows you to attach to Kubernetes clusters running in other clouds so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools, including Container insights and Prometheus. |
| [Azure Managed Grafana](../../managed-grafana/overview.md) | Fully managed implementation of [Grafana](https://grafana.com/), which is an open-source data visualization platform commonly used to present Prometheus and other data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes and full-stack troubleshooting.  |

### Configure monitoring for platform engineer

The sections below identify the steps for complete monitoring of your Kubernetes environment using the Azure services in the above table. Functionality and integration options are provided for each to help you determine where you may need to modify this configuration to meet your particular requirements.


#### Enable scraping of Prometheus metrics

> [!IMPORTANT]
>  To use Azure Monitor managed service for Prometheus, you need to have an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md). For information on design considerations for a workspace configuration, see [Azure Monitor workspace architecture](../essentials/azure-monitor-workspace-overview.md#azure-monitor-workspace-architecture).

Enable scraping of Prometheus metrics by Azure Monitor managed service for Prometheus from your cluster using one of the following methods:

- Select the option **Enable Prometheus metrics** when you [create an AKS cluster](../../aks/learn/quick-kubernetes-deploy-portal.md).
- Select the option **Enable Prometheus metrics** when you enable Container insights on an existing [AKS cluster](container-insights-enable-aks.md) or [Azure Arc-enabled Kubernetes cluster](container-insights-enable-arc-enabled-clusters.md).
- Enable for an existing [AKS cluster](../essentials/prometheus-metrics-enable.md) or [Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md).


If you already have a Prometheus environment that you want to use for your AKS clusters, then enable Azure Monitor managed service for Prometheus and then use remote-write to send data to your existing Prometheus environment. You can also [use remote-write to send data from your existing self-managed Prometheus environment to Azure Monitor managed service for Prometheus](../essentials/prometheus-remote-write.md). 

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection. If you want to customize the configuration, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md).


#### Enable Grafana for analysis of Prometheus data

[Create an instance of Managed Grafana](../../managed-grafana/quickstart-managed-grafana-portal.md) and [link it to your Azure Monitor workspace](../essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace) so that you can use your Prometheus data as a data source. You can also manually perform this configuration using [add Azure Monitor managed service for Prometheus as data source](../essentials/prometheus-grafana.md). A variety of [prebuilt dashboards](../visualize/grafana-plugin.md#use-out-of-the-box-dashboards) are available for monitoring Kubernetes clusters including several that present similar information as Container insights views. 

If you have an existing Grafana environment, then you can continue to use it and add Azure Monitor managed service for [Prometheus as a data source](https://grafana.com/docs/grafana/latest/datasources/prometheus/). You can also [add the Azure Monitor data source to Grafana](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) to use data collected by Container insights in custom Grafana dashboards. Perform this configuration if you want to focus on Grafana dashboards rather than using the Container insights views and reports.



#### Enable Container Insights for collection of logs

When you enable Container Insights for your Kubernetes cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/log-analytics-agent.md) that sends data to a Log Analytics workspace in Azure Monitor. Container insights collects container stdout/stderr, infrastructure logs, and performance data. All log data is stored in a Log Analytics workspace where they can be analyzed using [Kusto Query Language (KQL)](../logs/log-query-overview.md).

See [Enable Container insights](../containers/container-insights-onboard.md) for prerequisites and configuration options for onboarding your Kubernetes clusters. [Onboard using Azure Policy](container-insights-enable-aks-policy.md) to ensure that all clusters retain a consistent configuration. 

Once Container insights is enabled for a cluster, perform the following actions to optimize your installation.

- Container insights collects many of the same metric values as [Prometheus](#enable-scraping-of-prometheus-metrics). You can disable collection of these metrics by configuring Container insights to only collect **Logs and events** as described in [Enable cost optimization settings in Container insights](../containers/container-insights-cost-config.md#custom-data-collection). This configuration disables the Container insights experience in the Azure portal, but you can use Grafana to visualize Prometheus metrics and Log Analytics to analyze log data collected by Container insights.
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. 
- To improve your query experience with data collected by Container insights and to reduce collection costs, [enable the ContainerLogV2 schema](container-insights-logging-v2.md) for each cluster. If you only use logs for occasional troubleshooting, then consider configuring this table as [basic logs](../logs/basic-logs-configure.md).

If you have an existing solution for collection of logs, then follow the guidance for that tool or enable Container insights and use the [data export feature of Log Analytics workspace](../logs/logs-data-export.md) to send data to [Azure Event Hubs](../../event-hubs/event-hubs-about.md) to forward to alternate system.


#### Collect control plane logs for AKS clusters

The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container Insights doesn't use these logs, so you need to create your own log queries to view and analyze them. For details on log structure and queries, see [How to query logs from Container Insights](../../aks/monitor-aks.md#resource-logs).

[Create a diagnostic setting](../../aks/monitor-aks.md#resource-logs) for each AKS cluster to send resource logs to a Log Analytics workspace. Use [Azure Policy](../essentials/diagnostic-settings-policy.md) to ensure consistent configuration across multiple clusters.

There's a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. For a description of the categories that are available for AKS, see [Resource logs](../../aks/monitor-aks-reference.md#resource-logs).  Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs. You can send logs to an Azure storage account to reduce costs if you need to retain the information for compliance reasons. For details on the cost of ingesting and retaining log data, see [Azure Monitor Logs pricing details](../logs/cost-logs.md).

If you're unsure which resource logs to initially enable, use the following recommendations, which are based on the most common customer requirements. You can enable other categories later if you need to.


| Category | Enable? | Destination |
|:---|:---|:---|
| kube-apiserver          | Enable | Log Analytics workspace |
| kube-audit              | Enable | Azure storage. This keeps costs to a minimum yet retains the audit logs if they're required by an auditor. |
| kube-audit-admin        | Enable | Log Analytics workspace |
| kube-controller-manager | Enable | Log Analytics workspace |
| kube-scheduler          | Disable | |
| cluster-autoscaler      | Enable if autoscale is enabled | Log Analytics workspace |
| guard                   | Enable if Azure Active Directory is enabled | Log Analytics workspace |
| AllMetrics              | Disable since metrics are collected in Managed Prometheus | Log Analytics workspace |


If you have an existing solution for collection of logs, either follow the guidance for that tool or enable Container insights and use the [data export feature of Log Analytics workspace](../logs/logs-data-export.md) to send data to Azure event hub to forward to alternate system.

#### Collect Activity log for AKS clusters
Configuration changes to your AKS clusters are stored in the [Activity log](../essentials/activity-log.md). [Create a diagnostic setting to send this data to your Log Analytics workspace](../essentials/activity-log.md#send-to-log-analytics-workspace) to analyze it with other monitoring data.  There's no cost for this data collection, and you can analyze or alert on the data using Log Analytics.


### Monitor level 2 - Cluster level components

The cluster level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, disk and IP usage for each node and proactively monitor their usage trends before deploying any workloads. |

Following are common scenarios for monitoring the cluster level components.

**Container insights**<br>
- Use the **Cluster** view to see the performance of the nodes in your cluster, including CPU and memory utilization.
- Use the **Nodes** view to see the health of each node and the health and performance of the pods running on them. For more information on analyzing node health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md).
- Under **Reports**, use the **Node Monitoring** workbooks to analyze disk capacity, disk IO, and GPU usage. For more information about these workbooks, see [Node Monitoring workbooks](container-insights-reports.md#node-monitoring-workbooks).
- Under **Monitoring**, select **Workbooks**, then **Subnet IP Usage** to see the IP allocation and assignment on each node for a selected time-range.

**Grafana dashboards**<br>
- Use the [prebuilt dashboard](../visualize/grafana-plugin.md#use-out-of-the-box-dashboards) in Managed Grafana for **Kubelet** to see the health and performance of each.
- Use Grafana dashboards with [Prometheus metric values](../essentials/prometheus-metrics-scrape-default.md) related to disk such as `node_disk_io_time_seconds_total` and `windows_logical_disk_free_bytes` to monitor attached storage.
- Multiple [Kubernetes dashboards](https://grafana.com/grafana/dashboards/?search=kubernetes) are available that visualize the performance and health of your nodes based on data stored in Prometheus.

**Log Analytics**
- Select the [Containers category](../logs/queries.md?tabs=groupby#find-and-filter-queries) in the [queries dialog](../logs/queries.md#queries-dialog) for your Log Analytics workspace to access prebuilt log queries for your cluster, including the **Image inventory** log query that retrieves data from the [ContainerImageInventory](/azure/azure-monitor/reference/tables/containerimageinventory) table populated by Container insights.

**Troubleshooting**<br>
- For troubleshooting scenarios, you may need to access nodes directly for maintenance or immediate log collection. For security purposes, AKS nodes aren't exposed to the internet but you can use the `kubectl debug` command to SSH to the AKS nodes. For more information on this process, see [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md).

**Cost analysis**<br>
-  Configure [OpenCost](https://www.opencost.io), which is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs, to support your analysis of your cluster costs. It exports detailed costing data to Azure storage.
- Use data from OpenCost to breakdown relative usage of the cluster by different teams in your organization so that you can allocate the cost between each.
- Use data from OpenCost to ensure that the cluster is using the full capacity of its nodes by densely packing workloads, using fewer large nodes as opposed to many smaller nodes. 


### Monitor level 3 - Managed Kubernetes components

The managed Kubernetes level includes the following components:

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server and identify any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitor Kubelet to help troubleshoot pod management issues, pods not starting, nodes not ready, or pods getting killed.  |

Following are common scenarios for monitoring your managed Kubernetes components.

**Container insights**<br>
- Under **Monitoring**, select **Metrics** to view the **Inflight Requests** counter.
- Under **Reports**, use the **Kubelet** workbook to see the health and performance of each kubelet. For more information about these workbooks, see [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks). 

**Grafana**<br>
- Use the [prebuilt dashboard](../visualize/grafana-plugin.md#use-out-of-the-box-dashboards) in Managed Grafana for **Kubelet** to see the health and performance of each kubelet.
- Use a dashboard such as [Kubernetes apiserver](https://grafana.com/grafana/dashboards/12006) for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.

**Log Analytics**<br>
- Use [log queries with resource logs](../../aks/monitor-aks.md#sample-log-queries) to analyze [control plane logs](#collect-control-plane-logs-for-aks-clusters) generated by AKS components.
- Any configuration activities for AKS are logged in the Activity log. When you [send the Activity log to a Log Analytics workspace](#collect-activity-log-for-aks-clusters) you can analyze it with Log Analytics. For example, the following sample query can be used to return records identifying a successful upgrade across all your AKS clusters. 

    ``` kql
    AzureActivity
    | where CategoryValue == "Administrative"
    | where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
    | extend properties=parse_json(Properties_d) 
    | where properties.message == "Upgrade Succeeded"
    | order by TimeGenerated desc
    ```


**Troubleshooting**<br>
- For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).

### Monitor level 4 - Kubernetes objects and workloads

The Kubernetes objects and workloads level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  |
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor resource utilization, including CPU and memory, of the containers running on your AKS cluster. |

Following are common scenarios for monitoring your Kubernetes objects and workloads.



**Container insights**<br>
- Use the **Nodes** and **Controllers** views to see the health and performance of the pods running on them and drill down to the health and performance of their containers.
- Use the **Containers** view to see the health and performance for the containers. For more information on analyzing container health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md#analyze-nodes-controllers-and-container-health).
- Under **Reports**, use the **Deployments** workbook to see deployment metrics. For more information, see [Deployment & HPA metrics with Container Insights](container-insights-deployment-hpa-metrics.md).

**Grafana dashboards**<br>
- Use the [prebuilt dashboards](../visualize/grafana-plugin.md#use-out-of-the-box-dashboards) in Managed Grafana for **Nodes** and **Pods** to view their health and performance.
- Multiple [Kubernetes dashboards](https://grafana.com/grafana/dashboards/?search=kubernetes) are available that visualize the performance and health of your nodes based on data stored in Prometheus.


**Live data**
- In troubleshooting scenarios, Container Insights provides access to live AKS container logs (stdout/stderror), events and pod metrics. For more information about this feature, see [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md).

### Alerts for the platform engineer

[Alerts in Azure Monitor](..//alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. If you have an existing [ITSM solution](../alerts/itsmc-overview.md) for alerting, you can [integrate it with Azure Monitor](../alerts/itsmc-overview.md). You can also [export workspace data](../logs/logs-data-export.md) to send data from your Log Analytics workspace to another location that supports your current alerting solution.

#### Alert types
The following table describes the different types of custom alert rules that you can create based on the data collected by the services described above.

| Alert type | Description |
|:---|:---|
| Prometheus alerts | [Prometheus alerts](../alerts/prometheus-alerts.md) are written in Prometheus Query Language (Prom QL) and applied on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). Recommended alerts already include the most common Prometheus alerts, and you can [create addition alert rules](../essentials/prometheus-rule-groups.md) as required. |
| Metric alert rules | Metric alert rules use the same metric values as the Metrics explorer. In fact, you can create an alert rule directly from the metrics explorer with the data you're currently analyzing. Metric alert rules can be useful to alert on AKS performance using any of the values in [AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). |
| Log alert rules | Use log alert rules to generate an alert from the results of a log query. For more information, see [How to create log alerts from Container Insights](container-insights-log-alerts.md) and [How to query logs from Container Insights](container-insights-log-query.md). |

#### Recommended alerts
Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. You can add more alert rules later as you identify additional alerting conditions.

## Developer

In addition to developing the application, the *developer* maintains the application running on the cluster. They're responsible for application specific traffic including application performance and failures and maintain reliability of the application according to company-defined SLAs.

:::image type="content" source="media/monitor-kubernetes/layers-developer.png" alt-text="Diagram of layers of Kubernetes environment for developer." lightbox="media/monitor-kubernetes/layers-developer.png"  border="false":::

### Azure services for developer

The following table lists the services that are commonly used by the developer to monitor the health and performance of the application running on the cluster.  





| Service | Description |
|:---|:---|
| [Application insights](../app/app-insights-overview.md) |  Feature of Azure Monitor that provides application performance monitoring (APM) to monitor applications running on your Kubernetes cluster from development, through test, and into production. Quickly identify and mitigate latency and reliability issues using distributed traces. Supports [OpenTelemetry](../app/opentelemetry-overview.md#opentelemetry) for vendor-neutral instrumentation. |





See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from the application running on your cluster and decision criteria on the best method for your particular requirements. 

### Monitor level 5 - Application

Following are common scenarios for monitoring your application.





**Application performance**<br>
- Use the **Performance** view in Application insights to view the performance of different operations in your application.
- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application.
- Use [Application Map](../app/app-map.md) to view the dependencies between your application components and identify any bottlenecks.
- Enable [distributed tracing](../app/distributed-tracing-telemetry-correlation.md), which provides a performance profiler that works like call stacks for cloud and microservices architectures, to gain better observability into the interaction between services.

**Application failures**<br>
- Use the **Failures** tab of Application insights to view the number of failed requests and the most common exceptions.
- Ensure that alerts for [failure anomalies](../alerts/proactive-failure-diagnostics.md) identified with [smart detection](../alerts/proactive-diagnostics.md) are configured properly.

**Health monitoring**<br>
- Create an [Availability test](../app/availability-overview.md) in Application insights to create a recurring test to monitor the availability and responsiveness of your application.
- Use the [SLA report](../app/sla-report.md) to calculate and report SLA for web tests.
- Use [annotations](../app/release-and-work-item-insights.md?tabs=release-annotations) to identify when a new build is deployed so that you can visually inspect any change in performance after the update.

**Application logs**<br>
- Container insights sends stdout/stderr logs to a Log Analytics workspace. See [Resource logs](../../aks/monitor-aks-reference.md#resource-logs) for a description of the different logs and [Kubernetes Services](/azure/azure-monitor/reference/tables/tables-resourcetype#kubernetes-services) for a list of the tables each is sent to.

**Service mesh**

- For AKS clusters, deploy the [Istio-based service mesh add-on](../../aks/istio-about.md) which provides observability to your microservices architecture. [Istio](https://istio.io/) is an open-source service mesh that layers transparently onto existing distributed applications. The add-on assists in the deployment and management of Istio for AKS.

## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).


