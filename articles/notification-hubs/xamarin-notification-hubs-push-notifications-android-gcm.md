---
title: Get started with Notification Hubs for Xamarin.Android apps | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Xamarin Android application.
author: jwhitedev
manager: kpiteira
editor: ''
services: notification-hubs
documentationcenter: xamarin

ms.assetid: 0be600fe-d5f3-43a5-9e5e-3135c9743e54
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin-android
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 12/22/2017
ms.author: jawh

---
# Get started with Notification Hubs for Xamarin.Android apps
[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

## Overview
This tutorial shows you how to use Azure Notification Hubs to send push notifications to a Xamarin.Android application. You'll create a blank Xamarin.Android app that receives push notifications by using Firebase Cloud Messaging (FCM). When you're finished, you'll be able to use your notification hub to broadcast push notifications to all the devices running your app. The finished code is available in the [NotificationHubs app][GitHub] sample.

This tutorial demonstrates the simple broadcast scenario in using Notification Hubs.

## Before you begin
[!INCLUDE [notification-hubs-hero-slug](../../includes/notification-hubs-hero-slug.md)]

The completed code for this tutorial can be found on GitHub [here][GitHub].

## Prerequisites
This tutorial requires the following:

* [Visual Studio with Xamarin] on Windows or [Visual Studio for Mac] on OS X.
* Active Google account

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Xamarin.Android apps.

> [!IMPORTANT]
> To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A9C9624B5&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fpartner-xamarin-notification-hubs-android-get-started%2F).
> 
> 

## Enable Firebase Cloud Messaging
[!INCLUDE [notification-hubs-enable-firebase-cloud-messaging](../../includes/notification-hubs-enable-firebase-cloud-messaging.md)]

## Configure your notification hub
[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

<ol start="6">

<li><p>Choose the <b>Configure</b> tab at the top, enter the <b>API Key</b> value you obtained in the previous section, and then select <b>Save</b>.</p>
</li>
</ol>
&emsp;&emsp;![](./media/notification-hubs-android-get-started/notification-hubs-gcm-api.png)

Your notification hub is configured to work with FCM, and you have the connection strings to both register your app to receive notifications and to send push notifications.

## Connect your app to the notification hub
First, you create a new project. 

1. In Visual Studio, choose **New Solution** > **Android App** and then select **Next**.
   
      ![Visual Studio- Create new Android project][22]

2. Enter your **App Name** and **Identifier**. Choose the **Target Platforms** you want to support and then choose **Next** and **Create**.
   
      ![Visual Studio- Android app configuration][23]

    This creates a new Android project.

3. Open the project properties by right-clicking your new project in the Solution view and choosing **Options**. Select the **Android Application** item in the **Build** section.
   
    Ensure that the first letter of your **Package name** is lowercase.
   
   > [!IMPORTANT]
   > The first letter of the package name must be lowercase. Otherwise, you will receive application manifest errors when you register your app for push notifications below.
   > 
   > 
   
      ![Visual Studio- Android project options][24]
4. Optionally, set the **Minimum Android version** to another API Level.
5. Optionally, set the **Target Android version** to another API version that you want to target (must be API level 8 or higher).
6. Choose **OK** and close the Project Options dialog.

### Add the required packages to your project

1. Right-click your project and select **Add** > **Add NuGet Packages**
2. Search for **Xamarin.Azure.NotificationHubs.Android** and add it to the project.
3. Search for **Xamarin.Firebase.Messaging** and add it to the project.

### Set up notification hubs in your project

#### Registering with Firebase Cloud Messaging

Open the **AndroidManifest.xml** file and insert the following `<receiver>` elements into the `<application>` element:

        <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdInternalReceiver" android:exported="false" />
        <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:exported="true" android:permission="com.google.android.c2dm.permission.SEND">
          <intent-filter>
            <action android:name="com.google.android.c2dm.intent.RECEIVE" />
            <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
            <category android:name="${applicationId}" />
          </intent-filter>
        </receiver>

1. Gather the following information for your Android app and notification hub:
   
   * **Listen connection string**: On the dashboard in the [Azure portal], choose **View connection strings**. Copy the *DefaultListenSharedAccessSignature* connection string for this value.
   * **Hub name**: This is the name of your hub from the [Azure portal]. For example, *mynotificationhub2*.
     
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

4. Add an instance variable to **MainActivity.cs** that will be used to show an alert dialog when the app is running:
   
    ```csharp
        public const string TAG = "MainActivity";
    ```

5. Add the following code to `OnCreate` in **MainActivity.cs** after `base.OnCreate(savedInstanceState)`:

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
    ```

6. Right-click your project and add the `google-services.json` that you downloaded from your Firebase project earlier. Right-click the added file and set the build action to `GoogleServicesJson`

    ![Visual Studio- Configure google-services.json][25]

7. Create a new class, **MyFirebaseIIDService**.

8. Add the following using statements to **MyFirebaseIIDService.cs**:
   
    ```csharp
        using System;
        using Android.App;
        using Firebase.Iid;
        using Android.Util;
        using WindowsAzure.Messaging;
        using System.Collections.Generic;
    ```

9. In **MyFirebaseIIDService.cs**, add the following above the **class** declaration, and have your class inherit from **FirebaseInstanceIdService**:
   
    ```csharp
        [Service]
        [IntentFilter(new[] { "com.google.firebase.INSTANCE_ID_EVENT" })]
        public class MyFirebaseIIDService : FirebaseInstanceIdService
    ```

10. In **MyFirebaseIIDService.cs**, add the following code:
   
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

11. Create another new class for your project, name it **MyFirebaseMessagingService**.

12. Add the following using statements to **MyFirebaseMessagingService.cs**.
    
    ```csharp
        using System;
        using System.Linq;
        using Android;
        using Android.App;
        using Android.Content;
        using Android.Util;
        using Firebase.Messaging;
    ```

13. Add the following above your class declaration, and have your class inherit from **FirebaseMessagingService**:
    
    ```csharp
        [Service]
        [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
        public class MyFirebaseMessagingService : FirebaseMessagingService
    ```
    
14. Add the following code to **MyFirebaseMessagingService.cs**:
    
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

            var notificationBuilder = new Notification.Builder(this)
                        .SetContentTitle("FCM Message")
                        .SetSmallIcon(Resource.Drawable.ic_launcher)
                        .SetContentText(messageBody)
                        .SetAutoCancel(true)
                        .SetContentIntent(pendingIntent);

            var notificationManager = NotificationManager.FromContext(this);

            notificationManager.Notify(0, notificationBuilder.Build());
        }
    ```

15. Run your app on your device or loaded emulator

## Send notifications from the portal
You can test receiving notifications in your app with the *Test Send* option in the [Azure portal]. This sends a test push notification to your device.

![Azure portal - Test Send][30]

Push notifications are normally sent in a back-end service like Mobile Services or ASP.NET through a compatible library. If a library is not available for your back-end you can also use the REST API directly to send notification messages.

Here is a list of some other tutorials that you may want to review for sending notifications:

* ASP.NET: See [Use Notification Hubs to push notifications to users].
* Azure Notification Hubs Java SDK: See [How to use Notification Hubs from Java](notification-hubs-java-push-notification-tutorial.md) for sending notifications from Java. This has been tested in Eclipse for Android Development.
* PHP: See [How to use Notification Hubs from PHP](notification-hubs-php-push-notification-tutorial.md).

## Next steps
In this simple example, you broadcasted notifications to all your Android devices. In order to target specific users, refer to the tutorial [Use Notification Hubs to push notifications to users]. If you want to segment your users by interest groups, you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance] and in the [Notification Hubs How-To for Android].

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
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-xamarin-android/#create-new-service
[JavaScript and HTML]: /develop/mobile/tutorials/get-started-with-push-js
[Visual Studio with Xamarin]: https://docs.microsoft.com/visualstudio/install/install-visual-studio
[Visual Studio for Mac]: https://www.visualstudio.com/vs/visual-studio-mac/

[Azure portal]: https://portal.azure.com/
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for Android]: http://msdn.microsoft.com/library/dn282661.aspx

[Use Notification Hubs to push notifications to users]: /manage/services/notification-hubs/notify-users-aspnet
[Use Notification Hubs to send breaking news]: /manage/services/notification-hubs/breaking-news-dotnet
[GitHub]: https://github.com/Azure/azure-notificationhubs-samples/tree/master/dotnet/Xamarin/GetStartedXamarinAndroid
