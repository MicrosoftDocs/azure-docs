---
title: Prepare for Outbound IP Address Change
description: Learn how to prepare your app if your outbound IP address is going to be changed.
ms.topic: how-to
ms.date: 12/05/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service

# As a developer, I want to learn what to do if my outbound IP address is going to change so that I can ensure that my app works after the change.

---

# Prepare for an outbound IP address change

If you received a notification that the outbound IP addresses of your Azure App Service app are changing, follow these instructions.

## Determine if you need to do anything

* Option 1: If your App Service app doesn't use IP filtering, an explicit inclusion list, or special handling of outbound traffic such as routing or firewall, no action is required.

* Option 2: If your app does have special handling for the outbound IP addresses (see the following examples), add the new outbound IP addresses wherever the existing ones appear. Don't replace the existing IP addresses. You can find the new outbound IP addresses by following the instructions in the next section.

  For example, an outbound IP address might be explicitly included in a firewall outside your app, or an external payment service might have an allowed list that contains the outbound IP address for your app. If your outbound address is configured in a list anywhere outside your app, your outbound address needs to change.

## Find the outbound IP addresses in the Azure portal

The new outbound IP addresses are shown in the portal before they take effect. When Azure starts using the new ones, the old ones are no longer used. Only one set at a time is used, so entries in inclusion lists must have both old and new IP addresses to prevent an outage when the switch happens. 

1. Open the [Azure portal](https://portal.azure.com).

1. In the sidebar menu, select **App Services**.

1. Select your App Service app from the list.

1. If the app is a function app, see [Function app outbound IP addresses](../azure-functions/ip-addresses.md#find-outbound-ip-addresses).

1. Under **Settings** in the sidebar menu, select **Networking**, and then find the section labeled **Outbound addresses**.

1. Copy the IP addresses, then add them to your special handling of outbound traffic such as a filter or allowed list. Don't delete the existing IP addresses in the list.

## Related content 

- [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md)
