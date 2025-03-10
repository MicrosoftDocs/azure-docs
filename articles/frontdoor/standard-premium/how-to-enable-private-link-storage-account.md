---
title: 'Connect Azure Front Door Premium to a storage account origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a storage account privately.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 03/31/2024
ms.author: duau
---

# Connect Azure Front Door Premium to a storage account origin with Private Link

This article guides you through how to configure Azure Front Door Premium tier to connect to your storage account origin privately using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Create a [Private Link](../../private-link/create-private-link-service-portal.md) service for your origin web server.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to a storage account
 
In this section, you map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the storage account origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new storage account origin or select a previously created storage account origin from the list.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-storage-account.png" alt-text="Screenshot of enabling private link to a storage account.":::

1. The following table has information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the storage blob you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this storage blog origin. |
    | Origin Type | Storage (Azure Blobs) |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of subresource for the resource selected previously that your private endpoint can access. You can select *blob* or *web*. |
    | Request message | Custom message to see while approving the Private Endpoint. |

1. Then select **Add** to save your configuration. Then select **Update** to save the origin group settings.

> [!NOTE]
> Ensure the **origin path** in your routing rule is configured correctly with the storage container file path so file requests can be acquired.
> 

## Approve private endpoint connection from the storage account

1. Go to the storage account you configure Private Link for in the last section. Select **Networking** under **Settings**.

1. In **Networking**, select **Private endpoint connections**. 


1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-pending-approval.png" alt-text="Screenshot of pending storage private endpoint request.":::

1. Once approved, it should look like the following screenshot. It takes a few minutes for the connection to fully establish. You can now access your storage account from Azure Front Door Premium.

> [!NOTE]
> If the blob or container within the storage account doesn't permit anonymous access, requests made against the blob/container should be authorized. One option for authorizing a request is by using [shared access signatures](../../storage/common/storage-sas-overview.md).

## Next steps

Learn about [Private Link service with storage account](../../storage/common/storage-private-endpoints.md).
