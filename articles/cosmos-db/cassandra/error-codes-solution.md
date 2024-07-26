---
title: Server diagnostics for Azure Cosmos DB for Apache Cassandra
description: This article explains some common error codes in Azure Cosmos DB's API for Cassandra and how to troubleshoot using Log Analytics
author: IriaOsara
ms.author: IriaOsara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: troubleshooting
ms.date: 10/12/2021
ms.custom: template-how-to
---

# Server diagnostics for Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Log Analytics is a tool in the Azure portal that helps you run server diagnostics on your API for Cassandra account.

## Prerequisites

- Create a [Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).
- Create [diagnostic settings](../monitor-resource-logs.md).
- Start [log analytics](../../azure-monitor/logs/log-analytics-overview.md) on your API for Cassandra account.

## Use Log Analytics
After you've completed the log analytics setup, you can begin to explore your logs to gain more insights.

### Explore Data Plane Operations
Use the [CDBCassandraRequests table](/azure/azure-monitor/reference/tables/cdbcassandrarequests) to see data plane operations specifically for your API for Cassandra account. A sample query to see the topN(10) consuming request and get detailed information on each request made.

```Kusto
CDBCassandraRequests
| where RequestCharge  > 0
| project DatabaseName, CollectionName, DurationMs, OperationName, ActivityId, ErrorCode, RequestCharge, PIICommandText 
| order by RequestCharge
| take 10
```

For a list of error codes and their possible solutions, see [Error codes](../monitor-reference.md#error-codes-for-cassandra).

### Troubleshoot Query Consumption
The [CDBPartitionKeyRUConsumption table](/azure/azure-monitor/reference/tables/cdbpartitionkeyruconsumption) contains details on request unit (RU) consumption for logical keys in each region within each of their physical partitions.

```Kusto
CDBPartitionKeyRUConsumption 
| summarize sum(todouble(RequestCharge)) by PartitionKey, PartitionKeyRangeId
| render columnchart
 ```

### Explore Control Plane Operations
The [CBDControlPlaneRequests table](/azure/azure-monitor/reference/tables/cdbcontrolplanerequests) contains details on control plane operations, specifically  for API for Cassandra accounts. 

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
