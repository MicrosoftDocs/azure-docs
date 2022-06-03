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
The [Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor where it can be used by different features, insights, and other services such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). All of the data collection configuration is handled via [Data Collection Rules](../essentials/data-collection-rule-overview.md). The Azure Monitor agent is meant to replace the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines. This article provides high-level guidance on when and how to migrate to the new Azure Monitor agent (AMA) and the data collection rules (DCR) that define the data the agent should collect.

## Why should I migrate to the Azure Monitor agent?
- **Security and performance**
  - AMA uses Managed Identity or AAD tokens (for clients) which are much more secure than the legacy authentication methods. 
  - AMA can provide higher events per second (EPS) upload rate compared to legacy agents
- **Cost savings** via efficient data collection [using Data Collection Rules](data-collection-rule-azure-monitor-agent.md). This is one of the most useful advantages of using AMA.
  - DCRs allow granular targeting of machines connected to a workspace to collect data from as compared to the “all or nothing” mode that legacy agents have.
  - Using DCRs, you can filter out data to remove unused events and save additional costs.  

- **Simpler management** of data collection, including ease of troubleshooting
  - **Multihoming** on both Windows and Linux is possible easily
  - Every action across the data collection lifecycle, from onboarding/setup to deployment to updates and changes over time, is significantly easier and scalable thanks to agent configuration becoming centralized and ‘in the cloud’ as compared to configuring things on every machine.
  - Enabling/disabling of additional capabilities or services (Sentinel, Defender for Cloud, VM Insights, etc) is more transparent and controlled, using the extensibility architecture of AMA.
- **A single agent** that will consolidate all the features necessary to address all telemetry data collection needs across servers and client devices (running Windows 10, 11) as compared to running various different monitoring agents. This is the eventual goal, though AMA is currently converging with the Log Analytics agents.

## When should I migrate to the Azure Monitor agent?
Your migration plan to the Azure Monitor agent should include the following considerations:

|Consideration  |Description  |
|---------|---------|
|**Environment requirements**     | Verify that your environment is currently supported by the AMA. For more information, see [Supported operating systems](./agents-overview.md#supported-operating-systems).         |
|**Current and new feature requirements**     | While the AMA provides [several new features](#current-capabilities), such as filtering, scoping, and multihoming, it is not yet at parity with the legacy Log Analytics agent.As you plan your migration, make sure that the features your organization requires are already supported by the AMA. You may decide to continue using the Log Analytics agent for now, and migrate at a later date. See [Supported services and features](./azure-monitor-agent-overview.md#supported-services-and-features) for a current status of features that are supported and that may be in preview. | 

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are currently using the Log Analytics agent with Azure Monitor or other supported features and services, you should start planning your migration to the Azure Monitor agent using the information in this article.

## Current capabilities

Azure Monitor agent currently supports the following core functionality:

- **Collect guest logs and metrics** from any machine in Azure, in other clouds, or on-premises. [Azure Arc-enabled servers](../../azure-arc/servers/overview.md) are required for machines outside of Azure.
- **Centrally manage data collection configuration** using [data collection rules](/azure/azure-monitor/agents/data-collection-rule-overview), and management configuration using Azure Resource Manager (ARM) templates or policies.
- **Use Windows event filtering or multi-homing** for Windows or Linux logs.
- **Improved extension management.** The Azure Monitor agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the current Log Analytics agents.

> [!NOTE]
> Windows and Linux machines that reside on cloud platforms other than Azure, or are on-premises machines, must be Azure Arc-enabled so that the AMA can send logs to the Log Analytics workspace. For more information, see: 
>
> - [What are Azure Arc–enabled servers?](../../azure-arc/servers/overview.md)
> - [Overview of Azure Arc – enabled servers agent](../../azure-arc/servers/agent-overview.md)
> - [Plan and deploy Azure Arc – enabled servers at scale](../../azure-arc/servers/plan-at-scale-deployment.md)


## Gap analysis between agents
The following tables show gap analyses for the **log types** that are currently collected by each agent. This will be updated as support for AMA grows towards parity with the Log Analytics agent. For a general comparison of Azure Monitor agents, see [Overview of Azure Monitor agents](../agents/azure-monitor-agent-overview.md).


> [!IMPORTANT]
> If you use Microsoft Sentinel, see [Gap analysis for Microsoft Sentinel](../../sentinel/ama-migrate.md#gap-analysis-between-agents) for a comparison of the additional data collected by Microsoft Sentinel.


### Windows logs

|Log type / Support  |Azure Monitor agent support |Log Analytics agent support  |
|---------|---------|---------|
| **Security Events** | Yes | No |
| **Performance counters** | Yes | Yes |
| **Windows Event Logs** | Yes | Yes |
| **Filtering by event ID** | Yes | No |
| **Text logs** | Yes | Yes |
| **IIS logs** | Yes | Yes |
| **Application and service logs** | Yes | Yes |
| **Multi-homing** | Yes | Yes |

### Linux logs

|Log type / Support  |Azure Monitor agent support |Log Analytics agent support  |
|---------|---------|---------|
| **Syslog** | Yes | Yes |
| **Performance counters** | Yes | Yes |
| **Text logs** | Yes | Yes |
| **Multi-homing** | Yes | No |


## Test migration by using the Azure portal
To ensure safe deployment during migration, you should begin testing with a few resources in your nonproduction environment that are running the existing Log Analytics agent. After you can validate the data collected on these test resources, roll out to production by following the same steps.

See [create new data collection rules](./data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) to start collecting some of the existing data types. Once you validate data is flowing as expected with the Azure Monitor agent, check the `Category` column in the [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat) table for the value *Azure Monitor Agent* for AMA collected data. Ensure it matches data flowing through the existing Log Analytics agent.


## At-scale migration using Azure Policy
[Azure Policy](../../governance/policy/overview.md) and [Resource Manager templates](../resource-manager-samples.md) provide scalability to migrate a large number of agents. 
Start by analyzing your current monitoring setup with the Log Analytics agent using the following criteria:

  - Sources, such as virtual machines, virtual machine scale sets, and on-premises servers
  - Data sources, such as performance counters, Windows event logs, and Syslog
  - Destinations, such as Log Analytics workspaces

> [!IMPORTANT]
> Before you deploy to a large number of agents, you should consider [configuring the workspace](agent-data-sources.md) to disable data collection for the Log Analytics agent. If you leave it enabled, you may collect duplicate data resulting in increased cost until you remove the Log Analytics agents from your virtual machines. Alternatively, you may choose to have duplicate collection during the migration period until you can confirm that the AMA has been deployed and configured correctly.

See [Using Azure Policy](azure-monitor-agent-manage.md#using-azure-policy) for details on deploying Azure Monitor agent across a set of virtual machines. Associate the agents to the data collection rules developed during your [testing](#test-migration-by-using-the-azure-portal). 

Validate that data is flowing as expected with the Azure Monitor agent and that all downstream dependencies like dashboards, alerts, and runbook workers. Workbooks should all continue to function using data from the new agent.

When you confirm that data is being collected properly, [uninstall the Log Analytics agent](./agent-manage.md#uninstall-agent) from the resources. Don't uninstall it if you need to use it for System Center Operations Manager scenarios or others solutions not yet available on the Azure Monitor agent. Clean up any configuration files, workspace keys, or certificates that were used previously by the Log Analytics agent.

## Next steps

For more information, see:

- [Overview of the Azure Monitor agents](agents-overview.md)
- [AMA migration for Microsoft Sentinel](../../sentinel/ama-migrate.md)
- [Frequently asked questions for AMA migration](/azure/azure-monitor/faq#azure-monitor-agent)
