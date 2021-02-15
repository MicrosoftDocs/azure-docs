---
title: 'Connect Azure Front Door Premium to your origin with Private Link'
description: Learn how to connect your Azure Front Door Premium to your origin with Private Link service by using the Azure portal.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: tyao

# Customer intent: As someone with a basic network background who's new to Azure, I want to configure Front Door to connect to my origin via private link service by using Azure portal
---

# Connect Azure Front Door Premium to your origin with Private Link

This article will guide you through how to configure Azure Front Door Premium SKU to connect to your applications hosted in a virtual network using the Azure Private Link service.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Create a [Private Link](../../private-link/create-private-link-service-portal.md) service for your origin web servers.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Enable private endpoint in Azure Front Door service

In this section, you'll map the Azure Private Link service to a private endpoint created in the Azure Front Door Premium SKU's private network. 

1. Within your Azure Front Door Premium profile, under *Settings*, select **Origin groups**.

1. Select the origin group that contains the origin you want to enable Private Link for.

1. Select **+ Add an origin** to add a new origin or select a previously created origin from the list. Then select the checkbox to **Enable private link service**.

    :::image type="content" source="../media/how-to-enable-private-endpoint/front-door-private-endpoint-private-link.png" alt-text="Screenshot of enabling private link in add an origin page.":::

1. For **Select an Azure resource**, select **In my directory**. Select or enter the following setting to configure the resource you want Azure Front Door Premium to connect with privately.
    
    | Setting | Value |
    | ------- | ----- |
    | Region | Select the region that is the same or closest to your origin. |
    | Resource type | Select **Microsoft.Network/privateLinkServices**. |
    | Resource | Select **myPrivateLinkService**. |
    | Target sub resource | Leave this field empty. |
    | Request message | Customize message or choose the default message. |

## Next Steps

To learn more about Azure Private endpoint, continue to:

Learn about [Azure Front Door Premium Private endpoint](concept-private-endpoints.md).
