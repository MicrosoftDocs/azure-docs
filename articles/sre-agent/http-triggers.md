---
title: HTTP triggers in Azure SRE Agent
description: Learn how HTTP triggers in Azure SRE Agent let you invoke agent actions from CI/CD pipelines, alerting tools, and any HTTP client.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 03/30/2026
ms.topic: concept-article
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: http triggers, webhooks, api, automation, ci/cd, triggers, event-driven
#customer intent: As an SRE, I want to create HTTP triggers so that external systems like CI/CD pipelines and alerting tools can invoke my agent automatically.
---

# HTTP triggers in Azure SRE Agent

HTTP triggers in Azure SRE Agent are webhook endpoints that external systems use to invoke your agent on demand. When a CI/CD pipeline fails, an alerting tool detects an anomaly, or any HTTP client sends a POST request, the agent receives the event context and starts working immediately.

## The problem: alerts and pipeline failures need manual triage

Your team already has alerting, observability, and workflow tools—Datadog, Dynatrace, Jira, Splunk, Grafana—and CI/CD pipelines that break. When something goes wrong, the response is the same every time:

- **An engineer gets paged**, opens the monitoring tool, reads the alert, then manually opens logs, metrics, and deployment history across multiple dashboards to figure out what happened.
- **A pipeline fails**, and someone has to stop what they're doing, check the build output, correlate with recent changes, and decide whether to roll back or fix forward.
- **Context is scattered**—the Datadog alert says "CPU spike on prod-api" but the root cause requires correlating logs from three services, checking recent deployments, and reviewing Dynatrace traces.

## How HTTP triggers work

HTTP triggers let you connect any tool that supports webhooks directly to your SRE Agent. Instead of an engineer doing manual triage, the system that detected the problem—whether it's a Datadog alert, a Dynatrace anomaly, a Jira workflow transition, or a pipeline failure—tells the agent to investigate, passing along the context automatically.

Each trigger is a named webhook endpoint on your agent with a unique URL. When an external system calls that URL via HTTP POST, the agent executes the trigger's configured prompt—enriched with any JSON data in the request body.

**Key concepts:**

| Concept | How it works |
|---------|-------------|
| **Trigger** | A named endpoint with a prompt, an assigned agent (default or subagent), and an autonomy level (autonomous or review) |
| **Trigger URL** | The unique webhook URL generated when you create a trigger—this is what external tools call |
| **JSON context** | Optional JSON body sent with the POST request—becomes part of the agent's prompt so it has full context |
| **Execution history** | Every invocation is logged with timestamp, thread link, and success/failure status |
| **Enable/disable** | Toggle triggers on or off without deleting—disabled triggers return 404 |

### Invoke a trigger

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

| Part | What it is |
|------|-----------|
| **URL** | The trigger's unique webhook endpoint—find it in the trigger detail view under **Trigger URL** |
| **Authorization** | An Azure ARM Bearer token—see [Authentication for trigger invocation](#authentication-for-trigger-invocation) |
| **Content-Type** | Must be `application/json` if you're sending a JSON body |
| **JSON body** (optional) | Any JSON data you want the agent to see. This becomes part of the agent's prompt—include whatever context helps the agent investigate (alert name, severity, affected service, and so on) |

The JSON body is optional. If you call the trigger without a body, the agent runs with only the trigger's configured prompt. With a body, the agent sees both the prompt and the data you sent.

### Authentication for trigger invocation

The trigger endpoint requires an Azure ARM Bearer token in the `Authorization: Bearer <TOKEN>` header. The caller needs `Microsoft.App/agents/threads/write` permission on the agent resource.

**Ways to obtain a token:**

| Method | Best for | Details |
|--------|----------|---------|
| [Service principal](/entra/identity-platform/howto-create-service-principal-portal) | CI/CD pipelines, automated systems | Create an app registration, assign the role on the agent resource, and use client credentials flow to get a token |
| [Managed identity](/entra/identity/managed-identities-azure-resources/overview) | Azure-hosted services (Azure Functions, VMs, Container Apps) | No secrets to manage—the Azure resource authenticates automatically |
| Azure CLI | Testing and development | Run `az account get-access-token --resource https://management.azure.com --query accessToken -o tsv` |

**Connecting external tools that don't support Azure auth:**

Tools like Datadog, Dynatrace, Jira, and Splunk send webhooks with their own auth formats—not Azure ARM tokens. To bridge the gap, use one of these intermediaries:

| Intermediary | How it works |
|-------------|-------------|
| [Azure Functions](/azure/azure-functions/functions-bindings-http-webhook-trigger) | Receives the webhook, acquires an ARM token using its managed identity, and forwards the call to the trigger URL |
| [Logic Apps](/azure/logic-apps/logic-apps-overview) | No-code workflow that receives webhooks from any source and calls Azure APIs with built-in ARM authentication |
| [Azure API Management](/azure/api-management/authentication-authorization-overview) | Sits in front of the trigger URL and handles token validation and transformation via policies |

**Response:**

```json
{
  "message": "HTTP trigger execution initiated",
  "executionTime": "2026-03-13T10:30:00Z",
  "threadId": "thread-abc123",
  "success": true
}
```

The trigger returns HTTP 202 (Accepted) immediately. The agent processes the request asynchronously.

## What makes this approach different

HTTP triggers connect your existing alerting and CI/CD tools directly to your agent without an engineer in the loop. The system that detected the problem tells the agent to investigate, passing along the full context automatically. There's no paging, no dashboard switching, and no manual context gathering.

## Before and after

| Before (manual triage) | After (HTTP triggers) |
|---------------------|---------------------|
| Datadog alert fires, engineer gets paged, opens 3 dashboards, starts investigating | Datadog webhook calls trigger, agent investigates and posts findings automatically |
| Pipeline breaks, engineer checks build logs, reviews PRs, decides next step | Pipeline failure handler calls trigger, agent analyzes failure and posts root cause |
| Dynatrace detects anomaly, engineer manually correlates across services | Dynatrace webhook calls trigger with anomaly context, agent correlates logs, metrics, and deployments |

## Scheduled tasks vs. HTTP triggers

| Scheduled tasks | HTTP triggers |
|----------------|---------------|
| Time-based (cron schedule) | Event-driven (on-demand) |
| Runs whether or not something happened | Runs only when called |
| No external input per execution | Payload data injected into each invocation |
| Best for recurring checks | Best for event-driven reactions |

Use both together—scheduled tasks for proactive monitoring, HTTP triggers for reactive event handling.

## Use cases

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

Connect your alerting system to trigger automated investigation when critical alerts fire:

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

## API reference

| Endpoint | Method | Description |
|----------|--------|-------------|
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

- Verify the trigger is **enabled**—disabled triggers return 404.
- Check the trigger ID in the URL is correct.

**401 Unauthorized**

- The token audience must match the SRE Agent app ID, not `https://management.azure.com`.
- To get a token for testing: `az account get-access-token --resource 59f0a04a-b322-4310-adc9-39ac41e9631e --query accessToken -o tsv`.

**Trigger executes but the agent doesn't act**

- Check the agent prompt—an empty prompt might not produce useful output.
- Verify the chosen subagent has the tools needed for the task.
- Check execution history for error details.

## Limits

| Resource | Limit |
|----------|-------|
| **Triggers per agent** | No hard limit |
| **Max turns per execution** | 250 turns |
| **Authentication** | Bearer token required for each trigger URL |

## Related content

- [Scheduled tasks](scheduled-tasks.md)
- [Workflow automation](workflow-automation.md)
- [Create and test an HTTP trigger](create-http-trigger.md)

## Next step

> [!div class="nextstepaction"]
> [Create and test an HTTP trigger](create-http-trigger.md)
