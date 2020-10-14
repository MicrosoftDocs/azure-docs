---
title: Log Analytics agent overview
description: This topic helps you understand how to collect data and monitor computers hosted in Azure, on-premises, or other cloud environment with Log Analytics.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/21/2020

---

# Log Analytics agent overview
The Azure Log Analytics agent collects telemetry from Windows and Linux virtual machines in any cloud, on-premises machines, and those monitored by [System Center Operations Manager](/system-center/scom/) and sends it collected data to your Log Analytics workspace in Azure Monitor. The Log Analytics agent also supports insights and other services in Azure Monitor such as [Azure Monitor for VMs](../insights/vminsights-enable-overview.md), [Azure Security Center](../../security-center/index.yml), and [Azure Automation](../../automation/automation-intro.md). This article provides a detailed overview of the agent, system and network requirements, and deployment methods.

> [!NOTE]
> You may also see the Log Analytics agent referred to as the Microsoft Monitoring Agent (MMA) or OMS Linux agent.

## Comparison to Azure diagnostics extension
The [Azure diagnostics extension](diagnostics-extension-overview.md) in Azure Monitor can also be used to collect monitoring data from the guest operating system of Azure virtual machines. You may choose to use either or both depending on your requirements. See [Overview of the Azure Monitor agents](agents-overview.md) for a detailed comparison of the Azure Monitor agents. 

The key differences to consider are:

- Azure Diagnostics Extension can be used only with Azure virtual machines. The Log Analytics agent can be used with virtual machines in Azure, other clouds, and on-premises.
- Azure Diagnostics extension sends data to Azure Storage, [Azure Monitor Metrics](data-platform-metrics.md) (Windows only) and Event Hubs. The Log Analytics agent sends data to [Azure Monitor Logs](data-platform-logs.md).
- The Log Analytics agent is required for [solutions](../monitor-reference.md#insights-and-core-solutions), [Azure Monitor for VMs](../insights/vminsights-overview.md), and other services such as [Azure Security Center](../../security-center/index.yml).

## Costs
There is no cost for Log Analytics agent, but you may incur charges for the data ingested. Check [Manage usage and costs with Azure Monitor Logs](manage-cost-storage.md) for detailed information on the pricing for data collected in a Log Analytics workspace.

## Supported operating systems

 See [Supported operating systems](agents-overview.md#supported-operating-systems) for a list of the Windows and Linux operating system versions that are supported by the Log Analytics agent. 


## Data collected
The following table lists the types of data you can configure a Log Analytics workspace to collect from all connected agents. See [What is monitored by Azure Monitor?](../monitor-reference.md) for a list of insights, solutions, and other solutions that use the Log Analytics agent to collect other kinds of data.

| Data Source | Description |
| --- | --- |
| [Windows Event logs](data-sources-windows-events.md) | Information sent to the Windows event logging system. |
| [Syslog](data-sources-syslog.md)                     | Information sent to the Linux event logging system. |
| [Performance](data-sources-performance-counters.md)  | Numerical values measuring performance of different aspects of operating system and workloads. |
| [IIS logs](data-sources-iis-logs.md)                 | Usage information for IIS web sites running on the guest operating system. |
| [Custom logs](data-sources-custom-logs.md)           | Events from text files on both Windows and Linux computers. |

## Data destinations
The Log Analytics agent sends data to a Log Analytics workspace in Azure Monitor. The Windows agent can be multihomed to send data to multiple workspaces and System Center Operations Manager management groups. The Linux agent can send to only a single destination, either a workspace or management group.

## Other services
The agent for Linux and Windows isn't only for connecting to Azure Monitor. Other services such as Azure Security Center and Azure Sentinel rely on the agent and its connected Log Analytics workspace. The agent also supports Azure Automation to host the Hybrid Runbook worker role and other services such as [Change Tracking](../../automation/change-tracking/overview.md), [Update Management](../../automation/update-management/update-mgmt-overview.md), and [Azure Security Center](../../security-center/security-center-intro.md). For more information about the Hybrid Runbook Worker role, see [Azure Automation Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md).  

## Workspace and management group limitations

See [Configure agent to report to an Operations Manager management group](agent-manage.md#configure-agent-to-report-to-an-operations-manager-management-group) for details on connecting an agent to an Operations Manager management group.

* Windows agents can connect to up to four workspaces, even if they are connected to a System Center Operations Manager management group.
* The Linux agent does not support multi-homing and can only connect to a single workspace or management group.


## Security limitations

* The Windows and Linux agents support the [FIPS 140 standard](/windows/security/threat-protection/fips-140-validation), but [other types of hardening may not be supported](agent-linux.md#supported-linux-hardening).


## Installation options

There are multiple methods to install the Log Analytics agent and connect your machine to Azure Monitor depending on your requirements. The following sections list the possible methods for different types of virtual machine.
> [!NOTE]
> It is not supported to clone a machine with the Log Analytics Agent already configured. If the agent has already been associated with a workspace this will not work for 'golden images'.

### Azure virtual machine

- [Azure Monitor for VMs](../insights/vminsights-enable-overview.md) provides multiple methods enabling agents at scale. This includes installation of the Log Analytics agent and Dependency agent. 
- [Azure Security Center can provision the Log Analytics agent](../../security-center/security-center-enable-data-collection.md) on all supported Azure VMs and any new ones that are created if you enable it to monitor for security vulnerabilities and threats.
- Log Analytics VM extension for [Windows](../../virtual-machines/extensions/oms-windows.md) or [Linux](../../virtual-machines/extensions/oms-linux.md) can be installed with the Azure portal, Azure CLI, Azure PowerShell, or a Azure Resource Manager template.
- Install for individual Azure virtual machines [manually from the Azure portal](../learn/quick-collect-azurevm.md?toc=%2fazure%2fazure-monitor%2ftoc.json).


### Windows virtual machine on-premises or in another cloud 

- [Manually install](agent-windows.md) the agent from the command line.
- Automate the installation with [Azure Automation DSC](agent-windows.md#install-agent-using-dsc-in-azure-automation).
- Use a [Resource Manager template with Azure Stack](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win)

### Linux virtual machine on-premises or in another cloud

- [Manually install](../learn/quick-collect-linux-computer.md) the agent calling a wrapper-script hosted on GitHub.
- System Center Operations Manager|[Integrate Operations Manager with Azure Monitor](./om-agents.md) to forward collected data from Windows computers reporting to a management group.

## Workspace ID and key
Regardless of the installation method used, you will require the workspace ID and key for the Log Analytics workspace that the agent will connect to. Select the workspace from the **Log Analytics workspaces** menu in the Azure portal. Then select **Agents management** in the **Settings** section. 

[![Workspace details](media/log-analytics-agent/workspace-details.png)](media/log-analytics-agent/workspace-details.png#lightbox)

## TLS 1.2 protocol

To ensure the security of data in transit to Azure Monitor logs, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**.  For additional information, review [Sending data securely using TLS 1.2](data-security.md#sending-data-securely-using-tls-12). 

## Network requirements
The agent for Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443. If the machine connects through a firewall or proxy server to communicate over the Internet, review requirements below to understand the network configuration required. If your IT security policies do not allow computers on the network to connect to the Internet, you can set up a [Log Analytics gateway](gateway.md) and then configure the agent to connect through the gateway to Azure Monitor. The agent can then receive configuration information and send data collected.

![Log Analytics agent communication diagram](./media/log-analytics-agent/log-analytics-agent-01.png)

The following table lists the proxy and firewall configuration information required for the Linux and Windows agents to communicate with Azure Monitor logs.

### Firewall requirements

|Agent Resource|Ports |Direction |Bypass HTTPS inspection|
|------|---------|--------|--------|   
|*.ods.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.oms.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.blob.core.windows.net |Port 443 |Outbound|Yes |
|*.azure-automation.net |Port 443 |Outbound|Yes |

For firewall information required for Azure Government, see [Azure Government management](../../azure-government/compare-azure-government-global-azure.md#azure-monitor). 

If you plan to use the Azure Automation Hybrid Runbook Worker to connect to and register with the Automation service to use runbooks or management solutions in your environment, it must have access to the port number and the URLs described in [Configure your network for the Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md#network-planning). 

### Proxy configuration

The Windows and Linux agent supports communicating either through a proxy server or Log Analytics gateway to Azure Monitor using the HTTPS protocol.  Both anonymous and basic authentication (username/password) are supported.  For the Windows agent connected directly to the service, the proxy configuration is specified during installation or [after deployment](agent-manage.md#update-proxy-settings) from Control Panel or with PowerShell.  

For the Linux agent, the proxy server is specified during installation or [after installation](agent-manage.md#update-proxy-settings) by modifying the proxy.conf configuration file.  The Linux agent proxy configuration value has the following syntax:

`[protocol://][user:password@]proxyhost[:port]`

|Property| Description |
|--------|-------------|
|Protocol | https |
|user | Optional username for proxy authentication |
|password | Optional password for proxy authentication |
|proxyhost | Address or FQDN of the proxy server/Log Analytics gateway |
|port | Optional port number for the proxy server/Log Analytics gateway |

For example:
`https://user01:password@proxy01.contoso.com:30443`

> [!NOTE]
> If you use special characters such as "\@" in your password, you receive a proxy connection error because value is parsed incorrectly.  To work around this issue, encode the password in the URL using a tool such as [URLDecode](https://www.urldecoder.org/).  



## Next steps

* Review [data sources](agent-data-sources.md) to understand the data sources available to collect data from your Windows or Linux system. 
* Learn about [log queries](../log-query/log-query-overview.md) to analyze the data collected from data sources and solutions. 
* Learn about [monitoring solutions](../insights/solutions.md) that add functionality to Azure Monitor and also collect data into the Log Analytics workspace.

