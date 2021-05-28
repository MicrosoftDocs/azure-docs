---
title: Monitor Azure Blob Storage by using logs
description: Use activity and diagnostic logs to audit Azure Blob Storage and diagnose issues.
author: normesta
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.author: normesta
ms.date: 05/28/2021
ms.custom: "monitoring"
---

# Monitor Azure Blob Storage by using logs

Intro goes here.

## Get started with logs

To get started with logs, see any of these articles.

- [Monitoring Azure Blob Storage](../blobs/monitor-blob-storage.md)
- [Monitoring Azure Files](../files/storage-files-monitoring.md)
- [Monitoring Azure Table storage](../tables/monitor-table-storage.md)
- [Monitoring Azure Queue Storage](../queues/monitor-queue-storage.md)

## Configure a policy definition

You can create a diagnostic setting by using a policy definition. That way, you can make sure that a diagnostic setting is created for every account that is created or updated. See [Azure Policy built-in definitions for Azure Storage](policy-reference.md).

Is this in scope for this article? 

- Generate logs for different targets and scenarios?
- Set up validation rules to govern edits and data use?

## Audit diagnostic logs

Identify the key elements for auditing (`what`, `when`, `how`, and `who`). 

### Identify what was changed

Put something here.

### Identify when the change was made

Put something here.

### Identify how the change was made

Put something here.

### Identify who made the change

Put something here.

##### Identify the client associated with a request

Put something here.

## Audit data plane activities

This section shows example queries that you can use for common scenarios.

### All storage services

##### Number of bytes read per request by a specific service principal

Put query here

##### Number of bytes read per request as part of a particular connection  

Put query here

### Blob Storage

##### 10 most common errors over the last three days

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d) and StatusText !contains "Success"
| summarize count() by StatusText
| top 10 by count_ desc
```

##### Top 10 operations that caused the most errors over the last three days

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d) and StatusText !contains "Success"
| summarize count() by OperationName
| top 10 by count_ desc
```

##### Top 10 operations with the longest end-to-end latency over the last three days

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d)
| top 10 by DurationMs desc
| project TimeGenerated, OperationName, DurationMs, ServerLatencyMs, ClientLatencyMs = DurationMs - ServerLatencyMs
```

##### All operations that caused server-side throttling errors over the last three days

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d) and StatusText contains "ServerBusy"
| project TimeGenerated, OperationName, StatusCode, StatusText
```

##### All requests with anonymous access over the last three days

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d) and AuthenticationType == "Anonymous"
| project TimeGenerated, OperationName, AuthenticationType, Uri
```

##### Operations used over the last three days

This output appears in a pie chart

```Kusto
StorageBlobLogs
| where TimeGenerated > ago(3d)
| summarize count() by OperationName
| sort by count_ desc 
| render piechart
```

### Azure Files

##### SMB errors over the last week

```Kusto
StorageFileLogs
| where Protocol == "SMB" and TimeGenerated >= ago(7d) and StatusCode contains "-"
| sort by StatusCode
```
##### SMB operations over the last week

This output appears in a pie chart.

```Kusto
StorageFileLogs
| where Protocol == "SMB" and TimeGenerated >= ago(7d) 
| summarize count() by OperationName
| sort by count_ desc
| render piechart
```

##### REST errors over the last week

```Kusto
StorageFileLogs
| where Protocol == "HTTPS" and TimeGenerated >= ago(7d) and StatusText !contains "Success"
| sort by StatusText asc
```

##### REST operations over the last week
 
This output appears in a pie chart.

```Kusto
StorageFileLogs
| where Protocol == "HTTPS" and TimeGenerated >= ago(7d) 
| summarize count() by OperationName
| sort by count_ desc
| render piechart
```

### Queue Storage

Need queries here.

### Table Storage

##### Calculate table storage capacity

Put something here.

## Audit control plane activities

Put something here.

## Receive real-time alerts of account activity

Put something here.

### Alert on big files that are uploaded to a share

Put something here.

### Alert when a file is approaching a capacity limit

Put something here.

## Next steps

- [Monitor Azure Blob Storage by using metrics](blob-storage-metrics.md).

  

