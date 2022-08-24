---
title: Azure Monitor Agent overview
description: Overview of the Azure Monitor Agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 8/17/2022
ms.custom: references_regions
ms.reviewer: shseth

#customer-intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines. 
---

# Azure Monitor Agent overview

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services, such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). Azure Monitor Agent replaces all of Azure Monitor's legacy monitoring agents. This article provides an overview of Azure Monitor Agent's capabilities and supported use cases.

Here's a short **introduction to Azure Monitor video**, which includes a quick demo of how to set up the agent from the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

## Can I deploy Azure Monitor Agent?

Deploy Azure Monitor Agent on all new virtual machines to collect data for [supported services and features](#supported-services-and-features).

If you have virtual machines already deployed with legacy agents, we recommend you [check whether Azure Monitor Agent supports your monitoring needs](#compare-to-legacy-agents) and [migrate to Azure Monitor Agent](./azure-monitor-agent-migration.md) as soon as possible.

Azure Monitor Agent replaces the Azure Monitor legacy monitoring agents:

- [Log Analytics Agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports monitoring solutions.  
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only).
- [Diagnostics extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.

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
    <sup>2</sup> Azure Monitor Linux Agent v1.15.2 or higher supports syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF). 

## Supported services and features

In addition to the generally available data collection listed above, Azure Monitor Agent also supports these Azure Monitor features in preview:

|	Azure Monitor feature	|	Current support	|	Other extensions installed	|	More information	|
|	:---	|	:---	|	:---	|	:---	|
|	Text logs and Windows IIS logs	|	Public preview	|	None	|	[Collect text logs with Azure Monitor Agent (Public preview)](data-collection-text-log.md)	|
|	Windows client installer	|	Public preview	|	None	|	[Set up Azure Monitor Agent on Windows client devices](azure-monitor-agent-windows-client.md)	|
|	[VM insights](../vm/vminsights-overview.md)	|	Public preview 	|	Dependency Agent extension, if you’re using the Map Services feature	|	[Enable VM Insights overview](../vm/vminsights-enable-overview.md)	|

In addition to the generally available data collection listed above, Azure Monitor Agent also supports these Azure services in preview:

|	 Azure service	|	 Current support	|	Other extensions installed	|	 More information	|
|	:---	|	:---	|	:---	|	:---	|
| [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)	| Preview	|	<ul><li>Azure Security Agent extension</li><li>SQL Advanced Threat Protection extension</li><li>SQL Vulnerability Assessment extension</li></ul> | [Sign-up link](https://aka.ms/AMAgent)	|
| [Microsoft Sentinel](../../sentinel/overview.md)	| <ul><li>Windows DNS logs: Preview</li><li>Linux Syslog CEF: Preview</li><li>Windows Forwarding Event (WEF): [Public preview](../../sentinel/data-connectors-reference.md#windows-forwarded-events-preview)</li><li>Windows Security Events: [Generally available](../../sentinel/connect-windows-security-events.md?tabs=AMA)</li></ul> |	Sentinel DNS extension, if you’re collecting DNS logs. For all other data types, you just need the Azure Monitor Agent extension. | <ul><li>[Sign-up link for Windows DNS logs](https://aka.ms/AMAgent)</li><li>[Sign-up link for Linux Syslog CEF](https://aka.ms/AMAgent)</li><li>No sign-up needed for Windows Forwarding Event (WEF) and Windows Security Events</li></ul> |
|	 [Change Tracking](../../automation/change-tracking/overview.md) (part of Defender)	|	 Supported as File Integrity Monitoring in the Microsoft Defender for Cloud: Preview. 	|	Change Tracking extension	|	[Sign-up link](https://aka.ms/AMAgent)	|
|	 [Update Management](../../automation/update-management/overview.md) (available without Azure Monitor Agent)	|	 Use Update Management v2 - Public preview	|	None	|	[Update management center (Public preview) documentation](../../update-center/index.yml)	|
|	[Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md)	|	Connection Monitor: Preview	|	Azure NetworkWatcher extension	|	[Sign-up link](https://aka.ms/amadcr-privatepreviews)	|

## Supported regions

Azure Monitor Agent is available in all public regions and Azure Government clouds. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).
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
> Proxy configuration is not supported for [Azure Monitor Metrics (Public preview)](../essentials/metrics-custom-overview.md) as a destination. If you're sending metrics to this destination, it will use the public internet without any proxy.

1. Use this flowchart to determine the values of the *`Settings` and `ProtectedSettings` parameters first.

    ![Diagram that shows a flowchart to determine the values of settings and protectedSettings parameters when you enable the extension.](media/azure-monitor-agent-overview/proxy-flowchart.png)

1. After determining the `Settings` and `ProtectedSettings` parameter values, *provide these other parameters* when you deploy Azure Monitor Agent, using PowerShell commands, as shown in the following examples:

# [Windows VM](#tab/PowerShellWindows)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.0 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Linux VM](#tab/PowerShellLinux)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.5 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Windows Arc-enabled server](#tab/PowerShellWindowsArc)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settingsString -ProtectedSetting $protectedSettingsString
```

# [Linux Arc-enabled server](#tab/PowerShellLinuxArc)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

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

## Compare to legacy agents

The tables below provide a comparison of Azure Monitor Agent with the legacy the Azure Monitor telemetry agents for Windows and Linux. 

### Windows agents

|		|		|	Azure Monitor Agent	|	Log Analytics Agent	|	Diagnostics extension (WAD)	|
|	-	|	-	|	-	|	-	|	-	|
|	**Environments supported**	|		|		|		|		|
|		|	Azure	|	X	|	X	|	X	|
|		|	Other cloud (Azure Arc)	|	X	|	X	|		|
|		|	On-premises (Azure Arc)	|	X	|	X	|		|
|		|	Windows Client OS	|	X (Public preview)	|		|		|
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

#### Windows

| Operating system | Azure Monitor agent | Log Analytics agent | Diagnostics extension | 
|:---|:---:|:---:|:---:|:---:|
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
| Windows 11 client OS                                     | X<sup>2</sup> |  |  |
| Windows 10 1803 (RS4) and higher                         | X<sup>2</sup> |  |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only<sup>1</sup>)  | X | X | X | 
| Windows 8 Enterprise and Pro<br>(Server scenarios only<sup>1</sup>)  |   | X |   |
| Windows 7 SP1<br>(Server scenarios only<sup>1</sup>)                 |   | X |   |
| Azure Stack HCI                                          |   | X |   |

<sup>1</sup> Running the OS on server hardware, for example, machines that are always connected, always turned on, and not running other workloads (PC, office, browser)<br>
<sup>2</sup> Using the Azure Monitor agent [client installer (Public preview)](./azure-monitor-agent-windows-client.md)

#### Linux

| Operating system | Azure Monitor agent <sup>1</sup> | Log Analytics agent <sup>1</sup> | Diagnostics extension <sup>2</sup>|
|:---|:---:|:---:|:---:|:---:
| AlmaLinux 8                                                 | X | X |   |
| Amazon Linux 2017.09                                        |   | X |   |
| Amazon Linux 2                                              |   | X |   |
| CentOS Linux 8                                              | X | X |   |
| CentOS Linux 7                                              | X | X | X |
| CentOS Linux 6                                              |   | X |   |
| CentOS Linux 6.5+                                           |   | X | X |
| Debian 11                                                   | X |   |   |
| Debian 10                                                   | X | X |   |
| Debian 9                                                    | X | X | X |
| Debian 8                                                    |   | X |   |
| Debian 7                                                    |   |   | X |
| OpenSUSE 13.1+                                              |   |   | X |
| Oracle Linux 8                                              | X | X |   |
| Oracle Linux 7                                              | X | X | X |
| Oracle Linux 6                                              |   | X |   |
| Oracle Linux 6.4+                                           |   | X | X |
| Red Hat Enterprise Linux Server 8                           | X | X |   |
| Red Hat Enterprise Linux Server 7                           | X | X | X |
| Red Hat Enterprise Linux Server 6                           |   | X |   |
| Red Hat Enterprise Linux Server 6.7+                        |   | X | X |
| Rocky Linux 8                                               | X | X |   |
| SUSE Linux Enterprise Server 15 SP2                         | X |   |   |
| SUSE Linux Enterprise Server 15 SP1                         | X | X |   |
| SUSE Linux Enterprise Server 15                             | X | X |   |
| SUSE Linux Enterprise Server 12                             | X | X | X |
| Ubuntu 22.04 LTS                                            | X |   |   |
| Ubuntu 20.04 LTS                                            | X | X | X |
| Ubuntu 18.04 LTS                                            | X | X | X |
| Ubuntu 16.04 LTS                                            | X | X | X |
| Ubuntu 14.04 LTS                                            |   | X | X |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.<br>
<sup>2</sup> Requires Python 2 to be installed on the machine and aliased to the `python` command.<br>

## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
