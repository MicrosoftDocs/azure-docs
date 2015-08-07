
* [Install a client SSL iigning Identity on the server](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW15) to export the certificate you downloaded in the previous step to a .p12 file.

* In the Azure portal, click **Browse All** > **Mobile Apps** > your backend > **Settings** > **Mobile App** > **Push** > **Apple Push Notification Services** > **Upload Certificate**. Upload the .p12 file, selecting the correct **Mode** (corresponding to whether the client SSL certificate you generated earlier was Development or Distribution.) Your service is now configured to work with push notifications on iOS!
