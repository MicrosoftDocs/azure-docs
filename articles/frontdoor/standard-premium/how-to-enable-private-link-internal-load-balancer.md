---
title: 'Connect Azure Front Door Premium to an internal load balancer origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an internal load balancer.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/16/2021
ms.author: tyao
---

# Connect Azure Front Door Premium to an internal load balancer origin with Private Link

This article will guide you through how to configure Azure Front Door Premium SKU to connect to your internal load balancer origin using the Azure Private Link service.

## Prerequisites

Create a [private link service](../../private-link/create-private-link-service-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to an internal load balancer
 
In this section, you'll map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group you want to enable Private Link for the internal load balancer.

1. Select **+ Add an origin** to add an internal load balancer origin.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-endpoint-internal-load-balancer.png" alt-text="Screenshot of enabling private link to an internal load balancer.":::

1. For **Select an Azure resource**, select **In my directory**. Select or enter the following settings to configure the site you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Region | Select the region that is the same or closest to your origin. |
    | Resource type | Select **Microsoft.Network/privateLinkServices**. |
    | Resource | Select your Private link tied to the internal load balancer. |
    | Target sub resource | Leave blank. |
    | Request message | Customize message or choose the default. |

1. Then select **Add** and then **Update** to save your configuration.

## Approve private endpoint connection from the storage account

1. Go to the Private Link Center and select **Private link services**. Then select your Private link name.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/list.png" alt-text="Screenshot of private link list.":::

1. Select **Private endpoint connections** under *Settings*.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/overview.png" alt-text="Screenshot of private link overview page.":::

1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-endpoint-pending-approval.png" alt-text="Screenshot of pending approval for private link.":::

1. Once approved, it should look like the screenshot below. It will take a few minutes for the connection to fully establish. You can now access your internal load balancer from Azure Front Door Premium.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-approved.png" alt-text="Screenshot of approved private link request.":::

## Next steps

Learn about [Private Link service](../../private-link/private-link-service-overview.md).
