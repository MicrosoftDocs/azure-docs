---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 7/21/2022
ms.custom: references_regions
ms.reviewer: shseth
---

# Azure Monitor agent overview
The Azure Monitor agent collects monitoring data from the guest operating system of [supported infrastructure](#supported-resource-types) and delivers it to Azure Monitor. This article provides an overview of the Azure Monitor agent and includes information on how to install it and configure data collection.
If you're new to Azure Monitor, the recommendation is to use the Azure Monitor agent.

For an introductory video that explains this new agent and includes a quick demo of how to set things up by using the Azure portal, see [ITOps Talk: Azure Monitor Agent](https://www.youtube.com/watch?v=f8bIrFU8tCs).


## Relationship to other agents

Eventually, the Azure Monitor agent will replace the following legacy monitoring agents that are currently used by Azure Monitor:

- [Log Analytics agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports VM insights and monitoring solutions.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only).
- [Diagnostics extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.

Currently, the Azure Monitor agent consolidates features from the Telegraf agent and Log Analytics agent, with [a few limitations](#current-limitations). See migration guidance [here](azure-monitor-agent-migration.md).  
In the future, it will also consolidate features from the Diagnostic extensions.

In addition to consolidating this functionality into a single agent, the Azure Monitor agent provides the following benefits over the existing agents:

- **Cost savings:**
  -	Granular targeting via [data collection rules](../essentials/data-collection-rule-overview.md) to collect specific data types from specific machines, as compared to the "all or nothing" mode that Log Analytics agent supports.
  -	XPath queries to filter Windows events get collected to help further reduce ingestion and storage costs.
- **Simplified management of data collection:** Send data from Windows and Linux VMs to multiple Log Analytics workspaces (for example, "multihoming") or other [supported destinations](#data-sources-and-destinations). Every action across the data collection lifecycle, from onboarding to deployment to updates, is easier, scalable, and centralized in Azure by using data collection rules.
- **Management of dependent solutions or services:** The Azure Monitor agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the legacy Log Analytics agents. This management experience is identical for machines in Azure or on-premises/other clouds via Azure Arc, at no added cost.
- **Security and performance:** For authentication and security, the Azure Monitor agent uses Managed Identity for virtual machines and Azure Active Directory device tokens for clients. Both technologies are much more secure and "hack proof" than certificates or workspace keys that legacy agents use. This agent performs better at higher events-per-second upload rates compared to legacy agents.

### Current limitations

 Not all Log Analytics solutions are supported yet. [View supported features and services](#supported-services-and-features).

### Changes in data collection

The methods for defining data collection for the existing agents are distinctly different from each other. Each method has challenges that are addressed with the Azure Monitor agent:

- The Log Analytics agent gets its configuration from a Log Analytics workspace. It's easy to centrally configure but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.
- Diagnostic extension has a configuration for each virtual machine. It's easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open-source Telegraf agent is required to send data to Azure Monitor Metrics.

The Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They're independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. 

For more information, see [Configure data collection for the Azure Monitor agent](data-collection-rule-azure-monitor-agent.md).

## Coexistence with other agents

The Azure Monitor agent can coexist (run side by side on the same machine) with the legacy Log Analytics agents so that you can continue to use their existing functionality during evaluation or migration. For this reason, you can begin transition even with the limitations, but you must review the following points carefully:

- Be careful in collecting duplicate data because it could skew query results and affect downstream features like alerts, dashboards, or workbooks. For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents.

    If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data. As a result, ensure you're not collecting the same data from both agents. If you are, ensure they're *collecting from different machines* or *going to separate destinations*.
- Besides data duplication, this scenario would also generate more charges for data ingestion and retention.
- Running two telemetry agents on the same machine would result in double the resource consumption, including but not limited to CPU, memory, storage space, and network bandwidth.

> [!NOTE]
> When you use both agents during evaluation or migration, you can use the **Category** column of the [Heartbeat](/azure/azure-monitor/reference/tables/Heartbeat) table in your Log Analytics workspace, and filter for **Azure Monitor Agent**.

## Supported resource types

| Resource type | Installation method | More information |
|:---|:---|:---|
| Virtual machines, scale sets | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) | Installs the agent by using Azure extension framework. |
| On-premises servers (Azure Arc-enabled servers) | [Virtual machine extension](./azure-monitor-agent-manage.md#virtual-machine-extension-details) (after installing the [Azure Arc agent](../../azure-arc/servers/deployment-options.md)) | Installs the agent by using Azure extension framework, provided for on-premises by first installing [Azure Arc agent](../../azure-arc/servers/deployment-options.md). |
| Windows 10, 11 desktops, workstations | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. |
| Windows 10, 11 laptops | [Client installer (preview)](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer. The installer works on laptops, but the agent is *not optimized yet* for battery or network consumption. |

## Supported regions

Azure Monitor agent is available in all public regions and Azure Government clouds. It's not yet supported in air-gapped clouds. For more information, see [Product availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&rar=true&regions=all).

## Supported operating systems

For a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent, see [Supported operating systems](agents-overview.md#supported-operating-systems).

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

## Security

The Azure Monitor agent doesn't require any keys but instead requires a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). You must have a system-assigned managed identity enabled on each virtual machine before you deploy the agent.

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

## Next steps

- [Install the Azure Monitor agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
