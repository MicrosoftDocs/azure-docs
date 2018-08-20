---
title: Overview of Azure Monitor VM insights | Microsoft Docs
description: VM insights is a solution in Azure that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article provides an overview.
services:  monitoring
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service:  monitoring
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/20/2018
ms.author: magoedte

---

## Overview of Azure Monitor VM insights

Azure Monitor VM insights monitors your Azure virtual machines (VM) at scale by analyzing the performance and health of your Windows and Linux VMs, including their different processes and interconnected dependencies on other resources and external processes. It includes three key features to deliver this in-depth insight:
​
* Core performance metrics from processor, memory, disk, and network adapter of the guest VM operating system are collected and presented in pre-defined trending performance charts.
* Dependency map showing the discovered interconnected components with that VM from multiple resource groups and subscriptions
* Logical components of Azure VMs running Windows and Linux operating system are measured based on a set of pre-configured health criteria and alerts when the evaluated condition is met

Integration with Log Analytics delivers powerful aggregation, filtering, and ability to perform trend analysis of the data over time. 

The comprehensive monitoring of your applications can't be achieved alone with Azure Monitor, Service Maps, or Log Analytics.  

You can view this data in the context of single instance of the VM from the virtual machine directly, and as an aggregated view of all VMs in your subscription from Azure Monitor. 

[Virtual machine insights perspective from portal](./media/monitoring-vminsights-overview/access-solution-perspective-01.png)

DevOps can effectively deliver predictable performance and availability of vital applications by identifying critical operating system events and performance bottlenecks, network issues, and understand if an issue is related to other dependencies.  


## Data usage 

As soon as you onboard the solution, data collected by your VMs is ingested and stored in Azure Log Analytics.  Pricing for Log Analytics can be found [here](https://azure.microsoft.com/pricing/details/log-analytics/) if you are new to the service and unfamiliar with the cost. 

The cost of data can be considerable depending on the following factors: 
* Number of systems you are collecting from and the collection frequency
* Type of data created by the source.  In this case, performance metrics, virtual machine process identity information, and detailed connection events.
* The period data is retained in the workspace

The log size varies based on string lengths of counters and can increase with the number of logical disks and network adapters.  If you already have a workspace and are collecting these counters, there will not be any duplicate charges applied.  ​
​
Based on our testing with a standard configuration of the solution, the following is 



typical VM may generate about 0.5 GB per month of performance data with using a 60 second collection interval. ​
​
If you are already using Service Map, the only change you’ll see is the additional connection data being sent to Log Analytics.​


