---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Validate package name and permissions

1. In **PushDemo.Android**, open the **Project Options** then **Android Application** from the **Build** section.

1. Check that the **Package name** matches the value you used in the [Firebase Console](https://console.firebase.google.com) **PushDemo** project. This was in the format ``com.<organization>.pushdemo``.

1. Set the **Minimum Android Version** to **Android 8.0 (API level 26)** and the **Target Android Version** to the latest **API level**.

    > [!NOTE]
    > Only those devices running **API level 26 and above** are supported for the purposes of this tutorial however you can extend it to support devices running older versions.

1. Ensure the **INTERNET** and **READ_PHONE_STATE** permissions are enabled under **Required permissions**.

1. Click **OK**

### Add the Xamarin Google Play Services Base and Xamarin.Firebase.Messaging packages

1. In **PushDemo.Android**, **Control** + **Click** on the **Packages** folder, then choose **Manage NuGet Packages...**.

1. Search for **Xamarin.GooglePlayServices.Base** (not **Basement**) and ensure it is checked.

1. Search for **Xamarin.Firebase.Messaging** and ensure it is checked.

1. Click **Add Packages**, then click **Accept** when prompted to accept the **license terms**.

### Add the Google Services JSON file

1. **Control** + **Click** on the **PushDemo.Android** project, then choose **Existing File...** from the **Add** menu.

1. Choose the *google-services.json* file you downloaded earlier when you set up the **PushDemo** project in the [Firebase Console](https://console.firebase.google.com) then click **Open**.

1. When prompted, choose to **Copy the file to the directory**.

1. **Control** + **Click** on the *google-services.json* file from within the **PushDemo.Android** project, then ensure **GoogleServicesJson** is set as the **Build Action**.

### Handle Push Notifications for Android

1. **Control** + **Click** on the **PushDemo.Android** project, choose **New Folder** from the **Add** menu, then click **Add** using *Services* as the **Folder Name**.

1. **Control** + **Click** on the **Services** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *DeviceInstallationService.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    using System;
    using Android.App;
    using PushDemo.Models;
    using PushDemo.Services;
    using static Android.Provider.Settings;

    namespace PushDemo.Droid.Services
    {
        public class DeviceInstallationService : IDeviceInstallationService
        {
            Func<string> _getFirebaseToken;
            Func<bool> _playServicesAvailable;
            Func<string> _getPlayServicesError;

            public string GetDeviceId()
                => Secure.GetString(Application.Context.ContentResolver, Secure.AndroidId);

            public DeviceInstallationService(
                Func<string> getFirebaseToken,
                Func<bool> playServicesAvailable,
                Func<string> getPlayServicesError)
            {
                _getFirebaseToken = getFirebaseToken ?? throw new ArgumentException(
                    $"Parameter {nameof(getFirebaseToken)} cannot be null");

                _playServicesAvailable = playServicesAvailable ?? throw new ArgumentException(
                    $"Parameter {nameof(playServicesAvailable)} cannot be null");

                _getPlayServicesError = getPlayServicesError ?? throw new ArgumentException(
                    $"Parameter {nameof(getPlayServicesError)} cannot be null");
            }

            public DeviceInstallation GetDeviceRegistration(params string[] tags)
            {
                if (!_playServicesAvailable())
                    throw new Exception(_getPlayServicesError());

                var installationId = GetDeviceId();
                var token = _getFirebaseToken();

                if (token == null)
                    return null;

                var installation = new DeviceInstallation
                {
                    InstallationId = installationId,
                    Platform = "fcm",
                    PushChannel = token
                };

                installation.Tags.AddRange(tags);

                PushTemplate genericTemplate = new PushTemplate
                {
                    Body = "{\"data\":{\"message\":\"$(alertMessage)\", \"action\":\"$(alertAction)\"}}"
                };

                PushTemplate silentTemplate = new PushTemplate
                {
                    Body = "{\"data\":{\"message\":\"$(silentMessage)\", \"action\":\"$(silentAction)\", \"silent\":\"true\"}}"
                };

                installation.Templates.Add("genericTemplate", genericTemplate);
                installation.Templates.Add("silentTemplate", silentTemplate);

                return installation;
            }
        }
    }
    ```

    > [!NOTE]
    > This class provides a unique ID (using [Secure.AndroidId](https://docs.microsoft.com/dotnet/api/android.provider.settings.secure.androidid?view=xamarin-android-sdk-9)) as part of the notification hub registration payload.

1. Add another **Empty Class** to the **Services** folder called *PushNotificationFirebaseMessagingService.cs*, then add the following implementation.

    ```csharp
    using System;
    using Android.App;
    using Android.Content;
    using Android.OS;
    using Android.Support.V4.App;
    using Firebase.Messaging;
    using PushDemo.Services;

    namespace PushDemo.Droid.Services
    {
        [Service]
        [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT", "FLAG_INCLUDE_STOPPED_PACKAGES" })]
        public class PushNotificationFirebaseMessagingService : FirebaseMessagingService
        {
            const string ChannelId = nameof(PushNotificationFirebaseMessagingService);

            Random _random;

            NotificationManager _notificationManager;
            IPushDemoNotificationActionService _notificationActionService;
            INotificationRegistrationService _notificationRegistrationService;

            IPushDemoNotificationActionService NotificationActionService
                => _notificationActionService ??
                    (_notificationActionService =
                    ServiceContainer.Resolve<IPushDemoNotificationActionService>());

            INotificationRegistrationService NotificationRegistrationService
                => _notificationRegistrationService ??
                    (_notificationRegistrationService =
                    ServiceContainer.Resolve<INotificationRegistrationService>());

            internal static string Token { get; set; }

            internal static bool AppInForeground { get; set; }

            public override void OnCreate()
            {
                base.OnCreate();

                _random = new Random();
                _notificationManager = (NotificationManager)GetSystemService(NotificationService);

                if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
                {
                    NotificationChannel channel = new NotificationChannel(
                        ChannelId,
                        "PushDemo",
                        NotificationImportance.Default);

                    _notificationManager.CreateNotificationChannel(channel);
                }
            }

            public override void OnNewToken(string token)
            {
                Token = token;

                NotificationRegistrationService.RefreshRegistrationAsync()
                    .ContinueWith((task) => { if (task.IsFaulted) throw task.Exception; });
            }

            public override void OnMessageReceived(RemoteMessage message)
            {
                base.OnMessageReceived(message);

                message.Data.TryGetValue("action", out var messageAction);

                if (!AppInForeground &&
                    message.Data.TryGetValue("message", out var messageBody))
                {
                    if (string.IsNullOrWhiteSpace(messageBody) ||
                        (message.Data.TryGetValue("silent", out var silentString) &&
                        bool.TryParse(silentString, out var silent) && silent))
                        return;

                    SendNotification("PushDemo", messageBody, messageAction);
                }

                if (AppInForeground && !string.IsNullOrWhiteSpace(messageAction))
                    NotificationActionService.TriggerAction(messageAction);
            }

            void SendNotification(string title, string body, string action)
            {
                var intent = new Intent(this, typeof(MainActivity));
                intent.AddFlags(ActivityFlags.SingleTop);
                intent.PutExtra(nameof(body), body);
                intent.PutExtra(nameof(action), action);

                var pendingIntent = PendingIntent.GetActivity(
                    this,
                    _random.Next(),
                    intent,
                    PendingIntentFlags.UpdateCurrent);

                var builder = new NotificationCompat.Builder(this, ChannelId)
                              .SetAutoCancel(true)
                              .SetContentIntent(pendingIntent)
                              .SetContentTitle(title)
                              .SetSmallIcon(Resource.Mipmap.icon)
                              .SetContentText(body);

                var notificationManager = NotificationManagerCompat.From(this);
                notificationManager.Notify(_random.Next(), builder.Build());
            }
        }
    }
    ```

    > [!NOTE]
    > [Launch controls on stopped applications](https://developer.android.com/about/versions/android-3.1.html#launchcontrols) were introduced in Android 3.1 to provide a means of controlling whether a stopped application can be launched from background processes and other applications. Applications are in a stopped state when they are first installed but are not yet launched and when they are manually stopped i.e. force-closed by the user.  
    >
    > The platform defines two intent flags for specifying whether the Intent should be allowed to activate components in stopped application.
    >
    > - **FLAG_INCLUDE_STOPPED_PACKAGES** - Include intent filters of stopped applications in the list of potential targets to resolve against.
    > - **FLAG_EXCLUDE_STOPPED_PACKAGES** - Exclude intent filters of stopped applications from the list of potential targets.
    >
    > When neither or both of these flags is defined in an intent, the default behavior is to include filters of stopped applications in the list of potential targets. However, the system adds **FLAG_EXCLUDE_STOPPED_PACKAGES** to all broadcast intents by default.  
    >
    > A background service or application can override this behavior by adding the **FLAG_INCLUDE_STOPPED_PACKAGES** flag to broadcast intents that should be allowed to activate stopped applications.

1. In **MainActivity.cs**, add the **Firebase.Iid** and **using Android.Gms.Common** namespaces to the top of the file.

    ```csharp
    using Firebase.Iid;
    using Android.Gms.Common;
    ```

1. In **MainActivity.cs**, set the **LaunchMode** to **SingleTop** so **MainActivity** will not get created again when opened.

    ```csharp
    [Activity(
        Label = "PushDemo",
        LaunchMode = LaunchMode.SingleTop,
        Icon = "@mipmap/icon",
        Theme = "@style/MainTheme",
        MainLauncher = true,
        ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    ```

1. Implement the **IOnSuccessListener** interface.

    ```csharp
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity, Android.Gms.Tasks.IOnSuccessListener
    {
        ...

        public void OnSuccess(Java.Lang.Object result)
            => PushNotificationFirebaseMessagingService.Token =
                result.Class.GetMethod("getToken").Invoke(result).ToString();
    }
    ```

1. Add a private property and a corresponding backing field to store a reference to the **IPushNotificationActionService** implementation.

    ```csharp
    IPushDemoNotificationActionService _notificationActionService;

    IPushDemoNotificationActionService NotificationActionService
        => _notificationActionService ??
            (_notificationActionService =
            ServiceContainer.Resolve<IPushDemoNotificationActionService>());
    ```

1. Add a private property indicating whether **Google Play Services** are available or not.

    ```csharp
    bool PlayServicesAvailable
        => GoogleApiAvailability.Instance
            .IsGooglePlayServicesAvailable(this) == ConnectionResult.Success;
    ```

1. Add a new method called **ProcessNotificationActions** that will check whether a given **Intent** has an extra value named *action* and conditionally trigger that action using the **IPushDemoNotificationActionService** implementation.

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

1. Add a new method called **GetPlayServicesError** to prepare the appropriate exception message in the event that **Google Play Services** are not available.

    ```csharp
    string GetPlayServicesError()
    {
        int resultCode = GoogleApiAvailability.Instance.IsGooglePlayServicesAvailable(this);

        if (resultCode != ConnectionResult.Success)
            return GoogleApiAvailability.Instance.IsUserResolvableError(resultCode) ?
                        GoogleApiAvailability.Instance.GetErrorString(resultCode) :
                        "This device is not supported";

        return "An error occurred preventing the use of push notifications";
    }
    ```

1. Override the **OnNewIntent** method to call **CheckIntentForNotificationActions** method.

    ```csharp
    protected override void OnNewIntent(Intent intent)
    {
        base.OnNewIntent(intent);
        ProcessNotificationActions(intent);
    }
    ```

    > [!NOTE]
    > Since the **LaunchMode** for the **Activity** is set to **SingleTop**, an **Intent** will be sent to the existing **Activity** instance via the **OnNewIntent** method rather than the **OnCreate** method and so you must handle an incoming intent in both **OnCreate** and **OnNewIntent** methods.

1. Override the **OnResume**, **OnPause**, **OnStop**, and **OnDestroy** activity lifecycle methods setting the **PushNotificationFirebaseMessagingService.AppInForeground** state accordingly.

    ```csharp
     protected override void OnResume()
    {
        base.OnResume();
        PushNotificationFirebaseMessagingService.AppInForeground = true;
    }

    protected override void OnPause()
    {
        base.OnPause();
        PushNotificationFirebaseMessagingService.AppInForeground = false;
    }

    protected override void OnStop()
    {
        base.OnStop();
        PushNotificationFirebaseMessagingService.AppInForeground = false;
    }

    protected override void OnDestroy()
    {
        base.OnDestroy();
        PushNotificationFirebaseMessagingService.AppInForeground = false;
    }
    ```

    > [!NOTE]
    > This is used as a simple means for providing awareness of the application state to the **PushNotificationFirebaseMessagingService** class to influence the handling of notifications.

1. Update the **OnCreate** method to conditionally call **GetInstanceId** on the **FirebaseApp** instance, right after the call to **base.OnCreate**, adding **MainActivity** as the **IOnSuccessListener**.

    ```csharp
    if (PlayServicesAvailable)
    {
        FirebaseInstanceId.GetInstance(Firebase.FirebaseApp.Instance)
            .GetInstanceId()
            .AddOnSuccessListener(this);
    }
    ```

1. Update the **OnCreate** method to call **Bootstrap.Begin** before the call to **LoadApplication**, passing in the requisite **Func** dependencies, and then call **ProcessNotificationActions** immediately after the call to **LoadApplication**.

    ```cs
    Bootstrap.Begin(() => new DeviceInstallationService(
        () => PushNotificationFirebaseMessagingService.Token,
        () => PlayServicesAvailable,
        () => GetPlayServicesError()));

    LoadApplication(new App());

    ProcessNotificationActions(Intent);
    ```

> [!NOTE]
> You must re-register the app each time you run it and stop it from a debug session to continue receiving push notifications.
