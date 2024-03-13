---
title: Network firewall requirements for monitoring Kubernetes cluster
description: Proxy and firewall configuration information required for the containerized agent to communicate with Managed Prometheus and Container insights.
ms.topic: conceptual
ms.date: 11/14/2023
ms.reviewer: aul
---

# Network firewall requirements for monitoring Kubernetes cluster

The following table lists the proxy and firewall configuration information required for the containerized agent to communicate with Managed Prometheus and Container insights. All network traffic from the agent is outbound to Azure Monitor.

## Azure public cloud

| Endpoint| Purpose | Port |
|:---|:---|:---|
| `*.ods.opinsights.azure.com` | | 443 |
| `*.oms.opinsights.azure.com` | | 443 |
| `dc.services.visualstudio.com` | | 443 |
| `*.monitoring.azure.com` | | 443 |
| `login.microsoftonline.com` | | 443 |
| `global.handler.control.monitor.azure.com` | Access control service | 443 |
| `<cluster-region-name>.ingest.monitor.azure.com` | Azure monitor managed service for Prometheus - metrics ingestion endpoint (DCE) | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.com` | Fetch data collection rules for specific cluster | 443 |

## Microsoft Azure operated by 21Vianet cloud

| Endpoint| Purpose | Port |
|:---|:---|:---|
| `*.ods.opinsights.azure.cn` | Data ingestion | 443 |
| `*.oms.opinsights.azure.cn` | Azure Monitor agent (AMA) onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |
| `global.handler.control.monitor.azure.cn` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.cn` | Fetch data collection rules for specific cluster | 443 |

## Azure Government cloud

| Endpoint| Purpose | Port |
|:---|:---|:---|
| `*.ods.opinsights.azure.us` | Data ingestion | 443 |
| `*.oms.opinsights.azure.us` | Azure Monitor agent (AMA) onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |
| `global.handler.control.monitor.azure.us` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.us` | Fetch data collection rules for specific cluster | 443 |


## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
