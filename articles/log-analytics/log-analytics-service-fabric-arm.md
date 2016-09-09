<properties
	pageTitle="Optimize your environment with the Service Fabric solution in Log Analytics | Microsoft Azure"
	description="You can use the Service Fabric solution to assess the risk and health of your Service Fabric applications, micro-services, nodes and clusters."
	services="log-analytics"
	documentationCenter=""
	authors="niniikhena"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/30/2016"
	ms.author="nini"/>


# Service Fabric Solution in Log Analytics

> [AZURE.SELECTOR]
- [ARM](log-analytics-service-fabric-arm.md)
- [PowerShell](log-analytics-service-fabric.md)

This article describes how to use the Service Fabric solution in Log Analytics to help identify and troubleshoot issues across your Service Fabric cluster, by getting visibility into how your Service Fabric nodes are performing, and how your applications and micro-services are running.

The Service Fabric solution uses Azure Diagnostics data from your Service Fabric VMs, by collecting this data from your Azure WAD tables. Log Analytics then reads Service Fabric framework events, including **Reliable Service Events**, **Actor Events**, **Operational Events**, and **Custom ETW events**. The Service Fabric solution dashboard shows you notable issues and relevant events in your Service Fabric environment.

You can leverage the following ARM templates depending on what scenario best fits yours:

##Deploy a new Service Fabric Cluster connected to a Log Analytics workspace.
This template does the following:

1. Deploys an Azure Service Fabric cluster already connected to a Log Analytics workspace. You can create a new workspace while deploying the template, or you can input the name of an already existing Log Analytics workspace.
2. Adds the diagnostic storage account to the Log Analytics workspace. 
3. Enables the Service Fabric solution in your Log Analytics workspace.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2Fservice-fabric-oms%2F%2Fazuredeploy.json) 
Once you select the deploy button above, you should arrive on this page on the Azure portal, go ahead and edit the parameters listed:
<insert image>

Be sure to create a new resource group if you have input a new Log Analytics workspace name:
<insert image> 

Accept the legal terms and hit "Create" to start the deployment. Once the deployment is completed, you should be able to see the new workspace and cluster created, and the WADServiceFabric*Event, WADWindowsEventLogs and WADETWEvent tables added:

<insert screenshot>

##Deploy a new Service Fabric Cluster connected to a Log Analytics workspace with the VM Extension installed.
This template does the following:

1. Deploys an Azure Service Fabric cluster already connected to a Log Analytics workspace. Again, you can create a new workspace or use an exsiting one.
2. It also adds the diagnostic storage accounts to the Log Analytics workspace.
3. Enables the Service Fabric solution in the Log Analytics workspace.
4. Installs the MMA agent extension in each VM scale set in your Service Fabric cluster. With the MMA agent installed, you're able to view the VM's performance metrics. Be sure to add performance counters in Settings > Data > Windows Performance Counters in order to view these metrics. 


[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2Fservice-fabric-vmss-oms%2F%2Fazuredeploy.json) 


Following the same steps above, input the necessary parameters, and kick off a deployment. Once again you should see the new workspace, cluster and WAD tables all created:

<insert image here>

To view Perf Data from your nodes:
1. Launch the Log Analytics workspace from the Azure portal.

<insert image here>

2. Go to Settings on the left pane, and select Data, and then Windows Performance Counters. Select "Add the selected performance counters":
<insert image here>

3. In Log Search, use the following queries to delve into key metrics about your nodes:
	a. 
	b.
	c.

##Adding an existing storage account to Log Analytics
This template simply adds your existing storage accounts to a new or existing Log Analytics workspace.
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fazure-quickstart-templates%2Fmaster%2Foms-storageaccount%2F%2Fazuredeploy.json) 

After this template has been deployed, you will be able to see the storage account connected to your Log Analytics workspace.
<insert screenshots here>


## Next steps

- Use [Log Searches in Log Analytics](log-analytics-log-searches.md) to view detailed Service Fabric event data.
