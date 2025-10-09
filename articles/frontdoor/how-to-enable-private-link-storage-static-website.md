---
title: Connect Azure Front Door to a storage static website origin with Private Link
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a storage static website privately using the Azure portal or Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 09/24/2025
zone_pivot_groups: front-door-dev-exp-portal-cli
ms.custom:
  - build-2025
  - sfi-image-nochange
---

# Connect Azure Front Door Premium to a storage static website with Private Link

**Applies to:** :heavy_check_mark: Front Door Premium

This article shows you how to configure Azure Front Door Premium tier to connect to your storage static website privately using the Azure Private Link service.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

::: zone pivot="front-door-portal"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](create-front-door-portal.md).

- A Private Link. For more information, see [Create a Private Link service](../private-link/create-private-link-service-portal.md).

- Storage static website is enabled on your storage account. Learn how to [enable static website](../storage/blobs/storage-blob-static-website-how-to.md?tabs=azure-portal).

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

::: zone-end

::: zone pivot="front-door-cli"

- An Azure Front Door Premium profile with an origin group. For more information, see [Create an Azure Front Door](create-front-door-cli.md).

- A Private Link. For more information, see [Create a Private Link service](../private-link/create-private-link-service-cli.md).

- Storage static website is enabled on your storage account. Learn how to [enable static website](../storage/blobs/storage-blob-static-website-how-to.md?tabs=azure-cli).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

::: zone-end

::: zone pivot="front-door-portal"

## Enable Private Link to a storage static website

In this section, you map the Private Link service to a private endpoint created in Azure Front Door's private network.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the storage static website origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new storage static website origin or select a previously created storage static website origin from the list.

    :::image type="content" source="./media/how-to-enable-private-link-storage-static-website/private-endpoint-storage-static-website-primary.png" alt-text="Screenshot of enabling private link to a storage static website primary.":::

1. The following table has the information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the storage static website you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this storage static website origin. |
    | Origin Type | Storage (Static website) |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of subresource for the resource selected previously that your private endpoint can access. You can select *web* or *web_secondary*. |
    | Request message | Custom message to see while approving the Private Endpoint. | 

1. Then select **Add** to save your configuration. Then select **Update** to save your changes.

## Approve private endpoint connection from storage account

1. Go to the storage account that you want to connect to Azure Front Door Premium privately. Select **Networking** under *Settings*.

1. In **Networking**, select **Private endpoint connections**.

1. Select the pending private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="./media/how-to-enable-private-link-storage-static-website/approve-private-endpoint-connection.png" alt-text="Screenshot of approving private endpoint connection from storage account.":::

1. Once approved, you can see the private endpoint connection status is **Approved**.

## Create private endpoint connection to web_secondary

When creating a private endpoint connection to the storage static website's secondary sub resource, you need to add a **-secondary** suffix to the origin host header. For example, if your origin host header is *contoso.z13.web.core.windows.net*, you need to change it to *contoso-secondary.z13.web.core.windows.net*.

:::image type="content" source="./media/how-to-enable-private-link-storage-static-website/private-endpoint-storage-static-website-secondary.png" alt-text="Screenshot of enabling private link to a storage static website secondary.":::

Once the origin is added and the private endpoint connection is approved, you can test your private link connection to your storage static website.

::: zone-end

::: zone pivot="front-door-cli"

## Enable Private Link to a Storage Static Website in Azure Front Door Premium

1. Run [az afd origin create](/cli/azure/afd/origin#az-afd-origin-create) to create a new Azure Front Door origin. Enter the following settings to configure the Storage Static Website you want Azure Front Door Premium to connect with privately. Notice the `private-link-location` must be in one of the [available regions](private-link.md#region-availability) and the `private-link-sub-resource-type` must be **web**.

```azurecli-interactive
az afd origin create --enabled-state Enabled \
                     --resource-group testRG \
                     --origin-group-name default-origin-group \
                     --origin-name pvtStaticSite \
                     --profile-name testAFD \
                     --host-name example.z13.web.core.windows.net\
                     --origin-host-header example.z13.web.core.windows.net\
                     --http-port 80 \
                     --https-port 443 \
                     --priority 1 \
                     --weight 500 \
                     --enable-private-link true \
                     --private-link-location EastUS \
                     --private-link-request-message 'AFD Storage static website origin Private Link request.' \
                     --private-link-resource /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testingafdpl \
                     --private-link-sub-resource-type web
 
```

## Approve Private Endpoint Connection from Storage Account

1. Run [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) to list the private endpoint connections for your storage account. Note down the 'Resource ID' of the private endpoint connection available in your storage account, in the first line of your output.

    ```azurecli-interactive
    az network private-endpoint-connection list -g testRG -n testingafdpl --type Microsoft.Storage/storageAccounts
    ```

2. Run [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) to approve the private endpoint connection.

    ```azurecli-interactive
    az network private-endpoint-connection approve --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testingafdpl/privateEndpointConnections/testingafdpl.00000000-0000-0000-0000-000000000000
    ```

## Create Private Endpoint Connection to Web_Secondary

When creating a private endpoint connection to the storage static website's secondary sub-resource, you need to add a **-secondary** suffix to the origin host header. For example, if your origin host header is `example.z13.web.core.windows.net`, you need to change it to `example-secondary.z13.web.core.windows.net`.

Once the origin is added and the private endpoint connection is approved, you can test your private link connection to your storage static website.

::: zone-end

## Common mistakes to avoid

The following are common mistakes when configuring an origin with Azure Private Link enabled:

- Adding the origin with Azure Private Link enabled to an existing origin group that contains public origins. Azure Front Door doesn't allow mixing public and private origins in the same origin group.

## Next step

> [!div class="nextstepaction"]
> [Private Link service with storage account](../storage/common/storage-private-endpoints.md)