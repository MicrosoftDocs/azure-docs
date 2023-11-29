---
title: "[Recommended] Contrast Protect via AMA connector for Microsoft Sentinel"
description: "Learn how to install the connector [Recommended] Contrast Protect via AMA to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Recommended] Contrast Protect via AMA connector for Microsoft Sentinel

Contrast Protect mitigates security threats in production applications with runtime protection and observability.  Attack event results (blocked, probed, suspicious...) and other information can be sent to Microsoft Microsoft Sentinel to blend with security information from other systems.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (ContrastProtect)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Contrast Protect](https://docs.contrastsecurity.com/) |

## Query samples

**All attacks**
   ```kusto
let extract_data=(a:string, k:string) {   parse_urlquery(replace(@';', @'&', a))["Query Parameters"][k] }; CommonSecurityLog  
   | where DeviceVendor == 'Contrast Security' 
   | extend Outcome = replace(@'INEFFECTIVE', @'PROBED', tostring(coalesce(column_ifexists("EventOutcome", ""), extract_data(AdditionalExtensions, 'outcome'), ""))) 
   | where Outcome != 'success' 
   | extend Rule = extract_data(AdditionalExtensions, 'pri') 
   | project TimeGenerated, ApplicationProtocol, Rule, Activity, Outcome, RequestURL, SourceIP 
   | order by TimeGenerated desc 
   ```

**Effective attacks**
   ```kusto
let extract_data=(a:string, k:string) {
  parse_urlquery(replace(@';', @'&', a))["Query Parameters"][k]
};
CommonSecurityLog 

   | where DeviceVendor == 'Contrast Security'

   | extend Outcome = tostring(coalesce(column_ifexists("EventOutcome", ""), extract_data(AdditionalExtensions, 'outcome'), ""))

   | where Outcome in ('EXPLOITED','BLOCKED','SUSPICIOUS')

   | extend Rule = extract_data(AdditionalExtensions, 'pri')

   | project TimeGenerated, ApplicationProtocol, Rule, Activity, Outcome, RequestURL, SourceIP

   | order by TimeGenerated desc

   ```



## Prerequisites

To integrate with [Recommended] Contrast Protect via AMA make sure you have: 

- ****: To collect data from non-Azure VMs, they must have Azure Arc installed and enabled. [Learn more](/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell,PowerShellWindows,PowerShellWindowsArc,CLIWindows,CLIWindowsArc)
- ****: Common Event Format (CEF) via AMA and Syslog via AMA data connectors must be installed [Learn more](/azure/sentinel/connect-cef-ama#open-the-connector-page-and-create-the-dcr)


## Vendor installation instructions


Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace


2. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/contrast_security.contrast_protect_azure_sentinel_solution?tab=Overview) in the Azure Marketplace.
