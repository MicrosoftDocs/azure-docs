---
title: 'Tutorial: Use MCP with dynamic sessions (Python)'
description: Learn how to create a Python session pool with the platform-managed MCP server enabled and execute Python code remotely using Azure Container Apps dynamic sessions.
#customer intent: As a developer, I want to use the platform-managed MCP server with a Python session pool so that I can execute Python code remotely from the CLI or GitHub Copilot.
ms.topic: tutorial
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Tutorial: Use MCP with dynamic sessions (Python)

> [!IMPORTANT]
> The platform-managed MCP server for dynamic sessions is in **preview**. The API version `2025-02-02-preview` and `mcpServerSettings` properties are subject to change.

This tutorial shows how to create a session pool with the platform-managed MCP server enabled, connect to it, and execute Python code remotely.

Unlike the [standalone MCP server tutorials](mcp-overview.md#standalone-container-app), you don't write or deploy MCP server code. The platform provides built-in tools for Python session pools:

| Tool | Description |
|------|-------------|
| `launchShell` | Creates a new environment and returns an `environmentId` |
| `runPythonCodeInRemoteEnvironment` | Executes Python code in an existing environment |
| `runShellCommandInRemoteEnvironment` | Executes a shell command in an existing environment |

In this tutorial, you:

> [!div class="checklist"]
> - Create a Python session pool with MCP server enabled
> - Retrieve the MCP endpoint and API key
> - Initialize the MCP connection and execute Python code via JSON-RPC
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

1. Create a resource group:

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

## Create a Python session pool with MCP server

Deploy a session pool by using an ARM template with MCP enabled.

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
                    "containerType": "PythonLTS",
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
    > - `containerType: "PythonLTS"`: Creates sessions with a Python runtime.
    > - `mcpServerSettings.isMCPServerEnabled: true`: Enables the platform-managed MCP endpoint.
    > - `coolDownPeriodInSeconds: 300`: Sessions are destroyed after 5 minutes of inactivity.

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

## Get MCP server credentials

The platform-managed MCP server uses API key authentication through the `x-ms-apikey` header. This authentication method differs from the bearer-token authentication that standard session pool management APIs use.

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

## Launch a Python environment

Create a new Python environment:

```bash
ENVIRONMENT_RESPONSE=$(curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{ "jsonrpc": "2.0", "id": "2", "method": "tools/call", "params": { "name": "launchShell", "arguments": {} } }')

echo $ENVIRONMENT_RESPONSE
```

Extract the `environmentId` from the `structuredContent` field in the response. You need this ID for all subsequent commands.

```bash
ENVIRONMENT_ID=$(echo $ENVIRONMENT_RESPONSE | jq -r '.result.structuredContent.environmentId')
echo $ENVIRONMENT_ID
```

> [!NOTE]
> The `launchShell` tool generates a unique environment identifier. The actual session is allocated "lazily". When you execute your first command, the session pool assigns a Hyper-V-isolated container to handle it.

## Execute Python commands

To run Python code in the remote environment, use the `$ENVIRONMENT_ID` from the previous step.

```bash
curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{
        "jsonrpc": "2.0",
        "id": "3",
        "method": "tools/call",
        "params": {
            "name": "runPythonCodeInRemoteEnvironment",
            "arguments": {
                "environmentId": "'"$ENVIRONMENT_ID"'",
                "pythonCode": "import sys; print(f\"Python {sys.version}\")"
            }
        }
    }'
```

The response includes command results in the `stdout` field within `structuredContent`.

Try a more complex example:

```bash
curl -sS -X POST "$MCP_ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "x-ms-apikey: $API_KEY" \
    -d '{
        "jsonrpc": "2.0",
        "id": "4",
        "method": "tools/call",
        "params": {
            "name": "runPythonCodeInRemoteEnvironment",
            "arguments": {
                "environmentId": "'"$ENVIRONMENT_ID"'",
                "pythonCode": "import math\nresults = {n: math.factorial(n) for n in range(1, 11)}\nfor k, v in results.items():\n    print(f\"{k}! = {v}\")"
            }
        }
    }'
```

## Connect to GitHub Copilot in VS Code

You can connect the session pool MCP server to GitHub Copilot for a natural-language interface to the code execution environment.

1. Create `.vscode/mcp.json` in your project:

    ```json
    {
        "servers": {
            "aca-python-sessions": {
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

1. Verify `aca-python-sessions` appears in the Tools list.

1. Test with prompts like:
    - **"Launch a Python environment and calculate the first 20 Fibonacci numbers"**
    - **"Run a Python script that fetches https://api.github.com and prints the response headers"**

## Clean up resources

When you finish this tutorial, remove the resources you created to avoid incurring charges.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Use MCP with dynamic sessions (shell)](sessions-tutorial-shell-mcp.md)
- [Dynamic sessions in Azure Container Apps](sessions.md)
- [Secure MCP servers on Container Apps](mcp-authentication.md)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)
