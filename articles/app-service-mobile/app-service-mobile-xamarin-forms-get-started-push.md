---
title: Add push notifications to your Xamarin.Forms app | Microsoft Docs
description: Learn how to use Azure services to send multi-platform push notifications to your Xamarin.Forms apps.
services: app-service\mobile
documentationcenter: xamarin
author: ysxu
manager: adrianha
editor: ''

ms.assetid: d9b1ba9a-b3f2-4d12-affc-2ee34311538b
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-xamarin
ms.devlang: dotnet
ms.topic: article
ms.date: 10/12/2016
ms.author: yuaxu

---
# Add push notifications to your Xamarin.Forms app
[!INCLUDE [app-service-mobile-selector-get-started-push](../../includes/app-service-mobile-selector-get-started-push.md)]

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

1. In the **Droid** project, right-click the **Components** folder, and click **Get More Components...**. Then search for the **Google Cloud Messaging Client** component and add it to the project. This component supports push notifications for a Xamarin Android project.
2. Open the MainActivity.cs project file, and add the following statement at the top of the file:

        using Gcm.Client;
3. Add the following code to the **OnCreate** method after the call to **LoadApplication**:

        try
        {
            // Check to ensure everything's set up right
            GcmClient.CheckDevice(this);
            GcmClient.CheckManifest(this);

            // Register for push notifications
            System.Diagnostics.Debug.WriteLine("Registering...");
            GcmClient.Register(this, PushHandlerBroadcastReceiver.SENDER_IDS);
        }
        catch (Java.Net.MalformedURLException)
        {
            CreateAndShowDialog("There was an error creating the client. Verify the URL.", "Error");
        }
        catch (Exception e)
        {
            CreateAndShowDialog(e.Message, "Error");
        }
4. Add a new **CreateAndShowDialog** helper method, as follows:

        private void CreateAndShowDialog(String message, String title)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);

            builder.SetMessage (message);
            builder.SetTitle (title);
            builder.Create().Show ();
        }
5. Add the following code to the **MainActivity** class:

        // Create a new instance field for this activity.
        static MainActivity instance = null;

        // Return the current activity instance.
        public static MainActivity CurrentActivity
        {
            get
            {
                return instance;
            }
        }

    This exposes the current **MainActivity** instance, so we can execute on the main UI thread.
6. Initialize the `instance` variable at the beginning of the **OnCreate** method, as follows.

        // Set the current instance of MainActivity.
        instance = this;
7. Add a new class file to the **Droid** project named `GcmService.cs`, and make sure the following **using** statements are present at the top of the file:

        using Android.App;
        using Android.Content;
        using Android.Media;
        using Android.Support.V4.App;
        using Android.Util;
        using Gcm.Client;
        using Microsoft.WindowsAzure.MobileServices;
        using Newtonsoft.Json.Linq;
        using System;
        using System.Collections.Generic;
        using System.Diagnostics;
        using System.Text;
8. Add the following permission requests at the top of the file, after the **using** statements and before the **namespace** declaration.

        [assembly: Permission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
        [assembly: UsesPermission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
        [assembly: UsesPermission(Name = "com.google.android.c2dm.permission.RECEIVE")]
        [assembly: UsesPermission(Name = "android.permission.INTERNET")]
        [assembly: UsesPermission(Name = "android.permission.WAKE_LOCK")]
        //GET_ACCOUNTS is only needed for android versions 4.0.3 and below
        [assembly: UsesPermission(Name = "android.permission.GET_ACCOUNTS")]
9. Add the following class definition to the namespace.

       [BroadcastReceiver(Permission = Gcm.Client.Constants.PERMISSION_GCM_INTENTS)]
       [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_MESSAGE }, Categories = new string[] { "@PACKAGE_NAME@" })]
       [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_REGISTRATION_CALLBACK }, Categories = new string[] { "@PACKAGE_NAME@" })]
       [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_LIBRARY_RETRY }, Categories = new string[] { "@PACKAGE_NAME@" })]
       public class PushHandlerBroadcastReceiver : GcmBroadcastReceiverBase<GcmService>
       {
           public static string[] SENDER_IDS = new string[] { "<PROJECT_NUMBER>" };
       }

   > [!NOTE]
   > Replace **<PROJECT_NUMBER>** with your project number you noted earlier.    
   >
   >
10. Replace the empty **GcmService** class with the following code, which uses the new broadcast receiver:

         [Service]
         public class GcmService : GcmServiceBase
         {
             public static string RegistrationID { get; private set; }

             public GcmService()
                 : base(PushHandlerBroadcastReceiver.SENDER_IDS){}
         }
11. Add the following code to the **GcmService** class. This overrides the **OnRegistered** event handler and implements a **Register** method.

        protected override void OnRegistered(Context context, string registrationId)
        {
            Log.Verbose("PushHandlerBroadcastReceiver", "GCM Registered: " + registrationId);
            RegistrationID = registrationId;

            var push = TodoItemManager.DefaultManager.CurrentClient.GetPush();

            MainActivity.CurrentActivity.RunOnUiThread(() => Register(push, null));
        }

        public async void Register(Microsoft.WindowsAzure.MobileServices.Push push, IEnumerable<string> tags)
        {
            try
            {
                const string templateBodyGCM = "{\"data\":{\"message\":\"$(messageParam)\"}}";

                JObject templates = new JObject();
                templates["genericMessage"] = new JObject
                {
                    {"body", templateBodyGCM}
                };

                await push.RegisterAsync(RegistrationID, templates);
                Log.Info("Push Installation Id", push.InstallationId.ToString());
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
                Debugger.Break();
            }
        }

    Note that this code uses the `messageParam` parameter in the template registration.
12. Add the following code that implements **OnMessage**:

        protected override void OnMessage(Context context, Intent intent)
        {
            Log.Info("PushHandlerBroadcastReceiver", "GCM Message Received!");

            var msg = new StringBuilder();

            if (intent != null && intent.Extras != null)
            {
                foreach (var key in intent.Extras.KeySet())
                    msg.AppendLine(key + "=" + intent.Extras.Get(key).ToString());
            }

            //Store the message
            var prefs = GetSharedPreferences(context.PackageName, FileCreationMode.Private);
            var edit = prefs.Edit();
            edit.PutString("last_msg", msg.ToString());
            edit.Commit();

            string message = intent.Extras.GetString("message");
            if (!string.IsNullOrEmpty(message))
            {
                createNotification("New todo item!", "Todo item: " + message);
                return;
            }

            string msg2 = intent.Extras.GetString("msg");
            if (!string.IsNullOrEmpty(msg2))
            {
                createNotification("New hub message!", msg2);
                return;
            }

            createNotification("Unknown message details", msg.ToString());
        }

        void createNotification(string title, string desc)
        {
            //Create notification
            var notificationManager = GetSystemService(Context.NotificationService) as NotificationManager;

            //Create an intent to show ui
            var uiIntent = new Intent(this, typeof(MainActivity));

            //Use Notification Builder
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this);

            //Create the notification
            //we use the pending intent, passing our ui intent over which will get called
            //when the notification is tapped.
            var notification = builder.SetContentIntent(PendingIntent.GetActivity(this, 0, uiIntent, 0))
                    .SetSmallIcon(Android.Resource.Drawable.SymActionEmail)
                    .SetTicker(title)
                    .SetContentTitle(title)
                    .SetContentText(desc)

                    //Set the notification sound
                    .SetSound(RingtoneManager.GetDefaultUri(RingtoneType.Notification))

                    //Auto cancel will remove the notification once the user touches it
                    .SetAutoCancel(true).Build();

            //Show the notification
            notificationManager.Notify(1, notification);
        }

    This handles incoming notifications and sends them to the notification manager to be displayed.
13. **GcmServiceBase** also requires you to implement the **OnUnRegistered** and **OnError** handler methods, which you can do as follows:

        protected override void OnUnRegistered(Context context, string registrationId)
        {
            Log.Error("PushHandlerBroadcastReceiver", "Unregistered RegisterationId : " + registrationId);
        }

        protected override void OnError(Context context, string errorId)
        {
            Log.Error("PushHandlerBroadcastReceiver", "GCM Error: " + errorId);
        }

Now, you are ready test push notifications in the app running on an Android device or the emulator.

### Test push notifications in your Android app
The first two steps are required only when you're testing on an emulator.

1. Make sure that you are deploying to or debugging on a virtual device that has Google APIs set as the target, as shown below in the Android Virtual Device manager.
2. Add a Google account to the Android device by clicking **Apps** > **Settings** > **Add account**. Then follow the prompts to add an existing Google account to the device, or to create a new one.
3. In Visual Studio or Xamarin Studio, right-click the **Droid** project and click **Set as startup project**.
4. Click **Run** to build the project and start the app on your Android device or emulator.
5. In the app, type a task, and then click the plus (**+**) icon.
6. Verify that a notification is received when an item is added.

## Configure and run the iOS project (optional)
This section is for running the Xamarin iOS project for iOS devices. You can skip this section if you are not working with iOS devices.

[!INCLUDE [Enable Apple Push Notifications](../../includes/enable-apple-push-notifications.md)]

#### Configure the notification hub for APNS
[!INCLUDE [app-service-mobile-apns-configure-push](../../includes/app-service-mobile-apns-configure-push.md)]

Next, you will configure the iOS project setting in Xamarin Studio or Visual Studio.

[!INCLUDE [app-service-mobile-xamarin-ios-configure-project](../../includes/app-service-mobile-xamarin-ios-configure-project.md)]

#### Add push notifications to your iOS app
1. In the **iOS** project, open AppDelegate.cs and add the following statement to the top of the code file.

        using Newtonsoft.Json.Linq;
2. In the **AppDelegate** class, add an override for the **RegisteredForRemoteNotifications** event to register for notifications:

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
3. In **AppDelegate**, also add the following override for the **DidReceiveRemoteNotification** event handler:

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

    This method handles incoming notifications while the app is running.
4. In the **AppDelegate** class, add the following code to the **FinishedLaunching** method:

        // Register for push notifications.
        var settings = UIUserNotificationSettings.GetSettingsForTypes(
            UIUserNotificationType.Alert
            | UIUserNotificationType.Badge
            | UIUserNotificationType.Sound,
            new NSSet());

        UIApplication.SharedApplication.RegisterUserNotificationSettings(settings);
        UIApplication.SharedApplication.RegisterForRemoteNotifications();

    This enables support for remote notifications and requests push registration.

Your app is now updated to support push notifications.

#### Test push notifications in your iOS app
1. Right-click the iOS project, and click **Set as StartUp Project**.
2. Press the **Run** button or **F5** in Visual Studio to build the project and start the app in an iOS device. Then click **OK** to accept push notifications.

   > [!NOTE]
   > You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.
   >
   >
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

        using Newtonsoft.Json.Linq;
        using Microsoft.WindowsAzure.MobileServices;
        using System.Threading.Tasks;
        using Windows.Networking.PushNotifications;
        using <your_TodoItemManager_portable_class_namespace>;

    Replace `<your_TodoItemManager_portable_class_namespace>` with the namespace of your portable project that contains the `TodoItemManager` class.
2. In App.xaml.cs, add the following **InitNotificationsAsync** method:

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

    This method gets the push notification channel, and registers a template to receive template notifications from your notification hub. A template notification that supports *messageParam* will be delivered to this client.
3. In App.xaml.cs, update the **OnLaunched** event handler method definition by adding the `async` modifier. Then add the following line of code at the end of the method:

        await InitNotificationsAsync();

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

* [Diagnose push notification issues](../notification-hubs/notification-hubs-push-notification-fixer.md)  
  There are various reasons why notifications may get dropped or do not end up on devices. This topic shows you how to analyze and figure out the root cause of push notification failures.

You can also continue on to one of the following tutorials:

* [Add authentication to your app ](app-service-mobile-xamarin-forms-get-started-users.md)  
  Learn how to authenticate users of your app with an identity provider.
* [Enable offline sync for your app](app-service-mobile-xamarin-forms-get-started-offline-data.md)  
  Learn how to add offline support for your app by using a Mobile Apps back end. With offline sync, users can interact with a mobile app&mdash;viewing, adding, or modifying data&mdash;even when there is no network connection.

<!-- Images. -->

<!-- URLs. -->
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Xcode]: https://go.microsoft.com/fwLink/?LinkID=266532
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
