---
title: Query CogLoop logs for Microsoft Discovery
description: Learn how to query CogLoop AI orchestration logs for a Microsoft Discovery workspace in the Log Analytics workspace within the Managed Resource Group, to investigate investigation progress, errors, and decision-making behavior.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026

#CustomerIntent: As a Discovery platform developer or administrator, I want to query CogLoop logs so that I can monitor investigation progress, diagnose stalls, and investigate orchestration errors.
---

# Query CogLoop logs for Microsoft Discovery

Microsoft Discovery CogLoop is the AI orchestration engine that drives investigation progress. Cognition Engine logs capture:

- **Instance lifecycle** - Cognition Engine instance start, stop, and polling activity
- **Reasoning decisions** - Thinking module (fast/slow) and acting module tool selections
- **Task management operations** - Task execution, validation, status transitions, and agent assignments
- **Error diagnostics** - Serialization failures, Cosmos DB connectivity issues, loop errors, and tool call failures

It continuously runs two subloops - **Act** and **Cognition** to plan and execute research tasks on your behalf. CogLoop logs are automatically stored in the `DiscoveryCogLoopLogs_CL` table in the Log Analytics workspace inside the workspace's Managed Resource Group (MRG).

> [!IMPORTANT]
> Check the table's plan and retention settings in the Log Analytics workspace without modifying managed infrastructure. For Basic or Auxiliary tables, use workspace scope and set an explicit time range in the Log Analytics picker or API `timespan`; a KQL time filter doesn't replace it. The available query window depends on the table's plan and configured retention. See [Query Basic and Auxiliary tables](/azure/azure-monitor/logs/basic-logs-query) and [Manage data retention](/azure/azure-monitor/logs/data-retention-configure).

This article explains how to query CogLoop logs to monitor investigation activity, diagnose stalls, and investigate orchestration errors.

## Prerequisites

Before you begin, navigate to the Log Analytics workspace in your workspace's MRG. For instructions, see [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md).

## Key identifiers

Before writing queries, familiarize yourself with the following identifiers:

| Identifier | Description | Where to find it |
|---|---|---|
| `InstanceId` | ID for an investigation's CogLoop instance, such as `cog:{project}:{investigation}-{shortHash}` | Retrieve the full value from logs by using [List all Cognition Engine instances](#list-all-cognition-engine-instances); don't guess the generated suffix. |
| `ModuleName` | Which subloop generated the log: `Act` or `Cognition` | Extracted from the `Properties` JSON field |
| `CorrelationId` | Identifier for related application log entries, when populated | Read the value from matching log entries; don't assume it matches an Activity Log `correlationId` or an API response-header value. |

## Query CogLoop logs

After opening the Logs interface in the workspace's MRG Log Analytics workspace:

1. In the left panel, select the **Tables** tab.
2. Expand **Custom Logs** and locate `DiscoveryCogLoopLogs_CL`.
3. Run the [View recent logs](#view-recent-logs) query to check whether data is available in the selected time range.

:::image type="content" source="media/how-to-query-workspace-logs/open-log-analytics-table.png" alt-text="Screenshot of the workspace Logs page with DiscoveryCogLoopLogs_CL and DiscoveryLogs_CL listed under Custom Logs." lightbox="media/how-to-query-workspace-logs/open-log-analytics-table.png":::

## Log schema

The examples use the following fields and properties in `DiscoveryCogLoopLogs_CL`. Expand the table in the **Tables** pane to inspect its columns, then inspect recent rows and `Properties` values. Adapt the queries if the available fields, properties, or message formats differ.

| Field Name | Description |
|------------|-------------|
| `TimeGenerated` | Timestamp used by Log Analytics for time filtering |
| `TimeStamp` | Application-provided timestamp; inspect populated values before relying on its precision |
| `LogLevel` | Log severity level: `Debug`, `Information`, `Warning`, or `Error` |
| `Message` | Primary log message content |
| `Exception` | Full exception details including stack trace (populated on error entries) |
| `Properties` | JSON object containing structured properties such as `InstanceId`, `ChosenTool`, `ModuleName`, `ClassName`, `MethodName`, and others |
| `CorrelationId` | Identifier for related application log entries, when populated |
| `TenantId` | Workspace ID in the [Azure Monitor standard schema](/azure/azure-monitor/logs/log-standard-columns); verify this custom table's definition before using it as a tenant filter |

### Key Properties (inside the `Properties` JSON field)

| Property | Description |
|----------|-------------|
| `InstanceId` | Cognition Engine instance identifier. Retrieve the full value from logs, including any generated suffix. |
| `ModuleName` | Reasoning module name (`Cognition` or `Act`) |
| `ChosenTool` | The tool/function selected by the PickBest decision engine |
| `ClassName` | Source class name (for example, `CogLoopInstanceManager`, `CosmosDbService`) |
| `MethodName` | Source method name |
| `Goal` | The reasoning prompt goal submitted to the PickBest engine |
| `SleepTime` | Wait duration in seconds when the Cognition Engine decides to wait |
| `TaskName` | Task identifier for task management operations |
| `Attempt` | Retry attempt number for validation operations |
| `Result` | Tool execution result summary |

## Example queries

### View recent logs

```kql
DiscoveryCogLoopLogs_CL
| order by TimeGenerated desc
| take 100
```

### Filter by time range

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(1h)
| order by TimeGenerated desc
```

### View all errors and warnings

Find logged CogLoop errors and warnings in the selected time range. Then, compare them with task status to investigate a session.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(1h)
| where LogLevel in ("Error", "Warning")
| project TimeGenerated, LogLevel, Message
| order by TimeGenerated desc
```

Adjust `ago(1h)` to `ago(6h)`, `ago(1d)`, and so on, as needed.

### Log Volume by Level Over Time

Charts the volume of Cognition Engine log entries per hour by severity level. Each log level renders as a separate line, making it easy to spot error spikes.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| summarize Count = count() by LogLevel, bin(TimeGenerated, 1h)
| order by TimeGenerated desc
| render timechart
```

An error spike identifies a period to investigate. Compare it with task status and other logs before concluding that the service failed or recovered.

### List All Cognition Engine Instances

Lists Cognition Engine instances (investigations) found in the selected log time range and classifies their recorded activity into
three operation types.

- **InstanceId** - Full CogLoop instance ID found in the logs, including any generated suffix.
- **StatusChecks** - Number of matching status-check log entries; compare instances within the same time range.
- **Starts** - Number of log entries mentioning `StartInstanceAsync`; inspect the entries and task status to confirm startup succeeded.
- **Retrievals** - Number of log entries mentioning `GetRunningInstanceAsync`; inspect the messages for state retrieval results.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "IsInstanceRunningAsync" or Message has "StartInstanceAsync" or Message has "GetRunningInstanceAsync"
| extend
    InstanceId = tostring(parse_json(Properties).InstanceId),
    Operation = case(
        Message has "StartInstanceAsync", "Started",
        Message has "GetRunningInstanceAsync", "Retrieved",
        "StatusCheck")
| where isnotempty(InstanceId)
| summarize
    LastSeen = max(TimeGenerated),
    StatusChecks = countif(Operation == "StatusCheck"),
    Starts = countif(Operation == "Started"),
    Retrievals = countif(Operation == "Retrieved")
    by InstanceId
| order by Starts desc, Retrievals desc, LastSeen desc
```

> The sort order puts instances with logged start or retrieval activity at the top. Confirm current status in Discovery Studio rather than treating these counts as proof that an investigation is running.

### Check whether a specific CogLoop instance is running

Verify whether CogLoop is actively monitoring your investigation. Replace `<your-project>` with your project name.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(15m)
| where Message has "IsInstanceRunningAsync"
| extend InstanceId = extract(@"InstanceId: (cog:[^\s]+)", 1, Message)
| where InstanceId has "<your-project>"
| summarize last_checked = max(TimeGenerated) by InstanceId
| order by last_checked desc
```

A recent `last_checked` shows that polling was logged. No results can reflect the selected filters, log availability, or ingestion delay; it doesn't prove that CogLoop stopped monitoring the investigation.

### List all active investigations being monitored

See which investigations CogLoop is currently tracking, useful when you want to confirm whether your investigation is in scope.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(30m)
| where Message has "IsInstanceRunningAsync"
| extend InstanceId = extract(@"InstanceId: (cog:[^\s]+)", 1, Message)
| where isnotempty(InstanceId)
| summarize last_seen = max(TimeGenerated) by InstanceId
| order by last_seen desc
```

### Track Instance Startup

Retrieve logged events for a specific Cognition Engine instance in chronological order within the selected time range. Replace `<your-instance-id>` with the full instance ID retrieved from logs.

- **TimeGenerated** - When the event occurred, sorted oldest-first to reconstruct the sequence of events.
- **LogLevel** - Severity level, useful for spotting where errors or warnings interrupted the instance lifecycle.
- **Message** - The log message content, showing startup steps, reasoning decisions, task operations, and any failures in order.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| extend InstanceId = tostring(parse_json(Properties).InstanceId)
| where InstanceId == "<your-instance-id>"
| project TimeGenerated, LogLevel, Message
| order by TimeGenerated asc
```

> This query helps you review a specific investigation's recorded behavior and identify entries to investigate alongside its current task status.

### View all activity for a specific investigation

Retrieve available CogLoop activity log entries for one investigation within the selected time range. Replace `cog:<your-project>:<your-investigation>` with the `InstanceId` prefix found in your logs.

```kql
DiscoveryCogLoopLogs_CL
| where Message has "cog:<your-project>:<your-investigation>"
| project TimeGenerated, LogLevel, Message
| order by TimeGenerated asc
```

### View errors for a specific investigation

View all errors and warnings for a single investigation instance.

```kql
DiscoveryCogLoopLogs_CL
| where LogLevel in ("Error", "Warning")
| where Message has "cog:<your-project>:<your-investigation>"
    or Exception has "cog:<your-project>:<your-investigation>"
| project TimeGenerated, LogLevel, Message, Exception
| order by TimeGenerated asc
```

### Diagnose why CogLoop isn't making progress

CogLoop enters a wait loop when it's blocked, typically waiting for a running task to complete or for human intervention on a flagged task.

```kql
DiscoveryCogLoopLogs_CL
| where Message has_any ("No task updates", "Skipping redundant action", "Cognition-Wait")
| extend InstanceId = extract(@"InstanceId: (cog:[^\s]+)", 1, Message)
| extend SleepTime = toint(extract(@"wait period of (\d+) seconds", 1, Message))
| project TimeGenerated, LogLevel, InstanceId, SleepTime, Message
| order by TimeGenerated desc
```

## Cognition Reasoning Loop

### Detect Cognition Wait Loops

If the Cognition Engine repeatedly selects `Cognition-Wait`, it can mean tasks are stalled, all work is already complete, or an internal error is preventing progress.

- **IdlePct** - Percentage of logged waits marked `NO UPDATE`. Sustained 100% is a reason to check task state, not proof that the investigation is stuck.
- **AvgSleepSec** - Average logged wait duration. A longer wait doesn't by itself mean that cognition stopped trying.
- **SampleReason** - The LLM's own explanation

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(6h)
| where Message has "PickBest Result" and Message has "Cognition-Wait"
| extend
    WaitResult = iff(Message has "NO UPDATE", "Idle", "Progress"),
    SleepTime = toint(extract(@"sleepTime[^\d]*(\d+)", 1, Message)),
    Reasoning = extract(@""""Reasoning"""":\s*""""([^""""]+)", 1, Message)
| summarize
    Waits = count(),
    IdlePct = round(100.0 * countif(WaitResult == "Idle") / count(), 0),
    AvgSleepSec = round(avg(SleepTime), 0),
    SampleReason = take_any(Reasoning)
    by bin(TimeGenerated, 30m)
| where Waits > 3
| order by TimeGenerated desc
```

> This query groups waits into 30-minute windows and surfaces whether cognition is idle or making progress.

### View Slow and Fast Thinking Activity

Trace the reasoning steps the Cognition Engine takes before acting. Slow thinking indicates complex deliberation; fast thinking indicates straightforward decisions.

- **TimeGenerated** - Timestamp of the matching log entry.
- **ThinkingType** - `FastThinking` or `SlowThinking`, indicating the depth of reasoning applied.
- **Message** - The full thinking output, including the thought content and reasoning context.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(6h)
| where Message has "thinking completed for thought"
| extend ThinkingType = iff(Message has "Slow thinking", "SlowThinking", "FastThinking")
| project TimeGenerated, ThinkingType, Message
| order by TimeGenerated desc
```

> If `SlowThinking` entries dominate, the Cognition Engine is spending significant effort on complex decisions, this may be expected for difficult investigations or could indicate unclear task definitions forcing repeated deep analysis.

## Task Management Operations

### Track Task Execution Lifecycle

Retrieve logged events for a specific task in chronological order, including assignment, agent selection, execution, validation, and completion when recorded. Replace `<your-task-id>` with the target task name.

```kql
let taskId = "<your-task-id>";
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message contains taskId
| project TimeGenerated, LogLevel, Message
| order by TimeGenerated asc
```

> Use these entries to investigate where a task might have stalled or failed. Confirm its current status in Discovery Studio; missing log entries don't establish completion or failure.

### View Task Validation Results

List matching task validation log entries, showing when and how the Cognition Engine evaluated task results. Inspect the `Message` field for validation outcomes such as `Complete`, `Incomplete`, `Needs User Attention`, or `Failed`.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "TASKMANAGEMENT: tool call: ValidateTask"
| project TimeGenerated, Message
| order by TimeGenerated desc
```

> Useful for understanding why a task was marked complete or sent back for rework. If you see repeated `Incomplete` results for the same task, it may indicate the assigned agent is not producing satisfactory output, or the validation criteria are too strict.

### View TaskValidationAgent Lifecycle

Find logged TaskValidationAgent events, including provisioning, upsert, invocation, and completion when recorded. Use these entries to investigate whether the validation agent was created and invoked.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "TaskValidationAgent"
| project TimeGenerated, LogLevel, Message
| order by TimeGenerated asc
```

If no entries appear, first rule out missing or delayed logs. If entries show upsert or invocation errors, verify the validation agent and the model deployment configured for it. See [Discovery Engine startup checks](how-to-debug-task-execution.md#discovery-engine-wont-start).

## Error Diagnostics

### View All Errors with Exceptions

List all error entries with their full exception details for root-cause analysis.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where LogLevel == "Error"
| project TimeGenerated, Message, Exception
| order by TimeGenerated desc
```

### Analyze Error Patterns

Summarize errors by message to identify the most frequent failure modes.

- **ErrorMessage** - The first 80 characters of the error message, used as a grouping key to cluster similar errors together.
- **ErrorCount** - How many times each error was logged. The highest counts identify the most frequent logged errors, not necessarily those with the greatest impact.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where LogLevel == "Error"
| summarize ErrorCount = count() by ErrorMessage = substring(Message, 0, 80)
| order by ErrorCount desc
```

> Start with frequent error types, then compare their timestamps and instance IDs with related errors before assigning a root cause.

### Detect Cosmos DB Connectivity Issues

Cosmos DB health failures can prevent the Cognition Engine from retrieving instance state and stall affected investigations.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "Cosmos DB health check failed" or Message has "Cosmos DB is unreachable"
| summarize FailureCount = count() by bin(TimeGenerated, 15m)
| order by TimeGenerated desc
| render timechart
```

### Detect Serialization Errors (JsonException)

Isolates JSON serialization errors and groups them by message, including a sample stack trace for each. If an instance's state can't be deserialized, its reasoning activity can be blocked.

- **ErrorMessage** - The first 80 characters of the error message, grouping related serialization failures together.
- **Count** - How many times each serialization error occurred. High counts show recurrence in the selected time range; compare affected instances to assess the scope.
- **SampleException** - A full exception with stack trace, showing the exact JSON path and property that failed to deserialize (for example, `AuthorRole`).

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where LogLevel == "Error"
| where Exception has "JsonException"
| summarize
    Count = count(),
    SampleException = take_any(Exception)
    by ErrorMessage = substring(Message, 0, 80)
| order by Count desc
```

Use `SampleException` to identify the JSON path or property that couldn't be deserialized. Compare related instance and polling errors before assigning a cause; the log pattern alone doesn't establish that a service upgrade caused the failure.

### Detect Polling Cycle Failures

Polling cycle errors prevent the Cognition Engine from discovering and starting new work.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "Error during polling cycle"
| project TimeGenerated, Message, Exception
| order by TimeGenerated desc
```

### Error Timeline for Incident Investigation

Correlate errors over time to identify when an incident started and whether it's ongoing.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where LogLevel == "Error"
| summarize ErrorCount = count() by bin(TimeGenerated, 5m)
| order by TimeGenerated desc
| render timechart
```

> Use this query to identify periods with logged errors. Pair it with the [Analyze Error Patterns](#analyze-error-patterns) query and current task status; a drop in logged errors alone doesn't prove recovery.

## Health and Service Status

### Detect Unhealthy Periods

Find time windows where health checks reported unhealthy status, which correlates with service disruptions.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "Health check" and Message has "Unhealthy"
| extend
    HealthCheckName = tostring(parse_json(Properties).HealthCheckName),
    Description = tostring(parse_json(Properties).HealthCheckDescription)
| summarize UnhealthyCount = count() by HealthCheckName, bin(TimeGenerated, 15m)
| order by TimeGenerated desc
| render timechart
```

### Monitor Instance Retrieval Errors

Repeated failures in instance retrieval indicate the service can't load investigation state from Cosmos DB.

```kql
DiscoveryCogLoopLogs_CL
| where TimeGenerated > ago(24h)
| where Message has "Error retrieving all cogloop instances"
| summarize FailureCount = count() by bin(TimeGenerated, 15m)
| order by TimeGenerated desc
| render timechart
```

What to look for in the results:

| Pattern | Meaning |
|---|---|
| Repeated `No task updates during wait period of 60 seconds` | CogLoop is waiting for a running task to finish; check the associated Act task for status |
| `Skipping redundant action: Cognition-Wait with result: NO UPDATE` | Cognition is also blocked; no new decisions are being made |
| Pattern persists for hours | A task may be `FLAGGED_HUMAN` and requires your review in Discovery Studio |

### View CogLoop decision log for an investigation

View the reasoning behind CogLoop's recent decisions, which tool it chose and why. Useful to understand why CogLoop is repeatedly waiting instead of making progress.

```kql
DiscoveryCogLoopLogs_CL
| where Message has "PickBest"
| where Message has "cog:<your-project>:<your-investigation>"
    or CorrelationId == "<your-correlationId>"
| extend chosen_tool = extract(@'"ChosenTool":\s*"([^"]+)"', 1, Message)
| extend confidence = toint(extract(@'"Confidence":\s*(\d+)', 1, Message))
| extend reasoning = extract(@'"Reasoning":\s*"([^"]+)"', 1, Message)
| project TimeGenerated, chosen_tool, confidence, reasoning
| order by TimeGenerated desc
```

The `reasoning` field explains exactly why CogLoop chose to wait or act, it's the most useful field for understanding investigation stalls.

### Detect Act and Cognition subloop errors

The two CogLoop subloops can fail independently. This query breaks down errors by subloop to identify which one is failing.

```kql
DiscoveryCogLoopLogs_CL
| where LogLevel == "Error"
| where Message has_any ("Act loop error", "Cognition loop error")
| extend ModuleName = case(
    Message has "Act loop", "Act",
    Message has "Cognition loop", "Cognition",
    "Unknown"
  )
| summarize error_count = count() by ModuleName, bin(TimeGenerated, 1h)
| order by TimeGenerated desc
```

- **Act loop errors** affect task execution and tool invocation.
- **Cognition loop errors** affect planning and decision-making.
- Errors in both loops simultaneously may indicate a systemic issue such as a service outage or network partition.

### Detect context window saturation

When CogLoop's context window exceeds 80% capacity, it attempts to reset working memory. If that reset also fails because the context is too large, an error is logged.

```kql
DiscoveryCogLoopLogs_CL
| where Message has_any ("Context window saturation", "working memory context reset")
    or (LogLevel == "Error" and Message == "Error during working memory context reset")
| extend event_type = case(
    Message has "80%", "Warning: Context window near full",
    Message == "Error during working memory context reset", "Error: Reset failed",
    "Other"
  )
| project TimeGenerated, LogLevel, event_type, Message, Exception
| order by TimeGenerated asc
```

> [!NOTE]
> This error indicates the investigation has accumulated a large context. CogLoop attempted to compress it but the summary was too large for the model's input limit. If this error repeats without recovery, the investigation may be stuck. Contact your Discovery administrator.

### Detect circuit breaker events

A circuit breaker opening means that repeated LLM API call failures caused CogLoop to pause sending requests temporarily to prevent cascading failures.

```kql
DiscoveryCogLoopLogs_CL
| where LogLevel == "Error"
| where Exception has "BrokenCircuitException"
| project TimeGenerated, LogLevel, Message, Exception
| order by TimeGenerated desc
```

> [!NOTE]
> Circuit breaker events typically self-heal when the circuit resets after a cooldown period. If they persist, contact Microsoft Support.

## Troubleshooting

### No data in DiscoveryCogLoopLogs_CL

| Cause | Resolution |
|---|---|
| Workspace was recently created and no investigations have run | Run an investigation to generate log entries |
| Time range is too narrow | Expand the time range to the last 24 hours |
| Logs are delayed due to ingestion latency | Allow for ingestion latency and rerun the query. See [Log ingestion latency](concept-observability.md#log-ingestion-latency). |

### Investigation appears stuck with no progress

| Cause | Resolution |
|---|---|
| A task is in `FLAGGED_HUMAN` state | Open the investigation in Discovery Studio and address the flagged task |
| CogLoop is waiting for a running tool task to complete | Check Supercomputer logs for the associated job. See [Query supercomputer logs](how-to-query-supercomputer-logs.md) |
| Context window saturation reset failed | Contact your Discovery administrator |

### Serialization Errors Blocking All Instances

**Possible Causes:**

- A Cognition Engine instance has working memory state that can't be deserialized (for example, after a service upgrade that changes model schemas)
- Corrupted instance data in Cosmos DB

**Resolution:**

1. Run the [Detect Serialization Errors](#detect-serialization-errors-jsonexception) query to confirm the error pattern
2. Look at the `Exception` field for the specific JSON path and property that fails
3. Escalate to the service team with the instance ID and exception details

### Tasks Not Being Validated

**Possible Causes:**

- TaskValidationAgent isn't deployed in the workspace
- The validation agent's configured model deployment isn't available.

**Resolution:**

1. Run the [View TaskValidationAgent Lifecycle](#view-taskvalidationagent-lifecycle) query to check if the agent was created
2. Look for upsert failures or provisioning errors
3. Verify the required model deployment exists in the workspace

### Query timeout or slow performance

| Cause | Resolution |
|---|---|
| Query scope is too broad | Narrow the time range or filter by `InstanceId` |
| Large dataset with no filters | Add filters on `LogLevel`, `InstanceId`, or `Message` before aggregating |

## Related content

- [Observability in Microsoft Discovery](concept-observability.md)
- [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md)
- [Query workspace logs](how-to-query-workspace-logs.md)
- [Query supercomputer logs](how-to-query-supercomputer-logs.md)
- [View activity logs for Microsoft Discovery resources](how-to-view-activity-logs.md)
