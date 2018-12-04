---
title: Azure Monitor for VMs (preview) frequently asked questions | Microsoft Docs
description: Azure Monitor for VMs (preview) is a solution in Azure that combines health and performance monitoring of the Azure VM operating system. It automatically discovers application components and dependencies with other resources and maps the communication between them. This article answers commonly asked questions.
services:  azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service:  azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/08/2018
ms.author: magoedte

---

# Azure Monitor for VMs (preview) FAQ
This article answers commonly asked questions about Azure Monitor for VMs. If you have any additional questions about the solution, go to the [Azure discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When questions are asked frequently, we add them to this article so they can be found quickly and easily.

## Can I deploy VMs to an existing workspace?
If your virtual machines are already connected to a Log Analytics workspace, you may continue to use that workspace when you deploy them to Azure Monitor for VMs. The workspace must exist in one of the supported regions listed in the "Prerequisites" section of [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md#prerequisites).

During deployment, we configure performance counters for the workspace. This action causes the VMs that report data to the workspace to begin collecting the information for display and analysis in Azure Monitor for VMs. As a result, you will see performance data from all of the VMs that are connected to the selected workspace. The Health and Map features are enabled only for the VMs that you have specified for deployment.

For more information about which performance counters are enabled, see [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md).

## Can I deploy VMs to a new workspace? 
If your VMs aren't currently connected to an existing Log Analytics workspace, you need to create a new workspace to store your data. You can create one automatically by configuring a single VM for Azure Monitor for VMs in the Azure portal.

If you choose to use the script-based method, see [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md). 

## What can I do if my VM is already reporting to an existing workspace?
If you are already collecting data from your virtual machines, you might have already configured them to report data to an existing Log Analytics workspace. As long as that workspace is in one of our supported regions, you can enable Azure Monitor for VMs for that pre-existing workspace. 
We are actively working to support additional regions.

>[!NOTE]
>We configure performance counters for the workspace, which affects all VMs that report to the workspace, whether or not you have chosen to deploy them to Azure Monitor for VMs. For more information about how performance counters are configured for the workspace, see the "Configuring Performance counters" section of [Windows and Linux performance data sources in Log Analytics](../../azure-monitor/platform/data-sources-performance-counters.md). For information about the counters configured for Azure Monitor for VMs, see [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md). 

## Why did my VM deployment fail?
When you deploy an Azure VM from the Azure portal, the following events occur:

* A default Log Analytics workspace is created, if that option was selected.
* The performance counters are configured for the selected workspace. If this step fails, some of the performance charts and tables don't display data for the VM you deployed. You can fix this issue by running the PowerShell script that's documented in the "Enable with PowerShell" section of [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md#enable-with-powershell).
* The Log Analytics agent is installed on Azure VMs with a VM extension, if it's required. 
* The Azure Monitor for VMs Map Dependency agent is installed on Azure VMs with an extension, if it's required. 
* Azure Monitor components that support the Health feature are configured, if needed, and the VM is configured to report health data.

During deployment, we check the status for each of the preceding steps and return a notification status to you in the portal. Configuration of the workspace and the agent installation typically takes 5 to 10 minutes. Viewing monitoring and health data in the Azure portal take an additional 5 to 10 minutes. 

If you have initiated the deployment and see messages indicating the VM needs to be deployed, allow up to 30 minutes for the VM to complete the process. 

## I don’t see some or any data in the performance charts for my VM
If performance data isn't displayed in the disk table or the performance charts, your performance counters might not be configured in the workspace. To resolve this issue, run the PowerShell script that's documented in the "Enable with PowerShell" section of [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md#enable-with-powershell).

## How is the Azure Monitor for VMs Map feature different from Service Map?
The Azure Monitor for VMs Map feature is based on Service Map, but it has the following differences:

* You can access the Map view from the VM pane and from Azure Monitor for VMs under Azure Monitor.
* The connections in the Map are now clickable and display connection metric data in the side panel.
* A new API is used to create the maps to better support more complex maps.
* Monitored VMs are now in the client group node, and the donut chart displays the ratio of monitored to unmonitored virtual machines. You can also filter the list of machines when the group is expanded.
* Monitored virtual machines are now in the server port group nodes, and the donut chart displays the ratio of monitored to unmonitored machines. You can also filter the list of machines when the group is expanded.
* The map style has been updated to be more consistent with the Application Map from Azure Application Insights.
* The side panels have been updated but don't yet have the full set of integrations that were supported in Service Map: Update Management, Change Tracking, Security, and Service Desk. 
* The option for choosing groups and machines to map has been updated. It now supports Subscriptions, Resource Groups, Azure virtual machine scale sets, and Cloud services.
* You can't create new Service Map machine groups in the Azure Monitor for VMs Map feature. 

## Why do my performance charts show dotted lines?

Performance charts display dotted lines for a few reasons:
* There might be a gap in data collection. 

* The default setting for data sampling is every 60 seconds. You might see dotted lines if you choose a narrow time range for the chart and your sampling frequency is less than the bucket size used in the chart. Let's say you've chosen a sampling frequency of 10 minutes and each bucket on the chart is 5 minutes. In this case, choosing a wider time range to view should cause the chart lines to appear as solid lines rather than dots.

## Are groups supported with Azure Monitor for VMs?
Yes, after you've installed the Dependency agent we collect information from the VMs to display groups based upon subscription, resource group, virtual machine scale sets, and cloud services. If you've been using Service Map and have created machine groups, these groups are displayed as well. Computer groups will also appear in the groups filter if you've created them for the workspace you are viewing. 

## How can I display the details about what is driving the 95th percentile line in the aggregate performance charts?
By default, the list is sorted to show you the VMs that have the highest value for the 95th percentile for the selected metric. An exception is the **Available memory** chart, which shows the machines with the lowest value of the fifth percentile. Select the chart to open the **Top N List** view with the appropriate metric selected.

## How does the Map feature handle duplicate IPs across various virtual networks and subnets?
If you are duplicating IP ranges by using either VMs or Azure virtual machine scale sets across subnets and virtual networks, it can cause the Azure Monitor for VMs Map feature to display incorrect information. We're aware of this issue and we are investigating options to improve the experience.

## Does the Map feature support IPv6?
The Map feature currently supports only IPv4, and we are investigating support for IPv6. We also support IPv4 that's tunneled inside IPv6.

## When I load a map for a resource group or other large group, the map is difficult to view
Although we have improved the Map feature to handle large and complex configurations, we realize a map can have many nodes, connections, and nodes working as a cluster. We are committed to continuing to enhance support to increase scalability.  

## Why does the network chart on the Performance tab look different than the network chart on the Azure VM Overview page?

The Overview page for an Azure VM displays charts based on the host's measurement of activity in the guest VM. The network chart on the Azure VM Overview page displays only network traffic that will be billed. This display doesn't include traffic between virtual networks. The data and charts shown for Azure Monitor for VMs is based on data from the guest VM, and the network chart displays all TCP/IP traffic that is inbound and outbound to that VM, including traffic between virtual networks.

## What are the limitations of the Log Analytics Free pricing plan?
If you have configured Azure Monitor with a Log Analytics workspace by using the *Free* pricing tier, the Azure Monitor for VMs Map feature supports connecting only five machines to the workspace. 

If you have five VMs connected to a free workspace and you disconnect one VM and then later connect a new VM, the new VM isn't monitored and reflected on the Map page. In this scenario, when you open the new VM you will be prompted to use the **Try Now** option and select **Insights (preview)** from the left pane, even after it has been installed on the VM. However, you aren't prompted with options as you normally would be if the VM weren't deployed to Azure Monitor for VMs. 

## Next steps
To understand the requirements and methods for enabling monitoring of your virtual machines, review [Deploy Azure Monitor for VMs (preview)](vminsights-onboard.md).
