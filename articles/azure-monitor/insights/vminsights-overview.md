---
title: What is Azure Monitor for VMs (preview)? | Microsoft Docs
description: Azure Monitor for VMs is a feature of Azure Monitor that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article provides an overview.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/13/2019
ms.author: magoedte
---

# What is Azure Monitor for VMs (preview)?

Azure Monitor for VMs monitors your Azure virtual machines (VM) and virtual machine scale sets at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. 

As a solution, Azure Monitor for VMs includes support for monitoring performance and application dependencies for VMs that are hosted on-premises or in another cloud provider. Three key features deliver in-depth insight:

* **Logical components of Azure VMs that run Windows and Linux**: Are measured against pre-configured health criteria, and they alert you when the evaluated condition is met.  ​

* **Pre-defined trending performance charts**: Display core performance metrics from the guest VM operating system.

* **Dependency map**: Displays the interconnected components with the VM from various resource groups and subscriptions.  

The features are organized into three perspectives:

* Health
* Performance
* Map

>[!NOTE]
>Currently, the Health feature is offered only for Azure virtual machines. Performance and Map features support Azure VMs, Azure VM scale sets, and virtual machines that are hosted in your environment or other cloud provider.

Integration with Azure Monitor logs delivers powerful aggregation and filtering, and it can analyze data trends over time. Such comprehensive workload monitoring can't be achieved with Azure Monitor or Service Map alone.  

You can view this data in a single VM from the virtual machine directly, or you can use Azure Monitor to deliver an aggregated view of your VMs. This view is based on each feature's perspective:

* **Health**: The VMs are related to a resource group.
* **Map** and **Performance**: The VMs are configured to report to a specific Log Analytics workspace.

![Virtual machine insights perspective in the Azure portal](./media/vminsights-overview/vminsights-azmon-directvm-01.png)

Azure Monitor for VMs can deliver predictable performance and availability of vital applications. It identifies critical operating system events, performance bottlenecks, and network issues. Azure Monitor for VMs can also help you understand whether an issue is related to other dependencies.  

## Data usage 

When you deploy Azure Monitor for VMs, the data that's collected by your VMs is ingested and stored in Azure Monitor. Health criteria metrics are stored in Azure Monitor in a time-series database, performance and dependency data collected are stored in a Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), Azure Monitor for VMs is billed for:

* The data that's ingested and stored.
* The number of health criteria metric time-series that are monitored.
* The alert rules that are created.
* The notifications that are sent. 

The log size varies by the string lengths of performance counters, and it can increase with the number of logical disks and network adapters allocated to the VM. If you already have a workspace and are collecting these counters, no duplicate charges are applied. If you're already using Service Map, the only change you’ll see is the additional connection data that's sent to Azure Monitor.​

## Next steps
To understand the requirements and methods that help you monitor your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-enable-overview.md).
