---
title: Log Analytics agent overview
description: This topic helps you understand how to collect data and monitor computers hosted in Azure, on-premises, or other cloud environment with Log Analytics.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/04/2020

---

# Log Analytics agent overview
The Azure Log Analytics agent was developed for comprehensive management across virtual machines in any cloud, on-premises machines, and those monitored by [System Center Operations Manager](https://docs.microsoft.com/system-center/scom/). The Windows and Linux agents send collected data from different sources to your Log Analytics workspace in Azure Monitor, as well as any unique logs or metrics as defined in a monitoring solution. The Log Analytics agent also supports insights and other services in Azure Monitor such as [Azure Monitor for VMs](../insights/vminsights-enable-overview.md), [Azure Security Center](/azure/security-center/), and [Azure Automation](../../automation/automation-intro.md).

This article provides a detailed overview of the agent, system and network requirements, and the different deployment methods.

> [!NOTE]
> You may also see the Log Analytics agent referred to as the Microsoft Monitoring Agent (MMA) or OMS Linux agent.

> [!NOTE]
> Azure Diagnostics extension is one of the agents available to collect monitoring data from the guest operating system of compute resources. See [Overview of the Azure Monitor agents ](agents-overview.md) for a description of the different agents and guidance on selecting the appropriate agents for your requirements.

## Comparison to Azure diagnostics extension
The [Azure diagnostics extension](diagnostics-extension-overview.md) in Azure Monitor can also be used to collect monitoring data from the guest operating system of Azure virtual machines. You may choose to use either or both depending on your requirements. See [Overview of the Azure Monitor agents](agents-overview.md) for a detailed comparison of the Azure Monitor agents. 

The key differences to consider are:

- Azure Diagnostics Extension can be used only with Azure virtual machines. The Log Analytics agent can be used with virtual machines in Azure, other clouds, and on-premises.
- Azure Diagnostics extension sends data to Azure Storage, [Azure Monitor Metrics](data-platform-metrics.md) (Windows only) and Event Hubs. The Log Analytics agent collects data to [Azure Monitor Logs](data-platform-logs.md).
- The Log Analytics agent is required for [solutions](../monitor-reference.md#insights-and-core-solutions), [Azure Monitor for VMs](../insights/vminsights-overview.md), and other services such as [Azure Security Center](/azure/security-center/).

## Costs
There is no cost for Log Analytics agent, but you may incur charges for the data ingested. Check [Manage usage and costs with Azure Monitor Logs](manage-cost-storage.md) for detailed information on the pricing for data collected in a Log Analytics workspace.

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
The Log Analytics agent sends data to a Log Analytics workspace in Azure Monitor. The Windows agent can be multihomed to send data to multiple workspaces and System Center Operations Manager management groups. The Linux agent can send to only a single destination.

## Other services
The agent for Linux and Windows isn't only for connecting to Azure Monitor, it also supports Azure Automation to host the Hybrid Runbook worker role and other services such as [Change Tracking](../../automation/change-tracking.md), [Update Management](../../automation/automation-update-management.md), and [Azure Security Center](../../security-center/security-center-intro.md). For more information about the Hybrid Runbook Worker role, see [Azure Automation Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md).  

## Installation and configuration

When using the Log Analytics agents to collect data, you need to understand the following in order to plan your agent deployment:

* To collect data from Windows agents, you can [configure each agent to report to one or more workspaces](agent-windows.md), even while it is reporting to a System Center Operations Manager management group. The Windows agent can report up to four workspaces.
* The Linux agent does not support multi-homing and can only report to a single workspace.
* The Windows agent supports the [FIPS 140 standard](https://docs.microsoft.com/windows/security/threat-protection/fips-140-validation), while the Linux agent does not support it.  

If you are using System Center Operations Manager 2012 R2 or later:

* Each Operations Manager management group can be [connected to only one workspace](om-agents.md).
* Linux computers reporting to a management group must be configured to report directly to a Log Analytics workspace. If your Linux computers are already reporting directly to a workspace and you want to monitor them with Operations Manager, follow these steps to [report to an Operations Manager management group](agent-manage.md#configure-agent-to-report-to-an-operations-manager-management-group).
* You can install the Log Analytics Windows agent on the Windows computer and have it report to both Operations Manager integrated with a workspace, and a different workspace.


There are multiple methods to install the Log Analytics agent and connect your machine to Azure Monitor depending on your requirements. The following table highlights each method to determine which works best in your organization.

|Source | Method | Description|
|-------|-------------|-------------|
|Azure VM| [Manually from the Azure portal](../../azure-monitor/learn/quick-collect-azurevm.md?toc=/azure/azure-monitor/toc.json) | Specify VMs to deploy from the Log Analytics workspace. |
| | Log Analytics VM extension for [Windows](../../virtual-machines/extensions/oms-windows.md) or [Linux](../../virtual-machines/extensions/oms-linux.md) using Azure CLI or with an Azure Resource Manager template | The extension installs the Log Analytics agent on Azure virtual machines and enrolls them into an existing Azure Monitor workspace. |
| | [Azure Monitor for VMs](../insights/vminsights-enable-overview.md) | When you enable monitoring with Azure Monitor for VMs, it installs the Log Analytics extension and agent. |
| | [Azure Security Center Automatic provisioning](../../security-center/security-center-enable-data-collection.md) | Azure Security Center can provision the Log Analytics agent on all supported Azure VMs and any new ones that are created if you enable it to monitor for security vulnerabilities and threats. If enabled, any new or existing VM without an installed agent will be provisioned. |
| Hybrid Windows computer| [Manual install](agent-windows.md) | Install the Microsoft Monitoring agent from the command line. |
| | [Azure Automation DSC](agent-windows.md#install-the-agent-using-dsc-in-azure-automation) | Automate the installation with Azure Automation DSC. |
| | [Resource Manager template with Azure Stack](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win) | Use an Azure Resource Manager template if you have deployed Microsoft Azure Stack in your datacenter.| 
| Hybrid Linux computer| [Manual install](../../azure-monitor/learn/quick-collect-linux-computer.md)|Install the agent for Linux calling a wrapper-script hosted on GitHub. | 
| System Center Operations Manager|[Integrate Operations Manager with Log Analytics](../../azure-monitor/platform/om-agents.md) | Configure integration between Operations Manager and Azure Monitor logs to forward collected data from Windows computers reporting to a management group.|  


## Supported Windows operating systems

The following versions of the Windows operating system are officially supported for the Windows agent:

* Windows Server 2019
* Windows Server 2016, version 1709 and 1803
* Windows Server 2012, 2012 R2
* Windows Server 2008 SP2 (x64), 2008 R2
* Windows 10 Enterprise (including multi-session) and Pro
* Windows 8 Enterprise and Pro 
* Windows 7 SP1

>[!NOTE]
>While the Log Analytics agent for Windows was designed to support server monitoring scenarios, we realize you may run Windows client to support workloads configured and optimized for the server operating system. The agent does support Windows client, however our monitoring solutions don't focus on client monitoring scenarios unless explicitly stated.

## Supported Linux operating systems

This section provides details about the supported Linux distributions.

Starting with versions released after August 2018, we are making the following changes to our support model:  

* Only the server versions are supported, not client.  
* Focus support on any of the [Azure Linux Endorsed distros](../../virtual-machines/linux/endorsed-distros.md). Note that there may be some delay between a new distro/version being Azure Linux Endorsed and it being supported for the Log Analytics Linux agent.
* All minor releases are supported for each major version listed.
* Versions that have passed their manufacturer's end-of-support date are not supported.  
* New versions of AMI are not supported.  
* Only versions that run SSL 1.x by default are supported.

>[!NOTE]
>If you are using a distro or version that is not currently supported and doesn't align to our support model, we recommend that you fork this repo, acknowledging that Microsoft support will not provide assistance with forked agent versions.


### Python 2 requirement
 The Log Analytics agent requires Python 2. If your virtual machine is using a distro that doesn't include Python 2 by default then you must install it. The following sample commands will install Python 2 on different distros.

 - Red Hat, CentOS, Oracle: `yum install -y python2`
 - Ubuntu, Debian: `apt-get install -y python2`
 - SUSE: `zypper install -y python2`

The python2 executable must be aliased to "python" using the following command:

```
alternatives --set python /usr/sbin/python2
```

### Supported distros

The following versions of the Linux operating system are officially supported for the Linux agent:

* Amazon Linux 2017.09 (x64)
* CentOS Linux 6 (x64) and 7 (x64)  
* Oracle Linux 6 and 7 (x64) 
* Red Hat Enterprise Linux Server 6 (x64), 7 (x64), and 8 (x64)
* Debian GNU/Linux 8 and 9 (x64)
* Ubuntu 14.04 LTS (x86/x64), 16.04 LTS (x64), and 18.04 LTS (x64)
* SUSE Linux Enterprise Server 12 (x64) and 15 (x64)

>[!NOTE]
>OpenSSL 1.1.0 is only supported on x86_x64 platforms (64-bit) and OpenSSL earlier than 1.x is not supported on any platform.
>

### Agent prerequisites

The following table highlights the packages required for supported Linux distros that the agent will be installed on.

|Required package |Description |Minimum version |
|-----------------|------------|----------------|
|Glibc |    GNU C Library | 2.5-12 
|Openssl    | OpenSSL Libraries | 1.0.x or 1.1.x |
|Curl | cURL web client | 7.15.5 |
|Python-ctypes | | 
|PAM | Pluggable Authentication Modules | | 

>[!NOTE]
>Either rsyslog or syslog-ng are required to collect syslog messages. The default syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) is not supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

## TLS 1.2 protocol

To ensure the security of data in transit to Azure Monitor logs, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**.  For additional information, review [Sending data securely using TLS 1.2](data-security.md#sending-data-securely-using-tls-12). 


## SHA-2 Code Signing Support Requirement for Windows
The Windows agent will begin to exclusively use SHA-2 signing on August 17, 2020. This change will impact customers using the Log Analytics agent on a legacy OS as part of any Azure service (Azure Monitor, Azure Automation, Azure Update Management, Azure Change Tracking, Azure Security Center, Azure Sentinel, Windows Defender ATP). The change does not require any customer action unless you are running the agent on a legacy OS version (Windows 7, Windows Server 2008 R2 and Windows Server 2008). Customers running on a legacy OS version are required to take the following actions on their machines before August 17, 2020 or their agents will stop sending data to their Log Analytics workspaces:

1. Install the latest Service Pack for your OS. The required service pack versions are:
    - Windows 7 SP1
    - Windows Server 2008 SP2
    - Windows Server 2008 R2 SP1

2. Install the SHA-2 signing Windows updates for your OS as described in [2019 SHA-2 Code Signing Support requirement for Windows and WSUS](https://support.microsoft.com/help/4472027/2019-sha-2-code-signing-support-requirement-for-windows-and-wsus)
3. Update to the latest version of the Windows agent (version 10.20.18029).
4. Recommended to configure the agent to [use TLS 1.2](agent-windows.md#configure-agent-to-use-tls-12). 


## Network requirements
The agent for Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443, and if the machine connects through a firewall or proxy server to communicate over the Internet, review requirements below to understand the network configuration required. If your IT security policies do not allow computers on the network to connect to the Internet, you can set up a [Log Analytics gateway](gateway.md) and then configure the agent to connect through the gateway to Azure Monitor logs. The agent can then receive configuration information and send data collected depending on what data collection rules and monitoring solutions you have enabled in your workspace.

![Log Analytics agent communication diagram](./media/log-analytics-agent/log-analytics-agent-01.png)

The following table lists the proxy and firewall configuration information that's required for the Linux and Windows agents to communicate with Azure Monitor logs.

### Firewall requirements

|Agent Resource|Ports |Direction |Bypass HTTPS inspection|
|------|---------|--------|--------|   
|*.ods.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.oms.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.blob.core.windows.net |Port 443 |Outbound|Yes |
|*.azure-automation.net |Port 443 |Outbound|Yes |

For firewall information required for Azure Government, see [Azure Government management](../../azure-government/documentation-government-services-monitoringandmanagement.md#azure-monitor-logs). 

If you plan to use the Azure Automation Hybrid Runbook Worker to connect to and register with the Automation service to use runbooks or management solutions in your environment, it must have access to the port number and the URLs described in [Configure your network for the Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md#network-planning). 

### Proxy configuration

The Windows and Linux agent supports communicating either through a proxy server or Log Analytics gateway to Azure Monitor using the HTTPS protocol.  Both anonymous and basic authentication (username/password) are supported.  For the Windows agent connected directly to the service, the proxy configuration is specified during installation or [after deployment](agent-manage.md#update-proxy-settings) from Control Panel or with PowerShell.  

For the Linux agent, the proxy server is specified during installation or [after installation](agent-manage.md#update-proxy-settings) by modifying the proxy.conf configuration file.  The Linux agent proxy configuration value has the following syntax:

`[protocol://][user:password@]proxyhost[:port]`

> [!NOTE]
> If your proxy server does not require you to authenticate, the Linux agent still requires providing a pseudo user/password. This can be any username or password.

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
