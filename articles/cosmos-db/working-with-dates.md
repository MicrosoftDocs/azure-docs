---
title: Working with dates in Azure Cosmos DB
description: Learn how to store, index, and query DataTime objects in Azure Cosmos DB
ms.service: cosmos-db
author: SnehaGunda
ms.author: sngun
ms.topic: conceptual
ms.date: 04/03/2020
---
# Working with Dates in Azure Cosmos DB

Azure Cosmos DB delivers schema flexibility and rich indexing via a native [JSON](https://www.json.org) data model. All Azure Cosmos DB resources including databases, containers, documents, and stored procedures are modeled and stored as JSON documents. As a requirement for being portable, JSON (and Azure Cosmos DB) supports only a small set of basic types: String, Number, Boolean, Array, Object, and Null. However, JSON is flexible and allow developers and frameworks to represent more complex types using these primitives and composing them as objects or arrays.

In addition to the basic types, many applications need the DateTime type to represent dates and timestamps. This article describes how developers can store, retrieve, and query dates in Azure Cosmos DB using the .NET SDK.

## Storing DateTimes

Azure Cosmos DB supports JSON types such as - string, number, boolean, null, array, object. It does not directly support a DateTime type. Currently, Azure Cosmos DB doesn't support localization of dates. So, you need to store DateTimes as strings. The recommended format for DateTime strings in Azure Cosmos DB is `yyyy-MM-ddTHH:mm:ss.fffffffZ` which follows the ISO 8601 UTC standard. It is recommended to store all dates in Azure Cosmos DB as UTC. Converting the date strings to this format will allow sorting dates lexicographically. If non-UTC dates are stored, the logic must be handled at the client-side. To convert a  local DateTime to UTC, the offset must be known/stored as a property in the JSON and the client can use the offset to compute the UTC DateTime value.

Range queries with DateTime strings as filters are only supported if the DateTime strings are all in UTC and the same length. In Azure Cosmos DB, the [GetCurrentDateTime](sql-query-getcurrentdatetime.md) system function will return the current UTC date and time ISO 8601 string value in the format: `yyyy-MM-ddTHH:mm:ss.fffffffZ`.

Most applications can use the default string representation for DateTime for the following reasons:

* Strings can be compared, and the relative ordering of the DateTime values is preserved when they are transformed to strings.
* This approach doesn't require any custom code or attributes for JSON conversion.
* The dates as stored in JSON are human readable.
* This approach can take advantage of Azure Cosmos DB's index for fast query performance.

For example, the following snippet stores an `Order` object containing two DateTime properties - `ShipDate` and `OrderDate` as a document using the .NET SDK:

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

This document is stored in Azure Cosmos DB as follows:

```json
    {
        "id": "09152014101",
        "OrderDate": "2014-09-15T23:14:25.7251173Z",
        "ShipDate": "2014-09-30T23:14:25.7251173Z",
        "Total": 113.39
    }
```  

Alternatively, you can store DateTimes as Unix timestamps, that is, as a number representing the number of elapsed seconds since January 1, 1970. Azure Cosmos DB's internal Timestamp (`_ts`) property follows this approach. You can use the [UnixDateTimeConverter](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.unixdatetimeconverter.aspx) class to serialize DateTimes as numbers.

## Querying DateTimes in LINQ

The SQL .NET SDK automatically supports querying data stored in Azure Cosmos DB via LINQ. For example, the following snippet shows a LINQ query that filters orders that were shipped in the last three days:

```csharp
    IQueryable<Order> orders = container.GetItemLinqQueryable<Order>(allowSynchronousQueryExecution: true).Where(o => o.ShipDate >= DateTime.UtcNow.AddDays(-3));
```

Translated to the following SQL statement and executed on Azure Cosmos DB:

```sql
    SELECT * FROM root WHERE (root["ShipDate"] >= "2014-09-30T23:14:25.7251173Z")
```

You can learn more about Azure Cosmos DB's SQL query language and the LINQ provider at [Querying Cosmos DB in LINQ](sql-query-linq-to-sql.md).

## Indexing DateTimes for range queries

Queries are common with DateTime values. To execute these queries efficiently, you must have an index defined on any properties in the query's filter.

You can learn more about how to configure indexing policies at [Azure Cosmos DB Indexing Policies](index-policy.md). 

## Next Steps

* Download and run the [Code samples on GitHub](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples)
* Learn more about [SQL queries](sql-query-getting-started.md)
* Learn more about [Azure Cosmos DB Indexing Policies](index-policy.md)
