---
author: bwren
ms.author: bwren
ms.service: azure-monitor
ms.topic: include
ms.date: 03/30/2023
---

### Design checklist

> [!div class="checklist"]
> - Use managed identity authentication for your cluster to connect to Container insights.
> - Consider using Azure private link for your cluster to connect to your Azure Monitor workspace using a private endpoint.
> - Use traffic analytics to monitor network traffic to and from your cluster.
> - Enable network observability.
> - Ensure the security of the Log Analytics workspace supporting Container insights.


### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Use managed identity authentication for your cluster to connect to Container insights. | [Managed identity authentication](../containers/container-insights-authentication.md) is the default for new clusters. If you're using legacy authentication, you should [migrate to managed identity](../containers/container-insights-authentication.md#how-to-enable) to remove the certificate-based local authentication. |
| Consider using Azure private link for your cluster to connect to your Azure Monitor workspace using a private endpoint.| Azure managed service for Prometheus stores its data in an Azure Monitor workspace which uses a public endpoint by default. Connections to public endpoints are secured with end-to-end encryption. If you require a private endpoint, you can use [Azure private link](../logs/private-link-security.md) to allow your cluster to connect to the workspace through authorized private networks. Private link can also be used to force workspace data ingestion through ExpressRoute or a VPN.<br><br>See [Private Link for data ingestion for Managed Prometheus and Azure Monitor workspace](../essentials/private-link-data-ingestion.md) for details on configuring your cluster for private link. See [Use private endpoints for Managed Prometheus and Azure Monitor workspace](../essentials/azure-monitor-workspace-private-endpoint.md) for details on querying your data using private link. |
| Use traffic analytics to monitor network traffic to and from your cluster. | [Traffic analytics](../../network-watcher/traffic-analytics.md) analyzes Azure Network Watcher NSG flow logs to provide insights into traffic flow in your Azure cloud. Use this tool to ensure there's no data exfiltration for your cluster and to detect if any unnecessary public IPs are exposed. |
| Enable network observability. | [Network observability add-on for AKS](https://techcommunity.microsoft.com/t5/azure-observability-blog/comprehensive-network-observability-for-aks-through-azure/ba-p/3825852) provides observability across the multiple layers in the Kubernetes networking stack. monitor and observe access between services in the cluster (east-west traffic). |
| Ensure the security of the Log Analytics workspace supporting Container insights. | Container insights relies on a Log Analytics workspace. See [Best practices for Azure Monitor Logs](../best-practices-logs.md#security) for recommendations to ensure the security of the workspace. |

