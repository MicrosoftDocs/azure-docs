---
title: 'Connect Azure Front Door Premium to a Storage Account origin with Private Link - CLI'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a Storage Account privately - CLI.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 06/09/2022
ms.author: duau
---

# Connect Azure Front Door Premium to a Storage Account origin with Private Link

This article will guide you through how to configure Azure Front Door Premium tier to connect to your Storage Account privately using the Azure Private Link service.


[!INCLUDE [azure-cli-prepare-your-environment](../../../includes/azure-cli-prepare-your-environment.md)]

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Have a functioning Azure Front Door Premium profile, endpoint and origin group. Refer [Create a Front Door - CLI](../create-front-door-cli.md) to learn how to create these.
* Have a functioning Storage Account that is also private. Refer this [doc](../../storage/common/storage-private-endpoints.md) to learn how to do the same.

> [!Note]
> Private endpoints requires your Storage Account to meet some requirements. For more information, see [Using Private Endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md).

## Enable Private Link to a Storage Account in Azure Front Door Premium
 
Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to create a new Azure Front Door origin. The table below has information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the Storage Account you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this origin. |
    | Origin Type | Enter type of origin |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of sub-resource for the resource selected above that your private endpoint will be able to access. |
    | Request message | Customize message or choose the default. |

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
                     --private-link-request-message 'Please approve this request' \
                     --private-link-resource /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Storage/storageAccounts/mystorage \
                     --private-link-sub-resource-type blob 
```

## Approve Azure Front Door Premium private endpoint connection from Azure Storage

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to list the private endpoint connections for your storage account. Note down the resource id of the private endpoint connection usually available in the first line of the output.

```azurecli-interactive
az network private-endpoint-connection list --name mystorage --resource-group myRGFD --type Microsoft.Storage/storageAccounts
```

2. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection

```azurecli-interactive
az network private-endpoint-connection approve --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRGFD/providers/Microsoft.Storage/storageAccounts/mystorage/privateEndpointConnections/mystorage.00000000-0000-0000-0000-000000000000

```
3. Once approved, it will take a few minutes for the connection to fully establish. You can now access your storage account from Azure Front Door Premium. Direct access to the storage account from the public internet gets disabled after private endpoint gets enabled.

## Next steps

Learn about [Private Link service with storage account](../../storage/common/storage-private-endpoints.md).


