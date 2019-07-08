---
title: Azure Monitor for VMs (preview) Frequently Asked Questions | Microsoft Docs
description: Azure Monitor for VMs is a solution in Azure that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article answers common questions.
services:  azure-monitor
author: mgoedtel
manager: carmonm
editor: tysonn
ms.service:  azure-monitor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 01/09/2018
ms.author: magoedte

---

# Azure Monitor for VMs (preview) Frequently Asked Questions
This Microsoft FAQ is a list of commonly asked questions about Azure Monitor for VMs. If you have any additional questions about the solution, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

## Can I onboard to an existing workspace?
If your virtual machines are already connected to a Log Analytics workspace, you may continue to use that workspace when onboarding to Azure Monitor for VMs, provided it is in one of the supported regions listed [here](vminsights-enable-overview.md#prerequisites).

When onboarding, we configure performance counters for the workspace that will cause all of the VMs reporting data to the workspace to begin collecting this information for display and analysis in Azure Monitor for VMs.  As a result, you will see performance data from all of the VMs connected to the selected workspace.  The Health and Map features are only enabled for the VMs that you have specified to onboard.

For more information on which performance counters are enabled, refer to our [enable overview](vminsights-enable-overview.md#performance-counters-enabled) article.

## Can I onboard to a new workspace? 
If your VMs are not currently connected to an existing Log Analytics workspace, you need to create a new workspace to store your data. Creating a new default workspace is done automatically if you configure a single Azure VM for Azure Monitor for VMs through the Azure portal.

If you choose to use the script-based method, these steps are covered in the [Enable Azure Monitor for VMs (preview) using Azure PowerShell or Resource Manager template](vminsights-enable-at-scale-powershell.md) article. 

## What do I do if my VM is already reporting to an existing workspace?
If you are already collecting data from your virtual machines, you may have already configured it to report data to an existing Log Analytics workspace.  As long as that workspace is in one of our supported regions, you can enable Azure Monitor for VMs to that pre-existing workspace.  If the workspace you are already using is not in one of our supported regions, you won’t be able to onboard to Azure Monitor for VMs at this time.  We are actively working to support additional regions.

>[!NOTE]
>We configure performance counters for the workspace that affects all VMs that report to the   workspace, whether or not you have chosen to onboard them to Azure Monitor for VMs. For more details on how performance counters are configured for the workspace, please refer to our [documentation](../../azure-monitor/platform/data-sources-performance-counters.md). For information about the counters configured for Azure Monitor for VMs, please refer to our [enable Azure Monitor for VMs](vminsights-enable-overview.md#performance-counters-enabled) article.  

## Why did my VM fail to onboard?
When onboarding an Azure VM from the Azure portal, the following steps occur:

* A default Log Analytics workspace is created, if that option was selected.
* The performance counters are configured for selected workspace. If this step fails, you notice that some of the performance charts and tables aren't showing data for the VM you onboarded. You can fix this by running the PowerShell script documented [here](vminsights-enable-at-scale-powershell.md#enable-performance-counters).
* The Log Analytics agent is installed on Azure VMs using a VM extension, if determined it is required.  
* The Azure Monitor for VMs Map Dependency agent is installed on Azure VMs using an extension, if determined it is required.  
* Azure Monitor components supporting the Health feature are configured, if needed, and the VM is configured to report health data.

During the onboard process, we check for status on each of the above to return a notification status to you in the portal. Configuration of the workspace and the agent installation typically takes 5 to 10 minutes. Viewing monitoring and health data in the portal take an additional 5 to 10 minutes.  

If you have initiated onboarding and see messages indicating the VM needs to be onboarded,  allow for up to 30 minutes for the VM to complete the process. 

## I only enabled Azure Monitor for VMs, Why do I see all my VMs monitored by the Health feature?
The Health feature is enabled for all VMs that are connected to the Log Analytics workspace, even when the action is initiated for a single VM.

## Can I modify the schedule for when health criteria evaluates a condition?
No, the time period and frequency of health criteria can't be modified with this release. 

## Can I disable health criteria for a condition I don't need to monitor?
Health criteria can't be disabled in this release.

## Are the health alert severities configurable?  
Health alert severity cannot be modified, they can only be enabled or disabled. Additionally, some alert severities update based on the state of health criteria. 

## If I reconfigure the settings of a particular health criteria, can it be scoped to a specific instance?  
If you modify any setting of a health criterion instance, all health criteria instances of the same type on the Azure VM are modified. For example, if the threshold of the disk free-space health criterion instance that corresponds to logical disk C: is modified, this threshold applies to all other logical disks that are discovered and monitored for the same VM.

## Does the Health feature monitor logical processors and cores?
No, individual processor and logical processor level health criteria is not included for a Windows, only Total CPU utilization is monitored by default to effectively evaluate CPU pressure based on the total number of logical CPUs available to the Azure VM. 

## Are all health criteria thresholds configurable?  
Thresholds for health criteria that target a Windows VM aren’t modifiable, because their health states are set to *running* or *available*. When you query the health state from the [Workload Monitor API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components), it displays the *comparisonOperator* value of **LessThan** or **GreaterThan** with a *threshold* value of **4** for the service or entity if:
   - DNS Client Service Health – Service isn't running. 
   - DHCP client service health – Service isn't running. 
   - RPC Service Health – Service isn't running. 
   - Windows firewall service health – Service isn't running.
   - Windows event log service health – Service isn't running. 
   - Server service health – Service isn't running. 
   - Windows remote management service health – Service isn't running. 
   - File system error or corruption – Logical Disk is unavailable.

Thresholds for the following Linux health criteria aren’t modifiable, because their health state is already set to *true*. The health state displays the *comparisonOperator* with a value **LessThan** and *threshold* value of **1** when queried from the Workload Monitoring API for the entity, depending on its context:
   - Logical Disk Status – Logical disk isn't online/ available
   - Disk Status – Disk isn't online/ available
   - Network Adapter Status -  Network adapter is disabled

## How do I modify alerts that are included with the Health feature?
Alert rules that are defined for each health criterion aren't displayed in the Azure portal. You can enable or disable a health alert rule only in the [Workload Monitor API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components). Also, you can't assign an [Azure Monitor action group](../../azure-monitor/platform/action-groups.md) for health alerts in the Azure portal. You can only use the notification setting API to configure an action group to be triggered whenever a health alert is fired. Currently, you can assign action groups against a VM so that all *health alerts* fired against the VM trigger the same action groups. Unlike traditional Azure alerts, there's no concept of a separate action group for each health alert rule. Additionally, only action groups that are configured to provide email or SMS notifications are supported when health alerts are triggered. 

## I don’t see some or any data in the performance charts for my VM
If you don’t see performance data in the disk table or in some of the performance charts then your performance counters may not be configured in the workspace. To resolve, run the following [PowerShell script](vminsights-enable-at-scale-powershell.md#enable-with-powershell).

## How is Azure Monitor for VMs Map feature different from Service Map?
The Azure Monitor for VMs Map feature is based on Service Map, but has the following differences:

* The Map view can be accessed from the VM blade and from Azure Monitor for VMs under Azure Monitor.
* The connections in the Map are now clickable and display a view of the connection metric data in the side panel for the selected connection.
* There is a new API that is used to create the maps to better support more complex maps.
* Monitored VMs are now included in the client group node, and the donut chart shows the proportion of monitored vs unmonitored virtual machines in the group.  It can also be used to filter the list of machines when the group is expanded.
* Monitored virtual machines are now included in the server port group nodes, and the donut chart shows the proportion of monitored vs unmonitored machines in the group.  It can also be used to filter the list of machines when the group is expanded.
* The map style has been updated to be more consistent with App Map from Application insights.
* The side panels have been updated, and do not have the full set of integration's that were supported in Service Map - Update Management, Change Tracking, Security, and Service Desk. 
* The option for choosing groups and machines to map has been updated and now supports Subscriptions, Resource Groups, Azure virtual machine scale sets, and Cloud services.
* You cannot create new Service Map machine groups in the Azure Monitor for VMs Map feature.  

## Why do my performance charts show dotted lines?
This can occur for a few reasons.  In cases where there is a gap in data collection we depict the lines as dotted.  If you have modified the data sampling frequency for the performance counters enabled (the default setting is to collect data every 60 seconds), you can see dotted lines in the chart if you choose a narrow time range for the chart and your sampling frequency is less than the bucket size used in the chart (for example, the sampling frequency is every 10 minutes and each bucket on the chart is 5 minutes).  Choosing a wider time range to view should cause the chart lines to appear as solid lines rather than dots in this case.

## Are groups supported with Azure Monitor for VMs?
Yes, once you install the Dependency agent we collect information from the VMs to display groups based upon subscription, resource group, virtual machine scale sets, and cloud services.  If you have been using Service Map and have created machine groups, these are displayed as well.  Computer groups will also appear in the groups filter if you have created them for the workspace you are viewing. 

## How do I see the details for what is driving the 95th percentile line in the aggregate performance charts?
By default, the list is sorted to show you the VMs that have the highest value for the 95th percentile for the selected metric, except for the Available memory chart, which shows the machines with the lowest value of the 5th percentile.  Clicking on the chart will open the **Top N List**  view with the appropriate metric selected.

## How does the Map feature handle duplicate IPs across different vnets and subnets?
If you are duplicating IP ranges either with VMs or Azure virtual machine scale sets across subnets and vnets, it can cause Azure Monitor for VMs Map to display incorrect information. This is a known issue and we are investigating options to improve this experience.

## Does Map feature support IPv6?
Map feature currently only supports IPv4 and we are investigating support for IPv6. We also support IPv4 that is tunneled inside IPv6.

## When I load a map for a Resource Group or other large group the map is difficult to view
While we have made improvements to Map to handle large and complex configurations, we realize a map can have a lot of nodes, connections, and node working as a cluster.  We are committed to continuing to enhance support to increase scalability.   

## Why does the network chart on the Performance tab look different than the network chart on the Azure VM Overview page?

The overview page for an Azure VM displays charts based on the host's measurement of activity in the guest VM.  For the network chart on the Azure VM Overview, it only displays network traffic that will be billed.  This does not include inter-vnet traffic.  The data and charts shown for Azure Monitor for VMs is based on data from the guest VM and the network chart displays all TCP/IP traffic that is inbound and outbound to that VM, including inter-vnet.

## How is response time measured for data stored in VMConnection and displayed in the connection panel and workbooks?

Response time is an approximation. Since we do not instrument the code of the application, we do not really know when a request begins and when the response arrives. Instead we observe data being sent on a connection and then data coming back on that connection. Our agent keeps track of these sends and receives and attempts to pair them: a sequence of sends, followed by a sequence of receives is interpreted as a request/response pair. The timing between these operations is the response time. It will include the network latency and the server processing time.

This approximation works well for protocols that are request/response based: a single request goes out on the connection, and a single response arrives. This is the case for HTTP(S) (without pipelining), but not satisfied for other protocols.

## Are their limitations if I am on the Log Analytics Free pricing plan?
If you have configured Azure Monitor with a Log Analytics workspace using the *Free* pricing tier, Azure Monitor for VMs Map feature will only support five connected machines connected to the workspace. If you have five VMs connected to a free workspace, you disconnect one of the VMs and then later connect a new VM, the new VM is not monitored and reflected on the Map page.  

Under this condition, you will be prompted with the **Try Now** option when you open the VM and select **Insights (preview)** from the left-hand pane, even after it has been installed already on the VM.  However, you are not prompted with options as would normally occur if this VM were not onboarded to Azure Monitor for VMs. 

## Next steps
Review [Enable Azure Monitor for VMs](vminsights-enable-overview.md) to understand requirements and methods to enable monitoring of your virtual machines.
