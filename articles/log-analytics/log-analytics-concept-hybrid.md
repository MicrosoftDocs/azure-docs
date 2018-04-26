---
title: Collect data from your environment with Azure Log Analytics  | Microsoft Docs
description: This topic helps you understand how to collect data and monitor computers hosted in your on-premises or other cloud environment with Log Analytics.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/14/2018
ms.author: magoedte

---
# Collect data from computers in your environment with Log Analytics

Azure Log Analytics can collect and act on data from Windows or Linux computers residing in:

* [Azure virtual machines](log-analytics-quick-collect-azurevm.md) using the Log Analytics VM Extension 
* Your datacenter as physical servers or virtual machines
* Virtual machines in a cloud-hosted service like Amazon Web Services (AWS)

Computers hosted in your environment can be directly connected to Log Analytics, or if you are already monitoring these computers with System Center Operations Manager 2012 R2 or 2016, you can integrate your Operations Manage management group with Log Analytics and continue maintaining your service operations processes and strategy.  

## Overview

![log-analytics-agent-direct-connect-diagram](media/log-analytics-concept-hybrid/log-analytics-on-prem-comms.png)

Before analyzing and acting on collected data, you first need to install and connect agents for all of the computers that you want to send data to the Log Analytics service. You can install agents on your on-prem computers using Setup, command line, or with Desired State Configuration (DSC) in Azure Automation. 

The agent for Linux and Windows communicates outbound with the Log Analytics service over TCP port 443, and if the computer connects to a firewall or proxy server to communicate over the Internet, review [Configuring the agent for use with a proxy server or OMS Gateway](#configuring-the-agent-for-use-with-a-proxy-server-or-oms-gateway) to understand what configuration changes will need to be applied. If you are monitoring the computer with System Center 2016 - Operations Manager or Operations Manager 2012 R2, it can be multi-homed with the Log Analytics service to collect data and forward to the service and still be monitored by [Operations Manager](log-analytics-om-agents.md). Linux computers monitored by an Operations Manager management group integrated with Log Analytics do not receive configuration for data sources and forward collected data through the management group. The Windows agent can report up to four workspaces, while the Linux agent only supports reporting to a single workspace.  

The agent for Linux and Windows isn't only for connecting into Log Analytics, it also supports connecting with Azure Automation to host the Hybrid Runbook worker role and management solutions such as Change Tracking and Update Management.  For more information about the Hybrid Runbook Worker role, see [Azure Automation Hybrid Runbook Worker](../automation/automation-offering-get-started.md#automation-architecture-overview).  

If your IT security policies do not allow computers on your network to connect to the Internet, the agent can be configured to connect to the OMS Gateway to receive configuration information and send collected data depending on the solution you have enabled. For more information and steps on how to configure your Linux or Windows agent to communicate through an OMS Gateway to the Log Analytics service, see [Connect computers to OMS using the OMS Gateway](log-analytics-oms-gateway.md). 

> [!NOTE]
> The agent for Windows only supports Transport Layer Security (TLS) 1.0 and 1.1.  
> 

## Prerequisites
Before starting, review the following details to verify you meet the minimum system requirements.

### Windows operating system
The following versions of the Windows operating system are officially supported for the Windows agent:

* Windows Server 2008 Service Pack 1 (SP1) or later
* Windows 7 SP1 and later.

#### Network configuration
The information below list the proxy and firewall configuration information required for the  Windows agent to communicate with Log Analytics. Traffic is outbound from your network to the Log Analytics service. 

| Agent Resource | Ports | Bypass HTTPS inspection|
|----------------|-------|------------------------|
|*.ods.opinsights.azure.com |443 | Yes |
|*.oms.opinsights.azure.com | 443 | Yes | 
|*.blob.core.windows.net | 443 | Yes | 
|*.azure-automation.net | 443 | Yes | 

### Linux operating systems
The following Linux distributions are officially supported.  However, the Linux agent might also run on other distributions not listed.  Unless otherwise noted, all minor releases are supported for each major version listed.  

* Amazon Linux 2012.09 to 2015.09 (x86/x64)
* CentOS Linux 5, 6, and 7 (x86/x64)  
* Oracle Linux 5, 6, and 7 (x86/x64) 
* Red Hat Enterprise Linux Server 5, 6 and 7 (x86/x64)
* Debian GNU/Linux 6, 7, and 8 (x86/x64)
* Ubuntu 12.04 LTS, 14.04 LTS, 16.04 LTS (x86/x64)
* SUSE Linux Enterprise Server 11 and 12 (x86/x64)

#### Network configuration
The information below list the proxy and firewall configuration information required for the Linux agent to communicate with Log Analytics.  

|Agent Resource| Ports | Direction |  
|------|---------|--------|  
|*.ods.opinsights.azure.com | Port 443 | Inbound and outbound|  
|*.oms.opinsights.azure.com | Port 443 | Inbound and outbound|  
|*.blob.core.windows.net | Port 443 | Inbound and outbound|  
|*.azure-automation.net | Port 443 | Inbound and outbound|  

The Linux agent supports communicating either through a proxy server or OMS Gateway to the Log Analytics service using the HTTPS protocol.  Both anonymous and basic authentication (username/password) are supported.  The proxy server can be specified during installation or by modifying the proxy.conf configuration file after installation.  

The proxy configuration value has the following syntax:

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
> If you use special characters such as “@” in your password, you receive a proxy connection error because value is parsed incorrectly.  To work around this issue, encode the password in the URL using a tool such as [URLDecode](https://www.urldecoder.org/).  

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