---
title: Add push notifications to your Xamarin.Forms app | Microsoft Docs
description: Learn how to use Azure services to send multi-platform push notifications to your Xamarin.Forms apps.
services: app-service\mobile
documentationcenter: xamarin
author: elamalani
manager: crdun
editor: ''

ms.assetid: d9b1ba9a-b3f2-4d12-affc-2ee34311538b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Add push notifications to your Xamarin.Forms app

[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-xamarin-forms-get-started-push) today.
>

## Overview

In this tutorial, you add push notifications to all the projects that resulted from the [Xamarin.Forms quick start](app-service-mobile-xamarin-forms-get-started.md). This means that a push notification is sent to all cross-platform clients every time a record is inserted.

If you do not use the downloaded quick start server project, you will need the push notification extension package. For more information, see [Work with the .NET backend server SDK for Azure Mobile Apps](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md).

## Prerequisites

For iOS, you will need an [Apple Developer Program membership](https://developer.apple.com/programs/ios/) and a physical iOS device. The [iOS simulator does not support push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/iOS_Simulator_Guide/TestingontheiOSSimulator.html).

## <a name="configure-hub"></a>Configure a notification hub

[!INCLUDE [app-service-mobile-configure-notification-hub](../../includes/app-service-mobile-configure-notification-hub.md)]

## Update the server project to send push notifications

[!INCLUDE [app-service-mobile-update-server-project-for-push-template](../../includes/app-service-mobile-update-server-project-for-push-template.md)]

## Configure and run the Android project (optional)

Complete this section to enable push notifications for the Xamarin.Forms Droid project for Android.

### Enable Firebase Cloud Messaging (FCM)

[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging.md)]

### Configure the Mobile Apps back end to send push requests by using FCM

[!INCLUDE [app-service-mobile-android-configure-push](../../includes/app-service-mobile-android-configure-push.md)]

### Add push notifications to the Android project

With the back end configured with FCM, you can add components and codes to the client to register with FCM. You can also register for push notifications with Azure Notification Hubs through the Mobile Apps back end, and receive notifications.

1. In the **Droid** project, right-click **References > Manage NuGet Packages ...**.
1. In the NuGet Package Manager window, search for the **Xamarin.Firebase.Messaging** package and add it to the project.
1. In the project properties for the **Droid** project, set the app to compile using Android version 7.0 or higher.
1. Add the **google-services.json** file, downloaded from the Firebase console, to the root of the **Droid** project and set its build action to **GoogleServicesJson**. For more information, see [Add the Google Services JSON File](https://developer.xamarin.com/guides/android/data-and-cloud-services/google-messaging/remote-notifications-with-fcm/#Add_the_Google_Services_JSON_File).

#### Registering with Firebase Cloud Messaging

1. Open the **AndroidManifest.xml** file and insert the following `<receiver>` elements into the `<application>` element:

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

#### Implementing the Firebase Instance ID Service

1. Add a new class to the **Droid** project named `FirebaseRegistrationService`, and make sure that the following `using` statements are present at the top of the file:

    ```csharp
    using System.Threading.Tasks;
    using Android.App;
    using Android.Util;
    using Firebase.Iid;
    using Microsoft.WindowsAzure.MobileServices;
    ```

1. Replace the empty `FirebaseRegistrationService` class with the following code:

    ```csharp
    [Service]
    [IntentFilter(new[] { "com.google.firebase.INSTANCE_ID_EVENT" })]
    public class FirebaseRegistrationService : FirebaseInstanceIdService
    {
        const string TAG = "FirebaseRegistrationService";

        public override void OnTokenRefresh()
        {
            var refreshedToken = FirebaseInstanceId.Instance.Token;
            Log.Debug(TAG, "Refreshed token: " + refreshedToken);
            SendRegistrationTokenToAzureNotificationHub(refreshedToken);
        }

        void SendRegistrationTokenToAzureNotificationHub(string token)
        {
            // Update notification hub registration
            Task.Run(async () =>
            {
                await AzureNotificationHubService.RegisterAsync(TodoItemManager.DefaultManager.CurrentClient.GetPush(), token);
            });
        }
    }
    ```

    The `FirebaseRegistrationService` class is responsible for generating security tokens that authorize the application to access FCM. The `OnTokenRefresh` method is invoked when the application receives a registration token from FCM. The method retrieves the token from the `FirebaseInstanceId.Instance.Token` property, which is asynchronously updated by FCM. The `OnTokenRefresh` method is infrequently invoked, because the token is only updated when the application is installed or uninstalled, when the user deletes application data, when the application erases the Instance ID, or when the security of the token has been compromised. In addition, the FCM Instance ID service will request that the application refreshes its token periodically, typically every 6 months.

    The `OnTokenRefresh` method also invokes the `SendRegistrationTokenToAzureNotificationHub` method, which is used to associate the user's registration token with the Azure Notification Hub.

#### Registering with the Azure Notification Hub

1. Add a new class to the **Droid** project named `AzureNotificationHubService`, and make sure that the following `using` statements are present at the top of the file:

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Android.Util;
    using Microsoft.WindowsAzure.MobileServices;
    using Newtonsoft.Json.Linq;
    ```

1. Replace the empty `AzureNotificationHubService` class with the following code:

    ```csharp
    public class AzureNotificationHubService
    {
        const string TAG = "AzureNotificationHubService";

        public static async Task RegisterAsync(Push push, string token)
        {
            try
            {
                const string templateBody = "{\"data\":{\"message\":\"$(messageParam)\"}}";
                JObject templates = new JObject();
                templates["genericMessage"] = new JObject
                {
                    {"body", templateBody}
                };

                await push.RegisterAsync(token, templates);
                Log.Info("Push Installation Id: ", push.InstallationId.ToString());
            }
            catch (Exception ex)
            {
                Log.Error(TAG, "Could not register with Notification Hub: " + ex.Message);
            }
        }
    }
    ```

    The `RegisterAsync` method creates a simple notification message template as JSON, and registers to receive template notifications from the notification hub, using the Firebase registration token. This ensures that any notifications sent from the Azure Notification Hub will target the device represented by the registration token.

#### Displaying the Contents of a Push Notification

1. Add a new class to the **Droid** project named `FirebaseNotificationService`, and make sure that the following `using` statements are present at the top of the file:

    ```csharp
    using Android.App;
    using Android.Content;
    using Android.Media;
    using Android.Support.V7.App;
    using Android.Util;
    using Firebase.Messaging;
    ```

1. Replace the empty `FirebaseNotificationService` class with the following code:

    ```csharp
    [Service]
    [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
    public class FirebaseNotificationService : FirebaseMessagingService
    {
        const string TAG = "FirebaseNotificationService";

        public override void OnMessageReceived(RemoteMessage message)
        {
            Log.Debug(TAG, "From: " + message.From);

            // Pull message body out of the template
            var messageBody = message.Data["message"];
            if (string.IsNullOrWhiteSpace(messageBody))
                return;

            Log.Debug(TAG, "Notification message body: " + messageBody);
            SendNotification(messageBody);
        }

        void SendNotification(string messageBody)
        {
            var intent = new Intent(this, typeof(MainActivity));
            intent.AddFlags(ActivityFlags.ClearTop);
            var pendingIntent = PendingIntent.GetActivity(this, 0, intent, PendingIntentFlags.OneShot);

            var notificationBuilder = new NotificationCompat.Builder(this)
                .SetSmallIcon(Resource.Drawable.ic_stat_ic_notification)
                .SetContentTitle("New Todo Item")
                .SetContentText(messageBody)
                .SetContentIntent(pendingIntent)
                .SetSound(RingtoneManager.GetDefaultUri(RingtoneType.Notification))
                .SetAutoCancel(true);

            var notificationManager = NotificationManager.FromContext(this);
            notificationManager.Notify(0, notificationBuilder.Build());
        }
    }
    ```

    The `OnMessageReceived` method, which is invoked when an application receives a notification from FCM, extracts the message content, and calls the `SendNotification` method. This method converts the message content into a local notification that's launched while the application is running, with the notification appearing in the notification area.

Now, you are ready test push notifications in the app running on an Android device or the emulator.

### Test push notifications in your Android app

The first two steps are required only when you're testing on an emulator.

1. Make sure that you are deploying to or debugging on a device or emulator that is configured with Google Play Services. This can be verified by checking that the **Play** apps are installed on the device or emulator.
2. Add a Google account to the Android device by clicking **Apps** > **Settings** > **Add account**. Then follow the prompts to add an existing Google account to the device, or to create a new one.
3. In Visual Studio or Xamarin Studio, right-click the **Droid** project and click **Set as startup project**.
4. Click **Run** to build the project and start the app on your Android device or emulator.
5. In the app, type a task, and then click the plus (**+**) icon.
6. Verify that a notification is received when an item is added.

## Configure and run the iOS project (optional)

This section is for running the Xamarin iOS project for iOS devices. You can skip this section if you are not working with iOS devices.

[!INCLUDE [Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

#### Configure the notification hub for APNS

[!INCLUDE [app-service-mobile-apns-configure-push](../../includes/app-service-mobile-apns-configure-push.md)]

Next, you will configure the iOS project setting in Xamarin Studio or Visual Studio.

[!INCLUDE [app-service-mobile-xamarin-ios-configure-project](../../includes/app-service-mobile-xamarin-ios-configure-project.md)]

#### Add push notifications to your iOS app

1. In the **iOS** project, open AppDelegate.cs and add the following statement to the top of the code file.

    ```csharp
    using Newtonsoft.Json.Linq;
    ```

2. In the **AppDelegate** class, add an override for the **RegisteredForRemoteNotifications** event to register for notifications:

    ```csharp
    public override void RegisteredForRemoteNotifications(UIApplication application,
        NSData deviceToken)
    {
        const string templateBodyAPNS = "{\"aps\":{\"alert\":\"$(messageParam)\"}}";

        JObject templates = new JObject();
        templates["genericMessage"] = new JObject
            {
                {"body", templateBodyAPNS}
            };

        // Register for push with your mobile app
        Push push = TodoItemManager.DefaultManager.CurrentClient.GetPush();
        push.RegisterAsync(deviceToken, templates);
    }
    ```

3. In **AppDelegate**, also add the following override for the **DidReceiveRemoteNotification** event handler:

    ```csharp
    public override void DidReceiveRemoteNotification(UIApplication application,
        NSDictionary userInfo, Action<UIBackgroundFetchResult> completionHandler)
    {
        NSDictionary aps = userInfo.ObjectForKey(new NSString("aps")) as NSDictionary;

        string alert = string.Empty;
        if (aps.ContainsKey(new NSString("alert")))
            alert = (aps[new NSString("alert")] as NSString).ToString();

        //show alert
        if (!string.IsNullOrEmpty(alert))
        {
            UIAlertView avAlert = new UIAlertView("Notification", alert, null, "OK", null);
            avAlert.Show();
        }
    }
    ```

    This method handles incoming notifications while the app is running.

4. In the **AppDelegate** class, add the following code to the **FinishedLaunching** method:

    ```csharp
    // Register for push notifications.
    var settings = UIUserNotificationSettings.GetSettingsForTypes(
        UIUserNotificationType.Alert
        | UIUserNotificationType.Badge
        | UIUserNotificationType.Sound,
        new NSSet());

    UIApplication.SharedApplication.RegisterUserNotificationSettings(settings);
    UIApplication.SharedApplication.RegisterForRemoteNotifications();
    ```

    This enables support for remote notifications and requests push registration.

Your app is now updated to support push notifications.

#### Test push notifications in your iOS app

1. Right-click the iOS project, and click **Set as StartUp Project**.
2. Press the **Run** button or **F5** in Visual Studio to build the project and start the app in an iOS device. Then click **OK** to accept push notifications.

   > [!NOTE]
   > You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.

3. In the app, type a task, and then click the plus (**+**) icon.
4. Verify that a notification is received, and then click **OK** to dismiss the notification.

## Configure and run Windows projects (optional)

This section is for running the Xamarin.Forms WinApp and WinPhone81 projects for Windows devices. These steps also support Universal Windows Platform (UWP) projects. You can skip this section if you are not working with Windows devices.

#### Register your Windows app for push notifications with Windows Notification Service (WNS)

[!INCLUDE [app-service-mobile-register-wns](../../includes/app-service-mobile-register-wns.md)]

#### Configure the notification hub for WNS

[!INCLUDE [app-service-mobile-configure-wns](../../includes/app-service-mobile-configure-wns.md)]

#### Add push notifications to your Windows app

1. In Visual Studio, open **App.xaml.cs** in a Windows project, and add the following statements.

    ```csharp
    using Newtonsoft.Json.Linq;
    using Microsoft.WindowsAzure.MobileServices;
    using System.Threading.Tasks;
    using Windows.Networking.PushNotifications;
    using <your_TodoItemManager_portable_class_namespace>;
    ```

    Replace `<your_TodoItemManager_portable_class_namespace>` with the namespace of your portable project that contains the `TodoItemManager` class.

2. In App.xaml.cs, add the following **InitNotificationsAsync** method:

    ```csharp
    private async Task InitNotificationsAsync()
    {
        var channel = await PushNotificationChannelManager
            .CreatePushNotificationChannelForApplicationAsync();

        const string templateBodyWNS =
            "<toast><visual><binding template=\"ToastText01\"><text id=\"1\">$(messageParam)</text></binding></visual></toast>";

        JObject headers = new JObject();
        headers["X-WNS-Type"] = "wns/toast";

        JObject templates = new JObject();
        templates["genericMessage"] = new JObject
        {
            {"body", templateBodyWNS},
            {"headers", headers} // Needed for WNS.
        };

        await TodoItemManager.DefaultManager.CurrentClient.GetPush()
            .RegisterAsync(channel.Uri, templates);
    }
    ```

    This method gets the push notification channel, and registers a template to receive template notifications from your notification hub. A template notification that supports *messageParam* will be delivered to this client.

3. In App.xaml.cs, update the **OnLaunched** event handler method definition by adding the `async` modifier. Then add the following line of code at the end of the method:

    ```csharp
    await InitNotificationsAsync();
    ```

    This ensures that the push notification registration is created or refreshed every time the app is launched. It's important to do this to guarantee that the WNS push channel is always active.  

4. In Solution Explorer for Visual Studio, open the **Package.appxmanifest** file, and set **Toast Capable** to **Yes** under **Notifications**.
5. Build the app and verify you have no errors. Your client app should now register for the template notifications from the Mobile Apps back end. Repeat this section for every Windows project in your solution.

#### Test push notifications in your Windows app

1. In Visual Studio, right-click a Windows project, and click **Set as startup project**.
2. Press the **Run** button to build the project and start the app.
3. In the app, type a name for a new todoitem, and then click the plus (**+**) icon to add it.
4. Verify that a notification is received when the item is added.

## Next steps

You can learn more about push notifications:

* [Sending Push Notifications from Azure Mobile Apps](https://developer.xamarin.com/guides/xamarin-forms/cloud-services/push-notifications/azure/)
* [Firebase Cloud Messaging](https://developer.xamarin.com/guides/android/data-and-cloud-services/google-messaging/firebase-cloud-messaging/)
* [Remote Notifications with Firebase Cloud Messaging](https://developer.xamarin.com/guides/android/data-and-cloud-services/google-messaging/remote-notifications-with-fcm/)
* [Diagnose push notification issues](../notification-hubs/notification-hubs-push-notification-fixer.md)  
  There are various reasons why notifications may get dropped or do not end up on devices. This topic shows you how to analyze and figure out the root cause of push notification failures.

You can also continue on to one of the following tutorials:

* [Add authentication to your app](app-service-mobile-xamarin-forms-get-started-users.md)  
  Learn how to authenticate users of your app with an identity provider.
* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)  
  Learn how to add offline support for your app by using a Mobile Apps back end. With offline sync, users can interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- Images. -->

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532
[apns object]: https://go.microsoft.com/fwlink/p/?LinkId=272333
