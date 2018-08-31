---
 title: include file
 description: include file
 services: notification-hubs
 author: spelluru
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 04/05/2018
 ms.author: spelluru
 ms.custom: include file
---

1. Sign in to the [Firebase console](https://firebase.google.com/console/). Create a new Firebase project if you don't already have one.
2. After you create your project, select **Add Firebase to your Android app**. Then follow the instructions that are provided. Download **google-services.json** file. 

    ![Add Firebase to your Android app](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-add-firebase-to-android-app.png)
3. In the Firebase console, select the cog for your project. Then select **Project Settings**.

    ![Select Project Settings](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-firebase-console-project-settings.png)
4. Select the **General** tab in your project settings. Then download the **google-services.json** file that contains the Server API key and Client ID.
5. Select the **Cloud Messaging** tab in your project settings, and then copy the value of the **Legacy server key**. You use this value to configure the notification hub access policy.
