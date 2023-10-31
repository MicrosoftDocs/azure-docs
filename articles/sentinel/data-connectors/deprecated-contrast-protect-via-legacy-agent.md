---
title: "[Deprecated] Contrast Protect via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Contrast Protect via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Contrast Protect via Legacy Agent connector for Microsoft Sentinel

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



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs to Syslog agent

Configure the Contrast Protect agent to forward events to syslog as described here: https://docs.contrastsecurity.com/en/output-to-syslog.html. Generate some attack events for your application.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/contrast_security.contrast_protect_azure_sentinel_solution?tab=Overview) in the Azure Marketplace.
