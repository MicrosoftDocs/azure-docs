---
title: Configure private endpoint in Azure Static Web Apps
description: Learn to configure private endpoint access for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 7/28/2021
---

# Configure private endpoint in Azure Static Web Apps

You can use a private endpoint (also called private link) to restrict access to your static web app so that it is only accessible from your private network.

## How it works

An Azure Virtual Network (VNet) is a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

Configuring Static Web Apps with a private endpoint allows you to use a private IP address from your VNet. Once this link is created, your static web app is integrated into your VNet. As a result, your static web app is no longer available to the public internet, and is only accessible from machines within your Azure VNet.

> [!NOTE]
> Placing your application behind a private endpoint means your app is only available in the region where your VNet is located. As a result, your application is no longer available across multiple points of presence.

If your app has a private endpoint enabled, the server responds with a `403` status code if the request comes from a public IP address. This behavior applies to both the production environment as well as any staging environments. The only way to reach the app is to use the private endpoint deployed within your VNet.

The default DNS resolution of the static web app still exists and routes to a public IP address. The private endpoint exposes 2 IP Addresses within your VNet, one for the production environment and one for any staging environments. To ensure your client is able to reach the app correctly, make sure your client resolves the hostname of the app to the appropriate IP address of the private endpoint. This is required for the default hostname as well as any custom domains configured for the static web app. This resolution is done automatically if you select a private DNS zone when creating the private endpoint (see example below) and is the recommended solution.

If you are connecting from on-prem or do not wish to use a private DNS zone, manually configure the DNS records for your application so that requests are routed to the appropriate IP address of the private endpoint. You can find more information on private endpoint DNS resolution [here](../private-link/private-endpoint-dns.md).

> [!NOTE]
> Private endpoints restrict the incoming traffic going to the website to a specific virtual network. They do not apply to deployments of new site assets.

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

2. Select **Add**.

3. In the "Add Private Endpoint" dialog, enter this information:

   | Setting                         | Value                         |
   | ------------------------------- | ----------------------------- |
   | Name                            | Enter **myPrivateEndpoint**.  |
   | Subscription                    | Select your subscription.     |
   | Virtual Network                 | Select your virtual network.  |
   | Subnet                          | Select your subnet.           |
   | Integrate with private DNS zone | Leave the default of **Yes**. |

   :::image type="content" source="media/create-private-link-dialog.png" alt-text="./media/create-private-link-dialog.png":::

4. Select **Ok**.

> [!NOTE]
> The name of the private DNS zone depends upon the default domain name suffix of the static web app. For example, if the default domain suffix of the app is `3.azurestaticapps.net`, the name of the private DNS zone is `privatelink.3.azurestaticapps.net`. When a new static web app is created, the default domain suffix might be different from the default domain suffix(es) of previous static web apps. If you are using an automated deployment process to create the private DNS zone, you can use the `DefaultHostname` property in your app to programmatically extract the domain suffix. The `DefaultHostname` property value resembles `<STATIC_WEB_APP_DEFAULT_DOMAIN_PREFIX>.<PARTITION_ID>.azurestaticapps.net` or `STATIC_WEB_APP_DEFAULT_DOMAIN_PREFIX.azurestaticapps.net`. The default domain suffix resembles `<PARTITION_ID>.azurestaticapps.net` or `azurestaticapps.net`.


## Testing your private endpoint

Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. To test, set up a virtual machine inside of your virtual network and go to your site.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about private endpoints](../private-link/private-endpoint-overview.md)
