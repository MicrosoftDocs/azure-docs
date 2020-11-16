---
title: Azure Synapse Analytics output from Azure Stream Analytics
description: This article describes Azure Synapse Analytics as output for Azure Stream Analytics.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Azure Synapse Analytics output from Azure Stream Analytics

[Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics) (formerly SQL Data Warehouse) is a limitless analytics service that brings together enterprise data warehousing and Big Data analytics. 

Azure Stream Analytics jobs can output to a dedicated SQL pool table in Azure Synapse Analytics and can process throughput rates up to 200MB/sec. This supports the most demanding real-time analytics and hot-path data processing needs for workloads such as reporting and dashboarding.  

The dedicated SQL pool table must exist before you can add it as output to your Stream Analytics job. The table's schema must match the fields and their types in your job's output. 

To use Azure Synapse as output, you need to ensure that you have the storage account configured. Navigate to Storage account settings to configure the storage account. Only the storage account types that support tables are permitted: General-purpose V2 and General-purpose V1. Select Standard Tier only. Premium tier is not supported.

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

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)