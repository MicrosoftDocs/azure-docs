After you have registered your app with APNS and configured your project, you must next configure your mobile service to integrate with APNS.

1. In Keychain Access, right-click the quickstart app's new certificate in **Keys** or **My Certificates**, click **Export**, name your file QuickstartPusher, select the **.p12** format, then click **Save**.

   	![](./media/mobile-services-apns-configure-push/mobile-services-ios-push-step18.png)

  Make a note of the file name and location of the exported certificate.

>[WACOM.NOTE] This tutorial creates a QuickstartPusher.p12 file. Your file name and location might be different.

2. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app.

   	![](./media/mobile-services-apns-configure-push/mobile-services-selection.png)

3. Click the **Push** tab and click **Upload**.

   	![](./media/mobile-services-apns-configure-push/mobile-push-tab-ios.png)

	This displays the Upload Certificate dialog.

4. Click **File**, select the exported certificate QuickstartPusher.p12 file, enter the **Password**, make sure that the correct **Mode** is selected (either Dev/Sandbox or Prod/Production), click the check icon, then click **Save**.

   	![](./media/mobile-services-apns-configure-push/mobile-push-tab-ios-upload.png)

    > [WACOM.NOTE] This tutorial uses developement certificates.

Your mobile service is now configured to work with APNS.

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/
