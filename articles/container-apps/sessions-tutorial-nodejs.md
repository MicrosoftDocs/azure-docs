---
title: "Tutorial: Use code interpreter sessions for JavaScript code execution with Azure Container Apps"
description: Learn to use code interpreter sessions for JavaScript code execution on Azure Container Apps.
services: container-apps
author: IshitaAsthana
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 10/28/2024
ms.author: iasthana
---

# Tutorial: Use code interpreter sessions for JavaScript code execution with Azure Container Apps

In this tutorial, you learn how to use a code interpreter in dynamic sessions to execute JavaScript code. You can use dynamic sessions of code-interpreter to run untrusted code

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- **Microsoft.App Resource Provider**: Register this resource provider.

   ```shell
   az provider register --namespace Microsoft.App
   ```
   
## Create Azure resources

1. Update the Azure CLI to the latest version.

   ```shell
   az upgrade
   ```

1. Remove the Azure Container Apps extension if it's already installed and install a preview version the Azure Container Apps extension containing commands for sessions:

   ```shell
   az extension remove --name containerapp
   az extension add \
   --name containerapp \
   --allow-preview true -y
   ```

1. Sign in to Azure:

   ```shell
   az login
   ```

1. Set the variables used in this quickstart:

   ```shell
   SUBSCRIPTION_ID=<SUBSCRIPTION_GUID>
   RESOURCE_GROUP_NAME=<RESOURCE_GROUP_NAME>
   LOCATION=<LOCATION>
   SESSION_POOL_NAME=<SESSION_POOL_NAME>
   SESSION_IDENTIFIER_STRING = <SESSION_IDENTIFIER_STRING>
   EMAIL_ID=<user@microsoft.com>
   ```

1. Create a resource group:

    ```shell
    az account set -s $SUBSCRIPTION
    az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
    ```

1. Create a code interpreter session pool:

    ```shell
    az containerapp sessionpool create \
    --name $SESSION_POOL_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --location $LOCATION \
    --max-sessions 5 \
    --network-status EgressEnabled \
    --container-type NodeLTS \
    --cooldown-period 300
    ```


## RBAC Role Assignment for Session Code Execution APIs 

The role `Azure ContainerApps Session Executor` is required to execute code in container-apps sessions.

```shell
az role assignment create \
--role "Azure ContainerApps Session Executor"\
--assignee $EMAIL_ID \
--scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.App/sessionPools/$SESSION_POOL_NAME"
```

## Obtain BearerToken using the command

For direct access to the session pool’s API, generate an access token and include it in the `Authorization` header of your requests. Ensure the token contains an audience (`aud`) claim with the value `https://dynamicsessions.io`.

```shell
JWT_ACCESS_TOKEN=$(az account get-access-token --resource https://dynamicsessions.io --query accessToken -o tsv)
AUTH_HEADER="Authorization: Bearer $JWT_ACCESS_TOKEN"
```
## Retrieve the Session Pool Management Endpoint

```shell
SESSION_POOL_MANAGEMENT_ENDPOINT=$(az containerapp sessionpool show -n $SESSION_POOL_NAME -g $RESOURCE_GROUP_NAME --query "properties.poolManagementEndpoint" -o tsv)
```

## Code Samples

Below is a simple Hello-world example for JavaScript

```shell
curl -v -X 'POST' -H "$AUTH_HEADER" "$SESSION_POOL_MANAGEMENT_ENDPOINT/executions?api-version=2024-10-02-preview&identifier=test" -H 'Content-Type: application/json' -d '
{
    "code": "console.log(\"hello world\")"
}'
```
