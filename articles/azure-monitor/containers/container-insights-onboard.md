---

title: Enable Container insights
description: This article describes how to enable and configure Container insights so that you can understand how your container is performing and what performance-related issues have been identified. 
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Enable Container insights

This article provides an overview of the requirements and options that are available for configuring Container insights to monitor the performance of workloads that are deployed to Kubernetes environments. You can enable Container insights for a new deployment or for one or more existing deployments of Kubernetes by using several supported methods.

## Supported configurations

Container insights supports the following environments:

- [Azure Kubernetes Service (AKS)](../../aks/index.yml)
- [Azure Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md)
   - [Azure Stack](/azure-stack/user/azure-stack-kubernetes-aks-engine-overview) or on-premises
   - [AKS engine](https://github.com/Azure/aks-engine)
   - [Red Hat OpenShift](https://docs.openshift.com/container-platform/latest/welcome/index.html) version 4.x

The versions of Kubernetes and support policy are the same as those versions [supported in AKS](../../aks/supported-kubernetes-versions.md).

### Differences between Windows and Linux clusters

The main differences in monitoring a Windows Server cluster compared to a Linux cluster include:

- Windows doesn't have a Memory RSS metric. As a result, it isn't available for Windows nodes and containers. The [Working Set](/windows/win32/memory/working-set) metric is available.
- Disk storage capacity information isn't available for Windows nodes.
- Only pod environments are monitored, not Docker environments.
- With the preview release, a maximum of 30 Windows Server containers are supported. This limitation doesn't apply to Linux containers.

>[!NOTE]
> Container insights support for the Windows Server 2022 operating system is in preview.

## Installation options

- [AKS cluster](container-insights-enable-aks.md)
- [AKS cluster with Azure Policy](container-insights-enable-aks-policy.md)
- [Azure Arc-enabled cluster](container-insights-enable-arc-enabled-clusters.md)
- [Hybrid Kubernetes clusters](container-insights-hybrid-setup.md)

## Prerequisites

Before you start, make sure that you've met the following requirements:

### Log Analytics workspace

Container insights stores its data in a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md). It supports workspaces in the regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). For a list of the supported mapping pairs to use for the default workspace, see [Region mappings supported by Container insights](container-insights-region-mapping.md).

You can let the onboarding experience create a Log Analytics workspace in the default resource group of the AKS cluster subscription. If you already have a workspace, you'll probably want to use that one. For more information, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).

 You can attach an AKS cluster to a Log Analytics workspace in a different Azure subscription in the same Azure Active Directory tenant. Currently, you can't do it with the Azure portal, but you can use the Azure CLI or an Azure Resource Manager template.

### Azure Monitor workspace (preview)

If you're going to configure the cluster to [collect Prometheus metrics](container-insights-prometheus.md) with [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md), you must have an Azure Monitor workspace where Prometheus metrics are stored. You can let the onboarding experience create an Azure Monitor workspace in the default resource group of the AKS cluster subscription or use an existing Azure Monitor workspace.

### Permissions

To enable container monitoring, you require the following permissions:

- You must be a member of the [Log Analytics contributor](../logs/manage-access.md#azure-rbac) role.
- You must be a member of the [*Owner* group](../../role-based-access-control/built-in-roles.md#owner) on any AKS cluster resources.

To view data after container monitoring is enabled, you require the following permissions:

- You must be a member of the [Log Analytics reader](../logs/manage-access.md#azure-rbac) role if you aren't already a member of the [Log Analytics contributor](../logs/manage-access.md#azure-rbac) role.

### Kubelet secure port

The containerized Linux agent (replicaset pod) makes API calls to all the Windows nodes on Kubelet secure port (10250) within the cluster to collect node and container performance-related metrics. Kubelet secure port (:10250) should be opened in the cluster's virtual network for both inbound and outbound for Windows node and container performance-related metrics collection to work.

If you have a Kubernetes cluster with Windows nodes, review and configure the network security group and network policies to make sure the Kubelet secure port (:10250) is opened for both inbound and outbound in the cluster's virtual network.

## Authentication

Container insights defaults to managed identity authentication. This secure and simplified authentication model has a monitoring agent that uses the cluster's managed identity to send data to Azure Monitor. It replaces the existing legacy certificate-based local authentication and removes the requirement of adding a *Monitoring Metrics Publisher* role to the cluster. Read more in [Authentication for Container Insights](container-insights-authentication.md)

## Agent

This section reviews the agents used by Container insights.

### Azure Monitor agent

When Container insights uses managed identity authentication (in preview), it relies on a containerized Azure Monitor agent for Linux. This specialized agent collects performance and event data from all nodes in the cluster. The agent is automatically deployed and registered with the specified Log Analytics workspace during deployment.

### Log Analytics agent

When Container insights doesn't use managed identity authentication, it relies on a containerized Log Analytics agent for Linux. This specialized agent collects performance and event data from all nodes in the cluster. The agent is automatically deployed and registered with the specified Log Analytics workspace during deployment.

The agent version is *microsoft/oms:ciprod04202018* or later. It's represented by a date in the following format: *mmddyyyy*. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on AKS. To track which versions are released, see [Agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).

With the general availability of Windows Server support for AKS, an AKS cluster with Windows Server nodes has a preview agent installed as a daemonset pod on each individual Windows Server node to collect logs and forward them to Log Analytics. For performance metrics, a Linux node that's automatically deployed in the cluster as part of the standard deployment collects and forwards the data to Azure Monitor for all Windows nodes in the cluster.

> [!NOTE]
> If you've already deployed an AKS cluster and enabled monitoring by using either the Azure CLI or a Resource Manager template, you can't use `kubectl` to upgrade, delete, redeploy, or deploy the agent. The template needs to be deployed in the same resource group as the cluster.

## Network firewall requirements

The following table lists the proxy and firewall configuration information required for the containerized agent to communicate with Container insights. All network traffic from the agent is outbound to Azure Monitor.

**Azure public cloud**

|Agent resource|Port |
|--------------|------|
| `*.ods.opinsights.azure.com` | 443 |
| `*.oms.opinsights.azure.com` | 443 |
| `dc.services.visualstudio.com` | 443 |
| `*.monitoring.azure.com` | 443 |
| `login.microsoftonline.com` | 443 |

The following table lists the extra firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.com` | Access control service | 443 |
| `<cluster-region-name>.ingest.monitor.azure.com` | Azure monitor managed service for Prometheus - metrics ingestion endpoint (DCE) | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.com` | Fetch data collection rules for specific AKS cluster | 443 |

**Microsoft Azure operated by 21Vianet cloud**

The following table lists the proxy and firewall configuration information for Azure operated by 21Vianet.

|Agent resource| Purpose | Port | 
|--------------|------|-------------|
| `*.ods.opinsights.azure.cn` | Data ingestion | 443 |
| `*.oms.opinsights.azure.cn` | OMS onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |

The following table lists the extra firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.cn` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.cn` | Fetch data collection rules for specific AKS cluster | 443 |

**Azure Government cloud**

The following table lists the proxy and firewall configuration information for Azure US Government.

|Agent resource| Purpose | Port | 
|--------------|------|-------------|
| `*.ods.opinsights.azure.us` | Data ingestion | 443 |
| `*.oms.opinsights.azure.us` | OMS onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |

The following table lists the extra firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.us` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.us` | Fetch data collection rules for specific AKS cluster | 443 |

## Next steps

After you've enabled monitoring, you can begin analyzing the performance of your Kubernetes clusters that are hosted on AKS, Azure Stack, or another environment.

To learn how to use Container insights, see [View Kubernetes cluster performance](container-insights-analyze.md).
