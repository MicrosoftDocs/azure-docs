---
title: "MongoDB Audit connector for Microsoft Sentinel"
description: "Learn how to install the connector MongoDB Audit to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# MongoDB Audit connector for Microsoft Sentinel

MongoDB data connector provides the capability to ingest [MongoDBAudit](https://www.mongodb.com/) into Microsoft Sentinel. Refer to [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/getting-started/) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | MongoDBAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**MongoDBAudit - All Activities.**
   ```kusto
MongoDBAudit
 
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias MongoDBAudit and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/MongoDBAudit/Parsers/MongoDBAudit.txt) on the second line of the query, enter the hostname(s) of your MongoDBAudit device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Tomcat Server where the logs are generated.

> Logs from MongoDB Enterprise Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure MongoDBAudit to write logs to files

Edit mongod.conf file (for Linux) or mongod.cfg (for Windows) to write logs to files:

>**dbPath**: data/db

>**path**: data/db/auditLog.json

Set the following parameters: **dbPath** and **path**. Refer to the [MongoDB documentation for more details](https://www.mongodb.com/docs/manual/tutorial/configure-auditing/)

3. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. From the left pane, select **Settings**, select **Custom Logs** and click **+Add custom log**
3. Click **Browse** to upload a sample of a MongoDBAudit log file. Then, click **Next >**
4. Select **Timestamp** as the record delimiter and click **Next >**
5. Select **Windows** or **Linux** and enter the path to MongoDBAudit logs based on your configuration 
6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **MongoDBAudit** as the custom log Name (the '_CL' suffix will be added automatically) and click **Done**.

Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Microsoft Sentinel.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-mongodbaudit?tab=Overview) in the Azure Marketplace.
