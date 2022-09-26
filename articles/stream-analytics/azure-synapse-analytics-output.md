---
title: Azure Synapse Analytics output from Azure Stream Analytics
description: This article describes Azure Synapse Analytics as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Azure Synapse Analytics output from Azure Stream Analytics

[Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics) is a limitless analytics service that brings together enterprise data warehousing and Big Data analytics. 

Azure Stream Analytics jobs can output to a dedicated SQL pool table in Azure Synapse Analytics and can process throughput rates up to 200MB/sec. This supports the most demanding real-time analytics and hot-path data processing needs for workloads such as reporting and dashboarding.  

The dedicated SQL pool table must exist before you can add it as output to your Stream Analytics job. The table's schema must match the fields and their types in your job's output. 

> [!NOTE] 
> To use Azure Synapse Analytics as output, ensure that the storage account is configured at the job level, not at the output level. To change the storage account settings, in the **Configure** menu of the Stream Analytics job, go to **Storage account settings**. Use only storage account types that support tables: General Purpose V2 and General Purpose V1. Choose only Standard tier. Premium tier isn't supported in this scenario.

## Output configuration

The following table lists the property names and their descriptions for creating am Azure Synapse Analytics output.

|Property name|Description|
|-|-|
|Output alias |A friendly name used in queries to direct the query output to this database. |
|Database |dedicated SQL pool name where you're sending your output. |
|Server name |Azure Synapse server name.  |
|Username |The username that has write access to the database. Stream Analytics supports only SQL authentication. |
|Password |The password to connect to the database. |
|Table  | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates.|

## Next steps

* [Use managed identities to access Azure SQL Database or Azure Synapse Analytics from an Azure Stream Analytics job (Preview)](sql-database-output-managed-identity.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
