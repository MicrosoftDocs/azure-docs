---
title: 'Connect Azure Front Door Premium to a storage account origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a storage account privately.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/04/2021
ms.author: duau
---

# Connect Azure Front Door Premium to a storage account origin with Private Link

This article will guide you through how to configure Azure Front Door Premium SKU to connect to your storage account origin privately using the Azure Private Link service.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to a storage account
 
In this section, you'll map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the storage account origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new storage account origin or select a previously created storage account origin from the list.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-storage-account.png" alt-text="Screenshot of enabling private link to a storage account.":::

1. For **Select an Azure resource**, select **In my directory**. Select or enter the following settings to configure the site you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Region | Select the region that is the same or closest to your origin. |
    | Resource type | Select **Microsoft.Storage/storageAccounts**. |
    | Resource | Select your storage account. |
    | Target sub resource | You can select *blob* or *web*. |
    | Request message | Customize message or choose the default. |

1. Then select **Add** to save your configuration.

## Approve private endpoint connection from the storage account

1. Go to the storage account you configure Private Link for in the last section. Select **Networking** under **Settings**.

1. In **Networking**, select **Private endpoint connections**. 

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/storage-account-configure-endpoint.png" alt-text="Screenshot of networking settings in a Web App.":::

1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-pending-approval.png" alt-text="Screenshot of pending storage private endpoint request.":::

1. Once approved, it should look like the screenshot below. It will take a few minutes for the connection to fully establish. You can now access your storage account from Azure Front Door Premium.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-approved.png" alt-text="Screenshot of approved storage endpoint request.":::

## Next steps

Learn about [Private Link service with storage account](../../storage/common/storage-private-endpoints.md).
