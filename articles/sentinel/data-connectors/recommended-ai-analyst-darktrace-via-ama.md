---
title: "[Recommended] AI Analyst Darktrace via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] AI Analyst Darktrace via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] AI Analyst Darktrace via AMA connector for Microsoft Sentinel

The Darktrace connector lets users connect Darktrace Model Breaches in real-time with Microsoft Sentinel, allowing creation of custom Dashboards, Workbooks, Notebooks and Custom Alerts to improve investigation.  Microsoft Sentinel's enhanced visibility into Darktrace logs enables monitoring and mitigation of security threats.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Darktrace)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Darktrace](https://www.darktrace.com/en/contact/) |

## Query samples

**first 10 most recent data breaches**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Darktrace"

   | order by TimeGenerated desc 

   | limit 10
   ```



## Prerequisites

To integrate with [Recommended] AI Analyst Darktrace via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions



2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)
