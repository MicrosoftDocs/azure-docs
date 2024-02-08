---
title: Working with dates
titleSuffix: Azure Cosmos DB for NoSQL
description: Store, index, and query date and time objects as strings in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# Working with dates in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Azure Cosmos DB for NoSQL delivers schema flexibility and rich indexing via a native [JSON](https://www.json.org) data model. All Azure Cosmos DB resources including databases, containers, documents, and stored procedures are modeled and stored as JSON documents. As a requirement for being portable, JSON (and Azure Cosmos DB) supports only a small set of basic types: String, Number, Boolean, Array, Object, and Null. However, JSON is flexible and allows developers and frameworks to represent more complex types using these primitives and composing them as objects or arrays.

In addition to the basic types, many applications need the [``DateTime``](/dotnet/api/system.datetime) type to represent dates and time information. This article describes how developers can store, retrieve, and query dates in Azure Cosmos DB using the .NET SDK.

## Storing DateTimes

Azure Cosmos DB supports JSON types such as - string, number, boolean, null, array, object. It doesn't directly support a ``DateTime`` type. Currently, the API for NoSQL doesn't support localization of dates. So, you must store date and time information as strings. The recommended format for date and time strings is ``yyyy-MM-ddTHH:mm:ss.fffffffZ``, which follows the **ISO 8601** UTC standard. It's recommended to store all dates in Azure Cosmos DB as UTC. Converting the date strings to this format allow for sorting of dates lexicographically. If non-UTC dates are stored, the logic must be handled at the client-side. To convert a local date and time value to UTC, the offset must be known/stored as a property in the JSON and the client can use the offset to compute the UTC date and time value.

Range queries with date and time strings as filters are only supported if the date and time strings are all in UTC. The [GetCurrentDateTime](getcurrentdatetime.md) system function returns the current UTC date and time ISO 8601 string value in the format: ``yyyy-MM-ddTHH:mm:ss.fffffffZ``.

Most applications can use the default string representation for ``DateTime`` for the following reasons:

- Strings can be compared, and the relative ordering of the DateTime values is preserved when they're transformed to strings.
- This approach doesn't require any custom code or attributes for JSON conversion.
- The dates as stored in JSON are human readable.
- This approach can take advantage of the index for fast query performance.

For example, the following snippet stores an `Order` object containing two ``DateTime`` properties - `ShipDate` and `OrderDate` as a document using the .NET SDK:

```csharp
public class Order
{
    [JsonProperty(PropertyName="id")]
    public string Id { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime ShipDate { get; set; }
    public double Total { get; set; }
}

await container.CreateItemAsync(
    new Order
    {
        Id = "09152014101",
        OrderDate = DateTime.UtcNow.AddDays(-30),
        ShipDate = DateTime.UtcNow.AddDays(-14),
        Total = 113.39
    });
```

This document is stored in the following structure:

```json
{
  "id": "09152014101",
  "OrderDate": "2014-09-15T23:14:25.7251173Z",
  "ShipDate": "2014-09-30T23:14:25.7251173Z",
  "Total": 113.39
}
```  

Alternatively, you can store DateTimes as Unix timestamps, that is, as a number representing the number of elapsed seconds since **January 1, 1970**. Azure Cosmos DB for NoSQL's internal timestamp (`_ts`) property follows this approach. You can use the [``UnixDateTimeConverter``](/dotnet/api/microsoft.azure.documents.unixdatetimeconverter) class to serialize dates and times as numbers.

## Querying date and time in LINQ

The .NET SDK automatically supports querying data stored using Language Integrated Query (LINQ). For example, the following snippet shows a LINQ query that filters orders that were shipped in the last three days:

```csharp
IQueryable<Order> orders = container
    .GetItemLinqQueryable<Order>(allowSynchronousQueryExecution: true)
    .Where(o => o.ShipDate >= DateTime.UtcNow.AddDays(-3));
```

The LINQ query is translated to the following SQL statement and executed on Azure Cosmos DB:

```sql
SELECT
    *
FROM
    root
WHERE
    (root["ShipDate"] >= "2014-09-30T23:14:25.7251173Z")
```

For more information about the query language and the LINQ provider, see [LINQ to SQL translation](linq-to-sql.md).

## Indexing date and time for range queries

Queries are common with ``DateTime`` values. To execute these queries efficiently, you must have an index defined on any properties in the query's filter.

For more information about how to configure indexing policies, see [indexing policies](../../index-policy.md).

## Related content

- [Manage indexing policies](../how-to-manage-indexing-policy.md)
- [Model document data](../../modeling-data.md)
