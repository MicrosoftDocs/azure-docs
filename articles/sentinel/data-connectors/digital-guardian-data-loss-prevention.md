---
title: "Digital Guardian Data Loss Prevention connector for Microsoft Sentinel"
description: "Learn how to install the connector Digital Guardian Data Loss Prevention to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Digital Guardian Data Loss Prevention connector for Microsoft Sentinel

[Digital Guardian Data Loss Prevention (DLP)](https://digitalguardian.com/platform-overview) data connector provides the capability to ingest Digital Guardian DLP logs into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (DigitalGuardianDLPEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Clients (Source IP)**
   ```kusto
DigitalGuardianDLPEvent
 
   | where notempty(SrcIpAddr)
 
   | summarize count() by SrcIpAddr
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**DigitalGuardianDLPEvent**](https://aka.ms/sentinel-DigitalGuardianDLP-parser) which is deployed with the Microsoft Sentinel Solution.

1. Configure Digital Guardian to forward logs via Syslog to remote server where you will install the agent.

Follow these steps to configure Digital Guardian to forward logs via Syslog:

1.1. Log in to the Digital Guardian Management Console.

1.2. Select **Workspace** > **Data Export** > **Create Export**.

1.3. From the **Data Sources** list, select **Alerts** or **Events** as the data source.

1.4. From the **Export type** list, select **Syslog**.

1.5. From the **Type list**, select **UDP** or **TCP** as the transport protocol.

1.6. In the **Server** field, type the IP address of your Remote Syslog server.

1.7. In the **Port** field, type 514 (or other port if your Syslog server was configured to use non-default port).

1.8. From the **Severity Level** list, select a severity level.

1.9. Select the **Is Active** check box.

1.9. Click **Next**.

1.10. From the list of available fields, add Alert or Event fields for your data export.

1.11. Select a Criteria for the fields in your data export and click **Next**.

1.12. Select a group for the criteria and click **Next**.

1.13. Click **Test Query**.

1.14. Click **Next**.

1.15. Save the data export.

2. Install and onboard the agent for Linux or Windows

Install the agent on the Server to which the logs will be forwarded.

> Logs on Linux or Windows servers are collected by **Linux** or **Windows** agents.




3. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the Syslog schema.

>**NOTE:** It may take up to 15 minutes before new logs will appear in Syslog table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-digitalguardiandlp?tab=Overview) in the Azure Marketplace.
