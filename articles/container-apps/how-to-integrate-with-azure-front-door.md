---
title: Connect a private endpoint to an Azure Front Door
description: Learn how to connect a private endpoint to an Azure Front Door.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic:  how-to
ms.date: 11/1/2024
ms.author: cshoe
---

# Connect a private endpoint to an Azure Front Door

The following example shows you how to connect a private endpoint to an Azure Front Door.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. To ensure you're running the latest version of the CLI, run the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Install or update the Azure Container Apps extension for the CLI.

    If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI or cmdlets from the `Az.App` module in Azure PowerShell, be sure you have the latest version of the Azure Container Apps extension installed.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

    > [!NOTE]
    > Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](./whats-new.md), install the Container Apps extension with `--allow-preview true`.
    > ```azurecli
    > az extension add --name containerapp --upgrade --allow-preview true
    > ```

1. Register the `Microsoft.App`, `Microsoft.OperationalInsights`, and `Microsoft.ContainerService` namespaces.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

    ```azurecli
    az provider register --namespace Microsoft.ContainerService
    ```

## Set environment variables

Set the following environment variables.

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="centralus"
ENVIRONMENT_NAME="my-environment"
CONTAINERAPP_NAME="my-container-app"
AFD_PROFILE="my-afd-profile"
AFD_ENDPOINT="my-afd-endpoint"
ORIGIN_GROUP="my-afd-origin-group"
ORIGIN="my-afd-origin"
```

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

## Create an environment

Create the Container Apps environment.

```azurecli
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
```

With the environment created, you can retrieve the environment ID.

```azurecli
ENVIRONMENT_ID=`az containerapp env show --resource-group ${RESOURCE_GROUP} --name ${ENVIRONMENT_NAME} --query "id"`
```

Disable public network access for the environment. This is needed to enable private endpoints.

```azurecli
az rest -u ${ENVIRONMENT_ID}?api-version=2024-02-02-preview -b "{'properties': {'publicNetworkAccess':'Disabled'}}" -m Patch
```

## Deploy a container app

Run the following command to deploy a container app in your environment.

```azurecli
az containerapp up \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT_NAME \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

Retrieve the FQDN for your container app.

```azurecli
ACA_ENDPOINT=`az containerapp show --name ${CONTAINERAPP_NAME} --resource-group ${RESOURCE_GROUP} --query properties.configuration.ingress.fqdn`
```

## Create an Azure Front Door profile

Run the following command to create an Azure Front Door profile.

```azurecli
az afd profile create \
    --profile-name ${AFD_PROFILE} \
    --resource-group ${RESOURCE_GROUP} \
    --sku Standard_AzureFrontDoor
```

## Create an Azure Front Door endpoint

Run the following command to add an endpoint to your Azure Front Door profile.

```azurecli
az afd endpoint create \
    --resource-group ${RESOURCE_GROUP} \
    --endpoint-name ${AFD_ENDPOINT} \
    --profile-name ${AFD_PROFILE} \
    --enabled-state Enabled
```

## Create an Azure Front Door origin group

Run the following command to create an Azure Front Door origin group.

```azurecli
az afd origin-group create \
    --resource-group ${RESOURCE_GROUP} \
    --origin-group-name ${ORIGIN_GROUP} \
    --profile-name ${AFD_PROFILE} \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

## Create an Azure Front Door origin

Run the following command to add an Azure Front Door origin to your origin group.

```azurecli
az afd origin create \
    --resource-group ${RESOURCE_GROUP} \
    --origin-group-name ${ORIGIN_GROUP} \
    --origin-name ${ORIGIN} \
    --profile-name ${AFD_PROFILE} \
    --host-name ${ACA_ENDPOINT} \
    --origin-host-header ${ACA_ENDPOINT} \
    --priority 1 \
    --weight 500 \
    --enable-private-link true \
    --private-link-location ${LOCATION} \
    --private-link-request-message "please approve" \
    --private-link-resource ${ENVIRONMENT_ID} \
    --private-link-sub-resource-type managedEnvironments
```

## List private endpoint connections

Run the following command to list the private endpoint connections for your environment.

```azurecli
az network private-endpoint-connection list \
    --name ${ENVIRONMENT_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --type Microsoft.App/managedEnvironments
```

Record the private endpoint connection resource ID from the response. The private endpoint connection has a `properties.privateLinkServiceConnectionState.description` value of `please approve`. The private endpoint connection resource ID looks like the following.

TODO1 Use query instead, but query isn't working.

```
/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/managedEnvironments/my-environment/privateEndpointConnections/<PRIVATE_ENDPOINT_CONNECTION_ID>
```

Don't confuse this with the private endpoint ID, which looks like the following.

```
/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/eafd-Prod-centralus/providers/Microsoft.Network/privateEndpoints/<PRIVATE_ENDPOINT_ID>
```

## Approve the private endpoint connection

Run the following command to approve the connection. Replace the \<PLACEHOLDER\> with the value you recorded in the previous section.

```azurecli
az network private-endpoint-connection approve --id "<PRIVATE_ENDPOINT_CONNECTION_RESOURCE_ID>"
```

## Access your container app from Azure Front Door

TODO1

## Clean up resources

If you're not going to continue to use this application, you can remove the **my-container-apps** resource group. This deletes the Azure Container Apps instance and all associated services. It also deletes the resource group that the Container Apps service automatically created and which contains the custom network components.

::: zone pivot="azure-cli"

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they will also be deleted.

```azurecli-interactive
az group delete --name $RESOURCE_GROUP
```

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
