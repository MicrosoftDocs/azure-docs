---
title: Monitor Kubernetes clusters using Azure services and cloud native tools
description: Describes how to monitor the health and performance of the different layers of your Kubernetes environment using Azure Monitor and cloud native services in Azure.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes clusters using Azure services and cloud native tools

This set of articles describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure and cloud native services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). Different sets of guidance are provided for the different roles that typically manage different aspects of a Kubernetes environment. 


> [!IMPORTANT]
> These articles provides complete guidance on monitoring the different layers of your Kubernetes environment based on Azure Kubernetes Service (AKS) or Kubernetes clusters in other clouds using services in Azure. If you're just getting started with AKS, see [Monitoring AKS](../../aks/monitor-aks.md) for basic information for getting started monitoring an AKS cluster.

## Layers and roles of Kubernetes environment

Following is an illustration of a common bottoms-up model of a typical Kubernetes environment, starting from infrastructure up through applications. Each layer has distinct monitoring requirements that are addressed by different Azure services and managed by different roles in the organization.

:::image type="content" source="media/monitor-containers/layers-with-roles.png" alt-text="Diagram of layers of Kubernetes environment with related administrative roles." lightbox="media/monitor-containers/layers-with-roles.png"  border="false":::

Responsibility for the [different layers of a a Kubernetes environment and the applications that depend on it](monitor-kubernetes-analyze.md) are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide different monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Cluster administrator](#cluster-administrator) | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](#developer) | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](#network-engineer) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Azure services

Azure provides a complete set of services for monitoring the different layers of your Kubernetes infrastructure and the applications that depend on it. These services work in conjunction with each other to provide a complete monitoring solution, or you may integrate them with your existing monitoring tools. 

Your choice of which tools to deploy and their configuration will depend on the requirements of your particular environment in addition to any existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/). For example, you may use the managed offerings in Azure for Prometheus and Grafana, or you may choose to use your existing installation of these tools with your Kubernetes clusters in Azure. Your organization may be using alternative tools to Container insights to collect and analyze Kubernetes logs, such as Splunk or Datadog.

Monitoring a complex environment such as Kubernetes involves collecting a significant amount of telemetry, much of which incurs a cost. You should collect the just enough data to meet their requirements and no more. This includes the amount of data collected, the frequency of collection, and the retention period. If you're  very cost conscious, you may choose to implement a subset of the full functionality in order to reduce your monitoring spend.

## Cluster administrator

The cluster administrator, also known as the platform engineer, is responsible for the Kubernetes cluster itself. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot any detected issues. They also need to understand the cost of the cluster and its components, and potentially to be able to allocate costs to different teams.

:::image type="content" source="media/monitor-containers/layers-cluster-administrator.png" alt-text="Diagram of layers of Kubernetes environment for cluster administrator." lightbox="media/monitor-containers/layers-cluster-administrator.png"  border="false":::


Large organizations may also have a fleet architect, which is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. At scale recommendations for the fleet architect are included in the guidance below.

The sections below provide the following details for the cluster administrator.

- [Monitoring services](#monitoring-services-for-cluster-administrator)
- [Monitoring layers of the cluster](#monitoring-layers-of-the-cluster)
- [Alerts](#alerts-for-cluster-administrator)
- [Additional monitoring scenarios](#additional-cluster-monitoring-scenarios)

### Monitoring services for cluster administrator

The following table lists the services that are commonly used by the cluster administrator to monitor the health and performance of the Kubernetes cluster and its components. The following sections identify the steps for complete monitoring of your Kubernetes environment using the Azure services listed above. Functionality and integration options are provided for each to each to help you determine where you may need to modify this configuration to meet your particular requirements.

| Service | Description |
|:---|:---|
| [Container Insights](container-insights-overview.md) | Azure service for AKS and Azure Arc-enabled Kubernetes clusters that uses a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) to collect stdout/stderr logs, performance metrics, and Kubernetes events from each node in your cluster. It also collects metrics from the Kubernetes control plane and stores them in the workspace. You can view the data in the Azure portal or query it using [Log Analytics](../logs/log-analytics-overview.md). |
| [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) | Fully managed implementation of [Prometheus](https://prometheus.io), which is a cloud-native metrics solution from the Cloud Native Compute Foundation and the most common tool used for collecting and analyzing metric data from Kubernetes clusters. Azure Monitor managed service for Prometheus is compatible with the Prometheus query language (PromQL) and Prometheus alerts in addition to integration with Azure Managed Grafana for visualization. This service supports your investment in open source tools without the complexity of managing your own Prometheus environment. | 
| [Azure Arc-enabled Kubernetes](container-insights-enable-arc-enabled-clusters.md) | Allows you to attach to Kubernetes clusters running in other clouds so that you can manage and configure them in Azure. With the Arc agent installed, you can monitor AKS and hybrid clusters together using the same methods and tools, including Container insights. |
| [Azure Managed Grafana](../../managed-grafana/overview.md) | Fully managed implementation of [Grafana](https://grafana.com/), which is an open-source data visualization platform commonly used to present Prometheus data. Multiple predefined Grafana dashboards are available for monitoring Kubernetes and full-stack troubleshooting.  |
| [OpenCost](https://www.opencost.io/docs/azure-opencost) | Open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to [customer-specific Azure pricing](https://www.opencost.io/docs/azure-prices) to Azure storage to assist the cluster administrator in analyzing and categorizing costs. |


#### Enable scraping of Prometheus metrics

> [!IMPORTANT]
> Azure Monitor managed service for Prometheus requires an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) to support Azure Monitor managed service for Prometheus.   For information on design considerations for a workspace configuration, see [Azure Monitor workspace architecture](../essentials/azure-monitor-workspace-overview.md#azure-monitor-workspace-architecture).

Enable scraping of Prometheus metrics by Azure Monitor managed service for Prometheus from your cluster using one of the following methods:

- Select the option **Enable Prometheus metrics** when you [create an AKS cluster](../../aks/learn/quick-kubernetes-deploy-portal.md).
- Select the option **Enable Prometheus metrics** when you enable Container insights on an existing [AKS cluster](container-insights-enable-aks.md?tabs=portal-azure-monitor) or [Azure Arc-enabled Kubernetes cluster](container-insights-enable-arc-enabled-clusters.md).
- Enable for an existing [AKS cluster](../essentials/prometheus-metrics-enable.md) or [Arc-enabled Kubernetes cluster (preview)](../essentials/prometheus-metrics-from-arc-enabled-cluster.md).


If you already have a Prometheus environment that you want to use for your AKS clusters, then enable Azure Monitor managed service for Prometheus and then use remote-write to send data to your existing Prometheus environment. You can also [use remote-write to send data from your existing self-managed Prometheus environment to Azure Monitor managed service for Prometheus](../essentials/prometheus-remote-write.md). 

See [Default Prometheus metrics configuration in Azure Monitor](../essentials/prometheus-metrics-scrape-default.md) for details on the metrics that are collected by default and their frequency of collection. If you want to customize the configuration, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-scrape-configuration.md).


#### Enable Grafana 

See [Create an Azure Managed Grafana instance using the Azure portal](../../managed-grafana/quickstart-managed-grafana-portal.md) for details on creating an Azure Managed Grafana instance. Once your Grafana instance is created, [link it to your Azure Monitor workspace](../essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace) so that you can use your Prometheus data as a data source. You can manually perform this configuration using [add Azure Monitor managed service for Prometheus as data source](../essentials/prometheus-grafana.md) If you have an existing Grafana environment, then configure appropriate Prometheus environment as a data source using guidance at [Prometheus data source](https://grafana.com/docs/grafana/latest/datasources/prometheus).

If you have an existing Grafana environment, then you can continue to use it and add Azure Monitor managed service for Prometheus as a data source. You can [add the Azure Monitor data source to Grafana](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) to use data collected by Container insights in custom Grafana dashboards.

[Search the available Grafana dashboards templates](https://grafana.com/grafana/dashboards/?search=kubernetes) to identify dashboards for monitoring Kubernetes and then  [import into Grafana](../../managed-grafana/how-to-create-dashboard.md).


#### Enable Container Insights

When you enable Container Insights for your Kubernetes cluster, it deploys a containerized version of the [Azure Monitor agent](../agents/..//agents/log-analytics-agent.md) that sends data to a Log Analytics workspace in Azure Monitor. Container insights collects container stdout/stderr, infrastructure logs, and performance . All logs are stored in a Log Analytics workspace where they can be analyzed using [Kusto Query Language (KQL)](../logs/log-query-overview.md).


See [Enable Container insights](../containers/container-insights-onboard.md) for prerequisites and configuration options. Once Container insights is enabled for a cluster, perform the following actions to optimize your installation.

- To improve your query experience with data collected by Container insights and to reduce collection costs, [enable the ContainerLogV2 schema](container-insights-logging-v2.md) for each cluster. If you only use logs for occasional troubleshooting, then consider configuring this table as [basic logs](../logs/basic-logs-configure.md).
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) for details.

If you have an existing solution for collection of logs, then follow the guidance for that tool or enable Container insights and use the [data export feature of Log Analytics workspace](../logs/logs-data-export.md) to send data to Azure event hub to forward to alternate system.


#### Collect control plane logs for AKS clusters

The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container Insights doesn't use these logs, so you need to create your own log queries to view and analyze them. For details on log structure and queries, see [How to query logs from Container Insights](container-insights-log-query.md#resource-logs).

[Create a diagnostic setting](../../aks/monitor-aks.md#control-plane-logs) for each AKS cluster to send resource logs to a Log Analytics workspace. For a description of the categories that are available for AKS, see [Resource logs](../../aks/monitor-aks-reference.md#resource-logs). 

There's a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs. You can send logs to an Azure storage account to reduce costs if you need to retain the information. For details on the cost of ingesting and retaining log data, see [Azure Monitor Logs pricing details](../logs/cost-logs.md).

If you're unsure which resource logs to initially enable, use the following recommendations, which are based on the most common customer requirements. You can enable other categories later if you need to.

> [!NOTE]
> INFORMATION REQUIRED.
> 
> Missing recommendation on some categories.

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


#### OpenCost
The cluster administrator is also responsible for keeping costs to a minimum during regular operation of the cluster and its larger ecosystem. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the cluster administrator can use for these decisions.

OpenCost can also breakdown relative usage of the cluster by different teams in your organization so that you can allocate the cost between each if you have this requirement.


#### Collect Activity log for AKS clusters
Configuration changes to your AKS clusters are stored in the [Activity log](../essentials/activity-log.md). [Send this data to your Log Analytics workspace](../essentials/activity-log.md#send-to-log-analytics-workspace) to analyze it with other monitoring data.  There's no cost for this data collection, and you can analyze or alert on the data using Log Analytics.

### Monitoring layers of the cluster
This section describes common monitoring scenarios for each of the [levels of the Kubernetes cluster](monitor-kubernetes.md#layers-and-roles-of-kubernetes-environment) managed by the cluster administrator.

#### Level 1 - Cluster level components

The cluster level includes the following component:

| Component | Monitoring requirements |
|:---|:---|
| Node |  Understand the readiness status and performance of CPU, memory, disk and IP usage for each node and proactively monitor their usage trends before deploying any workloads. |

**Container insights**<br>
- Use the **Cluster** view to see the performance of the nodes in your cluster, including CPU and memory utilization.
- Use the **Nodes** view to see the health of each node and the health and performance of the pods running on them. For more information on analyzing node health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md).
- Under **Reports**, use the **Node Monitoring** workbooks to analyze disk capacity, disk IO, and GPU usage. For more information about these workbooks, see [Node Monitoring workbooks](container-insights-reports.md#node-monitoring-workbooks).
- Under **Monitoring**, select **Workbooks**, then **Subnet IP Usage** to see the IP allocation and assignment on each node for a selected time-range.

**Grafana dashboards**<br>
- Multiple [Kubernetes dashboards](https://grafana.com/grafana/dashboards/?search=kubernetes) are available that visualize the performance and health of your nodes based on data stored in Prometheus.

**Cost analysis**<br>
- Use data from OpenCost to ensure that the cluster is using the full capacity of its nodes by densely packing workloads, using fewer large nodes as opposed to many smaller nodes. 

**Troubleshooting**<br>
- For troubleshooting scenarios, you may need to access nodes directly for maintenance or immediate log collection. For security purposes, AKS nodes aren't exposed to the internet but you can use the `kubectl debug` command to SSH to the AKS nodes. For more information on this process, see [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md).

#### Level 2 - Managed AKS components

The managed AKS level includes the following components:

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server and identify any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitor Kubelet to help troubleshoot pod management issues, pods not starting, nodes not ready, or pods getting killed.  |

**Container insights**<br>
- Under **Monitoring**, select **Metrics** to view the **Inflight Requests** counter.
- Under **Reports**, use the **Kubelet** workbook to see the health and performance of each kubelet. For more information about these workbooks, see [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks). 

**Grafana**<br>
- [Kubernetes apiserver](https://grafana.com/grafana/dashboards/12006) for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.

**Log Analytics**<br>
- Use [log queries with resource logs](container-insights-log-query.md#resource-logs) to analyze control plane logs generated by AKS components.

**Troubleshooting**<br>
- For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).


#### Level 3 - Kubernetes objects and workloads

The Kubernetes objects and workloads level includes the following components:

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Monitor actual vs desired state of the deployment and the status and resource utilization of the pods running on them.  |
| Pods | Monitor status and resource utilization, including CPU and memory, of the pods running on your AKS cluster. |
| Containers | Monitor resource utilization, including CPU and memory, of the containers running on your AKS cluster. |

**Container insights**<br>
- Use the **Nodes** and **Controllers** views to see the health and performance of the pods running on them and drill down to the health and performance of their containers.
- Use the **Containers** view to see the health and performance for the containers. For more information on analyzing container health and performance, see [Monitor your Kubernetes cluster performance with Container Insights](container-insights-analyze.md#analyze-nodes-controllers-and-container-health).
- Under **Reports**, use the **Deployments** workbook to see deployment metrics. For more information, ee [Deployment & HPA metrics with Container Insights](container-insights-deployment-hpa-metrics.md).

**Grafana**<br>
- [Kubernetes apiserver](https://grafana.com/grafana/dashboards/12006) for a complete view of the API server performance. This includes such values as request latency and workqueue processing time.

**Live data**
- In troubleshooting scenarios, Container Insights provides access to live AKS container logs (stdout/stderror), events and pod metrics. For more information about this feature, see [How to view Kubernetes logs, events, and pod metrics in real-time](container-insights-livedata-overview.md).


### Alerts for the cluster administrator

[Alerts in Azure Monitor](..//alerts/alerts-overview.md) proactively notify you of interesting data and patterns in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. 

#### Alert types
The following table describes the different types of custom alert rules that you can create based on the data collected by the services described above.

| Alert type | Description |
|:---|:---|
| Prometheus alerts | [Prometheus alerts](../alerts/prometheus-alerts.md) are written in Prometheus Query Language (Prom QL) and applied on Prometheus metrics stored in [Azure Monitor managed services for Prometheus](../essentials/prometheus-metrics-overview.md). Recommended alerts already include the most common Prometheus alerts, but you can [create addition alert rules](../essentials/prometheus-rule-groups.md) as required. |
| Metric alert rules | Metric alert rules use the same metric values as the Metrics explorer. In fact, you can create an alert rule directly from the metrics explorer with the data you're currently analyzing. Metric alert rules can be useful to alert on AKS performance using any of the values in [AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). |
| Log alert rules | Use log alert rules to generate an alert from the results of a log query. For more information, see [How to create log alerts from Container Insights](container-insights-log-alerts.md) and [How to query logs from Container Insights](container-insights-log-query.md). |

#### Recommended alerts
Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. 



### Additional cluster monitoring scenarios
This section provides solutions to a variety of common scenarios that may be encountered by the cluster administrator using the configuration described above.

**How can I monitor if my cluster upgrade was successful?**

- Any configuration activities for AKS are logged in the Activity log. When you [send the Activity log to a Log Analytics workspace](#collect-activity-log-for-aks-clusters) you can analyze it with Log Analytics. The following sample query can be used to return records identifying a successful upgrade across all your AKS clusters. 

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




## Network engineer
The Network Engineer is responsible for traffic between workloads and any ingress/egress with the cluster. They analyze network traffic and perform threat analysis.

:::image type="content" source="media/monitor-containers/layers-network-engineer.png" alt-text="Diagram of layers of Kubernetes environment for network engineer." lightbox="media/monitor-containers/layers-network-engineer.png"  border="false":::

### Azure services for network administrator

The following table lists the services that are commonly used by the network engineer to monitor the health and performance of the Kubernetes cluster and its components.  


| Service | Description |
|:---|:---|
| [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) | Suite of tools in Azure to monitor the virtual networks used by your Kubernetes clusters and diagnose detected issues. |
| [Network insights](../../network-watcher/network-insights-overview.md) | Feature of Azure Monitor that includes a visual representation of the performance and health of different network components and provides access to the network monitoring tools that are part of Network Watcher. |

#### Configure network monitoring

[Network insights](../../network-watcher/network-insights-overview.md) is enabled by default and requires no configuration. Network Watcher is also typically [enabled by default in each Azure region](../../network-watcher/network-watcher-create.md). 

Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups used by your cluster and then use [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights on this data. You'll most likely use the same Log Analytics workspace for traffic analytics that you use for Container insights and your control plane logs.

### Common network monitoring scenarios
This section provides solutions to a variety of common scenarios that may be encountered by the network engineer using the configuration described above.

**How can I detect any data exfiltration for my cluster?**

 - Use traffic analytics to determine if any traffic is flowing to either to or from any unexpected ports used by the cluster.

**How can I detect if any unnecessary public IPs are exposed?**

- Use traffic analytics to identify traffic flowing over public IPs. Provide this information to security engineers to ensure that no unnecessary public IPs are exposed.

**How can I verify that my network rules are configured correctly?**
- Follow the previous guidance for detecting any unexpected activity and then analyze your network rules to determine why such traffic is allowed.

## Developer

In addition to developing the application, the developer maintains the application running on the cluster. They're responsible for application specific traffic including application performance and failures and maintain reliability of the application according to company-defined SLAs.

:::image type="content" source="media/monitor-containers/layers-developer.png" alt-text="Diagram of layers of Kubernetes environment for developer." lightbox="media/monitor-containers/layers-developer.png"  border="false":::

### Azure services for developer

The following table lists the services that are commonly used by the network engineer to monitor the health and performance of the Kubernetes cluster and its components.  


| Service | Description |
|:---|:---|
| [Application insights](../app/app-insights-overview.md) |  Feature of Azure Monitor that provides application performance monitoring (APM) to monitor applications running on your Kubernetes cluster from development, through test, and into production. Quickly identify and mitigate latency and reliability issues using distributed traces. Supports [OpenTelemetry](../app/opentelemetry-overview.md#opentelemetry) for vendor-neutral instrumentation. |

#### Enable Application insights to monitor your application

See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from the application running ion your cluster and decision criteria on the best method for your particular requirements. Once you have your application instrumented, create an [Availability test](../app/availability-overview.md) to create a recurring test to monitor its availability and responsiveness.


### Common application monitoring scenarios

**How do I get started with Application insights?**

- See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from your application and decision criteria on the best method for your particular requirements.

**Where are my application logs stored?**

- Container insights sends stdout/stderr logs to a Log Analytics workspace. See [Resource logs](../../aks/monitor-aks-reference.md#resource-logs) for a description of the different logs and [Kubernetes Services](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/tables-resourcetype#kubernetes-services) for a list of the tables each is sent to.
- App insights for additional logging including iLogger.

**How do I identify poor performing apis or database queries?**

- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application.

**How do I identify my application bottleneck?**

- Use [Application Map](../app/app-map.md) to view the dependencies between your application components and identify any bottlenecks.
- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application.
- Use the **Performance** view in Application insights to view the performance of different operations in your application.

**How do I determine if my application is meeting its service-level agreement (SLA)?**

- Use the [SLA report](../app/sla-report.md) to calculate and report SLA for web tests.
- Use [annotations](../app/annotations.md) to identify when a new build is deployed so that you can visually inspect any change in performance after the update.

**How do I determine if my application is generating errors?**

- See the **Failures** tab of Application insights to view the number of failed requests and the most common exceptions.
- Ensure that alerts for [failure anomalies](../alerts/proactive-failure-diagnostics.md) identified with [smart detection](../alerts/proactive-diagnostics.md) are configured properly.


**How can I to gain better observability into the interaction between services?**

- Enable [distributed tracing](../app/distributed-tracing-telemetry-correlation.md), which provides a performance profiler that works like call stacks for cloud and microservices architectures.

**How should I set up health monitoring for my application?**

- Create an [Availability test](../app/availability-overview.md) in Application insights to create a recurring test to monitor the availability and responsiveness of your application.
- 
## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).

