---
title: HTTP triggers in Azure SRE Agent
description: Learn how HTTP triggers in Azure SRE Agent let you invoke agent actions from CI/CD pipelines, alerting tools, and any HTTP client.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 03/25/2026
ms.topic: concept-article
ms.service: azure-sre-agent
ai-usage: ai-assisted
---

# HTTP triggers in Azure SRE Agent

HTTP triggers in Azure SRE Agent are webhook endpoints that external systems use to invoke your agent on demand. When a CI/CD pipeline fails, an alerting tool detects an anomaly, or any HTTP client sends a POST request, the agent receives the event context and starts working immediately.

## How HTTP triggers work

Each trigger is a named webhook endpoint on your agent with a unique URL. When an external system calls that URL through an HTTP POST, the agent executes the trigger's configured prompt. If the request includes a JSON body, the data becomes part of the agent's prompt so the agent has full context about the event.

| Concept | Description |
|---|---|
| **Trigger** | A named endpoint with a prompt, an assigned agent (default or subagent), and an autonomy level (autonomous or review). |
| **Trigger URL** | The unique webhook URL generated when you create a trigger. External tools call this URL. |
| **JSON context** | Optional JSON body sent with the POST request. The data becomes part of the agent's prompt. |
| **Execution history** | Every invocation is logged with a timestamp, thread link, and success or failure status. |
| **Enable/disable** | Toggle triggers on or off without deleting them. Disabled triggers return 404. |

## Invoke a trigger

Call the trigger URL with an HTTP POST request:

```bash
curl -X POST \
  https://your-agent.sre.azure.com/api/v1/httptriggers/trigger/<TRIGGER_ID> \
  -H "Authorization: Bearer <ARM_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "datadog",
    "alert_title": "High error rate on checkout-api",
    "severity": "critical",
    "service": "checkout-api",
    "region": "eastus2",
    "metric": "error_rate",
    "value": "8.2%",
    "threshold": "5%"
  }'
```

The following table describes each part of the request:

| Part | Description |
|---|---|
| **URL** | The trigger's unique webhook endpoint. Find it in the trigger detail view under **Trigger URL**. |
| **Authorization** | An Azure ARM Bearer token. See [Authentication](#authentication). |
| **Content-Type** | Must be `application/json` if you're sending a JSON body. |
| **JSON body** (optional) | Any JSON data you want the agent to receive as part of its prompt. |

The JSON body is optional. If you call the trigger without a body, the agent runs with just the trigger's configured prompt. With a body, the agent sees both the prompt and the data you sent.

The trigger returns HTTP 202 (Accepted) immediately. The agent processes the request asynchronously.

## Authentication

The trigger endpoint requires an Azure ARM Bearer token in the `Authorization: Bearer <TOKEN>` header. The caller needs `Microsoft.App/agents/threads/write` permission on the agent resource.

The following table describes how to obtain a token:

| Method | Best for | Details |
|---|---|---|
| [Service principal](/entra/identity-platform/howto-create-service-principal-portal) | CI/CD pipelines, automated systems | Create an app registration, assign the role on the agent resource, and use client credentials flow to get a token. |
| [Managed identity](/entra/identity/managed-identities-azure-resources/overview) | Azure-hosted services (Azure Functions, VMs, Container Apps) | No secrets to manage. The Azure resource authenticates automatically. |
| Azure CLI | Testing and development | Run `az account get-access-token --resource 59f0a04a-b322-4310-adc9-39ac41e9631e --query accessToken -o tsv`. |

### Connect external tools that don't support Azure auth

Tools like Datadog, Dynatrace, Jira, and Splunk send webhooks with their own auth formats, not Azure ARM tokens. To bridge the gap, use one of the following intermediaries:

| Intermediary | How it works |
|---|---|
| [Azure Function](/azure/azure-functions/functions-bindings-http-webhook-trigger) | Receives the webhook, acquires an ARM token using its managed identity, and forwards the call to the trigger URL. |
| [Logic App](/azure/logic-apps/logic-apps-overview) | No-code workflow that receives webhooks from any source and calls Azure APIs with built-in ARM authentication. |
| [Azure API Management](/azure/api-management/authentication-authorization-overview) | Sits in front of the trigger URL and handles token validation and transformation via policies. |

## Use cases

The following examples show common scenarios for HTTP triggers.

### CI/CD pipeline integration

When a deployment pipeline fails, invoke the agent to analyze the failure:

```bash
# In your pipeline's failure handler
curl -X POST "$AGENT_TRIGGER_URL" \
  -H "Authorization: Bearer $ARM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"pipeline\": \"$PIPELINE_NAME\", \"run_id\": \"$RUN_ID\", \"error\": \"$ERROR_MESSAGE\"}"
```

### Alert-driven investigation

Connect your alerting system to trigger automated investigation when critical alerts fire. The following example shows a sample JSON payload:

```json
{
  "alert_name": "Error rate > 5%",
  "severity": "P1",
  "service": "checkout-api",
  "region": "eastus2",
  "start_time": "2026-03-13T10:15:00Z"
}
```

### Deployment compliance checks

After a deployment completes, trigger a compliance review:

```bash
curl -X POST "$AGENT_TRIGGER_URL" \
  -H "Authorization: Bearer $ARM_TOKEN" \
  -d '{"deployment_id": "deploy-456", "environment": "production", "changes": ["config update", "image bump"]}'
```

## Scheduled tasks vs. HTTP triggers

The following table compares scheduled tasks with HTTP triggers:

| Scheduled tasks | HTTP triggers |
|---|---|
| Time-based (cron schedule) | Event-driven (on-demand) |
| Runs whether or not something happened | Runs only when called |
| No external input per execution | Payload data included in each invocation |
| Best for recurring checks | Best for event-driven reactions |

Use both together. Scheduled tasks handle proactive monitoring, and HTTP triggers handle reactive event handling.

## API reference

The following table lists the available HTTP trigger endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/httptriggers` | GET | List all triggers |
| `/api/v1/httptriggers/create` | POST | Create a new trigger |
| `/api/v1/httptriggers/{id}` | GET | Get trigger details |
| `/api/v1/httptriggers/{id}` | PUT | Update trigger properties |
| `/api/v1/httptriggers/{id}` | DELETE | Delete a trigger |
| `/api/v1/httptriggers/{id}/enable` | POST | Enable a trigger |
| `/api/v1/httptriggers/{id}/disable` | POST | Disable a trigger |
| `/api/v1/httptriggers/{id}/execute` | POST | Run trigger manually |
| `/api/v1/httptriggers/{id}/executions` | GET | Get execution history |
| `/api/v1/httptriggers/trigger/{id}` | POST | External webhook endpoint |

## Troubleshooting

**Trigger returns 404**

- Verify the trigger is **enabled**. Disabled triggers return 404.
- Check that the trigger ID in the URL is correct.

**401 Unauthorized**

- The token audience must match the SRE Agent app ID, not `https://management.azure.com`.
- To get a token for testing, run: `az account get-access-token --resource 59f0a04a-b322-4310-adc9-39ac41e9631e --query accessToken -o tsv`.

**Trigger executes but agent doesn't act**

- Check the agent prompt. An empty prompt might not produce useful output.
- Verify the chosen subagent has the tools needed for the task.
- Check execution history for error details.

## Limits

| Resource | Limit |
|---|---|
| Triggers per agent | No hard limit |
| Max turns per execution | 250 turns |
| Authentication | Bearer token required for each trigger URL |

## Related content

- [Create and test an HTTP trigger](create-http-trigger.md)
- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
- [Workflow automation](workflow-automation.md)—multi-step automated workflows that HTTP triggers can start
