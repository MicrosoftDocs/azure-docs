---
title: Prepare for TLS/SSL IP address change
description: If your TLS/SSL IP address is going to be changed, learn what to do so that your app continues to work after the change.

ms.topic: article
ms.date: 06/28/2018
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft

---

# How to prepare for a TLS/SSL IP address change

If you received a notification that the TLS/SSL IP address of your Azure App Service app is changing, follow the instructions in this article to release existing TLS/SSL IP address and assign a new one.

> [!NOTE] 
> Service Endpoint is not currently supported when enabling IP Based SSL on App Service TLS/SSL bindings. 


## Release TLS/SSL IP addresses and assign new ones

1.	Open the [Azure portal](https://portal.azure.com).

2.	In the left-hand navigation menu, select **App Services**.

3.	Select your App Service app from the list.

4.	Under the **Settings** header, click **SSL settings** in the left navigation.

1. In the TLS/SSL bindings section, select the host name record. In the editor that opens, choose **SNI SSL** on the **SSL Type** drop-down menu and click **Add Binding**. When you see the operation success message, the existing IP address has been released.

6.	In the **SSL bindings** section, again select the same host name record with the certificate. In the editor that opens, this time choose **IP Based SSL** on the **SSL Type** drop-down menu and click **Add Binding**. When you see the operation success message, you’ve acquired a new IP address.

7.	If an A record (DNS record pointing directly to your IP address) is configured in your Domain Registration Portal (third party DNS Provider or Azure DNS), replace the existing IP address with the newly generated one. You can find the new IP address by following the instructions in the next section.

## Find the new SSL IP address in the Azure Portal

1.	Wait a few minutes, and then open the [Azure portal](https://portal.azure.com).

2.	In the left-hand navigation menu, select **App Services**.

3.	Select your App Service app from the list.

4.	Under the **Settings** header, click **Properties** in the left navigation, and find the section labeled **Virtual IP address**.

5. Copy the IP address and reconfigure your domain record or IP mechanism.

## Next steps

This article explained how to prepare for an IP address change that was initiated by Azure. For more information about IP addresses in Azure App Service, see [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md).
