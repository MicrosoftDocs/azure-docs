---
title: How to upgrade Azure Monitor for containers (Preview) agent | Microsoft Docs
description: This article describes how you upgrade the Log Analytics agent used by Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 

ms.assetid: 
ms.service: azure-monitor
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/28/2018
ms.author: magoedte
---

# How to upgrade the Azure Monitor for containers (Preview) agent
Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS).  

If the agent upgrade fails, this article describes the process to manually upgrade the agent. To follow the versions released, see [agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).   

## Upgrading agent on monitored Kubernetes cluster
The process to upgrade the agent consists of two straight forward steps. The first step is to disable monitoring with Azure Monitor for containers using Azure CLI.  Follow the steps described in the [Disable monitoring](container-insights-optout.md?toc=%2fazure%2fmonitoring%2ftoc.json#azure-cli) article. Using Azure CLI allows us to remove the agent from the nodes in the cluster without impacting the solution and the corresponding data that is stored in the workspace. 

>[!NOTE]
>While you are performing this maintenance activity, the nodes in the cluster are not forwarding collected data, and performance views will not show data between the time you remove the agent and install the new version. 
>

To install the new version of the agent, follow the steps described in the [Onboard monitoring](container-insights-onboard.md?toc=%2fazure%2fmonitoring%2ftoc.json#enable-monitoring-using-azure-cli) article using Azure CLI, to complete this process.  

After you've re-enabled monitoring, it might take about 15 minutes before you can view  updated health metrics for the cluster. To verify the agent upgraded successfully, run the command: `kubectl logs omsagent-484hw --namespace=kube-system`

The status should resemble the following example, where the value for *omi* and *omsagent* should match the latest version specified in the [agent release history](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).  

    User@aksuser:~$ kubectl logs omsagent-484hw --namespace=kube-system
	:
	:
	instance of Container_HostInventory
	{
	    [Key] InstanceID=3a4407a5-d840-4c59-b2f0-8d42e07298c2
	    Computer=aks-nodepool1-39773055-0
	    DockerVersion=1.13.1
	    OperatingSystem=Ubuntu 16.04.3 LTS
	    Volume=local
	    Network=bridge host macvlan null overlay
	    NodeRole=Not Orchestrated
	    OrchestratorType=Kubernetes
	}
	Primary Workspace: b438b4f6-912a-46d5-9cb1-b44069212abc    Status: Onboarded(OMSAgent Running)
	omi 1.4.2.5
	omsagent 1.6.0-163
	docker-cimprov 1.0.0.31

## Next steps
If you experience issues while upgrading the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.