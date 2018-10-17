---
title: Collect data in a hybrid environment with Azure Log Analytics agent | Microsoft Docs
description: This topic helps you understand how to collect data and monitor computers hosted in your on-premises or other cloud environment with Log Analytics.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/15/2018
ms.author: magoedte
ms.component: 
---

# Collect data in a hybrid environment with Log Analytics agent

Azure Log Analytics can collect and act on data from computers running the Windows or Linux operating system running in:

* [Azure virtual machines](log-analytics-quick-collect-azurevm.md) using the Log Analytics VM Extension 
* Your datacenter as physical servers or virtual machines
* Virtual machines in a cloud-hosted service like Amazon Web Services (AWS)

Computers hosted in your environment can be directly connected to Log Analytics, or if you are already monitoring these computers with System Center Operations Manager 2012 R2 or later, you can integrate your Operations Manage management group with Log Analytics and continue maintaining your IT service operations processes.  

## Overview

![log-analytics-agent-direct-connect-diagram](media/log-analytics-concept-hybrid/log-analytics-on-prem-comms.png)

Before analyzing and acting on collected data, you first need to install and connect agents for all of the computers that you want to send data to the Log Analytics service. You can install agents on your on-prem computers using Setup, command line, or with Desired State Configuration (DSC) in Azure Automation. 

The agent for Linux and Windows communicates outbound with the Log Analytics service over TCP port 443, and if the computer connects to a firewall or proxy server to communicate over the Internet, review requirements below to understand the network configuration required.  If your IT security policies do not allow computers on the network to connect to the Internet, you can set up an [OMS Gateway](log-analytics-oms-gateway.md) and then configure the agent to connect through the gateway to Log Analytics. The agent  can then receive configuration information and send data collected depending on what data collection rules and solutions you have enabled. 

If you are monitoring the computer with System Center Operations Manager 2012 R2 or later, it can be multi-homed with the Log Analytics service to collect data and forward to the service and still be monitored by [Operations Manager](log-analytics-om-agents.md). Linux computers monitored by an Operations Manager management group integrated with Log Analytics do not receive configuration for data sources and forward collected data through the management group. The Windows agent can report up to four workspaces, while the Linux agent only supports reporting to a single workspace.  

The agent for Linux and Windows isn't only for connecting to Log Analytics, it also supports Azure Automation to host the Hybrid Runbook worker role and management solutions such as Change Tracking and Update Management.  For more information about the Hybrid Runbook Worker role, see [Azure Automation Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md).  

## Supported Windows operating systems
The following versions of the Windows operating system are officially supported for the Windows agent:

* Windows Server 2008 Service Pack 1 (SP1) or later
* Windows 7 SP1 and later.

## Supported Linux operating systems
This section provides details about the supported Linux distributions.    

Starting with versions released after August 2018, we are making the following changes to our support model:  

* Only the server versions are supported, not client.  
* New versions of [Azure Linux Endorsed distros](../virtual-machines/linux/endorsed-distros.md) are always supported.  
* All minor releases are supported for each major version listed.
* Versions that have passed their manufacturer's end-of-support date are not supported.  
* New versions of AMI are not supported.  
* Only versions that run SSL 1.x by default are supported.

If you are using a distro or version that is not currently supported and doesn't align to our support model, we recommend that you fork this repo, acknowledging that Microsoft support will not provide assistance with forked agent versions.

* Amazon Linux 2017.09 (x64)
* CentOS Linux 6 (x86/x64) and 7 (x64)  
* Oracle Linux 6 and 7 (x86/x64) 
* Red Hat Enterprise Linux Server 6 (x86/x64) and 7 (x64)
* Debian GNU/Linux 8 and 9 (x86/x64)
* Ubuntu 14.04 LTS (x86/x64), 16.04 LTS (x86/x64), and 18.04 LTS (x64)
* SUSE Linux Enterprise Server 12 (x64)

>[!NOTE]
>OpenSSL 1.1.0 is only supported on x86_x64 platforms (64-bit) and OpenSSL earlier than 1.x is not supported on any platform.
>

## TLS 1.2 protocol
To insure the security of data in transit to Log Analytics, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**.  For additional information, review [Sending data securely using TLS 1.2](log-analytics-data-security.md#sending-data-securely-using-tls-12). 

## Network firewall requirements
The information below list the proxy and firewall configuration information required for the Linux and Windows agent to communicate with Log Analytics.  

|Agent Resource|Ports |Direction |Bypass HTTPS inspection|
|------|---------|--------|--------|   
|*.ods.opinsights.azure.com |Port 443 |Inbound and outbound|Yes |  
|*.oms.opinsights.azure.com |Port 443 |Inbound and outbound|Yes |  
|*.blob.core.windows.net |Port 443 |Inbound and outbound|Yes |  
|*.azure-automation.net |Port 443 |Inbound and outbound|Yes |  


If you plan to use the Azure Automation Hybrid Runbook Worker to connect to and register with the Automation service to use runbooks in your environment, it must have access to the port number and the URLs described in [Configure your network for the Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md#network-planning). 

The Windows and Linux agent supports communicating either through a proxy server or OMS Gateway to the Log Analytics service using the HTTPS protocol.  Both anonymous and basic authentication (username/password) are supported.  For the Windows agent connected directly to the service, the proxy configuration is specified during installation or [after deployment](log-analytics-agent-manage.md#update-proxy-settings) from Control Panel or  with PowerShell.  

For the Linux agent, the proxy server is specified during installation or [after installation](log-analytics-agent-manage.md#update-proxy-settings) by modifying the proxy.conf configuration file.  The Linux agent proxy configuration value has the following syntax:

`[protocol://][user:password@]proxyhost[:port]`

> [!NOTE]
> If your proxy server does not require you to authenticate, the Linux agent still requires providing a pseudo user/password. This can be any username or password.

|Property| Description |
|--------|-------------|
|Protocol | https |
|user | Optional username for proxy authentication |
|password | Optional password for proxy authentication |
|proxyhost | Address or FQDN of the proxy server/OMS Gateway |
|port | Optional port number for the proxy server/OMS Gateway |

For example:
`https://user01:password@proxy01.contoso.com:30443`

> [!NOTE]
> If you use special characters such as “\@” in your password, you receive a proxy connection error because value is parsed incorrectly.  To work around this issue, encode the password in the URL using a tool such as [URLDecode](https://www.urldecoder.org/).  

## Install and configure agent 
Connecting your on-premises computers directly with Log Analytics can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best in your organization.

|Source | Method | Description|
|-------|-------------|-------------|
| Windows computer|- [Manual install](log-analytics-agent-windows.md)<br>- [Azure Automation DSC](log-analytics-agent-windows.md#install-the-agent-using-dsc-in-azure-automation)<br>- [Resource Manager template with Azure Stack](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win) |Install the Microsoft Monitoring agent from the command line or using an automated method such as Azure Automation DSC, [System Center Configuration Manager](https://docs.microsoft.com/sccm/apps/deploy-use/deploy-applications), or with an Azure Resource Manager template if you have deployed Microsoft Azure Stack in your datacenter.| 
|Linux computer| [Manual install](log-analytics-quick-collect-linux-computer.md)|Install the agent for Linux calling a wrapper-script hosted on GitHub. | 
| System Center Operations Manager|[Integrate Operations Manager with Log Analytics](log-analytics-om-agents.md) | Configure integration between Operations Manager and Log Analytics to forward collected data from Linux and Windows computers reporting to a management group.|  

## Next steps

* Review [data sources](log-analytics-data-sources.md) to understand the data sources available to collect data from your Windows or Linux system. 

* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions. 

* Learn about [solutions](log-analytics-add-solutions.md) that add functionality to Log Analytics and also collect data into the OMS repository.
