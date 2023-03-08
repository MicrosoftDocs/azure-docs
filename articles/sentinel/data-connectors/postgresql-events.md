---
title: "PostgreSQL Events connector for Microsoft Sentinel"
description: "Learn how to install the connector PostgreSQL Events to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# PostgreSQL Events connector for Microsoft Sentinel

PostgreSQL data connector provides the capability to ingest [PostgreSQL](https://www.postgresql.org/) events into Microsoft Sentinel. Refer to [PostgreSQL documentation](https://www.postgresql.org/docs/current/index.html) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | PostgreSQLEvent |
| **Kusto function url** | https://aka.ms/sentinel-postgresql-parser |
| **Log Analytics table(s)** | PostgreSQL_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**PostgreSQL errors**
   ```kusto
PostgreSQLEvent
 
   | where EventSeverity in~ ('ERROR', 'FATAL')
 
   | sort by EventEndTime
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on PostgreSQL parser based on a Kusto Function to work as expected. This parser is installed along with solution installation.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Tomcat Server where the logs are generated.

> Logs from PostgreSQL Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure PostgreSQL to write logs to files

1. Edit postgresql.conf file to write logs to files:

>**log_destination** = 'stderr'

>**logging_collector** = on

Set the following parameters: **log_directory** and **log_filename**. Refer to the [PostgreSQL documentation for more details](https://www.postgresql.org/docs/current/runtime-config-logging.html)

3. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. From the left pane, select **Settings**, select **Custom Logs** and click **+Add custom log**
3. Click **Browse** to upload a sample of a PostgreSQL log file. Then, click **Next >**
4. Select **Timestamp** as the record delimiter and click **Next >**
5. Select **Windows** or **Linux** and enter the path to PostgreSQL logs based on your configuration(e.g. for some Linux distros the default path is /var/log/postgresql/) 
6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **PostgreSQL** as the custom log Name (the '_CL' suffix will be added automatically) and click **Done**.

Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Microsoft Sentinel.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-postgresql?tab=Overview) in the Azure Marketplace.
