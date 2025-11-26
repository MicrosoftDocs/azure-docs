---
title: Manage Azure Functions on Container Apps using Azure CLI
description: Learn how to deploy, configure, and manage Azure Functions on Azure Container Apps using the Azure CLI.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 11/25/2025
ms.author: cshoe
---

# Manage Azure Functions on Container Apps using Azure CLI

This article shows you how to deploy and manage Azure Functions on Azure Container Apps by using the Azure CLI. You learn how to set up your environment, create the necessary Azure resources, and deploy function apps for managing function operations.

## Prerequisites

Before you begin, ensure you have:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.0.70 or later.
- A [Functions app](functions-usage.md) ready for containerized deployment

## Manage functions

You can manage your deployed functions within Azure Container Apps using the Azure CLI. The following commands help you list, inspect, and interact with the functions running in your containerized environment.

> [!NOTE]
> When dealing with multirevision scenarios, add the `--revision <REVISION_NAME>` parameter to your command to target a specific revision.

### List functions

View all functions deployed in your container app:

```azurecli
# List all functions
az containerapp function list \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME>
```

### Show function details

Get detailed information about a specific function:

```azurecli
az containerapp function show \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --function-name <FUNCTIONS_APP_NAME>
```

## Monitor function invocations

Monitoring your function app is essential for understanding its performance and diagnosing issues. The following commands show you how to retrieve function URLs, trigger invocations, and view detailed telemetry and invocation summaries by using the Azure CLI.

1. To view invocation traces, get detailed traces of function invocations.

    ```azurecli
    az containerapp function invocations traces \
      --name <CONTAINER_APP_NAME> \
      --resource-group <RESOURCE_GROUP> \
      --function-name <FUNCTIONS_APP_NAME> \
      --timespan 5h \
      --limit 3
    ```

1. View an invocation summary to review successful and failed invocations.

    ```azurecli
    az containerapp function invocations summary \
      --name <CONTAINER_APP_NAME> \
      --resource-group <RESOURCE_GROUP> \
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
> Keep a minimum of one replica running for the following keys management commands to work.

```azurecli
az containerapp function keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --key-type hostKey
```

### Show a specific key

Show the value of a specific host-level key for your function app with the following command:

```azurecli
az containerapp function keys show \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --key-name <KEY_NAME> \
  --key-type hostKey
```

### Set a key

Set a specific host-level key for your function app with the following command:

```azurecli
az containerapp function keys set \
  --resource-group <RESOURCE_GROUP> \
  --name <CONTAINER_APP_NAME> \
  --key-name <KEY_NAME> \
  --key-value <KEY_VALUE> \
  --key-type hostKey
```

## Next steps

- [Learn about Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md)
- [Monitor Azure Functions](../azure-functions/functions-monitoring.md)
- [Scale apps in Azure Container Apps](scale-app.md)
- [Manage revisions in Azure Container Apps](revisions.md)
