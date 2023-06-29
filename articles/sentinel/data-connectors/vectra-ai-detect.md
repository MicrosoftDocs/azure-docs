---
title: "Vectra AI Detect connector for Microsoft Sentinel"
description: "Learn how to install the connector Vectra AI Detect to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Vectra AI Detect connector for Microsoft Sentinel

The AI Vectra Detect connector allows users to connect Vectra Detect logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives users more insight into their organization's network and improves their security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (AIVectraDetect)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Vectra AI](https://www.vectra.ai/support) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Vectra Networks"

   | where DeviceProduct  == "X Series"

   | sort by TimeGenerated 

   ```

**Host Count by Severity**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Vectra Networks" and DeviceEventClassID == "hsc"

   | extend src = coalesce(SourceHostName, SourceIP)

   | summarize arg_max(TimeGenerated, *) by src

   | extend status = case(FlexNumber1>=50 and FlexNumber2<50, "High",  FlexNumber1>=50 and FlexNumber2>=50, "Critical",  FlexNumber1<50 and FlexNumber2>=50, "Medium",  FlexNumber1>0 and FlexNumber1<50 and FlexNumber2>0 and FlexNumber2<50,"Low",  "Other")

   | where status != "Other"

   | summarize Count = count() by status
   ```

**List of worst offenders**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Vectra Networks" and DeviceEventClassID == "hsc"

   | extend src = coalesce(SourceHostName, SourceIP)

   | summarize arg_max(TimeGenerated, *) by src

   | sort by FlexNumber1 desc, FlexNumber2 desc

   | limit 10

   | project row_number(), src, SourceIP, FlexNumber1 , FlexNumber2, TimeGenerated

   | project-rename Sr_No = Column1, Source = src, Source_IP = SourceIP, Threat = FlexNumber1, Certainty = FlexNumber2, Latest_Detection = TimeGenerated
   ```

**Top 10 Detection Types**
   ```kusto
CommonSecurityLog 
   | extend ExternalID = coalesce(column_ifexists("ExtID", ""), tostring(ExternalID), "") 
   | where DeviceVendor == "Vectra Networks" and DeviceEventClassID !in ("health", "audit", "campaigns", "hsc", "asc") and isnotnull(ExternalID) 
   | summarize Count = count() by DeviceEventClassID 
   | top 10 by Count desc
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 over TCP, UDP or TLS.

> 1. Make sure that you have Python on your machine using the following command: python --version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward AI Vectra Detect logs to Syslog agent in CEF format

Configure Vectra (X Series) Agent to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

From the Vectra UI, navigate to Settings > Notifications and Edit Syslog configuration. Follow below instructions to set up the connection:

- Add a new Destination (which is the host where the Microsoft Sentinel Syslog Agent is running)

- Set the Port as **514**

- Set the Protocol as **UDP**

- Set the format to **CEF**

- Set Log types (Select all log types available)

- Click on **Save**

User can click the **Test** button to force send some test events.

 For more information, refer to Cognito Detect Syslog Guide which can be downloaded from the ressource page in Detect UI.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python --version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/vectraaiinc.ai_vectra_detect_mss?tab=Overview) in the Azure Marketplace.
