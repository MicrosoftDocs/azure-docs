---
title: "MarkLogic Audit connector for Microsoft Sentinel"
description: "Learn how to install the connector MarkLogic Audit to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# MarkLogic Audit connector for Microsoft Sentinel

MarkLogic data connector provides the capability to ingest [MarkLogicAudit](https://www.marklogic.com/) logs into Microsoft Sentinel. Refer to [MarkLogic documentation](https://docs.marklogic.com/guide/getting-started) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | MarkLogicAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**MarkLogicAudit - All Activities.**
   ```kusto
MarkLogicAudit_CL
 
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias SentinelOne and load the function code. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux or Windows

Install the agent on the Tomcat Server where the logs are generated.

> Logs from MarkLogic Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure MarkLogicAudit to enable auditing

Perform the following steps to enable auditing for a group:

>Access the Admin Interface with a browser;

>Open the Audit Configuration screen (Groups > group_name > Auditing);

>Select True for the Audit Enabled radio button;

>Configure any audit events and/or audit restrictions you want;

>Click OK.

 Refer to the [MarkLogic documentation for more details](https://docs.marklogic.com/guide/admin/auditing)

3. Configure the logs to be collected

Configure the custom log directory to be collected



1. Select the link above to open your workspace advanced settings 
2. From the left pane, select **Settings**, select **Custom Logs** and click **+Add custom log**
3. Click **Browse** to upload a sample of a MarkLogicAudit log file. Then, click **Next >**
4. Select **Timestamp** as the record delimiter and click **Next >**
5. Select **Windows** or **Linux** and enter the path to MarkLogicAudit logs based on your configuration 
6. After entering the path, click the '+' symbol to apply, then click **Next >** 
7. Add **MarkLogicAudit** as the custom log Name (the '_CL' suffix will be added automatically) and click **Done**.

Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Microsoft Sentinel.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-marklogicaudit?tab=Overview) in the Azure Marketplace.
