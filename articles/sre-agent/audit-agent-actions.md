---
title: Audit Agent Actions in Azure SRE Agent
description: Query your agent's actions, tool calls, and incident outcomes using Application Insights telemetry and KQL.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: audit, telemetry, application-insights, kql, custom-events, tool-execution, incident-tracking, model-generation
#customer intent: As an SRE, I want to query my agent's actions in Application Insights so that I can audit tool calls, track incident outcomes, and understand token consumption.
---

# Audit agent actions in Azure SRE Agent
Every agent action, including tool calls, model invocations, incident handling, and approval decisions, is logged to your Application Insights resource. Query the `customEvents` table by using Kusto Query Language (KQL) to see exactly what your agent did, when, and why. Access logs directly from **Monitor** > **Logs** in the agent portal.

## Where to find your logs

Your agent automatically logs all actions to Azure Application Insights. An Application Insights resource is provisioned alongside your agent during creation.

To access your logs:

1. In the agent portal, go to **Monitor** > **Logs**.
1. This action opens your agent's Application Insights resource in the Azure portal.
1. Use KQL to query the `customEvents` table.

The default query is `traces | where timestamp > ago(1d)`. Change this query to `customEvents` to see agent action telemetry.

## Event types

Your agent logs 10 custom event types to the `customEvents` table. The following query shows all event types and their counts:

```kql
customEvents
| summarize Count = count() by name
| sort by Count desc
```

:::image type="content" source="media/audit-agent-actions/kql-event-summary-results.png" alt-text="Screenshot of KQL query results showing customEvents summarized by name including AgentToolExecution, AgentResponse, ModelGeneration, and other event types with their counts." lightbox="media/audit-agent-actions/kql-event-summary-results.png":::

| Event name | What it captures | Typical volume |
|---|---|---|
| `AgentResponse` | Chat responses sent to you | High |
| `ModelGeneration` | Every LLM call (input/output tokens, model ID) | High |
| `AgentToolExecution` | Every tool call (name, input, output) | High |
| `AgentExecution` | Subagent start/end lifecycle | Medium |
| `MetaAgent` | Meta-agent routing decisions | Medium |
| `AgentHandoff` | Subagent-to-subagent handoffs | Medium |
| `IncidentActivitySnapshot` | Incident lifecycle (severity, status, mitigation outcome) | Low |
| `AgentAzCliExecution` | Azure CLI commands run by the agent | Low |
| `AzCliExecution` | Azure CLI commands run via the portal | Low |
| `ApprovalDecision` | Your approval or rejection of proposed actions | Low |

## Key events and their fields

The following sections describe the most commonly queried event types and their fields.

### Tool execution (AgentToolExecution)

The system logs this event every time your agent calls a tool. The system logs separate start and end events.

| Field | Description | Example value |
|---|---|---|
| `EventType` | `ToolStart` or `ToolEnd` | `ToolStart` |
| `ToolName` | Name of the tool | `SearchResource` |
| `ToolDescription` | What the tool does | `Searches for Azure resources using flexible filters` |
| `ToolInput` | Arguments passed to the tool | `{"resourceTypes": ["microsoft.resources/subscriptions"]}` |
| `ToolOutput` | Result returned (end only) | *(tool output JSON)* |
| `SubAgentName` | Which subagent invoked the tool | `meta_agent` |
| `ThreadId` | Conversation thread ID | `aaaabbbb-0000-cccc-1111-dddd2222eeee` |
| `CallId` | Correlation ID for start/end pairing | `call_aaaabbbb-0000-cccc-...` |

```kql
// List all tools your agent used in the last 7 days
customEvents
| where name == "AgentToolExecution"
| where customDimensions.EventType == "ToolStart"
| where timestamp > ago(7d)
| project timestamp,
    Tool = tostring(customDimensions.ToolName),
    SubAgent = tostring(customDimensions.SubAgentName),
    Input = tostring(customDimensions.ToolInput)
| sort by timestamp desc
```

:::image type="content" source="media/audit-agent-actions/kql-tool-execution-results.png" alt-text="Screenshot of KQL query results showing AgentToolExecution events with timestamp, ToolName, SubAgent, and JSON input." lightbox="media/audit-agent-actions/kql-tool-execution-results.png":::

### Incident lifecycle (IncidentActivitySnapshot)

Log this event for every incident your agent handles. It captures the full lifecycle from creation to resolution.

| Field | Description | Example value |
|---|---|---|
| `IncidentId` | Platform incident ID | `Q2VVG0T8K7AL0J` |
| `IncidentTitle` | Incident description | `DailyIssueTriager blocked: cannot access repo` |
| `IncidentSeverity` | Severity from your platform | `Not set` |
| `IncidentStatus` | Current status | `active` |
| `IncidentPlatform` | Source platform | `PagerDuty` |
| `IncidentMitigatedByAgent` | Whether agent resolved it | `True` or `False` |
| `IncidentAssistedByAgent` | Whether agent helped investigate | `True` or `False` |
| `AgentAutonomyLevel` | How the agent handled it | `autonomous` or `review` |
| `ResponsePlanId` | Which response plan was used | `PDtrigger` |
| `ResponsePlanCustom` | Default or custom plan | `True` or `False` |
| `IncidentImpactedService` | Affected service | `SRE Agent` |
| `IncidentCreatedOn` | When incident was created | ISO 8601 datetime |
| `IncidentHandledOn` | When agent started handling | ISO 8601 datetime |
| `IncidentMitigatedOn` | When resolved (if mitigated) | ISO 8601 datetime |

```kql
// Incident outcomes over the last 30 days
customEvents
| where name == "IncidentActivitySnapshot"
| where timestamp > ago(30d)
| project timestamp,
    IncidentId = tostring(customDimensions.IncidentId),
    Title = tostring(customDimensions.IncidentTitle),
    Platform = tostring(customDimensions.IncidentPlatform),
    MitigatedByAgent = tostring(customDimensions.IncidentMitigatedByAgent),
    AssistedByAgent = tostring(customDimensions.IncidentAssistedByAgent),
    Autonomy = tostring(customDimensions.AgentAutonomyLevel),
    ResponsePlan = tostring(customDimensions.ResponsePlanId)
| sort by timestamp desc
```

### Model generation (ModelGeneration)

Log this event for every LLM call. It tracks token usage, model selection, and which subagent made the request.

| Field | Description | Example value |
|---|---|---|
| `EventType` | `ModelGenerationStart`, `ModelGenerationEnd`, or `ModelGenerationError` | `ModelGenerationEnd` |
| `AgentName` | Subagent that made the LLM call | `daily_report_agent` |
| `ModelId` | Model used | `gpt-5` |
| `InputTokens` | Tokens in the prompt | `29828` |
| `OutputTokens` | Tokens in the response | `871` |
| `ThreadId` | Conversation thread | `bb171c1f-3bb2-4895-...` |

```kql
// Token usage by subagent in the last 7 days
customEvents
| where name == "ModelGeneration"
| where customDimensions.EventType == "ModelGenerationEnd"
| where timestamp > ago(7d)
| extend Agent = tostring(customDimensions.AgentName),
    InputTokens = toint(customDimensions.InputTokens),
    OutputTokens = toint(customDimensions.OutputTokens),
    Model = tostring(customDimensions.ModelId)
| summarize TotalInput = sum(InputTokens),
    TotalOutput = sum(OutputTokens),
    Calls = count()
    by Agent, Model
| sort by TotalInput desc
```

### Approval decisions (ApprovalDecision)

Log this event when you approve or reject a proposed agent action.

```kql
// All approval decisions
customEvents
| where name == "ApprovalDecision"
| where timestamp > ago(30d)
| project timestamp, customDimensions
```

## Common queries

Use the following KQL queries to answer common questions about your agent's behavior.

### What did my agent do in a specific thread?

```kql
customEvents
| where timestamp > ago(7d)
| where tostring(customDimensions.ThreadId) == "<YOUR_THREAD_ID>"
| project timestamp,
    Event = name,
    EventType = tostring(customDimensions.EventType),
    Tool = tostring(customDimensions.ToolName),
    Agent = tostring(customDimensions.SubAgentName)
| sort by timestamp asc
```

Replace `<YOUR_THREAD_ID>` with the thread ID from your conversation.

### Which tools are used most often?

```kql
customEvents
| where name == "AgentToolExecution"
| where customDimensions.EventType == "ToolStart"
| where timestamp > ago(30d)
| summarize Count = count() by Tool = tostring(customDimensions.ToolName)
| sort by Count desc
| take 20
```

### How many incidents did the agent mitigate versus assist?

```kql
customEvents
| where name == "IncidentActivitySnapshot"
| where timestamp > ago(30d)
| summarize
    Total = count(),
    MitigatedByAgent = countif(tostring(customDimensions.IncidentMitigatedByAgent) == "True"),
    AssistedByAgent = countif(tostring(customDimensions.IncidentAssistedByAgent) == "True")
```

### Daily token consumption trend

```kql
customEvents
| where name == "ModelGeneration"
| where customDimensions.EventType == "ModelGenerationEnd"
| where timestamp > ago(30d)
| extend InputTokens = toint(customDimensions.InputTokens),
    OutputTokens = toint(customDimensions.OutputTokens)
| summarize TotalTokens = sum(InputTokens) + sum(OutputTokens) by bin(timestamp, 1d)
| render timechart
```

## Shared fields on all events

Every custom event includes the following fields for correlation and tracing.

| Field | Description |
|---|---|
| `gen_ai.agent.id` | Azure Resource Manager ID of your agent |
| `gen_ai.agent.name` | Agent name |
| `TraceId` | OpenTelemetry trace ID which correlates events across a single request |
| `SpanId` | OpenTelemetry span ID |
| `ParentSpanId` | Parent span for call hierarchy |
| `ThreadId` | Conversation thread GUID |
| `LogTimestamp` | ISO 8601 timestamp |
| `CorrelationId` | Short correlation ID for log grouping |

Use `TraceId` to follow a single request from user input through agent reasoning, tool calls, and response.

## Azure Activity Log

For Azure resource-level operations such as creating, updating, or deleting the agent resource, use the Azure Activity Log. The Activity Log captures all Azure Resource Manager operations on your agent, managed identity, and Application Insights resources.

Access the Activity Log in the [Azure portal](https://portal.azure.com) under your agent's resource group.

## Next step

> [!div class="nextstepaction"]
> [Track incident value](./track-incident-value.md)

## Related content

- [Track incident value](track-incident-value.md)
- [Monitor agent usage](monitor-agent-usage.md)
- [Run modes](run-modes.md)
- [Permissions](permissions.md)
