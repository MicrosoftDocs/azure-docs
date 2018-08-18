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
ms.date: 08/08/2018
ms.author: magoedte

---

## Overview of Azure Monitor VM insights

Azure Monitor VM insights monitors your Azure virtual machines (VM) at scale by analyzing the performance and health of your Windows and Linux VMs, including their different processes and interconnected dependencies on other resources and external processes. It includes three key features to deliver this in-depth insight:
​
* Core performance metrics from processor, memory, disk, and network adapter of the guest VM operating system are collected and presented in pre-defined trending performance charts.
* Dependency map showing the discovered interconnected components with that VM from multiple resource groups and subscriptions
* Logical components of Azure VMs running Windows and Linux operating system are measured based on a set of pre-configured health criteria and alerts when the evaluated condition is met

Integration with Log Analytics delivers powerful aggregation, filtering, and ability to perform trend analysis of the data over time. 

* List of benefits/value of this solution (each feature of it delivers value) versus just pulling telemetry using Azure Monitor/Log Analytics/Service Maps independently
 
You can view this data in the context of single instance of the VM from the virtual machine resource blade, and as an aggregated view of all VMs in your subscription from Azure Monitor. 

[Virtual machine insights perspective from portal](./media/monitoring-vminsights-overview/access-solution-perspective-01.png)

DevOps can effectively deliver predictable performance and availability of vital applications by identifying critical operating system events and performance bottlenecks, network issues, and understand if an issue is related to other dependencies.  

![VM Insights performance charts preview](./media/monitoring-vminsights-overview/example-performance-charts-01.png)

These charts help you understand resource utilization over a period time while investigating resource utilization issues detected or during proactive analysis.  

What are the financial factors to consider before enabling this solution?
What is the amount of data ingested per VM broken down by performance and health feature?
- This should probably be summarized in the deployment article.



