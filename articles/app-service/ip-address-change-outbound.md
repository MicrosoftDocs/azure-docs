---
title: How to prepare for an outbound IP address change
description: If your outbound IP address is going to be changed, learn what to do so that your app continues to work after the change.
services: app-service\web
author: tdykstra
manager: cfowler
editor: 

ms.service: app-service-web
ms.workload: web
ms.topic: article
ms.date: 06/28/2018
ms.author: tdykstra
---

# How to prepare for an outbound IP address change

If you received a notification that the outbound IP address of your App Service app is changing, follow the instructions in this article.

## Determine if you have to do anything

* Option 1: If your App Service app does not use IP filtering, an explicit inclusion list, or special handling of outbound traffic such as routing or firewall, no action is required.

  For example, an outbound IP address may be explicitly included in a firewall outside your app, or an external payment service may have an allowed list that contains the outbound IP address for your app. If your outbound address is not configured in a list anywhere outside your app, there will be no effect on your app when the IP address changes.

* Option 2: If your app does have special handling for the outbound IP address, add the new outbound IP address wherever the existing one appears (don’t replace the existing IP address). You can find the new outbound IP address by following the instructions in the next section.

## Find the outbound IP Address in the Azure portal

The new outbound IP address is shown in the portal before it takes effect. When Azure starts using the new one, the the old one will no longer be used. Only one at a time is used, so entries in inclusion lists must have both old and new IP addresses to prevent an outage when the switch happens. 

1.	Open the [Azure portal](https://portal.azure.com).

2.	In the left-hand navigation menu, select **App Services**.

3.	Select your App Service app from the list.

4.	Under the **Settings** header, click **Properties** in the left navigation, and find the section labeled **Outbound IP addresses**.

5. Copy the IP addresses, and add them to your special handling of outbound traffic such as a filter or allowed list. Don't delete the existing IP addresses in the list until after your app starts using the new IP addresses.

## Next steps

This article explained how to prepare for an IP address change that was initiated by Azure. For more information about IP addresses in Azure App Service, see [outbound and outbound IP addresses in Azure App Service](app-service-ip-addresses.md).
