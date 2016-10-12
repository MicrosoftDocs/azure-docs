

1. On your Mac, launch **Keychain Access**. Open **My Certificates** under **Category** on the left navigationn bar. Find the SSL certificate you downloaded in the previous section and disclose its contents. Select only the certificate (do not select the private key), and [export it](https://support.apple.com/kb/PH20122?locale=en_US).

2. In the [Azure portal](https://portal.azure.com/), click **Browse All** > **App Services** > your Mobile App backend. Under **Settings**, click on **App Service Push**, then click your notification hub name. Go to **Apple Push Notification Services** > **Upload Certificate**. Upload the .p12 file, selecting the correct **Mode** (depending on whether your client SSL certificate from earlier is Production or Sandbox). Save any changes.

Your service is now configured to work with push notifications on iOS!

[1]: ./media/app-service-mobile-apns-configure-push/mobile-push-notification-hub.png
