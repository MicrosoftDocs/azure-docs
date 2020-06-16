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


## Other agents
The Azure Monitor Agent replaces the following agents that are currently 

As part of an effort to consolidate and simplify the approach to data collection in Azure Monitor, we are introducing a new concept for data collection configuration and a new, unified agent for Azure Monitor. In this preview state there are limited types of data that can be collected and limited destinations where the data can be sent, but the capabilities improve on a few key areas of data collection from VMs in Azure Monitor:

- Scoping – the new capabilities make it possible to collect different sets of data from different scopes of VMs and send all that data into one workspace.
- Linux multi-homing – the new Linux agent can send the same or different data to multiple workspaces.
- Windows event filtering – the new configuration method uses XPATH queries for defining which Windows events are collected, providing a much more robust filter language than the existing options in the workspace Advanced Settings.
- Improved extension management – the new agent moves to a new method of handling extensibility that is more transparent and controllable than the management of Management Packs and Linux plug-ins in the current Log Analytics agents.



### Collection rules
The methods for defining data collection for the existing agents are distinctly different, and each have challenges that are addressed with AMA. 

Log Analytics agent gets its configuration from a Log Analytics workspace. This is easy to centrally configure, but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.

Diagnostic extension has a configuration for each virtual machine. This is easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage.

The Data Collection Rule enables manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. It is independent of the workspace and independent of the VM. 



## Data Collection Rules (DCRs)
A Data Collection Rule (DCR) is made up of the following components.

| Component | Description |
|:---|:---|
| Data sources | Set of data sources you want to collect from a VM and the configuration for each. A data source is a unique source of monitoring data with its own format and method exposing its data. A single virtual machine has multiple data sources, such as Windows event log, performance counters, and syslog. Each has unique format such as XML and CEF. Each has a method of access such as event libraries and syslog server. |
| Streams | Data from data sources are consumed by Azure Monitor as streams. A stream is a unique handle that describes a set of data sources that will be transformed and schematized as one type. A stream will typically correspond to a particular table in the Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace, Azure Monitor Metrics, and Azure Event Hubs. | 
| Data flows | Definitions of which streams should be sent to which destinations. | 



## Next steps

