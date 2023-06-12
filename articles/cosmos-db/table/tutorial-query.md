---
title: 'Tutorial: Query Azure Cosmos DB by using the API for Table'
description: Learn how to query data stored in the Azure Cosmos DB for Table account by using OData filters and LINQ queries.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.topic: tutorial
ms.date: 03/14/2023
ms.reviewer: mjbrown
ms.devlang: csharp
ms.custom: devx-track-csharp, ignite-2022
---

# Tutorial: Query Azure Cosmos DB by using the API for Table

[!INCLUDE[Table](../includes/appliesto-table.md)]

The [Azure Cosmos DB for Table](introduction.md) supports OData and [LINQ](/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service) queries against key/value (table) data.

This article covers the following tasks:

> [!div class="checklist"]
> * Querying data with the API for Table

The queries in this article use the following sample `People` table:

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Harp | Walter | Walter@contoso.com| 425-555-0101 |
| Smith | Ben | Ben@contoso.com| 425-555-0102 |
| Smith | Jeff | Jeff@contoso.com| 425-555-0104 |

For details on how to query by using the API for Table, see [Querying tables and entities](/rest/api/storageservices/fileservices/querying-tables-and-entities).

## Prerequisites

For these queries to work, you must have an Azure Cosmos DB account and have entity data in the container. If you don't have an account or data, complete [Quickstart: Azure Cosmos DB for Table for .NET](quickstart-dotnet.md) to create an account and populate your database.

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

Alternatively, you can specify these properties as part of the `$filter` option, as shown in the following section. The key property names and constant values are case-sensitive. Both the PartitionKey and RowKey properties are of the type String.

## Query by using an OData filter

When you're constructing a filter string, keep these rules in mind:

* Use the logical operators defined by the OData Protocol Specification to compare a property to a value. You can't compare a property to a dynamic value. One side of the expression must be a constant.
* URL-encoded spaces must separate the property name, operator, and constant value. A space is URL-encoded as `%20`.
* All parts of the filter string are case-sensitive.
* The constant value must be of the same data type as the property in order for the filter to return valid results. For more information about supported property types, see [Understanding the Table service data model](/rest/api/storageservices/understanding-the-table-service-data-model).

Here's an example query that shows how to filter by the PartitionKey and Email properties by using an OData `$filter`.

**Query**

```
https://<mytableapi-endpoint>/People()?$filter=PartitionKey%20eq%20'Smith'%20and%20Email%20eq%20'Ben@contoso.com'
```

For more information on how to construct filter expressions for various data types, see [Querying Tables and Entities](/rest/api/storageservices/querying-tables-and-entities).

**Results**

| PartitionKey | RowKey | Email | PhoneNumber |
| --- | --- | --- | --- |
| Smith |Ben | Ben@contoso.com| 425-555-0102 |

The queries on datetime properties don't return any data when executed in Azure Cosmos DB's API for Table. While the Azure Table storage stores date values with time granularity of ticks, the API for Table in Azure Cosmos DB uses the `_ts` property. The `_ts` property is at a second level of granularity, which isn't an OData filter. Azure Cosmos DB blocks the queries on timestamp properties. As a workaround, you can define a custom datetime or long data type property and set the date value from the client.

## Query by using LINQ

You can also query by using LINQ, which translates to the corresponding OData query expressions. Here's an example of how to build queries by using the .NET SDK:

```csharp
IQueryable<CustomerEntity> linqQuery = table.CreateQuery<CustomerEntity>()
            .Where(x => x.PartitionKey == "4")
            .Select(x => new CustomerEntity() { PartitionKey = x.PartitionKey, RowKey = x.RowKey, Email = x.Email });
```

## Next steps

You can now proceed to the next tutorial to learn how to distribute your data globally.

* [Set up Azure Cosmos DB global distribution using the API for Table](tutorial-global-distribution.md)
