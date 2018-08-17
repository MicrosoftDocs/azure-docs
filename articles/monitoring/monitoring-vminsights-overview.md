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

Azure Monitor VM insights monitors your hybrid IaaS environment by analyzing the performance and health of your Windows and Linux virtual machines, including their different processes and interconnected dependencies on other resources and external processes. 

You can view this data in the context of single instance of the VM from the virtual machine resource blade, and as an aggregated view of all VMs in your subscription from Azure Monitor. 

[Virtual machine insights perspective from portal](./media/monitoring-vminsights-overview/access-solution-perspective-01.png)

DevOps can effectively deliver predictable performance and availability of vital applications by identifying critical operating system events and performance bottlenecks, network issues, and understand if an issue is related to other dependencies.  

Logical components of the operating system running on the VM, such as:

* core operating system services and features
* processor utilization
* memory utilization
* disk utilization, including logical disk perspective
* network adapter utilization 

are measured based on a set of pre-configured health criteria and alerts when the evaluated condition is met.  Core performance metrics from processor, memory, disk, and network adapter are collected and presented in pre-defined performance charts.  

![VM Insights performance charts preview](./media/monitoring-vminsights-overview/example-performance-charts-01.png)

These charts help you understand resource utilization over a period time while investigating resource utilization issues detected or when conducting proactive analysis.  







## Map overview
Service Map gathers information about all TCP-connected processes on the server where they’re installed and details about the inbound and outbound connections for each process.

### Discovery
Service Map automatically builds a common reference map of dependencies across your servers, processes, and third-party services. It discovers and maps all TCP dependencies, identifying surprise connections, remote third-party systems you depend on, and dependencies to traditional dark areas of your network, such as Active Directory. Service Map discovers failed network connections that your managed systems are attempting to make, helping you identify potential server misconfiguration, service outage, and network issues.

### Incident management
Service Map helps eliminate the guesswork of problem isolation by showing you how systems are connected and affecting each other. In addition to identifying failed connections, it helps identify misconfigured load balancers, surprising or excessive load on critical services, and rogue clients, such as developer machines talking to production systems. By using integrated workflows with Change Tracking, you can also see whether a change event on a back-end machine or service explains the root cause of an incident.

### Migration assurance
By using Service Map, you can effectively plan, accelerate, and validate Azure migrations, which helps ensure that nothing is left behind and surprise outages do not occur. You can discover all interdependent systems that need to migrate together, assess system configuration and capacity, and identify whether a running system is still serving users or is a candidate for decommissioning instead of migration. After the move is complete, you can check on client load and identity to verify that test systems and customers are connecting. If your subnet planning and firewall definitions have issues, failed connections in Service Map maps point you to the systems that need connectivity.

### Business continuity
If you are using Azure Site Recovery and need help defining the recovery sequence for your application environment, Service Map can automatically show you how systems rely on each other to ensure that your recovery plan is reliable. By choosing a critical server or group and viewing its clients, you can identify which front-end systems to recover after the server is restored and available. Conversely, by looking at critical servers’ back-end dependencies, you can identify which systems to recover before your focus systems are restored.

### Patch management
Service Map enhances your use of the System Update Assessment by showing you which other teams and servers depend on your service, so you can notify them in advance before you take down your systems for patching. Service Map also enhances patch management by showing you whether your services are available and properly connected after they are patched and restarted.