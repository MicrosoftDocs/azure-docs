---
title: How to create Azure Web PubSub instance with portal?
description: Include file about creating Azure Web PubSub instance with portal
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: include 
ms.date: 03/11/2021
---

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create an Azure Web PubSub service instance

Your application will connect to a Web PubSub service instance in Azure.

1. Select the New button found on the upper left-hand corner of the Azure portal. In the New screen, type *Web PubSub* in the search box and press enter. (You could also search the Azure Web PubSub from the `Web` category.)

    :::image type="content" source="../media/create-instance-portal/search-web-pubsub-in-portal.png" alt-text="Screenshot of searching the Azure Web PubSub in portal.":::

2. Select **Web PubSub** from the search results, then select **Create**.

3. Enter the following settings.

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Resource name** | Globally unique name | The globally unique Name that identifies your new Web PubSub service instance. Valid characters are `a-z`, `A-Z`, `0-9`, and `-`. |
    | **Subscription** | Your subscription | The Azure subscription under which this new Web PubSub service instance is created. |
    | **[Resource Group](../../azure-resource-manager/management/overview.md)** |  myResourceGroup | Name for the new resource group in which to create your Web PubSub service instance. |
    | **Location** | West US | Choose a [region](https://azure.microsoft.com/regions/) near you. |
    | **Pricing tier** | Free | You can first try Azure Web PubSub service for free. Learn more details about [Azure Web PubSub service pricing tiers](https://azure.microsoft.com/pricing/details/web-pubsub/) |
    | **Unit count** |  - | Unit count specifies how many connections your Web PubSub service instance can accept. Each unit supports 1,000 concurrent connections at most. It is only configurable in the Standard tier. |

    :::image type="content" source="../media/howto-develop-create-instance/create-web-pubsub-instance-in-portal.png" alt-text="Screenshot of creating the Azure Web PubSub instance in portal.":::

4. Select **Create** to start deploying the Web PubSub service instance.
