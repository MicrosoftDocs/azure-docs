---
title: "JBoss Enterprise Application Platform connector for Microsoft Sentinel"
description: "Learn how to install the connector JBoss Enterprise Application Platform to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# JBoss Enterprise Application Platform connector for Microsoft Sentinel

The JBoss Enterprise Application Platform data connector provides the capability to ingest [JBoss](https://www.redhat.com/en/technologies/jboss-middleware/application-platform) events into Microsoft Sentinel. Refer to [Red Hat documentation](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/configuration_guide/logging_with_jboss_eap) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | JBossLogs_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Processes**
   ```kusto
JBossEvent
            
   | summarize count() by ActingProcessName 
            
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**JBossEvent**](https://aka.ms/sentinel-jbosseap-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using JBoss Enterprise Application Platform 7.4.0.

1. Install and onboard the agent for Linux or Windows

Install the agent on the JBoss server where the logs are generated.

>  Logs from JBoss Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.
    




2. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. Click **+Add custom**
3. Click **Browse** to upload a sample of a JBoss log file (e.g. server.log). Then, click **Next >**
4. Select **Timestamp** as the record delimiter and select Timestamp format **YYYY-MM-DD HH:MM:SS** from the dropdown list then click **Next >**
5. Select **Windows** or **Linux** and enter the path to JBoss logs based on your configuration. Example:
 - **Linux** Directory:

>Standalone server: EAP_HOME/standalone/log/server.log

>Managed domain: EAP_HOME/domain/servers/SERVER_NAME/log/server.log

6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **JBossLogs** as the custom log Name and click **Done**

3. Check logs in Microsoft Sentinel

Open Log Analytics to check if the logs are received using the JBossLogs_CL Custom log table.

>**NOTE:** It may take up to 30 minutes before new logs will appear in JBossLogs_CL table.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-jboss?tab=Overview) in the Azure Marketplace.
