---
title: 'Connect Azure Front Door Premium to an App Service (Web App) origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a webapp privately.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.author: duau
---

# Connect Azure Front Door Premium to an App Service (Web App) origin with Private Link

This article guides you through configuring Azure Front Door Premium to connect to your App Service (Web App) privately using Azure Private Link.

## Prerequisites

* An active Azure subscription. [Create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> Private endpoints require your App Service plan to meet specific requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).
> This feature is not supported with App Service Slots.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to an App Service (Web App) in Azure Front Door Premium

In this section, you map the Private Link service to a private endpoint within Azure Front Door's private network.

1. In your Azure Front Door Premium profile, go to *Settings* and select **Origin groups**.

1. Choose the origin group that includes the App Service (Web App) origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new App Service (Web App) origin or select an existing one from the list.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-app-service.png" alt-text="Screenshot of enabling private link to a Web App.":::

1. Use the following table to configure the settings for the App Service (Web App) origin:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this App Service (Web App) origin. |
    | Origin Type | App services |
    | Host name | Select the host from the dropdown that you want as an origin. |
    | Origin host header | Customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Assign different priorities to origins for primary, secondary, and backup purposes. |
    | Weight | 1000 (default). Use weights to distribute traffic among different origins. |
    | Region | Select the region that matches or is closest to your origin. |
    | Target sub resource | Choose *site* as the subresource type for the selected resource. |
    | Request message | Enter a custom message to display while approving the Private Endpoint. |

1. Select **Add** to save your configuration, then select **Update** to save the origin group settings.

## Approve Azure Front Door Premium private endpoint connection from App Service (Web App)

1. Navigate to the App Service (Web App) you configured with Private Link in the previous section. Under **Settings**, select **Networking**.

1. In the **Networking** section, select on **Configure your private endpoint connections**.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/app-service-configure-endpoint.png" alt-text="Screenshot of networking settings in a Web App.":::

1. Find the *pending* private endpoint request from Azure Front Door Premium and select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-pending-approval.png" alt-text="Screenshot of pending private endpoint request.":::

1. After approval, the connection status will update. It can take a few minutes for the connection to fully establish. Once established, you can access your web app through Azure Front Door Premium. Direct access to the web app from the public internet is disabled once private endpoint is enabled.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-approved.png" alt-text="Screenshot of approved endpoint request.":::

## Next steps

Learn about [Private Link service with App service](../../app-service/networking/private-endpoint.md).
