---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Validate package name and permissions

1. In **PushDemo.Android**, open the **Project Options** then **Android Application** from the **Build** section.

1. Check that the **Package name** matches the value you used in the [Firebase Console](https://console.firebase.google.com) **PushDemo** project. The **Package name** was in the format ``com.<organization>.pushdemo``.

1. Set the **Minimum Android Version** to **Android 8.0 (API level 26)** and the **Target Android Version** to the latest **API level**.

    > [!NOTE]
    > Only those devices running **API level 26 and above** are supported for the purposes of this tutorial however you can extend it to support devices running older versions.

1. Ensure the **INTERNET** and **READ_PHONE_STATE** permissions are enabled under **Required permissions**.

1. Click **OK**

### Add the Xamarin Google Play Services Base and Xamarin.Firebase.Messaging packages

1. In **PushDemo.Android**, **Control** + **Click** on the **Packages** folder, then choose **Manage NuGet Packages...**.

1. Search for **Xamarin.GooglePlayServices.Base** (not **Basement**) and ensure it's checked.

1. Search for **Xamarin.Firebase.Messaging** and ensure it's checked.

1. Click **Add Packages**, then click **Accept** when prompted to accept the **license terms**.

### Add the Google Services JSON file

1. **Control** + **Click** on the `PushDemo.Android` project, then choose **Existing File...** from the **Add** menu.

1. Choose the *google-services.json* file you downloaded earlier when you set up the **PushDemo** project in the [Firebase Console](https://console.firebase.google.com) then click **Open**.

1. When prompted, choose to **Copy the file to the directory**.

1. **Control** + **Click** on the *google-services.json* file from within the `PushDemo.Android` project, then ensure **GoogleServicesJson** is set as the **Build Action**.

### Handle push notifications for Android

1. **Control** + **Click** on the `PushDemo.Android` project, choose **New Folder** from the **Add** menu, then click **Add** using *Services* as the **Folder Name**.

1. **Control** + **Click** on the **Services** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *DeviceInstallationService.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    using System;
    using Android.App;
    using Android.Gms.Common;
    using PushDemo.Models;
    using PushDemo.Services;
    using static Android.Provider.Settings;

    namespace PushDemo.Droid.Services
    {
        public class DeviceInstallationService : IDeviceInstallationService
        {
            public string Token { get; set; }

            public bool NotificationsSupported
                => GoogleApiAvailability.Instance
                    .IsGooglePlayServicesAvailable(Application.Context) == ConnectionResult.Success;

            public string GetDeviceId()
                => Secure.GetString(Application.Context.ContentResolver, Secure.AndroidId);

            public DeviceInstallation GetDeviceInstallation(params string[] tags)
            {
                if (!NotificationsSupported)
                    throw new Exception(GetPlayServicesError());

                if (string.isNullOrWhitespace(Token))
                    throw new Exception("Unable to resolve token for FCM");

                var installation = new DeviceInstallation
                {
                    InstallationId = GetDeviceId(),
                    Platform = "fcm",
                    PushChannel = Token
                };

                installation.Tags.AddRange(tags);

                return installation;
            }

            string GetPlayServicesError()
            {
                int resultCode = GoogleApiAvailability.Instance.IsGooglePlayServicesAvailable(Application.Context);

                if (resultCode != ConnectionResult.Success)
                    return GoogleApiAvailability.Instance.IsUserResolvableError(resultCode) ?
                               GoogleApiAvailability.Instance.GetErrorString(resultCode) :
                               "This device is not supported";

                return "An error occurred preventing the use of push notifications";
            }
        }
    }
    ```

    > [!NOTE]
    > This class provides a unique ID (using [Secure.AndroidId](https://docs.microsoft.com/dotnet/api/android.provider.settings.secure.androidid?view=xamarin-android-sdk-9)) as part of the notification hub registration payload.

1. Add another **Empty Class** to the **Services** folder called *PushNotificationFirebaseMessagingService.cs*, then add the following implementation.

    ```csharp
    using Android.App;
    using Android.Content;
    using Firebase.Messaging;
    using PushDemo.Services;

    namespace PushDemo.Droid.Services
    {
        [Service]
        [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
        public class PushNotificationFirebaseMessagingService : FirebaseMessagingService
        {
            IPushDemoNotificationActionService _notificationActionService;
            INotificationRegistrationService _notificationRegistrationService;
            IDeviceInstallationService _deviceInstallationService;

            IPushDemoNotificationActionService NotificationActionService
                => _notificationActionService ??
                    (_notificationActionService =
                    ServiceContainer.Resolve<IPushDemoNotificationActionService>());

            INotificationRegistrationService NotificationRegistrationService
                => _notificationRegistrationService ??
                    (_notificationRegistrationService =
                    ServiceContainer.Resolve<INotificationRegistrationService>());

            IDeviceInstallationService DeviceInstallationService
                => _deviceInstallationService ??
                    (_deviceInstallationService =
                    ServiceContainer.Resolve<IDeviceInstallationService>());

            public override void OnNewToken(string token)
            {
                DeviceInstallationService.Token = token;

                NotificationRegistrationService.RefreshRegistrationAsync()
                    .ContinueWith((task) => { if (task.IsFaulted) throw task.Exception; });
            }

            public override void OnMessageReceived(RemoteMessage message)
            {
                if(message.Data.TryGetValue("action", out var messageAction))
                    NotificationActionService.TriggerAction(messageAction);
            }
        }
    }
    ```

1. In **MainActivity.cs**, ensure the following namespaces have been added to the top of the file.

    ```csharp
    using System;
    using Android.App;
    using Android.Content;
    using Android.Content.PM;
    using Android.OS;
    using Android.Runtime;
    using Firebase.Iid;
    using PushDemo.Droid.Services;
    using PushDemo.Services;
    ```

1. In **MainActivity.cs**, set the **LaunchMode** to **SingleTop** so **MainActivity** won't get created again when opened.

    ```csharp
    [Activity(
        Label = "PushDemo",
        LaunchMode = LaunchMode.SingleTop,
        Icon = "@mipmap/icon",
        Theme = "@style/MainTheme",
        MainLauncher = true,
        ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    ```

1. Add private properties and corresponding backing fields to store a reference to the **IPushNotificationActionService** and **IDeviceInstallationService** implementations.

    ```csharp
    IPushDemoNotificationActionService _notificationActionService;
    IDeviceInstallationService _deviceInstallationService;

    IPushDemoNotificationActionService NotificationActionService
        => _notificationActionService ??
            (_notificationActionService =
            ServiceContainer.Resolve<IPushDemoNotificationActionService>());

    IDeviceInstallationService DeviceInstallationService
        => _deviceInstallationService ??
            (_deviceInstallationService =
            ServiceContainer.Resolve<IDeviceInstallationService>());
    ```

1. Implement the **IOnSuccessListener** interface to retrieve and store the **Firebase** token.

    ```csharp
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity, Android.Gms.Tasks.IOnSuccessListener
    {
        ...

        public void OnSuccess(Java.Lang.Object result)
            => DeviceInstallationService.Token =
                result.Class.GetMethod("getToken").Invoke(result).ToString();
    }
    ```

1. Add a new method called **ProcessNotificationActions** that will check whether a given **Intent** has an extra value named *action*. Conditionally trigger that action using the **IPushDemoNotificationActionService** implementation.

    ```csharp
    void ProcessNotificationActions(Intent intent)
    {
        try
        {
            if (intent?.HasExtra("action") == true)
            {
                var action = intent.GetStringExtra("action");

                if (!string.IsNullOrEmpty(action))
                    NotificationActionService.TriggerAction(action);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(ex.Message);
        }
    }
    ```

1. Override the **OnNewIntent** method to call **ProcessNotificationActions** method.

    ```csharp
    protected override void OnNewIntent(Intent intent)
    {
        base.OnNewIntent(intent);
        ProcessNotificationActions(intent);
    }
    ```

    > [!NOTE]
    > Since the **LaunchMode** for the **Activity** is set to **SingleTop**, an **Intent** will be sent to the existing **Activity** instance via the **OnNewIntent** method rather than the **OnCreate** method and so you must handle an incoming intent in both **OnCreate** and **OnNewIntent** methods.

1. Update the **OnCreate** method to call `Bootstrap.Begin` right after the call to `base.OnCreate` passing in the platform-specific implementation of **IDeviceInstallationService**.

    ```csharp
    Bootstrap.Begin(() => new DeviceInstallationService());
    ```

1. In the same method, conditionally call **GetInstanceId** on the **FirebaseApp** instance, right after the call to `Bootstrap.Begin`, adding **MainActivity** as the **IOnSuccessListener**.

    ```csharp
    if (DeviceInstallationService.NotificationsSupported)
    {
        FirebaseInstanceId.GetInstance(Firebase.FirebaseApp.Instance)
            .GetInstanceId()
            .AddOnSuccessListener(this);
    }
    ```

1. Still in **OnCreate**, call **ProcessNotificationActions** immediately after the call to `LoadApplication` passing in the current **Intent**.

    ```cs
    ...

    LoadApplication(new App());

    ProcessNotificationActions(Intent);
    ```

> [!NOTE]
> You must re-register the app each time you run it and stop it from a debug session to continue receiving push notifications.
