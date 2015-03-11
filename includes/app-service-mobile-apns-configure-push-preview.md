After you have registered your app with APNS and configured your project, you must next configure your mobile app to integrate with APNS.

1. In Keychain Access, right-click the quickstart app's new certificate in **Keys** or **My Certificates**, click **Export**, name your file QuickstartPusher, select the **.p12** format, then click **Save**.

   	![](./media/mobile-services-apns-configure-push/mobile-services-ios-push-step18.png)

    Make a note of the file name and location of the exported certificate.

>[AZURE.NOTE] This tutorial creates a QuickstartPusher.p12 file. Your file name and location might be different.

2. Log on to the [Azure Preview Portal], select **Browse**, **Mobile Apps**, and then click your app. click on Push Notification services.

3. In Apple Push Notification Service, upload your certificate with the **.p12** file, the password you associated with it, and select the desired mode.

Your App Service mobile app is now configured to work with APNS.

<!-- URLs. -->
[Azure Preview Portal]: https://portal.azure.com/
