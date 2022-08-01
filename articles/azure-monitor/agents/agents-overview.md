---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.date: 7/21/2022
ms.custom: references_regions
ms.reviewer: shseth
---

# Azure Monitor Agent overview

[Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) collects monitoring data from the guest operating system of Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features, insights, and other services, such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). This article provides an overview of the Azure Monitor agent.

Here's an **introductory video** explaining all about this new agent, including a quick demo of how to set things up using the Azure portal:  [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs)

## Can I use the new agent?

Azure Monitor Agent replaces all legacy monitoring agents currently used by Azure Monitor:

- [Log Analytics agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports VM insights and monitoring solutions.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only).
- [Diagnostics extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.

Currently, Azure Monitor agent consolidates features from the Telegraf agent and Log Analytics agent, but does not support all Log Analytics solutions. For more information, see [supported features and services](#supported-services-and-features).

In the future, Azure Monitor agent will also consolidate features from the Diagnostic extensions.

## Benefits

The Azure Monitor Agent provides the following benefits over the existing agents:

- **A single agent** that collects all telemetry data across servers and client devices running Windows 10, 11. This is goal, though AMA is currently converging with the Log Analytics agents.
- **Cost savings:**
  -	Granular targeting via [Data Collection Rules](../essentials/data-collection-rule-overview.md) to collect specific data types from specific machines, as compared to the "all or nothing" mode that Log Analytics agent supports.
  -	Use XPath queries to filter out Windows events you don't need. This helps further reduce ingestion and storage costs.
- **Simplified management of data collection:** 
    - Send data from Windows and Linux VMs to multiple Log Analytics workspaces ("multi-homing") and other [supported destinations](#data-sources-and-destinations). 
    - Every action across the data collection lifecycle, from onboarding to deployment to updates, is significantly easier, more scalable, and centralized using data collection rules.
- **Manage dependent solutions and services:** Azure Monitor Agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the legacy Log Analytics agents. This management experience is identical for machines in Azure, on-premises, and in other clouds using Azure Arc, at no added cost.
- **Security and performance:** For authentication and security, Azure Monitor Agent uses a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity) (for virtual machines) and AAD device tokens (for clients), which are both much more secure and ‘hack proof’ than certificates or workspace keys that legacy agents use. This agent performs better at a higher EPS (events per second) upload rate compared to legacy agents. 

### Changes in data collection

The methods for defining data collection for the existing agents are distinctly different from each other. Each method has challenges that are addressed with the Azure Monitor agent:

- The Log Analytics agent gets its configuration from a Log Analytics workspace. It's easy to centrally configure but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.
- Diagnostic extension has a configuration for each virtual machine. It's easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open-source Telegraf agent is required to send data to Azure Monitor Metrics.

The Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They're independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. 

## Supported resource types

| Resource type | Installation method | More information |
|:---|:---|:---|
| Virtual machines, scale sets | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) | Installs the agent by using Azure extension framework. |
| On-premises servers (Azure Arc-enabled servers) | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) (after installing the [Azure Arc agent](../../azure-arc/servers/deployment-options.md)) | Installs the agent by using Azure extension framework, provided for on-premises by first installing [Azure Arc agent](../../azure-arc/servers/deployment-options.md). |
| Windows 10, 11 desktops, workstations | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. |
| Windows 10, 11 laptops | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. The installer works on laptops, but the agent is *not optimized yet* for battery or network consumption. |

## Supported regions

Azure Monitor agent is available in all public regions and Azure Government clouds. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).

## Data sources and destinations

The following table lists the types of data you can currently collect with the Azure Monitor agent by using data collection rules and where you can send that data. For a list of insights, solutions, and other solutions that use the Azure Monitor agent to collect other kinds of data, see [What is monitored by Azure Monitor?](../monitor-reference.md).

The Azure Monitor agent sends data to Azure Monitor Metrics (preview) or a Log Analytics workspace supporting Azure Monitor Logs.

| Data source | Destinations | Description |
|:---|:---|:---|
| Performance        | Azure Monitor Metrics (preview)<sup>1</sup> - Insights.virtualmachine namespace<br>Log Analytics workspace - [Perf](/azure/azure-monitor/reference/tables/perf) table | Numerical values measuring performance of different aspects of operating system and workloads |
| Windows event logs | Log Analytics workspace - [Event](/azure/azure-monitor/reference/tables/Event) table | Information sent to the Windows event logging system |
| Syslog             | Log Analytics workspace - [Syslog](/azure/azure-monitor/reference/tables/syslog)<sup>2</sup> table | Information sent to the Linux event logging system |
| Text logs | Log Analytics workspace - custom table | Events sent to log file on agent machine |

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [Quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v1.10.9.0 or higher.<br>
<sup>2</sup> Azure Monitor Linux Agent v1.15.2 or higher supports syslog RFC formats including Cisco Meraki, Cisco ASA, Cisco FTD, Sophos XG, Juniper Networks, Corelight Zeek, CipherTrust, NXLog, McAfee, and Common Event Format (CEF).

## Supported services and features

The following table shows the current support for the Azure Monitor agent with other Azure services.

| Azure service | Current support | More information |
|:---|:---|:---|
| [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) | Private preview | [Sign-up link](https://aka.ms/AMAgent) |
| [Microsoft Sentinel](../../sentinel/overview.md) | <ul><li>Windows DNS logs: Private preview</li><li>Linux Syslog CEF: Private preview</li><li>Windows Forwarding Event (WEF): [Public preview](../../sentinel/data-connectors-reference.md#windows-forwarded-events-preview)</li><li>Windows Security Events: [Generally available](../../sentinel/connect-windows-security-events.md?tabs=AMA)</li></ul>  | <ul><li>[Sign-up link](https://aka.ms/AMAgent)</li><li>[Sign-up link](https://aka.ms/AMAgent)</li><li>No sign-up needed </li><li>No sign-up needed</li></ul> |

The following table shows the current support for the Azure Monitor agent with Azure Monitor features.

| Azure Monitor feature | Current support | More information |
|:---|:---|:---|
| Text logs and Windows IIS logs | Public preview | [Collect text logs with Azure Monitor agent (preview)](data-collection-text-log.md) |
| Windows client installer | Public preview | [Set up Azure Monitor agent on Windows client devices](azure-monitor-agent-windows-client.md) |
| [VM insights](../vm/vminsights-overview.md) | Private preview  | [Sign-up link](https://aka.ms/amadcr-privatepreviews) |

The following table shows the current support for the Azure Monitor agent with Azure solutions.

| Solution | Current support | More information |
|:---|:---|:---|
| [Change Tracking](../../automation/change-tracking/overview.md) | Supported as File Integrity Monitoring in the Microsoft Defender for Cloud Private Preview.  | [Sign-up link](https://aka.ms/AMAgent) |
| [Update Management](../../automation/update-management/overview.md) | Use Update Management v2 - Public preview | [Update management center (preview) documentation](/azure/update-center/) |

## Costs

There's no cost for the Azure Monitor agent, but you might incur charges for the data ingested. For information on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Networking

The Azure Monitor agent supports Azure service tags. Both *AzureMonitor* and *AzureResourceManager* tags are required. It supports connecting via *direct proxies, Log Analytics gateway, and private links* as described in the following sections.

### Firewall requirements

| Cloud |Endpoint |Purpose |Port |Direction |Bypass HTTPS inspection|
|------|------|------|---------|--------|--------|
| Azure Commercial |global.handler.control.monitor.azure.com |Access control service|Port 443 |Outbound|Yes |
| Azure Commercial |`<virtual-machine-region-name>`.handler.control.monitor.azure.com |Fetch data collection rules for specific machine |Port 443 |Outbound|Yes |
| Azure Commercial |`<log-analytics-workspace-id>`.ods.opinsights.azure.com |Ingest logs data |Port 443 |Outbound|Yes |
| Azure Commercial | management.azure.com | Only needed if sending timeseries data (metrics) to Azure Monitor [Custom metrics](../essentials/metrics-custom-overview.md) database | Port 443 | Outbound | Yes |
| Azure Government | Replace '.com' above with '.us' | Same as above | Same as above | Same as above| Same as above |
| Azure China | Replace '.com' above with '.cn' | Same as above | Same as above | Same as above| Same as above |

If you use private links on the agent, you must also add the [DCE endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint).

### Proxy configuration

If the machine connects through a proxy server to communicate over the internet, review the following requirements to understand the network configuration required.

The Azure Monitor agent extensions for Windows and Linux can communicate either through a proxy server or a [Log Analytics gateway](./gateway.md) to Azure Monitor by using the HTTPS protocol. Use it for Azure virtual machines, Azure virtual machine scale sets, and Azure Arc for servers. Use the extensions settings for configuration as described in the following steps. Both anonymous and basic authentication by using a username and password are supported.

> [!IMPORTANT]
> Proxy configuration is not supported for [Azure Monitor Metrics (preview)](../essentials/metrics-custom-overview.md) as a destination. If you're sending metrics to this destination, it will use the public internet without any proxy.

1. Use this flowchart to determine the values of the *settings* and *protectedSettings* parameters first.

    ![Diagram that shows a flowchart to determine the values of settings and protectedSettings parameters when you enable the extension.](media/azure-monitor-agent-overview/proxy-flowchart.png)

1. After the values for the *settings* and *protectedSettings* parameters are determined, *provide these additional parameters* when you deploy the Azure Monitor agent by using PowerShell commands. Refer to the following examples.

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

|		|		|	Azure Monitor agent	|	Log Analytics agent	|	Diagnostics extension (WAD)	|
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
|		|	Insights and solutions	|		|	X	|	X	|
|		|	Other services	|		|	X	|	X	|
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
|		|	Microsoft Sentinel 	|	X (View scope)	|	X	|		|
|		|	VM Insights	|		|	X	|		|
|		|	Azure Automation	|		|	X	|		|
|		|	Microsoft Defender for Cloud	|		|	X	|		|

### Linux agents

|		|		|	Azure Monitor agent	|	Log Analytics agent	|	Diagnostics extension (LAD)	|	Telegraf agent	|
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
|		|	Microsoft Sentinel 	|	X (View scope)	|	X	|		|		|
|		|	VM Insights	|		|	X	|		|		|
|		|	Azure Automation	|		|	X	|		|		|
|		|	Microsoft Defender for Cloud	|		|	X	|		|		|

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v.1.10.9.0 or higher.

## Supported operating systems

The following tables list the operating systems that are supported by the Azure Monitor agents. See the documentation for each agent for unique considerations and for the installation process. See Telegraf documentation for its supported operating systems. All operating systems are assumed to be x64. x86 is not supported for any operating system.

### Windows

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
<sup>2</sup> Using the Azure Monitor agent [client installer (preview)](./azure-monitor-agent-windows-client.md)

### Linux

| Operating system | Azure Monitor agent <sup>1</sup> | Log Analytics agent <sup>1</sup> | Diagnostics extension <sup>2</sup>| 
|:---|:---:|:---:|:---:|:---:
| AlmaLinux                                                   | X | X |   |
| Amazon Linux 2017.09                                        |   | X |   |
| Amazon Linux 2                                              |   | X |   |
| CentOS Linux 8                                              | X <sup>3</sup> | X |   |
| CentOS Linux 7                                              | X | X | X |
| CentOS Linux 6                                              |   | X |   |
| CentOS Linux 6.5+                                           |   | X | X |
| Debian 11 <sup>1</sup>                                      | X |   |   |
| Debian 10 <sup>1</sup>                                      | X |   |   |
| Debian 9                                                    | X | X | X |
| Debian 8                                                    |   | X |   |
| Debian 7                                                    |   |   | X |
| OpenSUSE 13.1+                                              |   |   | X |
| Oracle Linux 8                                              | X <sup>3</sup> | X |   |
| Oracle Linux 7                                              | X | X | X |
| Oracle Linux 6                                              |   | X |   |
| Oracle Linux 6.4+                                           |   | X | X |
| Red Hat Enterprise Linux Server 8.5, 8.6                    | X | X |   |
| Red Hat Enterprise Linux Server 8, 8.1, 8.2, 8.3, 8.4       | X <sup>3</sup> | X |   |
| Red Hat Enterprise Linux Server 7                           | X | X | X |
| Red Hat Enterprise Linux Server 6                           |   | X |   |
| Red Hat Enterprise Linux Server 6.7+                        |   | X | X |
| Rocky Linux                                                 | X | X |   |
| SUSE Linux Enterprise Server 15.2                           | X <sup>3</sup> |   |   |
| SUSE Linux Enterprise Server 15.1                           | X <sup>3</sup> | X |   |
| SUSE Linux Enterprise Server 15 SP1                         | X | X |   |
| SUSE Linux Enterprise Server 15                             | X | X |   |
| SUSE Linux Enterprise Server 12 SP5                         | X | X | X |
| SUSE Linux Enterprise Server 12                             | X | X | X |
| Ubuntu 22.04 LTS                                            | X |   |   |
| Ubuntu 20.04 LTS                                            | X | X | X <sup>4</sup> |
| Ubuntu 18.04 LTS                                            | X | X | X |
| Ubuntu 16.04 LTS                                            | X | X | X |
| Ubuntu 14.04 LTS                                            |   | X | X |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.<br>
<sup>2</sup> Known issue collecting Syslog events in versions prior to 1.9.0.<br>
<sup>3</sup> Not all kernel versions are supported. Check the supported kernel versions in the following table.

## Next steps

- [Install the Azure Monitor agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.