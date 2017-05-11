---
title: How to query table data in Azure Cosmos DB? | Microsoft Docs
description: Learn to query table data in Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: kanshiG
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 14bcb94e-583c-46f7-9ea8-db010eb2ab43
ms.service: cosmosdb
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/10/2017
ms.author: govindk

---

# Azure Cosmos DB: How to query with the Table API (preview)?

The Azure Cosmos DB [Table API](table-introduction.md) (preview) supports OData and [LINQ](https://docs.microsoft.com/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service) queries against key/value (table) data.  

This article covers the following tasks: 

> [!div class="checklist"]
> * Querying data with the Table API

## Sample table

The queries in this article use the following sample `People` table:

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Harp | Walter | Walter@contoso.com| 425-555-0101 |
| Smith | Walter | Ben@contoso.com| 425-555-0102 |
| Smith | Jeff | Jeff@contoso.com| 425-555-0104 | 

## About the Table API (preview)

Since Azure Cosmos DB is compatible with the Azure Table storage APIs, see [Querying Tables and Entities] (https://docs.microsoft.com/rest/api/storageservices/fileservices/querying-tables-and-entities) for details on how to query with the Table API. 

For more information on the premium capabilities offered by Azure Cosmos DB, see [Azure Cosmos DB: Table API](table-introduction.md) and [Develop with the Table API using .NET](tutorial-develop-table-dotnet.md). 

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have entity data in the container. Don't have any of those? Complete the [5-minute quickstart](https://aka.ms/acdbtnetqs) or the [developer tutorial](https://aka.ms/acdbtabletut) to create an account and populate your database.

## Querying on partition key and row key
Because the PartitionKey and RowKey properties form an entity's primary key, you can use a special syntax to identify the entity, as follows: 

**Query**

```
https://<mytableendpoint>/People(PartitionKey='Harp',RowKey='Walter')  
```
**Results**

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Harp | Walter | Walter@contoso.com| 425-555-0104 |

Alternatively, you can specify these properties as part of the `$filter` option, as shown in the following section. Note that the key property names and constant values are case-sensitive. Both the PartitionKey and RowKey properties are of type String. 

## Querying with an ODATA filter
When constructing a filter string, keep these rules in mind: 

* Use the logical operators defined by the OData Protocol Specification to compare a property to a value. Note that it is not possible to compare a property to a dynamic value; one side of the expression must be a constant. 
* The property name, operator, and constant value must be separated by URL-encoded spaces. A space is URL-encoded as `%20`. 
* All parts of the filter string are case-sensitive. 
* The constant value must be of the same data type as the property in order for the filter to return valid results. For more information about supported property types, see [Understanding the Table Service Data Model](https://docs.microsoft.com/rest/api/storageservices/understanding-the-table-service-data-model). 

Here's an example query that shows how to filter by PartitionKey, and the Email property using an ODATA `$filter`.

**Query**

```
https://<mytableapi-endpoint>/People()?$filter=PartitionKey%20eq%20'Smith'%20and%20Email%20eq%20'Ben@contoso.com'
```

More details on how to construct filter expressions for various data types are available at [Querying Tables and Entities](https://docs.microsoft.com/rest/api/storageservices/querying-tables-and-entities)

**Results**

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Ben |Smith | Ben@contoso.com| 425-555-0102 |

## Querying with LINQ 
You can also query using LINQ, which translates to the corresponding ODATA query expressions. Here's an example of how to build queries using the .NET SDK.

```csharp
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable table = tableClient.GetTableReference("people");

TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>()
    .Where(
        TableQuery.CombineFilters(
            TableQuery.GenerateFilterCondition(PartitionKey, QueryComparisons.Equal, "Smith"),
            TableOperators.And,
            TableQuery.GenerateFilterCondition(Email, QueryComparisons.Equal,"Ben@contoso.com")
    ));

await table.ExecuteQuerySegmentedAsync<CustomerEntity>(query, null);
```

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Learned how to query using the Table API (preview) 

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](tutorial-global-distribution-documentdb.md)
