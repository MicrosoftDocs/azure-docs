---
title: Overview of Container insights in Azure Monitor
description: This article describes Container insights, which monitors the AKS Container insights solution, and the value it delivers by monitoring the health of your AKS clusters and Container Instances in Azure.
ms.topic: conceptual
ms.custom: references_regions, ignite-2022
ms.date: 08/14/2023
ms.reviewer: viviandiec
---

# Container insights overview

Container insights is a feature of Azure Monitor that collects and analyzes container logs from [Azure Kubernetes clusters](../../aks/intro-kubernetes.md) or [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/overview.md) clusters and their components.  You can analyze the collected data for the different components in your cluster with a collection of [views](container-insights-analyze.md) and pre-built [workbooks](container-insights-reports.md). Container insights works with [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) for complete monitoring of your Kubernetes environment.


> [!IMPORTANT]
> By default, Container insights collects performance data from the cluster in addition to logs. This functionality has been replaced by [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). See [Configure data collection in Container insights using data collection rule](container-insights-data-collection-dcr.md) to disable collection of this data by Container insights save costs.


## Access Container insights

Access Container insights in the Azure portal from **Containers** in the **Monitor** menu or directly from the selected AKS cluster by selecting **Insights**. The Azure Monitor menu gives you the global perspective of all the containers that are deployed and monitored. This information allows you to search and filter across your subscriptions and resource groups. You can then drill into Container insights from the selected container. Access Container insights for a particular cluster from its page in the Azure portal.

:::image type="content" source="media/container-insights-overview/azmon-containers-experience.png" lightbox="media/container-insights-overview/azmon-containers-experience.png" alt-text="Screenshot that shows an overview of methods to access Container insights." border="false":::

 Container insights also lists your unmonitored clusters and allows you to quickly enable monitoring by both Container Insights and Managed Prometheus.

 :::image type="content" source="media/container-insights-overview/azmon-containers-experience.png" lightbox="media/container-insights-overview/azmon-containers-experience.png" alt-text="Screenshot that shows an overview of methods to access Container insights." border="false":::


## Data collected
Container insights sends data to [Logs](../logs/data-platform-logs.md) where you can analyze it using different features of Azure Monitor. It works with other Azure services such as [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md) and [Managed Grafana](../../managed-grafana/overview.md) for complete monitoring of your Kubernetes cluster and your container workloads. For more information on these other services, see [Monitoring data](../../aks/monitor-aks.md#monitoring-data).

:::image type="content" source="../../aks/media/monitor-aks/aks-monitor-data.png" lightbox="../../aks/media/monitor-aks/aks-monitor-data.png" alt-text="Diagram of collection of monitoring data from Kubernetes cluster using Container insights and related services.":::


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

>[!NOTE]
> Container insights support for Windows Server 2022 operating system is in public preview.


## Agent

Container insights and Managed Prometheus rely on a containerized [Azure Monitor agent](../agents/agents-overview.md) for Linux. This specialized agent collects performance and event data from all nodes in the cluster and sends it to a Log Analytics workspace. The agent is deployed and registered with the specified workspaces during deployment.

[Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) contain the definition of data that should be collected by Azure Monitor agent. 

- When you enable Container insights on a cluster, a DCR is created with the name `MSCI-<cluster-region>-<cluster-name>`. 
- When you enable Managed Prometheus on a cluster, a DCR is created with the name `MSProm-<cluster-region>-<cluster-name>`. 

### Agent version

Since March 1, 2023 Container insights uses a semver compliant agent version. The agent version is *mcr.microsoft.com/azuremonitor/containerinsights/ciprod:3.1.4* or later. It's represented by the format mcr.microsoft.com/azuremonitor/containerinsights/ciprod:\<semver compatible version\>. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on AKS. To track which versions are released, see [Agent release announcements](https://github.com/microsoft/Docker-Provider/blob/ci_prod/ReleaseNotes.md). 

> [!NOTE]
> Transformations are not currently supported with the [Container insights DCR](../essentials/data-collection-transformations.md).


### Log Analytics agent

When Container insights doesn't use managed identity authentication, it relies on a containerized [Log Analytics agent for Linux](../agents/log-analytics-agent.md). The agent version is *microsoft/oms:ciprod04202018* or later. It's represented by a date in the following format: *mmddyyyy*. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on AKS. To track which versions are released, see [Agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).

With the general availability of Windows Server support for AKS, an AKS cluster with Windows Server nodes has a preview agent installed as a daemon set pod on each individual Windows Server node to collect logs and forward them to Log Analytics. For performance metrics, a Linux node that's automatically deployed in the cluster as part of the standard deployment collects and forwards the data to Azure Monitor for all Windows nodes in the cluster.

> [!NOTE]
> If you've already deployed an AKS cluster and enabled monitoring by using either the Azure CLI or a Resource Manager template, you can't use `kubectl` to upgrade, delete, redeploy, or deploy the agent. The template needs to be deployed in the same resource group as the cluster.


## Frequently asked questions

This section provides answers to common questions.

**Is there support for collecting Kubernetes audit logs for ARO clusters?**
No. Container insights don't support collection of Kubernetes audit logs.

**Does Container Insights support pod sandboxing?**
Yes, Container Insights supports pod sandboxing through support for Kata Containers. For more details on pod sandboxing in AKS, [refer to the AKS docs](/azure/aks/use-pod-sandboxing).

## Next steps

To begin monitoring your Kubernetes cluster, review [Enable Container insights](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring.

<!-- LINKS - external -->
[aks-release-notes]: https://github.com/Azure/AKS/releases
