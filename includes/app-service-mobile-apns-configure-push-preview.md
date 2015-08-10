
1.  [Install a client SSL signing Identity on the server](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW15) to export the certificate you downloaded in the previous step to a .p12 file.
2. In the Azure portal, click **Browse All** > **Mobile Apps** > your backend > **Settings** > **Mobile App** > **Push** > **Configure required settings** > **+ Notification Hub**, and provide a name and namespace for your notification hub, and then click the **OK** button.

![][1]

2. In the **Create Notification Hub** blade, click the **Create** button.
     
    Before you proceed to the next step, click **Notifications**, to ensure that your notification hub setup is complete. 
3. In the Azure portal, click **Browse All** > **Mobile Apps** > your backend > **Settings** > **Mobile App** > **Push** > **Apple Push Notification Services** > **Upload Certificate**. Upload the .p12 file, selecting the correct **Mode** (corresponding to whether the client SSL certificate you generated earlier was Development or Distribution.) Your service is now configured to work with push notifications on iOS!

[1]: ./media/\app-service-mobile-apns-configure-push-preview\mobile-push-notification-hub.png