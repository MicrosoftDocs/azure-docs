---
title: "Citrix ADC (former NetScaler) connector for Microsoft Sentinel"
description: "Learn how to install the connector Citrix ADC (former NetScaler) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Citrix ADC (former NetScaler) connector for Microsoft Sentinel

The [Citrix ADC (former NetScaler)](https://www.citrix.com/products/citrix-adc/) data connector provides the capability to ingest Citrix ADC logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Citrix ADC)<br/> |
| **Data collection rules support** | [Workspace transform DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Event Types**
   ```kusto
CitrixADCEvent
 
   | where isnotempty(EventType)
    
   | summarize count() by EventType
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-CitrixADC-parser) to create the Kusto Functions alias, **CitrixADCEvent**

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

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py python cef_installer.py {0} {1}

2. Configure Citrix ADC to use CEF logging

At the command prompt type the following command: 

>**set appfw settings CEFLogging on**

3. Configure Citrix ADC to forward logs via Syslog

3.1 Navigate to **Configuration tab > System > Auditing > Syslog > Servers tab**

 3.2 Specify **Syslog action name**.

 3.3 Set IP address of remote Syslog server and port.

 3.4 Set **Transport type** as **TCP** or **UDP** depending on your remote Syslog server configuration.

4. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py python cef_troubleshoot.py  {0}

5. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-citrixadc?tab=Overview) in the Azure Marketplace.
