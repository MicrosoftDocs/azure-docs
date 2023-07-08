---
title: Monitor Kubernetes scenarios
description: Describes different Kubernetes monitoring scenarios for different personas.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes scenarios
This article describes different scenarios for monitoring Kubernetes based on the monitoring environment described in [Configure Kubernetes monitoring using Azure services](monitor-kubernetes-configure.md). Solutions to common scenarios are provided for each of the different roles that commonly support a Kubernetes environment. This article assumes that you're using Container insights and the managed offerings in Azure for Prometheus and Grafana. If you're using alternative tools, then you can use the same concepts, but details will vary for the different tools.


## Roles
Responsibility for the [different layers of a a Kubernetes environment and the applications that depend on it](monitor-kubernetes-analyze.md) are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide different monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Cluster administrator](#cluster-administrator) | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](#developer) | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](#network-engineer) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Cluster administrator
The cluster administrator, also known as the platform engineer, is responsible for the Kubernetes cluster. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot any detected issues. They also need to understand the cost of the cluster and its components, and potentially to be able to allocate costs to different teams.

Large organizations may also have a fleet architect, which is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. At scale recommendations for the fleet architect are included in the recommended solutions below.

:::image type="content" source="media/monitor-containers/layers-cluster-administrator.png" alt-text="Diagram of Kubernetes layers for cluster administrator" lightbox="media/monitor-containers/layers-cluster-administrator.png"  border="false":::

The primary tools used by the cluster administrator are Container insights, Prometheus, and Grafana. Depending on their particular environment, they may be using the managed offerings in Azure for Prometheus and Grafana or may be using a separate environment. They may also be using alternative tools to Container insights for monitoring and logging. 

### Common scenarios for cluster administrator
The following scenarios assume that the cluster administrator is using the managed offerings in Azure for Prometheus and Grafana, and Container insights for monitoring and logging.

**How can I monitor the health of multiple clusters?**

- Open **Containers** from the **Monitor** menu in the Azure portal to view the status of all your clusters monitored by Container insights.


**What is the most cost effective way to setup logging and metrics?**

- See the [Configure monitoring](../containers/container-insights-onboard.md#configure-monitoring) section of [Monitor Kubernetes clusters with Azure services](monitor-containers.md) for details on configuring data collection with Azure services such as [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) and [Container Insights](container-insights-overview.md). This includes steps for configuring the tools for optimizing cost.

**How do I keep costs to a minimum when using AKS and its larger ecosystem?**

- Ensure that the cluster is using the full capacity of its nodes by densely packing workloads, using fewer large nodes as opposed to many smaller nodes. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the cluster administrator can use for these decisions.


**How do I do charge back to different lines of business for their relative usage?**

- You may be tasked with allocating the cost of the cluster to different teams based on their relative usage, requiring appropriate breakdowns of relative usage
- . [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to [customer-specific Azure pricing](https://www.opencost.io/docs/azure-prices) to Azure storage that the administrator can use for this requirement.

**Do I have to use Azure's monitoring and logging or can I bring my own?**

- Azure provides a complete set of services for collecting and analyzing your Kubernetes logs. Container insights collects container stdout, stderr, and infrastructure logs, while you can create diagnostic settings to collect control plan logs for AKS. All logs are stored in a Log Analytics workspace where they can be analyzed using [Kusto Query Language (KQL)]() or visualized in [managed Grafana](). If you have an existing investment in another tool to collect and analyze Kubernetes logs, such as Splunk or Datadog, then follow the guidance for configuration of those tools. You can also use the [Data Export feature of Log Analytics workspace]() to send AKS logs to Event Hub and forward to alternate system. 

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

**How do I monitor relevant infrastructure supporting the cluster?**

- Use [views](container-insights-analyze.md) and [workbooks](container-insights-reports.md) in Container insights or Kubernetes dashboards in Grafana to track metric values such as OS disk queues, host memory, and CPU utilization.
- Use the [networking workbooks](container-insights-reports.md#networking-workbooks) in Container insights to monitor your network configurations and adapters.


**How do I configure alerting? What alerts should be created for different components?**

- Start with a set of recommended Prometheus alerts from [Metric alert rules in Container insights (preview)](container-insights-metric-alerts.md#prometheus-alert-rules) which include the most common alerting conditions for a Kubernetes cluster. 
- Review the standard log queries available for Container insights for potential basis for log query alerts.


**Do I have to use Azure alerting or can I bring my own?**

- [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) supports [Prometheus alerting rules](../essentials/prometheus-rule-groups.md), so you can use any existing Prometheus alerts you might be using.
- If you have an existing [ITSM solution](../alerts/itsmc-overview.md), you can [integrate it with Azure Monitor](../alerts/itsmc-overview.md).
- Use [workspace data export](../logs/logs-data-export.md) to send data sent to the Log Analytics workspace to another location that supports your current alerting solution.

**Which images are currently used inside the cluster?**

- Use the **Image inventory** log query that retrieves data from the [ContainerImageInventory](/azure/azure-monitor/reference/tables/containerimageinventory) table populated by Container insights.


## Network Engineer
The Network Engineer is responsible for traffic between workloads and any ingress/egress with the cluster. They analyze network traffic and perform threat analysis.

:::image type="content" source="media/monitor-containers/layers-network-engineer.png" alt-text="Diagram of Kubernetes layers for network engineer" lightbox="media/monitor-containers/layers-network-engineer.png"  border="false":::


### Common scenarios for network engineer


**How can I detect any data exfiltration for my cluster?**

 - Use traffic analytics to determine if any traffic is flowing to either to or from any unexpected ports used by the cluster.

**How can I detect if any unnecessary public IPs are exposed?**

- Use traffic analytics to identify traffic flowing over public IPs. Provide this information to security engineers to ensure that no unnecessary public IPs are exposed.

**How can I verify that my network rules are configured correctly?**
- Follow the previous guidance for detecting any unexpected activity and then analyze your network rules to determine why such traffic is allowed.


## Developer

In addition to developing the application, the developer maintains the application running on the cluster. They're responsible for application specific traffic including application performance and failures and maintain reliability of the application according to company-defined SLAs.

:::image type="content" source="media/monitor-containers/layers-developer.png" alt-text="Diagram of Kubernetes layers for developer" lightbox="media/monitor-containers/layers-developer.png"  border="false":::


[Application insights](../app/app-insights-overview.md)


**How do I get started with Application insights?**

- See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from your application and decision criteria on the best method for your particular requirements.

**What are the poor performing apis or database queries?**

- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application 

**Where is my application bottleneck?**


**Is my application meeting my SLA?**

- View the SLA report in the **Failures** tab of Application insights.
- Use [annotations](../app/annotations.md) to identify when a new build is deployed so that you can visually inspect any change in performance after the update.

**If my application getinng errors**


**How can I setup telemetry/tracing to gain better observability into the interaction between services?**


**How should I set up health monitoring for my application?**

- Create an [Availability test](../app/availability-overview.md) in Application insights to create a recurring test to monitor the availability and responsiveness of your application.

**Where should I be sending my application logs, and where do I look for them?**

- Container insights sends stdout/stderr logs to a Log Analytics workspace in the XXX table. 
- App insights for additional logging including iLogger.


## Next steps

- For more information about AKS metrics, logs, and other important values, see [Monitoring AKS data reference](../../aks/monitor-aks-reference.md).

