---
title: "Set Up a Managed Connector in Azure SRE Agent"
description: "Learn how to set up a managed connector in Azure SRE Agent to connect to Jira, Slack, Outlook, GitLab, and other services with per-tool governance and approval controls."
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Set up a managed connector

Create an authenticated connection to an external service (like Jira, Slack, or Outlook) with per-tool approval controls and parameter locking. Your agent gains access to only the operations you enable with the governance settings you configure.

## Prerequisites

- An agent in the [Azure SRE Agent portal](https://sre.azure.com)
- **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md))
- An account on the service you want to connect (for example, a Jira account, Slack workspace membership, or Microsoft 365 account)

## Step 1: Open the managed connector wizard

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Connectors**.
1. Select **Add connector**.

The connector picker opens, showing available connectors organized by tab: **Telemetry**, **Notification**, **Code Repository**, **MCP**, **Incidents**, **Deployment**, and **Other**.

Managed connectors show a **Preview** badge. Use the search box to find a connector by name across all tabs.

## Step 2: Select a managed connector and authenticate

Select the connector card for the service you want to connect, then select **Next**.

The authentication step appears. What you see depends on the connector:

### OAuth connectors (most services)

For Slack, Box, Confluence, OneDrive, SharePoint, and similar services:

1. Select **Sign in** (or **Sign in to [Service]**).
1. An OAuth popup opens. Sign in with your account for that service.
1. When the popup closes, the connection card shows a green checkmark and your authenticated name.

### Multi-auth connectors (Jira, GitHub, Azure DevOps)

Some connectors offer multiple authentication methods:

1. Open the **Authentication method** dropdown.
1. Choose your preferred method (for example, **Oauth** or **API Token** for Jira).
1. Complete the sign-in or enter your credentials.

### API key connectors (GitLab, Notion)

1. Enter your API key in the text field.
1. Select **Connect**.

### Credential connectors (SQL Server, PostgreSQL)

1. Enter the server address, database name, username, and password.
1. Select **Connect**.

After successful authentication, select **Next** to continue.

> [!TIP]
> If the OAuth popup doesn't appear, check your browser's popup blocker. Allow popups from `sre.azure.com`.

## Step 3: Select operations

The operations step shows every available tool for the connector as a grid of clickable cards.

1. Select individual operation cards to select or deselect them.
1. Use **Select all** to enable every operation at once.
1. Use the search box to filter operations by name.

The count badge (for example, **12 / 47**) shows how many operations you selected out of the total available.

> [!NOTE]
> Select only the operations you need. Fewer tools means better governance and more accurate agent behavior.

Select **Next** when you're done selecting operations.

## Step 4: Configure governance

The governance step shows a three-column table for every selected operation:

| Column | What it controls |
|--------|-----------------|
| **Tool Name** | Which tools are enabled (toggle on/off) |
| **Parameter Policy** | Whether to lock parameter values |
| **Permission** | Whether the agent needs approval to run this tool |

### Lock parameter values (Parameter Policy)

1. Toggle the **Parameter Policy** switch **ON** for a tool.
1. The tool expands to show all its parameters.
1. **Type a value** in any parameter field to lock it. The agent uses this exact value every time.
1. **Leave a field empty** for the agent to fill it at runtime based on context.

For more on how parameter locking works, see [Managed connectors](managed-connectors.md).

### Set approval requirements (Permission)

For each tool, toggle the **Permission** between:

- **Allow**: Agent executes freely (default). Use for read operations.
- **Ask**: Agent pauses and requests your approval before each execution. Use for write operations that create, modify, or delete resources.

> [!WARNING]
> In Autonomous mode (scheduled tasks, HTTP triggers), every tool set to **Ask** executes without human approval. Only enable Autonomous mode for workflows where you trust all enabled operations. See [Run modes](run-modes.md).

Select **Next** when governance is configured.

## Step 5: Review and create

The review step shows a summary:

- **MCP Server name** (auto-generated)
- **Connector name** and icon
- **Operation count** and parameter count

1. Review the summary.
1. Select **Create**.

The connector is created immediately. It appears in your connectors list and your agent can start using the enabled tools right away.

## Verify the connector works

After creating the connector:

1. Check the connectors list. Your new connector should show a **Connected** status.
1. Open a chat with your agent and ask it to use one of the enabled operations.

For example, if you connected Jira with "Get Issue" enabled:

> "Get the details of Jira issue OPS-1234"

## Edit or delete a connector

### Edit

Select an existing managed connector to reopen the wizard. You can change which operations are enabled, update parameter values, and modify approval settings.

### Delete

To remove a connector, select it from the connectors list and select **Delete**.

## Set up a managed connector with the REST API

You can also create and manage managed connectors programmatically using the REST API.

### 1. Get a token

```bash
TOKEN=$(az account get-access-token --resource https://azuresre.dev --query accessToken -o tsv)
ENDPOINT="https://{agentEndpoint}"
```

### 2. List available connectors

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$ENDPOINT/api/v2/connectorV2/managedApis"
```

### 3. Get operations for a connector

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$ENDPOINT/api/v2/connectorV2/connectors/jira/operations"
```

### 4. Create a connection (OAuth connectors require portal sign-in)

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$ENDPOINT/api/v2/connectorV2/connections/jira" \
  -d '{ "properties": {} }'
```

### 5. Create the MCP server config with governance

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$ENDPOINT/api/v2/connectorV2/mcpservers/jira" \
  -d '{
    "properties": {
      "description": "Jira connector",
      "state": "Enabled",
      "connectors": [{
        "name": "jira",
        "connectionName": "jira",
        "displayName": "Jira",
        "operations": [
          {
            "name": "GetIssue",
            "displayName": "Get Issue",
            "agentParameters": [
              { "name": "issueId", "schema": { "type": "string", "required": true } }
            ]
          },
          {
            "name": "AddComment",
            "displayName": "Add Comment",
            "requiresApproval": true,
            "userParameters": [
              { "name": "projectKey", "value": "OPS" }
            ],
            "agentParameters": [
              { "name": "issueId", "schema": { "type": "string", "required": true } },
              { "name": "body", "schema": { "type": "string", "required": true } }
            ]
          }
        ]
      }]
    }
  }'
```

In this example:

- **GetIssue** is enabled with no approval required.
- **AddComment** requires approval (`requiresApproval: true`) and has `projectKey` locked to `OPS`.

For the full list of endpoints, see [API reference](api-reference.md).

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| OAuth popup doesn't appear | Browser popup blocker | Allow popups from `sre.azure.com` |
| "Sign in" button stays disabled | Permission check failed | Verify you have the **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md)) |
| Connector not visible in picker | Feature not enabled | Confirm managed connectors preview is enabled for your agent |
| Agent doesn't use the connector | Operations not selected | Edit the connector and verify at least one operation is enabled |
| Dynamic dropdown loads slowly | Service is responding slowly | Wait a moment or type the value manually |

## Related content

- [Managed connectors](managed-connectors.md)
- [MCP connectors and tools](mcp-connectors.md)
- [Custom agents](subagents.md)
