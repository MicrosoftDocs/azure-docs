---
title: How to query table data in Azure Cosmos DB? | Microsoft Docs
description: Learn to query table data in Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid:
ms.service: cosmosdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/01/2017
ms.author: mimig

---

# Azure Cosmos DB: How to query with the Table API?

The Azure Cosmos DB Table API supports [OData](https://docs.microsoft.com/rest/api/storageservices/fileservices/querying-tables-and-entities) and [LINQ](ttps://docs.microsoft.com/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service) queries. This article provides sample documents and queries to get you started. 

The queries in this article use the following sample table.

**Sample table**

![Table showing sample data](./media/tutorial-query-table/cosmosdb-query-table.png)

## Example query 1
Given the sample family table above, the following OData query returns the documents, where RowKey matches WakefieldFamily and PartitionKey matches NY. Here,

Families = Name of the Table

Families = CloudTable object

**Query**

```csharp
CloudStorageAccount account = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageConnectionString"]);
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable families = tableClient.GetTableReference("Families");
TableQuery<Family> query = new TableQuery<UserProfile>().Where(TableQuery.CombineFilters(TableQuery.GenerateFilterCondition(PartitionKey, QueryComparisons.Equal, "NY"),
TableOperators.And,
TableQuery.GenerateFilterCondition(RowKey, QueryComparisons.Equal,"WakefieldFamily")));
await families.ExecuteQuerySegmentedAsync<Family>(query, null);
```
**Results**

![Table showing sample data](./media/tutorial-query-table/cosmosdb-query-table.png)


## Example query 2
Given the sample family table above, the following OData query returns the entities, where county matches Manhattan and PartitionKey matches NY. In this example, you are querying based on PartitionKey and other property. Since, Azure Cosmos DB indexes all the property, below query does not require the whole table to be scanned. Azure Table does not have secondary indexes. So, query on other properties is faster with Azure Cosmos DB Table API. Here,

Families = Name of the Table

Families = CloudTable object

**Query**

```csharp
CloudStorageAccount account = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageConnectionString"]);
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable families = tableClient.GetTableReference("Families");
TableQuery<Family> query = new TableQuery<UserProfile>().Where(TableQuery.CombineFilters(TableQuery.GenerateFilterCondition(PartitionKey, QueryComparisons.Equal, "NY"),
TableOperators.And,
TableQuery.GenerateFilterCondition(county, QueryComparisons.Equal,"Manhattan")));
await families.ExecuteQuerySegmentedAsync<Family>(query, null);
```

**Results**

![Table showing sample data](./media/tutorial-query-table/cosmosdb-query-table.png)

## Example query 3
Given the sample family table above, the following LINQ query returns the documents, where RowKey matches WakefieldFamily and PartitionKey matches NY. Here,

Families = Name of the Table

Families = CloudTable object

**Query**
```charp
CloudStorageAccount account = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["StorageConnectionString"]);
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable families = tableClient.GetTableReference("Families");
var query = from family in families.CreateQuery<Family>()
                        where family.PartitionKey == "NY" && family.RowKey == "WakefieldFamily"
                        select family;
await families.ExecuteQuerySegmentedAsync<Family>(query.AsTableQuery(), null);
```
**Results**

![Table showing query results](./media/tutorial-query-table/cosmosdb-query-table.png)

## Next steps

For more information about the Table API, see [What is Azure Cosmos DB: Table API?](table-introduction.md)
