---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Review guidance for monitoring all layers of your Kubernetes environment.
> - Use Azure Arc-enabled Kubernetes to monitor your clusters outside of Azure. 
> - Use Azure managed services for cloud native tools.
> - Integrate AKS clusters into your existing monitoring tools.
> - Use Azure policy to enable data collection from your Kubernetes cluster.


### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Review guidance for monitoring all layers of your Kubernetes environment. | [Monitor your Kubernetes cluster performance with Container insights](../containers/container-insights-analyze.md) includes guidance and best practices for monitoring your entire Kubernetes environment from the network, cluster, and application layers. |
| Use Azure Arc-enabled Kubernetes to monitor your clusters outside of Azure.  | [Azure Arc-enabled Kubernetes](../containers/container-insights-enable-arc-enabled-clusters.md) allows your Kubernetes clusters running in other clouds to be monitored using the same tools as your AKS clusters, including Container insights and Azure Monitor managed service for Prometheus. |
| Use Azure managed services for cloud native tools. | [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) and [Azure managed Grafana](../../managed-grafana/overview.md) support all the features of the cloud native tools Prometheus and Grafana without having to operate their underlying infrastructure. You can quickly provision these tools and onboard your Kubernetes clusters with minimal overhead. These services allow you to access an extensive library of community rules and dashboards to monitor your Kubernetes environment. |
| Integrate AKS clusters into your existing monitoring tools. | If you have an existing investment in Prometheus and Grafana, integrate your AKS clusters and Azure managed services into your existing environment using the guidance in [Monitor Kubernetes clusters using Azure services and cloud native tools](../containers/monitor-kubernetes.md). |
| Use Azure policy to enable data collection from your Kubernetes cluster. | Use [Azure Policy](../../governance/policy/overview.md) to enable data collection for enabling [Prometheus metrics](../essentials/prometheus-metrics-enable.md?tabs=azurepolicy), [Container insights](../containers/container-insights-enable-aks-policy.md), and [diagnostic settings](../essentials/diagnostic-settings-policy.md). This ensures that any new clusters are automatically monitored and enforces their monitoring configuration. |