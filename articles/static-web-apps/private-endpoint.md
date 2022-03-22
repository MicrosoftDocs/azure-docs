---
title: Configure private endpoint in Azure Static Web Apps
description: Learn to configure private endpoint access for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.author: buhollan
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 7/28/2021
---

# Configure private endpoint in Azure Static Web Apps

You can use a private endpoint (also called private link) to restrict access to your static web app so that it is only accessible from your private network.

> [!NOTE]
> Private endpoints support in Static Web Apps is currently in preview.

## How it works

An Azure Virtual Network (VNet) is a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

Configuring Static Web Apps with a private endpoint allows you to use a private IP address from your VNet. Once this link is created, your static web app is integrated into your VNet. As a result, your static web app is no longer available to the public internet, and is only accessible from machines within your Azure VNet.

> [!NOTE]
> Placing your application behind a private endpoint means your app is only available in the region where your VNet is located. As a result, your application is no longer available across multiple points of presence.

> [!WARNING]
> Currently, private endpoints only secure your production environment. Support for staging environments will be added in an upcoming service update.

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [Azure VNet](../virtual-network/quick-create-portal.md).
- An application deployed with [Azure Static Web Apps](./get-started-portal.md) that uses the Standard hosting plan.

## Create a private endpoint

In this section, you create a private endpoint for your static web app.

> [!IMPORTANT]
> Your static web app must be deployed on the Standard hosting plan to use Private endpoints. You can change the hosting plan from the **Hosting Plan** option in the side menu.

1. In the portal, open your static web app.

1. Select the **Private Endpoints** option from the side menu.

1. Click the **Add** button.

1. In the "Add Private Endpoint" dialog, enter this information:

   | Setting                         | Value                         |
   | ------------------------------- | ----------------------------- |
   | Name                            | Enter **myPrivateEndpoint**.  |
   | Subscription                    | Select your subscription.     |
   | Virtual Network                 | Select your virtual network.  |
   | Subnet                          | Select your subnet.           |
   | Integrate with private DNS zone | Leave the default of **Yes**. |

   :::image type="content" source="media/create-private-link-dialog.png" alt-text="./media/create-private-link-dialog.png":::

1. Select **Ok**.

## Testing your private endpoint

Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. To test, set up a virtual machine inside of your virtual network and navigate to your site.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about private endpoints](../private-link/private-endpoint-overview.md)
