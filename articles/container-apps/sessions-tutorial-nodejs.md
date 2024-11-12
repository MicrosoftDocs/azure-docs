---
title: "Tutorial: Run JavaScript code in a code interpreter session in Azure Container Apps"
description: Learn to use code interpreter sessions to run JavaScript code in Azure Container Apps.
services: container-apps
author: IshitaAsthana
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 11/08/2024
ms.author: iasthana
---

# Tutorial: Run JavaScript code in a code interpreter session in Azure Container Apps (Preview)

This tutorial demonstrates how to execute JavaScript code in Azure Container Apps dynamic sessions using an HTTP API. Currently JavaScript code interpreter functionality is in Preview state.

In this tutorial you:

> [!div class="checklist"]
> * Create a new code interpreter session
> * Set the appropriate security context for your session pool
> * Pass in JavaScript code for the container app to run

> [!NOTE]
> Azure Container Apps dynamic sessions is currently in preview. See [preview limitations](./sessions.md#preview-limitations) for more information.

> [!NOTE]
> Sessions supporting NodeJS runtime are currently supported only in the below regions
> ```
> - Central US EUAP
> - East US 2 EUAP
> - West US 2
> - East US
> - East Asia
> - North Central US
> - Germany West Central
> - Poland Central
> - Italy North
> - Switzerland North
> - Australia East
> - West Central US
> - Norway East
> - Sweden Central
> - Japan East
> - North Europe
> ```

## Prerequisites

You need the following resources before you begin this tutorial.

| Resource | Description |
|---|---|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |

## Set up

Begin by preparing the Azure CLI with the latest updates and signing into to Azure.

1. Update the Azure CLI to the latest version.

   ```azurecli
   az upgrade
   ```

1. Register the `Microsoft.App` resource provider.

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. Remove the Azure Container Apps CLI extension and install a preview version of the extension.

    The preview version includes commands to manage dynamic sessions.

    First, remove the existing instance of the `containerapp` extension.

    ```azurecli
    az extension remove --name containerapp
    ```

    Then, add the preview version of the extension.

    ```azurecli
    az extension add \
      --name containerapp \
      --allow-preview true -y
    ```

1. Sign in to Azure.

   ```azurecli
   az login
   ```

1. View supported regions.

    ```azurecli
    az provider show \
      -n Microsoft.App \
      --query "resourceTypes[?resourceType=='sessionPools'].locations"
    ```

1. Set the variables used in this procedure.

    Before you run the following command, make sure to replace the placeholders surrounded by `<>` with your own values.

    ```bash
    SUBSCRIPTION_ID=<SUBSCRIPTION_GUID>
    RESOURCE_GROUP=<RESOURCE_GROUP>
    LOCATION=<LOCATION>
    SESSION_POOL_NAME=<SESSION_POOL_NAME>
    ```

    You use the subcriptions id, resource group name and location to create a resource group in the next step. The session pool name is used throughout the following commands to create and manage the dynamic session pool.

1. Set the subscription you want to use for creating the resource group
   
    ```azurecli
    az account set -s $SUBSCRIPTION_ID
    ```

1. Create a resource group.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION
    ```

## Create a code interpreter session pool

Use the `az containerapp sessionpool create` command to create a Node.js session pool that is responsible for executing arbitrary JavaScript code.

```azurecli
az containerapp sessionpool create \
  --name $SESSION_POOL_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --max-sessions 5 \
  --network-status EgressEnabled \
  --container-type NodeLTS \
  --cooldown-period 300
```

## Set role assignments for code execution APIs

The interpreter session needs run under an appropriate security context. The role `Azure ContainerApps Session Executor` for the session have the permissions to execute your code.

```azurecli
USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)
```

```azurecli
az role assignment create \
  --role "Azure ContainerApps Session Executor" \
  --assignee-object-id $USER_OBJECT_ID \
  --assignee-principal-type User \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME"
```

## Get a bearer token

For direct access to the session pool’s API, generate an access token to include in the `Authorization` header of your requests. Ensure the token contains an audience (`aud`) claim with the value `https://dynamicsessions.io`.
More details on auth can be found at [Authentication and authorization](https://learn.microsoft.com/azure/container-apps/sessions?tabs=azure-cli#authentication)

```bash
JWT_ACCESS_TOKEN=$(az account get-access-token --resource https://dynamicsessions.io --query accessToken -o tsv)
```

Now with your bearer token defined, you can create a variable to hold the request header.

```bash
AUTH_HEADER="Authorization: Bearer $JWT_ACCESS_TOKEN"
```

This header accompanies the request you make to your application's endpoint.

## Get the session pool management endpoint

Use the following command to return the application's endpoint.

```bash
SESSION_POOL_MANAGEMENT_ENDPOINT=$(az containerapp sessionpool show -n $SESSION_POOL_NAME -g $RESOURCE_GROUP --query "properties.poolManagementEndpoint" -o tsv)
```

This endpoint is the location where you make API calls to execute your code payload in the code interpreter session.

## Execute code in your session

Now that you have a bearer token to establish the security context, and the session pool endpoint, you can issue a request to the application to execute your code block.

Run the following command to run the JavaScript code to log "hello world" in your application.

```bash
curl -v -X 'POST' -H "$AUTH_HEADER" "$SESSION_POOL_MANAGEMENT_ENDPOINT/code/execute?api-version=2024-10-02-preview&identifier=test" -H 'Content-Type: application/json' -d '
{
    "properties": {
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "console.log(\"hello-world\")"
    }
}'
```
You should see "status":"Success" and "stdout" with "hello world\n" as the output.

```bash
{
	"properties": {
		"$id": "<guid>",
		"status": "Success",
		"stdout": "hello-world\n",
		"stderr": "",
		"executionResult": "",
		"executionTimeInMilliseconds": 5
	}
}
```

More samples can be found at [Code Interpreter API Samples](https://github.com/Azure-Samples/container-apps-dynamic-sessions-samples/blob/main/code-interpreter/api-samples.md)

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Code interpreter sessions](./sessions-code-interpreter.md)
