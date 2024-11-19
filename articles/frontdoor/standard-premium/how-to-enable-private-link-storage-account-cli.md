---
title: 'Connect Azure Front Door Premium to a Storage Account origin with Private Link - Azure CLI'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a Storage Account privately - Azure CLI.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 11/18/2024
ms.author: duau
---

# Connect Azure Front Door Premium to a Storage Account origin with Private Link with Azure CLI

This article provides a step-by-step guide on how to configure Azure Front Door Premium to connect to your Storage Account privately using Azure Private Link with Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Prerequisites:
* An active Azure subscription. [Create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A functioning Azure Front Door Premium profile, endpoint, and origin group. For setup instructions, see [Create a Front Door - CLI](../create-front-door-cli.md).
* A private Storage Account. Refer to this [documentation](../../storage/common/storage-private-endpoints.md) for guidance.

> [!NOTE]
> Private endpoints require your Storage Account to meet specific requirements. For more information, see [Using Private Endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md).

## Enable Private Link to a Storage Account in Azure Front Door Premium

Run the [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) command to create a new Azure Front Door origin. Use the following settings to configure the Storage Account for private connection. Ensure the `private-link-location` is in one of the [available regions](../private-link.md#region-availability) and the `private-link-sub-resource-type` is **blob**.

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group myRGFD \
                     --origin-group-name og1 \
                     --origin-name mystorageorigin \
                     --profile-name contosoAFD \
                     --host-name mystorage.blob.core.windows.net \
                     --origin-host-header mystorage.blob.core.windows.net \
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location EastUS \
                     --private-link-request-message 'AFD storage origin Private Link request.' \
                     --private-link-resource /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Storage/storageAccounts/mystorage \
                     --private-link-sub-resource-type blob 
```

## Approve Azure Front Door Premium private endpoint connection from Azure Storage

1. Run the [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) command to list the private endpoint connections for your storage account. Note the `Resource ID` of the private endpoint connection from the output.

    ```azurecli-interactive
    az network private-endpoint-connection list --name mystorage --resource-group myRGFD --type Microsoft.Storage/storageAccounts
    ```

2. Run the [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) command to approve the private endpoint connection.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Storage/storageAccounts/mystorage/privateEndpointConnections/mystorage.00000000-0000-0000-0000-000000000000
    ```

3. After approval, it can take a few minutes for the connection to be fully established. Once established, Azure Front Door Premium can access your storage account. Public internet access to the storage account is disabled once the private endpoint is enabled.

> [!NOTE]
> If the blob or container within the storage account does not allow anonymous access, requests must be authorized. One way to authorize requests is by using [shared access signatures](../../storage/common/storage-sas-overview.md).

## Next steps

Learn more about [Private Link service with storage account](../../storage/common/storage-private-endpoints.md).
