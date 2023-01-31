---
title: Server diagnostics for Azure Cosmos DB for Apache Cassandra
description: This article explains some common error codes in Azure Cosmos DB's API for Cassandra and how to troubleshoot using Log Analytics
author: IriaOsara
ms.author: IriaOsara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: troubleshooting
ms.date: 10/12/2021
ms.custom: template-how-to, ignite-2022
---

# Server diagnostics for Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Log Analytics is a tool in the Azure portal that helps you run server diagnostics on your API for Cassandra account. Run log queries from data collected by Azure Monitor Logs and interactively analyze their results. Records retrieved from Log Analytics queries help provide various insights into your data.

## Prerequisites

- Create a [Log Analytics Workspace](../../azure-monitor/logs/quick-create-workspace.md).
- Create [Diagnostic Settings](../monitor-resource-logs.md).
- Start [log analytics](../../azure-monitor/logs/log-analytics-overview.md) on your API for Cassandra account.

## Use Log Analytics
After you've completed the log analytics setup, you can begin to explore your logs to gain more insights.

### Explore Data Plane Operations
Use the CDBCassandraRequests table to see data plane operations specifically for your API for Cassandra account. A sample query to see the topN(10) consuming request and get detailed information on each request made.

```Kusto
CDBCassandraRequests
| where RequestCharge  > 0
| project DatabaseName, CollectionName, DurationMs, OperationName, ActivityId, ErrorCode, RequestCharge, PIICommandText 
| order by RequestCharge
| take 10
```

#### Error Codes and Possible Solutions
|Status Code | Error Code           | Description  |
|------------|----------------------|--------------|
| 200 | -1 | Successful |
| 400 |	8704 | The query is correct but an invalid syntax. |
| 400 |	8192 | The submitted query has a syntax error. Review your query. |
| 400 |	8960 | The query is invalid because of some configuration issue. |
| 401 |8448 | The logged user does not have the right permissions to perform the query. |
| 403 |	8448 | Forbidden response as the user may not have the necessary permissions to carry out the request. |
| 404 | 5376 | A non-timeout exception during a write request as a result of response not found. |
| 405 |	0 | Server-side Cassandra error. The error rarely occurs, open a support ticket. |
| 408 | 4608 | Timeout during a read request. |
| 408 |	4352 | Timeout exception during a write serviceRequest. |
| 409 |	9216 | Attempting to create a keyspace or table that already exist. |
| 412 | 5376 | Precondition failure. To ensure data integrity, we ensure that the write request based on the read response is true. A non-timeout write request exception is returned. |
| 413 | 5376 | This non-timeout exception during a write request is because of payload maybe too large. Currently, there is a limit of 2MB per row. |
| 417 | 9472 | The exception is thrown when a prepared statement is not cached on the server node. It should be transient/non-blocking. |
| 423 | 5376 | There is a lock because a write request that is currently processing. |
| 429 | 4097| Overload exception is as a result of RU shortage or high request rate. Probably need more RU to handle the higher volume request. In, native Cassandra this can be interpreted as one of the VMs not having enough CPU. We advise reviewing current data model to ensure that you do not have excessive skews that might be causing hot partitions. |
| 449 |	5376 | Concurrent execution exception. This occurs to ensure only one write update at a time for a given row. |
| 500 |	0 |	Server cassandraError: something unexpected happened. This indicates a server-side bug. |
| 503 |	4096 | Service unavailable. |
| 	| 256 | This may be because of invalid connection credentials. Please check your connection credentials. |
| 	| 10 | A client message triggered protocol violation. An example is query message sent before a startup one has been sent. |

### Troubleshoot Query Consumption
The CDBPartitionKeyRUConsumption table contains details on request unit (RU) consumption for logical keys in each region within each of their physical partitions.

```Kusto
CDBPartitionKeyRUConsumption 
| summarize sum(todouble(RequestCharge)) by PartitionKey, PartitionKeyRangeId
| render columnchart
 ```

### Explore Control Plane Operations
The CBDControlPlaneRequests table contains details on control plane operations, specifically  for API for Cassandra accounts. 

```Kusto
CDBControlPlaneRequests
| where TimeGenerated > now(-6h)
| where  ApiKind == "Cassandra"
| where OperationName in ("Create", "Upsert", "Delete", "Execute")
| summarize by OperationName
 ```

## Next steps

- Learn more about [Log Analytics](../../azure-monitor/logs/log-analytics-tutorial.md).
- Learn how to [migrate from native Apache Cassandra to Azure Cosmos DB for Apache Cassandra](migrate-data-databricks.md).
