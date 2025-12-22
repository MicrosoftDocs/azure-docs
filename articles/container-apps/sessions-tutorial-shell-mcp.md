---
title: "Tutorial: Use an MCP server with shell sessions in Azure Container Apps (preview)"
description: Learn to use dynamic sessions to run shell commands with MCP in Azure Container Apps.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 10/30/2025
ms.author: jefmarti
---


# Tutorial: Use an MCP server with shell sessions in Azure Container Apps (preview)

This tutorial demonstrates how to deploy and interact with a shell environment in Azure Container Apps dynamic sessions using the Model Context Protocol (MCP) server.

In this tutorial you:

> [!div class="checklist"]
>
> * Create a shell session pool with MCP server enabled
> * Set up the MCP server endpoint and credentials
> * Execute shell commands remotely using JSON-RPC

## Prerequisites

You need the following resources before you begin this tutorial.

| Requirement | Description |
|-------------|-------------|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.com/free). |
| Azure CLI | [Install the Azure CLI](/cli/azure/install-azure-cli). |

## Setup

Begin by preparing the Azure CLI with the latest updates and signing in to Azure.
 
1. Update the Azure CLI to the latest version.

   ```azurecli
   az upgrade
   ```

1. Register the `Microsoft.App` resource provider.

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. Install the latest version of the Azure Container Apps CLI extension.

   ```azurecli
   az extension add --name containerapp --allow-preview true --upgrade
   ```

1. Sign in to Azure.

   ```azurecli
   az login
   ```

1. Query for your Azure subscription ID and set the value to a variable.

   ```azurecli
   SUBSCRIPTION_ID=$(az account show --query id --output tsv)
   ```

1. Set the variables used in this procedure.

   Before you run the following command, make sure to replace the placeholders surrounded by `<>` with your own values.

   ```azurecli
   RESOURCE_GROUP=<RESOURCE_GROUP_NAME>
   SESSION_POOL_NAME=<SESSION_POOL_NAME>
   LOCATION=<LOCATION>
   ```

   You use these variables to create the resources in the following steps.

1. Set the subscription you want to use for creating the resource group.

   ```azurecli
   az account set -s $SUBSCRIPTION_ID
   ```

1. Create a resource group.

   ```azurecli
   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

## Create a shell session pool with MCP server

Use an ARM template to create a shell session pool with MCP server enabled.

1. Create a deployment template file named `deploy.json`:

   ```json
   {
       "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
                   "containerType": "Shell", # Set the "containerType" property to "Shell"
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
                       "isMCPServerEnabled": true # Add the "mcpServerSettings" section to enable the MCP server
                   }
               }
           }
       ]
   }
   ```

2. Deploy the ARM template.

   ```azurecli
   az deployment group create \
     --resource-group $RESOURCE_GROUP \
     --template-file deploy.json \
     --parameters name=$SESSION_POOL_NAME location=$LOCATION
   ```

## Get the MCP server endpoint

Retrieve the MCP server endpoint from the deployed session pool.

```azurecli
MCP_ENDPOINT=$(az rest --method GET --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME?api-version=2025-02-02-preview" --query "properties.mcpServerSettings.mcpServerEndpoint" -o tsv)
```

## Get MCP server credentials

Request API credentials for the MCP server.

```azurecli
API_KEY=$(az rest --method POST --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME/fetchMCPServerCredentials?api-version=2025-02-02-preview" --query "apiKey" -o tsv)
```

## Initialize the MCP server

Initialize the MCP server connection using JSON-RPC.

```azurecli
curl -sS -X POST "$MCP_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "x-ms-apikey: $API_KEY" \
  -d '{ "jsonrpc": "2.0", "id": "1", "method": "initialize" }'
```

You should see a response that includes `protocolVersion` and `serverInfo`.

## Launch a shell environment

Create a new shell environment in the session pool.

```azurecli
ENVIRONMENT_RESPONSE=$(curl -sS -X POST "$MCP_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "x-ms-apikey: $API_KEY" \
  -d '{ "jsonrpc": "2.0", "id": "2", "method": "tools/call", "params": { "name": "launchShell", "arguments": {} } }')

echo $ENVIRONMENT_RESPONSE
```

Extract the environment ID from the response for use in subsequent commands.

## Execute shell commands

Run commands in your remote shell environment. Replace `<ENVIRONMENT_ID>` with the ID returned from the previous step.

```azurecli
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
        "environmentId": "<ENVIRONMENT_ID>",
        "shellCommand": "echo Hello from Azure Container Apps Shell Session!"
      }
    }
  }'
```

You should see output that includes the command results in the `stdout` field.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Next steps

- [Container Apps dynamic sessions overview](/azure/container-apps/sessions)