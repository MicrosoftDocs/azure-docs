---
title: "Awake Security connector for Microsoft Sentinel"
description: "Learn how to install the connector Awake Security to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Awake Security connector for Microsoft Sentinel

The Awake Security CEF connector allows users to send detection model matches from the Awake Security Platform to Microsoft Sentinel. Remediate threats quickly with the power of network detection and response and speed up investigations with deep visibility especially into unmanaged entities including users, devices and applications on your network. The connector also enables the creation of network security-focused custom alerts, incidents, workbooks and notebooks that align with your existing security operations workflows. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (AwakeSecurity)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Arista - Awake Security](https://awakesecurity.com/) |

## Query samples

**Top 5 Adversarial Model Matches by Severity**
   ```kusto
union CommonSecurityLog

   | where DeviceVendor == "Arista Networks" and DeviceProduct == "Awake Security"

   | summarize  TotalActivities=sum(EventCount) by Activity,LogSeverity

   | top 5 by LogSeverity desc
   ```

**Top 5 Devices by Device Risk Score**
   ```kusto
CommonSecurityLog 
   | where DeviceVendor == "Arista Networks" and DeviceProduct == "Awake Security" 
   | extend DeviceCustomNumber1 = coalesce(column_ifexists("FieldDeviceCustomNumber1", long(null)), DeviceCustomNumber1, long(null)) 
   | summarize MaxDeviceRiskScore=max(DeviceCustomNumber1),TimesAlerted=count() by SourceHostName=coalesce(SourceHostName,"Unknown") 
   | top 5 by MaxDeviceRiskScore desc
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

2. Forward Awake Adversarial Model match results to a CEF collector.

Perform the following steps to forward Awake Adversarial Model match results to a CEF collector listening on TCP port **514** at IP **192.168.0.1**:
- Navigate to the Detection Management Skills page in the Awake UI.
- Click + Add New Skill.
- Set the Expression field to,
>integrations.cef.tcp { destination: "192.168.0.1", port: 514, secure: false, severity: Warning }
- Set the Title field to a descriptive name like,
>Forward Awake Adversarial Model match result to Microsoft Sentinel.
- Set the Reference Identifier to something easily discoverable like,
>integrations.cef.sentinel-forwarder
- Click Save.

Note: Within a few minutes of saving the definition and other fields the system will begin sending new model match results to the CEF events collector as they are detected.

For more information, refer to the **Adding a Security Information and Event Management Push Integration** page from the Help Documentation in the Awake UI.

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

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/arista-networks.awake-security?tab=Overview) in the Azure Marketplace.
