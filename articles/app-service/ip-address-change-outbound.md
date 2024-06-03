---
title: Prepare for outbound IP address change
description: If your outbound IP address is going to be changed, learn what to do so that your app continues to work after the change.

ms.topic: article
ms.date: 06/28/2018
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft

---

# How to prepare for an outbound IP address change

If you received a notification that the outbound IP addresses of your Azure App Service app are changing, follow the instructions in this article.

## Determine if you have to do anything

* Option 1: If your App Service app does not use IP filtering, an explicit inclusion list, or special handling of outbound traffic such as routing or firewall, no action is required.

* Option 2: If your app does have special handling for the outbound IP addresses (see examples below), add the new outbound IP addresses wherever the existing ones appear. Don’t replace the existing IP addresses. You can find the new outbound IP addresses by following the instructions in the next section.

  For example, an outbound IP address may be explicitly included in a firewall outside your app, or an external payment service may have an allowed list that contains the outbound IP address for your app. If your outbound address is configured in a list anywhere outside your app, that needs to change.

## Find the outbound IP addresses in the Azure portal

The new outbound IP addresses are shown in the portal before they take effect. When Azure starts using the new ones, the old ones will no longer be used. Only one set at a time is used, so entries in inclusion lists must have both old and new IP addresses to prevent an outage when the switch happens. 

1.	Open the [Azure portal](https://portal.azure.com).

2.	In the left-hand navigation menu, select **App Services**.

3.	Select your App Service app from the list.

1.  If the app is a function app, see [Function app outbound IP addresses](../azure-functions/ip-addresses.md#find-outbound-ip-addresses).

4.	Under the **Settings** header, click **Properties** in the left navigation, and find the section labeled **Outbound IP addresses**.

5. Copy the IP addresses, and add them to your special handling of outbound traffic such as a filter or allowed list. Don't delete the existing IP addresses in the list.

## Next steps

This article explained how to prepare for an IP address change that was initiated by Azure. For more information about IP addresses in Azure App Service, see [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md).
