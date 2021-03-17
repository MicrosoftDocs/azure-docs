---
title: 'Connect Azure Front Door Premium to a web app origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to a webapp privately.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: tyao
---

# Connect Azure Front Door Premium to a Web App origin with Private Link

This article will guide you through how to configure Azure Front Door Premium SKU to connect to your Web App privately using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Create a [Private Link](../../private-link/create-private-link-service-portal.md) service for your origin web servers.

> [!Note]
> Private Endpoint is available in public regions for PremiumV2-tier, PremiumV3-tier Windows web apps, Linux web apps, and the Azure Functions Premium plan (sometimes referred to as the Elastic Premium plan).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to a Web App in Azure Front Door Premium
 
In this section, you'll map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the Web App origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new web app origin or select a previously created web app origin from the list.

    :::image type="content" source="../media/how-to-enable-private-link-web-app/private-endpoint-web-app.png" alt-text="Screenshot of enabling private link to a Web App.":::

1. For **Select an Azure resource**, select **In my directory**. Select or enter the following settings to configure the site you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Region | Select the region that is the same or closest to your origin. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **myPrivateLinkService**. |
    | Target sub resource | sites |
    | Request message | Customize message or choose the default. |

1. Then select **Add** to save your configuration.

## Approve Azure Front Door Premium private endpoint connection from Web App

1. Go to the Web App you configure Private Link for in the last section. Select **Networking** under **Settings**.

1. In **Networking**, select **Configure your private endpoint connections**.

    :::image type="content" source="../media/how-to-enable-private-link-web-app/web-app-configure-endpoint.png" alt-text="Screenshot of networking settings in a Web App.":::

1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-web-app/private-endpoint-pending-approval.png" alt-text="Screenshot of pending private endpoint request.":::

1. Once approved, it should look like the screenshot below. It will take a few minutes for the connection to fully establish. You can now access your web app from Azure Front Door Premium. Direct access to the Web App from the public internet gets disabled after private endpoint gets enabled.

    :::image type="content" source="../media/how-to-enable-private-link-web-app/private-endpoint-approved.png" alt-text="Screenshot of approved endpoint request.":::

## Next steps

Learn about [Private Link service with Azure Web App](../../app-service/networking/private-endpoint.md).
