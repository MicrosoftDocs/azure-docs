---
title: Query bookshelf indexing logs for Microsoft Discovery
description: Learn how to query bookshelf indexing job logs for Microsoft Discovery in the Log Analytics workspace within the Supercomputer's Managed Resource Group, to track indexing execution and diagnose failures.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/15/2026

#CustomerIntent: As a Discovery platform developer or administrator, I want to query bookshelf indexing logs so that I can track indexing job execution, investigate failures, and diagnose errors in knowledgebase creation.
---

# Query bookshelf indexing logs for Microsoft Discovery

Microsoft Discovery bookshelf indexing job logs capture the stdout/stderr output from indexing jobs and provide error diagnostics for failures that occur during knowledgebase indexing. Because indexing jobs run on the supercomputer's compute infrastructure, these logs are stored in the `DiscoveryBookshelfLogs_CL` table in the Log Analytics workspace within the **supercomputer's** Managed Resource Group (MRG).

> [!NOTE]
> Bookshelf indexing logs are in the Supercomputer's MRG, not the bookshelf's MRG. The bookshelf's MRG contains knowledgebase query logs (`DiscoveryLogs_CL`). For details on the distinction, see [Observability in Microsoft Discovery](concept-observability.md).

## Prerequisites

Before you begin, navigate to the Log Analytics workspace in your **supercomputer's** MRG. For instructions, see [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md).

## What the logs contain

Bookshelf indexing logs provide:

- **Indexing job execution messages**: Captures the application stdout/stderr logs from indexing jobs.
- **Error diagnostics**: Investigate failures and exceptions that occur during indexing.

## Query indexing logs

After opening the Logs interface in the supercomputer's MRG Log Analytics workspace:

1. In the left panel, select the **Tables** tab.
2. Expand **Custom Logs** and locate **`DiscoveryBookshelfLogs_CL`**.
3. Select **Run** next to `DiscoveryBookshelfLogs_CL` to execute a default query and confirm logs are being ingested.

:::image type="content" source="media/how-to-query-bookshelf-indexing-logs/open-log-analytics-table.png" alt-text="Screenshot of the Log Analytics Tables panel with the multiple tables in the Custom Logs section." lightbox="media/how-to-query-bookshelf-indexing-logs/open-log-analytics-table.png":::

## Example queries

### View recent logs

```kql
DiscoveryBookshelfLogs_CL
| take 100
```

### Filter by time range

```kql
DiscoveryBookshelfLogs_CL
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
```

### Search for errors and exceptions

```kql
DiscoveryBookshelfLogs_CL
| where Message contains "error" or Message contains "exception"
| order by TimeGenerated desc
```

### Find jobName for kbname 

Run this query to find the jobName for this KB. Replace by your `kb-name`.

```kql
DiscoveryBookshelfLogs_CL 
| where Message contains "STARTING INDEXING PIPELINE FOR: kb-name"
| project TimeGenerated, Message, jobName | order by TimeGenerated desc
```

### Find logs by jobName

Run this query to retrieve all logs by jobName.

```kql
DiscoveryBookshelfLogs_CL 
| where jobName contains "sc-3f2eca05f861424f-indexingservice-0" 
| project TimeGenerated, Message, jobName | order by TimeGenerated desc
```

You can additionally use this kql command to see summarized view of events during indexing.

```kql
let workflowEvents = DiscoveryBookshelfLogs_CL | where jobName == "sc-d53bed6508694989-indexingservice-0" | where Message contains "Starting workflow" or Message contains "Ending workflow" | extend WorkflowName = extract("workflow '([^']+)'", 1, Message) | extend EventType = iff(Message contains "Starting", "Start", "End") | project TimeGenerated, WorkflowName, EventType; workflowEvents | summarize StartTime = minif(TimeGenerated, EventType == "Start"), EndTime = maxif(TimeGenerated, EventType == "End") by WorkflowName | extend DurationMinutes = datetime_diff('minute', EndTime, StartTime) | project WorkflowName, StartTime, EndTime, DurationMinutes | order by DurationMinutes desc
```

### View indexing errors and warnings

All error and warning messages from the indexing tool itself.

```kql
DiscoveryBookshelfLogs_CL
| where Message has_any ("ERROR", "Error", "WARNING", "Warning", "failed", "Failed", "exception", "Exception")
| extend LogLevel = extract(@"- (INFO|WARNING|ERROR|DEBUG) -", 1, Message)
| where LogLevel in ("ERROR", "WARNING")
| project TimeGenerated, toolRunId, jobName, imageTag, LogLevel, Message
| order by TimeGenerated desc
```

### Track indexing progress per run

Track how far each indexing job progressed through its pipeline stages, such as noun phrase extraction and embedding.

```kql
DiscoveryBookshelfLogs_CL
| where Message has "progress:"
| extend stage = extract(@"- ([a-z_ ]+) progress:", 1, Message)
| extend progress = extract(@"progress: (\d+)/(\d+)", 0, Message)
| extend ts = TimeGenerated
| summarize arg_max(ts, progress) by toolRunId, stage
| project toolRunId, stage, last_progress = progress, last_seen = ts
| order by toolRunId asc, stage asc
```

### List all indexing jobs with their run window

Run this query to get job names and run IDs, which you can use to filter other queries.

```kql
DiscoveryBookshelfLogs_CL
| summarize start_time = min(TimeGenerated), end_time = max(TimeGenerated)
  by toolRunId, jobName, imageTag
| order by start_time desc
```

### Find Kubernetes failure events for a specific job

Replace `<jobName>` with a value from the **List all indexing jobs** query above, or use a `toolRunId` prefix (first 16 characters prefixed with `sc-`).

```kql
KubeEvents_CL
| where KubeEventType == "Warning"
| where Reason in ("BackoffLimitExceeded", "FailedJobs", "Failed")
| where Namespace == "scorch"
| where Name == "<jobName>"
   or Name startswith "sc-<first-16-chars-of-toolRunId>"
| project TimeGenerated, Reason, ObjectKind, Name, Message
| order by TimeGenerated desc
```

### Check pod health for indexing jobs

Replace `<jobName>` with a value from the **List all indexing jobs** query above.

```kql
KubePodInventory_CL
| where Namespace == "scorch"
| where Name == "<jobName>"
| project TimeGenerated, Name, PodStatus, ContainerStatus, ContainerStatusReason,
          PodRestartCount = toint(PodRestartCount), ContainerRestartCount = toint(ContainerRestartCount)
| where PodRestartCount > 0 or PodStatus != "Running" or ContainerStatus != "running"
| order by PodRestartCount desc
```

### Detect container startup failures

Identify when an indexing tool container fails to start due to image pull errors or missing entrypoints.

```kql
KubeEvents_CL
| where KubeEventType == "Warning"
| where Reason == "Failed"
| where Namespace == "scorch"
| where Name has "indexingservice"
| where Message has_any ("ErrImagePull", "ImagePullBackOff", "executable file not found", "no such file", "OCI runtime", "containerd")
| extend failure_type = case(
    Message has "ErrImagePull" or Message has "ImagePullBackOff", "Image Pull Failure",
    Message has "executable file not found", "Missing Entrypoint",
    Message has "no such file or directory", "Missing Script/File",
    Message has "OCI runtime", "Container Runtime Error",
    "Other")
| project TimeGenerated, Name, failure_type, Message
| order by TimeGenerated desc
```

### Detect jobs stuck due to quota or scheduling failures

Identify when indexing jobs can't be scheduled because of insufficient cluster quota.

```kql
KubeEvents_CL
| where KubeEventType == "Warning"
| where Reason == "Pending"
| where Namespace == "scorch"
| where Message has "indexing" or Name has "indexingservice" or Name has "bookshelf"
| project TimeGenerated, Name, Message
| order by TimeGenerated desc
```

### View full run timeline for a specific indexing job

Use these queries together to get a complete end-to-end view of a single indexing run. Replace `<your-toolRunId>` with your run ID and `<first-16-chars-of-toolRunId>` with the first 16 characters of the run ID prefixed with `sc-`.

**Application log timeline:**

```kql
DiscoveryBookshelfLogs_CL
| where toolRunId == "<your-toolRunId>"
| extend level = extract(@"- (INFO|WARNING|ERROR|DEBUG) -", 1, Message)
| project TimeGenerated, level, Message
| order by TimeGenerated asc
```

**Kubernetes events for the job:**

```kql
KubeEvents_CL
| where Name startswith "sc-<first-16-chars-of-toolRunId>"
| project TimeGenerated, KubeEventType, Reason, Name, Message
| order by TimeGenerated asc
```

**Pod inventory for the job:**

```kql
KubePodInventory_CL
| where Name startswith "sc-<first-16-chars-of-toolRunId>"
| project TimeGenerated, Name, PodStatus, ContainerStatus, ContainerStatusReason,
          PodRestartCount = toint(PodRestartCount)
| order by TimeGenerated asc
```

### View indexing success rate over time

**Job completion and failure events by hour:**

```kql
KubeEvents_CL
| where Namespace == "scorch"
| where Reason in ("AllJobsCompleted", "FailedJobs")
| where Name startswith "sc-"
| summarize count() by bin(TimeGenerated, 1h), Reason
| order by TimeGenerated desc
```

## Query AI Search enrichment logs

During knowledgebase indexing, Microsoft Discovery uses Azure AI Search for data enrichment including skills such as Content Understanding. The diagnostic logs for AI Search are stored in the `AzureDiagnostics` table in the Log Analytics workspace within the **bookshelf's** Managed Resource Group (MRG), not the supercomputer's MRG.

> [!NOTE]
> AI Search logs are in the **bookshelf's MRG**, separate from the indexing job logs described earlier in this article. To access them, navigate to the Log Analytics workspace in your bookshelf's MRG. 

After opening the Logs interface in the bookshelf's MRG Log Analytics workspace:

1. In the left panel, select the **Tables** tab.
2. Expand **Custom Logs** and locate **`DiscoveryLogs_CL`**.
3. Select **Run** next to `DiscoveryLogs_CL` to execute a default query and confirm logs are being ingested.

:::image type="content" source="media/how-to-query-bookshelf-logs/open-log-analytics-table.png" alt-text="Screenshot of the Log Analytics Tables panel with the DiscoveryLogs_CL table selected in the Custom Logs section." lightbox="media/how-to-query-bookshelf-logs/open-log-analytics-table.png":::

The `AzureDiagnostics` table captures three log categories for AI Search:

| Category | Description |
|---|---|
| `IndexerActivityLogs` | Indexer start and end events, including document counts and skill set used |
| `IndexerErrorsWarningLogs` | Skill-level errors and warnings for individual documents that failed enrichment |
| `OperationLogs` | API-level operations including search queries, index management, and service statistics |

### Check whether the last indexer runs succeeded

```kql
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| where OperationName == "Indexer.End"
| project TimeGenerated, IndexerName_s, ResultType, ItemsProcessed_d, ItemsFailed_d, SkillsetName_s
| order by TimeGenerated desc
```

### View indexer run history

Full timeline of indexer activity including start, errors, and end events across all runs.

```kql
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| project TimeGenerated, CorrelationId, OperationName, IndexerName_s, ResultType,
          ItemsProcessed_d, ItemsFailed_d, SkillsetName_s
| order by TimeGenerated asc
```

To trace a single run end-to-end (Start → Error → End), the following query automatically finds the most recent run without requiring you to know the correlation ID in advance:

```kql
let latestCorrelationId = toscalar(
    AzureDiagnostics
    | where Category == "IndexerActivityLogs"
    | where OperationName == "Indexer.Start"
    | summarize arg_max(TimeGenerated, CorrelationId)
    | project CorrelationId
);
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| where CorrelationId == latestCorrelationId
| project TimeGenerated, OperationName, ResultType, ItemsProcessed_d, ItemsFailed_d
| order by TimeGenerated asc
```

To trace a specific run, copy the `CorrelationId` from the history query above and substitute it:

```kql
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| where CorrelationId == "<paste-correlationId-from-history-query>"
| project TimeGenerated, OperationName, ResultType, ItemsProcessed_d, ItemsFailed_d
| order by TimeGenerated asc
```

### View documents processed per indexer run

Track how many documents each indexer run ingested. Useful for verifying that new files were picked up after uploading to the data source.

```kql
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| where OperationName == "Indexer.End"
| where ItemsProcessed_d > 0
| project TimeGenerated, IndexerName_s, ItemsProcessed_d, ItemsFailed_d, ResultType
| order by TimeGenerated desc
```

### Investigate enrichment skill errors

Show skill-level errors that caused individual documents to fail during AI enrichment, such as Content Understanding skill failures.

```kql
AzureDiagnostics
| where Category == "IndexerErrorsWarningLogs"
| where Level == "Error"
| project TimeGenerated, IndexerName_s, Name_s, StatusCode_s, ErrorMessage_s, Details_s
| order by TimeGenerated desc
```

To include warnings alongside errors:

```kql
AzureDiagnostics
| where Category == "IndexerErrorsWarningLogs"
| project TimeGenerated, Level, IndexerName_s, Name_s, StatusCode_s, ErrorMessage_s, Details_s
| order by TimeGenerated desc
```

### Check current index document count

Estimate the number of documents currently indexed by examining recent search query results.

```kql
AzureDiagnostics
| where Category == "OperationLogs"
| where OperationName == "Query.Search"
| where ResultType == "Success"
| where Documents_d > 100
| project TimeGenerated, IndexName_s, Documents_d, DurationMs
| order by TimeGenerated desc
| take 5
```

### Find failed search queries

Identify search queries that returned errors, which can indicate index issues or query problems.

```kql
AzureDiagnostics
| where Category == "OperationLogs"
| where OperationName == "Query.Search"
| where ResultType == "Failed"
| project TimeGenerated, IndexName_s, DurationMs, Query_s
| order by TimeGenerated desc
```

### Monitor search query latency

Monitor search query response times. High latency may indicate index size issues or resource pressure on the AI Search service.

```kql
AzureDiagnostics
| where Category == "OperationLogs"
| where OperationName == "Query.Search"
| where ResultType == "Success"
| where DurationMs > 0
| summarize avg_ms = avg(DurationMs), max_ms = max(DurationMs), query_count = count()
  by bin(TimeGenerated, 1h), IndexName_s
| order by TimeGenerated desc
```

### View indexer failures summary

Quick count of indexer run outcomes, grouped by result and indexer name.

```kql
AzureDiagnostics
| where Category == "IndexerActivityLogs"
| where OperationName == "Indexer.End"
| summarize count() by ResultType, IndexerName_s
| order by count_ desc
```

## Troubleshooting

### No data in DiscoveryBookshelfLogs_CL

| Cause | Resolution |
|---|---|
| No indexing jobs got executed | Trigger a knowledgebase creation or reindexing operation |
| Time range is too narrow | Expand the time range to the last 24 hours |
| Logs are delayed due to ingestion latency | Wait a few seconds and rerun the query |

### Query timeout or slow performance

| Cause | Resolution |
|---|---|
| Query scope is too broad | Narrow the time range or add filters |
| Complex aggregations across large datasets | Use `take` or `limit` to restrict the result set |

## Related content

- [Observability in Microsoft Discovery](concept-observability.md)
- [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md)
- [Query supercomputer logs](how-to-query-supercomputer-logs.md)
- [Query bookshelf knowledgebase query logs](how-to-query-bookshelf-logs.md)
