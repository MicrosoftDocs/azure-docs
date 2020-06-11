---
title: How to enable Azure Monitor for containers | Microsoft Docs
description: This article describes how you enable and configure Azure Monitor for containers so you can understand how your container is performing and what performance-related issues have been identified. 
ms.topic: conceptual
ms.date: 05/28/2020

---

# How to enable Azure Monitor for containers

This article provides an overview of the options available to setup Azure Monitor for containers to monitor the performance of workloads that are deployed to Kubernetes environments and hosted on:

- [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/) (AKS)

- Self-managed Kubernetes clusters hosted on Azure using [AKS Engine](https://github.com/Azure/aks-engine).

- Self-managed Kubernetes clusters hosted on [Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1910) or on-premises using AKS Engine.

- [Azure Red Hat OpenShift](../../openshift/intro-openshift.md) version 3.x and 4.x

- [Red Hat OpenShift](https://docs.openshift.com/container-platform/4.3/welcome/index.html) version 4.x

Azure Monitor for containers can be enabled for new, or one or more existing deployments of Kubernetes using the following supported methods:

- From the Azure portal, Azure PowerShell, or with Azure CLI

- Using [Terraform and AKS](../../terraform/terraform-create-k8s-cluster-with-tf-and-aks.md)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

Before you start, make sure that you have the following:

- **A Log Analytics workspace.**

    Azure Monitor for containers supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor).

    You can create a workspace when you enable monitoring of your new AKS cluster or let the onboarding experience create a default workspace in the default resource group of the AKS cluster subscription. If you chose to create it yourself, you can create it through [Azure Resource Manager](../platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../learn/quick-create-workspace.md). For a list of the supported mapping pairs used for the default workspace, see [Region mapping for Azure Monitor for containers](container-insights-region-mapping.md).

- You are a member of the **Log Analytics contributor role** to enable container monitoring. For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../platform/manage-access.md).

- You are a member of the **[Owner](../../role-based-access-control/built-in-roles.md#owner)** role on the AKS cluster resource.

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

* Prometheus metrics are not collected by default. Before [configuring the agent](container-insights-prometheus-integration.md) to collect them, it is important you review the Prometheus [documentation](https://prometheus.io/) to understand what can be scraped and methods supported.

## Supported configurations

The following is officially supported with Azure Monitor for containers.

- Environments: Azure Red Hat OpenShift, Kubernetes on-premises, and AKS Engine on Azure and Azure Stack. For more information, see [AKS Engine on Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1908).
- Versions of Kubernetes and support policy are the same as versions of [AKS supported](../../aks/supported-kubernetes-versions.md). 

## Network firewall requirements

The information in the following table lists the proxy and firewall configuration information required for the containerized agent to communicate with Azure Monitor for containers. All network traffic from the agent is outbound to Azure Monitor.

|Agent Resource|Ports |
|--------------|------|
| *.ods.opinsights.azure.com | 443 |  
| *.oms.opinsights.azure.com | 443 |
| dc.services.visualstudio.com | 443 |
| *.monitoring.azure.com | 443 |
| login.microsoftonline.com | 443 |

The information in the following table lists the proxy and firewall configuration information for Azure China.

|Agent Resource|Ports |Description | 
|--------------|------|-------------|
| *.ods.opinsights.azure.cn | 443 | Data ingestion |
| *.oms.opinsights.azure.cn | 443 | OMS onboarding |
| dc.services.visualstudio.com | 443 | For for agent telemetry using Azure Public Cloud Application Insights. |

The information in the following table lists the proxy and firewall configuration information for Azure US Government.

|Agent Resource|Ports |Description | 
|--------------|------|-------------|
| *.ods.opinsights.azure.us | 443 | Data ingestion |
| *.oms.opinsights.azure.us | 443 | OMS onboarding |
| dc.services.visualstudio.com | 443 | For agent telemetry using Azure Public Cloud Application Insights. |

## Components

Your ability to monitor performance relies on a containerized Log Analytics agent for Linux specifically developed for Azure Monitor for containers. This specialized agent collects performance and event data from all nodes in the cluster, and the agent is automatically deployed and registered with the specified Log Analytics workspace during deployment. The  agent version is microsoft/oms:ciprod04202018 or later, and is represented by a date in the following format: *mmddyyyy*.

>[!NOTE]
>With the preview release of Windows Server support for AKS, an AKS cluster with Windows Server nodes do not have an agent installed to collect data and forward to Azure Monitor. Instead, a Linux node automatically deployed in the cluster as part of the standard deployment collects and forwards the data to Azure Monitor on behalf all Windows nodes in the cluster.  
>

When a new version of the agent is released, it is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). To follow the versions released, see [agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).

>[!NOTE]
>If you have already deployed an AKS cluster, you enable monitoring by using either Azure CLI or a provided Azure Resource Manager template, as demonstrated later in this article. You cannot use `kubectl` to upgrade, delete, re-deploy, or deploy the agent.
>The template needs to be deployed in the same resource group as the cluster.

You enable Azure Monitor for containers by using one of the following methods described in the following table.

| Deployment State | Method | Description |
|------------------|--------|-------------|
| New AKS Kubernetes cluster | [Create AKS cluster using Azure CLI](../../aks/kubernetes-walkthrough.md#create-aks-cluster)| You can enable monitoring of a new AKS cluster that you create with Azure CLI. |
| | [Create AKS cluster using Terraform](container-insights-enable-new-cluster.md#enable-using-terraform)| You can enable monitoring of a new AKS cluster that you create using the open-source tool Terraform. |
| | [Create OpenShift cluster using an Azure Resource Manager template](container-insights-azure-redhat-setup.md#enable-for-a-new-cluster-using-an-azure-resource-manager-template) | You can enable monitoring of a new OpenShift cluster that you create with a pre-configured Azure Resource Manager template. |
| | [Create OpenShift cluster using Azure CLI](https://docs.microsoft.com/cli/azure/openshift?view=azure-cli-latest#az-openshift-create) | You can enable monitoring while deploying a new OpenShift cluster using Azure CLI. |
| Existing AKS Kubernetes cluster | [Enable for AKS cluster using Azure CLI](container-insights-enable-existing-clusters.md#enable-using-azure-cli) | You can enable monitoring of an AKS cluster already deployed using Azure CLI. |
| |[Enable for AKS cluster using Terraform](container-insights-enable-existing-clusters.md#enable-using-terraform) | You can enable monitoring of an AKS cluster already deployed using the open-source tool Terraform. |
| | [Enable for AKS cluster from Azure Monitor](container-insights-enable-existing-clusters.md#enable-from-azure-monitor-in-the-portal)| You can enable monitoring of one or more AKS clusters already deployed from the multi-cluster page in Azure Monitor. |
| | [Enable from AKS cluster](container-insights-enable-existing-clusters.md#enable-directly-from-aks-cluster-in-the-portal)| You can enable monitoring directly from an AKS cluster in the Azure portal. |
| | [Enable for AKS cluster using an Azure Resource Manager template](container-insights-enable-existing-clusters.md#enable-using-an-azure-resource-manager-template)| You can enable monitoring of an AKS cluster with a pre-configured Azure Resource Manager template. |
| | [Enable for hybrid Kubernetes cluster](container-insights-hybrid-setup.md) | You can enable monitoring of an AKS Engine hosted in Azure Stack or for Kubernetes hosted on-premises. |
| | [Enable for OpenShift cluster using an Azure Resource Manager template](container-insights-azure-redhat-setup.md#enable-using-an-azure-resource-manager-template) | You can enable monitoring of an existing OpenShift cluster with a pre-configured Azure Resource Manager template. |
| | [Enable for OpenShift cluster from Azure Monitor](container-insights-azure-redhat-setup.md#from-the-azure-portal) | You can enable monitoring of one or more OpenShift clusters already deployed from the multi-cluster page in Azure Monitor. |

## Next steps

- With monitoring enabled, you can begin analyzing the performance of your Kubernetes clusters hosted on Azure Kubernetes Service (AKS), Azure Stack, or other environment. To learn how to use Azure Monitor for containers, see [View Kubernetes cluster performance](container-insights-analyze.md).
