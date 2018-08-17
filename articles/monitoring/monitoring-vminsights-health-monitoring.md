---
title: How to monitor health of your VM with Azure Monitor VM Insights | Microsoft Docs
description: This article describes how you understand the health of the operating system running on your virtual machines with Azure Monitor VM Insights.  
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
ms.date: 08/06/2018
ms.author: magoedte
---

# Understand the health of your virtual machines with Azure Monitor VM insights


Viewing the health state of your Azure virtual machines can be observed two ways with VM insights.  You can view the health of the selected VM when you select **Insights (preview)** from the left-hand pane or to see a broad view across all VMs in your subscription, select **Virtual Machines (preview)** from Azure Monitor.  

## Sign in to the Azure portal
Sign in to the [Azure portal](https://portal.azure.com). 

## Aggregate virtual machine perspective

When accessing VM insights from Azure Monitor, you are presented with an overview of the health for a collection of monitored virtual machines (VM). 

![VM Insights monitoring view from Azure Monitor](./media/monitoring-vminsights-health-monitoring/vminsights-aggregate-monitoring-view-01.png)

Here you are able to learn the following:

1. How many VMs are in a critical or unhealthy state, versus how many are healthy or not submitting data (referred to as an unknown state)?
2. Which VMs by operating system (OS) or OS components are reporting an unhealthy state and how many?
3. What monitored components of the VM are unhealthy and which health criteria is reporting the condition?  Is it the processor, disk, memory or network adapter?

From here you can quickly identify the top critical issues detected by the health criteria  proactively monitoring the VM, and review alert details and associated knowledge article intended to assist in the diagnosis and remediation of the issue.  

## VM Distribution
This section provides the distribution of VMs based on operating system or basic components of a VM. 

![VM Insights virtual machine distribution perspective](./media/monitoring-vminsights-health-monitoring/vminsights-vmdistribution-perspective-01.png)

On the Operating Systems tab, the table shows VMs listed by Windows edition or Linux distribution, along with their version. In each operating system category, the VMs are broken down further based on the health of the VM. The health states defined for a VM are: 

1. **Healthy** – no issues detected for the VM and it is functioning as required. 
2. **Critical** – one or more critical issues are detected, which need to be addressed in order to restore normal functionality as expected.
3. **Warning** -  one or more issues are detected, which need to be addressed or the health condition could become critical.
4. **Unknown** – if the service were not able to make a connection with the VM, the status changes to an unknown state.

You can click on any column item - **VM count**, **Critical**, **Warning**, **Healthy** or **Unknown** to drill down into that specific VM view to get more details. Based on the column cell selected, the results are filtered on the list view page. For example, if we want to check all VMs running **Ubuntu 16.04 (x86_64)**, click on the VM count value for that OS and it will open the following page, listing the two virtual machines that are in a critical health state.  

![Example rollup of Ubuntu VMs in critical health state](./media/monitoring-vminsights-health-monitoring/vminsights-rollup-vms-criticalstate.png)
 
On the **Virtual Machines** page, if you select the name of a VM under the column **VM Name**, you are directed to the VM instance page with more details of the alerts and health criteria issues identified that are affecting the selected VM.  From here you can filter the health state details by clicking on **Health State** icon in the upper left-hand corner of the page to see which components are unhealthy or you can view alerts raised by an unhealthy component categorized by alert severity.    

From the VM list view, clicking on the name of a VM opens the **VM instance** page.

![Example of selected virtual machine health state overview page](./media/monitoring-vminsights-health-monitoring/vminsights-vminstance-overview-01.png)

On this page it shows a rollup **Health Status** for the virtual machine and **Fired alerts**, categorized by severity.  Selecting **Health State** will show the **Health Diagnostics** view of the VM, and here you can find out which health criteria is reflecting a health state issue. When the **Health Diagnostics** page opens, it shows all the components of the VM and their associated health criteria with current health state.  Refer to the [Health Diagnostic](#health-diagnostics) section for more details.  

Select any of the severities to open the [All Alerts](../monitoring-and-diagnostics/monitoring-overview-unified-alerts.md#all-alerts-page) page filtered by that severity.

The **Fired alerts** table shows the top alerts raised and the **Top health issues** table reflects the top health issues identified for the VM and which health criteria threshold was breached. The information that's presented is described in the following table:

|Column | Description |
|-------|-------------| 
|Health Criteria |The name of the health criteria measuring the health state on the monitored VM. |
|Unhealthy components |The number of components in the environment that are in an unhealthy state with respect to the health criterion. |
|Unknown state components |The number of components whose health state is unknown with respect to this health condition. |
|Category |The health criteria are organized into four major health categories based on the aspect that they align with.<br>  a. Availability<br>  b. Performance  |
|Component type | Indicates the type of component of the VM on which this health criterion is acting. For example, Logical disk, physical disk, Network adapter etc.

Selecting **See All Health Criteria** opens a page show a list view of all the health criteria available with this solution.  The information can be further filtered based on the following options:

1. **Type** – There are three kinds of health criteria types to assess conditions and roll up overall health state of the monitored VM .
   a. **Unit** – Measures some aspect of the virtual machine. This might be checking a performance counter to determine the performance of the component, running a script to perform a synthetic transaction, or watch for an event that indicates an error.  By default the filter is set to unit.  
   b. **Dependency** - Provides health rollup between different entities. This allows the health of an entity to depend on the health of another kind of entity that it relies on for successful operation.
   c. **Aggregate** -  Provides a combined health state of similar health criteria. Unit and dependency health criterion will typically be configured under an aggregate health criterion. In addition to providing better general organization of the many different health criteria targeted at an entity, aggregate health criterion provides a unique health state for distinct categories of the entities.

2. **Category** - Type of health criteria used to group criteria of similar type for reporting purposes.  They are either **Availability** or **Performance**.

You can drill further down to see which instances are unhealthy by clicking on a value under the **Unhealthy Component** column.  On the page a table lists the components which are in a critical health state.    

Navigating back to the **VM Distribution** page, selecting the **Components** tab shows the health state of the four major components of a VM in the table - CPU, disk, memory, and network. The data is presented from the perspective of out of all the VMs monitored, one or more have exceeded a threshold for that component.  You can drill-down to the list view of the VM and analyze the results.  

## Single virtual machine perspective

You can view the health of an Azure VM when you select **Insights (preview)** from the left-hand pane of the selected virtual machine.  On the VM insights page, select the **Health** tab to switch to the health view of the VM.  On the page,  you can filter the health state details by clicking on **Health State** icon in the upper left-hand corner of the page to see which components are unhealthy or you can view **Unresolved alerts** raised by an unhealthy component categorized by alert severity raised on the VM.   Refer [Alerting and an alert management](<link to section below>) for more details.  

A taskbar on the insights pane includes an option to open **Health diagnostics** and view the health state of the health criteria running on the VM.  Refer to the [Health diagnostics](<link to section>) for more details.  

On the **Virtual Machines** page, if you select the name of a VM under the column **VM Name**, you are directed to the VM instance page with more details of the alerts and health criteria issues identified that are affecting the selected VM.  From here you can filter the health state details by clicking on **Health State** icon in the upper left-hand corner of the page to see which components are unhealthy or you can view alerts raised by an unhealthy component categorized by alert severity.    

**Top health issues** provides an overview of the top five health issues identified on the VM and you can see the complete list of health issues by clicking on the **See more** option.  The 

The user can get an overview of the top health issues on the VM by going through the health criteria listed in this grid. The top 5 health issues on this VM are listed in this grid, the user can see the entire list of health issues by clicking on the see more option. 

The information that's presented here is described in the following table:

|Column | Description |
|-------|-------------|
|Health Criteria State |The health state health criteria monitoring this VM. |
|Health Criteria |The name of the health criteria. |
|Component type |Indicates the component type the health criteria is monitoring.  Example, Logical disk, Disk, Network adapter, etc. |
|Component name |The name of the component instance on the VM monitored by the health criteria. |
|Last State Change |The time difference of the last state change, which is a change from a unhealthy to health state. | 
|Category |Represented as *Availability* or *Performance*. |
|Type | The category of health criteria, which is represented as *Unit*, *Dependency*, *Aggregate*. |

