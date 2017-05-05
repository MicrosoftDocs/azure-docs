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

The Azure Cosmos DB Table API supports [OData](https://docs.microsoft.com/rest/api/storageservices/fileservices/querying-tables-and-entities) and [LINQ](https://docs.microsoft.com/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service) queries against key/value (table) data. This article provides sample documents and queries to get you started. 

The queries in this article use the following sample table.

**Sample table**

![Table showing sample data](./media/tutorial-query-table/cosmosdb-query-table.png)

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have graph data in the collection. Dont' have any of those? Complete the [5-minute quickstart](https://aka.ms/acdbtnetqs) or the [developer tutorial](tutorial-query-table.md) to create an account and populate your database.

## Example query 1
Given the sample family table above, the following OData query returns the documents, where RowKey matches WakefieldFamily and PartitionKey matches NY.

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
Given the sample family table above, the following OData query returns the entities, where county matches Manhattan and PartitionKey matches NY. In this example, you are querying based on PartitionKey and other property. Since, Azure Cosmos DB indexes all the property, below query does not require the whole table to be scanned. Azure Table does not have secondary indexes. So, query on other properties is faster with Azure Cosmos DB Table API.

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
Given the sample family table above, the following LINQ query returns the documents, where RowKey matches WakefieldFamily and PartitionKey matches NY.

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

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this quickstart in the Azure portal. If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this tutorial, you've learned how to query graph data using the Table API. You can now distribute data globally using the portal or install the Local emulator for local development.  

[Distribute your data globally](../documentdb/documentdb-portal-global-replication.md)

[Develop locally](../documentdb/documentdb-nosql-local-emulator.md)
