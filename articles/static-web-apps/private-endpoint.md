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

## How it works

Azure VNet's are a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

Configuring Static Web Apps with a private endpoint allows you to use a private IP address from your VNet. Once this link is created, your static web app is integrated into your VNet. As a result, your web app is no longer available to the public internet, and is only accessible from machines within your Azure VNet.

> [!WARNING]
> Placing your application behind a private endpoint means your app is only available in the region where your VNet is located. As a result, your application is no longer available across multiple points of presence.

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [Azure VNet](https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal).
- An application deployed with [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript) that uses the Standard hosting plan.

## Create a private endpoint

In this section, you create a private endpoint for your static web app.

> [!IMPORTANT]
> Your static web app must be deployed on the Standard hosting plan to use Private endpoints. You can change the hosting plan from the **Hosting Plan** option in the side menu.

1. In the portal, open your static web app.

1. Select the **Private Endpoint** option from the side menu.

1. In the "Add Private Endpoint" dialog, enter this information:

   | Setting                         | Value                            |
   | ------------------------------- | -------------------------------- |
   | Name                            | Enter **myPrivateEndpoint**.     |
   | Subscription                    | Select your subscription.        |
   | Virtual Network                 | Select \<your-virtual-network\>. |
   | Subnet                          | Select \<your-subnet\a>.         |
   | Integrate with private DNS zone | Leave the default of **Yes**.    |

   :::image type="content" source="media/create-private-link-dialog.png" alt-text="./media/create-private-link-dialog.png":::

1. Select **Ok**.

## Testing your private endpoint

Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. To test, setup a virtual machine inside of your virtual network and navigate to your site.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-first-web-static-app** from the top search bar.
1. Select the app name.
1. Select the **Delete** button.
1. Select **Yes** to confirm the delete action (this action may take a few moments to complete).

## Next steps

> [!div class="nextstepaction"] > [Networking options](./networking-options.md)
