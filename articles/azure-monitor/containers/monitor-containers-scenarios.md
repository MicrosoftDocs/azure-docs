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


## Personas

| Persona | Levels | Description |
|:---|:---|:---|
| [Platform Engineer / Cluster admin](#platform-engineer) | 1-3 | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](#developer) | 4 | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](#network-engineer) | 5 | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Platform Engineer
The cluster administrator, also known as the platform engineer, is responsible for the Kubernetes cluster. They provision and maintain the platform used by developers. They need to understand the health of the cluster and its components, and be able to troubleshoot issues. They also need to understand the cost of the cluster and its components, and be able to allocate costs to different teams.


**What is the most cost effective way to setup logging and metrics?**

- See [Enable Container insights](../containers/container-insights-onboard.md) for details on the different options for enabling Container insights.
- Reduce your cost for Container insights data ingestion by reducing the amount of data that's collected. See [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) for details.
- [Enable the ContainerLogV2](container-insights-logging-v2.md) schema for improved query experience and reduce collection costs. 
- Use [Enable cost optimization settings in Container insights (preview)](../containers/container-insights-cost-config.md) to remove collection of metrics since these are the same metrics being collection in Prometheus. In this case, you would use Grafana for visualization since the Container insights workbooks use data from the Log Analytics workspace. Container insights in this case would only be used for log collection.
- Consider configuring ContainerLogV2 as [basic logs](../logs/basic-logs-configure.md).

**How do I keep costs to a minimum when using AKS and its larger ecosystem?**<br>
The cluster administrator needs to ensure that the cluster is being run efficiently and using the full capacity of the nodes. They want to ensure that they're densely packing workloads, using fewer large nodes as opposed to many smaller nodes. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data to Azure storage that the administrator can use for these decisions.


**How do I do charge back to different lines of business for their relative usage?**<br>
The cluster administrator may be tasked with allocating the cost of the cluster to different teams based on their relative usage, and the need appropriate breakdowns of relative usage in order to perform this chargeback. [OpenCost](https://www.opencost.io/docs/azure-opencost) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to [customer-specific Azure pricing](https://www.opencost.io/docs/azure-prices) to Azure storage that the administrator can use for this requirement.

**Do I have to use Azure's monitoring and logging or can I bring my own?**<br>
Azure provides a complete set of services for collecting and analysing your Kubernetes logs. Container insights collects container stdout, stderr, and infrastructure logs, while you can create diagnostic settings to collect control plan logs for AKS. All logs are stored in a Log Analytics workspace where they can be analyzed using Kusto Query Language (KQL) or visualized in managed Grafana. 

If you have an existing investment in another tool to collect and analyze Kubernetes logs, then use the Data Export feature of Log Analytics workspace to send AKS logs to Event Hub and forward to alternate system. 

**How can I monitor that my upgrade was successful?**<br>
Any configuration activities for AKS are logged in the Activity log. When you send the Activity log to a Log Analytics workspace you can analyze it with KQL. The following sample query can be used to return records identifying a successful upgrade. 

``` kql
AzureActivity
| where CategoryValue == "Administrative"
| where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
| extend properties=parse_json(Properties_d) 
| where properties.message == "Upgrade Succeeded"
| order by TimeGenerated desc
```

**How do I monitor attached storage?**

**How do I monitor and observe access between services in the cluster (east-west traffic)?**<br>
For AKS clusters, see the new [Network Observability add-on for AKS](https://techcommunity.microsoft.com/t5/azure-observability-blog/comprehensive-network-observability-for-aks-through-azure/ba-p/3825852) which provides observability across the multiple layers in the Kubernetes networking stack.

**How to monitor relevant infrastructure (load balancer SNAT, OS disk queue, host memory)?**


**How do I configure alerting? What alerts should be created for different components?**

**Do I have to use Azure alerting or can I bring my own?**

**Which images are currently used inside the cluster?**

## Fleet Architect
The Fleet Architect is similar to the cluster administrator but is responsible for multiple clusters. They need visibility across the entire environment and must perform administrative tasks at scale. 

**How can I monitor the health of multiple clusters?**<br>
Open **Containers** from the **Monitor** menu in the Azure portal to view the status of all your clustered monitored by Container insights.

**How can I monitor overall patch status of the clusters?**<br>
This information is available in the Activity log. 

``` kql
AzureActivity
| where CategoryValue == "Administrative"
| where OperationNameValue == "MICROSOFT.CONTAINERSERVICE/MANAGEDCLUSTERS/WRITE"
| extend properties=parse_json(Properties_d) 
| where properties.message == "Upgrade Succeeded"
| order by TimeGenerated desc
```

**How can I ensure that developers are following best practices?**

**How can I discover application inventory in the fleet with version and stage?**


## Network Engineer

**How do I know if my network is configured correctly and there's no data exfiltration?**
Use Network Watcher to collect flow logs and traffic analytics to visualize.

**Which public IPs are being used/consumed to share with a Security Engineer to help enforce there are no unnecessary public IPs being exposed?**

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




## Criteria

While Azure provides a complete set of services for monitoring your Kubernetes infrastructure and applications, you may have existing investments on other platforms. Use the following guidance if  

| Tool | Criteria |
|:---|:---|
| Prometheus | If you have an existing Prometheus environment, use Azure Monitor managed service for Prometheus for your AKS clusters and configure remote-write to send data to your existing environment. |
| Grafana | If you have an existing Grafana environment, then configure appropriate Prometheus environment as a data source. |
| Kubernetes and control plane logs | If you have an existing solution for collection of logs, either follow the guidance for that tool or enable Container insights and use the Data Export feature of Log Analytics workspace to send data to Event Hub and forward to alternate system. |