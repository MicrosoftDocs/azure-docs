---
title: Push notifications to Xamarin.Android apps using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Xamarin Android application.
author: jwargo
manager: patniko
editor: spelluru
services: notification-hubs
documentationcenter: xamarin

ms.assetid: 0be600fe-d5f3-43a5-9e5e-3135c9743e54
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-android
ms.devlang: dotnet
ms.topic: tutorial
ms.custom: mvc
ms.date: 05/01/2019
ms.author: jowargo
---

# Tutorial: Push notifications to Xamarin.Android apps using Azure Notification Hubs

[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

## Overview

This tutorial shows you how to use Azure Notification Hubs to send push notifications to a Xamarin.Android application. You create a blank Xamarin.Android app that receives push notifications by using Firebase Cloud Messaging (FCM). You use your notification hub to broadcast push notifications to all the devices running your app. The finished code is available in the [NotificationHubs app](https://github.com/Azure/azure-notificationhubs-dotnet/tree/master/Samples/Xamarin/GetStartedXamarinAndroid) sample.

In this tutorial, you take the following steps:

> [!div class="checklist"]
> * Create a Firebase project and enable Firebase Cloud Messaging
> * Create a notification hub
> * Create a Xamarin.Android app and connect it to the notification hub
> * Send test notifications from the Azure portal

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Visual Studio with Xamarin] on Windows or [Visual Studio for Mac] on OS X.
* Active Google account

## Create a Firebase project and enable Firebase Cloud Messaging

[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging-xamarin.md)]

## Create a notification hub

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

### Configure GCM settings for the notification hub

1. Select **Google (GCM)** in the **NOTIFICATION SETTINGS** section.
2. Enter the **Legacy server key** you noted down from the Google Firebase Console.
3. Select **Save** on the toolbar.

    ![](./media/notification-hubs-android-get-started/notification-hubs-gcm-api.png)

Your notification hub is configured to work with FCM, and you have the connection strings to both register your app to receive notifications and to send push notifications.

## Create a Xamarin.Android app and connect it to notification hub

### Create Visual Studio project and add NuGet packages

1. In Visual Studio, open the **File** menu, select **New**, and then select **Project**. In the **New Project** window, do these steps:
    1. Expand **Installed**, **Visual C#**, and then click **Android**.
    2. Select **Android App (Xamarin)** from the list.
    3. Enter a **name** for the project.
    4. Select a **location** for the project.
    5. Select **OK**

        ![New Project dialog](./media/partner-xamarin-notification-hubs-android-get-started/new-project-dialog-new.png)
2. On the **New Android App** dialog box, select **Blank App**, and select **OK**.

    ![New Project dialog](./media/partner-xamarin-notification-hubs-android-get-started/new-android-app-dialog.png)
3. In the **Solution Explorer** window, expand **Properties**, and click **AndroidManifest.xml**. Update the package name to match the package name you entered when adding Firebase Cloud Messaging to your project in the Google Firebase Console.

    ![Package name in GCM](./media/partner-xamarin-notification-hubs-android-get-started/package-name-gcm.png)
4. Right-click your project, and select **Manage NuGet Packages...**.
5. Select the **Browse** tab. Search for **Xamarin.GooglePlayServices.Base**. Select **Xamarin.GooglePlayServices.Base** in the result list. Then, select **Install**.

    ![Google Play Services NuGet](./media/partner-xamarin-notification-hubs-android-get-started/google-play-services-nuget.png)
6. In the **NuGet Package Manager** window, search for **Xamarin.Firebase.Messaging**. Select **Xamarin.Firebase.Messaging** in the result list. Then, select **Install**.
7. Now, search for **Xamarin.Azure.NotificationHubs.Android**. Select **Xamarin.Azure.NotificationHubs.Android** in the result list. Then, select **Install**.

### Add the Google Services JSON File

1. Copy the `google-services.json` file that you downloaded from the Google Firebase Console to the project folder.
2. Add `google-services.json` to the project.
3. Select `google-services.json` in the **Solution Explorer** window.
4. In the **Properties** pane, set the Build Action to **GoogleServicesJson**. If you don't see **GoogleServicesJson**, close Visual Studio, relaunch it, reopen the project, and retry.

    ![GoogleServicesJson build action](./media/partner-xamarin-notification-hubs-android-get-started/google-services-json-build-action.png)

### Set up notification hubs in your project

#### Registering with Firebase Cloud Messaging

1. Open the `AndroidManifest.xml` file and insert the following `<receiver>` elements into the `<application>` element:

    ```xml
    <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdInternalReceiver" android:exported="false" />
    <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:exported="true" android:permission="com.google.android.c2dm.permission.SEND">
        <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
        <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
        <category android:name="${applicationId}" />
        </intent-filter>
    </receiver>
    ```

2. Add the following statements **before the application** element.

    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.GET_ACCOUNTS"/>
    ```

3. Gather the following information for your Android app and notification hub:

   * **Listen connection string**: On the dashboard in the [Azure portal], choose **View connection strings**. Copy the `DefaultListenSharedAccessSignature` connection string for this value.
   * **Hub name**: Name of your hub from the [Azure portal]. For example, *mynotificationhub2*.
4. In the **Solution Explorer** window, right-click your **project**, select **Add**, and then select **Class**.
5. Create a `Constants.cs` class for your Xamarin project and define the following constant values in the class. Replace the placeholders with your values.

    ```csharp
    public static class Constants
    {
        public const string ListenConnectionString = "<Listen connection string>";
        public const string NotificationHubName = "<hub name>";
    }
    ```

6. Add the following using statements to `MainActivity.cs`:

    ```csharp
    using Android.Util;
    using Android.Gms.Common;
    ```

7. Add the following properties to the MainActivity class. The TAG variable will be used to show an alert dialog when the app is running:

    ```csharp
    public const string TAG = "MainActivity";
    internal static readonly string CHANNEL_ID = "my_notification_channel";
    ```

8. Add the following method to the MainActivity class. It checks whether **Google Play Services** are available on the device.

    ```csharp
    public bool IsPlayServicesAvailable()
    {
        int resultCode = GoogleApiAvailability.Instance.IsGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.Success)
        {
            if (GoogleApiAvailability.Instance.IsUserResolvableError(resultCode))
                Log.Debug(TAG, GoogleApiAvailability.Instance.GetErrorString(resultCode));
            else
            {
                Log.Debug(TAG, "This device is not supported");
                Finish();
            }
            return false;
        }

        Log.Debug(TAG, "Google Play Services is available.");
        return true;
    }
    ```

9. Add the following method to the MainActivity class that creates a notification channel.

    ```csharp
    private void CreateNotificationChannel()
    {
        if (Build.VERSION.SdkInt < BuildVersionCodes.O)
        {
            // Notification channels are new in API 26 (and not a part of the
            // support library). There is no need to create a notification
            // channel on older versions of Android.
            return;
        }

        var channelName = CHANNEL_ID;
        var channelDescription = string.Empty;
        var channel = new NotificationChannel(CHANNEL_ID, channelName, NotificationImportance.Default)
        {
            Description = channelDescription
        };

        var notificationManager = (NotificationManager)GetSystemService(NotificationService);
        notificationManager.CreateNotificationChannel(channel);
    }
    ```

10. In `MainActivity.cs`, add the following code to `OnCreate` after `base.OnCreate(savedInstanceState)`:

    ```csharp
    if (Intent.Extras != null)
    {
        foreach (var key in Intent.Extras.KeySet())
        {
            if(key!=null)
            {
                var value = Intent.Extras.GetString(key);
                Log.Debug(TAG, "Key: {0} Value: {1}", key, value);
            }
        }
    }

    IsPlayServicesAvailable();
    CreateNotificationChannel();
    ```

11. Create a new class, `MyFirebaseIIDService` like you created the `Constants` class.
12. Add the following using statements to `MyFirebaseIIDService.cs`:

    ```csharp
    using Android.Util;
    using WindowsAzure.Messaging;
    using Firebase.Iid;
    ```

13. In `MyFirebaseIIDService.cs`, add the following `class` declaration, and have your class inherit from `FirebaseInstanceIdService`:

    ```csharp
    [Service]
    [IntentFilter(new[] { "com.google.firebase.INSTANCE_ID_EVENT" })]
    public class MyFirebaseIIDService : FirebaseInstanceIdService
    ```

14. In `MyFirebaseIIDService.cs`, add the following code:

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

15. Create another new class for your project, name it `MyFirebaseMessagingService`.
16. Add the following using statements to `MyFirebaseMessagingService.cs`.

    ```csharp
    using Android.Util;
    using Firebase.Messaging;
    using Android.Support.V4.App;
    using Build = Android.OS.Build;
    ```

17. Add the following above your class declaration, and have your class inherit from `FirebaseMessagingService`:

    ```csharp
    [Service]
    [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
    public class MyFirebaseMessagingService : FirebaseMessagingService
    ```

18. Add the following code to `MyFirebaseMessagingService.cs`:

    ```csharp
    const string TAG = "MyFirebaseMsgService";
    public override void OnMessageReceived(RemoteMessage message)
    {
        Log.Debug(TAG, "From: " + message.From);
        if(message.GetNotification()!= null)
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
        var intent = new Intent(this, typeof(MainActivity));
        intent.AddFlags(ActivityFlags.ClearTop);
        var pendingIntent = PendingIntent.GetActivity(this, 0, intent, PendingIntentFlags.OneShot);

        var notificationBuilder = new NotificationCompat.Builder(this)
                    .SetContentTitle("FCM Message")
                    .SetSmallIcon(Resource.Drawable.ic_launcher)
                    .SetContentText(messageBody)
                    .SetAutoCancel(true)
                    .SetShowWhen(false)
                    .SetContentIntent(pendingIntent);

        if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
        {
            notificationBuilder.SetChannelId(MainActivity.CHANNEL_ID);
        }

        var notificationManager = NotificationManager.FromContext(this);

        notificationManager.Notify(0, notificationBuilder.Build());
    }
    ```

19. **Build** your project.
20. **Run** your app on your device or loaded emulator

## Send test notification from the Azure portal

You can test receiving notifications in your app with the **Test Send** option in the [Azure portal]. It sends a test push notification to your device.

![Azure portal - Test Send](media/partner-xamarin-notification-hubs-android-get-started/send-test-notification.png)

Push notifications are normally sent in a back-end service like Mobile Services or ASP.NET through a compatible library. If a library is not available for your back-end, you can also use the REST API directly to send notification messages.

## Next steps

In this tutorial, you sent broadcast notifications to all your Android devices registered with the backend. To learn how to push notifications to specific Android devices, advance to the following tutorial:

> [!div class="nextstepaction"]
>[Push notifications to specific devices](push-notifications-android-specific-devices-firebase-cloud-messaging.md)

<!-- Anchors. -->
[Enable Google Cloud Messaging]: #register
[Configure your Notification Hub]: #configure-hub
[Connecting your app to the Notification Hub]: #connecting-app
[Run your app with the emulator]: #run-app
[Send notifications from your back-end]: #send
[Next steps]:#next-steps

<!-- Images. -->
[11]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-configure-android.png
[13]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-xamarin-android-app1.png
[15]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-xamarin-android-app3.png
[18]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-android-app7.png
[19]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-android-app8.png
[20]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-console-app.png
[21]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-android-toast.png
[22]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-xamarin-android-project1.png
[23]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-create-xamarin-android-project2.png
[24]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-xamarin-android-app-options.png
[25]: ./media/partner-xamarin-notification-hubs-android-get-started/notification-hub-google-services-json.png
[30]: ./media/notification-hubs-android-get-started/notification-hubs-test-send.png

<!-- URLs. -->
[Submit an app page]: https://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: https://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: https://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-xamarin-android/#create-new-service
[JavaScript and HTML]: /develop/mobile/tutorials/get-started-with-push-js
[Visual Studio with Xamarin]: https://docs.microsoft.com/visualstudio/install/install-visual-studio
[Visual Studio for Mac]: https://www.visualstudio.com/vs/visual-studio-mac/
[Azure portal]: https://portal.azure.com/
[wns object]: https://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: https://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for Android]: https://msdn.microsoft.com/library/dn282661.aspx
[Use Notification Hubs to push notifications to users]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Use Notification Hubs to send breaking news]: notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md
[GitHub]: https://github.com/Azure/azure-notificationhubs-android
