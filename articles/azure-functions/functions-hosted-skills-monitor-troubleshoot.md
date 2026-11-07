---
title: Monitor and troubleshoot hosted skills in Azure Functions
description: "Learn how to monitor Azure Functions hosted skills in Application Insights and troubleshoot model, workflow, and connector failures."
ms.topic: how-to
ms.date: 11/05/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to monitor hosted skills and investigate failures, token usage, and slow execution.
---

# Monitor and troubleshoot hosted skills in Azure Functions

In this article, you configure Application Insights to collect telemetry from [Azure Functions hosted skills](functions-hosted-skills.md). You use Kusto Query Language (KQL) queries to trace invocations, find tool failures, and analyze token usage and latency. You also use the Durable Task Scheduler (DTS) dashboard to inspect dynamic workflows and Azure CLI to troubleshoot connector failures.

Hosted skills use OpenTelemetry for runtime telemetry. You can export this data to Application Insights or another destination with a compatible OpenTelemetry provider and exporter. The Functions host and the hosted skills Python worker require separate telemetry configuration. This article uses Application Insights. For configuration options for other destinations, see [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md?pivots=programming-language-python).

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

## Prerequisites

+ An existing hosted skills app. To create one, see [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md).
+ An Application Insights resource and permission to query its connected Log Analytics workspace.
+ For the command examples, [Azure CLI](/cli/azure/install-azure-cli) and an authenticated session in the correct subscription. Choose the Bash or PowerShell tab and use the same shell throughout the investigation.
+ For workflow inspection, the app's storage backend and task hub name. DTS dashboard access also requires the applicable [data access role](/azure/durable-task/scheduler/durable-task-scheduler-dashboard).

Telemetry fields vary by runtime version and model provider. For the fields supported by your runtime version, see the [runtime observability reference](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md).

## Start an investigation

Before you query telemetry, identify the app, symptom, and UTC time range. If available, record the agent slug, session ID, `OperationId`, and `workflow_id` to filter related records. The agent slug comes from the `.agent.md` file name, not its display name.

Check the function invocation, tool result, and downstream operation separately:

| Result | What to check |
| --- | --- |
| Function invocation | The invocation completed without a host-reported failure. |
| Tool result | The tool returned the expected result, rather than only a successful HTTP status. |
| Downstream operation | The expected email, message, record, or other change exists in the connected service. |

For a deployed app, check [Azure Resource Health](/azure/service-health/resource-health-overview) and recent configuration or deployment changes before you investigate individual calls.

### [Bash](#tab/bash)

```bash
SubscriptionId="<subscription-id>"
ResourceGroup="<resource-group>"
AppName="<function-app-name>"

AppId=$(az functionapp show --subscription "$SubscriptionId" \
  --resource-group "$ResourceGroup" --name "$AppName" --query id --output tsv) || {
  printf '%s\n' "Cannot read the Function App." >&2
  exit 1
}

az rest --method get \
  --url "https://management.azure.com$AppId/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2022-10-01" \
  --query "properties.{state:availabilityState,summary:summary,reportedTime:reportedTime}" \
  --output json

az monitor activity-log list --subscription "$SubscriptionId" \
  --resource-id "$AppId" --offset 24h --max-events 20 \
  --query "[].{time:eventTimestamp,operation:operationName.value,status:status.value}" \
  --output table
```

### [PowerShell](#tab/powershell)

```powershell
$SubscriptionId = "<subscription-id>"
$ResourceGroup = "<resource-group>"
$AppName = "<function-app-name>"

$AppId = az functionapp show --subscription $SubscriptionId `
  --resource-group $ResourceGroup --name $AppName --query id --output tsv
if ($LASTEXITCODE -ne 0) { throw "Cannot read the Function App." }

az rest --method get `
  --url "https://management.azure.com$AppId/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2022-10-01" `
  --query "properties.{state:availabilityState,summary:summary,reportedTime:reportedTime}" `
  --output json

az monitor activity-log list --subscription $SubscriptionId `
  --resource-id $AppId --offset 24h --max-events 20 `
  --query "[].{time:eventTimestamp,operation:operationName.value,status:status.value}" `
  --output table
```

---

If a check fails because of permissions or service support, record that result as not verified. An empty result doesn't prove that the app was healthy during the incident.

## Enable Application Insights telemetry

1. In `requirements.txt`, add the `[monitor]` Python package extra to the runtime package. An extra installs optional dependencies along with a package. The `monitor` extra installs the additional Azure Monitor telemetry libraries:

   ```text
   azurefunctions-agents-runtime[monitor]
   ```

   If the package already has a version constraint, keep that constraint and add `[monitor]` to the package name.

1. Set `APPLICATIONINSIGHTS_CONNECTION_STRING` in the Function App's environment variables. For local execution, set it in the `Values` object in `local.settings.json`. Don't commit the connection string or `local.settings.json`.

1. To also export Functions host telemetry in OpenTelemetry format, add `telemetryMode` to the root of your existing `host.json` file:

   ```json
   {
     "version": "2.0",
     "telemetryMode": "OpenTelemetry"
   }
   ```

   Keep the app's existing extension, routing, and Durable Functions settings.

1. Install the updated dependencies and deploy the app.

The runtime configures the Azure Monitor exporter when the `monitor` package extra and connection string are present. If an OpenTelemetry provider is already active, the runtime uses that provider instead. Check its exporter configuration to confirm the destination.

`telemetryMode` controls the host. It doesn't, by itself, export runtime spans from the Python worker. Don't add another exporter or enable worker auto-instrumentation without checking the existing setup. For the host and worker options, see [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md).

### Confirm that telemetry arrives

Use a read-only test invocation, or an approved test with a known result. Record its UTC time. Allow for ingestion delay before you search. Don't repeat a write operation only because its telemetry didn't arrive.

In Application Insights, use **Transaction Search** to find the invocation. Inspect its dependencies and exceptions. In the connected Log Analytics workspace, use the queries in the next sections.

| Telemetry | Workspace table | Use |
| --- | --- | --- |
| Functions host requests | `AppRequests` | Trigger execution, status, and duration. |
| Runtime, model, and tool spans | `AppDependencies` | Agent execution and nested operations. |
| Text logs and exported non-exception span events | `AppTraces` | Host or app logs and lifecycle events. |
| Recorded exceptions | `AppExceptions` | Exception details and related operations. |
| Exported metrics | `AppMetrics` | Aggregated measurements, when the active instrumentation exports them. |

Runtime internal text logs don't necessarily reach the application's `AppTraces` table. They use a system logger in the Functions Python worker. This logger differs from span events that the Azure Monitor trace exporter converts to trace records. Don't search only for text such as `Agent response:` to determine whether a run occurred.

## Query hosted skill execution

The following queries use the Log Analytics workspace schema. In the workspace connected to Application Insights, select **Logs**. Run this query to find the available `AppRoleName` values, then replace `<app-role-name>` in the remaining queries with your app's role name:

```kusto
union AppRequests, AppDependencies, AppTraces
| where TimeGenerated > ago(24h)
| summarize Records = count() by AppRoleName
| order by Records desc
```

If multiple resources share the same role name, also filter on `_ResourceId`. Queries run from an Application Insights resource use different table and column names:

| Workspace schema | Application Insights schema |
| --- | --- |
| `AppDependencies`, `AppRequests`, `AppTraces`, `AppExceptions` | `dependencies`, `requests`, `traces`, `exceptions` |
| `TimeGenerated` | `timestamp` |
| `OperationId`, `ParentId` | `operation_Id`, `operation_ParentId` |
| `Properties` | `customDimensions` |
| `DurationMs` | `duration` (a timespan, not a number of milliseconds) |
| `AppRoleName` | `cloud_RoleName` |

### Find recent runs

The runtime adds `af.*` attributes to its spans. The following query uses `af.lifecycle_stage` to select agent runs and returns their duration, outcome, and session ID:

```kusto
AppDependencies
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| where tostring(Properties["af.lifecycle_stage"]) == "agent_run"
| extend Agent = tostring(Properties["af.agent.name"]),
         Outcome = tostring(Properties["af.agent.outcome"]),
         SessionId = tostring(Properties["af.agent.session_id"])
| project TimeGenerated, Agent, Outcome, DurationMs,
          SessionId, OperationId, Id
| order by TimeGenerated desc
| take 50
```

### Follow one operation

To view the requests, dependencies, logs, and exceptions for a run, copy its `OperationId` into the following query:

```kusto
union withsource=TableName
    AppRequests, AppDependencies, AppTraces, AppExceptions
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| where OperationId == "<operation-id>"
| project TimeGenerated, TableName, Name, Message, OuterMessage,
          Success, DurationMs, OperationId, ParentId
| order by TimeGenerated asc
```

An operation ID identifies a trace, not a complete conversation or every asynchronous workflow operation. Use the session ID for related agent turns and `workflow_id` for a dynamic workflow. Don't assume that every external service propagates the trace context.

### Find tool errors in otherwise successful runs

A hosted skill can recover from a tool failure and return a response. The following query finds successful runs with a nonzero tool error count:

```kusto
AppDependencies
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| where tostring(Properties["af.lifecycle_stage"]) == "agent_run"
| extend Agent = tostring(Properties["af.agent.name"]),
         Outcome = tostring(Properties["af.agent.outcome"]),
         ToolErrors = tolong(Properties["af.agent.tool_error_count"])
| where Outcome == "success" and ToolErrors > 0
| project TimeGenerated, Agent, ToolErrors, OperationId
| order by TimeGenerated desc
```

This counter detects supported tool error results and recoverable delegation failures. It doesn't validate every business operation. A zero count isn't proof that an email or other external change occurred.

### Investigate sandbox, HTTP, and delegation failures

The following query finds spans with sandbox, HTTP request, or delegation errors:

```kusto
AppDependencies
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| extend FaultDomain = tostring(Properties["af.fault_domain"]),
         StderrPresent = tostring(Properties["af.dynamic_session.stderr_present"]),
         DelegateOutcome = tostring(Properties["af.delegate.outcome"]),
         BlockedReason = tostring(Properties["af.web_request.blocked_reason"])
| where FaultDomain in ("sandbox", "web_request", "delegate")
    or StderrPresent == "true"
    or DelegateOutcome in ("error", "timeout")
| project TimeGenerated, Name, FaultDomain, Success, DurationMs,
          DelegateOutcome, BlockedReason, OperationId
| order by TimeGenerated desc
```

The `af.fault_domain` attribute identifies the runtime component associated with a failure. Some failures have an `unknown` value or no fault-domain attribute, so inspect the related spans to determine the cause. For sandbox calls, inspect `dynamic_session.execute` and the session ID. For HTTP tools, inspect the target host, status, and blocked reason. For delegation, inspect the specialist outcome and timeout.

## Analyze token usage and latency

Use the following queries to analyze model token usage, model call duration, and agent invocation duration. Measure the total elapsed time of a scenario separately from its individual model and tool calls.

### Available measurements

The queries use the following fields from `AppDependencies`. Token usage is included only when reported by the model provider. These measurements don't require `ENABLE_SENSITIVE_DATA=true`.

| Measurement | Field | Description |
| --- | --- | --- |
| Input tokens | `gen_ai.usage.input_tokens` | Number of input tokens reported for a model call. |
| Output tokens | `gen_ai.usage.output_tokens` | Number of output tokens reported for a model call. |
| Model call duration | `DurationMs` on the model call record | Client-observed call time in milliseconds, including receipt of the response stream for streaming calls. |
| Agent invocation duration | `DurationMs` on the agent invocation record | Agent execution time in milliseconds, including model and tool calls. |

Model call duration isn't limited to the model server's compute time.

### Query model token usage and duration

The following query shows input and output token usage and the median and 95th-percentile duration of model calls over the last 24 hours, grouped by model. Replace `<app-role-name>` with your function app's role name.

The query selects `chat` operations. If your model calls use a different operation, update the `gen_ai.operation.name` filter. Don't add agent-level usage totals to model call totals, because they can include the same calls.

```kusto
AppDependencies
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| where tostring(Properties["gen_ai.operation.name"]) == "chat"
| extend Model = coalesce(
             tostring(Properties["gen_ai.response.model"]),
             tostring(Properties["gen_ai.request.model"])),
         InputTokens = tolong(Properties["gen_ai.usage.input_tokens"]),
         OutputTokens = tolong(Properties["gen_ai.usage.output_tokens"])
| summarize RecordedCalls = count(),
            CallsWithInputUsage = countif(isnotnull(InputTokens)),
            CallsWithOutputUsage = countif(isnotnull(OutputTokens)),
            RecordedInputTokens = sum(InputTokens),
            RecordedOutputTokens = sum(OutputTokens),
            P50CallMs = percentile(DurationMs, 50),
            P95CallMs = percentile(DurationMs, 95)
    by Model
| order by RecordedInputTokens desc
```

Use `CallsWithInputUsage` and `CallsWithOutputUsage` to check how many calls include token usage. A total of zero doesn't indicate zero token usage when no calls report usage.

### Compare complete scenarios and their parts

The following query groups invocation duration, outcomes, and tool errors by agent and hour:

```kusto
AppDependencies
| where TimeGenerated > ago(24h)
| where AppRoleName == "<app-role-name>"
| where tostring(Properties["af.lifecycle_stage"]) == "agent_run"
| extend Agent = tostring(Properties["af.agent.name"]),
         Outcome = tostring(Properties["af.agent.outcome"]),
         ToolCalls = tolong(Properties["af.agent.tool_call_count"]),
         ToolErrors = tolong(Properties["af.agent.tool_error_count"])
| summarize RecordedRuns = count(),
            RecordedFailures = countif(Outcome == "error" or Success == false),
            RunsWithToolErrors = countif(ToolErrors > 0),
            AvgToolCalls = avg(ToolCalls),
            P50RunMs = percentile(DurationMs, 50),
            P95RunMs = percentile(DurationMs, 95)
    by Agent, bin(TimeGenerated, 1h)
| order by TimeGenerated desc
```

For a direct invocation, the runtime span measures the agent execution boundary. It doesn't include every upstream delay, such as time in a queue before the Function starts. For an asynchronous workflow, measure orchestration start to completion separately.

| Level | Measurements | Use |
| --- | --- | --- |
| Complete scenario | Elapsed time, verified business result, and total model usage across related work. | Evaluate the effect of a change on the user's result. |
| Agent invocation | Duration, outcome, tool calls, tool errors, and related model usage. | Find tool loops or repeated agent turns. |
| Model call | Input and output tokens and call duration. | Find large context, repeated model calls, or slow model responses. |
| Tool or workflow task | Duration, retries, errors, and the result in the connected service. | Find slow dependencies, repeated work, or failed writes. |

If each agent has one purpose, use `af.agent.name` as the initial comparison group. If one agent serves several scenarios, add an application-defined scenario ID through custom instrumentation. Also record a configuration or evaluation version. The runtime doesn't automatically add a business scenario ID or a result-quality score. Use bounded labels without customer data.

For a per-scenario report, first aggregate model usage for each related invocation. Then combine it with the invocation duration and the verified business result. Include specialists and workflow tasks that belong to the scenario. A coordinator's totals don't automatically include all specialist usage.

When comparing usage and duration:

+ Count each model usage record once. Don't sum both parent aggregates and child calls.
+ Don't add parallel call durations to calculate elapsed time. Show total call time and scenario elapsed time as separate values.
+ Keep missing usage and timing values separate from reported zeros.
+ Use the same workload, model, configuration, time range, and sampling policy for each comparison.
+ Account for sampling when interpreting counts and token totals. Sampled telemetry doesn't include every call and isn't a billing record.
+ Check provider definitions before adding reasoning or cache tokens to input and output totals. These values can be subsets or separate categories.
+ Don't calculate an exact charge from token counts alone. Pricing also depends on the model, cache rules, and billing agreement.

## Inspect dynamic workflows with DTS

When your app uses DTS, you can inspect workflow execution in the task hub dashboard. For backend setup, see [Create and run dynamic workflows](functions-hosted-skills-dynamic-workflows-how-to.md). The local emulator dashboard normally uses `http://localhost:8082`; use the mapped port for your emulator.

1. Copy the `workflow_id` returned when the workflow starts.
1. Open your scheduler and task hub, then find the orchestration by instance ID.
1. Select **Input** to view the submitted plan in the `tasks` array. Check task IDs, task types, `depends_on`, tool arguments, and wait conditions. Depending on the runtime version, the input can also include execution policy and workflow-agent metadata.
1. Select **Flow** to view the execution flow. Use **Timeline** to find long-running activities, parallel work, and timer waits.
1. Select **History** to view event order, activity failures, and retries. Select an activity to inspect its input and output.
1. Compare the plan with custom status and final output. For data-driven plans, include expanded task instances and skipped tasks in the comparison.

The input describes the submitted directed acyclic graph (DAG). The Flow view shows execution. With `when` or `for_each`, the submitted plan and the executed task instances can differ. Custom status can be a string or a structured object, depending on the plan and runtime version.

> [!IMPORTANT]
> A DTS status of `Completed` doesn't always mean business success. Cooperative cancellation and some controlled runtime failures return an output object. The hosted skills status API maps `output.canceled` to `Canceled` and `output.failed` to `Failed`. Also inspect task results when a plan permits `continue_on_error`.

For a workflow that doesn't finish, check the following:

| Check | What to look for |
| --- | --- |
| Wait task | An intentional durable timer that hasn't expired. |
| Worker and task hub | Connected workers, queued work, matching backend settings, and the correct task hub. |
| Task execution policy | Retry attempts, attempt deadlines, and the effective policy saved with the plan. |
| Deployment changes | Removed agents or tools, or changed grants that prevent pending activities from running. |
| Status lookup | The correct agent and session. A lookup from another scope can return not found. |
| Completion delivery | A completed workflow whose final result didn't reach the chat client or the app's result sink. |

You can also inspect and manage workflows with runtime tools such as `fhs_get_workflow_status`, `fhs_list_workflows`, and `fhs_cancel_workflow`. Earlier runtime versions use unprefixed names. Check the tools available in your installed version.

The Function that starts a workflow can finish before the workflow does. For noninteractive triggers, verify that a final task stores or delivers the result. Don't expect a background trigger to receive the chat UI's completion notification.

Don't restart, terminate, or purge an instance as the first diagnostic step. Capture the evidence first. A timeout or cancellation doesn't guarantee that external work stopped. Use [idempotent operations](functions-idempotent.md) to prevent duplicate effects. Before removing the last workflow-enabled agent or changing its backend, finish or terminate active instances through an approved procedure.

For dashboard access and controls, see [Debug and manage orchestrations with the DTS dashboard](/azure/durable-task/scheduler/durable-task-scheduler-dashboard).

## Investigate connector connections and operations

Check the connection, caller identity, MCP contract, and business result in that order. For background events, also check the connector trigger configuration. For the resource model, see [Use managed connectors in Azure Functions](functions-connectors-overview.md).

### Use skills

Install the [Azure Functions skills plugin](https://github.com/Azure/azure-functions-skills#readme) in a supported coding agent. Use a version that includes `azure-functions-connector-validate`. For example, request:

```text
Use azure-functions-connector-validate to investigate the connector used by
this hosted skill. Start with read-only checks. Check connection state,
the Function App identity's access policy, MCP configuration, tool discovery,
and the recorded tool result. Report each check as pass, fail, or not verified.
Don't change resources, repeat a write, or expose secrets.
```

Provide the app, resource group, subscription, connection name, expected operation, and incident time range. Don't provide tokens, keys, or callback URLs.

Ask the agent to show the redacted command and evidence for each result. A check under the developer's identity doesn't prove that the deployed Function App identity can call the connector.

### Use Azure CLI

Set the resource identifiers. These commands use the Connector Namespace preview API.

#### [Bash](#tab/bash)

```bash
SubscriptionId="<subscription-id>"
ResourceGroup="<resource-group>"
AppName="<function-app-name>"
Namespace="<connector-namespace-name>"
ConnectionName="<connection-name>"
ApiVersion="2026-05-01-preview"

GatewayId="/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Web/connectorGateways/$Namespace"
ArmBase="https://management.azure.com$GatewayId"
```

#### [PowerShell](#tab/powershell)

```powershell
$SubscriptionId = "<subscription-id>"
$ResourceGroup = "<resource-group>"
$AppName = "<function-app-name>"
$Namespace = "<connector-namespace-name>"
$ConnectionName = "<connection-name>"
$ApiVersion = "2026-05-01-preview"

$GatewayId = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Web/connectorGateways/$Namespace"
$ArmBase = "https://management.azure.com$GatewayId"
```

---

**Check connection state:**

#### [Bash](#tab/bash)

```bash
az rest --method get \
  --url "$ArmBase/connections?api-version=$ApiVersion" \
  --query "value[].{name:name,connector:properties.connectorName,status:properties.overallStatus}" \
  --output table
```

#### [PowerShell](#tab/powershell)

```powershell
az rest --method get `
  --url "$ArmBase/connections?api-version=$ApiVersion" `
  --query "value[].{name:name,connector:properties.connectorName,status:properties.overallStatus}" `
  --output table
```

---

Find the intended connection and confirm that its status is `Connected`. Confirm separately that the correct downstream account authorized it. Don't infer that account from the display name alone.

**Compare the deployed identity with connection access policies:**

#### [Bash](#tab/bash)

```bash
az functionapp identity show --subscription "$SubscriptionId" \
  --resource-group "$ResourceGroup" --name "$AppName" \
  --query "{type:type,systemAssignedPrincipalId:principalId,userAssignedPrincipalIds:userAssignedIdentities.*.principalId}" \
  --output json

az rest --method get \
  --url "$ArmBase/connections/$ConnectionName/accessPolicies?api-version=$ApiVersion" \
  --query "value[].{principalId:properties.principal.identity.objectId,tenantId:properties.principal.identity.tenantId}" \
  --output table
```

#### [PowerShell](#tab/powershell)

```powershell
az functionapp identity show --subscription $SubscriptionId `
  --resource-group $ResourceGroup --name $AppName `
  --query "{type:type,systemAssignedPrincipalId:principalId,userAssignedPrincipalIds:userAssignedIdentities.*.principalId}" `
  --output json

az rest --method get `
  --url "$ArmBase/connections/$ConnectionName/accessPolicies?api-version=$ApiVersion" `
  --query "value[].{principalId:properties.principal.identity.objectId,tenantId:properties.principal.identity.tenantId}" `
  --output table
```

---

Compare the policy with the identity selected for this MCP server. `auth.client_id` selects a user-assigned identity; otherwise runtime configuration and the credential chain determine the caller. A client ID and a principal object ID aren't the same value.

**Inspect the MCP server configuration:**

#### [Bash](#tab/bash)

```bash
az rest --method get \
  --url "$ArmBase/mcpserverconfigs?api-version=$ApiVersion" \
  --query "value[].{name:name,state:properties.state,endpointSet:properties.mcpEndpointUrl != null,connectors:properties.connectors[].{name:name,connection:connectionName,operations:operations[].name}}" \
  --output json
```

#### [PowerShell](#tab/powershell)

```powershell
az rest --method get `
  --url "$ArmBase/mcpserverconfigs?api-version=$ApiVersion" `
  --query "value[].{name:name,state:properties.state,endpointSet:properties.mcpEndpointUrl != null,connectors:properties.connectors[].{name:name,connection:connectionName,operations:operations[].name}}" `
  --output json
```

---

Check the state, connection, and exact operation names. Confirm that the deployed app setting for the MCP endpoint exists, without displaying its value. In `mcp.json`, check environment-variable substitution, `auth.scope`, and any agent exclusions. Connector Namespace MCP uses `https://apihub.azure.com/.default`. Don't substitute a scope used for direct connector runtime tests.

**Inspect trigger configuration, if the symptom is a missing event:**

#### [Bash](#tab/bash)

```bash
az rest --method get \
  --url "$ArmBase/triggerconfigs?api-version=$ApiVersion" \
  --query "value[].{name:name,state:properties.state,operation:properties.operationName,connection:properties.connectionDetails.connectionName,hasCallback:properties.notificationDetails.callbackUrl != null}" \
  --output table
```

#### [PowerShell](#tab/powershell)

```powershell
az rest --method get `
  --url "$ArmBase/triggerconfigs?api-version=$ApiVersion" `
  --query "value[].{name:name,state:properties.state,operation:properties.operationName,connection:properties.connectionDetails.connectionName,hasCallback:properties.notificationDetails.callbackUrl != null}" `
  --output table
```

---

Check the operation, connection, and event filters against the agent trigger. Verify that the callback targets the deployed Function and uses the current connector extension key. These commands deliberately don't print callback URLs. Callback presence alone doesn't prove that delivery works.

Connector Namespace resources are children of `Microsoft.Web/connectorGateways`. An empty list of legacy `Microsoft.Web/connections` resources doesn't mean that the namespace has no connections.

### Test connector operations

ARM queries inspect configuration. They don't execute MCP or prove that a business operation succeeded. After the configuration checks:

1. Use an approved MCP client to run `initialize` and `tools/list` with the intended identity.
1. Compare the exact tool name and input schema with the published connector operation.
1. Run the smallest read-only operation and inspect its result.
1. If a write test is necessary, approve the target, test content, and cleanup first. Run it once and confirm the result in the connected service.
1. Invoke the deployed hosted skill through its intended trigger or endpoint. Confirm the selected tool, arguments, result handling, and final business result.

A test with developer credentials doesn't verify managed-identity access. An HTTP 200 response from `/mcp` can indicate successful initialization or tool discovery rather than a completed business operation. If a check fails, resolve that failure before running tests that depend on it. Repeating the hosted skill can duplicate writes without identifying the cause.

If a connection remains unauthenticated, check the selected authentication scheme and required parameters. Complete interactive authorization through the Connector Namespace portal. Changes to tenant policy or shared connections can affect other apps. Before deleting or recreating a connection, review its consumers and obtain approval.

## Use the canvas for local investigation

In the [hosted skills canvas](functions-hosted-skills-canvas.md), select **Doctor** > **Run Doctor** for setup and startup checks. Inspect **Commands**, **Local function host log**, **Trigger activity**, and **Agent digest** after an invocation.

Doctor checks development prerequisites. Its **Ready** result doesn't prove connector authorization, managed-identity access, or a successful business operation.

If your canvas version includes **Open in Application Insights**, select it to open the linked resource. Use the KQL queries in this article to analyze runtime dependencies, model calls, and usage events that aren't shown in the canvas. If resource lookup fails, open the configured Application Insights resource directly.

A local connector dry run uses representative event data. To verify webhook delivery and the deployed app's access to Microsoft 365, test the deployed trigger and connector separately.

## Investigate with Azure Functions skills

The [Azure Functions skills plugin](https://github.com/Azure/azure-functions-skills#readme) provides troubleshooting guidance for coding agents. You can use the following skills to investigate your app. These skills run in your coding agent, not in the hosted skill deployed to your function app.

| Skill | Investigation |
| --- | --- |
| `azure-functions-diagnostics` | Start from the symptom and select the applicable checks. |
| `azure-functions-inventory` | Inspect runtime, hosting, triggers, and app configuration. |
| `azure-functions-health-status` | Check current health, metrics, telemetry, and Activity Log. |
| `azure-functions-hosted-skills` | Inspect hosted skill definitions, model settings, tools, and MCP configuration. |
| `azure-functions-connector-validate` | Validate connector state, identity, tool contract, and operation results. |

Provide the app name, resource group, subscription, symptom, and UTC time range. For example:

```text
Investigate this hosted skill for the specified UTC time range.
Start with azure-functions-diagnostics. Inspect the app configuration and
health. Use the hosted skills guidance for runtime spans, model usage,
and workflow evidence. Separate confirmed findings from possible causes.
Show redacted commands or KQL for each finding and identify missing data.
Don't restart the app, change settings, or repeat write operations.
```

Available checks depend on the installed plugin version. For queries or workflow checks that the plugin doesn't support, use the procedures in this article and record any checks you couldn't complete.

## Troubleshoot common symptoms

| Symptom | First checks |
| --- | --- |
| Host requests appear, but runtime spans don't. | Confirm the `monitor` package extra, connection string, active OpenTelemetry provider, and export destination. Host telemetry alone isn't sufficient. |
| No recent telemetry appears. | Check the resource, role name, UTC range, query permissions, ingestion delay, sampling, and workspace limits. Then check startup and exporter errors. |
| Live Metrics is empty, but stored telemetry arrives. | Check Live Metrics separately. The runtime can disable it when `APPLICATIONINSIGHTS_AUTHENTICATION_STRING` is set; this setting doesn't disable normal export. |
| No functions or tools are found. | Inspect local and startup output for invalid agent files, missing dependencies, unresolved settings, and skipped tool or MCP discovery. A run span might not exist yet. |
| Model calls return 401 or 403. | Verify endpoint, selected identity, and model access roles. Test local and deployed identities separately. |
| Model calls return 429 or are slow. | Check model quota, deployment capacity, request and token limits, input size, tool loops, and retry behavior. Compare model-call and complete-run time. |
| An HTTP agent rejects input or returns invalid JSON. | Inspect HTTP status and runtime events such as `af.input.validation_failed`, `af.response.invalid_json`, and `af.response.schema_validation_failed`. |
| A workflow stays pending or running. | Check the task hub, workers, timers, retries, deadlines, and deployment changes. Use DTS, not only the starter Function's status. |
| A workflow finished, but no final result appears. | Check output, session scope, client polling, and the terminal result task for background triggers. |
| A connector is connected, but its operation fails. | Check caller access, MCP publication, tool schema, and the actual tool result. Connection state alone isn't sufficient. |
| A write occurred twice. | Check retries, overlapping work after a timeout, and idempotency. Don't assume cancellation stopped the first external request. |

### Manage telemetry data and retention

Leave `ENABLE_SENSITIVE_DATA` disabled to collect usage and timing without capturing content. Enable it only when content capture is approved. Runtime content attributes have length limits, so captured content might be truncated.

This setting doesn't control content stored in workflow inputs and outputs, conversation history, or application-defined exception messages. Review access, retention, and redaction for each store, and exclude secrets and customer content from exception text.

The Functions host and Python worker can use different sampling settings. Review both before comparing runs. Legacy Application Insights sampling settings don't necessarily apply to OpenTelemetry. For configuration options, see [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md).

For ongoing monitoring, consider alerts for run failures, tool errors, workflow backlog or age, and missing expected results. Include checks for the downstream operation where needed. Review ingestion volume and retention settings. Before purging completed workflow history, preserve the records needed for investigation and follow your retention policy.

## Related content

+ [Azure Functions hosted skills](functions-hosted-skills.md)
+ [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)
+ [Analyze Azure Functions telemetry](analyze-telemetry-data.md)
+ [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md)
+ [Runtime observability reference](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md)
+ [Runtime dynamic workflow reference](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/workflows.md)
