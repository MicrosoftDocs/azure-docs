---
title: How to manage the Azure Monitor for containers agent | Microsoft Docs
description: This article describes managing the most common maintenance tasks with the containerized Log Analytics agent used by Azure Monitor for containers.  
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
ms.date: 12/05/2018
ms.author: magoedte
---

# How to manage the Azure Monitor for containers agent
Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. After initial deployment, there are routine or optional tasks you may need to perform during its lifecycle. This article details on how to manually upgrade the agent and disable collection of environmental variables from a particular container. 

## How to upgrade the Azure Monitor for containers agent
Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS).  

If the agent upgrade fails, this article describes the process to manually upgrade the agent. To follow the versions released, see [agent release announcements](https://github.com/microsoft/docker-provider/tree/ci_feature_prod).   

### Upgrading agent on monitored Kubernetes cluster
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

## How to disable environment variable collection on a container
Azure Monitor for containers collects environmental variables from the containers running in a pod and presents them in the property pane of the selected container in the **Containers** view. You can control this behavior by disabling collection for a specific container either during deployment of the AKS cluster or after by setting the environment variable *AZMON_COLLECT_ENV*. This feature is available from the agent version – ciprod11292018 and higher.  

To disable collection of environmental variables on a new or existing container, set the variable *AZMON_COLLECT_ENV* with a value of *False* to your yaml configuration file.   

```  
- name: AZMON_COLLECT_ENV  
  value: "False"  
```  

Run the following command to apply to your AKS cluster already deployed: `kubectl apply -f  <path to yaml file>`.

To verify the configuration change took affect, select a container in the **Containers** view in Azure Monitor for containers and in the property panel, expand **Environment Variables** and it should show only the variable created earlier - **AZMON_COLLECT_ENV = FALSE**.  For all other containers, the Environment Variables section should list all the environment variables discovered.   

To re-enable discovery of the environmental variables, apply the same process earlier and change the value from **False** to **True**.  

2.	To enable environment variable collection on the container we can delete the environment variable “AZMON_COLLECT_ENV = FALSE” and then re-run the `kubectl` command to update .
3.	.
4.	
5.	To set the environment variable on a new container, add this section to the yaml under the container config:
env:
      - name: AZMON_COLLECT_ENV
        value: "False"



## Next steps
If you experience issues while upgrading the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.