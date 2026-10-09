---
title: Protect tool calls with Defender and Purview in AI Gateway tier (preview)
titleSuffix: Azure
description: Learn how to evaluate MCP and OpenAPI tool calls for threats, prompt injection, and sensitive-data risks in Azure AI Gateway.
ms.service: azure

ms.topic: how-to
ms.date: 09/24/2026
---

# Protect tool calls with tool threat protection in AI Gateway tier (preview)

[!INCLUDE [api-gateway-preview](./includes/preview/preview-ai-gateway-tier.md)]

Tool threat protection helps protect agents and applications that call tools through AI Gateway tier (preview). The policy uses Microsoft Defender and Microsoft Purview capabilities to evaluate tool requests and results for risks such as malicious content, prompt injection, and exposure of sensitive information.

## Prerequisites

- An AI Gateway tier in Azure API Management (preview) instance.
- An MCP server configured in the gateway.
- Microsoft Defender or Microsoft Purview license.
- Permission to manage policies on the gateway.
- A client that can acquire a delegated Microsoft Entra ID bearer token for AI Gateway.
- Any authentication already required by the MCP server. Enabling this policy doesn't replace runtime access keys or other configured authentication.

## Configure tool threat protection

Follow these steps:

1. In the [AI Gateway portal](https://ai.gateway.azure.com), select **Policies**.

1. Select **Add policy**.

1. Under **Security**, select **Agent 365 tool threat protection**.

1. Select the MCP server to protect. The policy applies to a single MCP server in the gateway, including all tools exposed by that server. The MCP server can be backed by remote MCP endpoints, OpenAPI services, or both.

1. Select one or both evaluation stages. You can require an evaluation:

    - **Before tool invocation** - Evaluates the tool name and arguments. The gateway calls the tool only when the evaluation allows it.
    - **After tool invocation** - Executes the tool, evaluates its result, and returns the result only when the evaluation allows it.
    - **At both stages** - Requires an allow decision before the tool runs and another allow decision before its result is returned.

1. Select **Create**.

You can apply only one tool threat protection policy to an MCP server. The policy applies to every tool and caller that uses that server. You can't configure it at gateway scope or for an individual tool.

To configure the tool using ARM or REST APIs, configure the following policy:

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/workspaces/{workspaceName}/toolServers/{toolServerName}?api-version=2025-09-01-preview
Content-Type: application/merge-patch+json

{
    "properties": {
        "policies": [
            { "type": "toolThreatProtection", "preInvocation": true, "postInvocation": true }
        ]
    }
}
```

> [!IMPORTANT]
> Tool threat protection requires a delegated Microsoft Entra ID user token. The caller must send a bearer token issued for AI Gateway, which the gateway uses in an on-behalf-of (OBO) exchange for the evaluation service. App-only service-to-service calls aren't supported because OBO requires a delegated user token.

## How evaluation works

Microsoft Defender structures protection into three policy modes:

* **Disabled Mode**: Operates as a permanent "fail-open" state where no inspection occurs.
* **Audit Mode**: It tools without blocking. If the underlying service lags or drops out, the system fails open to prevent user disruption while logging the behavior.
* **Block Mode**: Explicit enforcement. This mode behaves strictly as a fail-close mechanism.

You configure policy mode in Microsoft Defender and can't change it at the gateway. Learn how to configure [runtime protection in Microsoft Defender](/defender-endpoint/configure-ai-agent-runtime-protection#enable-runtime-protection).

The gateway runs its existing authentication, authorization, and policy processing before tool threat protection. If that processing rejects a request, the gateway doesn't send it for threat evaluation.

Tool discovery and session-management operations don't invoke tools and aren't evaluated. For example, MCP `initialize`, `tools/list`, and notifications don't trigger an evaluation.

### Intervention points

Evaluate **before tool execution** to prevent a potentially unsafe tool call from running or causing side effects.

Evaluate **after tool invocation** to prevent unsafe results from reaching the agent. Post-invocation evaluation also applies when the tool returns an error result.

If the evaluation allows the result, the gateway returns it to the caller. If the evaluation denies the result or can't produce a valid verdict, the gateway withholds the result. Notice that this requires **Block mode**.

> [!CAUTION]
> A post-invocation denial can't undo actions that the tool already completed. The gateway withholds the result but doesn't retry or reverse the tool call. Don't automatically retry a tool call when the response says that the tool ran but its result was withheld.

When both stages are enabled, the gateway requires an allow decision before it invokes the tool and another allow decision before it returns the result. Enabling both stages can therefore add two evaluation round trips to a tool call.

## Authentication behavior

Tool threat protection requires a delegated Microsoft Entra ID user token. The caller must send a bearer token issued for AI Gateway, which the gateway uses in an on-behalf-of (OBO) exchange for the evaluation service. App-only service-to-service calls aren't supported because OBO requires a delegated user token.

An evaluated tool invocation without a usable bearer token fails before the gateway performs the required evaluation.

Tool threat protection adds an evaluation identity requirement but doesn't change the MCP server's existing authentication configuration.

## Evaluation failures

The evaluation service must return a valid allow verdict for the gateway to continue. A denial, timeout, token-exchange failure, malformed verdict, or unavailable evaluator fails closed.

For MCP clients, the gateway returns a normal tool result with `isError: true` over HTTP `200`. The error result contains a code and correlation ID for diagnostics.

| Error code | Meaning |
| --- | --- |
| `ToolEvaluationIdentityRequired` | The request doesn't contain a usable bearer token, or the gateway can't read the token tenant required for the OBO exchange. |
| `ToolEvaluationDenied` | The evaluation service denied the request or result. |
| `ToolEvaluationInvalidRequest` | The evaluation input isn't valid. |
| `ToolEvaluationRequestTooLarge` | The evaluation input exceeds the supported size. |
| `ToolEvaluationUnavailable` | Token exchange or evaluation failed, timed out, returned an invalid verdict, or was unavailable. |

**Example:**

```json
{
    "jsonrpc":"2.0",
    "id": 42,
    "result": {
        "isError":true,
        "content":[
            {
                "type":"text",
                "text":"Tool \u0027mcp_tail_logs\u0027 requires a validated delegated caller token."
            }
        ],
        "_meta":{
            "com.microsoft.azure.ai.gateway/denial": {
                "code":"ToolEvaluationIdentityRequired",
                "correlationId": "9f2c1b6e-..."
            }
        }
    }
}
```

## Related content

- [Manage models and tools in Azure AI Gateway](ai-gateway-manage-models-tools.md)
- [Govern, secure, and operate AI Gateway tier](ai-gateway-govern-secure-assets.md)
- [AI Gateway tier overview](ai-gateway-overview.md)
