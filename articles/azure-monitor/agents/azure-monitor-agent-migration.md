---
title: Migrate from legacy agents to the new Azure Monitor agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 02/09/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Migrate to Azure Monitor agent from Log Analytics agent
The [Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor where it can be used by different features, insights, and other services such [Microsoft Sentinel](../../sentintel/../sentinel/overview.md). The Azure Monitor agent is meant to replace the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines. This article provides high-level guidance on when and how to migrate to the new Azure Monitor agent (AMA) and the data collection rules (DCR) that define the data the agent should collect.

The decision to migrate to AMA will be based on the different features and services that you use. Considerations for Azure Monitor and Microsoft Sentinel are provided here since they should be considered together in your migration strategy. 

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are currently using the Log Analytics agent with Azure Monitor or Microsoft Sentinel, you should start planning your migration to the Azure Monitor agent using the information in this article.

## Current capabilities

Azure Monitor agent current supports the following core functionality:

- **Collect guest logs and metrics** from any machine in Azure, in other clouds, or on-premises. [Azure Arc-enabled servers](/azure/azure-arc/servers/overview) are required for machines outside of Azure.
- **Centrally manage data collection configuration** using [data collection rules](/azure/azure-monitor/agents/data-collection-rule-overview), and management configuration using Azure Resource Manager (ARM) templates or policies.
- **Use Windows event filtering or multi-homing** for Windows or Linux logs.


## Plan your migration

You migration plan to the Azure Monitor agent should include the following considerations:

|Consideration  |Description  |
|---------|---------|
| **Preview status** | Some features of Azure Monitor and other services are supported with the AMA in Public Preview. For more information, see [Supported services and features](/azure/azure-monitor/agents/azure-monitor-agent-overview#supported-services-and-features) for a current status. |
|**Environment requirements**     | Verify that your environment is currently supported by the AMA. For more information, see [Supported operating systems](/azure/azure-monitor/agents/agents-overview#supported-operating-systems).         |
|**Current and new feature requirements**     | While the AMA provides [several new features](#current-capabilities), such as filtering, scoping, and multi-homing, it is not yet at parity with the legacy Log Analytics agent.As you plan your migration, make sure that the features your organization requires are already supported by the AMA. You may decide to continue using the Log Analytics agent for now, and migrate at a later date, or run both agents side by side. <br><br>The following features are not currently supported: <br><br>- VM insights<br>- Networking scenarios including private link and AMPLS<br>- Support for collecting custom log files or IIS log files<br>- Support for Event Hubs and Storage accounts as destinations<br>- Hybrid Runbook workers|
|<a name="capacity-planning"></a>**Capacity planning**     | The AMA currently has a limit of 5,000 Events Per Second (EPS). Verify whether this limit works for your organization, especially if you are using your servers as log forwarders, such as for Windows forwarded events or Syslog events.|

## Gap analysis between agents
The following tables show gap analyses for the log types that are currently collected by each agent. This will be updated as support for AMA grows towards parity with the Log Analytics agent. For a general comparison of Azure Monitor agents, see [Overview of Azure Monitor agents](../agents/azure-monitor-agent-overview.md).


> [!IMPORTANT]
> If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the additional data collected by Microsoft Sentinel.


### Windows logs

|Log type / Support  |Azure Monitor agent support |Log Analytics agent support  |
|---------|---------|---------|
| **Security Events** | Yes | No |
| **Performance counters** | Yes | Yes |
| **Windows Event Logs** | Yes | Yes |
| **Filtering by event ID** | Yes | No |
| **Custom logs** | No | Yes |
| **IIS logs** | No | Yes |
| **Application and service logs** | Yes | Yes |
| **DNS logs** | No | Yes |
| **Multi-homing** | Yes | Yes |

### Linux logs

|Log type / Support  |Azure Monitor agent support |Log Analytics agent support  |
|---------|---------|---------|
| **Syslog** | Yes | Yes |
| **Custom logs** | No | Yes |
| **Multi-homing** | Yes | No |


## Test migration by using the Azure portal
To ensure safe deployment during migration, you should begin testing with a few resources in your nonproduction environment that are running the existing Log Analytics agent. After you can validate the data collected on these test resources, roll out to production by following the same steps.

See [create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) to start collecting some of the existing data types. Once you validate data is flowing as expected with the Azure Monitor agent, check the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table to verify new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.


## At-scale migration using Azure Policy
This section provides basic guidance for migrating a large set of agents using scalable methods including Azure Policy. These steps rely on an understanding of [Azure Policy]() and [Resource Manager templates](../resource-manager-samples.md).

> [!NOTE]
> Windows and Linux machines that reside on cloud platforms other than Azure, or are on-premises machines, must be Azure Arc-enabled so that the AMA can send logs to the Log Analytics workspace. For more information, see: 
>
> - [What are Azure Arc–enabled servers?](/azure/azure-arc/servers/overview)
> - [Overview of Azure Arc – enabled servers agent](/azure/azure-arc/servers/agent-overview)
> - [Plan and deploy Azure Arc – enabled servers at scale](/azure/azure-arc/servers/plan-at-scale-deployment)

1. Start by analyzing your current monitoring setup with Log Analytics using the following criteria:
	- Sources, such as virtual machines, virtual machine scale sets, and on-premises servers
	- Data sources, such as performance counters, Windows event logs, and Syslog
	- Destinations, such as Log Analytics workspaces

	See the following for existing configuration with the Log Analytics agent.

	- **Data collected from workspace.** Includes system and application events in addition to performance counters: [Data collection rules in Azure Monitor](../../sentinel/connect-azure-windows-microsoft-services.md#windows-agent-based-connections)
	- **Microsoft Sentinel-specific events:** [Windows agent-based connections](data-collection-rule-overview.md)


2. [Create new data collection rules](../agents/data-collection-rule-overview.md#create-a-dcr) to duplicate your data collection with the Log Analytics agent. You may might find it more manageable to have separate data collection rules for Windows versus Linux sources. You may also separate data collection rules for individual teams with different data collection needs.

3. Use a resource manager template to [enable system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#system-assigned-managed-identity) on target resources since this is required for Azure Monitor agent.

4. Install the Azure Monitor agent extension to virtual machines and associate your data collection rules using the [built-in policy initiative](azure-monitor-agent-install.md#install-with-azure-policy).

8. Validate data is flowing as expected via the Azure Monitor agent. Check the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table in your Log Analytics workspace for new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.


9. Validate all downstream dependencies like dashboards, alerts, and runbook workers. Workbooks all continue to function now by using data from the new agent.

10. [Uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources. Don't uninstall it if you need to use it for System Center Operations Manager scenarios or other solutions not yet available on the Azure Monitor agent.

11. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.

## Next steps

For more information, see:

- [Overview of the Azure Monitor agents](agents-overview.md)
- [AMA migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for AMA migration](/azure/azure-monitor/faq#azure-monitor-agent)
