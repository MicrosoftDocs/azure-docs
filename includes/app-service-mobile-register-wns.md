
1. In Visual Studio Solution Explorer, right-click the Windows Store app project, and click **Store** > **Associate App with the Store**.

    ![Associate app with Windows Store](./media/app-service-mobile-register-wns/notification-hub-associate-win8-app.png)
2. In the wizard, click **Next**, and sign in with your Microsoft account. Type a name for your app in **Reserve a new app name**, and then click **Reserve**.
3. After the app registration is successfully created, select the new app name, click **Next**, and then click **Associate**. This adds the required Windows Store registration information to the application manifest.
4. Repeat steps 1 and 3 for the Windows Phone Store app project by using the same registration you previously created for the Windows Store app.  
5. Browse to the [Windows Dev Center](https://dev.windows.com/en-us/overview), and sign in with your Microsoft account. Click the new app registration in **My apps**, and then expand **Services** > **Push notifications**.
6. On the **Push notifications** page, click **Live Services site** under **Windows Push Notification Services (WNS) and Microsoft Azure Mobile Apps**. Make a note of the values of the **Package SID** and the *current*  value in **Application Secret**. 

    ![App setting in the developer center](./media/app-service-mobile-register-wns/mobile-services-win8-app-push-auth.png)

   > [!IMPORTANT]
   > The application secret and package SID are important security credentials. Do not share these values with anyone or distribute them with your app.
   >
   >
