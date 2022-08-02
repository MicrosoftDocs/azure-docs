---
title: Azure Monitor Agent overview
description: Overview of the Azure Monitor Agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.date: 7/21/2022
ms.custom: references_regions
ms.reviewer: shseth

#customer-intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines. 
---

# Azure Monitor Agent overview

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services, such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). Azure Monitor Agent replaces all of Azure Monitor's legacy monitoring agents. This article provides an overview of Azure Monitor Agent's capabilities and supported use cases.

Here's a short **introduction to Azure Monitor video**, which includes a quick demo of how to set up the agent from the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

## Can I deploy the new agent?

Deploy Azure Monitor Agent on all new virtual machines to collect data for [supported services and features](#supported-services-and-features).

If you have virtual machines already deployed with legacy agents, we recommend you [check whether Azure Monitor Agent supports your monitoring needs](#summary-of-agents) and [migrate to Azure Monitor Agent](./azure-monitor-agent-migration.md) as soon as possible.

Azure Monitor Agent replaces the Azure Monitor legacy monitoring agents:

- [Log Analytics Agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports VM insights and monitoring solutions. We're **deprecating** Log Analytics Agent and will stop supporting the agent **as of August 31, 2024**. 
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only).
- [Diagnostics extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.

Currently, Azure Monitor Agent consolidates features from the Telegraf agent and Log Analytics Agent, but doesn't support all Log Analytics solutions. In the future, Azure Monitor Agent will also consolidate features from the Diagnostic extensions.

## Benefits

Azure Monitor Agent provides the following benefits over legacy agents:

- **A single agent** that collects all telemetry data across servers and client devices running Windows 10, 11. This is goal, though AMA currently converges with the Log Analytics Agent.
- **Cost savings:**
  -	Granular targeting via [Data Collection Rules](../essentials/data-collection-rule-overview.md) to collect specific data types from specific machines, as compared to the "all or nothing" mode that Log Analytics Agent supports.
  -	Use XPath queries to filter out Windows events you don't need and reduce ingestion and storage costs.
- **Simplified management of data collection:** 
    - Send data from Windows and Linux VMs to multiple Log Analytics workspaces ("multi-homing") and other [supported destinations](#data-sources-and-destinations). 
    - Every action across the data collection lifecycle, from onboarding to deployment to updates, is easier, more scalable, and centralized using data collection rules.
- **Manage dependent solutions and services:** Azure Monitor Agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the legacy Log Analytics Agent. This management experience is identical for machines in Azure, on-premises, and in other clouds using Azure Arc, at no added cost.
- **Security and performance:** For authentication and security, Azure Monitor Agent uses a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity) (for virtual machines) and AAD device tokens (for clients), which are both much more secure and ‘hack proof’ than certificates or workspace keys that legacy agents use. This agent performs better at a higher EPS (events per second) upload rate compared to legacy agents. 

### Data collection

Azure Monitor Agent uses [data collection rules](../essentials/data-collection-rule-overview.md), using which you define which data you want each agent to collect. Data collection rules let you manage data collection settings at scale and define unique, scoped configurations for subsets of machines. The rules are independent of the workspace and the virtual machine, which means you can define a rule once and reuse it across machines and environments. 

## Supported resource types

| Resource type | Installation method | More information |
|:---|:---|:---|
| Virtual machines, scale sets | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) | Installs the agent by using Azure extension framework. |
| On-premises servers (Azure Arc-enabled servers) | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) (after installing the [Azure Arc agent](../../azure-arc/servers/deployment-options.md)) | Installs the agent by using Azure extension framework, provided for on-premises by first installing [Azure Arc agent](../../azure-arc/servers/deployment-options.md). |
| Windows 10, 11 desktops, workstations | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. |
| Windows 10, 11 laptops | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. The installer works on laptops, but the agent *isn't optimized yet* for battery or network consumption. |

## Supported regions

Azure Monitor Agent is available in all public regions and Azure Government clouds. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).

## Data sources and destinations

The following table lists the types of data you can currently collect with the Azure Monitor Agent by using data collection rules and where you can send that data. For a list of insights, solutions, and other solutions that use the Azure Monitor Agent to collect other kinds of data, see [What is monitored by Azure Monitor?](../monitor-reference.md).

The Azure Monitor Agent sends data to Azure Monitor Metrics (preview) or a Log Analytics workspace supporting Azure Monitor Logs.

| Data source | Destinations | Description |
|:---|:---|:---|
| Performance        | Azure Monitor Metrics (preview)<sup>1</sup> - Insights.virtualmachine namespace<br>Log Analytics workspace - [Perf](/azure/azure-monitor/reference/tables/perf) table | Numerical values measuring performance of different aspects of operating system and workloads |
| Windows event logs | Log Analytics workspace - [Event](/azure/azure-monitor/reference/tables/Event) table | Information sent to the Windows event logging system |
| Syslog             | Log Analytics workspace - [Syslog](/azure/azure-monitor/reference/tables/syslog)<sup>2</sup> table | Information sent to the Linux event logging system |
| Text logs | Log Analytics workspace - custom table | Events sent to log file on agent machine |

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [Quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.<br>
<sup>2</sup> Azure Monitor Linux Agent v1.15.2 or higher supports syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).

## Supported services and features

The following table shows the current support for the Azure Monitor Agent with other Azure services.

|	 Azure service	|	 Current support	|	Other extensions installed	|	 More information	|
|	:---	|	:---	|	:---	|	:---	|
| [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)	| Private preview	|	<ul><li>Azure Security Agent extension</li><li>SQL Advanced Threat Protection extension</li><li>SQL Vulnerability Assessment extension</li></ul> | [Sign-up link](https://aka.ms/AMAgent)	|
| [Microsoft Sentinel](../../sentinel/overview.md)	| <ul><li>Windows DNS logs: Private preview</li><li>Linux Syslog CEF: Private preview</li><li>Windows Forwarding Event (WEF): [Public preview](../../sentinel/data-connectors-reference.md#windows-forwarded-events-preview)</li><li>Windows Security Events: [Generally available](../../sentinel/connect-windows-security-events.md?tabs=AMA)</li></ul> |	Sentinel DNS extension, if you’re collecting DNS logs. For all other data types, you just need the Azure Monitor Agent extension. | <ul><li>[Sign-up link for Windows DNS logs](https://aka.ms/AMAgent)</li><li>[Sign-up link for Linux Syslog CEF](https://aka.ms/AMAgent)</li><li>No sign-up needed for Windows Forwarding Event (WEF) and Windows Security Events</li></ul> |



The following table shows the current support for the Azure Monitor Agent with Azure Monitor features.

|	Azure Monitor feature	|	Current support	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	Text logs and Windows IIS logs	|	Public preview	|	None	|	[Collect text logs with Azure Monitor Agent (preview)](data-collection-text-log.md)	|
|	Windows client installer	|	Public preview	|	None	|	[Set up Azure Monitor Agent on Windows client devices](azure-monitor-agent-windows-client.md)	|
|	[VM insights](../vm/vminsights-overview.md)	|	Private preview 	|	Dependency Agent extension, if you’re using the Map Services feature	|	[Sign-up link](https://aka.ms/amadcr-privatepreviews)	|


The following table shows the current support for the Azure Monitor Agent with Azure solutions.

|	Solution	|	Current support	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	 [Change Tracking](../../automation/change-tracking/overview.md) (part of Defender)	|	 Supported as File Integrity Monitoring in the Microsoft Defender for Cloud Private Preview. 	|	Change Tracking extension	|	[Sign-up link](https://aka.ms/AMAgent)	|
|	 [Update Management](../../automation/update-management/overview.md) (available without Azure Monitor Agent)	|	 Use Update Management v2 - Public preview	|	None	|	[Update management center (preview) documentation](/azure/update-center/)	|
|	Connection Monitor	|	Private preview	|	Azure NetworkWatcher extension	|	[Sign-up link](https://aka.ms/amadcr-privatepreviews)	|

## Costs

There's no cost for the Azure Monitor Agent, but you might incur charges for the data ingested. For information on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Networking

The Azure Monitor Agent supports Azure service tags. Both *AzureMonitor* and *AzureResourceManager* tags are required. It supports connecting via *direct proxies, Log Analytics gateway, and private links* as described in the following sections.

### Firewall requirements

| Cloud |Endpoint |Purpose |Port |Direction |Bypass HTTPS inspection|
|------|------|------|---------|--------|--------|
| Azure Commercial |global.handler.control.monitor.azure.com |Access control service|Port 443 |Outbound|Yes |
| Azure Commercial |`<virtual-machine-region-name>`.handler.control.monitor.azure.com |Fetch data collection rules for specific machine |Port 443 |Outbound|Yes |
| Azure Commercial |`<log-analytics-workspace-id>`.ods.opinsights.azure.com |Ingest logs data |Port 443 |Outbound|Yes |
| Azure Commercial | management.azure.com | Only needed if sending time series data (metrics) to Azure Monitor [Custom metrics](../essentials/metrics-custom-overview.md) database | Port 443 | Outbound | Yes |
| Azure Government | Replace '.com' above with '.us' | Same as above | Same as above | Same as above| Same as above |
| Azure China | Replace '.com' above with '.cn' | Same as above | Same as above | Same as above| Same as above |

If you use private links on the agent, you must also add the [DCE endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint).

### Proxy configuration

If the machine connects through a proxy server to communicate over the internet, review the following requirements to understand the network configuration required.

The Azure Monitor Agent extensions for Windows and Linux can communicate either through a proxy server or a [Log Analytics gateway](./gateway.md) to Azure Monitor by using the HTTPS protocol. Use it for Azure virtual machines, Azure virtual machine scale sets, and Azure Arc for servers. Use the extensions settings for configuration as described in the following steps. Both anonymous and basic authentication by using a username and password are supported.

> [!IMPORTANT]
> Proxy configuration is not supported for [Azure Monitor Metrics (preview)](../essentials/metrics-custom-overview.md) as a destination. If you're sending metrics to this destination, it will use the public internet without any proxy.

1. Use this flowchart to determine the values of the *`Settings` and `ProtectedSettings` parameters first.

    ![Diagram that shows a flowchart to determine the values of settings and protectedSettings parameters when you enable the extension.](media/azure-monitor-agent-overview/proxy-flowchart.png)

1. After determining the `Settings` and `ProtectedSettings` parameter values, *provide these other parameters* when you deploy Azure Monitor Agent, using PowerShell commands, as shown in the following examples:

# [Windows VM](#tab/PowerShellWindows)

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": true}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';

Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.0 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Linux VM](#tab/PowerShellLinux)

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": true}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';

Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.5 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Windows Arc-enabled server](#tab/PowerShellWindowsArc)

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": true}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';

New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settingsString -ProtectedSetting $protectedSettingsString
```

# [Linux Arc-enabled server](#tab/PowerShellLinuxArc)

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": true}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';

New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settingsString -ProtectedSetting $protectedSettingsString
```

---

### Log Analytics gateway configuration

1. Follow the preceding instructions to configure proxy settings on the agent and provide the IP address and port number that corresponds to the gateway server. If you've deployed multiple gateway servers behind a load balancer, the agent proxy configuration is the virtual IP address of the load balancer instead.
1. Add the **configuration endpoint URL** to fetch data collection rules to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host global.handler.control.monitor.azure.com`
   `Add-OMSGatewayAllowedHost -Host <gateway-server-region-name>.handler.control.monitor.azure.com`.
   (If you're using private links on the agent, you must also add the [data collection endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint).)
1. Add the **data ingestion endpoint URL** to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host <log-analytics-workspace-id>.ods.opinsights.azure.com`.
1. Restart the **OMS Gateway** service to apply the changes
   `Stop-Service -Name <gateway-name>`
   `Start-Service -Name <gateway-name>`.

### Private link configuration

To configure the agent to use private links for network communications with Azure Monitor, follow instructions to [enable network isolation](./azure-monitor-agent-data-collection-endpoint.md#enable-network-isolation-for-the-azure-monitor-agent) by using [data collection endpoints](azure-monitor-agent-data-collection-endpoint.md).

## Summary of agents

The tables below provide a quick comparison of the telemetry agents for Windows and Linux. 

### Windows agents

|		|		|	Azure Monitor Agent	|	Log Analytics Agent	|	Diagnostics extension (WAD)	|
|	-	|	-	|	-	|	-	|	-	|
|	**Environments supported**	|		|		|		|		|
|		|	Azure	|	X	|	X	|	X	|
|		|	Other cloud (Azure Arc)	|	X	|	X	|		|
|		|	On-premises (Azure Arc)	|	X	|	X	|		|
|		|	Windows Client OS	|	X (Preview)	|		|		|
|	**Data collected**	|		|		|		|		|
|		|	Event Logs	|	X	|	X	|	X	|
|		|	Performance	|	X	|	X	|	X	|
|		|	File based logs	|	X (Preview)	|	X	|	X	|
|		|	IIS logs	|	X (Preview)	|	X	|	X	|
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
|		|	Log Analytics	|	X	|	X	|		|
|		|	Metrics Explorer	|	X	|		|	X	|
|		|	Microsoft Sentinel 	|	X ([View scope](#supported-services-and-features))	|	X	|		|
|		|	VM Insights	|		|	X (Preview)	|		|
|		|	Azure Automation	|		|	X	|		|
|		|	Microsoft Defender for Cloud	|		|	X	|		|

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
|		|	File based logs	|	X (Preview)	|		|		|		|
|	**Data sent to**	|		|		|		|		|		|
|		|	Azure Monitor Logs	|	X	|	X	|		|		|
|		|	Azure Monitor Metrics<sup>1</sup>	|	X	|		|		|	X	|
|		|	Azure Storage	|		|		|	X	|		|
|		|	Event Hub	|		|		|	X	|		|
|	**Services and features supported**	|		|		|		|		|		|
|		|	Log Analytics	|	X	|	X	|		|		|
|		|	Metrics Explorer	|	X	|		|		|	X	|
|		|	Microsoft Sentinel 	|	X ([View scope](#supported-services-and-features))	|	X	|		|		|
|		|	VM Insights	|	X (Preview)	|	X	|		|		|
|		|	Container Insights	|	X (Preview)	|	X	|		|		|
|		|	Azure Automation	|		|	X	|		|		|
|		|	Microsoft Defender for Cloud	|		|	X	|		|		|

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v.1.10.9.0 or higher.


## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.