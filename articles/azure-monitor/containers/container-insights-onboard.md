---
title: Enable Container insights
description: This article describes how to enable and configure Container insights so that you can understand how your container is performing and what performance-related issues have been identified. 
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 10/18/2023
ms.reviewer: viviandiec
---

# Enable Container insights

This article provides an overview of the requirements and options that are available for enabling [Container insights](../containers/container-insights-overview.md) on your Kubernetes clusters. You can enable Container insights for a new deployment or for one or more existing deployments of Kubernetes by using several supported methods.

## Supported configurations

Container insights supports the following environments:
- [Azure Kubernetes Service (AKS)](../../aks/index.yml)
- Following [Azure Arc-enabled Kubernetes cluster distributions](../../azure-arc/kubernetes/validation-program.md):
   - AKS on Azure Stack HCI
   - AKS Edge Essentials
   - Canonical
   - Cluster API Provider on Azure
   - K8s on Azure Stack Edge
   - Red Hat OpenShift version 4.x
   - SUSE Rancher (Rancher Kubernetes engine)
   - SUSE Rancher K3s
   - VMware (ie. TKG)

> [!NOTE]
> Container insights supports ARM64 nodes on AKS. See [Cluster requirements](../../azure-arc/kubernetes/system-requirements.md#cluster-requirements) for the details of Azure Arc-enabled clusters that support ARM64 nodes.


## Prerequisites

- Container insights stores its data in a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md). It supports workspaces in the regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). For a list of the supported mapping pairs to use for the default workspace, see [Region mappings supported by Container insights](container-insights-region-mapping.md). You can let the onboarding experience create a Log Analytics workspace in the default resource group of the AKS cluster subscription. If you already have a workspace, you'll probably want to use that one. For more information, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).
- Permissions
  - To enable Container insights, you require must have at least [Contributor](../../role-based-access-control/built-in-roles.md#contributor) access to the AKS cluster. 
  - To view data after container monitoring is enabled, you must have [Monitoring Reader](../roles-permissions-security.md#monitoring-reader) or [Monitoring Contributor](../roles-permissions-security.md#monitoring-contributor) role.

## Authentication

Container insights uses managed identity authentication. This authentication model has a monitoring agent that uses the cluster's managed identity to send data to Azure Monitor. Read more in [Authentication for Container Insights](container-insights-authentication.md) including guidance on migrating from legacy authentication models.

> [!Note] 
> [ContainerLogV2](container-insights-logging-v2.md) is the default schema when you onboard Container insights with using ARM, Bicep, Terraform, Policy and Portal onboarding. ContainerLogV2 can be explicitly enabled through CLI version 2.51.0 or higher using Data collection settings.


## Agent

Container insights relies on a containerized [Azure Monitor agent](../agents/agents-overview.md) for Linux. This specialized agent collects performance and event data from all nodes in the cluster and sends it to a Log Analytics workspace. The agent is automatically deployed and registered with the specified Log Analytics workspace during deployment.

### Data collection rule
[Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) contain the definition of data that should be collected by Azure Monitor agent.  When you enable Container insights on a cluster, a DCR is created with the name *MSCI-\<cluster-region\>-<\cluster-name\>*. Currently, this name can't be modified.

Since March 1, 2023 Container insights uses a semver compliant agent version. The agent version is *mcr.microsoft.com/azuremonitor/containerinsights/ciprod:3.1.4* or later. It's represented by the format mcr.microsoft.com/azuremonitor/containerinsights/ciprod:\<semver compatible version\>. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on AKS. To track which versions are released, see [Agent release announcements](https://github.com/microsoft/Docker-Provider/blob/ci_prod/ReleaseNotes.md). 

> [!NOTE]
> Ingestion Transformations are not currently supported with the [Container insights DCR](../essentials/data-collection-transformations.md).


### Log Analytics agent

When Container insights doesn't use managed identity authentication, it relies on a containerized [Log Analytics agent for Linux](../agents/log-analytics-agent.md). The agent version is *microsoft/oms:ciprod04202018* or later. It's represented by a date in the following format: *mmddyyyy*. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on AKS. To track which versions are released, see [Agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).

With the general availability of Windows Server support for AKS, an AKS cluster with Windows Server nodes has a preview agent installed as a daemonset pod on each individual Windows Server node to collect logs and forward them to Log Analytics. For performance metrics, a Linux node that's automatically deployed in the cluster as part of the standard deployment collects and forwards the data to Azure Monitor for all Windows nodes in the cluster.

> [!NOTE]
> If you've already deployed an AKS cluster and enabled monitoring by using either the Azure CLI or a Resource Manager template, you can't use `kubectl` to upgrade, delete, redeploy, or deploy the agent. The template needs to be deployed in the same resource group as the cluster.


## Differences between Windows and Linux clusters

The main differences in monitoring a Windows Server cluster compared to a Linux cluster include:

- Windows doesn't have a Memory RSS metric. As a result, it isn't available for Windows nodes and containers. The [Working Set](/windows/win32/memory/working-set) metric is available.
- Disk storage capacity information isn't available for Windows nodes.
- Only pod environments are monitored, not Docker environments.
- With the preview release, a maximum of 30 Windows Server containers are supported. This limitation doesn't apply to Linux containers.

>[!NOTE]
> Container insights support for the Windows Server 2022 operating system is in preview.


The containerized Linux agent (replicaset pod) makes API calls to all the Windows nodes on Kubelet secure port (10250) within the cluster to collect node and container performance-related metrics. Kubelet secure port (:10250) should be opened in the cluster's virtual network for both inbound and outbound for Windows node and container performance-related metrics collection to work.

If you have a Kubernetes cluster with Windows nodes, review and configure the network security group and network policies to make sure the Kubelet secure port (:10250) is open for both inbound and outbound in the cluster's virtual network.


## Network firewall requirements

The following table lists the proxy and firewall configuration information required for the containerized agent to communicate with Container insights. All network traffic from the agent is outbound to Azure Monitor.

**Azure public cloud**

| Endpoint |Port |
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

| Endpoint | Purpose | Port | 
|--------------|------|-------------|
| `*.ods.opinsights.azure.us` | Data ingestion | 443 |
| `*.oms.opinsights.azure.us` | OMS onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |

The following table lists the extra firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.us` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.us` | Fetch data collection rules for specific AKS cluster | 443 |


## Troubleshooting
If you registered your cluster and/or configured HCI Insights before November 2023, features that use the AMA agent on HCI, such as Arc for Servers Insights, VM Insights, Container Insights, Defender for Cloud or Sentinel might not be collecting logs and event data properly. See [Repair AMA agent for HCI](/azure-stack/hci/manage/monitor-hci-single?tabs=22h2-and-later) for steps to reconfigure the AMA agent and HCI Insights.

## Next steps

After you've enabled monitoring, you can begin analyzing the performance of your Kubernetes clusters that are hosted on AKS, Azure Stack, or another environment.

To learn how to use Container insights, see [View Kubernetes cluster performance](container-insights-analyze.md).


