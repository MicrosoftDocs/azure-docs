---
title: Migrate from legacy agents to the new Azure Monitor agent
description: Guidance for migrating from the existing legacy agents to the new Azure Monitor agent and data collection rules.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 7/12/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Migrate from a Log Analytics agent
This article provides high-level guidance on when and how to migrate to the new Azure Monitor agent (AMA) and data collection rules. This article will be updated when new migration tooling is available.


## Review
- To help you decide if you should migrate to the new Azure Monitor agent now or later, see the guidance in [Azure Monitor agent overview](./azure-monitor-agent-overview.md#should-i-switch-to-the-azure-monitor-agent).
- For the Azure Monitor agent, review the new capabilities; the availability of existing features, services, and solutions; and current limitations in [Overview of Azure Monitor agents](./agents-overview.md#azure-monitor-agent).


## Test migration by using the Azure portal
1. To ensure safe deployment during migration, begin testing with a few resources in your nonproduction environment that are running the existing Log Analytics agent. After you can validate the data collected on these test resources, roll out to production by following the same steps.
1. Go to **Monitor** > **Settings** > **Data Collection Rules** and [create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) to start collecting some of the existing data types. When you use the portal GUI, it performs the following steps on all the target resources for you:
	- Enables system-assigned managed identity
	- Installs the Azure Monitor agent extension
	- Creates and deploys data collection rule associations
1. Validate data is flowing as expected via the Azure Monitor agent. Check the **Heartbeat** table for new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.


## At-scale migration by using policies
1. Start by analyzing your current monitoring setup with MMA/OMS by using the following criteria:
	- Sources, such as virtual machines, virtual machine scale sets, and on-premises servers
	- Data sources, such as performance counters, Windows event logs, and Syslog
	- Destinations, such as Log Analytics workspaces
1. [Create new data collection rules](/rest/api/monitor/datacollectionrules/create#examples) by using the preceding configuration. As a best practice, you might want to have a separate data collection rule for Windows versus Linux sources. Or you might want separate data collection rules for individual teams with different data collection needs.
1. [Enable system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#system-assigned-managed-identity) on target resources.
1. Install the Azure Monitor agent extension. Deploy data collection rule associations on all target resources by using the [built-in policy initiative](../deploy-scale.md#built-in-policy-initiatives). Provide the preceding data collection rule as an input parameter. 
1. Validate data is flowing as expected via the Azure Monitor agent. Check the **Heartbeat** table for new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.
1. Validate all downstream dependencies like dashboards, alerts, and runbook workers. Workbooks all continue to function now by using data from the new agent.
1. [Uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources. Don't uninstall it if you need to use it for System Center Operations Manager scenarios or other solutions not yet available on the Azure Monitor agent.
1. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.


