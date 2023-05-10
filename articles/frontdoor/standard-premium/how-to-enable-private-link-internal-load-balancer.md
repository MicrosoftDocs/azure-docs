---
title: 'Connect Azure Front Door Premium to an internal load balancer origin with Private Link'
titleSuffix: Azure Private Link
description: Learn how to connect your Azure Front Door Premium to an internal load balancer.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/16/2021
ms.author: duau
---

# Connect Azure Front Door Premium to an internal load balancer origin with Private Link

This article will guide you through how to configure Azure Front Door Premium tier to connect to your internal load balancer origin using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Create a [Private Link](../../private-link/create-private-link-service-portal.md) service for your origin web servers.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable Private Link to an internal load balancer
 
In this section, you'll map the Private Link service to a private endpoint created in Azure Front Door's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group you want to enable Private Link for the internal load balancer.

1. Select **+ Add an origin** to add an internal load balancer origin. Note that the hostname must be a valid domain name, IPv4 or IPv6. There are two ways to select an Azure resource. The first option is by **In my directory** to select your own resources. The second option is **By ID or alias** to connect to someone else's resource with a resource ID or alias that is shared with you.

    1. Adding an origin using an IP address:

       :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-endpoint-internal-load-balancer-ip.png" alt-text="Screenshot of enabling private link to an internal load balancer using an IP address.":::

    1. Adding an origin using a domain name:

       :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-endpoint-internal-load-balancer-domain-name.png" alt-text="Screenshot of enabling private link to an internal load balancer using a domain name.":::

    1. Select a private link **By ID or alias**:
    
       :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-link-by-alias.png" alt-text="Screenshot of enabling private link to an internal load balancer using an ID or alias":::

1. The table below has information of what values to select in the respective fields while enabling private link with Azure Front Door. Select or enter the following settings to configure the internal load balancer you want Azure Front Door Premium to connect with privately.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name to identify this custom origin. |
    | Origin Type | Custom |
    | Host name | HostName is used for SNI (SSL negotiation) and should match your server side certificate. |
    | Origin host header | You can customize the host header of the origin or leave it as default. |
    | HTTP port | 80 (default) |
    | HTTPS port | 443 (default) |
    | Priority | Different origin can have different priorities to provide primary, secondary, and backup origins. |
    | Weight | 1000 (default). Assign weights to your different origin when you want to distribute traffic.|
    | Resource | If you select **In my directory**, specify the Private Link Service resource for the ILB in your subscription. |
    | ID/alias | If you select **By ID or alias**, specify the resource ID of the Private Link Service resource you want to enable private link to. |
    | Region | Select the region that is the same or closest to your origin. |
    | Request message | Custom message to see while approving the Private Endpoint. |

1. Then select **Add** and then **Update** to save the origin group settings.

## Approve Azure Front Door Premium private endpoint connection from Private link service

1. Go to the Private Link Center and select **Private link services**. Then select your Private link name.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/list.png" alt-text="Screenshot of private link list.":::

1. Select **Private endpoint connections** under *Settings*.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/overview.png" alt-text="Screenshot of private link overview page.":::

1. Select the *pending* private endpoint request from Azure Front Door Premium then select **Approve**. Select **Yes** to confirm you want to create this connection.

    :::image type="content" source="../media/how-to-enable-private-link-internal-load-balancer/private-endpoint-pending-approval.png" alt-text="Screenshot of pending approval for private link.":::

1. Once approved, it should look like the screenshot below. It will take a few minutes for the connection to fully establish. You can now access your internal load balancer from Azure Front Door Premium.

    :::image type="content" source="../media/how-to-enable-private-link-storage-account/private-endpoint-approved.png" alt-text="Screenshot of approved private link request.":::

## Next steps

Learn about [Private Link service](../../private-link/private-link-service-overview.md).
