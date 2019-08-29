---
 title: include file
 description: include file
 services: notification-hubs
 author: spelluru
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 02/05/2019
 ms.author: spelluru
 ms.custom: include file
---

1. Sign in to the [Firebase console](https://firebase.google.com/console/). Create a new Firebase project if you don't already have one.
2. After you create your project, select **Add Firebase to your Android app**. 

    ![Add Firebase to your Android app](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-add-firebase-to-android-app.png)
3. On the **Add Firebase to your Android app** page, take the following steps: 
    1. For **Android package name**, copy the value of your **applicationId** in your application's build.gradle file. In this example, it's `com.fabrikam.fcmtutorial1app`. 

        ![Specify the package name](./media/notification-hubs-enable-firebase-cloud-messaging/specify-package-name-fcm-settings.png)
    2. Select **Register app**. 
4. Select **Download google-services.json**, save the file into the **app** folder of your project, and then select **Next**. 

    ![Download google-services.json](./media/notification-hubs-enable-firebase-cloud-messaging/download-google-service-button.png)
5. Make the following **configuration changes** to your project in Android Studio. 
    1.  In your project-level build.gradle file (&lt;project&gt;/build.gradle), add the following statement to the **dependencies** section. 

        ```
        classpath 'com.google.gms:google-services:4.0.1'
        ```
    2. In your app-level build.gradle file (&lt;project&gt;/&lt;app-module&gt;/build.gradle), add the following statement to the **dependencies** section. 

        ```
        implementation 'com.google.firebase:firebase-core:16.0.1'
        ```

    3. Add the following line to the end of the app-level build.gradle file after the dependencies section. 

        ```
        apply plugin: 'com.google.gms.google-services'
        ```        
    4. Select **Sync now** on the toolbar. 
 
        ![build.gradle configuration changes](./media/notification-hubs-enable-firebase-cloud-messaging/build-gradle-configurations.png)
6. Select **Next**. 
7. Select **Skip this step**. 

    ![Skip the last step](./media/notification-hubs-enable-firebase-cloud-messaging/skip-this-step.png)
8. In the Firebase console, select the cog for your project. Then select **Project Settings**.

    ![Select Project Settings](./media/notification-hubs-enable-firebase-cloud-messaging/notification-hubs-firebase-console-project-settings.png)
4. If you haven't downloaded the google-services.json file into the **app** folder of your Android Studio project, you can do so on this page. 
5. Switch to the **Cloud Messaging** tab at the top. 
6. Copy and save the **Server key** for later use. You use this value to configure your hub.
