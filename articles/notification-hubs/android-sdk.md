---

title: Send push notifications to Android using Azure Notification Hubs and Firebase SDK version 1.0.0-preview1
description: In this tutorial, you learn how to use Azure Notification Hubs and Google Firebase Cloud Messaging to send push notifications to Android devices.
author: sethmanheim
ms.author: sethm
ms.date: 5/28/2020
ms.topic: tutorial
ms.service: notification-hubs
ms.reviewer: thsomasu
ms.lastreviewed: 05/27/2020
---

# Tutorial: Send push notifications to Android devices using Firebase SDK version 1.0.0-preview1

This tutorial shows how to use Azure Notification Hubs and the updated version of the Firebase Cloud Messaging (FCM) SDK (version 1.0.0-preview1) to send push notifications to an Android application. In this tutorial, you create a blank Android app that receives push notifications using Firebase Cloud Messaging (FCM).

You can download the completed code for this tutorial from [GitHub](https://github.com/Azure/azure-notificationhubs-android/tree/v1-preview/notification-hubs-test-app-refresh).

This tutorial covers the following steps:

- Create an Android Studio project.
- Create a Firebase project that supports Firebase Cloud Messaging.
- Create a notification hub.
- Connect your app to the hub.
- Test the app.

## Prerequisites

To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/free/).

You also need the following items:

- The latest version of [Android Studio](https://go.microsoft.com/fwlink/?LinkId=389797) is recommended.
- Minimum support is API level 16.

## Create an Android Studio project

The first step is to create a project in Android Studio:

1. Launch Android Studio.

2. Select **File**, then select **New**, and then **New Project**.

3. On the **Choose your project** page, select **Empty Activity**, and then select **Next**.

4. On the **Configure your project** page, do the following:
   1. Enter a name for the application.
   2. Specify a location in which to save the project files.
   3. Select **Finish**.

   :::image type="content" source="media/android-sdk/configure-project.png" alt-text="Configure project":::

## Create a Firebase project that supports FCM

1. Sign in to the [Firebase console](https://firebase.google.com/console/). Create a new Firebase project if you don't already have one.

2. After you create your project, select **Add Firebase to your Android app**.

   :::image type="content" source="media/android-sdk/get-started.png" alt-text="Add Firebase":::

3. On the **Add Firebase to your Android app** page, do the following:

   1. For **Android package name**, copy the value of the **applicationId** in your application's **build.gradle** file. In this example, it's `com.fabrikam.fcmtutorial1app`.

      :::image type="content" source="media/android-sdk/specify-package-name-fcm-settings.png" alt-text="Specify package name":::

   2. Select **Register app**.

4. Select **Download google-services.json**, save the file into the **app** folder of your project, and then select **Next**.

   :::image type="content" source="media/android-sdk/download-google-service-button.png" alt-text="Download Google service":::

5. In the Firebase console, select the cog for your project. Then select **Project Settings**.

   :::image type="content" source="media/android-sdk/notification-hubs-firebase-console-project-settings.png" alt-text="Project settings":::

6. If you haven't downloaded the **google-services.json** file into the **app** folder of your Android Studio project, you can do so on this page.

7. Switch to the **Cloud Messaging** tab.

8. Copy and save the **Server key** for later use. You use this value to configure your hub.

## Configure a notification hub

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select **All services** on the left menu, and then select **Notification Hubs** in the **Mobile** section. Select the star icon next to the service name to add the service to the **FAVORITES** section on the left menu. After you add **Notification Hubs** to **FAVORITES**, select it on the left menu.

3. On the **Notification Hubs** page, select **Add** on the toolbar.

   :::image type="content" source="media/android-sdk/add-hub.png" alt-text="Add hub":::

4. On the **Notification Hubs** page, do the following:

   1. Enter a name in **Notification Hub**.

   2. Enter a name in **Create a new namespace**. A namespace contains one or more hubs.

   3. Select a value from the **Location** drop-down. This value specifies the location in which you want to create the hub.

   4. Select an existing resource group in **Resource Group**, or create a new one.

   5. Select **Create**.

      :::image type="content" source="media/android-sdk/create-hub.png" alt-text="Create hub":::

5. Select **Notifications** (the bell icon), and then select **Go to resource**. You can also refresh the list on the **Notification Hubs** page and select your hub.

   :::image type="content" source="media/android-sdk/notification-hubs.png" alt-text="Select hub":::

6. Select **Access Policies** from the list. Note that two connection strings are available. You'll need them later to handle push notifications.

   :::image type="content" source="media/android-sdk/access-policies.png" alt-text="Access policies":::

   > [!IMPORTANT]
   > Do not use the **DefaultFullSharedAccessSignature** policy in your
   > application. This policy is to be used in the app back-end only.

## Configure Firebase Cloud Messaging settings for the hub

1. In the left pane, under **Settings,** select **Google (GCM/FCM)**.

2. Enter the **server key** for the FCM project that you saved earlier.

3. On the toolbar, select **Save**.

   :::image type="content" source="media/android-sdk/fcm-server-key.png" alt-text="Server key":::

4. The Azure portal displays a message that the hub has been successfully updated. The **Save** button is disabled.

Your notification hub is now configured to work with Firebase Cloud Messaging. You
also have the connection strings that are necessary to send notifications to a device and register an app to receive notifications.

## Connect your app to the notification hub

### Add Google Play services to the project

1. In Android Studio, select **Tools** on the menu, and then select **SDK Manager**.

2. Select the target version of the Android SDK that is used in your project. Then select **Show Package Details**.

   :::image type="content" source="media/android-sdk/notification-hubs-android-studio-sdk-manager.png" alt-text="SDK manager":::

3. Select **Google APIs**, if it's not already installed.

   :::image type="content" source="media/android-sdk/google-apis-selected.png" alt-text="APIs":::

4. Switch to the **SDK Tools** tab. If you haven't already installed Google Play Services, select **Google Play Services** as shown in the following image. Then select **Apply** to install. Note the SDK path, for use in a later step.

   :::image type="content" source="media/android-sdk/google-play-services-selected.png" alt-text="Play services":::

5. If you see the **Confirm Change** dialog box, select **OK**. The component installer installs the requested components. Select **Finish** after the components are installed.

6. Select **OK** to close the **Settings for New Projects** dialog box.

### Add Azure Notification Hubs libraries

1. In the **build.gradle** file for the app, add the following lines in the dependencies section:

   ```gradle
   implementation 'com.microsoft.azure:notification-hubs-android-sdk:1.0.0-preview1@aar'
   implementation 'androidx.appcompat:appcompat:1.0.0'

   implementation 'com.google.firebase:firebase-messaging:20.1.5'

   implementation 'com.android.volley:volley:1.1.1'
   ```

2. Add the following repository after the dependencies section:

   ```gradle
   repositories {
      maven {
         url "https://dl.bintray.com/microsoftazuremobile/SDK"
      }
   }
   ```

### Add Google Firebase support

1. Add the following plug-in at the end of the file if it's not already there.

   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

2. Select **Sync Now** on the toolbar.

### Add code

1. Create a **NotificationHubListener** object, which handles intercepting the messages from Azure Notification Hubs.

   ```csharp
   public class CustomNotificationListener implements NotificationHubListener {

      @override

      public void onNotificationReceived(Context context, NotificationMessage message) {

      /* The following notification properties are available. */

      String title = message.getTitle();
      String message = message.getMessage();
      Map<String, String> data = message.getData();

      if (message != null) {
         Log.d(TAG, "Message Notification Title: " + title);
         Log.d(TAG, "Message Notification Body: " + message);
         }
      }
   }
   ```

2. In the `OnCreate` method of the `MainActivity` class, add the following code to start the Notification Hubs initialization process when the activity is created:

   ```java
   @Override
   protected void onCreate(Bundle savedInstanceState) {

      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity\_main);
      NotificationHub.setListener(new CustomNotificationListener());
      NotificationHub.initialize(this.getApplication(), “Connection-String”, "Hub Name");

   }
   ```

3. In Android Studio, on the menu bar, select **Build**, then select **Rebuild Project** to make sure that there are no errors in your code. If you receive an error about the **ic_launcher** icon, remove the following statement from the AndroidManifest.xml file:

   ```xml
   android:icon="@mipmap/ic_launcher"
   ```

4. Ensure that you have a virtual device for running the app. If you do not have one, add one as follows:

   1. :::image type="content" source="media/android-sdk/open-device-manager.png" alt-text="Device manager":::
   2. :::image type="content" source="media/android-sdk/your-virtual-devices.png" alt-text="Virtual devices":::
   3. Run the app on your selected device, and verify that it registers successfully with the hub.

      :::image type="content" source="media/android-sdk/device-registration.png" alt-text="Device registration":::

      > [!NOTE]
      > Registration might fail during the initial launch, until the
      > `onTokenRefresh()` method of the instance ID service is called. A
      > refresh should initiate a successful registration with the notification
      > hub.

## Send a test notification

You can send push notifications to your notification hub from the [Azure portal](https://portal.azure.com/), as follows:

1. In the Azure portal, on the notification hub page for your hub, select **Test Send** in the **Troubleshooting** section.

2. In **Platforms**, select **Android**.

3. Select **Send**. You won't see a notification on the Android device yet because you haven't run the mobile app on it. After you run the mobile app, select the **Send** button again to see the notification message.

4. See the result of the operation in the list at the bottom of the portal page.

   :::image type="content" source="media/android-sdk/notification-hubs-test-send.png" alt-text="Send test notification":::

5. You see the notification message on your device.

Push notifications are normally sent in a back-end service such as Mobile Apps or ASP.NET using a compatible library. If a library isn't available for your back end, you can also use the REST API directly to send notification messages.

## Run the mobile app on emulator

Before you test push notifications inside an emulator, make sure that your emulator image supports the Google API level that you chose for your app. If your image doesn't support native Google APIs, you might get a **SERVICE_NOT_AVAILABLE** exception.

Also make sure that you've added your Google account to your running emulator under **Settings** > **Accounts**. Otherwise, your attempts to register with FCM might result in an **AUTHENTICATION_FAILED** exception.

## Next steps

In this tutorial, you used Firebase Cloud Messaging to broadcast
notifications to all Android devices that were registered with the
service. To learn how to push notifications to specific devices, advance
to the following tutorial:

> [!div class="nextstepaction"]
>[Tutorial: Send notifications to specific users](push-notifications-android-specific-users-firebase-cloud-messaging.md)

The following is a list of some other tutorials for sending notifications:

- Azure Mobile Apps: For an example of how to send notifications from a Mobile Apps back end integrated with Notification Hubs, see [Add Push Notifications to your iOS app](/azure/app-service-mobile/app-service-mobile-ios-get-started-push).

- ASP.NET: [Use Notification Hubs to send push notifications to users](notification-hubs-aspnet-backend-ios-apple-apns-notification.md).

- Azure Notification Hubs Java SDK: See [How to use Notification Hubs from Java](notification-hubs-java-push-notification-tutorial.md) for sending notifications from Java. This has been tested in Eclipse for Android Development.

- PHP: [How to use Notification Hubs from PHP](notification-hubs-php-push-notification-tutorial.md).
