
1.  On your Mac, launch **Keychain Access**. Open **Category** > **My Certificates**. Find the SSL certificate to export (that you downloaded earlier) and disclose its contents. Select only the certificate without selecting the private key, and [export it](https://support.apple.com/kb/PH20122?locale=en_US).

2. In the Azure portal, click **Browse All** > **Mobile Apps** > your backend > **Settings** > **Mobile App** > **Push** > **Configure required settings** > **+ Notification Hub**, and provide a name and namespace for your notification hub, and then click the **OK** button.

  ![][1]

3. In the **Create Notification Hub** blade, click the **Create** button.
     
    Before you proceed to the next step, click **Notifications**, to ensure that your notification hub setup is complete. 
4. In the Azure portal, click **Browse All** > **Mobile Apps** > your backend > **Settings** > **Mobile App** > **Push** > **Apple Push Notification Services** > **Upload Certificate**. Upload the .p12 file, selecting the correct **Mode** (corresponding to whether the client SSL certificate you generated earlier was Development or Distribution.) Your service is now configured to work with push notifications on iOS!

[1]: ./media/app-service-mobile-apns-configure-push-preview/mobile-push-notification-hub.png
