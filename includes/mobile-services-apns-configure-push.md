
* Follow the steps at [Installing a Client SSL Signing Identity on the Server](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW15) to export the certificate you downloaded in the previous step to a .p12 file.

* In the Azure portal, click **Mobile Services** > your app > the **Push** tab > **apple push notification settings** > "**Upload**. Upload the .p12 file, making sure that the correct **Mode** is selected (either Sandbox or Production, corresponding to whether the client SSL certificate you generated was Development or Distribution.) Your mobile service is now configured to work with push notifications on iOS!
