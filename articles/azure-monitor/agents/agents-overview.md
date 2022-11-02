---
title: Azure Monitor Agent overview
description: Overview of the Azure Monitor Agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 10/17/2022
ms.custom: references_regions
ms.reviewer: shseth

#customer-intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines. 
---

# Azure Monitor Agent overview

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services, such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). Azure Monitor Agent replaces all of Azure Monitor's legacy monitoring agents. This article provides an overview of Azure Monitor Agent's capabilities and supported use cases.

Here's a short **introduction to Azure Monitor video**, which includes a quick demo of how to set up the agent from the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

## Consolidating legacy agents

Deploy Azure Monitor Agent on all new virtual machines, scale sets and on premise servers to collect data for [supported services and features](#supported-services-and-features).

If you have machines already deployed with legacy Log Analytics agents, we recommend you [migrate to Azure Monitor Agent](./azure-monitor-agent-migration.md) as soon as possible. The legacy Log Analytics agent will not be supported after August 2024.

Azure Monitor Agent replaces the Azure Monitor legacy monitoring agents:

- [Log Analytics Agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports monitoring solutions. This is fully consolidated into Azure Monitor agent. 
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only). Only basic Telegraf plugins are supported today in Azure Monitor agent.
- [Diagnostics extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage. This is not consolidated yet.

## Install the agent and configure data collection  

Azure Monitor Agent uses [data collection rules](../essentials/data-collection-rule-overview.md), using which you define which data you want each agent to collect. Data collection rules let you manage data collection settings at scale and define unique, scoped configurations for subsets of machines. The rules are independent of the workspace and the virtual machine, which means you can define a rule once and reuse it across machines and environments. 

**To collect data using Azure Monitor Agent:**

1. Install the agent on the resource.

    | Resource type | Installation method | More information |
    |:---|:---|:---|
    | Virtual machines, scale sets | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) | Installs the agent by using Azure extension framework. |
    | On-premises servers (Azure Arc-enabled servers) | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) (after installing the [Azure Arc agent](../../azure-arc/servers/deployment-options.md)) | Installs the agent by using Azure extension framework, provided for on-premises by first installing [Azure Arc agent](../../azure-arc/servers/deployment-options.md). |
    | Windows 10, 11 desktops, workstations | [Client installer (Public preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. |
    | Windows 10, 11 laptops | [Client installer (Public preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. The installer works on laptops, but the agent *isn't optimized yet* for battery or network consumption. |
    
1. Define a data collection rule and associate the resource to the rule.

    The table below lists the types of data you can currently collect with the Azure Monitor Agent and where you can send that data.

    | Data source | Destinations | Description |
    |:---|:---|:---|
    | Performance        | Azure Monitor Metrics (Public preview)<sup>1</sup> - Insights.virtualmachine namespace<br>Log Analytics workspace - [Perf](/azure/azure-monitor/reference/tables/perf) table | Numerical values measuring performance of different aspects of operating system and workloads |
    | Windows event logs (including sysmon events) | Log Analytics workspace - [Event](/azure/azure-monitor/reference/tables/Event) table | Information sent to the Windows event logging system |
    | Syslog             | Log Analytics workspace - [Syslog](/azure/azure-monitor/reference/tables/syslog)<sup>2</sup> table | Information sent to the Linux event logging system |
    | Text logs | Log Analytics workspace - custom table | Events sent to log file on agent machine |
    
    <sup>1</sup> On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.<br>
    <sup>2</sup> Azure Monitor Linux Agent versions 1.15.2 and higher support syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).

    >[!NOTE]
    >On rsyslog-based systems, Azure Monitor Linux Agent adds forwarding rules to the default ruleset defined in the rsyslog configuration. If multiple rulesets are used, inputs bound to non-default ruleset(s) are **not** forwarded to Azure Monitor Agent. For more information about multiple rulesets in rsyslog, see the [official documentation](https://www.rsyslog.com/doc/master/concepts/multi_ruleset.html).

## Supported services and features

In addition to the generally available data collection listed above, Azure Monitor Agent also supports these Azure Monitor features in preview:

|	Azure Monitor feature	|	Current support	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	Text logs and Windows IIS logs	|	Public preview	|	None	|	[Collect text logs with Azure Monitor Agent (Public preview)](data-collection-text-log.md)	|
|	[VM insights](../vm/vminsights-overview.md)	|	Public preview 	|	Dependency Agent extension, if you’re using the Map Services feature	|	[Enable VM Insights overview](../vm/vminsights-enable-overview.md)	|

In addition to the generally available data collection listed above, Azure Monitor Agent also supports these Azure services in preview:

|	 Azure service	|	 Current support	|	Other extensions installed	|	 More information	|
|	:---	|	:---	|	:---	|	:---	|
| [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)	| Public preview	|	<ul><li>Azure Security Agent extension</li><li>SQL Advanced Threat Protection extension</li><li>SQL Vulnerability Assessment extension</li></ul> | [Auto-deployment of Azure Monitor Agent (Preview)](../../defender-for-cloud/auto-deploy-azure-monitoring-agent.md)	|
| [Microsoft Sentinel](../../sentinel/overview.md)	| <ul><li>Windows Security Events: [Generally available](../../sentinel/connect-windows-security-events.md?tabs=AMA)</li><li>Windows Forwarding Event (WEF): [Public preview](../../sentinel/data-connectors-reference.md#windows-forwarded-events-preview)</li><li>Windows DNS logs: [Public preview](../../sentinel/connect-dns-ama.md)</li><li>Linux Syslog CEF: Preview</li></ul> |	Sentinel DNS extension, if you’re collecting DNS logs. For all other data types, you just need the Azure Monitor Agent extension. | <ul><li>[Sign-up link for Linux Syslog CEF](https://aka.ms/amadcr-privatepreviews)</li><li>No sign-up needed for Windows Forwarding Event (WEF), Windows Security Events and Windows DNS events</li></ul> |
|	 [Change Tracking](../../automation/change-tracking/overview.md) |	 Change Tracking: Preview. 	|	Change Tracking extension	|	[Sign-up link](https://aka.ms/amadcr-privatepreviews)	|
|	 [Update Management](../../automation/update-management/overview.md) (available without Azure Monitor Agent)	|	 Use Update Management v2 - Public preview	|	None	|	[Update management center (Public preview) documentation](../../update-center/index.yml)	|
|	[Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md)	|	Connection Monitor: Preview	|	Azure NetworkWatcher extension	|	[Sign-up link](https://aka.ms/amadcr-privatepreviews)	|

## Supported regions

Azure Monitor Agent is available in all public regions and Azure Government clouds. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).
## Costs

There's no cost for the Azure Monitor Agent, but you might incur charges for the data ingested. For information on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Compare to legacy agents

The tables below provide a comparison of Azure Monitor Agent with the legacy the Azure Monitor telemetry agents for Windows and Linux. 

### Windows agents

|		|		|	Azure Monitor Agent	|	Log Analytics Agent	|	Diagnostics extension (WAD)	|
|	-	|	-	|	-	|	-	|	-	|
|	**Environments supported**	|		|		|		|		|
|		|	Azure	|	X	|	X	|	X	|
|		|	Other cloud (Azure Arc)	|	X	|	X	|		|
|		|	On-premises (Azure Arc)	|	X	|	X	|		|
|		|	Windows Client OS	|	X	|		|		|
|	**Data collected**	|		|		|		|		|
|		|	Event Logs	|	X	|	X	|	X	|
|		|	Performance	|	X	|	X	|	X	|
|		|	File based logs	|	X (Public preview)	|	X	|	X	|
|		|	IIS logs	|	X (Public preview)	|	X	|	X	|
|		|	ETW events	|		|		|	X	|
|		|	.NET app logs	|		|		|	X	|
|		|	Crash dumps	|		|		|	X	|
|		|	Agent diagnostics logs	|		|		|	X	|
|	**Data sent to**	|		|		|		|		|
|		|	Azure Monitor Logs	|	X	|	X	|		|
|		|	Azure Monitor Metrics<sup>1</sup>	|	X	|		|	X	|
|		|	Azure Storage	|		|		|	X	|
|		|	Event Hub	|		|		|	X	|
|	**Services and features supported**	|		|		|		|		|
|		|	Microsoft Sentinel 	|	X ([View scope](#supported-services-and-features))	|	X	|		|
|		|	VM Insights	|	X (Public preview)	|	X	|		|
|		|	Microsoft Defender for Cloud	|	X (Public preview)	|	X	|		|
|		|	Update Management	|	X (Public preview, independent of monitoring agents)	|	X	|		|
|		|	Change Tracking	|	|	X	|		|

### Linux agents

|		|		|	Azure Monitor Agent	|	Log Analytics Agent	|	Diagnostics extension (LAD)	|	Telegraf agent	|
|	-	|	-	|	-	|	-	|	-	|	-	|
|	**Environments supported**	|		|		|		|		|		|
|		|	Azure	|	X	|	X	|	X	|	X	|
|		|	Other cloud (Azure Arc)	|	X	|	X	|		|	X	|
|		|	On-premises (Azure Arc)	|	X	|	X	|		|	X	|
|	**Data collected**	|		|		|		|		|		|
|		|	Syslog	|	X	|	X	|	X	|		|
|		|	Performance	|	X	|	X	|	X	|	X	|
|		|	File based logs	|	X (Public preview)	|		|		|		|
|	**Data sent to**	|		|		|		|		|		|
|		|	Azure Monitor Logs	|	X	|	X	|		|		|
|		|	Azure Monitor Metrics<sup>1</sup>	|	X	|		|		|	X	|
|		|	Azure Storage	|		|		|	X	|		|
|		|	Event Hub	|		|		|	X	|		|
|	**Services and features supported**	|		|		|		|		|		|
|		|	Microsoft Sentinel 	|	X ([View scope](#supported-services-and-features))	|	X	|		|
|		|	VM Insights	|	X (Public preview)	|	X 	|		|
|		|	Microsoft Defender for Cloud	|	X (Public preview)	|	X	|		|
|		|	Update Management	|	X (Public preview, independent of monitoring agents)	|	X	|		|
|		|	Change Tracking	|	|	X	|		|

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v.1.10.9.0 or higher.

### Supported operating systems

The following tables list the operating systems that Azure Monitor Agent and the legacy agents support. All operating systems are assumed to be x64. x86 isn't supported for any operating system.  
View [supported operating systems for Azure Arc Connected Machine agent](../../azure-arc/servers/prerequisites.md#supported-operating-systems), which is a prerequisite to run Azure Monitor agent on physical servers and virtual machines hosted outside of Azure (that is, on-premises) or in other clouds.

#### Windows

| Operating system | Azure Monitor agent | Log Analytics agent (legacy) | Diagnostics extension | 
|:---|:---:|:---:|:---:|
| Windows Server 2022                                      | X |   |   |
| Windows Server 2022 Core                                 | X |   |   |
| Windows Server 2019                                      | X | X | X |
| Windows Server 2019 Core                                 | X |   |   |
| Windows Server 2016                                      | X | X | X |
| Windows Server 2016 Core                                 | X |   | X |
| Windows Server 2012 R2                                   | X | X | X |
| Windows Server 2012                                      | X | X | X |
| Windows Server 2008 R2 SP1                               | X | X | X |
| Windows Server 2008 R2                                   |   |   | X |
| Windows Server 2008 SP2                                  |   | X |   |
| Windows 11 Client Enterprise and Pro                     | X<sup>2</sup>, <sup>3</sup> |  |  |
| Windows 10 1803 (RS4) and higher                         | X<sup>2</sup> |  |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only<sup>1</sup>)  | X | X | X | 
| Windows 8 Enterprise and Pro<br>(Server scenarios only<sup>1</sup>)  |   | X |   |
| Windows 7 SP1<br>(Server scenarios only<sup>1</sup>)                 |   | X |   |
| Azure Stack HCI                                          |   | X |   |

<sup>1</sup> Running the OS on server hardware, for example, machines that are always connected, always turned on, and not running other workloads (PC, office, browser).<br>
<sup>2</sup> Using the Azure Monitor agent [client installer](./azure-monitor-agent-windows-client.md).<br>
<sup>3</sup> Also supported on Arm64-based machines.

#### Linux

| Operating system | Azure Monitor agent <sup>1</sup> | Log Analytics agent (legacy) <sup>1</sup> | Diagnostics extension <sup>2</sup>|
|:---|:---:|:---:|:---:|
| AlmaLinux 8                                                 | X<sup>3</sup> | X |   |
| Amazon Linux 2017.09                                        |   | X |   |
| Amazon Linux 2                                              |   | X |   |
| CentOS Linux 8                                              | X | X |   |
| CentOS Linux 7                                              | X<sup>3</sup> | X | X |
| CentOS Linux 6                                              |   | X |   |
| CBL-Mariner 2.0                                             | X<sup>3</sup> |   |   |
| Debian 11                                                   | X<sup>3</sup> |   |   |
| Debian 10                                                   | X | X |   |
| Debian 9                                                    | X | X | X |
| Debian 8                                                    |   | X |   |
| OpenSUSE 15                                                 | X |   |   |
| Oracle Linux 8                                              | X | X |   |
| Oracle Linux 7                                              | X | X | X |
| Oracle Linux 6                                              |   | X |   |
| Oracle Linux 6.4+                                           |   | X | X |
| Red Hat Enterprise Linux Server 8.6                         | X<sup>3</sup> |   |   |
| Red Hat Enterprise Linux Server 8                           | X | X |   |
| Red Hat Enterprise Linux Server 7                           | X | X | X |
| Red Hat Enterprise Linux Server 6                           |   | X |   |
| Red Hat Enterprise Linux Server 6.7+                        |   | X | X |
| Rocky Linux 8                                               | X | X |   |
| SUSE Linux Enterprise Server 15 SP4                         | X<sup>3</sup> |   |   |
| SUSE Linux Enterprise Server 15 SP3                         | X |   |   |
| SUSE Linux Enterprise Server 15 SP2                         | X |   |   |
| SUSE Linux Enterprise Server 15 SP1                         | X | X |   |
| SUSE Linux Enterprise Server 15                             | X | X |   |
| SUSE Linux Enterprise Server 12                             | X | X | X |
| Ubuntu 22.04 LTS                                            | X |   |   |
| Ubuntu 20.04 LTS                                            | X<sup>3</sup> | X | X |
| Ubuntu 18.04 LTS                                            | X<sup>3</sup> | X | X |
| Ubuntu 16.04 LTS                                            | X | X | X |
| Ubuntu 14.04 LTS                                            |   | X | X |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.<br>
<sup>2</sup> Requires Python 2 to be installed on the machine and aliased to the `python` command.<br>
<sup>3</sup> Also supported on Arm64-based machines.

>[!NOTE]
>Machines and appliances that run heavily customized or stripped-down versions of the above distributions and hosted solutions that disallow customization by the user are not supported. Azure Monitor and legacy agents rely on various packages and other baseline functionality that is often removed from such systems, and their installation may require some environmental modifications considered to be disallowed by the appliance vendor. For instance, [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/admin/overview/about-github-enterprise-server) is not supported due to heavy customization as well as [documented, license-level disallowance](https://docs.github.com/en/enterprise-server/admin/overview/system-overview#operating-system-software-and-patches) of operating system modification.

## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
