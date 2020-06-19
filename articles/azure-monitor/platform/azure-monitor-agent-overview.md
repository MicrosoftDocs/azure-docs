---
title: Azure Monitor agent overview
description: T
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Azure Monitor agent overview (preview)
The Azure Monitor Agent (AMA) is installed on virtual machines in Azure, other clouds, or on-premises to collect guest operating system and workload data into Azure Monitor. This articles describes the details of this agent including how to install it and how to create data collection rules to define data that should be collected.


## Relationship to other agents
The Azure Monitor Agent replaces the following agents that are currently used by Azure Monitor to collected guest data from virtual machines:

- [Log Analytics agent](log-analytics-agent.md) - Sends data to Log Analytics workspace and supports Azure Monitor for Virtual Machines and monitoring solutions.
- [Diagnostic extension](diagnostics-extension-overview.md) - Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.
- [Telegraf agent](collect-custom-metrics-linux-telegraf.md) - Send data to Azure Monitor Metrics (Linux only).

In addition to consolidating this functionality into a single agent, the Azure Monitor Agent provides the following benefits over the existing agents:

- Scoping. Collect different sets of data from different scopes of VMs.
- Linux multi-homing. Send data from Linux VMs to multiple workspaces.
- Windows event filtering. Use XPATH queries to define which Windows events are collected.
- Improved extension management. The new agent uses a new method of handling extensibility that is more transparent and controllable than the management of Management Packs and Linux plug-ins in the current Log Analytics agents.

### Collection rules
The methods for defining data collection for the existing agents are distinctly different, and each have challenges that are addressed with AMA. 

Log Analytics agent gets its configuration from a Log Analytics workspace. This is easy to centrally configure, but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.

Diagnostic extension has a configuration for each virtual machine. This is easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage.

The Data Collection Rule enables manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. It is independent of the workspace and independent of the VM. 


## Current limitations
The following limitations apply during public preview of the Azure Monitor Agent:

- The Data Collection Rule and any Log Analytics workspace used as a destination must be in the same region.
- Only Azure virtual machines are supported. On-premises virtual machines, virtual machine scale sets, Arc for Servers, Azure Kubernetes Service, and other compute resource types are not currently supported.
- The virtual machine must have access to the following HTTPS endpoints:
  - *.ods.opinsights.azure.com
  - *.ingest.monitor.azure.com
  - *.control.monitor.azure.com
- The following operating systems are currently supported:
  - Windows 
    - Windows Server 2019
    - Windows Server 2016
    - Windows Server 2012
    - Windows Server 2012 R2
  - Linux
    - CentOS 7
    - Oracle Linux 6, 7
    - RHEL 6, 7, 8
    - Debian 9 + 10
    - Ubuntu 14.04 LTS, 16.04 LTS, 18.04 LTS
    - SLES 11, 12, 15
 

## Installing the Azure Monitor Agent



## Next steps

