
1. After you have registered your app with Apple and configured your Xcode project, you must next configure your Azure mobile service. Follow the steps [Installing a Client SSL Signing Identity on the Server](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW15) to export the certificate you downloaded in the previous step to a .p12 file.

2. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app. Click the **Push** tab and click **Upload**. This displays the Upload Certificate dialog.

3. Upload the .p12 file you exported earlier, making sure that the correct **Mode** is selected (either development or production.) Your mobile service is now configured to work with push notifications on iOS!

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/
