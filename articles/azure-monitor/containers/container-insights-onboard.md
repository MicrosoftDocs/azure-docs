---

title: Enable Container insights
description: This article describes how to enable and configure Container insights so that you can understand how your container is performing and what performance-related issues have been identified. 
ms.topic: conceptual
ms.date: 08/29/2022
ms.reviewer: viviandiec
---

# Enable Container insights
This article provides an overview of the requirements and options that are available for configuring Container insights to monitor the performance of workloads that are deployed to Kubernetes environments. You can enable Container insights for a new deployment or for one or more existing deployments of Kubernetes by using a number of supported methods.

## Supported configurations
Container insights supports the following environments:

- [Azure Kubernetes Service (AKS)](../../aks/index.yml)  
- [Azure Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md)
   - [Azure Stack](/azure-stack/user/azure-stack-kubernetes-aks-engine-overview) or on-premises
   - [AKS engine](https://github.com/Azure/aks-engine)
   - [Red Hat OpenShift](https://docs.openshift.com/container-platform/4.3/welcome/index.html) version 4.x

## Supported Kubernetes versions
The versions of Kubernetes and support policy are the same as those [supported in Azure Kubernetes Service (AKS)](../../aks/supported-kubernetes-versions.md).

>[!NOTE]
> Container insights support for Windows Server 2022 operating system in public preview.

## Prerequisites
Before you start, make sure that you've met the following requirements:

**Log Analytics workspace**
Container insights stores its data in a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md). It supports workspaces in the regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). For a list of the supported mapping pairs to use for the default workspace, see [Region mappings supported by Container insights](container-insights-region-mapping.md).

You can let the onboarding experience create a default workspace in the default resource group of the AKS cluster subscription. If you already have a workspace though, then you will most likely want to use that one. See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for details.

An AKS cluster can be attached to a Log Analytics workspace in a different Azure subscription in the same Azure AD Tenant. This cannot currently be done with the Azure portal, but can be done with Azure CLI or Resource Manager template.


**Permissions**
To enable container monitoring, you require the following permissions:

- Member of the [Log Analytics contributor](../logs/manage-access.md#azure-rbac) role.
- Member of the [*Owner* group](../../role-based-access-control/built-in-roles.md#owner) on any AKS cluster resources.

To enable container monitoring, you require the following permissions:

- Member of [Log Analytics reader](../logs/manage-access.md#azure-rbac) role if you aren't already a member of [Log Analytics contributor](../logs/manage-access.md#azure-rbac).

**Prometheus**
Prometheus metrics aren't collected by default. Before you [configure the agent](container-insights-prometheus-integration.md) to collect the metrics, it's important to review the [Prometheus documentation](https://prometheus.io/) to understand what data can be scraped and what methods are supported.

**Kubelet secure port**
Log Analytics Containerized Linux Agent (replicaset pod) makes API calls to all the Windows nodes on Kubelet Secure Port (10250) within the cluster to collect Node and Container Performance related Metrics. Kubelet secure port (:10250) should be opened in the cluster's virtual network for both inbound and outbound for Windows Node and container performance related metrics collection to work.

If you have a Kubernetes cluster with Windows nodes, then please review and configure the Network Security Group and Network Policies to make sure the Kubelet secure port (:10250) is opened for both inbound and outbound in cluster's virtual network.



## Network firewall requirements

The following table lists the proxy and firewall configuration information that's required for the containerized agent to communicate with Container insights. All network traffic from the agent is outbound to Azure Monitor.

**Azure public cloud**

|Agent resource|Port |
|--------------|------|
| `*.ods.opinsights.azure.com` | 443 |
| `*.oms.opinsights.azure.com` | 443 |
| `dc.services.visualstudio.com` | 443 |
| `*.monitoring.azure.com` | 443 |
| `login.microsoftonline.com` | 443 |

The following table lists the additional firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.com` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.com` | Fetch data collection rules for specific AKS cluster | 443 |

**Azure China 21Vianet cloud**

The following table lists the proxy and firewall configuration information for Azure China 21Vianet:

|Agent resource| Purpose | Port | 
|--------------|------|-------------|
| `*.ods.opinsights.azure.cn` | Data ingestion | 443 |
| `*.oms.opinsights.azure.cn` | OMS onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |


The following table lists the additional firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.cn` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.cn` | Fetch data collection rules for specific AKS cluster | 443 |

**Azure Government cloud**

The following table lists the proxy and firewall configuration information for Azure US Government:

|Agent resource| Purpose | Port | 
|--------------|------|-------------|
| `*.ods.opinsights.azure.us` | Data ingestion | 443 |
| `*.oms.opinsights.azure.us` | OMS onboarding | 443 |
| `dc.services.visualstudio.com` | For agent telemetry that uses Azure Public Cloud Application Insights | 443 |

The following table lists the additional firewall configuration required for managed identity authentication.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.us` | Access control service | 443 |
| `<cluster-region-name>.handler.control.monitor.azure.us` | Fetch data collection rules for specific AKS cluster | 443 |


## Authentication
Container Insights now supports authentication using managed identity (preview). This is a secure and simplified authentication model where the monitoring agent uses the cluster’s managed identity to send data to Azure Monitor. It replaces the existing legacy certificate-based local authentication and removes the requirement of adding a *Monitoring Metrics Publisher* role to the cluster.

> [!NOTE]
> Container Insights preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. Container Insights previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use. For more information, see [Frequently asked questions about Azure Kubernetes Service (AKS)](../../aks/faq.md).

## Agent

### Azure Monitor agent
When using managed identity authentication (preview), Container insights relies on a containerized Azure Monitor agent for Linux. This specialized agent collects performance and event data from all nodes in the cluster, and the agent is automatically deployed and registered with the specified Log Analytics workspace during deployment. 


### Log Analytics agent 
When not using managed identity authentication, Container insights relies on a containerized Log Analytics agent for Linux. This specialized agent collects performance and event data from all nodes in the cluster, and the agent is automatically deployed and registered with the specified Log Analytics workspace during deployment. 

The agent version is *microsoft/oms:ciprod04202018* or later, and it's represented by a date in the following format: *mmddyyyy*. When a new version of the agent is released, it's automatically upgraded on your managed Kubernetes clusters that are hosted on Azure Kubernetes Service (AKS). To track which versions are released, see [agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).


>[!NOTE]
>With the general availability of Windows Server support for AKS, an AKS cluster with Windows Server nodes has a preview agent installed as a daemonset pod on each individual Windows server node to collect logs and forward it to Log Analytics. For performance metrics, a Linux node that's automatically deployed in the cluster as part of the standard deployment collects and forwards the data to Azure Monitor on behalf all Windows nodes in the cluster.


> [!NOTE]
> If you've already deployed an AKS cluster and enabled monitoring using either the Azure CLI or a Azure Resource Manager template, you can't use `kubectl` to upgrade, delete, redeploy, or deploy the agent. The template needs to be deployed in the same resource group as the cluster.

## Installation options
To enable Container insights, use one of the methods that's described in the following table:

| Deployment state | Method |
|------------------|--------|
| New Kubernetes cluster | [Enable monitoring for a new AKS cluster using the Azure CLI](../../aks/learn/quick-kubernetes-deploy-cli.md) |
| | [Enable for a new AKS cluster by using the open-source tool Terraform](container-insights-enable-new-cluster.md#enable-using-terraform)|
| Existing AKS cluster | [Enable monitoring for an existing AKS cluster using the Azure CLI](container-insights-enable-existing-clusters.md?tabs=azure-powershell) | 
| | [Enable for an existing AKS cluster using Terraform](container-insights-enable-existing-clusters.md?tabs=terraform) |
| | [Enable for an existing AKS cluster from Azure Monitor portal](container-insights-enable-existing-clusters.md?tabs=portal-azure-monitor)| 
| | [Enable  directly from an AKS cluster in the Azure portal](container-insights-enable-existing-clusters.md?tabs=portal-aks)|
| | [Enable for AKS cluster using an Azure Resource Manager template](container-insights-enable-existing-clusters.md?tabs=aks)| 
| Existing non-AKS Kubernetes cluster | [Enable for non-AKS Kubernetes cluster hosted outside of Azure and enabled with Azure Arc using the Azure CLI](container-insights-enable-arc-enabled-clusters.md?tabs=create-cli#create-extension-instance). |
| | [Enable for non-AKS Kubernetes cluster hosted outside of Azure and enabled with Azure Arc using a preconfigured Azure Resource Manager template](container-insights-enable-arc-enabled-clusters.md?tabs=create-arm#create-extension-instance) |
| | [Enable for non-AKS Kubernetes cluster hosted outside of Azure and enabled with Azure Arc from the multicluster page Azure Monitor](container-insights-enable-arc-enabled-clusters.md?tabs=create-portal#create-extension-instance) | 

## Next steps
Once you've enabled monitoring, you can begin analyzing the performance of your Kubernetes clusters that are hosted on Azure Kubernetes Service (AKS), Azure Stack, or another environment. To learn how to use Container insights, see [View Kubernetes cluster performance](container-insights-analyze.md).

