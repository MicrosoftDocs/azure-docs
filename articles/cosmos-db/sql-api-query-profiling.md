---
title: SQL query profiling for Azure Cosmos DB SQL API
description: Learn about how to retrieve metrics and profile SQL query performance of Azure Cosmos DB requests.
author: GinaRobinson
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/09/2019
ms.author: girobins

---
# Profiling Queries

## QueryMetrics
[QueryMetrics](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.querymetrics.aspx) is a strongly typed object with information about the backend query execution. These metrics are documented in more detail in the following article [https://docs.microsoft.com/en-us/azure/cosmos-db/documentdb-sql-query-metrics](https://docs.microsoft.com/en-us/azure/cosmos-db/documentdb-sql-query-metrics). What this article focuses on is how you can retrieve these metrics client-side using the .net SDK.

## Setting the FeedOptions for CreateDocumentQuery

All the overloads for [DocumentClient.CreateDocumentQuery](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.documentclient.createdocumentquery.aspx) take in an optional [FeedOptions](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.feedoptions.aspx) parameter. This option is what allows query execution to be tuned and parameterized. What is important is that you set the [PopulateQueryMetrics](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.client.feedoptions.populatequerymetrics.aspx#P:Microsoft.Azure.Documents.Client.FeedOptions.PopulateQueryMetrics) in the `FeedOptions` to `true`. Setting `PopulateQueryMetrics` to true will make it so that the `FeedResponse` will contain the relevant `QueryMetrics`.

### AsDocumentQuery()
The following code sample shows how to do retrieve metrics if you use [AsDocumentQuery()](https://msdn.microsoft.com/en-us/library/microsoft.azure.documents.linq.documentqueryable.asdocumentquery.aspx)

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
    // This dictionary is maps the partitionId to the QueryMetrics of that query
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
#### Aggregating QueryMetrics

Notice that there were multiple calls to [ExecuteNextAsync](https://msdn.microsoft.com/en-us/library/azure/dn850294.aspx) that each returned to us a `FeedResponse`. Each `FeedResponse` has a dictionary of `QueryMetrics`; one for every continuation of the query. So how can we aggregate these `QueryMetrics`? We can aggregate with LINQ!

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

// Now we are able to aggregate the QueryMetrics using the + operator overload of the QueryMetrics class.
QueryMetrics aggregatedQueryMetrics = queryMetricsList.Aggregate((curr, acc) => curr + acc);
Console.WriteLine(aggregatedQueryMetrics);
```

#### Grouping By PartitionId

But what if we want to group the `QueryMetrics` by the paritionId so that we can see if any one partition performed worse than the others on the backend? Again we can do that with some LINQ magic.

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

### LINQ on DocumentQuery

We can also get the `FeedResponse` from a LINQ Query by using `AsDocumentQuery()`:

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

To investigate expensive queries, we need to capture the [RequestCharge](https://msdn.microsoft.com/en-us/library/azure/dn948712.aspx) from the `FeedResponse` similar to how we captured the `QueryMetrics`. You can read more about how RequestCharges are calculated here [https://docs.microsoft.com/en-us/azure/cosmos-db/request-units](https://docs.microsoft.com/en-us/azure/cosmos-db/request-units)

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

## Timing Client-Side Query Execution

When timing client-side query execution you should make sure that your Stopwatch is only timing the calls to `ExecuteNextAsync` and not other parts of your code base, since what we are interested in is how long the query execution took.

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

## Common Slow / Expensive Queries

### Scans
```js
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

This query is a scan query, which means that the query wasn't able to be served by the index. What happens on the backend is that many documents are loaded, which is evident from the following properties:

```js
"RetrievedDocumentCount": 157743,
"RetrievedDocumentSize": 1578730753,
```

We had to load 157,743 documents, which totaled 1,578,730,753 bytes. Loading this many bytes ends up costing many RUs and takes a long time, which is clear when assessing the total time spent via the following property:

```js
"TotalTime": "00:00:04.5299799"
```

Meaning that the query took 4.5 seconds to execute (and this was only one continuation).
