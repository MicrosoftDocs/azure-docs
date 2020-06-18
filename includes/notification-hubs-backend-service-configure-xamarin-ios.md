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
    using Foundation;
    using PushDemo.Models;
    using PushDemo.Services;
    using UIKit;

    namespace PushDemo.iOS.Services
    {
        public class DeviceInstallationService : IDeviceInstallationService
        {
            Func<NSData> _getDeviceToken;
            Func<bool> _notificationsSupported;
            Func<string> _getNotificationSupportError;

            public DeviceInstallationService(
                Func<NSData> getDeviceToken,
                Func<bool> notificationsSupported,
                Func<string> getNotificationSupportError)
            {
                _getDeviceToken = getDeviceToken ?? throw new ArgumentException(
                        $"Parameter {nameof(getDeviceToken)} cannot be null");

                _notificationsSupported = notificationsSupported ?? throw new ArgumentException(
                        $"Parameter {nameof(notificationsSupported)} cannot be null");

                _getNotificationSupportError = getNotificationSupportError ?? throw new ArgumentException(
                        $"Parameter {nameof(getNotificationSupportError)} cannot be null");
            }

            public string GetDeviceId()
                => UIDevice.CurrentDevice.IdentifierForVendor.ToString();

            public DeviceInstallation GetDeviceRegistration(params string[] tags)
            {
                if (!_notificationsSupported())
                    throw new Exception(_getNotificationSupportError());

                var installationId = GetDeviceId();
                var token = _getDeviceToken();

                if (token == null)
                    return null;

                var pushChannel = NSDataToHex(token);

                var installation = new DeviceInstallation
                {
                    InstallationId = installationId,
                    Platform = "apns",
                    PushChannel = pushChannel
                };

                installation.Tags.AddRange(tags);

                return installation;
            }

            string NSDataToHex(NSData data) => ByteToHex(data.ToArray());

            string ByteToHex(byte[] data)
            {
                if (data == null)
                    return null;

                System.Text.StringBuilder sb = new System.Text.StringBuilder(data.Length * 2);

                foreach (byte b in data)
                    sb.AppendFormat("{0:x2}", b);

                return sb.ToString().ToUpperInvariant();
            }
        }
    }
    ```

    > [!NOTE]
    > This class provides a unique ID (using the [UIDevice.IdentifierForVendor](https://docs.microsoft.com/dotnet/api/uikit.uidevice.identifierforvendor?view=xamarin-ios-sdk-12) value) and the notification hub registration payload.

1. In **AppDelegate.cs**, add constants for the device token cache key and the major and minor versions being supported.

    ```csharp
    const string CachedDeviceToken = "cached_device_token";
    const int SupportedVersionMajor = 13;
    const int SupportedVersionMinor = 0;
    ```

1. Add private properties and their respective backing fields to store a reference to the **NSData** device token along with the **IPushDemoNotificationActionService** and **INotificationRegistrationService** implementations.

    ```csharp
    NSData _deviceToken;
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
    ```

1. Add another private property to indicate whether push notifications are being supported on the current device.

    ```csharp
    bool NotificationsSupported
        => UIDevice.CurrentDevice.CheckSystemVersion(SupportedVersionMajor, SupportedVersionMinor);
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

1. Add the **CompleteRegistrationAsync** method to store the **deviceToken** value in the corresponding **_deviceToken** backing field. Refresh the registration and cache the device token if it has been updated since it was last stored.

    ```csharp
    async Task CompleteRegistrationAsync(NSData deviceToken)
    {
        _deviceToken = deviceToken;

        var cachedToken = await SecureStorage.GetAsync(CachedDeviceToken)
            .ConfigureAwait(false);

        var tokenHash = _deviceToken?.Description?.GetHashCode().ToString();

        if (!string.IsNullOrWhiteSpace(cachedToken) &&
            cachedToken.Equals(tokenHash))
            return;

        await NotificationRegistrationService.RefreshRegistrationAsync()
            .ConfigureAwait(false);

        await SecureStorage.SetAsync(CachedDeviceToken, tokenHash)
            .ConfigureAwait(false);
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

1. Add the **GetNotificationsSupportError** method to prepare the appropriate exception message when notifications aren't supported.

    ```csharp
    string GetNotificationsSupportError()
    {
        if (!NotificationsSupported)
            return $"This app only supports notifications on iOS {SupportedVersionMajor}.{SupportedVersionMinor} and above. You are running {UIDevice.CurrentDevice.SystemVersion}.";

        if (_deviceToken == null)
            return $"This app can support notifications but you must enable this in your settings.";

        return "An error occurred preventing the use of push notifications";
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

1. Update the **FinishedLaunching** method to conditionally request authorization and register for remote notifications after `Forms.Init()`. Then, call `Bootstrap.Begin` before the call to **LoadApplication** passing in the requisite **Func** dependencies to the **DeviceInstallationService**.

    ```csharp
    if (NotificationsSupported)
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

    Bootstrap.Begin(() => new DeviceInstallationService(
        () => _deviceToken,
        () => NotificationsSupported,
        () => GetNotificationsSupportError()));
    ```

1. Update the **FinishedLaunching** method again to call **ProcessNotificationActions** immediately after the call to **LoadApplication** if the **options** argument contains the **UIApplication.LaunchOptionsRemoteNotificationKey**.

    ```csharp
    using (var userInfo = options?.ObjectForKey(
        UIApplication.LaunchOptionsRemoteNotificationKey) as NSDictionary)
            ProcessNotificationActions(userInfo);
    ```
