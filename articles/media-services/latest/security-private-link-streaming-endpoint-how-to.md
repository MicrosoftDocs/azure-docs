---
title: Create a Private Link for a Streaming Endpoint
description: This article shows you how to use a private link with a Streaming Endpoint. You'll be creating a private endpoint resource which is a link between a virtual network and a streaming endpoint. This deployment creates a network interface IP address inside the virtual network. The private link allows you to connect the network interface in the private network to the streaming endpoint in the Media Services account. You'll also be creating DNS zones which pass the private IP addresses.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 10/22/2021
ms.author: inhenkel
---

# Create a Private Link for a Streaming Endpoint

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to use a private link with a Streaming Endpoint. It's assumed that you already know how to create an [Azure resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md), a [Media Services account](account-create-how-to.md), and an [Azure virtual network](../../virtual-network/quick-create-portal.md).

You'll be creating a private endpoint resource which is a link between a virtual network and a streaming endpoint. This deployment creates a network interface IP address inside the virtual network. The private link allows you to connect the network interface in the private network to the streaming endpoint in the Media Services account. You'll also be creating DNS zones which pass the private IP addresses.

The virtual network created for this walk-though is just to assist with the example.  It's assumed that you have an existing virtual network that you'll use for production.

> [!NOTE]
> As you follow along with the steps, name your resources similarly so that they can be easily understood as having a similar purpose.  For example, *privatelink1stor* for your storage account and *privatelink1mi* for your Managed Identity.

## Create a resource group and a Media Services account

1. Create an Azure resource group.
1. Create a Media Services account.  A default Streaming Endpoint is created when you create the account. Creating a Managed Identity is required during the setup process.
1. Create an Azure virtual network with the default settings.

At this point, there's nothing in your virtual network your Media Services account has an Internet facing endpoint which includes an Internet facing Streaming Endpoint, Key Delivery, and Live Events.  The next step will make the Streaming Endpoint private.

## Start the streaming endpoint

1. Navigate to the Media Services account you created.  
1. Select **Streaming endpoints** from the menu. The Streaming endpoints screen will appear.
1. Select the default Streaming endpoint that you created when you set up the Media Services account.  The default Streaming endpoint screen will appear.
1. Select **Start**. Start options will appear.
1. Select **None** from the CDN pricing tier dropdown list.
1. Select **Start**.  The Streaming endpoint will start running. The endpoint is still Internet facing.

## Create a private endpoint

1. Navigate back to your Media Services account.
1. Select **Networking** from the menu
1. Select the **private endpoint connections** tab.  The private endpoint connection screen will appear.
1. Select **Add a private endpoint**. The Create a private endpoint screen will appear.
1. In the **Name** field, give the private endpoint a name such as *privatelinkpe*.
1. From the **Region** dropdown list, select a region such as *West US 2*.
1. Select **Next: Resource**. The Resource screen will appear.

## Assign the private endpoint to a resource

1. From the **Connection methods** radio buttons, select the *Connect to an Azure resource in my directory* radio button.
1. From the **Resource type** dropdown list, select *Microsoft.Media/mediaservices*.
1. From the **Resource** dropdown list, select the Media Services account you created.
1. From the **Target sub-resource** dropdown list, select the Streaming endpoint you created.

## Deploy the private endpoint to the virtual network

1. From the **Virtual network** dropdown list, select the virtual network you created.
1. From the **Subnet** dropdown list, select the subnet you want to work with.
1. Stay on this screen.

## Create DNS zones to use with the private endpoint

To use the streaming endpoint inside your virtual network, create private DNS zones. You can use the same DNS name and get back the private IP address of the streaming endpoint.

1. On the same screen, for the **media-azure-net** configuration, select the resource group you created from the **Resource group** dropdown list.
1. For the **privatelink-media-azure-net** configuration, select the same resource group from the **Resource group** dropdown list.
1. Select **Next: Tags**. If you want to add tags to your resources, do that here.
1. Select **Next: Review + create**. The Review + create screen will appear.
1. Review your settings and make sure they're correct.
1. Select **Create**. The private endpoint deployment screen appears.

While the deployment is in progress, it's also creating an [Azure Resource Manager (ARM) template](../../azure-resource-manager/templates/overview.md). You can use ARM templates to automate deployment. To see the template, select **Template** from the menu.

## Clean up resources

If you aren't planning to use the resources created in this exercise, simply delete the resource group. If you don't delete the resources, you will be charged for them.