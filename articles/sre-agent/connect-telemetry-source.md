---
title: Connect a Telemetry Source in Azure SRE Agent
description: Learn how to connect Azure Data Explorer, Log Analytics Workspace, Application Insights, Datadog, Elasticsearch, Dynatrace, New Relic, Splunk, and Hawkeye telemetry sources to Azure SRE Agent.
author: craigshoemaker
ms.author: cshoe
ms.date: 07/17/2026
ms.topic: tutorial
ms.service: azure-sre-agent
ai-usage: ai-assisted
ms.custom: connectors, managed-connectors, telemetry, kusto, log-analytics, datadog, mcp
#customer intent: As an SRE, I want to connect a telemetry source so that my agent answers investigation questions with my own telemetry.
---

# Connect a telemetry source

Connect a telemetry source to ground your agent's answers in your own signals, not general knowledge. After you set up a telemetry connector, ask an investigation question in plain language. The agent runs the query and answers with real numbers.

This tutorial covers connectors in the **Telemetry** category. Azure Data Explorer uses the Azure MCP Kusto path. Third-party telemetry connectors also appear in the **Telemetry** tab, even when they use MCP behind the scenes. The setup uses the same wizard as every managed connector, so this article focuses on telemetry details: how sources authenticate, which operations to enable, and how to validate with a query.

> [!IMPORTANT]
> Managed connectors are in preview. Connector availability, fields, and operations can change.

## Prerequisites

- A running SRE Agent and access to [sre.azure.com](https://sre.azure.com).
- Permission to configure connectors on the agent.
- Read access to the telemetry source you're connecting. For an Azure source, the identity that authorizes the connection needs at least read access to the target resource.

If you haven't set up a connector before, start with [Set up a managed connector](setup-managed-connector.md) for the full wizard walkthrough. This article calls out only the telemetry source differences.

## Telemetry connectors

| Connector | Service | Authentication | Typical use |
|-----------|---------|----------------|-------------|
| Azure Data Explorer (via Azure MCP) | Azure Data Explorer (Kusto) | Managed identity | Run KQL queries against ADX clusters |
| Log Analytics Workspace | Log Analytics | Managed identity | Query workspace logs in read-only mode |
| Application Insights | Application Insights | Managed identity | Query application telemetry in read-only mode |
| Datadog | Datadog | Service credentials shown by the connector | Query metrics, logs, and monitors |
| Elasticsearch | Elasticsearch | Service credentials shown by the connector | Search logs and indexed telemetry |
| Dynatrace | Dynatrace | Service credentials shown by the connector | Query observability data and traces |
| New Relic | New Relic | Service credentials shown by the connector | Query telemetry and incidents |
| Splunk | Splunk | Service credentials shown by the connector | Search Splunk logs and events |
| Hawkeye (NeuBird) | Hawkeye by NeuBird | Service credentials shown by the connector | Query AI-powered observability data |

Third-party telemetry connectors include default URL, authentication, and header hints to help you configure the connection.

You can also add another telemetry source through a user-provided connector. Use this option when your team has a custom tool or a source that isn't listed in the connector picker.

## Step 1: Add the connector

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.

1. In the left sidebar, expand **Builder**, and then select **Connectors**.

1. Select **Add connector**.

1. Select the **Telemetry** tab, and then choose your telemetry source. For Azure Data Explorer, select **Azure Data Explorer**, which uses the Azure MCP Kusto path.

## Step 2: Authenticate

# [Azure telemetry sources](#tab/azure-telemetry)

For Azure telemetry connectors:

1. Complete the fields shown by the connector.

   - For **Azure Data Explorer**, name the connector, select the managed identity the agent uses to query Kusto, and then add one or more cluster groups with cluster URLs.
   - For **Log Analytics Workspace**, select a workspace from the workspace picker, or enter the workspace ARM resource ID manually.
   - For **Application Insights**, select an Application Insights resource from the resource picker, or enter the resource ARM resource ID manually.

1. Select a **Managed identity** when the connector asks for one.

1. Continue to the review, cluster, or tool-selection step shown by the wizard.

The managed identity must have read access to the target resource. If queries later fail with a permission error, grant read access to that identity and try the query again.

# [Third-party telemetry sources](#tab/third-party-telemetry)

For third-party telemetry connectors and user-provided connectors:

1. Review the URL, authentication, and header fields shown by the connector.

1. Enter the values required for your telemetry service.

1. Select **Connect**.

Third-party connectors include defaults and hints. Your service might still require a tenant URL, API token, or custom header value from your observability administrator.

---

## Step 3: Set up query tools

On the **Set up tools** step, enable the operations that read telemetry. Query operations are the core of a telemetry connector, so select the run-query or search operations. Leave administrative operations disabled unless you need them.

Set every read operation to **Allow** so the agent can answer questions without pausing. If you enable any operation that changes data, set it to **Ask**.

For Azure Data Explorer through Azure MCP, the wizard includes a cluster group step and a review step with connection testing. Configure the cluster groups, test connectivity, and save the connector. The Kusto tool set is handled by the Azure MCP Kusto path.

> [!TIP]
> Keep the enabled set small. A telemetry connector usually needs only its query operations. Fewer tools means the agent chooses the right one more reliably and stays within the 80-tool budget.

## Step 4: Validate with a question

1. Open a chat with your agent.

1. Ask a question that requires your telemetry. For example:

   ```text
   How many errors were logged in the last hour, grouped by service?
   ```

1. Watch the response. A tool card shows the agent select the connector's query tool and run the query, followed by an answer grounded in your telemetry.

When you see a real count from your own source instead of a general explanation, the connector works end to end.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Query returns "Unauthorized" or "Forbidden" | The connection identity lacks read access | Grant the identity read access to the target resource, then retry. |
| Query returns "not found" | Wrong workspace, cluster, database, or table name | Confirm the exact name in the service. Names are case-sensitive. |
| Third-party connector can't connect | URL, token, or header value is wrong | Confirm the values with your observability administrator and update the connector. |
| Answer is generic and no tool card appears | The question didn't require your telemetry | Rephrase so the question needs your telemetry, such as "count the failed requests in service X for the last day." |
| Connector saved but no telemetry returned | Empty or filtered result | Widen the time range in your question, or confirm the source has recent telemetry. |

## Related content

- [Connect a source code service](connect-code-service.md)
- [Connect a notification service](connect-notification-service.md)
- [Set up a managed connector](setup-managed-connector.md)
