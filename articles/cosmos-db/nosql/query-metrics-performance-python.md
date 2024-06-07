---
title: Get NoSQL query performance & execution metrics in Azure Cosmos DB using Python SDK
description: Learn how to retrieve NoSQL query execution metrics and profile NoSQL query performance of Azure Cosmos DB requests.
author: abhinavtrips
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 1/5/2023
ms.author: abtripathi
ms.custom: devx-track-python, devx-track-python-sdk
---
# Get SQL query execution metrics and analyze query performance using Azure Cosmos DB Python SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article presents how to profile SQL query performance on Azure Cosmos DB using Query Execution Metrics. It contains cumulative metrics that are aggregated across all physical partitions for the request, a list of metrics for each physical partition, and the total request charge. These metrics are documented in more detail in the [Tune Query Performance](./query-metrics.md#query-execution-metrics) article.

## Enable query metrics

To get query metrics, you need to set the ```populate_query_metrics``` flag to ```True``` in your query parameters as below. You may be interested in enabling index metrics as well for debugging purposes and you can enable it by setting the ```populate_query_metrics``` flag to ```True```:

```python
results = container.query_items(
    query=queryText,
    enable_cross_partition_query=True,
    populate_index_metrics=True,
    populate_query_metrics=True
)
```


### Get Query Execution Metrics
In python SDK, you can read the ```x-ms-documentdb-query-metrics``` header values from the container client to get the query execution metrics. The following code snippet shows how to read the query execution metrics:

```python
results = container.query_items(
    query=queryText,
    enable_cross_partition_query=True,
    populate_query_metrics=True
)

items = [item for item in results]
'''
Please note that the last_response_headers are available only after the first iteration of the results as the query execution starts only when result iteration begins
'''
print("Query Metrics: ",container.client_connection.last_response_headers['x-ms-documentdb-query-metrics'])
```

The result will give you query execution related info as below:
```python
totalExecutionTimeInMs=0.27;
queryCompileTimeInMs=0.04;
queryLogicalPlanBuildTimeInMs=0.00;
queryPhysicalPlanBuildTimeInMs=0.02;
queryOptimizationTimeInMs=0.00;
VMExecutionTimeInMs=0.02;
indexLookupTimeInMs=0.00;
instructionCount=17;
documentLoadTimeInMs=0.01;
systemFunctionExecuteTimeInMs=0.00;
userFunctionExecuteTimeInMs=0.00;
retrievedDocumentCount=3;
retrievedDocumentSize=1005;
outputDocumentCount=3;
outputDocumentSize=1056;
writeOutputTimeInMs=0.00;
indexUtilizationRatio=1.00
```

The above results can give you insights on how efficient your query is. You can look at the totalExecutionTimeInMs to see how long the query took to execute. The indexUtilizationRatio can give you insights on how well your query is utilizing the index. 
To understand the metrics in detail, refer to the [Query Execution Metrics](./query-metrics.md#query-execution-metrics) article.


## Get the query request charge

You can capture the Total request Units (RUs) consumed by reading ```x-ms-request-charge``` value. You do not need to set any parameters explicitly to retrieve the request charge value. The following example shows how to get the request charge for each continuation of a query:

```python
items = [item for item in results]
print("Request Units consumed: ",container.client_connection.last_response_headers['x-ms-request-charge'])
```


## Get the index utilization

Looking at the index utilization can help you debug slow queries. A good index utilization score must be close to 1. Queries that can't use the index, result in a full scan of all documents in a container before returning the result set.

Here's an example of a scan query:

```sql
SELECT VALUE c.description 
FROM   c 
WHERE UPPER(c.description) = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

This query's filter uses the system function UPPER, which isn't served from the index. Executing this query against a large collection produced the following query metrics for the first continuation:

```
QueryMetrics

Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
Output Document Count                    :               7
Output Document Size                     :             510 bytes
Index Utilization                        :            0.00 %
Total Query Execution Time               :        4,500.34 milliseconds
Query Preparation Time                   :             0.2 milliseconds
Index Lookup Time                        :            0.01 milliseconds
Document Load Time                       :        4,177.66 milliseconds
Runtime Execution Time                   :           407.9 milliseconds
Document Write Time                      :            0.01 milliseconds
```

Note the following values from the query metrics output:

```
Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
```

This query loaded 60,951 documents, which totaled 399,998,938 bytes. Loading this many bytes results in high cost or request unit charge. It also takes a long time to execute the query, which is clear with the total time spent property:

```
Total Query Execution Time               :        4,500.34 milliseconds
```

Meaning that the query took 4.5 seconds to execute (and this was only one continuation).

To optimize this example query, avoid the use of UPPER in the filter. Instead, when documents are created or updated, the `c.description` values must be inserted in all uppercase characters. The query then becomes: 

```sql
SELECT VALUE c.description 
FROM   c 
WHERE c.description = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

This query is now able to be served from the index. Alternatively, you can use [computed properties](query/computed-properties.md) to index the results of system functions or complex calculations that would otherwise result in a full scan.

To have a look at the potential index recommendations and to check which indexes have been utilized, you must set the ```populate_index_metrics``` parameter to ```True``` and then you can read the ```x-ms-documentdb-index-utilization``` header values from the container client. The following code snippet shows how to read the index utilization metrics:

```python
results = container.query_items(
    query=queryText,
    enable_cross_partition_query=True,
    populate_index_metrics = True
)
items = [item for item in results]
print("Index Utilization Info: ",container.client_connection.last_response_headers['x-ms-cosmos-index-utilization'])

```

To learn more about tuning query performance, see the [Tune Query Performance](./query-metrics.md) article.

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](query/getting-started.md)


## Next steps

- [Tune query performance](query-metrics.md)
- [Indexing overview](../index-overview.md)
- [Azure Cosmos DB Python SDK Best Practices](/azure/cosmos-db/nosql/best-practice-python)
- [Azure Cosmos DB Python SDK Performance Tips](/azure/cosmos-db/nosql/performance-tips-python-sdk)
