---
title: "Illumio Core connector for Microsoft Sentinel"
description: "Learn how to install the connector Illumio Core to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Illumio Core connector for Microsoft Sentinel

The [Illumio Core](https://www.illumio.com/products/core) data connector provides the capability to ingest Illumio Core logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (IllumioCore)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft](https://support.microsoft.com) |

## Query samples

**Top 10 Event Types**
   ```kusto
IllumioCoreEvent
 
   | where isnotempty(EventType)
    
   | summarize count() by EventType
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-IllumioCore-parser) to create the Kusto Functions alias, **IllumioCoreEvent**

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

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}

2. Configure Ilumio Core to send logs using CEF

2.1 Configure Event Format

 1. From the PCE web console menu, choose **Settings > Event Settings** to view your current settings.

 2. Click **Edit** to change the settings.

 3. Set **Event Format** to CEF.

 4. (Optional) Configure **Event Severity** and **Retention Period**.

2.2 Configure event forwarding to an external syslog server

 1. From the PCE web console menu, choose **Settings > Event Settings**.

 2. Click **Add**.

 3. Click **Add Repository**.

 4. Complete the **Add Repository** dialog.

 5. Click **OK** to save the event forwarding configuration.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-illumiocore?tab=Overview) in the Azure Marketplace.
