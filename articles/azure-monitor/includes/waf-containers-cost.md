---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Don't enable Container insights collection of Prometheus metrics.
> - Configure agent collection to modify data collection in Container insights.
> - Modify settings for collection of metric data by Container insights.
> - Disable Container insights collection of metric data if you don't use the Container insights experience in the Azure portal.
> - If you don't query the container logs table regularly or use it for alerts, configure it as basic logs.
> - Limit collection of resource logs you don't need.
> - Use resource-specific logging for AKS resource logs and configure tables as basic logs.
> - Use OpenCost to collect details about your Kubernetes costs.

### Configuration recommendations


| Recommendation | Benefit |
|:---|:---|
| Don't enable Container insights collection of Prometheus metrics in Log Analytics workspace if you've enabled scraping of metrics with Prometheus.  | In addition to scraping Prometheus metrics from your cluster using [Azure Monitor managed service for Prometheus](../containers/prometheus-metrics-enable.md), you can configure Container insights to [collect Prometheus metrics in your Log Analytics workspace](../containers/container-insights-prometheus-logs.md). This is redundant with the data in Managed Prometheus and will result in additional cost. |
| Configure agent to modify data collection in Container insights. |  Analyze the data collected by Container insights as described in [Controlling ingestion to reduce cost](../containers/container-insights-cost.md#control-ingestion-to-reduce-cost) and adjust your configuration to stop collection of data you don't need. |
| Modify settings for collection of metric data by Container insights. | See [Enable cost optimization settings](../containers/container-insights-cost-config.md) for details on modifying both the frequency that metric data is collected and the namespaces that are collected by  Container insights. |
| Disable Container insights collection of metric data if you don't use the Container insights experience in the Azure portal. | Container insights collects many of the same metric values as [Managed Prometheus](../containers/prometheus-metrics-enable.md). You can disable collection of these metrics by configuring Container insights to only collect **Logs and events** as described in [Enable cost optimization settings in Container insights](../containers/container-insights-cost-config.md#enable-cost-settings). This configuration disables the Container insights experience in the Azure portal, but you can use Grafana to visualize Prometheus metrics and Log Analytics to analyze log data collected by Container insights. |
| If you don't query the container logs table regularly or use it for alerts, configure it as basic logs. | [Convert your Container insights schema to ContainerLogV2](../containers/container-insights-logging-v2.md) which is compatible with Basic logs and can provide significant cost savings as described in [Controlling ingestion to reduce cost](../containers/container-insights-cost.md#configure-basic-logs). |
| Limit collection of resource logs you don't need. | Control plane logs for AKS clusters are implemented as resource logs in Azure Monitor. [Create a diagnostic setting](../../aks/monitor-aks.md#aks-control-planeresource-logs) to send this data to a Log Analytics workspace. See [Collect control plane logs for AKS clusters](../containers/monitor-kubernetes.md#collect-control-plane-logs-for-aks-clusters) for recommendations on which categories you should collect. | 
| Use resource-specific logging for AKS resource logs and configure tables as basic logs. | AKS supports either Azure diagnostics mode or resource-specific mode for [resource logs](../../aks/monitor-aks.md#aks-control-planeresource-logs). Specify resource logs to enable the option to configure the tables for [basic logs](../logs/basic-logs-configure.md), which provide a reduced ingestion charge for logs that you only occasionally query and don't use for alerting. |
| Use OpenCost to collect details about your Kubernetes costs. | [OpenCost](https://www.opencost.io/docs/configuration/azure) is an open-source, vendor-neutral CNCF sandbox project for understanding your Kubernetes costs and supporting your ability to for AKS cost visibility. It exports detailed costing data in addition to customer-specific Azure pricing to Azure storage to assist the cluster administrator in analyzing and categorizing costs. |

