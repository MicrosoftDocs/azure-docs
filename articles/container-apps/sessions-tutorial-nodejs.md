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

# Tutorial: Run JavaScript code in a code interpreter session in Azure Container Apps (preview)

This tutorial demonstrates how to execute JavaScript code in Azure Container Apps dynamic sessions using an HTTP API.

In this tutorial you:

> [!div class="checklist"]
> * Create a new code interpreter session
> * Set the appropriate security context for your session pool
> * Pass in JavaScript code for the container app to run

> [!NOTE]
> The JavaScript code interpreter feature in Azure Container Apps dynamic sessions is currently in preview. For more information, see [preview limitations](./sessions.md#preview-limitations).

## Prerequisites

You need the following resources before you begin this tutorial.

| Resource | Description |
|---|---|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |

## Setup	

Begin by preparing the Azure CLI with the latest updates and signing into to Azure.

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
    az extension add \
      --name containerapp \
      --allow-preview true --upgrade
    ```

1. Sign in to Azure.

   ```azurecli
   az login
   ```
   
1. Query for your Azure subscription ID and set the value to a variable.

    ```bash
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    ```
    
1. Set the variables used in this procedure.

    Before you run the following command, make sure to replace the placeholders surrounded by `<>` with your own values.

    ```bash
    RESOURCE_GROUP=<RESOURCE_GROUP_NAME>
    SESSION_POOL_NAME=<SESSION_POOL_NAME>
    LOCATION="northcentralus"
    ```

   You use these variables to create the resources in the following steps.
   
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

To interact with the session pool's API, you must use an identity with the `Azure ContainerApps Session Executor` role assignment. In this tutorial, you use your Microsoft Entra ID user identity to call the API.

1. Query your user object ID.

   ```azurecli
   USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)
   ```
   
1. Assign the role to your identity.

    ```azurecli
    az role assignment create \
      --role "Azure ContainerApps Session Executor" \
      --assignee-object-id $USER_OBJECT_ID \
      --assignee-principal-type User \
      --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME"
    ```

## Get a bearer token

For direct access to the session pool’s API, generate an access token to include in the `Authorization` header of your requests. Ensure the token contains an audience (`aud`) claim with the value `https://dynamicsessions.io`. For more information, see [authentication and authorization](./sessions.md?tabs=azure-cli#authentication) rules.

1. Get an access token.

    ```bash
    JWT_ACCESS_TOKEN=$(az account get-access-token --resource https://dynamicsessions.io --query accessToken -o tsv)
    ```

1. Create a variable to hold the request header.

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

Now that you have a bearer token to establish the security context, and the session pool endpoint, you can send a request to the application to execute your code block.

Run the following command to run the JavaScript code to log "hello world" in your application.

```bash
curl -v -X 'POST' -H "$AUTH_HEADER" "$SESSION_POOL_MANAGEMENT_ENDPOINT/code/execute?api-version=2024-02-02-preview&identifier=test" -H 'Content-Type: application/json' -d '
{
    "properties": {
        "codeInputType": "inline",
        "executionType": "synchronous",
        "code": "console.log(\"hello-world\")"
    }
}'
```

You should see output that resembles the following example.

```json
{
  "properties": {
    "status": "Success",
    "stdout": "hello-world\n",
    "stderr": "",
    "executionResult": "",
    "executionTimeInMilliseconds": 5
  }
}
```

You can find more [code interpreter API samples](https://github.com/Azure-Samples/container-apps-dynamic-sessions-samples/blob/main/code-interpreter/api-samples.md) on GitHub.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Code interpreter sessions](./sessions-code-interpreter.md)
