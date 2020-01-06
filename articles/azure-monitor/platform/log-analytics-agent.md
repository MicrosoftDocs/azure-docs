---
title: Collect log data with Azure Log Analytics agent | Microsoft Docs
description: This topic helps you understand how to collect data and monitor computers hosted in Azure, on-premises, or other cloud environment with Log Analytics.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/24/2019

---

# Collect log data with the Log Analytics agent

The Azure Log Analytics agent, previously referred to as the Microsoft Monitoring Agent (MMA) or OMS Linux agent, was developed for comprehensive management across on-premises machines, computers monitored by [System Center Operations Manager](https://docs.microsoft.com/system-center/scom/), and virtual machines in any cloud. The Windows and Linux agents attach to Azure Monitor and store collected log data from different sources in your Log Analytics workspace, as well as any unique logs or metrics as defined in a monitoring solution. 

This article provides a detailed overview of the agent, system and network requirements, and the different deployment methods.

## Overview

![Log Analytics agent communication diagram](./media/log-analytics-agent/log-analytics-agent-01.png)

Before analyzing and acting on collected data, you first need to install and connect agents for all of the machines that you want to send data to the Azure Monitor service. You can install agents on your Azure VMs using the Azure Log Analytics VM extension for Windows and Linux, and for machines in a hybrid environment using setup, command line, or with Desired State Configuration (DSC) in Azure Automation. 

The agent for Linux and Windows communicates outbound to the Azure Monitor service over TCP port 443, and if the machine connects through a firewall or proxy server to communicate over the Internet, review requirements below to understand the network configuration required. If your IT security policies do not allow computers on the network to connect to the Internet, you can set up a [Log Analytics gateway](gateway.md) and then configure the agent to connect through the gateway to Azure Monitor logs. The agent can then receive configuration information and send data collected depending on what data collection rules and monitoring solutions you have enabled in your workspace. 

When using the Log Analytics agents to collect data, you need to understand the following in order to plan your agent deployment:

* To collect data from Windows agents, you can [configure each agent to report to one or more workspaces](agent-windows.md), even while it is reporting to a System Center Operations Manager management group. The Windows agent can report up to four workspaces.
* The Linux agent does not support multi-homing and can only report to a single workspace.
* The Windows agent supports the [FIPS 140 standard](https://docs.microsoft.com/windows/security/threat-protection/fips-140-validation), while the Linux agent does not support it.  

If you are using System Center Operations Manager 2012 R2 or later:

* Each Operations Manager management group can be [connected to only one workspace](om-agents.md).
* Linux computers reporting to a management group must be configured to report directly to a Log Analytics workspace. If your Linux computers are already reporting directly to a workspace and you want to monitor them with Operations Manager, follow these steps to [report to an Operations Manager management group](agent-manage.md#configure-agent-to-report-to-an-operations-manager-management-group).
* You can install the Log Analytics Windows agent on the Windows computer and have it report to both Operations Manager integrated with a workspace, and a different workspace.

The agent for Linux and Windows isn't only for connecting to Azure Monitor, it also supports Azure Automation to host the Hybrid Runbook worker role and other services such as [Change Tracking](../../automation/change-tracking.md), [Update Management](../../automation/automation-update-management.md), and [Azure Security Center](../../security-center/security-center-intro.md). For more information about the Hybrid Runbook Worker role, see [Azure Automation Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md).  

## Supported Windows operating systems

The following versions of the Windows operating system are officially supported for the Windows agent:

* Windows Server 2019
* Windows Server 2008 SP2 (x64), 2008 R2, 2012, 2012 R2, 2016, version 1709 and 1803
* Windows 7 SP1, Windows 8 Enterprise and Pro, and Windows 10 Enterprise and Pro

>[!NOTE]
>While the Log Analytics agent for Windows was designed to support server monitoring scenarios, we realize you may run Windows client to support workloads configured and optimized for the server operating system. The agent does support Windows client, however our monitoring solutions don't focus on client monitoring scenarios unless explicitly stated.

## Supported Linux operating systems

This section provides details about the supported Linux distributions.

Starting with versions released after August 2018, we are making the following changes to our support model:  

* Only the server versions are supported, not client.  
* New versions of [Azure Linux Endorsed distros](../../virtual-machines/linux/endorsed-distros.md) are always supported.  
* All minor releases are supported for each major version listed.
* Versions that have passed their manufacturer's end-of-support date are not supported.  
* New versions of AMI are not supported.  
* Only versions that run SSL 1.x by default are supported.

>[!NOTE]
>If you are using a distro or version that is not currently supported and doesn't align to our support model, we recommend that you fork this repo, acknowledging that Microsoft support will not provide assistance with forked agent versions.

* Amazon Linux 2017.09 (x64)
* CentOS Linux 6 (x86/x64) and 7 (x64)  
* Oracle Linux 6 and 7 (x86/x64) 
* Red Hat Enterprise Linux Server 6 (x86/x64) and 7 (x64)
* Debian GNU/Linux 8 and 9 (x86/x64)
* Ubuntu 14.04 LTS (x86/x64), 16.04 LTS (x86/x64), and 18.04 LTS (x64)
* SUSE Linux Enterprise Server 12 (x64) and 15 (x64)

>[!NOTE]
>OpenSSL 1.1.0 is only supported on x86_x64 platforms (64-bit) and OpenSSL earlier than 1.x is not supported on any platform.
>

### Agent prerequisites

The following table highlights the packages required for supported Linux distros that the agent will be installed on.

|Required package |Description |Minimum version |
|-----------------|------------|----------------|
|Glibc |	GNU C Library | 2.5-12 
|Openssl	| OpenSSL Libraries | 1.0.x or 1.1.x |
|Curl | cURL web client | 7.15.5 |
|Python-ctypes | | 
|PAM | Pluggable Authentication Modules | | 

>[!NOTE]
>Either rsyslog or syslog-ng are required to collect syslog messages. The default syslog daemon on version 5 of Red Hat Enterprise Linux, CentOS, and Oracle Linux version (sysklog) is not supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

## TLS 1.2 protocol

To insure the security of data in transit to Azure Monitor logs, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**.  For additional information, review [Sending data securely using TLS 1.2](data-security.md#sending-data-securely-using-tls-12). 

## Network firewall requirements

The information below list the proxy and firewall configuration information required for the Linux and Windows agent to communicate with Azure Monitor logs.  

|Agent Resource|Ports |Direction |Bypass HTTPS inspection|
|------|---------|--------|--------|   
|*.ods.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.oms.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.blob.core.windows.net |Port 443 |Outbound|Yes |  

For firewall information required for Azure Government, see [Azure Government management](../../azure-government/documentation-government-services-monitoringandmanagement.md#azure-monitor-logs). 

If you plan to use the Azure Automation Hybrid Runbook Worker to connect to and register with the Automation service to use runbooks or management solutions in your environment, it must have access to the port number and the URLs described in [Configure your network for the Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md#network-planning). 

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
> If you use special characters such as “\@” in your password, you receive a proxy connection error because value is parsed incorrectly.  To work around this issue, encode the password in the URL using a tool such as [URLDecode](https://www.urldecoder.org/).  

## Install and configure agent

Connecting machines in your Azure subscription or hybrid environment directly with Azure Monitor logs can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best in your organization.

|Source | Method | Description|
|-------|-------------|-------------|
|Azure VM| - Log Analytics VM extension for [Windows](../../virtual-machines/extensions/oms-windows.md) or [Linux](../../virtual-machines/extensions/oms-linux.md) using Azure CLI or with an Azure Resource Manager template<br>- [Manually from the Azure portal](../../azure-monitor/learn/quick-collect-azurevm.md?toc=/azure/azure-monitor/toc.json)<br>- [Azure Security Center Automatic provisioning](../../security-center/security-center-enable-data-collection.md)| - The extension installs the Log Analytics agent on Azure virtual machines and enrolls them into an existing Azure Monitor workspace.<br>- Azure Security Center can provision the Log Analytics agent on all supported Azure VMs and any new ones that are created if you enable it to monitor for security vulnerabilities and threats. If enabled, any new or existing VM without an installed agent will be provisioned.|
| Hybrid Windows computer|- [Manual install](agent-windows.md)<br>- [Azure Automation DSC](agent-windows.md#install-the-agent-using-dsc-in-azure-automation)<br>- [Resource Manager template with Azure Stack](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win) |Install the Microsoft Monitoring agent from the command line or using an automated method such as Azure Automation DSC, [Configuration Manager](https://docs.microsoft.com/configmgr/apps/deploy-use/deploy-applications), or with an Azure Resource Manager template if you have deployed Microsoft Azure Stack in your datacenter.| 
| Hybrid Linux computer| [Manual install](../../azure-monitor/learn/quick-collect-linux-computer.md)|Install the agent for Linux calling a wrapper-script hosted on GitHub. | 
| System Center Operations Manager|[Integrate Operations Manager with Log Analytics](om-agents.md) | Configure integration between Operations Manager and Azure Monitor logs to forward collected data from Windows computers reporting to a management group.|  

## Next steps

* Review [data sources](agent-data-sources.md) to understand the data sources available to collect data from your Windows or Linux system. 

* Learn about [log queries](../log-query/log-query-overview.md) to analyze the data collected from data sources and solutions. 

* Learn about [monitoring solutions](../insights/solutions.md) that add functionality to Azure Monitor and also collect data into the Log Analytics workspace.
