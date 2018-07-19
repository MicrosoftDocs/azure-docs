---
title: Add push notifications to your Xamarin.Android app | Microsoft Docs
description: Learn how to use Azure App Service and Azure Notification Hubs to send push notifications to your Xamarin.Android app
services: app-service\mobile
documentationcenter: xamarin
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 6f7e8517-e532-4559-9b07-874115f4c65b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-android
ms.devlang: dotnet
ms.topic: article
ms.date: 07/19/2018
ms.author: crdun

---
# Add push notifications to your Xamarin.Android app
[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

## Overview
In this tutorial, you add push notifications to the [Xamarin.Android quickstart](app-service-mobile-windows-store-dotnet-get-started.md) project so that a push notification is sent to the device every time a record is inserted.

To support push notifications, the following

1. Create a Firebase Cloud Messaging (FCM) project.
2. Create and configure a Notification hub to send push notifications using the Firebase Cloud Messaging project.
3. Update the server project to send push notifications.
4. Update the Xamarin.Android app to receive and respond to push notifications:
5. Test the application.

If you do not use the downloaded quickstart server project, you will need the push notification extension package. For more information, see the [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) guide.

> [!IMPORTANT]
> Google Play Services must be installed on the device (or emulator) in order for it to be able to receive push notifications from Firebase Cloud Messaging.

## Prerequisites
This tutorial requires the following setup:

* An active Google account. You can sign up for a Google account at [accounts.google.com](http://go.microsoft.com/fwlink/p/?LinkId=268302).
* An Android device or emulator that has the Google Play Services library installed.

## <a id="register"></a>Create a Firebase Cloud Messaging project
[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging.md)]

> [!NOTE]
> The package name of the Firebase project must match the package name of the Xamarin.Android application, otherwise Firebase will not be able to send push notifications to the app.

## <a name="configure-hub"></a>Configure a Notification Hub
[!INCLUDE [app-service-mobile-configure-notification-hub](../../includes/app-service-mobile-configure-notification-hub.md)]

After creating the notification hub, gather the following information from the Azure project:

* **Listen connection string** &ndash; On the dashboard in the [Azure portal](https://portal.azure.com/), select **Manage > Access Policies** and copy the value of the _DefaultListenSharedAccessSignature_ connection string for this value.
* **Hub name** &ndash; This is the name of the notification pub. This can be found in the [Azure portal](https://portal.azure.com/) by clicking on the **Properties** tab.

## Configure Azure to send push requests
[!INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push-for-firebase.md)]

## <a id="update-server"></a>Update the server project to send push notifications
[!INCLUDE [app-service-mobile-update-server-project-for-push-template](../../includes/app-service-mobile-update-server-project-for-push-template.md)]

## <a id="configure-app"></a>Update the Xamarin.Android app to receive and respond to push notifications

The changes to the Xamarin.Android project will involve the following changes:

1. [Add the required NuGet packages to the project](#nuget-packages).
2. [Include the file **google-play-services.json**](#google-services-json).
3. [Register a broadcast receiver](#register-broadcast-receiver) to receive push notifications from the Firebase Cloud Message project.
4. [Respond to push notifications](#respond-to-notifications).

### <a id="nuget-packages></a>Add the NuGet packages to the project.
1. Right click on the project, and select **Manage NuGet Packages...**.
2. Add the following Nuget packages to the app:
    * Xamarin.GooglePlayServices.Base
    * Xamarin.Firebase.Messaging
    * Xamarin.Azure.NotificationHubs.Android
3. If necessary, update the package name of the Xamarin.Android app to match the package name of the Firebase project.
    [!Firebase Project Package Name](./media/package-name-gcm.png)

### <a id="google-services-json"></a>Add the Google Services JSON file
Add the **google-services.json** file that you downloaded from the Google Firebase  Console to the Xamarin.Android Project. In the **Properties** , set the Build Action to **GoogleServicesJson**. If you don't see **GoogleServicesJson**, close Visual Studio, relaunch it, reopen the project, and retry.

    [!Build Action ](./media/app-sevice-mobile-xamarin-android-get-started-push/google-services-json-build-action.png)

### <a id="register-broadcast-receiver"></a>Register a broadcast receiver

In order for the Xamarin.Android to receive push notification from Firebase cloud messaging, it must register an Android broadcast receiver that will listen for the messages. Open the **AndroidManifest.xml** file and insert the following `<receiver>` elements into the `<application>` element:

        <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdInternalReceiver" android:exported="false" />
            <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:exported="true" android:permission="com.google.android.c2dm.permission.SEND">
              <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
                <category android:name="${applicationId}" />
              </intent-filter>
        </receiver>

It is not necessary to replace or alter the token `${applicationId}`. The value of this token is contained in the **google-services.json** file and will be swapped out at runtime by the Xamarin bindings for the Firebase libraries.

### <a id="respond-to-notifications"></a>Respond to push notifications

1. Right-click your **project** in the **Solution Explorer** window, point to **Add**, and select **Class**.
2. Create a **Constants.cs** class for your Xamarin project and define the following constant values in the class. Replace the placeholders with your values.

    ```csharp
        public static class Constants
        {
           public const string ListenConnectionString = "<Listen connection string>";
           public const string NotificationHubName = "<hub name>";
        }
    ```
3. Add the following using statements to **MainActivity.cs**:

    ```csharp
        using Android.Util;
    ```
4. Create a new class, **MyFirebaseIIDService** like you created the **Constants** class.
5. Add the following using statements to **MyFirebaseIIDService.cs**:

    ```csharp
    using Android.App;
    using Android.Util;
    using WindowsAzure.Messaging;
    using Firebase.Iid;
    ```
6. In **MyFirebaseIIDService.cs**, add the following **class** declaration, and have your class inherit from **FirebaseInstanceIdService**:

    ```csharp
        [Service]
        [IntentFilter(new[] { "com.google.firebase.INSTANCE_ID_EVENT" })]
        public class MyFirebaseIIDService : FirebaseInstanceIdService
    ```
7. In **MyFirebaseIIDService.cs**, add the following code:

    ```csharp
        const string TAG = "MyFirebaseIIDService";
        NotificationHub hub;

        public override void OnTokenRefresh()
        {
            var refreshedToken = FirebaseInstanceId.Instance.Token;
            Log.Debug(TAG, "FCM token: " + refreshedToken);
            SendRegistrationToServer(refreshedToken);
        }

        void SendRegistrationToServer(string token)
        {
            // Register with Notification Hubs
            hub = new NotificationHub(Constants.NotificationHubName,
                                      Constants.ListenConnectionString, this);

            var tags = new List<string>() { };
            var regID = hub.Register(token, tags.ToArray()).RegistrationId;

            Log.Debug(TAG, $"Successful registration of ID {regID}");
        }
    ```
8. Create another new class for your project, name it **MyFirebaseMessagingService**.
9. Add the following using statements to **MyFirebaseMessagingService.cs**.

    ```csharp
        using Android.App;
        using Android.Util;
        using Firebase.Messaging;
    ```
10. Add the following above your class declaration, and have your class inherit from **FirebaseMessagingService**:

    ```csharp
        [Service]
        [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
        public class MyFirebaseMessagingService : FirebaseMessagingService
    ```
11. Add the following code to **MyFirebaseMessagingService.cs**:

    ```csharp
         static readonly string TAG = "FirebaseNotificationService";
         static readonly string CHANNEL_ID = "todo_list_changes";
         static readonly int NOTIFICATION_ID = 100;
         static readonly int RC_SHOW_TODO_ACTIVITY = 0;


         public override void OnMessageReceived(RemoteMessage message)
         {
             Log.Debug(TAG, "From: " + message.From);
             CreateNotificationChannel();

             if (message.GetNotification() != null)
             {
                 //These is how most messages will be received
                 Log.Debug(TAG, "Notification Message Body: " + message.GetNotification().Body);
                 SendNotification(message.GetNotification().Body);
             }
             else
             {
                 //Only used for debugging payloads sent from the Azure portal
                 SendNotification(message.Data.Values.First());
             }
         }

         void SendNotification(string messageBody)
         {
             var intent = new Intent(this, typeof(ToDoActivity));
             intent.AddFlags(ActivityFlags.ClearTop);
             var pendingIntent = PendingIntent.GetActivity(this, RC_SHOW_TODO_ACTIVITY, intent, PendingIntentFlags.OneShot);

             var notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                                       .SetContentTitle("FCM Message")
                                       .SetSmallIcon(Resource.Drawable.ic_launcher)
                                       .SetContentText(messageBody)
                                       .SetAutoCancel(true)
                                       .SetPriority(NotificationCompat.PriorityDefault)
                                       .SetCategory(NotificationCompat.CategoryMessage)
                                       .SetContentIntent(pendingIntent);

             var notificationManager = NotificationManagerCompat.From(this);
             notificationManager.Notify(NOTIFICATION_ID, notificationBuilder.Build());
         }

        void CreateNotificationChannel()
        {
            if (Android.OS.Build.VERSION.SdkInt < Android.OS.BuildVersionCodes.O)
            {
                return;
            }

            var channel =
                new NotificationChannel(CHANNEL_ID, "FCM Notification", NotificationImportance.Default)
                {
                    Description = "Messages from the Azure Notification Hub"
                };

            var notificationManager = (NotificationManager) GetSystemService(NotificationService);
            notificationManager.CreateNotificationChannel(channel);
        }
    ```

## <a name="test"></a>Test push notifications in your app
You can test the app by using a virtual device in the emulator. There are additional configuration steps required when running on an emulator.

1. The virtual device must have Google APIs set as the target in the Android Virtual Device (AVD) manager.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/google-apis-avd-settings.png)
2. Add a Google account to the Android device by clicking **Apps** > **Settings** > **Add account**, then follow the prompts.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/add-google-account.png)
3. Run the todolist app as before and insert a new todo item. This time, a notification icon is displayed in the notification area. You can open the notification drawer to view the full text of the notification.

    ![](./media/app-service-mobile-xamarin-android-get-started-push/android-notifications.png)

<!-- URLs. -->
[Xamarin.Android quick start]: app-service-mobile-xamarin-android-get-started.md
[Google Cloud Messaging Client Component]: http://components.xamarin.com/view/GCMClient/
[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/
