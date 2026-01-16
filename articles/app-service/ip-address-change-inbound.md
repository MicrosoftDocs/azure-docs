---
title: Prepare for Inbound IP Address Change
description: Learn how to prepare your app if your inbound IP address is going to be changed.

ms.topic: how-to
ms.date: 11/17/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service

#Customer intent: As a developer, I want to learn what to do if my inbound IP address is going to change so that I can ensure that my app works after the change. 
 
---

# Prepare for an inbound IP address change

If you received a notification that the inbound IP address of your Azure App Service app is changing, follow these instructions.

## Determine if you need to do anything

* Option 1: If your App Service app doesn't have a custom domain, no action is required.

* Option 2: If only a CNAME record (DNS record pointing to a URI) is configured in your Domain Registration Portal (non-Microsoft DNS provider or Azure DNS), no action is required.

* Option 3: If an A record (DNS record pointing directly to your IP address) is configured in your Domain Registration Portal (non-Microsoft DNS provider or Azure DNS), replace the existing IP address with the new one. You can find the new IP address by following the instructions in the next section.

* Option 4: If your application is behind a load balancer, IP filter, or any other IP mechanism that requires your app's IP address, replace the existing IP address with the new one. You can find the new IP address by following the instructions in the next section.

## Find the new inbound IP address in the Azure portal

Both the new inbound IP address and the old one are connected to your app now, and later the old one will be disconnected.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **App Services**, then select your App Service app from the list.

1. If the app is a function app, see [Function app inbound IP address](../azure-functions/ip-addresses.md#function-app-inbound-ip-address).

1. Under **Settings** in the sidebar menu, select **Networking** and find the section labeled **Inbound addresses**.

1. Copy the IP address and reconfigure your domain record or IP mechanism.

## Related content

- [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md)
