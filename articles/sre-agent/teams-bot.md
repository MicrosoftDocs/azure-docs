---
title: "Tutorial: Set Up a Teams Bot for Azure SRE Agent"
description: Deploy your Azure SRE Agent as a Microsoft Teams bot for interactive chat through direct messages or channel mentions.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: teams, bot, setup, bot framework, azure bot service
#customer intent: As an SRE or DevOps engineer, I want to set up my agent as a Teams bot so that my team can interact with it directly in Microsoft Teams.
---

# Tutorial: Set up a Teams bot for Azure SRE Agent
In this tutorial, you deploy your Azure SRE Agent as a Microsoft Teams bot so your team can chat with it directly in DMs or by @-mentioning it in channels.

> [!TIP]
> **What you accomplish in this tutorial:**
>
> - Your agent appears as a bot in Microsoft Teams.
> - Team members can DM the bot for private investigations.
> - Team members can @-mention the bot in channels for collaborative troubleshooting.
> - Responses stream back to Teams automatically.

## Prerequisites

Before you begin, make sure you have the following resources and access:

| Requirement | Details |
|---|---|
| Azure SRE Agent | An agent deployed and running |
| Azure subscription | To create the Azure Bot Service resource |
| User-assigned managed identity | The identity your agent uses (created during agent deployment) |
| Teams admin access | To publish the bot app to your organization |

## Overview

Set up the Teams bot in three steps:

1. **Deploy Azure Bot Service**: Register your agent's endpoint with the Bot Framework.
1. **Build the Teams app package**: Create the manifest that Teams needs to install the bot.
1. **Publish to Teams**: Make the bot available to your organization.

## Step 1: Deploy Azure Bot Service

The Azure Bot Service routes messages between Teams and your agent. Your agent's codebase includes a Bicep template that creates this resource.

### Gather required values

Before deploying, gather the following values:

| Value | Where to find it | Example |
|---|---|---|
| **Bot App Client ID** | Your agent's managed identity Client ID | `aaaaaaaa-0000-1111-...` |
| **Bot App Domain** | Your agent's container app FQDN | `my-agent.eastus2.azuresre.ai` |
| **Bot Display Name** | The name you want the bot to display in Teams | `SRE Agent` |
| **App Type** | `UserAssignedMsi` for managed identity (recommended) | `UserAssignedMsi` |
| **Tenant ID** | Your Microsoft Entra tenant ID | `aaaaaaaa-0000-1111-...` |

### Deploy by using Azure CLI

Run the following command to deploy the Bot Service resource.

```azurecli
az deployment group create \
  --name sre-agent-bot \
  --resource-group <RESOURCE_GROUP> \
  --template-file deploy/teams-bot.bicep \
  --parameters \
    resourceBaseName=<BOT_NAME> \
    botAadAppClientId=<MANAGED_IDENTITY_CLIENT_ID> \
    botAppDomain=<AGENT_FQDN> \
    botDisplayName="SRE Agent" \
    microsoftAppType=UserAssignedMsi \
    microsoftAppTenantId=<TENANT_ID>
```

The Bicep template creates the following resources:

- An Azure Bot Service resource.
- A Teams channel connection on that bot.
- The messaging endpoint pointing to `https://<AGENT_FQDN>/api/messages`.

### Configure your agent

Your agent needs three environment variables to accept Teams messages. Set these variables on your container app.

| Variable | Value | Description |
|---|---|---|
| Teams Bot App ID | Your managed identity's Client ID | Identifies the bot to the Bot Framework |
| Teams Bot App Type | `UserAssignedMsi` | Authentication method (managed identity recommended) |
| Teams Bot Tenant ID | Your Microsoft Entra tenant ID | Scopes authentication to your tenant |

The exact environment variable names follow the ASP.NET configuration binding convention for your deployment. Without these variables, the Teams endpoint returns 503 and the bot appears offline.

> [!TIP]
> By using `UserAssignedMsi`, you don't need a password or secret. The managed identity handles authentication automatically.

## Step 2: Build the Teams app package

The Teams app package is a ZIP file that contains a manifest and icons. Your agent's codebase includes a template and build script.

### Create the environment file

Create a `.env` file with your deployment values.

```bash
TEAMS_APP_ID=<UNIQUE_GUID_FOR_TEAMS_APP>
AAD_APP_CLIENT_ID=<MANAGED_IDENTITY_CLIENT_ID>
BOT_DOMAIN=<AGENT_FQDN>
BOT_NAME="SRE Agent"
RESOURCE_SUFFIX=<SHORT_NAME>
MICROSOFT_APP_TYPE=UserAssignedMsi
MICROSOFT_APP_TENANT_ID=<TENANT_ID>
RESOURCE_GROUP=<RESOURCE_GROUP>
```

> [!NOTE]
> Generate a new GUID for `TEAMS_APP_ID`, or create an app in the [Teams Developer Portal](https://dev.teams.microsoft.com/home) and use its ID.

### Run the build script

Run the build script to generate the app package.

```bash
cd TeamsResources
chmod +x build.sh
./build.sh
```

This script performs the following actions:

1. Substitutes your values into the manifest template.
1. Deploys the Bot Service to Azure.
1. Creates `appPackage.zip` with the manifest and icons.

The resulting `appPackage.zip` is ready to upload to Teams.

## Step 3: Publish to Teams

Upload the app package and verify the bot is available in your organization.

### Upload the app package

Follow these steps to publish the bot to your organization.

1. Open **Teams Admin Center** at [admin.teams.microsoft.com](https://admin.teams.microsoft.com).
1. Go to **Teams apps** > **Manage apps**.
1. Select **Upload new app**.
1. Select `appPackage.zip`.
1. Select **Publish** to make the app available in your organization.

### Verify in Teams

Confirm the bot is accessible and responding.

1. Open Microsoft Teams.
1. Select **Apps** in the sidebar.
1. Search for your bot's name (for example, "SRE Agent").
1. Select **Add** to install it.
1. Start a chat by typing "Hello".

The agent responds with a welcome message that introduces itself and its capabilities.

## Test the integration

After publishing, test the bot in both direct messages and channel mentions.

### DM test

Open a direct chat with the bot:

```text
You: Check the health of my resources

Agent: Searching your subscription for resource health...
✅ 10/12 resources healthy
⚠️ web-app-prod: High memory (87%)
```

### Channel test

In a team channel, @-mention the bot:

```text
@SREAgent what's the error rate on api-gateway?
```

The bot sends a quick acknowledgment while the full analysis runs, then posts the detailed response.

## How it works

The following table describes the message flow between Teams and your agent.

| Step | What happens |
|---|---|
| You send a message in Teams | Teams delivers it to `POST /api/messages` on your agent |
| Agent receives message | Bot Framework SDK authenticates and parses the message |
| Thread mapping | Agent maps the Teams conversation to an internal thread |
| Processing | Same reasoning engine as portal chat with full tool access |
| Quick response (channels only) | Brief acknowledgment posted while analysis runs |
| Full response | Agent's response is polled and delivered back to Teams |

Responses are delivered back to your Teams conversation shortly after processing. The same thread is visible in the portal for full tool-call detail.

## Troubleshooting

Use the following table to resolve common problems with the Teams bot setup.

| Symptom | Resolution |
|---|---|
| Bot doesn't respond | Verify the Teams bot environment variables are set on the container app. Confirm the App ID is set to a real managed identity Client ID. |
| 503 from Teams endpoint | The bot isn't configured. Set the three required environment variables. |
| Auth errors | Verify the managed identity Client ID matches the Bot Service's `msaAppId`. |
| Bot not found in Teams | Confirm the app is published and the user has permission to install apps. |
| Works in portal but not Teams | Confirm the Bot Service is deployed and the messaging endpoint is reachable. |

## Next step

> [!div class="nextstepaction"]
> [Chat from your tools](./chat-from-your-tools.md)

## Related content

- [Chat from your tools](chat-from-your-tools.md)
