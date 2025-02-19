---
title: Access an Azure container app using an Azure Front Door
description: Learn how to access an Azure container app using an Azure Front Door.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2024
ms.topic:  how-to
ms.date: 02/03/2025
ms.author: cshoe
---

# Create a private link to an Azure Container App with Azure Front Door (preview)

In this article, you learn how to connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. In this tutorial, you create an Azure Container Apps workload profiles environment, an Azure Front Door, and connect them securely through a private link. You then verify the connectivity between your container app and the Azure Front Door.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- This feature is only available with the [Azure CLI](/cli/azure/install-azure-cli). To ensure you're running the latest version of the Azure CLI, run the following command.

    ```azurecli
    az upgrade
    ```

- The latest version of the Azure Container Apps extension for the Azure CLI. To ensure you're running the latest version, run the following command.

    ```azurecli
    az extension add --name containerapp --upgrade --allow-preview true
    ```

    > [!NOTE]
    > Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](./whats-new.md), install the Container Apps extension with `--allow-preview true`.

- This feature is only supported for workload profile environments.

For more information about prerequisites and setup, see [Quickstart: Deploy your first container app with containerapp up](get-started.md?tabs=bash).

## Set environment variables

Set the following environment variables.

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="centralus"
ENVIRONMENT_NAME="my-environment"
CONTAINERAPP_NAME="my-container-app"
AFD_PROFILE="my-afd-profile"
AFD_ENDPOINT="my-afd-endpoint"
AFD_ORIGIN_GROUP="my-afd-origin-group"
AFD_ORIGIN="my-afd-origin"
AFD_ROUTE="my-afd-route"
```

## Create an Azure resource group

Create a resource group to organize the services related to your container app deployment.

```azurecli
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION
```

## Create an environment

1. Create the Container Apps environment.

    ```azurecli
    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
    ```

1. Retrieve the environment ID. You use this to configure the environment.

    ```azurecli
    ENVIRONMENT_ID=$(az containerapp env show \
        --resource-group $RESOURCE_GROUP \
        --name $ENVIRONMENT_NAME \
        --query "id" \
        --output tsv)
    ```

1. Disable public network access for the environment.

    ```azurecli
    az containerapp env update \
        --id $ENVIRONMENT_ID \
        --public-network-access Disabled
    ```

## Deploy a container app

1. Run the following command to deploy a container app in your environment.

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

1. Retrieve your container app endpoint.

    ```azurecli
    ACA_ENDPOINT=$(az containerapp show \
        --name $CONTAINERAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --query properties.configuration.ingress.fqdn \
        --output tsv)
    ```

    If you browse to the container app endpoint, you receive `ERR_CONNECTION_CLOSED` because the container app environment has public access disabled. Instead, you use an AFD endpoint to access your container app.

## Create an Azure Front Door profile

Create an AFD profile. Private link is not supported for origins in an AFD profile with SKU `Standard_AzureFrontDoor`.

```azurecli
az afd profile create \
    --profile-name $AFD_PROFILE \
    --resource-group $RESOURCE_GROUP \
    --sku Premium_AzureFrontDoor
```

## Create an Azure Front Door endpoint

Add an endpoint to your AFD profile.

```azurecli
az afd endpoint create \
    --resource-group $RESOURCE_GROUP \
    --endpoint-name $AFD_ENDPOINT \
    --profile-name $AFD_PROFILE \
    --enabled-state Enabled
```

## Create an Azure Front Door origin group

Create an AFD origin group.

```azurecli
az afd origin-group create \
    --resource-group $RESOURCE_GROUP \
    --origin-group-name $AFD_ORIGIN_GROUP \
    --profile-name $AFD_PROFILE \
    --probe-request-type GET \
    --probe-protocol Http \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

## Create an Azure Front Door origin

Add an AFD origin to your origin group.

```azurecli
az afd origin create \
    --resource-group $RESOURCE_GROUP \
    --origin-group-name $AFD_ORIGIN_GROUP \
    --origin-name $AFD_ORIGIN \
    --profile-name $AFD_PROFILE \
    --host-name $ACA_ENDPOINT \
    --origin-host-header $ACA_ENDPOINT \
    --priority 1 \
    --weight 500 \
    --enable-private-link true \
    --private-link-location $LOCATION \
    --private-link-request-message "AFD Private Link Request" \
    --private-link-resource $ENVIRONMENT_ID \
    --private-link-sub-resource-type managedEnvironments
```

## List private endpoint connections

1. Run the following command to list the private endpoint connections for your environment.

    ```azurecli
    az network private-endpoint-connection list \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --type Microsoft.App/managedEnvironments
    ```

1. Record the private endpoint connection resource ID from the response. The private endpoint connection has a `properties.privateLinkServiceConnectionState.description` value of `AFD Private Link Request`. The private endpoint connection resource ID looks like the following.

    ```
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/managedEnvironments/my-environment/privateEndpointConnections/<PRIVATE_ENDPOINT_CONNECTION_ID>
    ```

    Don't confuse this with the private endpoint ID, which looks like the following.

    ```
    /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/eafd-Prod-centralus/providers/Microsoft.Network/privateEndpoints/<PRIVATE_ENDPOINT_ID>
    ```

## Approve the private endpoint connection

Run the following command to approve the connection. Replace the \<PLACEHOLDER\> with the private endpoint connection resource ID you recorded in the previous section.

```azurecli
az network private-endpoint-connection approve --id <PRIVATE_ENDPOINT_CONNECTION_RESOURCE_ID>
```

## Add a route

Run the following command to map the endpoint you created earlier to the origin group. Private endpoints on Azure Container Apps only support inbound HTTP traffic. TCP traffic is not supported.

```azurecli
az afd route create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $AFD_PROFILE \
    --endpoint-name $AFD_ENDPOINT \
    --forwarding-protocol MatchRequest \
    --route-name $AFD_ROUTE \
    --https-redirect Enabled \
    --origin-group $AFD_ORIGIN_GROUP \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled
```

## Access your container app from Azure Front Door

1. Retrieve the hostname of your AFD endpoint.

    ```azurecli
    az afd endpoint show \
        --resource-group $RESOURCE_GROUP \
        --profile-name $AFD_PROFILE \
        --endpoint-name $AFD_ENDPOINT \
        --query hostName \
        --output tsv
    ```

    Your hostname looks like the following example.

    ```
    my-afd-endpoint.<HASH>.b01.azurefd.net
    ```

1. Browse to the hostname. You see the output for the quickstart container app image.

    It takes a few minutes for your AFD profile to be deployed globally, so if you do not see the expected output at first, wait a few minutes and then refresh.

## Clean up resources

If you're not going to continue to use this application, you can remove the **my-container-apps** resource group. This deletes the Azure Container Apps instance and all associated services. It also deletes the resource group that the Container Apps service automatically created and which contains the custom network components.

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this guide exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Related content

- [Azure Private Link](/azure/private-link/private-link-overview)
- [Azure Front Door](/azure/frontdoor/)
