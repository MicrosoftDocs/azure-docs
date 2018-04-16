---
title: Azure Service Fabric - Performance Monitoring with Log Analytics | Microsoft Docs
description: Learn how to set up the OMS Agent for monitoring containers and performance counters for your Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/16/2018
ms.author: dekapur; srrengar

---

# Performance Monitoring with Log Analytics

This article covers the steps to add the Log Analytics, also known as OMS, Agent as a virtual machine scale set extension to your cluster, and connect it to your existing Azure Log Analytics workspace. This enables collecting diagnostics data about containers, applications, and performance monitoring. By adding it as an extension to the virtual machine scale set resource, Azure Resource Manager ensures that it gets installed on every node, even when scaling the cluster.

> [!NOTE]
> This article assumes that you have an Azure Log Analytics workspace already set up. If you do not, head over to [Set up Azure Log Analytics](service-fabric-diagnostics-oms-setup.md)

## Add the agent extension via Azure CLI

The best way to add the OMS Agent to your cluster is via the virtual machine scale set APIs available with the Azure CLI. If you do not have Azure CLI set up yet, head over to Azure portal and open up a [Cloud Shell](../cloud-shell/overview.md) instance, or [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

1. Once your Cloud Shell is requested, make sure you are working in the same subscription as your resource. Check this with `az account show` and make sure the "name" value matches that of your cluster's subscription.

2. In the Portal, navigate to the resource group where your Log Analytics workspace is located. Click into the Log Analytics resource (the type of the resource will be Log Analytics). Once you are at the resource overview page, click on **Advanced Settings** under the Settings section on the left menu.

    ![Log Analytics properties page](media/service-fabric-diagnostics-oms-agent/oms-advanced-settings.png)
 
3. Click on **Windows Servers** if you are standing up a Windows cluster, and **Linux Servers** if you are creating a Linux cluster. This page will show you your `workspace ID` and `workspace key` (listed as Primary Key in the portal). You will need both for the next step.

4. Run the command to install the OMS agent onto your cluster, using the `vmss extension set` API in your Cloud Shell:

    For a Windows cluster:
    
    ```sh
    az vmss extension set --name MicrosoftMonitoringAgent --publisher Microsoft.EnterpriseCloud.Monitoring --resource-group <nameOfResourceGroup> --vmss-name <nameOfNodeType> --settings "{'workspaceId':'<OMSworkspaceId>'}" --protected-settings "{'workspaceKey':'<OMSworkspaceKey>'}"
    ```

    For a Linux cluster:

    ```sh
    az vmss extension set --name OmsAgentForLinux --publisher Microsoft.EnterpriseCloud.Monitoring --resource-group <nameOfResourceGroup> --vmss-name <nameOfNodeType> --settings "{'workspaceId':'<OMSworkspaceId>'}" --protected-settings "{'workspaceKey':'<OMSworkspaceKey>'}"
    ```

    Here's an example of the OMS Agent being added to a Windows cluster.

    ![OMS agent cli command](media/service-fabric-diagnostics-oms-agent/cli-command.png)
 
5. This should take less than 15 min to successfully add the agent to your nodes. You can verify that the agents have been added by using the `az vmss extension list` API:

    ```sh
    az vmss extension list --resource-group <nameOfResourceGroup> --vmss-name <nameOfNodeType>
    ```

## Add the agent via the Resource Manager template

Sample Resource Manager templates that deploy an Azure Log Analytics workspace and add an agent to each of your nodes is available for [Windows](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/SF%20OMS%20Samples/Windows) or [Linux](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/SF%20OMS%20Samples/Linux).

You can download and modify this template to deploy a cluster that best suits your needs.

## View Performance Counters in the Log Analytics Portal

Now that you have added the OMS agent, head on over to the Log Analytics portal to choose which performance counters you'd like to collect. 

1. In the Azure portal, go to the resource group in which you created the Service Fabric Analytics solution. Select **ServiceFabric\<nameOfOMSWorkspace\>** and go to its overview page. At the top, click the link to go to the OMS Portal.

2. Once you're in the portal, you will see a tiles in the form of a graph for each of the solutions enabled, including one for Service Fabric. Click this to continue to the Service Fabric Analytics solution. 

3. Now you will see a few tiles with graphs on operational channel and reliable services events. On the right click the gear icon to go to the settings page.

    ![OMS settings](media/service-fabric-diagnostics-oms-agent/oms-solutions-settings.png)

4. On the settings page, click Data and choose Windows or Linux Performance Counters. There are a list of default ones you can choose to enable and you can set the interval for collection too. You can also add [additional performance counters](service-fabric-diagnostics-event-generation-perf.md) to collect. The proper format is referenced in this [article](https://msdn.microsoft.com/en-us/library/windows/desktop/aa373193(v=vs.85).aspx).

Once your counters are configured, head back to the solutions page and you will soon see data flowing in and displayed in the graphs under **Node Metrics**. You can also query on performance counter data similarly to cluster events and filter on the nodes, perf counter name, and values using the Kusto query language. 

![OMS perf counter query](media/service-fabric-diagnostics-oms-agent/oms-perf-counter-query.png)

## Next steps

* Collect relevant [performance counters](service-fabric-diagnostics-event-generation-perf.md). To configure the OMS agent to collect specific performance counters, review [configuring data sources](../log-analytics/log-analytics-data-sources.md#configuring-data-sources).
* Configure Log Analytics to set up [automated alerting](../log-analytics/log-analytics-alerts.md) to aid in detecting and diagnostics
* As an alternative you can collect performance counters through [Azure Diagnostics extension and send them to Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md#add-the-ai-sink-to-the-resource-manager-template)