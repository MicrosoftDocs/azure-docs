---
title: Monitor MCP Server Traffic in Azure API Management
description: Monitor MCP server traffic in Azure API Management. Learn what telemetry is emitted by default, how to enable payload logging, and run ready-to-use KQL queries.
#customer intent: As an SRE responsible for production MCP servers, I want to understand what telemetry API Management emits out of the box, so that I can monitor tool-call latency without changing any configuration.
author: dlepow
ms.author: danlep
ms.reviewer: danlep
ms.date: 06/23/2026
ms.service: azure-api-management
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
---

# Monitor MCP server traffic in Azure API Management

In this article, you learn what telemetry Azure API Management emits for traffic to MCP servers, how to enable payload logging for tool arguments and results, and how to query the data in Azure Monitor.  

## Prerequisites 

- An API Management instance with at least one MCP server. See [Expose a REST API as an MCP server](export-rest-mcp-server.md) or [Expose an existing MCP server](expose-existing-mcp-server.md).

- An Application Insights resource linked to your API Management instance. For more information, see [Configure Application Insights for Azure API Management](api-management-howto-app-insights.md).


## Default telemetry for MCP servers

For every MCP request, API Management writes an Application Insights requests row with MCP-specific dimensions and sets the standard duration field. You can chart per-tool latency without changing any configuration. For details, see the [MCP telemetry reference](#mcp-telemetry-reference) section, later in this article.
 
> [!NOTE]
> MCP telemetry follows the OpenTelemetry semantic conventions for generative AI, which define standard telemetry attribute names (for example, `gen_ai.*`) so data is consistent across tools.

## Enable payload logging for arguments and results 

By default, API Management doesn't capture the arguments and results of tool calls. To enable capture for an MCP server: 

1. In the [Azure portal](https://portal.azure.com/), go to your API Management instance. 

1. Select **APIs** > **MCP servers**, and then select the MCP server you want to log. 

1. Select **Settings** > **Diagnostic Logs**. 

1. Enable Frontend and Backend payload logging. Select **Save**. 
> [!CAUTION]
> Tool arguments and results can include prompts, customer data, or secrets. Enable payload logging only for the MCP servers and environments where you need it. Apply scrubbing or claim allowlists before broad rollout. 

## Query MCP traffic with KQL 

The following are sample Kusto queries you can run in Azure Monitor to analyze MCP traffic. In these examples, replace `sales-mcp` with the name of your MCP server where applicable.

### List the last 50 tool calls on a given MCP server

```kusto
requests
| where customDimensions["api.type"] == "Mcp"
  and customDimensions["service.name"] == "sales-mcp"
  and customDimensions["gen_ai.operation.name"] == "tools/call"
| project timestamp,
          tool       = customDimensions["gen_ai.tool.name"],
          session    = customDimensions["gen_ai.conversation.id"],
          client     = strcat(customDimensions["user_agent.name"], "/",
                              customDimensions["user_agent.version"]),
          durationMs = duration,
          success
| order by timestamp desc
| take 50
```

### Top MCP clients by tool-call volume 

```kusto
requests
| where customDimensions["api.type"] == "Mcp"
  and customDimensions["gen_ai.operation.name"] == "tools/call"
| summarize calls = count()
    by client = strcat(customDimensions["user_agent.name"], "/",
                       customDimensions["user_agent.version"])
| top 10 by calls desc
```

### p50 and p95 latency per tool over the last 24 hours

```kusto
requests
| where customDimensions["api.type"] == "Mcp"
  and customDimensions["gen_ai.operation.name"] == "tools/call"
  and timestamp > ago(24h)
| summarize p50   = percentile(duration, 50),
            p95   = percentile(duration, 95),
            calls = count()
    by tool = tostring(customDimensions["gen_ai.tool.name"])
| order by p95 desc
```

### Per-tool error rate over time

```kusto
requests
| where customDimensions["api.type"] == "Mcp"
  and customDimensions["gen_ai.operation.name"] == "tools/call"
| summarize total    = count(),
            failures = countif(success == false)
    by bin(timestamp, 5m),
       tool = tostring(customDimensions["gen_ai.tool.name"])
| extend errorRate = todouble(failures) / total
| render timechart
```

### Inspect arguments sent to a specific tool 

For this scenario, make sure payload logging is enabled for the MCP server.

```kusto
requests
| where customDimensions["api.type"] == "Mcp"
  and customDimensions["service.name"] == "sales-mcp"
  and customDimensions["gen_ai.tool.name"] == "create_quote"
  and timestamp > ago(1h)
| project timestamp,
          session = customDimensions["gen_ai.conversation.id"],
          args    = customDimensions["gen_ai.tool.call.arguments"],
          result  = customDimensions["gen_ai.tool.call.result"]
```

## Add custom dimensions with the trace policy 

To capture data that's not in the built-in schema - for example, a custom `x-agent-id` header, a JWT claim, or a correlation ID - use the [trace](trace-policy.md) policy at the scope of the MCP server. 

> [!WARNING]
> Don't access `context.Response.Body` from policies attached to MCP scope. MCP responses are streamed, and reading the body breaks the stream. 

## MCP telemetry reference 

The following dimensions appear on every MCP request: 

| Property | Description |
|----------|-------------|
| `gen_ai.operation.name` | JSON-RPC method (tools/list or tools/call). |
| `gen_ai.conversation.id` | MCP session ID. |
| `network.protocol.name` | Protocol name (MCP). |
| `network.protocol.version` | Protocol version. |
| `auth.type` | Inbound authentication method. |
| `user_agent.name` | MCP client name (for example, vscode or claude-desktop). |
| `user_agent.version` | MCP client version. |
| `service.name` | MCP server name. |
| `service.version` | MCP server version. |
| `api.type` | API type discriminator (Mcp). |
| `error.message` | Error string, on failure. |
| `error.type` | Error category, on failure. |

### Additional fields on tools/list


| Metric | Description |
|--------|-------------|
| `ToolCount` | Number of tools returned in the response. |

### Additional fields on tools/call


| Property | Description |
|----------|-------------|
| `gen_ai.tool.name` | Tool that the agent invoked. |
| `gen_ai.tool.type` | Tool type. |
| `gen_ai.tool.call.arguments` | Arguments JSON. Only present when payload logging is enabled. |
| `gen_ai.tool.call.result` | Result JSON. Only present when payload logging is enabled. |

## Related content 

- [What are MCP servers in API Management?](mcp-server-overview.md)
- [Application Insights integration for API Management](api-management-howto-app-insights.md) 
- [Trace policy](trace-policy.md)