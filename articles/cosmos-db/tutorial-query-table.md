---
title: How to query table data in Azure Cosmos DB? 
description: Learn to query table data in Azure Cosmos DB
author: wmengmsft
ms.author: wmeng
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: tutorial
ms.date: 05/21/2019
ms.reviewer: sngun
---

# Tutorial: Query Azure Cosmos DB by using the Table API

The Azure Cosmos DB [Table API](table-introduction.md) supports OData and [LINQ](https://docs.microsoft.com/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service) queries against key/value (table) data.  

This article covers the following tasks: 

> [!div class="checklist"]
> * Querying data with the Table API

The queries in this article use the following sample `People` table:

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Harp | Walter | Walter@contoso.com| 425-555-0101 |
| Smith | Ben | Ben@contoso.com| 425-555-0102 |
| Smith | Jeff | Jeff@contoso.com| 425-555-0104 | 

See [Querying Tables and Entities](https://docs.microsoft.com/rest/api/storageservices/fileservices/querying-tables-and-entities) for details on how to query by using the Table API. 

For more information on the premium capabilities that Azure Cosmos DB offers, see [Azure Cosmos DB Table API](table-introduction.md) and [Develop with the Table API in .NET](tutorial-develop-table-dotnet.md). 

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have entity data in the container. Don't have any of those? Complete the [five-minute quickstart](create-table-dotnet.md) or the [developer tutorial](tutorial-develop-table-dotnet.md) to create an account and populate your database.

## Query on PartitionKey and RowKey
Because the PartitionKey and RowKey properties form an entity's primary key, you can use the following special syntax to identify the entity: 

**Query**

```
https://<mytableendpoint>/People(PartitionKey='Harp',RowKey='Walter')  
```
**Results**

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Harp | Walter | Walter@contoso.com| 425-555-0104 |

Alternatively, you can specify these properties as part of the `$filter` option, as shown in the following section. Note that the key property names and constant values are case-sensitive. Both the PartitionKey and RowKey properties are of type String. 

## Query by using an OData filter
When you're constructing a filter string, keep these rules in mind: 

* Use the logical operators defined by the OData Protocol Specification to compare a property to a value. Note that you can't compare a property to a dynamic value. One side of the expression must be a constant. 
* The property name, operator, and constant value must be separated by URL-encoded spaces. A space is URL-encoded as `%20`. 
* All parts of the filter string are case-sensitive. 
* The constant value must be of the same data type as the property in order for the filter to return valid results. For more information about supported property types, see [Understanding the Table Service Data Model](https://docs.microsoft.com/rest/api/storageservices/understanding-the-table-service-data-model). 

Here's an example query that shows how to filter by the PartitionKey and Email properties by using an OData `$filter`.

**Query**

```
https://<mytableapi-endpoint>/People()?$filter=PartitionKey%20eq%20'Smith'%20and%20Email%20eq%20'Ben@contoso.com'
```

For more information on how to construct filter expressions for various data types, see [Querying Tables and Entities](https://docs.microsoft.com/rest/api/storageservices/querying-tables-and-entities).

**Results**

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Smith |Ben | Ben@contoso.com| 425-555-0102 |

## Query by using LINQ 
You can also query by using LINQ, which translates to the corresponding OData query expressions. Here's an example of how to build queries by using the .NET SDK:

```csharp
CloudTableClient tableClient = account.CreateCloudTableClient();
CloudTable table = tableClient.GetTableReference("People");

TableQuery<CustomerEntity> query = new TableQuery<CustomerEntity>()
    .Where(
        TableQuery.CombineFilters(
            TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "Smith"),
            TableOperators.And,
            TableQuery.GenerateFilterCondition("Email", QueryComparisons.Equal,"Ben@contoso.com")
    ));

await table.ExecuteQuerySegmentedAsync<CustomerEntity>(query, null);
```

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Learned how to query by using the Table API

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](tutorial-global-distribution-table.md)
