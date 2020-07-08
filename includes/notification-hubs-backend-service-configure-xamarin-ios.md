---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Configure Info.plist and Entitlements.plist

1. Ensure you've signed in to your **Apple Developer Account** in **Visual Studio** > **Preferences...** > **Publishing** > **Apple Developer Accounts** and the appropriate *Certificate* and *Provisioning Profile* has been downloaded. You should have created these assets as part of the previous steps.

1. In **PushDemo.iOS**, open **Info.plist**  and ensure that the **BundleIdentifier** matches the value that was used for the respective provisioning profile in the [Apple Developer Portal](https://developer.apple.com). The **BundleIdentifier** was in the format ``com.<organization>.PushDemo``.

1. In the same file, set **Minimum system version** to **13.0**.

    > [!NOTE]
    > Only those devices running **iOS 13.0 and above** are supported for the purposes of this tutorial however you can extend it to support devices running older versions.

1. Open the **Project Options** for **PushDemo.iOS** (double-click on the project).

1. In **Project Options**, under **Build > iOS Bundle Signing**, ensure that your Developer account is selected under **Team**. Then, ensure "Automatically manage signing" is selected and your Signing Certificate and Provisioning Profile are automatically selected.

    > [!NOTE]
    > If your *Signing Certificate* and *Provisioning Profile* have not been automatically selected, choose **Manual Provisioning**, then click on **Bundle Signing Options**. Ensure that your *Team* is selected for **Signing Identity** and your *PushDemo* specific provisioning profile is selected for **Provisioning Profile** for both **Debug** and **Release** configurations ensuring that **iPhone** is selected for the **Platform** in both cases.

1. In **PushDemo.iOS**, open **Entitlements.plist** and ensure that **Enable Push Notifications** is checked when viewed in the **Entitlements** tab. Then, ensure the **APS Environment** setting is set to **development** when viewed in the **Source** tab.

### Handle push notifications for iOS

1. **Control** + **Click** on the **PushDemo.iOS** project, choose **New Folder** from the **Add** menu, then click **Add** using *Services* as the **Folder Name**.

1. **Control** + **Click** on the **Services** folder, then choose **New File...** from the **Add** menu.

1. Select **General** > **Empty Class**, enter *DeviceInstallationService.cs* for the **Name**, then click **New** adding the following implementation.

    ```csharp
    using System;
    using PushDemo.Models;
    using PushDemo.Services;
    using UIKit;

    namespace PushDemo.iOS.Services
    {
        public class DeviceInstallationService : IDeviceInstallationService
        {
            const int SupportedVersionMajor = 13;
            const int SupportedVersionMinor = 0;

            public string Token { get; set; }

            public bool NotificationsSupported
                => UIDevice.CurrentDevice.CheckSystemVersion(SupportedVersionMajor, SupportedVersionMinor);

            public string GetDeviceId()
                => UIDevice.CurrentDevice.IdentifierForVendor.ToString();

            public DeviceInstallation GetDeviceInstallation(params string[] tags)
            {
                if (!NotificationsSupported)
                    throw new Exception(GetNotificationsSupportError());

                if (string.isNullOrWhitespace(Token))
                    throw new Exception("Unable to resolve token for APNS");

                var installation = new DeviceInstallation
                {
                    InstallationId = GetDeviceId(),
                    Platform = "apns",
                    PushChannel = Token
                };

                installation.Tags.AddRange(tags);

                return installation;
            }

            string GetNotificationsSupportError()
            {
                if (!NotificationsSupported)
                    return $"This app only supports notifications on iOS {SupportedVersionMajor}.{SupportedVersionMinor} and above. You are running {UIDevice.CurrentDevice.SystemVersion}.";

                if (Token == null)
                    return $"This app can support notifications but you must enable this in your settings.";


                return "An error occurred preventing the use of push notifications";
            }
        }
    }
    ```

    > [!NOTE]
    > This class provides a unique ID (using the [UIDevice.IdentifierForVendor](https://docs.microsoft.com/dotnet/api/uikit.uidevice.identifierforvendor?view=xamarin-ios-sdk-12) value) and the notification hub registration payload.

1. Add a new folder to the **PushDemo.iOS** project called *Extensions* then add an **Empty Class** to that folder called *NSDataExtensions.cs* with the following implementation.

    ```csharp
    using System.Text;
    using Foundation;

    namespace PushDemo.iOS.Extensions
    {
        internal static class NSDataExtensions
        {
            internal static string ToHexString(this NSData data)
            {
                var bytes = data.ToArray();

                if (bytes == null)
                    return null;

                StringBuilder sb = new StringBuilder(bytes.Length * 2);

                foreach (byte b in bytes)
                    sb.AppendFormat("{0:x2}", b);

                return sb.ToString().ToUpperInvariant();
            }
        }
    }
    ```

1. In **AppDelegate.cs**, ensure the following namespaces have been added to the top of the file.

    ```csharp
    using System;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using Foundation;
    using PushDemo.iOS.Extensions;
    using PushDemo.iOS.Services;
    using PushDemo.Services;
    using UIKit;
    using UserNotifications;
    using Xamarin.Essentials;
    ```

1. Add private properties and their respective backing fields to store a reference to the **IPushDemoNotificationActionService**, **INotificationRegistrationService**, and **IDeviceInstallationService** implementations.

    ```csharp
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
    ```

1. Add the **RegisterForRemoteNotifications** method to register user notification settings and then for remote notifications with **APNS**.

    ```csharp
    void RegisterForRemoteNotifications()
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            var pushSettings = UIUserNotificationSettings.GetSettingsForTypes(
                UIUserNotificationType.Alert |
                UIUserNotificationType.Badge |
                UIUserNotificationType.Sound,
                new NSSet());

            UIApplication.SharedApplication.RegisterUserNotificationSettings(pushSettings);
            UIApplication.SharedApplication.RegisterForRemoteNotifications();
        });
    }
    ```

1. Add the **CompleteRegistrationAsync** method to set the `IDeviceInstallationService.Token` property value. Refresh the registration and cache the device token if it has been updated since it was last stored.

    ```csharp
    Task CompleteRegistrationAsync(NSData deviceToken)
    {
        DeviceInstallationService.Token = deviceToken.ToHexString();
        return NotificationRegistrationService.RefreshRegistrationAsync();
    }
    ```

1. Add the **ProcessNotificationActions** method for processing the **NSDictionary** notification data and conditionally calling **NotificationActionService.TriggerAction**.

    ```csharp
    void ProcessNotificationActions(NSDictionary userInfo)
    {
        if (userInfo == null)
            return;

        try
        {
            var actionValue = userInfo.ObjectForKey(new NSString("action")) as NSString;

            if (!string.IsNullOrWhiteSpace(actionValue?.Description))
                NotificationActionService.TriggerAction(actionValue.Description);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.Message);
        }
    }
    ```

1. Override the **RegisteredForRemoteNotifications** method passing the **deviceToken** argument to the **CompleteRegistrationAsync** method.

    ```csharp
    public override void RegisteredForRemoteNotifications(
        UIApplication application,
        NSData deviceToken)
        => CompleteRegistrationAsync(deviceToken).ContinueWith((task)
            => { if (task.IsFaulted) throw task.Exception; });
    ```

1. Override the **ReceivedRemoteNotification** method passing the **userInfo** argument to the **ProcessNotificationActions** method.

    ```csharp
    public override void ReceivedRemoteNotification(
        UIApplication application,
        NSDictionary userInfo)
        => ProcessNotificationActions(userInfo);
    ```

1. Override the **FailedToRegisterForRemoteNotifications** method to log the error.

    ```csharp
    public override void FailedToRegisterForRemoteNotifications(
        UIApplication application,
        NSError error)
        => Debug.WriteLine(error.Description);
    ```

    > [!NOTE]
    > This is very much a placeholder. You will want to implement proper logging and error handling for production scenarios.

1. Update the **FinishedLaunching** method to call `Bootstrap.Begin` right after the call to `Forms.Init` passing in the platform-specific implementation of **IDeviceInstallationService**.

    ```csharp
    Bootstrap.Begin(() => new DeviceInstallationService());
    ```

1. In the same method, conditionally request authorization and register for remote notifications immediately after `Bootstrap.Begin`.

    ```csharp
    if (DeviceInstallationService.NotificationsSupported)
    {
        UNUserNotificationCenter.Current.RequestAuthorization(
                UNAuthorizationOptions.Alert |
                UNAuthorizationOptions.Badge |
                UNAuthorizationOptions.Sound,
                (approvalGranted, error) =>
                {
                    if (approvalGranted && error == null)
                        RegisterForRemoteNotifications();
                });
    }
    ```

1. Still in **FinishedLaunching**, call **ProcessNotificationActions** immediately after the call to `LoadApplication` if the **options** argument contains the **UIApplication.LaunchOptionsRemoteNotificationKey** passing in the resulting **userInfo** object.

    ```csharp
    using (var userInfo = options?.ObjectForKey(
        UIApplication.LaunchOptionsRemoteNotificationKey) as NSDictionary)
            ProcessNotificationActions(userInfo);
    ```
