---
author: shseth
ms.author: shseth
ms.topic: include
ms.date: 3/22/2022
---

## Overview for Azure Monitor agent
Before you read further, you must be familiar with [Azure Monitor agent](../../articles/azure-monitor/agents/azure-monitor-agent-overview.md) and [Data Collection Rules](../../articles/azure-monitor/agents/data-collection-rule-azure-monitor-agent.md).  


### Terminology

| Name | Acronym | Description |  
|:---|:---|:---| 
| Azure Monitor Agent | AMA | The new Azure Monitor agent |
| Data Collection Rules | DCR | Rules to configure collection of data by the agent, i.e. what to collect, where to send to, and more |
| Azure Monitor Configuration Service | AMCS | Regional service hosted in Azure, which controls data collection for this agent and other parts of Azure Monitor. The agent calls into this service to fetch DCRs. |
| Logs endpoint | -- | Endpoint for sending data to Log Analytics workspaces |
| Metrics endpoint | -- | Endpoint for sending data to Azure Monitor Metrics databases.
| Instance Metadata Service and Hybrid | IMDS and HIMDS | Services hosted in Azure which provide information about currently running virtual machines, scale sets (via IMDS) and Arc-enabled servers (via HIMDS) respectively | 
| Log Analytics workspace | LAW | The destination in Azure Monitor that you can send logs collected by the agent to |
| Custom Metrics | -- | The destination in Azure Monitor that you can send guest metrics collected by the agent to |  




