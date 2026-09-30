---
title: "Set Up a Managed Connector in Azure SRE Agent"
description: "Learn how to set up a managed connector in Azure SRE Agent to connect to Office 365 Outlook, Microsoft Teams, Google Gmail, Yammer/Viva Engage, Box, Confluence, OneDrive, SharePoint, and other services with per-tool governance and approval controls."
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 07/17/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
---

# Set up a managed connector

Create an authenticated connection to an external service, such as Office 365 Outlook, Microsoft Teams, Google Gmail, Yammer/Viva Engage, Box, Confluence, OneDrive, or SharePoint, with per-tool approval controls and parameter locking. Your agent gains access to only the operations you enable with the governance settings you configure.

## Prerequisites

- An agent in the [Azure SRE Agent portal](https://sre.azure.com)
- **SRE Agent Author** or **Administrator** role on the agent (see [User roles](user-roles.md))
- An account on the service you want to connect (for example, a Microsoft 365 account, Google Gmail account, Viva Engage access, or Box workspace membership)

## How managed connectors protect your credentials

When you authenticate a connector, SRE Agent stores your token or key in a secure connection resource that's separate from the agent runtime. At runtime, the agent authenticates by using its own identity and calls the service through that connection. The agent never sees your credentials. If the agent's environment is compromised, your token isn't exposed. You can revoke the agent's access without changing your own password.

The service you connect to still sees the identity that authorized the connection. Actions the agent takes, such as sending an email or posting a channel update, appear under your name.

## Step 1: Open the managed connector wizard

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Connectors**.
1. Select **Add connector**.

The connector picker opens, showing available connectors organized by tab: **Telemetry**, **Notification**, **MCP**, **Incidents**, **Deployment**, and **Other**.

> [!NOTE]
> Source code services (GitHub, Azure DevOps, GitLab) are connected on the **Builder** > **Code Access** page, not through this wizard. See [Connect a source code service](connect-code-service.md).

Preview connector cards show a **Preview** badge. Use the search box to find a connector by name across all tabs.

## Step 2: Select a managed connector and authenticate

Select the connector card for the service you want to connect, then select **Next**.

The authentication step appears. What you see depends on the connector:

### OAuth connectors (most services)

For Office 365 Outlook, Microsoft Teams, Google Gmail, Yammer/Viva Engage, Box, Confluence, OneDrive, SharePoint, and similar services:

1. Select **Sign in** (or **Sign in to [Service]**).
1. An OAuth popup opens. Sign in with your account for that service.
1. When the popup closes, the connection card shows a green checkmark and your authenticated name.

### Multi-auth connectors

Some connectors offer multiple authentication methods as radio buttons:

1. Choose your preferred method.
1. Complete the sign-in, token, app, or managed identity fields shown by the wizard.

### Runtime-defined connectors

Some connectors fetch their authentication methods and operations from the managed API at setup time. Follow the choices shown by the wizard instead of assuming a fixed auth list.

### Token and header-based connectors

1. Enter the token, header, or connection values that the connector shows.
1. Select **Connect**.

After successful authentication, select **Next** to continue.

> [!TIP]
> If the OAuth popup doesn't appear, check your browser's popup blocker. Allow popups from `sre.azure.com`.

## Step 3: Set up tools

The **Set up tools** step shows every available tool for the connector in a table with **Tool name**, **Parameter policy**, and **Permission** columns.

1. Select the check box for each operation you want the agent to use.
1. Use the check box in the **Tool name** header to select or clear all currently filtered operations.
1. Use the search box to filter tools by name or description.

The selected count (for example, **12 of 47 selected**) shows how many tools you selected out of the total available.

> [!NOTE]
> Select only the operations you need. Fewer tools means better governance and more accurate agent behavior.

Configure governance for each selected operation in the same table:

### Lock parameter values (Parameter Policy)

1. Turn on the **Parameter policy** switch for a selected tool.
1. The tool expands to show all its parameters.
1. **Type a value** in any parameter field to lock it. The agent uses this exact value every time.
1. **Leave a field empty** for the agent to fill it at runtime based on context.

For more on how parameter locking works, see [Managed connectors](managed-connectors.md).

### Set approval requirements (Permission)

For each selected tool, toggle the **Permission** between:

- **Allow**: Agent executes freely (default). Use for read operations.
- **Ask**: Agent pauses and requests your approval before each execution. Use for write operations that create, modify, or delete resources.

> [!WARNING]
> In Autonomous mode (scheduled tasks, HTTP triggers), every tool set to **Ask** executes without human approval. Only enable Autonomous mode for workflows where you trust all enabled operations. See [Run modes](run-modes.md).

Select **Next** after you select tools and configure governance.

## Step 4: Review and create

The **Review & Create** step shows a summary:

- **MCP Server** name (auto-generated)
- **Connectors & Operations**
- Operation and parameter counts

1. Review the summary.
1. Select **Create**.

SRE Agent creates the connector immediately. It appears in your connectors list, and your agent can start using the enabled tools right away.

## Verify the connector works

After creating the connector:

1. Check the connectors list. Your new connector should show a **Connected** status.
1. Open a chat with your agent and ask it to use one of the enabled operations.

For example, if you connected a notification service with a send operation enabled:

> "Send a summary of the last incident to the on-call channel"

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
curl -s -H "Authorization: ******" \
  "$ENDPOINT/api/v2/connectorV2/managedApis"
```

### 3. Get operations for a connector

```bash
CONNECTOR_NAME="{connectorName}"
curl -s -H "Authorization: ******" \
  "$ENDPOINT/api/v2/connectorV2/connectors/$CONNECTOR_NAME/operations"
```

Use the operations response as the source of truth for operation names and parameters. Preview connectors can change what they return.

### 4. Create a connection (OAuth connectors require portal sign-in)

```bash
curl -X PUT -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  "$ENDPOINT/api/v2/connectorV2/connections/$CONNECTOR_NAME" \
  -d '{ "properties": {} }'
```

### 5. Create the MCP server config with governance

```bash
curl -X PUT -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  "$ENDPOINT/api/v2/connectorV2/mcpservers/$CONNECTOR_NAME" \
  -d '{
    "properties": {
      "description": "Managed connector",
      "state": "Enabled",
      "connectors": [{
        "name": "{connectorName}",
        "connectionName": "{connectorName}",
        "displayName": "{Connector display name}",
        "operations": [
          {
            "name": "{ReadOperationName}",
            "displayName": "{Read operation display name}",
            "agentParameters": []
          },
          {
            "name": "{WriteOperationName}",
            "displayName": "{Write operation display name}",
            "requiresApproval": true,
            "userParameters": [
              { "name": "{DestinationParameter}", "value": "{Locked destination}" }
            ],
            "agentParameters": []
          }
        ]
      }]
    }
  }'
```

In this example, the read operation runs without approval. The write operation requires approval (`requiresApproval: true`) and locks the destination parameter.

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

- [Connect a source code service](connect-code-service.md)
- [Connect a notification service](connect-notification-service.md)
- [Connect a telemetry source](connect-telemetry-source.md)
- [Managed connectors](managed-connectors.md)
- [MCP connectors and tools](mcp-connectors.md)
