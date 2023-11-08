---
title: 'Connect Azure Front Door Premium to an App Service (Web App) origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a webapp privately.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 08/31/2023
ms.author: duau
---

# Connect Azure Front Door Premium to an App Service (Web App) origin with Private Link

This article guides you through how to configure Azure Front Door Premium tier to connect to your App Service (Web App) privately using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> Private endpoints requires your App Service plan to meet some requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to an App Service (Web App) in Azure Front Door Premium
 
In this section, you map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the App Service (Web App) origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new App Service (Web App) origin or select a previously created App Service (Web App) origin from the list.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-app-service.png" alt-text="Screenshot of enabling private link to a Web App.":::

1. The following table has information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the App Service (Web App) you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this App Service (Web App) origin. |
    | Origin Type | App services |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Region | Select the region that is the same or closest to your origin. |
    | Target sub resource | The type of subresource for the resource selected previously that your private endpoint can access. You can select *site*. |
    | Request message | Custom message to see while approving the Private Endpoint. |

1. Select **Add** to save your configuration. Then select **Update** to save the origin group settings.

## Approve Azure Front Door Premium private endpoint connection from App Service (Web App)

1. Go to the App Service (Web App) you configured Private Link for in the last section. Select **Networking** under **Settings**.

1. In **Networking**, select **Configure your private endpoint connections**.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/app-service-configure-endpoint.png" alt-text="Screenshot of networking settings in a Web App.":::

1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-pending-approval.png" alt-text="Screenshot of pending private endpoint request.":::

1. Once approved, it should look like the following screenshot. It takes a few minutes for the connection to fully establish. You can now access your web app from Azure Front Door Premium. Direct access to the web app from the public internet gets disabled after private endpoint gets enabled.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-approved.png" alt-text="Screenshot of approved endpoint request.":::

## Next steps

Learn about [Private Link service with App service](../../app-service/networking/private-endpoint.md).
