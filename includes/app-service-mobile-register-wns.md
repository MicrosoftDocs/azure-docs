---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
ms.author: crdun
---

1. In Visual Studio Solution Explorer, right-click the Windows Store app project. Then select **Store** > **Associate App with the Store**.

    ![Associate app with Windows Store](./media/app-service-mobile-register-wns/notification-hub-associate-win8-app.png)
2. In the wizard, select **Next**. Then sign in with your Microsoft account. In **Reserve a new app name**, type a name for your app, and then select **Reserve**.
3. After the app registration is successfully created, select the new app name. Select **Next**, and then select **Associate**. This process adds the required Windows Store registration information to the application manifest.
4. Repeat steps 1 and 3 for the Windows Phone Store app project by using the same registration you previously created for the Windows Store app.  
5. Go to the [Windows Dev Center](https://dev.windows.com/en-us/overview), and then sign in with your Microsoft account. In **My apps**, select the new app registration. Then expand **Services** > **Push notifications**.
6. On the **Push notifications** page, under **Windows Push Notification Services (WNS) and Microsoft Azure Mobile Apps**,  select **Live Services site**.  Make a note of the values of the **Package SID** and the *current*  value in **Application Secret**. 

    ![App setting in the developer center](./media/app-service-mobile-register-wns/mobile-services-win8-app-push-auth.png)

   > [!IMPORTANT]
   > The application secret and package SID are important security credentials. Don't share these values with anyone or distribute them with your app.
   >
   >
