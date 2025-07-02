---
title: Connect Azure Front Door to a Storage Account Origin
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a storage account privately with Azure Private Link.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 07/02/2025
ms.custom: devx-track-azurecli, build-2025
zone_pivot_groups: front-door-dev-exp-portal-cli
---

# Connect Azure Front Door Premium to a storage account origin with Private Link

**Applies to:** :heavy_check_mark: Front Door Premium

This article guides you through configuring Azure Front Door Premium to connect privately to a storage account origin using Azure Private Link service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

::: zone pivot="front-door-portal"

- A Private Link. For more information, see [Create a Private Link service](../../private-link/create-private-link-service-portal.md) for your origin web server.

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

::: zone-end

::: zone pivot="front-door-cli"

- A Private Link. For more information, see [Create a Private Link service](../../private-link/create-private-link-service-cli.md) for your origin web server.

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

::: zone-end

> [!NOTE]
> Private endpoints require your Storage Account to meet specific requirements. For more information, see [Using Private Endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md).


## Enable Private Link to a storage account in Azure Front Door

::: zone pivot="front-door-portal"
 
In this section, you map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under **Settings**, select **Origin groups**.

1. Select the origin group that contains the storage account origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new storage account origin or select a previously created storage account origin from the list.

1. Select or enter the following values to configure the storage blob you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this storage blog origin. |
    | Origin type | Storage (Azure Blobs) |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of subresource for the resource selected previously that your private endpoint can access. You can select *blob* or *web*. |
    | Request message | Custom message to see while approving the Private Endpoint. |

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-storage-account.png" alt-text="Screenshot of enabling private link to a storage account.":::

1. Select **Add** to save your configuration.

1. Select **Update** to save the origin group settings.

> [!NOTE]
> Ensure the **origin path** in your routing rule is configured correctly with the storage container file path so file requests can be acquired.

::: zone-end

::: zone pivot="front-door-cli"

Use the [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) command to create a new Azure Front Door origin. The `private-link-location` value must be from the [available regions](../private-link.md#region-availability) and the `private-link-sub-resource-type` value is **blob**.

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group 'myResourceGroup' \
                     --origin-group-name 'og1' \
                     --origin-name 'mystorageorigin' \
                     --profile-name 'contosoAFD' \
                     --host-name 'mystorage.blob.core.windows.net' \
                     --origin-host-header 'mystorage.blob.core.windows.net' \
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location 'EastUS' \
                     --private-link-request-message 'AFD storage origin Private Link request.' \
                     --private-link-resource '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorage' \
                     --private-link-sub-resource-type blob 
```

::: zone-end

## Approve Front Door private endpoint connection from the storage account

::: zone pivot="front-door-portal"

1. Go to the storage account you configured Private Link for in the previous section.

1. Under **Settings**, select **Networking**.

1. In **Networking**, select **Private endpoint connections**. 

1. Select the **pending** private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-pending-approval.png" alt-text="Screenshot of pending storage private endpoint request.":::

::: zone-end

::: zone pivot="front-door-cli"

1. Use the [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) command to list the private endpoint connections for your storage account. Note the `Resource ID` of the private endpoint connection from the output.

    ```azurecli-interactive
    az network private-endpoint-connection list --name 'mystorage' --resource-group 'myResourceGroup' --type 'Microsoft.Storage/storageAccounts'
    ```

2. Use the [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) command to approve the private endpoint connection.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorage/privateEndpointConnections/mystorage.aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e'
    ```

::: zone-end

It takes a few minutes for the connection to fully establish after approval. Once established, you can access your storage account privately through Azure Front Door Premium. Public internet access to the storage account is disabled once the private endpoint is enabled.

> [!NOTE]
> If the blob or container within the storage account doesn't permit anonymous access, requests made against the blob/container should be authorized. One option for authorizing a request is by using [shared access signatures](../../storage/common/storage-sas-overview.md).

## Common mistakes to avoid

The following are common mistakes when configuring an origin with Azure Private Link enabled:

- Adding the origin with Azure Private Link enabled to an existing origin group that contains public origins. Azure Front Door doesn't allow mixing public and private origins in the same origin group.
- Not using SAS tokens while connecting to storage account that doesn't allow anonymous access.

## Related content

- [Connect Azure Front Door to an internal load balancer origin with Private Link](how-to-enable-private-link-internal-load-balancer.md)
- [Private Link service with storage account](../../storage/common/storage-private-endpoints.md)
