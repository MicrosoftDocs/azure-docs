---
title: Connect Linux computers to Azure Monitor | Microsoft Docs
description: This article describes how to connect Linux computers hosted in other clouds or on-premises to Azure Monitor with the Log Analytics agent for Linux.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: MGoedtel
ms.author: magoedte
ms.date: 12/09/2019

---

# Connect Linux computers to Azure Monitor

In order to monitor and manage virtual machines or physical computers in your local datacenter or other cloud environment with Azure Monitor, you need to deploy the Log Analytics agent and configure it to report to a Log Analytics workspaces. The agent also supports the Hybrid Runbook Worker role for Azure Automation.

On a monitored Linux computer, the agent is listed as `omsagent`. `omsconfig` is the Log Analytics agent for Linux configuration agent that looks for new portal side configuration every 5 minutes. This configuration is then applied to the agent configuration files located at /etc/opt/microsoft/omsagent/conf/omsagent.conf.

The agent may be installed by using one of the following methods. Details on using each method are provided later in the article.

* Manually download and install the agent. This is required when the Linux computer does not have access to the Internet and will be communicating with Azure Monitor or Azure Automation through a [Log Analytics Gateway](gateway.md).  
* Install the agent for Linux calling a wrapper-script hosted on GitHub. This is the recommended method to install and upgrade the agent when it has connectivity with the Internet.

To understand the supported configuration, review [supported Linux operating systems](log-analytics-agent.md#supported-linux-operating-systems) and [network firewall configuration](log-analytics-agent.md#network-firewall-requirements).
