---
author: shseth
ms.author: shseth
ms.topic: include
ms.date: 3/22/2022
---

## Overview of the technical architecture
Before you read further, you must be familiar with [Azure Monitor agent](./azure-monitor-agent-overview.md) and [Data Collection Rules](./data-collection-rule-azure-monitor-agent.md).  
The diagram below shows overall archtecture of the components involved when using the Azure Monitor agent, including the data flow and control flow in the sequence that it occurs.

### Terminology
- Azure Monitor Agent or AMA
- Data Collection Rules or DCR
- Azure Monitor Configuration Service (AMCS) - Regional service hosted in Azure, which controls data collection for this agent and other parts of Azure Monitor. The agent calls into this service to fetch DCRs.
- Logs Pipeline - Data pipeline for sending data to Log Analytics workspaces.
- Metrics Pipeline - Data pipeline for sending data to Azure Monitor Metrics databases.
- Instance Metadata Service (IMDS) and Hybrid IMDS (HIMDS) - Services hosted in Azure which provide information about currently running virtual machines, scale sets (via IMDS) and Arc-enabled servers (via HIMDS) respectively. [Learn more]