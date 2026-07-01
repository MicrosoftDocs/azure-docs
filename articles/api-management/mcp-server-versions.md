---
title: Version and Roll Out MCP Servers Safely in Azure API Management
description: Run preview and production versions of an MCP server in parallel in Azure API Management, route a slice of consumers to the new version, and promote it when metrics look good.
#customer intent: As an SRE responsible for production MCP servers, I want to safely roll out new versions of my MCP server alongside existing versions, so that I can validate performance and reliability before promoting to all consumers.

ms.date: 06/23/2026
ms.service: azure-api-management
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
---

# How to roll out new MCP server versions safely in API Management

When you update an MCP server, you want to ensure the new version performs well and doesn't introduce breaking changes before directing all consumers to it. API Management supports running multiple [versions](api-management-get-started-publish-versions.md) of an API side by side, so you can route a portion of your traffic to the new version while keeping the old version available as a fallback.

API Management also supports API [revisions](api-management-get-started-revise-api.md), which are ideal for non-breaking changes. Revisions let you iterate on an API version without affecting consumers until you're ready to promote the new revision.

Decide whether your changes are breaking or non-breaking to choose the right versioning strategy:

| Strategy | When to use | Result for consumers |
|----------|-------------|---------------------|
| API versions (path, header, or query) | Breaking changes, such as renaming a tool, changing required arguments, or removing a tool. | *v1* and *v2* are reachable at distinct endpoints. Consumers explicitly target one. |
| API revisions | Non-breaking iterations, such as expanding a tool description, adding an optional argument, or fixing a backend bug. | All consumers continue to hit the current revision; you can promote a new revision atomically. |

This article focuses on scenarios where you need to make breaking changes that require a new API version. 

## Prerequisites

- An API Management instance. To create one, see [Create an Azure API Management instance](get-started-create-service-instance.md). 
- An existing MCP server added to API Management (called *v1* in this article) with active consumers.
See [Expose a REST API as an MCP server](export-rest-mcp-server.md) or [Expose an existing MCP server](expose-existing-mcp-server.md). 
- A new version of your MCP server (*v2*) ready to deploy, with a different tool set or breaking changes from *v1*.
- Monitoring in place to compare *v1* and *v2* performance and reliability (for example, Application Insights with custom dimensions for API version and tool name). For more information, see [Monitor MCP server traffic](monitor-mcp-servers.md).

## Stand up v2 alongside v1 

1. In the [Azure portal](https://portal.azure.com/), go to your API Management instance. 
1. Select **APIs** > **MCP servers**, and locate the MCP server that you want to version.
1. In the context menu for the MCP server, select **+ Add version**. 
    Choose a versioning scheme: **Path** (`/mymcp/v2/...`), **Header** (`Api-Version: v2`), or **Query string** (`?api-version=v2`). For configuration details, see [Create a new API version](api-management-get-started-publish-versions.md#add-a-new-version).
1. Configure *v2*'s tool set. Tool definitions can diverge from *v1*. 
1. Next, publish *v2* to the same products you publish *v1* to, so existing subscriptions cover both endpoints during the migration. 

## Route a slice of consumers to v2 

With both versions running, you can route a percentage of traffic to *v2* while the rest continues to hit *v1*. This approach lets you validate *v2*'s performance and reliability under real consumer load before promoting it to everyone. You configure the routing in the API's policy definition. The following are some common strategies:

### Sticky percentage rollout

In this strategy, the same subscription always lands on the same version: 


```xml
<choose> 
  <when condition="@(System.Math.Abs(context.Subscription.Id.GetHashCode()) % 100 < 20)"> 
    <set-backend-service backend-id="mcp-v2" /> 
  </when> 
  <otherwise> 
    <set-backend-service backend-id="mcp-v1" /> 
  </otherwise> 
</choose> 
```
 

### Header-based opt-in

In this strategy, the consumer adds `x-mcp-channel: preview` to select *v2*: 

```xml
<choose> 
  <when condition="@(context.Request.Headers.GetValueOrDefault(\"x-mcp-channel\",,\"\") == \"preview\")"> 
    <set-backend-service backend-id="mcp-v2" /> 
  </when> 
  <otherwise> 
    <set-backend-service backend-id="mcp-v1" /> 
  </otherwise> 
</choose> 
```
 

### Allowlist by subscription ID

In this strategy, pin specific pilot customers to *v2*: 

```xml
<set-variable name="preview-subs" value="sub-abc,sub-def" /> 
<choose> 
  <when condition="@(((string)context.Variables[\"preview-subs\"]).Split(',') 
                      .Contains(context.Subscription.Id))"> 
    <set-backend-service backend-id="mcp-v2" /> 
  </when> 
</choose> 
```

## Monitor the rollout 

While *v1* and *v2* run side by side, filter by `service.version` to compare them: 

```kusto
requests 
| where customDimensions["api.type"] == "Mcp" 
  and customDimensions["service.name"] == "sales-mcp" 
  and customDimensions["gen_ai.operation.name"] == "tools/call" 
  and timestamp > ago(24h) 
| summarize p95       = percentile(duration, 95), 
            errorRate = todouble(countif(success == false)) / count(), 
            calls     = count() 
    by version = tostring(customDimensions["service.version"]), 
       tool    = tostring(customDimensions["gen_ai.tool.name"]) 
| order by version, p95 desc 
```

Define success criteria up front. For example, "*v2* p95 latency within 10% of *v1* and error rate less than or equal to *v1* error rate for 24 hours." 

## Promote v2 and retire v1 

When *v2* meets your success criteria, mark *v2* as the default version. New clients that don't specify a version pick it up automatically. 

Announce a deprecation window for *v1* to consumers (subscription owners are visible in the developer portal). 

After the window, remove *v1*. 


## Roll back if something goes wrong 

To roll back if you see problems with *v2*, use the following strategies:

- **Within a version**: Revert to the previous revision. Revisions roll back atomically and don't require consumer changes. 

- **Across versions**: Change the default version back to *v1*, or change the routing policy to send all traffic to *v1*. Because *v1* and *v2* share the same product and subscription, consumers don't need to change their keys. 

## Related content 

- [What are MCP servers in API Management?](mcp-server-overview.md)
