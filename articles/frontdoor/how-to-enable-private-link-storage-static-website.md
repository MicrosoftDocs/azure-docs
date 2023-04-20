---
title: 'Connect Azure Front Door Premium to a storage static website origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a storage static website privately.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/03/2023
ms.author: duau
---

# Connect Azure Front Door Premium to a storage static website with Private Link

This article guides you through how to configure Azure Front Door Premium tier to connect to your storage static website privately using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Create a [Private Link](../private-link/create-private-link-service-portal.md) service for your origin web server.
* Storage static website is enabled on your storage account. Learn how to [enable static website](../storage/blobs/storage-blob-static-website-how-to.md?tabs=azure-portal).

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
    | Target sub resource | The type of sub-resource for the resource selected previously that your private endpoint can access. You can select *web* or *web_secondary*. |
    | Request message | Custom message to see while approving the Private Endpoint. | 

1. Then select **Add** to save your configuration. Then select **Update** to save your changes.

## Approve private endpoint connection from storage account

1. Go to the storage account that you want to connect to Azure Front Door Premium privately. Select **Networking** under *Settings*.

1. In **Networking**, select **Private endpoint connections**.

    :::image type="content" source="./media/how-to-enable-private-link-storage-static-website/storage-networking-settings.png" alt-text="Screenshot of private endpoint connection tab under storage account networking settings.":::

1. Select the pending private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="./media/how-to-enable-private-link-storage-static-website/approve-private-endpoint-connection.png" alt-text="Screenshot of approving private endpoint connection from storage account.":::

1. Once approved, you can see the private endpoint connection status is **Approved**.

    :::image type="content" source="./media/how-to-enable-private-link-storage-static-website/approved-private-endpoint-connection.png" alt-text="Screenshot of approved private endpoint connection from storage account.":::

## Create private endpoint connection to web_secondary

When creating a private endpoint connection to the storage static website's secondary sub resource, you need to add a **-secondary** suffix to the origin host header. For example, if your origin host header is *contoso.z13.web.core.windows.net*, you need to change it to *contoso-secondary.z13.web.core.windows.net*.

:::image type="content" source="./media/how-to-enable-private-link-storage-static-website/private-endpoint-storage-static-website-secondary.png" alt-text="Screenshot of enabling private link to a storage static website secondary.":::

Once the origin has been added and the private endpoint connection has been approved, you can test your private link connection to your storage static website.

## Next steps

Learn about [Private Link service with storage account](../storage/common/storage-private-endpoints.md).