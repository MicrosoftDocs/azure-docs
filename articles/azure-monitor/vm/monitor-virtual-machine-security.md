---
title: 'Monitor virtual machines with Azure Monitor: Security'
description: Learn about services for monitoring security of virtual machines and how they relate to Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/28/2022
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Security monitoring
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes the Azure services for monitoring security for your virtual machines and how they relate to Azure Monitor. Azure Monitor was designed to monitor the availability and performance of your virtual machines and other cloud resources. While the operational data stored in Azure Monitor might be useful for investigating security incidents, other services in Azure were designed to monitor security. 

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md). 

> [!IMPORTANT]
> The security services have their own cost independent of Azure Monitor. Before you configure these services, refer to their pricing information to determine your appropriate investment in their usage.

## Azure services for security monitoring
Azure Monitor focuses on operational data like Activity logs, Metrics, and Log Analytics supported sources, including Windows Events (excluding security events), performance counters, logs, and Syslog. Security monitoring in Azure is performed by Microsoft Defender for Cloud and Microsoft Sentinel. These services each have additional cost, so you should determine their value in your environment before you implement them.


## Integration with Azure Monitor
The following table lists the integration points for Azure Monitor with the security services. All the services use the same Log Analytics agent, which reduces complexity because there are no other components being deployed to your virtual machines. Defender for Cloud and Microsoft Sentinel store their data in a Log Analytics workspace so that you can use log queries to correlate data collected by the different services. Or you can create a custom workbook that combines security data and availability and performance data in a single view.

| Integration point       | Azure Monitor | Microsoft Defender for Cloud | Microsoft Sentinel | Defender for Endpoint |
|:---|:---|:---|:---|:---|
| Collects security events     |   | X | X | X |
| Stores data in Log Analytics workspace | X | X | X |   | 
| Uses Log Analytics agent     | X | X | X | X | 



## Agent deployment
You can configure Defender for Cloud to automatically deploy the Log Analytics agent to Azure virtual machines. While this might seem redundant with Azure Monitor deploying the same agent, you'll most likely want to enable both because they'll each perform their own configuration. For example, if Defender for Cloud attempts to provision a machine that's already being monitored by Azure Monitor, it will use the agent that's already installed and add the configuration for the Defender for Cloud workspace.

## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
