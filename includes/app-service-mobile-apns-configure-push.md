---
author: conceptdev
ms.author: crdun
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
---
1. On your Mac, launch **Keychain Access**. On the left navigation bar, under **Category**, open **My Certificates**. Find the SSL certificate that you downloaded in the previous section, and then disclose its contents. Select only the certificate (do not select the private key). Then [export it](https://support.apple.com/kb/PH20122?locale=en_US).
2. In the [Azure portal](https://portal.azure.com/), select **Browse All** > **App Services**. Then select your Mobile Apps back end. 
3. Under **Settings**, select **App Service Push**. Then select your notification hub name. 
4. Go to **Apple Push Notification Services** > **Upload Certificate**. Upload the .p12 file, selecting the correct **Mode** (depending on whether your client SSL certificate from earlier is production or sandbox). Save any changes.

Your service is now configured to work with push notifications on iOS.

[1]: ./media/app-service-mobile-apns-configure-push/mobile-push-notification-hub.png
