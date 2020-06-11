---
title: Prepare for inbound IP address change
description: If your inbound IP address is going to be changed, learn what to do so that your app continues to work after the change.

ms.topic: article
ms.date: 06/28/2018
ms.custom: seodec18
---

# How to prepare for an inbound IP address change

If you received a notification that the inbound IP address of your Azure App Service app is changing, follow the instructions in this article.

## Determine if you have to do anything

* Option 1: If your App Service app does not have a Custom Domain, no action is required.

* Option 2: If only a CNAME record (DNS record pointing to a URI) is configured in your Domain Registration Portal (third party DNS Provider or Azure DNS), no action is required.

* Option 3: If an A record (DNS record pointing directly to your IP address) is configured in your Domain Registration Portal (third party DNS Provider or Azure DNS), replace the existing IP address with the new one. You can find the new IP address by following the instructions in the next section.

* Option 4: If your application is behind a load balancer, IP Filter, or any other IP mechanism that requires your app's IP address, replace the existing IP address with the new one. You can find the new IP address by following the instructions in the next section.

## Find the new inbound IP Address in the Azure portal

The new inbound IP address that is being given to your app is in the portal in the **Virtual IP address** field. Both this new IP address and the old one are connected to your app now, and later the old one will be disconnected.

1.	Open the [Azure portal](https://portal.azure.com).

2.	In the left-hand navigation menu, select **App Services**.

3.	Select your App Service app from the list.

1.  If the app is a function app, see [Function app inbound IP address](../azure-functions/ip-addresses.md#function-app-inbound-ip-address).

4.	Under the **Settings** header, click **Properties** in the left navigation, and find the section labeled **Virtual IP address**.

5. Copy the IP address and reconfigure your domain record or IP mechanism.

## Next steps

This article explained how to prepare for an IP address change that was initiated by Azure. For more information about IP addresses in Azure App Service, see [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md).
