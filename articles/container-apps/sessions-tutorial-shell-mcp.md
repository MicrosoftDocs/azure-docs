---
title: 'Tutorial: Use MCP with dynamic sessions (shell)'
description: Learn how to create a shell session pool with the platform-managed MCP server enabled and execute shell commands remotely using Azure Container Apps dynamic sessions.
#customer intent: As a developer, I want to use the platform-managed MCP server with a shell session pool so that I can execute shell commands remotely from the CLI or GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/18/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Use MCP with dynamic sessions (shell)

> [!IMPORTANT]
> The platform-managed MCP server for dynamic sessions is in **preview**. The API version `2025-02-02-preview` and `mcpServerSettings` properties are subject to change.

This tutorial shows how to create a shell session pool with the platform-managed MCP server enabled, connect to it, and execute shell commands remotely - both from the CLI and from GitHub Copilot Chat in VS Code.

Unlike the [standalone MCP server tutorials](mcp-overview.md#standalone-container-app), you don't write or deploy MCP server code. The platform provides built-in tools for shell session pools:

| Tool | Description |
|------|-------------|
| `launchShell` | Creates a new shell environment and returns an `environmentId` |
| `runShellCommandInRemoteEnvironment` | Executes a shell command in an existing environment |

In this tutorial, you:

> [!div class="checklist"]
> - Create a shell session pool with MCP server enabled
> - Retrieve the MCP endpoint and API key
> - Initialize the MCP connection and run shell commands via JSON-RPC
> - Connect the MCP server to GitHub Copilot in VS Code

## Prerequisites

| Requirement | Description |
|-------------|-------------|
| Azure account | An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | [Install the Azure CLI](/cli/azure/install-azure-cli). |
| curl | [curl](https://curl.se/) (preinstalled on most Linux and macOS systems). |
| jq | [jq](https://jqlang.github.io/jq/) JSON processor, used to parse API responses. |
| VS Code | [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension (for the Copilot integration section). |

## Setup

1. Update the Azure CLI and install the Container Apps extension:

    ```azurecli
    az upgrade
    az provider register --namespace Microsoft.App
    az extension add --name containerapp --allow-preview true --upgrade
    ```

1. Sign in and set your subscription:

    ```azurecli
    az login
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    az account set -s $SUBSCRIPTION_ID
    ```

1. Set variables for this tutorial. Replace the placeholders with your values:

    ```azurecli
    RESOURCE_GROUP=<RESOURCE_GROUP_NAME>
    SESSION_POOL_NAME=<SESSION_POOL_NAME>
    LOCATION=<LOCATION>
    ```

    | Placeholder | Description |
    |-------------|-------------|
    | `<RESOURCE_GROUP_NAME>` | The name of the Azure resource group. |
    | `<SESSION_POOL_NAME>` | The name for your session pool (for example, `my-shell-sessions`). |
    | `<LOCATION>` | An Azure region that supports dynamic sessions (for example, `westus2`). |

1. Create a resource group:

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

## Create a shell session pool with MCP server

Deploy a session pool by using an ARM template with the MCP server enabled.

1. Create a file named `deploy.json`:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "name": { "type": "String" },
            "location": { "type": "String" }
        },
        "resources": [
            {
                "type": "Microsoft.App/sessionPools",
                "apiVersion": "2025-02-02-preview",
                "name": "[parameters('name')]",
                "location": "[parameters('location')]",
                "properties": {
                    "poolManagementType": "Dynamic",
                    "containerType": "Shell",
                    "scaleConfiguration": {
                        "maxConcurrentSessions": 5
                    },
                    "sessionNetworkConfiguration": {
                        "status": "EgressEnabled"
                    },
                    "dynamicPoolConfiguration": {
                        "lifecycleConfiguration": {
                            "lifecycleType": "Timed",
                            "coolDownPeriodInSeconds": 300
                        }
                    },
                    "mcpServerSettings": {
                        "isMCPServerEnabled": true
                    }
                }
            }
        ]
    }
    ```

    > [!NOTE]
    > Key properties in this template:
    > - `containerType: "Shell"` — creates sessions with a Linux shell environment.
    > - `mcpServerSettings.isMCPServerEnabled: true` — enables the platform-managed MCP endpoint.
    > - `coolDownPeriodInSeconds: 300` — sessions are destroyed after 5 minutes of inactivity.

1. Deploy the template:

    ```azurecli
    az deployment group create \
        --resource-group $RESOURCE_GROUP \
        --template-file deploy.json \
        --parameters name=$SESSION_POOL_NAME location=$LOCATION
    ```

## Get the MCP server endpoint

After deployment, retrieve the MCP endpoint URL for your session pool.

```azurecli
MCP_ENDPOINT=$(az rest --method GET \
    --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME" \
    --uri-parameters api-version=2025-02-02-preview \
    --query "properties.mcpServerSettings.mcpServerEndpoint" -o tsv)
```

## Get the MCP server credentials

The platform-managed MCP server uses API key authentication through the `x-ms-apikey` header. This approach is different from the bearer-token authentication that standard session pool management APIs use.

```azurecli
API_KEY=$(az rest --method POST \
    --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME/fetchMCPServerCredentials" \
    --uri-parameters api-version=2025-02-02-preview \
    --query "apiKey" -o tsv)
```

> [!WARNING]
> Treat the API key as a secret. Don't commit it to source control or share it publicly. The key authenticates all MCP tool invocations against your session pool.

## Initialize the MCP server

Send the `initialize` JSON-RPC request to establish the MCP connection:

```bash
curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{ "jsonrpc": "2.0", "id": "1", "method": "initialize" }'
```

You should see a response that includes:

- `protocolVersion`: `2025-03-26`
- `serverInfo.name`: `Microsoft Container Apps MCP Server`
- `capabilities.tools`: `{ "call": true, "list": true }`

## Launch a shell environment

Create a new shell environment to run commands.

```bash
ENVIRONMENT_RESPONSE=$(curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{ "jsonrpc": "2.0", "id": "2", "method": "tools/call", "params": { "name": "launchShell", "arguments": {} } }')

echo $ENVIRONMENT_RESPONSE
```

Extract the `environmentId` from the response for use in later commands.

```bash
ENVIRONMENT_ID=$(echo $ENVIRONMENT_RESPONSE | jq -r '.result.structuredContent.environmentId')
echo $ENVIRONMENT_ID
```

## Execute shell commands

Use the `$ENVIRONMENT_ID` from the previous step to run commands in the remote shell environment.

```bash
curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{
        "jsonrpc": "2.0",
        "id": "3",
        "method": "tools/call",
        "params": {
            "name": "runShellCommandInRemoteEnvironment",
            "arguments": {
                "environmentId": "'"$ENVIRONMENT_ID"'",
                "shellCommand": "echo Hello from Azure Container Apps Shell Session!"
            }
        }
    }'
```

The response includes command results in the `stdout` field.

Try additional commands:

```bash
# Check the operating system
curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{
        "jsonrpc": "2.0",
        "id": "4",
        "method": "tools/call",
        "params": {
            "name": "runShellCommandInRemoteEnvironment",
            "arguments": {
                "environmentId": "'"$ENVIRONMENT_ID"'",
                "shellCommand": "cat /etc/os-release && uname -a"
            }
        }
    }'
```

> [!NOTE]
> The `runShellCommandInRemoteEnvironment` tool accepts either a `shellCommand` string or an `execCommandAndArgs` array for commands with arguments. Use `shellCommand` for simple commands and `execCommandAndArgs` when you need precise control over argument escaping.

## Connect to GitHub Copilot in VS Code

You can connect the session pool MCP server to GitHub Copilot for a natural-language interface to the shell execution environment.

1. Create `.vscode/mcp.json` in your project:

    ```json
    {
        "servers": {
            "aca-shell-sessions": {
                "type": "http",
                "url": "<MCP_ENDPOINT>",
                "headers": {
                    "x-ms-apikey": "<API_KEY>"
                }
            }
        }
    }
    ```

    Replace `<MCP_ENDPOINT>` and `<API_KEY>` with the values from earlier steps.

    > [!WARNING]
    > Don't commit MCP API keys to source control. Use environment variables or a secrets manager in production. Add `.vscode/mcp.json` to your `.gitignore`.

1. Open VS Code, then open **Copilot Chat** in **Agent** mode.

1. Verify `aca-shell-sessions` appears in the Tools list.

1. Test with prompts like:
    - **"Launch a shell and show me the disk usage"**
    - **"Run a shell command to list all environment variables"**
    - **"Check what packages are installed in the shell environment"**

## Clean up resources

When you're finished with this tutorial, remove the resources you created to avoid incurring charges.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

- [MCP servers on Azure Container Apps — overview](mcp-overview.md)
- [Use MCP with dynamic sessions — Python interpreter](sessions-tutorial-python-mcp.md)
- [Dynamic sessions in Azure Container Apps](sessions.md)
- [Secure MCP servers on Container Apps](mcp-authentication.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
