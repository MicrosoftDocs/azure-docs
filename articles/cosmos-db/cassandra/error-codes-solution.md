---
title: Server Diagnostics for Cassandra API
description: This article explains some common error codes in Azure Cosmos DB's Cassandra API and how to trouble shoot using Log Analytics
author: IriaOsara
ms.author: IriaOsara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: troubleshooting
ms.date: 10/12/2021
ms.custom: template-how-to
---

# Server Diagnostics for Cassandra API
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

Log Analytics is a tool in the Azure portal that helps you run server diagnostics on your Cassandra API account. You can edit and run log queries from data collected by Azure Monitor Logs and interactively analyze their results. Records retrieved from Log Analytics queries help provide a variety of insights into your data.

## Prerequisites

- Create a [Log Analytics Workspace] (https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspacee).
- Create [Diagnostic Settings] (https://docs.microsoft.com/en-us/azure/cosmos-db/cosmosdb-monitor-resource-logs).
- Start [log analytics] (https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview) on your Cassandra API account.

## Using Log Analytics
Once you have competed the prerequisites steps above. You can begin to explore your logs to gain more insights.

## Explore Data Plane Operations
Use the [CDBCassandraRequests] (https://docs.microsoft.com/en-us/azure/azure-monitor/reference/tables/cdbcassandrarequests) table to see data plane operations specifically for your Cassandra API account. A sample query to see the topN(10) consuming request and get detailed information on each request made.

CDBCassandraRequests
| where RequestCharge  > 0
| project DatabaseName, CollectionName, DurationMs, OperationName, ActivityId, ErrorCode , RequestCharge, PIICommandText 
| order by RequestCharge
| take 10

### Error Codes and Possible Solutions
|Status Code | Error Code           | Description  |
|------------|----------------------|--------------|
| 200 | -1 | Successful |
| 400 |	8704 | The query is correct but invalid syntax. #AddSampleQuery |
| 400 |	8192 | The submitted query has a syntax error. Please check your query. |
| 400 |	8960 |	The query is invalid because of some configuration issue. |
| 401 |8448 |The logged user does not have the right permissions to perform the query. |
| 403 |	8448 | Forbidden response as the user may not have the necessary permissions to carry out the request. |
| 404 | 5376 |Response Not Found. This is a non-timeout exception during a write request . |
| 405 |	0 | This is a server-side Cassandra error. Please note that this rarely occurs. If you see this, please open a support ticket. |
| 408 | 4608 | Timeout during a read request. |
| 408	4352	Timeout exception during a write serviceRequest. |
| 409 |	9216 | Attempting to create a KEYSPACE or TABLE that already exist. |
| 412 | 5376 | Precondition failure. To ensure data integrity, we ensure that the write request based on the read response is true. If this occurs, a non-timeout write request exception is returned. |
| 413 | 5376 | This non timeout exception during a write request is because of payload been too large. Currently, there is a limit of 2MB per row. |
| 417 | 9472 | The exception is thrown when a prepared statement is not cached on the server node. It should be transient/non-blocking. |
| 423 | 5376 | This is a lock as there a write request is currently processing. |
| 429 | 4097| Overload exception is as a result of RU shortage or request rate too. Probably need more RU to handle the higher volume request. In native Cassandra this can be interpreted as one of the VMs not having enough CPU. We advise reviewing current data model to ensure that you do not have excessive skews that might be causing hot partitions. |
| 449 |	5376 | Concurrent execution exception. This occurs to ensure only one write update at a time for a given row. |
| 500 |	0 |	Server cassandraError: something unexpected happened. This indicates a server-side bug. |
| 503 |	4096 | Service unavailable. |
| 	| 256 | This may be because of invalid connection credentials. Please check your connection credentials. |
| 	| 10 | This is a client message triggered protocol violation. An example is query message sent before a startup one has been sent. |

## Troubleshoot Query Consumption
Use the [CDBPartitionKeyRUConsumption] (https://docs.microsoft.com/en-us/azure/azure-monitor/reference/tables/cdbpartitionkeyruconsumption) to get details on request unit(RU) consumption for logical keys in each region within each of their physical partitions.

CDBPartitionKeyRUConsumption 
| summarize sum(todouble(RequestCharge)) by PartitionKey, PartitionKeyRangeId
| render columnchart

## Explore Control Plane Operations
The [CBDControlPlaneRequests] (https://docs.microsoft.com/en-us/azure/azure-monitor/reference/tables/cdbcontrolplanerequests) table contains details on control plane operations, specifically  for Cassandra API accounts. 

CDBControlPlaneRequests
| where TimeGenerated > now(-6h)
| where AccountName == "LOG-DEMO" and ApiKind == "Cassandra"
| where OperationName in ("Create", "Upsert", "Delete", "Execute")
| summarize OperationName by bin(TimeGenerated, 10m), OperationName
| render timechart


## Next steps

- Learn more about [Log Analytics] (https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-tutorial).
- Learn how to [migrate from native Apache Cassandra to Azure Cosmos DB Cassandra API](migrate-data-databricks.md).