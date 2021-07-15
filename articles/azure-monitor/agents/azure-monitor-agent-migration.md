---
title: Migrate from legacy agents to the new Azure Monitor agent
description: Guidance for migrating from the existing legacy agents to the new Azure Monitor agent (AMA) and Data Collection Rules (DCR)
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 7/12/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Migrating from Log Analytics agent
This article provides high-level guidance on when and how to migrate to the new Azure Monitor agent (AMA) and Data Collection Rules (DCR). This document will be updated as and when new migration tooling is available. 


## Review
- Go through the guidance [here](./azure-monitor-agent-overview.md#should-i-switch-to-azure-monitor-agent) to decide if you should migrate to the new Azure Monitor agent now or at a later time
- For the Azure Monitor agent, review the new capabilities, availability of existing features, services, solutions as well as current limitations [here](./agents-overview.md#azure-monitor-agent)


## Test migration using Azure portal
1. To ensure safe deployment during migration, it is recommended to begin testing with a few resources in your non-production environment that are running the existing Log Analytics agent. Once you can validate the data collected on these test resources, you can rollout to production following the same steps further
2. Go to 'Monitor > Settings > Data Collection Rules' and [create new data collection rule(s)](./data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) to start collecting some of the existing data types. When using the portal GUI, it performs the following steps on all the target resources, on your behalf:
	- Enable Managed Identity (System Assigned) 
	- Install the AMA extension 
	- Create and deploy DCR associations 
3. Validate data is flowing as expected via AMA (check ‘Heartbeat table’ for new agent version values), and ensure it matches data flowing through existing Log Analytics Agent


## At-scale migration using policies
1. Start by analyzing your current monitoring setup with MMA/OMS, using the below criteria:
	- Sources (virtual machines, virtual machine scale sets, on-premise servers)
	- Data Sources (Perf. Counters, Windows Event Logs, Syslog)
	- Destinations (Log Analytics workspaces)
2. [Create new data collection rule(s)](/rest/api/monitor/datacollectionrules/create#examples) as per above configuration. As a **best practice** you may want to have a separate DCR for Windows vs Linux sources, or separate DCRs for individual teams with different data collection needs.
3. [Enable Managed Identity (System Assigned)](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#system-assigned-managed-identity) on target resources.
4. Install the AMA extension and deploy DCR associations on all target resources using the [built-in policy initiative](../deploy-scale.md#built-in-policy-initiatives), and providing the above DCR as input parameter. 
5. Validate data is flowing as expected via AMA (check ‘Heartbeat table’ for new agent version values), and ensure it matches data flowing through existing Log Analytics Agent
6. Validate all downstream dependencies like dashboards, alerts, runbook workers, workbooks all continue to function now using data from the new agent 
7. [Uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources, unless you need to use them for System Center Operations Manager (SCOM) scenarios, or other solutions not yet available on AMA.
8. Clean up any configuration files, workspace keys or certificates that were being used previously by Log Analytics agent.


