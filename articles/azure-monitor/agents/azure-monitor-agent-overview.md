---
title: Azure Monitor Agent overview
description: Overview of the Azure Monitor Agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 04/11/2024
ms.custom: references_regions
ms.reviewer: jeffwo

# Customer intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines.

---

# Azure Monitor Agent overview

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). This article provides an overview of Azure Monitor Agent's capabilities and supported use cases.

Here's a short **introduction to Azure Monitor agent video**, which includes a quick demo of how to set up the agent from the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

> [!NOTE]
> Azure Monitor Agent replaces the [Legacy Agent](./log-analytics-agent.md) for Azure Monitor. The Log Analytics agent is on a **deprecation path** and won't be supported after **August 31, 2024**. Any new data centers brought online after January 1 2024 will not support the Log Analytics agent. If you use the Log Analytics agent to ingest data to Azure Monitor, [migrate to the new Azure Monitor agent](./azure-monitor-agent-migration.md) prior to that date. 

## Supported regions

Azure Monitor Agent is available in all public regions, Azure Government and China clouds, for generally available features. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).

## Costs

There's no cost for the Azure Monitor Agent, but you might incur charges for the data ingested and stored. For information on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Supported services and features

The following tables identify the different environments and features that are supported by Azure Monitor agent in addition to those supported by the legacy agent. This information will assist you in determining whether Azure Monitor agent can support your current requirements. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md#migrate-additional-services-and-features) for guidance on migrating specific features.


### Windows agents

|	Category |	Area	|	Azure Monitor Agent	|	Legacy Agent |
|:---|:---|:---|:---|
|	**Environments supported**	|		|		|		|
|		|	Azure	| ✓ | ✓ |
|		|	Other cloud (Azure Arc)	| ✓ | ✓ |
|		|	On-premises (Azure Arc)	| ✓ | ✓ |
|		|	Windows Client OS	| ✓ |		|
|	**Data collected**	|		|		|		|
|		|	Event Logs	| ✓ | ✓ |
|		|	Performance	| ✓ | ✓ |
|		|	File based logs	|	✓ 	| ✓ |
|		|	IIS logs	|	✓ 	| ✓ |
|	**Data sent to**	|		|		|		|
|		|	Azure Monitor Logs	| ✓ | ✓ |
|	**Services and features supported**	|		|		|		|
|		|	Microsoft Sentinel 	|	✓ ([View scope](./azure-monitor-agent-migration.md#migrate-additional-services-and-features))	| ✓ |
|		|	VM Insights	|	✓ | ✓ |
|		|	Microsoft Defender for Cloud - Only uses MDE agent	|		|  |
|		|	Automation Update Management - Moved to Azure Update Manager	| ✓	| ✓ |
|   | Azure Stack HCI | ✓ |  |
|		|	Update Manager - no longer uses agents	| 	|		|
|		|	Change Tracking	| ✓ | ✓ |
|   | SQL Best Practices Assessment | ✓ |     |

### Linux agents

|	Category	|	Area	|	Azure Monitor Agent	|	Legacy Agent	|
|:---|:---|:---|:---|
|	**Environments supported**	|		|		|		|
|		|	Azure	| ✓ | ✓ |
|		|	Other cloud (Azure Arc)	| ✓ | ✓ |
|		|	On-premises (Azure Arc)	| ✓ | ✓ |
|	**Data collected**	|		|		|
|		|	Syslog	| ✓ | ✓ |
|		|	Performance	| ✓ | ✓ |
|		|	File based logs	| ✓ |		|
|	**Data sent to**	|		|		|		|
|		|	Azure Monitor Logs	| ✓ | ✓ |
|	**Services and features supported**	|		|		|		|
|		|	Microsoft Sentinel 	|	✓ ([View scope](./azure-monitor-agent-migration.md#migrate-additional-services-and-features))	| ✓ |
|		|	VM Insights	| ✓ |	✓ |
|		|	Microsoft Defender for Cloud - Only use MDE agent	| | |
|		|	Automation Update Management - Moved to Azure Update Manager	|	✓	| ✓ |
|		|	Update Manager - no longer uses agents	|	|	|
|		|	Change Tracking	| ✓ | ✓ |



## Install the agent and configure data collection

Azure Monitor Agent uses [data collection rules](../essentials/data-collection-rule-overview.md), where you define which data you want each agent to collect. Data collection rules let you manage data collection settings at scale and define unique, scoped configurations for subsets of machines. You can define a rule to send data from multiple machines to multiple destinations across regions and tenants.

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).
> Cloning a machine with Azure Monitor Agent installed is not supported. The best practice for these situations is to use [Azure Policy](../../azure-arc/servers/deploy-ama-policy.md) or an Infrastructure as a code tool to deploy AMA at scale.

**To collect data using Azure Monitor Agent:**

1. Install the agent on the resource.

    | Resource type | Installation method | More information |
    |:---|:---|:---|
    | Virtual machines and VM scale sets | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) | Installs the agent by using Azure extension framework. |
    | On-premises Arc-enabled servers | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) (after installing the [Azure Arc agent](../../azure-arc/servers/deployment-options.md)) | Installs the agent by using Azure extension framework, provided for on-premises by first installing [Azure Arc agent](../../azure-arc/servers/deployment-options.md). |
    | Windows 10, 11 Client Operating Systems | [Client installer](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. The installer works on laptops, but the agent *isn't optimized yet* for battery or network consumption. |

1. Define a data collection rule and associate the resource to the rule.

    The table below lists the types of data you can currently collect with the Azure Monitor Agent and where you can send that data.

    | Data source | Destinations | Description |
    |:---|:---|:---|
    | Performance | <ul><li>Azure Monitor Metrics (Public preview):<ul><li>For Windows - Virtual Machine Guest namespace</li><li>For Linux<sup>1</sup> - azure.vm.linux.guestmetrics namespace</li></ul></li><li>Log Analytics workspace - [Perf](/azure/azure-monitor/reference/tables/perf) table</li></ul> | Numerical values measuring performance of different aspects of operating system and workloads |
    | Windows event logs (including sysmon events) | Log Analytics workspace - [Event](/azure/azure-monitor/reference/tables/Event) table | Information sent to the Windows event logging system |
    | Syslog | Log Analytics workspace - [Syslog](/azure/azure-monitor/reference/tables/syslog)<sup>2</sup> table | Information sent to the Linux event logging system. [Collect syslog with Azure Monitor Agent](data-collection-syslog.md) |
    |	Text and JSON logs	|	Log Analytics workspace - custom table(s) created manually |	[Collect text logs with Azure Monitor Agent](data-collection-text-log.md)	|
    | Windows IIS logs |Internet Information Service (IIS) logs from to the local disk of Windows machines |[Collect IIS Logs with Azure Monitor Agent].(data-collection-iis.md) |
    | Windows Firewall logs | Firewall logs from the local disk of a Windows Machine| |


    <sup>1</sup> On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.<br>
    <sup>2</sup> Azure Monitor Linux Agent versions 1.15.2 and higher support syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).

    > [!NOTE]
    > On rsyslog-based systems, Azure Monitor Linux Agent adds forwarding rules to the default ruleset defined in the rsyslog configuration. If multiple rulesets are used, inputs bound to non-default ruleset(s) are **not** forwarded to Azure Monitor Agent. For more information about multiple rulesets in rsyslog, see the [official documentation](https://www.rsyslog.com/doc/master/concepts/multi_ruleset.html).

    > [!NOTE]
    > Azure Monitor Agent also supports Azure service [SQL Best Practices Assessment](/sql/sql-server/azure-arc/assess/) which is currently Generally available. For more information, refer [Configure best practices assessment using Azure Monitor Agent](/sql/sql-server/azure-arc/assess#enable-best-practices-assessment).



## Frequently asked questions

This section provides answers to common questions.

### Does Azure Monitor require an agent?

An agent is only required to collect data from the operating system and workloads in virtual machines. The virtual machines can be located in Azure, another cloud environment, or on-premises. See [Azure Monitor Agent overview](./agents-overview.md).

### Does Azure Monitor Agent support data collection for the various Log Analytics solutions and Azure services like Microsoft Defender for Cloud and Microsoft Sentinel?

For a list of features and services that use Azure Monitor Agent for data collection, see [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md#migrate-additional-services-and-features).

Some services might install other extensions to collect more data or to transforms or process data, and then use Azure Monitor Agent to route the final data to Azure Monitor.

The following diagram explains the new extensibility architecture.

:::image type="content" source="./media/azure-monitor-agent/extensibility-arch-new.png" lightbox="./media/azure-monitor-agent/extensibility-arch-new.png" alt-text="Diagram that shows extensions architecture.":::

### Does Azure Monitor Agent support non-Azure environments like other clouds or on-premises?

Both on-premises machines and machines connected to other clouds are supported for servers today, after you have the Azure Arc agent installed. For purposes of running Azure Monitor Agent and data collection rules, the Azure Arc requirement comes at *no extra cost or resource consumption*. The Azure Arc agent is only used as an installation mechanism. You don't need to enable the paid management features if you don't want to use them.

### Does Azure Monitor Agent support auditd logs on Linux or AUOMS?

Yes, but you need to [onboard to Defender for Cloud](./azure-monitor-agent-overview.md#supported-services-and-features) (previously Azure Security Center). It's available as an extension to Azure Monitor Agent, which collects Linux auditd logs via AUOMS.

### Why do I need to install the Azure Arc Connected Machine agent to use Azure Monitor Agent?

Azure Monitor Agent authenticates to your workspace via managed identity, which is created when you install the Connected Machine agent. Managed Identity is a more secure and manageable authentication solution from Azure. The legacy Log Analytics agent authenticated by using the workspace ID and key instead, so it didn't need Azure Arc.

## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
