

1. If you have not already registered your app, navigate to the [Submit an app page] at the Dev Center for Windows Store apps, log on with your Microsoft account, and then click **App name**.

   ![][0]

2. Type a name for your app in **App name**, click **Reserve app name**, and then click **Save**.

   ![][1]

   This creates a new Windows Store registration for your app.

3. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services].

4. In solution explorer, right-click the project, click **Store**, and then click **Associate App with the Store...**. 

  ![][2]

   This displays the **Associate Your App with the Windows Store** Wizard.

5. In the wizard, click **Sign in** and then login with your Microsoft account.

6. Select the app that you registered in step 2, click **Next**, and then click **Associate**.

   ![][3]

   This adds the required Windows Store registration information to the application manifest.    

7. Back in the Windows Dev Center page for your new app, click **Services**. 

   ![][4] 

8. In the Services page, click **Live Services site** under **Windows Azure Mobile Services**.

	![][5]

9. Click **Authenticating your service** and make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   ![][6]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these secrets with anyone or distribute them with your app.</p>
    </div> 

10. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][7]

11. Click the **Push** tab, enter the **Client secret** and **Package SID** values obtained from WNS in Step 4, and then click **Save**.

   ![][8]

<!-- Anchors. -->

<!-- Images. -->
[0]: ../Media/mobile-services-submit-win8-app.png
[1]: ../Media/mobile-services-win8-app-name.png
[2]: ../Media/mobile-services-store-association.png
[3]: ../Media/mobile-services-select-app-name.png
[4]: ../Media/mobile-services-win8-edit-app.png
[5]: ../Media/mobile-services-win8-edit2-app.png
[6]: ../Media/mobile-services-win8-app-push-auth.png
[7]: ../Media/mobile-services-selection.png
[8]: ../Media/mobile-push-tab.png

<!-- URLs. -->
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service