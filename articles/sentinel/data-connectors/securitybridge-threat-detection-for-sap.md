---
title: "SecurityBridge Threat Detection for SAP connector for Microsoft Sentinel"
description: "Learn how to install the connector SecurityBridge Threat Detection for SAP to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# SecurityBridge Threat Detection for SAP connector for Microsoft Sentinel

SecurityBridge is the first and only holistic, natively integrated security platform, addressing all aspects needed to protect organizations running SAP from internal and external threats against their core business applications. The SecurityBridge platform is an SAP-certified add-on, used by organizations around the globe, and addresses the clients’ need for advanced cybersecurity, real-time monitoring, compliance, code security, and patching to protect against internal and external threats.This Microsoft Sentinel Solution allows you to integrate SecurityBridge Threat Detection events from all your on-premise and cloud based SAP instances into your security monitoring.Use this Microsoft Sentinel Solution to receive normalized and speaking security events, pre-built dashboards and out-of-the-box templates for your SAP security monitoring.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SecurityBridgeLogs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Christoph Nagy](https://securitybridge.com/contact/) |

## Query samples

**Top 10 Event Names**
   ```kusto
SecurityBridgeLogs_CL 

   | extend Name = tostring(split(RawData, '
   |')[5]) 

   | summarize count() by Name 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-SecurityBridgeLogs-parser) to create the Kusto Functions alias, **SecurityBridgeLogs**


> [!NOTE]
   >  This data connector has been developed using SecurityBridge Application Platform 7.4.0.

1. Install and onboard the agent for Linux or Windows

This solution requires logs collection via an Microsoft Sentinel agent installation

>  The Sentinel agent is supported on the following Operating Systems:  
1. Windows Servers 
2. SUSE Linux Enterprise Server
3. Redhat Linux Enterprise Server
4. Oracle Linux Enterprise Server
5. If you have the SAP solution installed on HPUX / AIX then you will need to deploy a log collector on one of the Linux options listed above and forward your logs to that collector






2. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. Click **+Add custom**
3. Click **Browse** to upload a sample of a SecurityBridge SAP log file (e.g. AED_20211129164544.cef). Then, click **Next >**
4. Select **New Line** as the record delimiter then click **Next >**
5. Select **Windows** or **Linux** and enter the path to SecurityBridge logs based on your configuration. Example:
 - '/usr/sap/tmp/sb_events/*.cef' 

>**NOTE:** You can add as many paths as you want in the configuration.

6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **SecurityBridgeLogs** as the custom log Name and click **Done**

3. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the SecurityBridgeLogs_CL Custom log table.

>**NOTE:** It may take up to 30 minutes before new logs will appear in SecurityBridgeLogs_CL table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/securitybridge1647511278080.securitybridge-sentinel-app-1?tab=Overview) in the Azure Marketplace.
