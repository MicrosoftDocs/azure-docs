---
title: Configure Hybrid Kubernetes clusters with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can configure the Azure Monitor for containers agent to control stdout/stderr and environment variables log collection.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 10/15/2019
---

# Configure agent data collection for Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS-Engine clusters hosted in Azure. This article describes the how to enable monitoring of Kuberentes clusters hosted outside of Azure and achieve the same monitoring experience.

## Prerequisites

Before you start, make sure that you have the following:

* **A Log Analytics workspace.**

    Azure Monitor for containers supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../learn/quick-create-workspace.md).

* You are a member of the **Log Analytics contributor role** to enable container monitoring. For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../platform/manage-access.md)

2. [HELM client](https://helm.sh/docs/using_helm/) to onboard the Azure Monitor for containers chart for the specified Kubernetes cluster.

3. The following proxy and firewall configuration information is required for the containerized version of the Log Analytics agent for Linux to communicate with Azure Monitor:

    |Agent Resource|Ports |
    |------|---------|   
    |*.ods.opinsights.azure.com |Port 443 |  
    |*.oms.opinsights.azure.com |Port 443 |  
    |*.blob.core.windows.net |Port 443 |  
    |*.dc.services.visualstudio.com |Port 443 | 

4. The containerized agent requires `cAdvisor port: 10255` to be opened on all nodes in the cluster to collect performance metrics.

5. The containerized agent requires the following environmental variables to be specified on the container in order to communicate with the Kubernetes API service within the cluster to collect inventory datay - `KUBERNETES_SERVICE_HOST` and `KUBERNETES_PORT_443_TCP_PORT`. 

## Enable monitoring

Enabling Azure Monitor for containers for the hybrid Kubernetes cluster consists of the following high-level steps.

- Configure your Log Analytics workspace with Container Insights solution.

- Enable the Azure Monitor for containers HELM chart with Log Analytics workspace.

Perform the following steps to enable the agent in your cluster.

1. 
