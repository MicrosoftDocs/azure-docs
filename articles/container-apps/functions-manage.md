---
title: Manage your Azure Functions in Container Apps
description: Learn to manage functions in Container Apps
services: container-apps
author: deepganguly
ms.service: azure-container-apps
ms.topic:  how-to
ms.date: 01/12/2026
ms.author: deepganguly
---

# Manage Azure Functions in Azure Container Apps

You can manage your deployed functions within Azure Container Apps by using the Azure CLI. The following commands help you list, inspect, and interact with the functions running in your containerized environment.

> [!NOTE]
> When dealing with multirevision scenarios, add the `--revision <REVISION_NAME>` parameter to your command to target a specific revision.

## List functions

View all functions deployed in your container app:

```azurecli
# List all functions
az containerapp function list \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINERAPP_NAME
```

## Show function details

Get detailed information about a specific function:

```azurecli
az containerapp function show \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINERAPP_NAME \
  --function-name <FUNCTIONS_APP_NAME>
```

## Monitor function invocations

Monitoring your function app is essential for understanding its performance and diagnosing problems. The following commands show you how to retrieve function URLs, trigger invocations, and view detailed telemetry and invocation summaries by using the Azure CLI. Before calling the traces, invoke the function a few times by using `curl -X POST "fqdn/api/HttpExample"`.

1. To view invocation traces, get detailed traces of function invocations:

    ```azurecli
    az containerapp function invocations traces \
      --name $CONTAINERAPP_NAME \
      --resource-group $RESOURCE_GROUP \
      --function-name <FUNCTIONS_APP_NAME> \
      --timespan 5h \
      --limit 3
    ```

1. View an invocation summary to review successful and failed invocations.

    ```azurecli
    az containerapp function invocations summary \
      --name $CONTAINERAPP_NAME \
      --resource-group $RESOURCE_GROUP \
      --function-name <FUNCTIONS_APP_NAME> \
      --timespan 5h
    ```

## Manage function keys

Azure Functions uses [keys for authentication and authorization](/azure/azure-functions/function-keys-how-to). You can manage the following different types of keys:

- **Host keys**: Access any function in the app
- **Master keys**: Provide administrative access
- **System keys**: Used by Azure services
- **Function keys**: Access specific functions

The following commands show you how to manage keys for the host. To run the same command for a specific Functions app, add the `--function-name <FUNCTIONS_APP_NAME>` parameter to your command.

### List keys

Use the following commands to list host-level and function-specific keys for your Azure Functions running in Container Apps.

> [!NOTE]
> Keep at least one replica running for the following keys management commands to work.

```azurecli
az containerapp function keys list \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINERAPP_NAME \
  --key-type hostKey
```

### Show a specific key

Show the value of a specific host-level key for your function app by using the following command:

```azurecli
az containerapp function keys show \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINERAPP_NAME \
  --key-name <KEY_NAME> \
  --key-type hostKey
```

### Set a key

Set a specific host-level key for your function app by using the following command:

```azurecli
az containerapp function keys set \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINERAPP_NAME \
  --key-name <KEY_NAME> \
  --key-value <KEY_VALUE> \
  --key-type hostKey
```

### Key management with Azure Key Vault

When you use Azure Key Vault to store secrets for Azure Functions on Container Apps, key generation works differently than in traditional Functions hosting.

By default:

- The Functions host doesn't automatically create keys in Key Vault when it starts.

- The Functions host retrieves and uses keys if they already exist in Key Vault.

- The Functions host starts successfully even without keys, and the key synchronization completes normally.

As a result, your application runs correctly, but host-level keys don't appear in Key Vault unless you create them manually.

#### Generate keys manually

To trigger key creation in Azure Key Vault, call the Functions management endpoint by using the following CLI command.

```azurecli
az containerapp function keys list \
 -n <CONTAINER_APP_NAME> \
 -g <RESOURCE_GROUP> \
 --key-type hostKey
```

## Related content

- [Azure Functions on Azure Container Apps overview](../../articles/container-apps/functions-overview.md)
