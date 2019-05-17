---
title: Get SQL query performance & execution metrics
description: Learn how to retrieve SQL query execution metrics and profile SQL query performance of Azure Cosmos DB requests.
author: GinaRobinson
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/17/2019
ms.author: girobins

---
# Get SQL query execution metrics and analyze query performance using .NET SDK

This article presents how to profile SQL query performance on Azure Cosmos DB. This profiling can be done using `QueryMetrics` retrieved from the .NET SDK and is detailed here. [QueryMetrics](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.querymetrics.aspx) is a strongly typed object with information about the backend query execution. These metrics are documented in more detail in the [Tune Query Performance](https://docs.microsoft.com/en-us/azure/cosmos-db/documentdb-sql-query-metrics) article.

## Set the FeedOptions parameter

All the overloads for [DocumentClient.CreateDocumentQuery](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.documentclient.createdocumentquery.aspx) take in an optional [FeedOptions](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.feedoptions.aspx) parameter. This option is what allows query execution to be tuned and parameterized. 

To collect the Sql query execution metrics, you must set the parameter [PopulateQueryMetrics](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.feedoptions.populatequerymetrics.aspx#P:Microsoft.Azure.Documents.Client.FeedOptions.PopulateQueryMetrics) in the [FeedOptions](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.feedoptions.aspx) to `true`. Setting `PopulateQueryMetrics` to true will make it so that the `FeedResponse` will contain the relevant `QueryMetrics`. 

## Get query metrics with AsDocumentQuery()
The following code sample shows how to do retrieve metrics when using [AsDocumentQuery()](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.linq.documentqueryable.asdocumentquery.aspx) method:

```csharp
// Initialize this DocumentClient and Collection
DocumentClient documentClient = null;
DocumentCollection collection = null;

// Setting PopulateQueryMetrics to true in the FeedOptions
FeedOptions feedOptions = new FeedOptions
{
    PopulateQueryMetrics = true
};

string query = "SELECT TOP 5 * FROM c";
IDocumentQuery<dynamic> documentQuery = documentClient.CreateDocumentQuery(Collection.SelfLink, query, feedOptions).AsDocumentQuery();

while (documentQuery.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<dynamic> feedResponse = await documentQuery.ExecuteNextAsync();
    
    // This dictionary maps the partitionId to the QueryMetrics of that query
    IReadOnlyDictionary<string, QueryMetrics> partitionIdToQueryMetrics = feedResponse.QueryMetrics;
    
    // At this point you have QueryMetrics which you can serialize using .ToString()
    foreach (KeyValuePair<string, QueryMetrics> kvp in partitionIdToQueryMetrics)
    {
        string partitionId = kvp.Key;
        QueryMetrics queryMetrics = kvp.Value;
        
        // Do whatever logging you need
        DoSomeLoggingOfQueryMetrics(query, partitionId, queryMetrics);
    }
}
```
## Aggregating QueryMetrics

In the previous section, notice that there were multiple calls to [ExecuteNextAsync](https://msdn.microsoft.com/en-us/library/azure/dn850294.aspx) method. Each call returned a `FeedResponse` object that has a dictionary of `QueryMetrics`; one for every continuation of the query. The following example shows how to aggregate these `QueryMetrics` using LINQ:

```csharp
List<QueryMetrics> queryMetricsList = new List<QueryMetrics>();

while (documentQuery.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<dynamic> feedResponse = await documentQuery.ExecuteNextAsync();
    
    // This dictionary maps the partitionId to the QueryMetrics of that query
    IReadOnlyDictionary<string, QueryMetrics> partitionIdToQueryMetrics = feedResponse.QueryMetrics;
    queryMetricsList.AddRange(partitionIdToQueryMetrics.Values);
}

// Aggregate the QueryMetrics using the + operator overload of the QueryMetrics class.
QueryMetrics aggregatedQueryMetrics = queryMetricsList.Aggregate((curr, acc) => curr + acc);
Console.WriteLine(aggregatedQueryMetrics);
```

## Grouping query metrics by Partition ID

You can group the `QueryMetrics` by the parition ID. Grouping by Partition ID allows you to see if a specific Partition is causing performance issues when compared to others. The following example shows how to group `QueryMetrics` with LINQ:

```csharp
List<KeyValuePair<string, QueryMetrics>> partitionedQueryMetrics = new List<KeyValuePair<string, QueryMetrics>>();
while (documentQuery.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<dynamic> feedResponse = await documentQuery.ExecuteNextAsync();
    
    // This dictionary is maps the partitionId to the QueryMetrics of that query
    IReadOnlyDictionary<string, QueryMetrics> partitionIdToQueryMetrics = feedResponse.QueryMetrics;
    partitionedQueryMetrics.AddRange(partitionIdToQueryMetrics.ToList());
}

// Now we are able to group the query metrics by partitionId
IEnumerable<IGrouping<string, KeyValuePair<string, QueryMetrics>>> groupedByQueryMetrics = partitionedQueryMetrics
    .GroupBy(kvp => kvp.Key);

// If we wanted to we could even aggregate the groupedby QueryMetrics
foreach(IGrouping<string, KeyValuePair<string, QueryMetrics>> grouping in groupedByQueryMetrics)
{
    string partitionId = grouping.Key;
    QueryMetrics aggregatedQueryMetricsForPartition = grouping
        .Select(kvp => kvp.Value)
        .Aggregate((curr, acc) => curr + acc);
    DoSomeLoggingOfQueryMetrics(query, partitionId, aggregatedQueryMetricsForPartition);
}
```

## LINQ on DocumentQuery

You can also get the `FeedResponse` from a LINQ Query using the `AsDocumentQuery()` method:

```csharp
IDocumentQuery<Document> linqQuery = client.CreateDocumentQuery(collection.SelfLink, feedOptions)
    .Take(1)
    .Where(document => document.Id == "42")
    .OrderBy(document => document.Timestamp)
    .AsDocumentQuery();
FeedResponse<Document> feedResponse = await linqQuery.ExecuteNextAsync<Document>();
IReadOnlyDictionary<string, QueryMetrics> queryMetrics = feedResponse.QueryMetrics;
```

## Expensive Queries

You can capture the request units consumed by each query to investigate expensive queries or queries that consume high throughput. You can get the request charge by using the [RequestCharge](https://msdn.microsoft.com/en-us/library/azure/dn948712.aspx) property in `FeedResponse`. To learn more about how to get the request charge using the Azure portal and different SDKs, see [find the request unit charge](find-request-unit-charge.md) article.

```csharp
string query = "SELECT * FROM c";
IDocumentQuery<dynamic> documentQuery = documentClient.CreateDocumentQuery(Collection.SelfLink, query, feedOptions).AsDocumentQuery();

while (documentQuery.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<dynamic> feedResponse = await documentQuery.ExecuteNextAsync();
    double requestCharge = feedResponse.RequestCharge
    
    // Log the RequestCharge how ever you want.
    DoSomeLogging(requestCharge);
}
```

## Get the query execution time

When calculating the time required to execute a client-side query, make sure that you only include the time to call the `ExecuteNextAsync` method and not other parts of your code base. Just these calls help you in calculating how long the query execution took as shown in the following example:

```csharp
string query = "SELECT * FROM c";
IDocumentQuery<dynamic> documentQuery = documentClient.CreateDocumentQuery(Collection.SelfLink, query, feedOptions).AsDocumentQuery();
Stopwatch queryExecutionTimeEndToEndTotal = new Stopwatch();
while (documentQuery.HasMoreResults)
{
    // Execute one continuation of the query
    queryExecutionTimeEndToEndTotal.Start();
    FeedResponse<dynamic> feedResponse = await documentQuery.ExecuteNextAsync();
    queryExecutionTimeEndToEndTotal.Stop();
}

// Log the elapsed time
DoSomeLogging(queryExecutionTimeEndToEndTotal.Elapsed);
```

## Scan queries (commonly slow and expensive)

```json
"QueryMetrics": {
    "TotalTime": "00:00:04.5299799",
    "RetrievedDocumentCount": 157743,
    "RetrievedDocumentSize": 1578730753,
    "OutputDocumentCount": 0,
    "IndexHitRatio": 0,
    "QueryPreparationTimes": {
      "CompileTime": "00:00:00.0001000",
      "LogicalPlanBuildTime": "00:00:00.0000400",
      "PhysicalPlanBuildTime": "00:00:00.0000700",
      "QueryOptimizationTime": "00:00:00"
    },
    "QueryEngineTimes": {
      "IndexLookupTime": "00:00:00.0245700",
      "DocumentLoadTime": "00:00:03.5928200",
      "WriteOutputTime": "00:00:00",
      "RuntimeExecutionTimes": {
        "TotalTime": "00:00:00.8825200",
        "SystemFunctionExecutionTime": "00:00:00",
        "UserDefinedFunctionExecutionTime": "00:00:00"
    }
},
```

This above output is returned by a scan query. A scan query refers to a query that wasn't served by the index, due to which, many documents are loaded before returning the result set. Note the following values from the previous output:

```json
"RetrievedDocumentCount": 157743,
"RetrievedDocumentSize": 1578730753,
```

This query loaded 157,743 documents, which totaled 1,578,730,753 bytes. Loading this many bytes will result in high cost or request unit charge. It also takes a long time to execute the query, which is clear with the total time spent property:

```json
"TotalTime": "00:00:04.5299799"
```

Meaning that the query took 4.5 seconds to execute (and this was only one continuation).

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 

## Next steps

- [Tune query performance](sql-api-query-metrics.md)
- [Indexing overview](index-overview.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
