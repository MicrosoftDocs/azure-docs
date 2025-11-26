---
title: "Tutorial: Execute shell commands in a session pool using Azure Container Apps (preview)"
description: Learn to use dynamic sessions to run shell commands in Azure Container Apps.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 10/30/2025
ms.author: jefmarti
---

# Tutorial: Execute shell commands in a session pool using Azure Container Apps (preview)

This tutorial demonstrates how to deploy a shell session pool in Azure Container Apps and execute shell commands using the Dynamic Sessions API and ARM templates.

In this tutorial you:

> [!div class="checklist"]
>
> * Deploy a shell session pool using ARM templates
> * Create a user-assigned managed identity with appropriate permissions
> * Execute shell commands via the Dynamic Sessions API

## Prerequisites

You need the following resources before you begin this tutorial.

| Requirement | Description |
|-------------|-------------|
| Azure account | You need an Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). |
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
   API_VERSION="2025-02-02-preview"
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

## Create the ARM template

Create an ARM template file named `deploy.json` to define your shell session pool.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "apiVersion": "2025-02-02-preview",
            "name": "myshellpool",
            "type": "Microsoft.App/sessionpools",
            "location": "North Central US",
            "properties": {
                "poolManagementType": "Dynamic",
                "containerType": "Shell", # Set the "containerType" property to "Shell"
                "scaleConfiguration": {
                    "maxConcurrentSessions": 5
                },
                "dynamicPoolConfiguration": {
                    "lifecycleConfiguration": {
                        "lifecycleType": "Timed",
                        "cooldownPeriodInSeconds": 300
                    }
                },
                "sessionNetworkConfiguration": {
                    "status": "EgressEnabled"
                }
            }
        }
    ]
}
```

## Deploy the shell session pool

Use the ARM template to deploy your shell session pool.

```azurecli
az deployment group create --resource-group $RESOURCE_GROUP --template-file deploy.json
```

## Assign a managed identity

Create a user-assigned managed identity that will be used for authenticating API calls to the session pool.

1. Set the identity name and pool resource ID.

   ```azurecli
   UAMI_NAME=${SESSION_POOL_NAME}-uami
   POOL_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionpools/$SESSION_POOL_NAME"
   ```

2. Create the user-assigned managed identity.

   ```azurecli
   az identity create --resource-group $RESOURCE_GROUP --name $UAMI_NAME --location $LOCATION
   ```

3. Get the principal ID of the managed identity.

   ```azurecli
   UAMI_PRINCIPAL=$(az identity show --resource-group $RESOURCE_GROUP --name $UAMI_NAME --query principalId -o tsv)
   ```

## Assign the managed identity to your Azure Container App

When creating or updating your Azure Container App, assign the user-assigned managed identity to the app. For example:

```azurecli
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group $RESOURCE_GROUP \
  --user-assigned $UAMI_NAME
```

Refer to [Assign a managed identity to a container app](/azure/container-apps/managed-identity) for more details.

## Set role assignments for session execution APIs

To interact with the session pool's API, you must assign the `Azure ContainerApps Session Executor` role to your managed identity.

Wait for identity propagation, then assign the role to the managed identity.

   ```azurecli
   az role assignment create --assignee $UAMI_PRINCIPAL --role "Azure ContainerApps Session Executor" --scope $POOL_ID
   ```

## Get a bearer token

To access the session pool's API, you need an access token. The method depends on where you're running the code:

### From inside your Azure Container App

When running from inside an Azure Container App that has the user-assigned managed identity assigned, obtain an access token using the Azure Instance Metadata Service (IMDS):

```sh
ACCESS_TOKEN=$(curl -s -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://dynamicsessions.io" \
  | jq -r '.access_token')
```

This command retrieves the token and extracts the `access_token` value from the JSON response using `jq`.

### For local testing and development

When testing locally or from your development environment, you can obtain an access token using the Azure CLI (you must have the appropriate permissions):

```azurecli
ACCESS_TOKEN=$(az account get-access-token --resource "https://dynamicsessions.io" --query accessToken --output tsv)
```

> [!NOTE]
> For local testing to work, your Azure CLI session must be authenticated as a user or service principal that has the "Azure ContainerApps Session Executor" role assigned to the session pool. The managed identity approach is recommended for production scenarios.

## Execute shell commands in your session

Now that you have a bearer token to establish the security context, you can send a request to the session pool to execute shell commands.

1. Create the request body for the API call.

   ```sh
   EXEC_ID=$(uuidgen)
   BODY=$(cat <<EOF
    {
      "codeInputType": "inline",
      "executionType": "synchronous",
      "shellCommand": "echo Hello world!",
      "timeoutInSeconds": 600
    }
    EOF
    )
   ```

2. Construct the API endpoint URL.

   ```sh
   URL="https://$LOCATION.dynamicsessions.io/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/sessionPools/$SESSION_POOL_NAME/executions?api-version=$API_VERSION&identifier=$EXEC_ID"
   ```

3. Execute the shell commands.

   **From inside Azure Container App or local testing:**

   ```sh
   curl --request POST --url "$URL" --header "Authorization: Bearer $ACCESS_TOKEN" --header 'content-type: application/json' --data "$BODY"
   ```

   You should receive a JSON response containing the execution results, including the output from the shell commands (`hello world` and `hi`).

## Verify your deployment

You can verify that your resources were created successfully using these commands:

1. Verify session pool deployment.

   ```azurecli
   az resource show --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionpools/$SESSION_POOL_NAME" --query '{name:name, location:location, provisioningState:properties.provisioningState}'
   ```

2. Verify role assignment.

   ```azurecli
   az role assignment list --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/sessionpools/$SESSION_POOL_NAME" --output table
   ```

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Next steps

* [Learn more about Azure Container Apps sessions](../container-apps/sessions.md)
* [Explore Dynamic Sessions API samples](https://github.com/Azure-Samples/container-apps-dynamic-sessions-samples)
* [Understanding session pool management](../container-apps/sessions-usage.md)
