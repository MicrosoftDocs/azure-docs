---
title: 'Connect Azure Front Door Premium to an App Service origin with Private Link - Azure CLI'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a webapp privately using Azure CLI.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/18/2024
ms.author: duau
---

# Connect Azure Front Door Premium to an App Service origin with Private Link using Azure CLI

This article guides you through configuring Azure Front Door Premium to connect to your App Service privately using Azure Private Link with Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Prerequisites:
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A functioning Azure Front Door Premium profile, endpoint, and origin group. For more information, see [Create an Azure Front Door - CLI](../create-front-door-cli.md).
* A functioning private Web App. Refer to this [doc](../../private-link/create-private-link-service-cli.md) to learn how to set it up.

> [!NOTE]
> Private endpoints require your App Service plan or function hosting plan to meet certain requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).

## Enable Private Link to an App Service in Azure Front Door Premium

Run the [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) command to create a new Azure Front Door origin. Use the following settings to configure the App Service you want Azure Front Door Premium to connect with privately. Ensure the `private-link-location` is in one of the [available regions](../private-link.md#region-availability) and the `private-link-sub-resource-type` is **sites**.

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group myRGFD \
                     --origin-group-name og1 \
                     --origin-name pvtwebapp \
                     --profile-name contosoAFD \
                     --host-name example.contoso.com \
                     --origin-host-header example.contoso.com \
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location EastUS \
                     --private-link-request-message 'AFD app service origin Private Link request.' \
                     --private-link-resource /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Web/sites/webapp1/appServices \
                     --private-link-sub-resource-type sites
```

## Approve Azure Front Door Premium private endpoint connection from App Service

1. Run the [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) command to list the private endpoint connections for your web app. Note the `Resource ID` of the private endpoint connection on the first line of the output.

    ```azurecli-interactive
    az network private-endpoint-connection list --name webapp1 --resource-group myRGFD --type Microsoft.Web/sites
    ```

2. Run the [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) command to approve the private endpoint connection.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Web/sites/webapp1/privateEndpointConnections/00000000-0000-0000-0000-000000000000
    ```

3. Once approved, it takes a few minutes for the connection to fully establish. You can now access your App Service from Azure Front Door Premium. Direct access to the App Service from the public internet will be disabled after the private endpoint is enabled.

## Next steps

Learn more about [Private Link service with App Service](../../app-service/networking/private-endpoint.md).
