---
title: How to chart performance with Azure Monitor for VMs | Microsoft Docs
description: Performance is a feature of the Azure Monitor for VMs that automatically discovers application components on Windows and Linux systems and maps the communication between services. This article provides details on how to use it in a variety of scenarios.
services:  log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service:  log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2018
ms.author: magoedte
---

# How to chart performance with Azure Monitor for VMs
Azure Monitor for VMs include a set of performance charts that target several key performance indicators (KPIs) to help you determine how well a virtual machine is performing — Processor, Memory, Disk, and Network.  The charts show resource utilization over a period of time so you can identify bottlenecks or anomalies that may or may not be isolated, or switch to a perspective listing each machine to view resource utilization based on the metric selected. While there are numerous elements to consider when dealing with performance, VM insights is focused on the operating system as manifested through the processor, memory, network adapters, and disks. Performance compliments the health monitoring feature of the solution and together, helps expose issues that indicate a possible system component failure, support tuning and optimization to achieve efficiency, or support capacity planning.  

## Multi-VM perspective from Azure Monitor
From Azure Monitor, the Performance feature provides a multi-virtual machine view of all monitored VMs deployed across resource groups in your subscriptions or in your environment.  To access from Azure Monitor, perform the following. 

1. In the Azure portal, select **Monitor**. 
2. Choose **Virtual Machines (preview)** in the **Solutions** section.
3. Select the **Performance** tab.

![VM insights Performance Aggregate view](./media/monitoring-vminsights-performance/vminsights-performance-aggview-01.png)

On the **Aggregate** tab, if you have more than one Log Analytics workspace, choose the one that is integrated with the solution from the **Workspace** selector at the top of the page.  You then select from the **Group** selector, a subscription, resource group, or specific machine, over a specified period of time.  By default, the charts shows the last 24 hours.  Using the **TimeRange** selector, you can query for historical time ranges of up to 30 days to show how performance looked in the past.   

The four capacity utilization charts shown on the page are:

* CPU Utilization % - defaults showing the average and top 95th percentile 
* Available Memory - defaults showing the average, top 5th and 10th percentile 
* Logical Disk Space Used % - defaults showing the average and 95th percentile 
* Network Adapter - defaults showing average bytes sent and received

You can also change the granularity of the charts within the time range by selecting **Avg**, **Min**, **Max**, **50th**, **90th**, and **95th** in the percentile selector.   

To view the resource utilization by individual VM in a list view and see which machine is trending with highest utilization, select the **List** tab.  The **List** page shows the top 20 machines sorted by the most utilized by 95th percentile for the metric *CPU Utilization %*.  You can see more machines by selecting **Load More**, and the results expand to show the top 500 machines. 

>[!NOTE]
>The list cannot show more than 500 machines at a time.  
>

To filter the results on a specific virtual machine, enter its computer name in the **Search by name** textbox.  

If you would rather view utilization from a different performance metric, from the **Metric** drop-down list select **Available Memory**, **Logical Disk Space Used %**, **Network Received Byte/s**, or **Network Sent Byte/s** and the list updates to show utilization scoped to that metric.  

Selecting a virtual machine from the list opens the **Properties** panel on the right-side of the page and from here you can select **Performance detail**.  The **Virtual Machine Detail** page opens and is scoped to that VM, similar in experience when accessing VM Insights Performance directly from the Azure VM.  


## View performance directly from an Azure VM
To access directly from a virtual machine, perform the following.

1. In the Azure portal, select **Virtual Machines**. 
2. From the list, choose a VM and in the **Monitoring** section choose **Insights (preview)**.  
3. Select the **Performance** tab. 

## Next steps
To learn how to use the health feature, see [View Azure Monitor for VMs Health](monitoring-vminsights-health.md), or to view discovered application dependencies, see [View Azure Monitor for VMs Map](monitoring-vminsights-maps.md). 