---
title: Monitor Kubernetes scenarios
description: Describes different Kubernetes monitoring scenarios for different personas.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/08/2023
---

# Monitor Kubernetes scenarios
This article describes different scenarios for monitoring Kubernete using Azure Monitor and other services in Azure. See [Monitor Kubernetes with Azure Monitor](monitor-containers.md) for details on selecting and configuring the right monitoring solution for your environment.


## Roles
Responsibility for a Kubernetes environment and the applications that depend on it are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide .

| Roles | Levels | Description |
|:---|:---|:---|
| [Platform Engineer / Cluster admin](#platform-engineer) | 1-3 | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](#developer) | 4 | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](#network-engineer) | 5 | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Platform Engineer
The cluster administrator, also known as the platform engineer, is responsible for the Kubernetes cluster. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot issues. They also need to understand the cost of the cluster and its components, and be able to allocate costs to different teams.


**What is the most cost effective way to setup logging and metrics?**

- See the [Configure monitoring](../containers/container-insights-onboard.md#configure-monitoring) section of [Monitor Kubernetes clusters with Azure services](monitor-containers.md) for details on configuring data collection with Azure services such as [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) and [Container Insights](container-insights-overview.md). This includes steps for configuring the tools for optimizing cost.

**How do I keep costs to a minimum when using AKS and its larger ecosystem?**

- The cluster administrator needs to ensure that the cluster is being run efficiently and using the full capacity of the nodes. They want to ensure that they're densely packing workloads, using fewer large nodes as opposed to many smaller nodes. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the administrator can use for these decisions.


**How do I do charge back to different lines of business for their relative usage?**

- The cluster administrator may be tasked with allocating the cost of the cluster to different teams based on their relative usage, and the need appropriate breakdowns of relative usage in order to perform this chargeback. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to [customer-specific Azure pricing](https://www.opencost.io/docs/azure-prices) to Azure storage that the administrator can use for this requirement.

**Do I have to use Azure's monitoring and logging or can I bring my own?**

- Azure provides a complete set of services for collecting and analyzing your Kubernetes logs. Container insights collects container stdout, stderr, and infrastructure logs, while you can create diagnostic settings to collect control plan logs for AKS. All logs are stored in a Log Analytics workspace where they can be analyzed using [Kusto Query Language (KQL)]() or visualized in [managed Grafana](). If you have an existing investment in another tool to collect and analyze Kubernetes logs, then use the [Data Export feature of Log Analytics workspace] to send AKS logs to Event Hub and forward to alternate system. 

**How can I monitor if my cluster upgrade was successful?**

- Any configuration activities for AKS are logged in the Activity log. When you send the Activity log to a Log Analytics workspace you can analyze it with KQL. The following sample query can be used to return records identifying a successful upgrade. 

    ``` kql
    AzureActivity
    | where CategoryValue == "Administrative"
    | where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
    | extend properties=parse_json(Properties_d) 
    | where properties.message == "Upgrade Succeeded"
    | order by TimeGenerated desc
    ```

**How do I monitor attached storage?**

- Use the [Disk Capacity and Disk IO workbooks](container-insights-reports.md#node-monitoring-workbooks) to view health and performance of disks attached to each node in your cluster.
- Use [Storage insights](../../storage/common/storage-insights-overview.md) in Azure Monitor to monitor the performance, capacity, and availability of your storage resources in Azure. Configure [metric alerts](../alerts/alerts-metric-logs.md) and [service health notifications](../../service-health/alerts-activity-log-service-notifications-portal.md) to set up automated alerting to proactively detect issues.
- Use Grafana dashboards with [Prometheus metric values](../essentials/prometheus-metrics-scrape-default.md) related to disk such as `node_disk_io_time_seconds_total` and `windows_logical_disk_free_bytes`.


**How do I monitor and observe access between services in the cluster (east-west traffic)?**

- For AKS clusters, see the new [Network Observability add-on for AKS](https://techcommunity.microsoft.com/t5/azure-observability-blog/comprehensive-network-observability-for-aks-through-azure/ba-p/3825852) which provides observability across the multiple layers in the Kubernetes networking stack.

**How do I monitor relevant infrastructure supporting the cluster?**

- Use [views](container-insights-analyze.md) and [workbooks](container-insights-reports.md) in Container insights or Kubernetes dashboards in Grafana to track metric values such as OS disk queues, host memory, and CPU utilization.
- Use the [networking workbooks](container-insights-reports.md#networking-workbooks) in Container insights to monitor your network configurations and adapters.


**How do I configure alerting? What alerts should be created for different components?**

- Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. 


**Do I have to use Azure alerting or can I bring my own?**

- [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) supports [Prometheus alerting rules](../essentials/prometheus-rule-groups.md), so you can use any existing Prometheus alerts you might be using.
- If you have an existing [ITSM solution](../alerts/itsmc-overview.md), you can [integrate it with Azure Monitor](../alerts/itsmc-overview.md).
- Use [workspace data export](../logs/logs-data-export.md) to send data sent to the Log Analytics workspace to another location that supports your current alerting solution.

**Which images are currently used inside the cluster?**

- Use the **Image inventory** log query that retrieves data from the [ContainerImageInventory](/azure/azure-monitor/reference/tables/containerimageinventory) table.

## Fleet Architect
The Fleet Architect is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. 

**How can I monitor the health of multiple clusters?**

- Open **Containers** from the **Monitor** menu in the Azure portal to view the status of all your clusters monitored by Container insights.

**How can I monitor overall patch status of the clusters?**

- The same log query shown above for tracking cluster upgrades can be used for multiple clusters.


**How can I discover application inventory in the fleet with version and stage?**


## Network Engineer

The primary tools used by the network engineer are [Network insights]()

**How do I know if my network is configured correctly and there's no data exfiltration?**

Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups and then [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights into traffic flow.

**How can I ensure that unnecessary public IPs are exposed?**

- Use Traffic Analytics to identify traffic flowing over public IPs. Provide this information to security engineers to ensure that no unnecessary public IPs are exposed.


**How can I capture the traffic flow and monitor that network rules are configured correctly, or more importantly identify traffic that should not be flowing?**


## Developer

**What are the poor performing apis or database queries?**

**Where is my application bottleneck?**


**How reliable is my application, am I meeting my SLA?**


**Are we getting a lot of errors, if so, what kind?**


**How can I setup telemetry/tracing to gain better observability into the interaction between services?**


**How should I set up health monitoring for my application?**

**Where should I be sending my application logs, and where do I look for them?**


## Next steps

- For more information about AKS metrics, logs, and other important values, see [Monitoring AKS data reference](../../aks/monitor-aks-reference.md).

