---
title: Configure private endpoint in Azure Static Web Apps
description: Learn to configure private endpoint access for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.author: buhollan
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 7/20/2021
---

# Configure private endpoint in Azure Static Web Apps

You can use a private endpoint (also called private link) to restrict access to your static web app so that it is only accessible from your private network. private endpoints are enabled by using an address from your Azure VNet address space. Network traffic from your private network travels exclusively to your static app over the VNet, so your application is never exposed to the public internet.

## How it works

You'll need an [Azure VNet](https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal) in order to put your application behind a private endpoint.

Azure VNet's are a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

You then create a private endpoint for your static web app. The private endpoint uses a private IP address from your VNet, effectively bringing your application into your VNet. Your application is then no longer available from the public internet, and is only accessible from machines within your Azure VNet.

> [!WARNING]
> Placing your application behind a private endpoint means your app is only available in the region where your VNet is located. As a result, your application is no longer available across multiple points of presence.

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An application deployed with [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript) that uses the Standard hosting plan.

## Create a private endpoint

In this section, you create a private endpoint for your static web app.

> [!IMPORTANT]
> Your static web app must be deployed on the Standard hosting plan to use Private endpoints. You can change the hosting plan from the "Hosting Plan" option in the side menu.

1. In the portal, open your static web app.

1. Select the "Private Endpoint" from the side menu.

1. In the "Add Private Endpoint" dialog, enter this information:

   | Setting                         | Value                            |
   | ------------------------------- | -------------------------------- |
   | Name                            | Enter **myPrivateEndpoint**.     |
   | Subscription                    | Select your subscription.        |
   | Virtual Network                 | Select \<your-virtual-network\>. |
   | Subnet                          | Select \<your-subnet\a>.         |
   | Integrate with private DNS zone | Leave the default of **Yes**.    |

   ![Create private endpoint dialog](./media/create-private-link-dialog.png)

1. Select **Ok**.

## Testing your private endpoint

Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. You'll need to access your application from a machine that is already inside your VNet.

## Next steps

> [!div class="nextstepaction"] > [Networking options](./networking-options.md)
