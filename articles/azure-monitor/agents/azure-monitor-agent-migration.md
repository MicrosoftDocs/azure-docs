---
title: Migrate from legacy agents to the new Azure Monitor agent
description: This article provides guidance for migrating from the existing legacy agents to the new Azure Monitor agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 7/12/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Migrate from Log Analytics agents
The [Azure Monitor agent (AMA)](connect-azure-windows-microsoft-services.md#windows-agent-based-connections) collects monitoring data from the guest operating system of Azure virtual machines and delivers it to Azure Monitor solutions, including Log Analytics and Microsoft Sentinel. The [Azure Monitor agent](/azure/azure-monitor/agents/azure-monitor-agent-overview) is meant to replace the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines. This article provides high-level guidance on when and how to migrate to the new Azure Monitor agent (AMA) and data collection rules (DCR).

The decision 


> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are currently using the Log Analytics agent with Azure Monitor or Microsoft Sentinel, you should start planning your migration to the Azure Monitor agent.

## Current capabilities

Azure Monitor agent current supports the following core functionality:

- **Collect guest logs and metrics** from any machine in Azure, in other clouds, or on-premises. [Azure Arc-enabled servers](/azure/azure-arc/servers/overview) are required for machines outside of Azure.
- **Centrally manage data collection configuration** using [data collection rules](/azure/azure-monitor/agents/data-collection-rule-overview), and management configuration using Azure Resource Manager (ARM) templates or policies.
- **Use Windows event filtering or multi-homing** for Windows or Linux logs.


## Plan your migration

When planning your migration the Azure Monitor agent, consider the following:

|Consideration  |Description  |
|---------|---------|
| **Preview status** | Some features of Azure Monitor and other services are supported with the AMA in Public Preview. For more information, see [Supported services and features](/azure/azure-monitor/agents/azure-monitor-agent-overview#supported-services-and-features) for a current status. |
|**Environment requirements**     | Verify that your environment is currently supported by the AMA. For more information, see [Supported operating systems](/azure/azure-monitor/agents/agents-overview#supported-operating-systems).         |
|**Current and new feature requirements**     | While the AMA provides several new features, such as filtering, scoping, and multi-homing, it is not yet at parity with the legacy MMA/OMS agent.As you plan your migration, make sure that the features your organization requires are already supported by the AMA. You may decide to continue using the MMA/OMS agent for now, and migrate at a later date, or run both agents side by side. <br><br>The following features are not currently supported: <br><br>- VM insights<br>- Networking scenarios including private link and AMPLS. <br>- Support for collecting custom log files or IIS log files.<br>- Support for Event Hubs and Storage accounts as destinations. <br>- Hybrid Runbook workers|
|<a name="capacity-planning"></a>**Capacity planning**     | The AMA currently has a limit of 5,000 Events Per Second (EPS). Verify whether this limit works for your organization, especially if you are using your servers as log forwarders, such as for Windows forwarded events or Syslog events.|

## Gap analysis between agents
The following tables show gap analyses for the log types that currently rely on agent-based data collection. This will be updated as support for AMA grows towards parity with the MMA/OMS agent. Links are provided for any logs where collection is supported and whether a Microsoft Sentinel data collector already exists. 

> [!NOTE]
> For a general comparison of Azure Monitor agents, see [Overview of Azure Monitor agents](../agents/azure-monitor-agent-overview.md)

### Windows logs

|Log type / Support  |AMA support |MMA/OMS support  |
|---------|---------|---------|
|**Security Events**     |  [Windows Security Events data connector](../../sentinel/data-connectors-reference.md#windows-security-events-via-ama)  (Public preview)     |  [Windows Security Events data connector (Legacy)](../../sentinel/data-connectors-reference.md#security-events-via-legacy-agent-windows)       |
|**Filtering by security event ID**     |   [Windows Security Events data connector (AMA)](../../sentinel/data-connectors-reference.md#windows-security-events-via-ama)  (Public preview)    |     -     |
|**Filtering by event ID**     | Collection only        |   -       |
|**Windows Event Forwarding**     |  [Windows Forwarded Events](../../sentinel/data-connectors-reference.md#windows-forwarded-events-preview) (Public Preview)       |     -     |
|**Windows Firewall Logs**     |  -        |  [Windows Firewall data connector](../../sentinel/data-connectors-reference.md#windows-firewall)       |
|**Performance counters**     |   Collection only      |  Collection only       |
|**Windows Event Logs**     |  Collection only       | Collection only        |
|**Custom logs**     |   -       |    Collection only     |
|**IIS logs**     |    -      |    Collection only     |
|**Multi-homing**     |  Collection only       |   Collection only      |
|**Application and service logs**     |    -      |    Collection only     |
|**Sysmon**     |    -      |      Collection only   |
|**DNS logs**     |   -       | Collection only        |
| | | |

### Linux logs

|Log type / Support  |AMA support |MMA/OMS support  |
|---------|---------|---------|
|**Syslog**     |  [Collection only](#capacity-planning)      |   [Syslog data connector](../../sentinel/connect-syslog.md)      |
|**Common Event Format (CEF)**     |  Collection only       |  [CEF data connector](../../sentinel/connect-common-event-format.md)       |
|**Sysmon**     |   -       |  Collection only       |
|**Custom logs**     |   -       |  Collection only       |
|**Multi-homing**     |   Collection only      |     -     |
| | | |


## Test migration by using the Azure portal
1. To ensure safe deployment during migration, begin testing with a few resources in your nonproduction environment that are running the existing Log Analytics agent. After you can validate the data collected on these test resources, roll out to production by following the same steps.
1. Go to **Monitor** > **Settings** > **Data Collection Rules** and [create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) to start collecting some of the existing data types. When you use the portal GUI, it performs the following steps on all the target resources for you:
	- Enables system-assigned managed identity
	- Installs the Azure Monitor agent extension
	- Creates and deploys data collection rule associations
1. Validate data is flowing as expected via the Azure Monitor agent. Check the **Heartbeat** table for new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.


## At-scale migration using Azure Policy
This section provides basic guidance for migrating a large set of agents using scalable methods including Azure Policy. These steps rely on an understanding of [Azure Policy]() and [Resource Manager templates]().

> [!NOTE]
> Windows and Linux machines that reside on cloud platforms other than Azure, or are on-premises machines, must be Azure Arc-enabled so that the AMA can send logs to the Log Analytics workspace. For more information, see: 
>
> - [What are Azure Arc–enabled servers?](/azure/azure-arc/servers/overview)
> - [Overview of Azure Arc – enabled servers agent](/azure/azure-arc/servers/agent-overview)
> - [Plan and deploy Azure Arc – enabled servers at scale](/azure/azure-arc/servers/plan-at-scale-deployment)

1. Start by analyzing your current monitoring setup with MMA/OMS by using the following criteria:
	- Sources, such as virtual machines, virtual machine scale sets, and on-premises servers
	- Data sources, such as performance counters, Windows event logs, and Syslog
	- Destinations, such as Log Analytics workspaces

	See the following for existing configuration with the Log Analytics agent.

	- **Data collected from workspace.** This includes system and application events in addition to performance counters: [Data collection rules in Azure Monitor](../../sentinel/connect-azure-windows-microsoft-services#windows-agent-based-connections.md)
	- **Microsoft Sentinel-specific events:** [Windows agent-based connections](data-collection-rule-overview.md)


2. [Create new data collection rules](/rest/api/monitor/datacollectionrules/create#examples) to provide the same data collection you're currently Log Analytics agent. You may might find it more manageable to have separate data collection rules for Windows versus Linux sources. You may also separate data collection rules for individual teams with different data collection needs.

3. Use a resource manager template to [enable system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#system-assigned-managed-identity) on target resources since this is required for Azure Monitor agent.

4. Install the Azure Monitor agent extension. Deploy data collection rule associations on all target resources by using the [built-in policy initiative](azure-monitor-agent-install.md#install-with-azure-policy). Provide the preceding data collection rule as an input parameter. 

5. Validate data is flowing as expected via the Azure Monitor agent. Check the **Heartbeat** table in your Log Analytics workspace for new agent version values. Ensure it matches data flowing through the existing Log Analytics agent.


6. Validate all downstream dependencies like dashboards, alerts, and runbook workers. Workbooks all continue to function now by using data from the new agent.

7. [Uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources. Don't uninstall it if you need to use it for System Center Operations Manager scenarios or other solutions not yet available on the Azure Monitor agent.

8. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.


