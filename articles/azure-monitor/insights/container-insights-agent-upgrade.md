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
ms.date: 11/13/2018
ms.author: magoedte
---

# How to upgrade the Azure Monitor for containers (Preview) agent
Azure Monitor for containers uses a containerized version of the Log Analytics agent for Linux. When a new version of the agent is released, the agent is not automatically upgraded on your managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS).

This article describes the process for upgrading the agent.

## Upgrading agent on monitored Kubernetes cluster
The process to upgrade the agent consists of two straight forward steps. The first step is to disable monitoring with Azure Monitor for containers using Azure CLI.  Follow the steps described in the [Disable monitoring](container-insights-optout.md?toc=%2fazure%2fmonitoring%2ftoc.json#azure-cli) article. Using Azure CLI allows us to remove the agent from the nodes in the cluster without impacting the solution and the corresponding data that is stored in the workspace. 

>[!NOTE]
>While you are performing this maintenance activity, the nodes in the cluster are not forwarding collected data, and performance views will not show data between the time you remove the agent and install the new version. 
>

To install the new version of the agent, follow the steps described in the [Onboard monitoring](container-insights-onboard.md?toc=%2fazure%2fmonitoring%2ftoc.json#enable-monitoring-using-azure-cli) article using Azure CLI, to complete this process.  

After you've re-enabled monitoring, it might take about 15 minutes before you can view  updated health metrics for the cluster. 

## Next steps
If you experience issues while upgrading the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.