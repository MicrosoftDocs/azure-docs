---
title: How to create the Azure Web PubSub instance
description: An overview on options to create Azure Web PubSub instance and how to do it
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 03/17/2021
---

# How to create Azure Web PubSub instance

To build an application with Azure Web PubSub service, you need to create the Web PubSub instance and then connect your clients and servers. This how-to guide shows you the options to create Azure Web PubSub instance.

## Create Azure Web PubSub instance with Azure portal 

The [Azure portal](../azure-portal/index.yml) is a web-based, unified console that provides an alternative to command-line tools. You can manage your Azure subscription with the Azure portal. Build, manage, and monitor everything from simple web apps to complex cloud deployments. You could also create Azure Web PubSub service instance with Azure portal.

1. Select the New button found on the upper left-hand corner of the Azure portal. In the New screen, type *Web PubSub* in the search box and press enter. (You could also search the Azure Web PubSub from the `Web` category.)

:::image type="content" source="media/create-instance-portal/search-web-pubsub-in-portal.png" alt-text="Screenshot of searching the Azure Web PubSub in portal.":::

2. Select **Web PubSub** from the search results, then select **Create**.

3. Enter the following settings.

    | Setting      | Description                                        |
    | ------------ | -------------------------------------------------- |
    | **Resource name** | The globally unique Name that identifies your new Web PubSub service instance. Valid characters are `a-z`, `0-9`, and `-`.  | 
    | **Subscription** | The Azure subscription under which this new Web PubSub service instance is created. | 
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  Name for the new or existing resource group in which to create your Web PubSub service instance. | 
    | **Location** | Choose a [region](https://azure.microsoft.com/regions/) near you. |
    | **Pricing tier** | Learn more details about [Azure Web PubSub service pricing tiers](https://azure.microsoft.com/pricing/details/web-pubsub/). |
    | **Unit count** |  Unit count specifies how many connections your Web PubSub service instance can accept. Each unit supports 1,000 concurrent connections at most. It is only configurable in the Standard tier. |

:::image type="content" source="media/howto-develop-create-instance/create-web-pubsub-instance-in-portal.png" alt-text="Screenshot of creating the Azure Web PubSub instance in portal.":::

4. Select **Create** to start deploying the Web PubSub service instance.

## Create Azure Web PubSub instance with Azure CLI

The [Azure command-line interface (Azure CLI)](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. You could also create Azure Web PubSub service instance with Azure CLI after GA.