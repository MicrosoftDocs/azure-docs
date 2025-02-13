---
 title: include file
 description: include file
 services: notification-hubs
 author: spelluru
 ms.service: azure-notification-hubs
 ms.topic: include
 ms.date: 08/01/2019
 ms.author: spelluru
 ms.custom: include file
---

1. Sign in to the [Firebase console](https://console.firebase.google.com/). Create a new Firebase project if you don't already have one.
2. After you create your project, select **Add Firebase to your Android app**. 

    ![Add Firebase to your Android app](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-add-firebase-to-android-app.png)

3. On the **Add Firebase to your Android app** page, take the following steps: 
    1. For the **Android package name**, enter a name for your package. For example: `tutorials.tutorial1.xamarinfcmapp`. 

        ![Specify the package name](./media/notification-hubs-enable-firebase-cloud-messaging/specify-package-name-fcm-settings.png)
    2. Select **Register app**.  
    1. Select **Download google-services.json**. Then save the file into the folder of your project and select **Next**. If you haven't created the Visual Studio project yet, you can do this step after you create the project. 

        ![Download google-services.json](./media/notification-hubs-enable-firebase-cloud-messaging/download-google-service-button.png)
    6. Select **Next**. 
    7. Select **Skip this step**. 

        ![Skip the last step](./media/notification-hubs-enable-firebase-cloud-messaging/skip-this-step.png)
8. In the Firebase console, select the cog for your project. Then select **Project Settings**.

    ![Select Project Settings](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-firebase-console-project-settings.png)
4. If you haven't downloaded the **google-services.json** file, you can do download it on this page. 

    ![Download google-services.json from the General tab](./media/notification-hubs-enable-firebase-cloud-messaging/download-google-services-json-general-page.png)
1. Switch to the **Cloud Messaging** tab at the top. Copy and save the **Server key** for later use. You use this value to configure your notification hub.

    ![Copy server key](./media/notification-hubs-enable-firebase-cloud-messaging/server-key.png)
