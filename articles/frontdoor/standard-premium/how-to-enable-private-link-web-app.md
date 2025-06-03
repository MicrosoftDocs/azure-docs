---
title: 'Connect Azure Front Door Premium to an App Service (Web App or Function App) origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a web app or function app privately.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/15/2024
ms.custom:
  - build-2025
---

# Connect Azure Front Door Premium to an App Service (Web App or Function App) origin with Private Link

**Applies to:** :heavy_check_mark: Front Door Premium

This article guides you through configuring Azure Front Door Premium to connect to your App Service (Web App or Function App) privately using Azure Private Link.

## Prerequisites

* An active Azure subscription. [Create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

> [!NOTE]
> Private endpoints require your App Service plan to meet specific requirements. For more information, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).
> This feature is not supported with App Service Slots.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to an App Service (Web App or Function App) in Azure Front Door Premium

In this section, you map the Private Link service to a private endpoint within Azure Front Door's private network.

1. In your Azure Front Door Premium profile, go to *Settings* and select **Origin groups**.

1. Choose the origin group that should contain the App Service (Web App or Function App) origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new origin or select an existing one from the list.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/private-endpoint-app-service.png" alt-text="Screenshot of enabling private link.":::

1. Use the following table to configure the settings for the origin:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this origin. |
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

## Approve Azure Front Door Premium private endpoint connection from App Service

1. Navigate to the App Service you configured with Private Link in the previous section. Under **Settings**, select **Networking**.

1. In the **Networking** section, select on **Configure your private endpoint connections**.

    :::image type="content" source="../media/how-to-enable-private-link-app-service/app-service-configure-endpoint.png" alt-text="Screenshot of networking settings in App Service.":::

1. Find the *pending* private endpoint request from Azure Front Door Premium and select **Approve**.

1. After approval, the connection status will update. It can take a few minutes for the connection to fully establish. Once established, you can access your web app or function app through Azure Front Door Premium. Direct access to the app from the public internet is disabled once private endpoint is enabled.

## Common mistakes to avoid

The following are common mistakes when configuring an origin with Azure Private Link enabled:

* Adding the origin with Azure Private Link enabled to an existing origin group that contains public origins. Azure Front Door doesn't allow mixing public and private origins in the same origin group. 


## Next steps

Learn about [Private Link service with App service](../../app-service/networking/private-endpoint.md).
