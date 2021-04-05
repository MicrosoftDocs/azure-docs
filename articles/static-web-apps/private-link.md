---
title: Configure private link in Azure Static Web Apps
description: Learn to configure private endpoint access for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.author: buhollan
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 3/22/2021
---

# Configure private link in Azure Static Web Apps

You can use a Private Link (also called Private Endpoint) to restrict access to your Static Web App so that it is only accessible from your private network. Private Links are enabled by using an address from your Azure VNet address space. Network traffic from your private network to your Static Web App happens over the VNet, so your Static Web App is never exposed to the public internet.

## Prerequisites

* An Azure account with an active subscription. 
* An [Azure Static Web App](https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript)

## How it works

You'll need an Azure VNet in order to put your Static Web App behind a Private Link. 

Azure VNet's are a network just like you might have in a traditional data center. Resources within the VNet will be able to talk to each other securely on the Microsoft backbone network.

You then create a Private Link within that VNet and assign it to your Static Web App. The Private Link uses a private IP address from your VNet, effectively bringing your Static Web App into your VNet. Your Static Web App will no longer be available from the public internet and will only be accessible from machines within your Azure VNet.

> [!WARNING]
> Placing your Static Web App behind a Private Link will mean that your app will only be available in the region where your VNet is located. You will no longer get the benefit of Static Web Apps multiple points of presence.

## Key Benefits

* Connect to your Static Web App from your VNet without a public IP Address
* Your on-premise resources can access your Static Web App with [ExpressRoute](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-introduction). This makes it easy to take advantage of certain cloud resources like Azure Static Web Apps while maintaining an on-premise environment as well.
* Leverage Private Link [automatic or manual workflows](https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-overview#access-to-a-private-link-resource-using-approval-workflow) to approve access to your Static Web App.

For more information on Private Links, see [What is Azure Private Link](https://docs.microsoft.com/en-us/azure/private-link/private-link-overview)?

## Create a Private Link

Use the following quick start to create a Private Link and assign it to your Static Web App...

[Quickstart: Create a Private Endpoint using the Azure Portal](https://docs.microsoft.com/en-us/azure/private-link/create-private-endpoint-portal) 


## Next steps

> [!div class="nextstepaction"]
> [Networking options](./networking-options.md)