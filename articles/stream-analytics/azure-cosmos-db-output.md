---
title: Azure Cosmos DB output from Azure Stream Analytics
description: This article describes how to output data from Azure Stream Analytics to Azure Cosmos DB.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 12/13/2021
---

# Azure Cosmos DB output from Azure Stream Analytics

[Azure Cosmos DB](https://azure.microsoft.com/services/documentdb/) is a globally distributed database service that offers limitless elastic scale around the globe, rich query, and automatic indexing over schema-agnostic data models. To learn about Azure Cosmos DB container options for Stream Analytics, see the [Stream Analytics with Azure Cosmos DB as output](stream-analytics-documentdb-output.md) article.

Azure Cosmos DB output from Stream Analytics is currently not available in Microsoft Azure operated by 21Vianet and Azure Germany (T-Systems International).

> [!Note]
> Azure Stream Analytics only supports connection to Azure Cosmos DB by using the SQL API.
> Other Azure Cosmos DB APIs are not yet supported. If you point Azure Stream Analytics to the Azure Cosmos DB accounts created with other APIs, the data might not be properly stored.

The following table describes the properties for creating an Azure Cosmos DB output.

| Property name | Description |
| --- | --- |
| Output alias | An alias to refer this output in your Stream Analytics query. |
| Sink | Azure Cosmos DB. |
| Import option | Choose either **Select Azure Cosmos DB from your subscription** or **Provide Azure Cosmos DB settings manually**.
| Account ID | The name or endpoint URI of the Azure Cosmos DB account. |
| Account key | The shared access key for the Azure Cosmos DB account. |
| Database | The Azure Cosmos DB database name. |
| Container name | The container name to be used, which must exist in Azure Cosmos DB. Example: <br /><ul><li> _MyContainer_: A container named "MyContainer" must exist.</li>|
| Document ID |Optional. The name of the field in output events that's used to specify the primary key on which insert or update operations are based.


> [!Note]
> Azure Cosmos DB Output for Azure Stream Analytics uses .NET V3 SDK. When writing to multiple regions, the SDK automatically picks the best region available.  
  
## Partitioning

The partition key is based on the PARTITION BY clause in the query. The number of output writers follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md). Stream Analytics converts the Azure Cosmos DB output partition key to a string. For example, if you have a partition key with a value of 1 of type bigint, it is converted to "1" of type string. This conversion always happens regardless of whether the partition property is written to Azure Cosmos DB.

## Output batch size

For the maximum message size, see [Azure Cosmos DB limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-cosmos-db-limits). Batch size and write frequency are adjusted dynamically based on Azure Cosmos DB responses. There are no predetermined limitations from Stream Analytics.

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)
