---
 author: mikeparker104
 ms.author: miparker
 ms.date: 07/07/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Configure the Runner target and Info.plist

1. In **Visual Studio Code**, **Control** + **Click** on the **ios** folder, then choose **Open in Xcode**.

1. In **Xcode**, click on **Runner** (the **xcodeproj** at the top, not the folder) then select the **Runner** target, and then **Signing & Capabilities**. With the **All** build configuration selected, choose your Developer account for the **Team**. Ensure the "Automatically manage signing" option is checked and your Signing Certificate and Provisioning Profile are automatically selected.

    > [!NOTE]
    > If you don't see the new Provisioning Profile value, try refreshing the profiles for the Signing Identity by selecting **Xcode** > **Preferences** > **Account** then select the **Download Manual Profiles** button to download the profiles.

1. Click on **+ Capability**, then search for **Push Notifications**. **Double-Click** on **Push Notifications** to add this capability.

1. Open **Info.plist** and set **Minimum system version** to **13.0**.

    > [!NOTE]
    > Only those devices running **iOS 13.0 and above** are supported for the purposes of this tutorial however you can extend it to support devices running older versions.

1. Open **Runner.entitlements** and ensure the **APS Environment** setting is set to **development**.

### Handle push notifications for iOS

1. **Control** + **Click** on the **Runner** folder (within the Runner project), then choose **New Group** using **Services** as the name.

1. **Control** + **Click** on the **Services** folder, then choose **New File...**. Then, choose **Swift File** and click **Next**. Specify **DeviceInstallationService** for the name and then click **Create**.

1. Implement **DeviceInstallationService.swift** using the following code.

    ```swift
    import Foundation

    class DeviceInstallationService {

        enum DeviceRegistrationError: Error {
            case notificationSupport(message: String)
        }

        var token : Data? = nil

        let DEVICE_INSTALLATION_CHANNEL = "com.<your_organization>.pushdemo/deviceinstallation"
        let GET_DEVICE_ID = "getDeviceId"
        let GET_DEVICE_TOKEN = "getDeviceToken"
        let GET_DEVICE_PLATFORM = "getDevicePlatform"

        private let deviceInstallationChannel : FlutterMethodChannel

        var notificationsSupported : Bool {
            get {
                if #available(iOS 13.0, *) {
                    return true
                }
                else {
                    return false
                }
            }
        }

        init(withBinaryMessenger binaryMessenger : FlutterBinaryMessenger) {
            deviceInstallationChannel = FlutterMethodChannel(name: DEVICE_INSTALLATION_CHANNEL, binaryMessenger: binaryMessenger)
            deviceInstallationChannel.setMethodCallHandler(handleDeviceInstallationCall)
        }

        func getDeviceId() -> String {
            return UIDevice.current.identifierForVendor!.description
        }

        func getDeviceToken() throws -> String {
            if(!notificationsSupported) {
                let notificationSupportError = getNotificationsSupportError()
                throw DeviceRegistrationError.notificationSupport(message: notificationSupportError)
            }

            if (token == nil) {
                throw DeviceRegistrationError.notificationSupport(message: "Unable to resolve token for APNS.")
            }

            return token!.reduce("", {$0 + String(format: "%02X", $1)})
        }

        func getDevicePlatform() -> String {
            return "apns"
        }

        private func handleDeviceInstallationCall(call: FlutterMethodCall, result: @escaping FlutterResult) {
            switch call.method {
            case GET_DEVICE_ID:
                result(getDeviceId())
            case GET_DEVICE_TOKEN:
                getDeviceToken(result: result)
            case GET_DEVICE_PLATFORM:
                result(getDevicePlatform())
            default:
                result(FlutterMethodNotImplemented)
            }
        }

        private func getDeviceToken(result: @escaping FlutterResult) {
            do {
                let token = try getDeviceToken()
                result(token)
            }
            catch let error {
                result(FlutterError(code: "UNAVAILABLE", message: error.localizedDescription, details: nil))
            }
        }

        private func getNotificationsSupportError() -> String {

            if (!notificationsSupported) {
                return "This app only supports notifications on iOS 13.0 and above. You are running \(UIDevice.current.systemVersion)"
            }

            return "An error occurred preventing the use of push notifications."
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/deviceinstallation` channel. This was defined in the Flutter portion of the app within **DeviceInstallationService.dart**. In this case, the calls are made from the common code to the native host. Be sure to replace **<your_organization>** with your own organization wherever this is used.
    >
    > This class provides a unique ID (using the [UIDevice.identifierForVendor](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor) value) as part of the notification hub registration payload.

1. Add another **Swift File** to the **Services** folder called *NotificationRegistrationService*, then add the following code.

    ```swift
    import Foundation

    class NotificationRegistrationService {

        let NOTIFICATION_REGISTRATION_CHANNEL = "com.<your_organization>.pushdemo/notificationregistration"
        let REFRESH_REGISTRATION = "refreshRegistration"

        private let notificationRegistrationChannel : FlutterMethodChannel

        init(withBinaryMessenger binaryMessenger : FlutterBinaryMessenger) {
           notificationRegistrationChannel = FlutterMethodChannel(name: NOTIFICATION_REGISTRATION_CHANNEL, binaryMessenger: binaryMessenger)
        }

        func refreshRegistration() {
            notificationRegistrationChannel.invokeMethod(REFRESH_REGISTRATION, arguments: nil)
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/notificationregistration` channel. This was defined in the Flutter portion of the app within **NotificationRegistrationService.dart**. In this case, the calls are made from the native host to the common code. Again, take care to replace **<your_organization>** with your own organization wherever this is used.

1. Add another **Swift File** to the **Services** folder called *NotificationActionService*, then add the following code.

    ```swift
    import Foundation

    class NotificationActionService {

        let NOTIFICATION_ACTION_CHANNEL = "com.<your_organization>.pushdemo/notificationaction"
        let TRIGGER_ACTION = "triggerAction"
        let GET_LAUNCH_ACTION = "getLaunchAction"

        private let notificationActionChannel: FlutterMethodChannel

        var launchAction: String? = nil

        init(withBinaryMessenger binaryMessenger: FlutterBinaryMessenger) {
            notificationActionChannel = FlutterMethodChannel(name: NOTIFICATION_ACTION_CHANNEL, binaryMessenger: binaryMessenger)
            notificationActionChannel.setMethodCallHandler(handleNotificationActionCall)
        }

        func triggerAction(action: String) {
           notificationActionChannel.invokeMethod(TRIGGER_ACTION, arguments: action)
        }

        private func handleNotificationActionCall(call: FlutterMethodCall, result: @escaping FlutterResult) {
            switch call.method {
            case GET_LAUNCH_ACTION:
                result(launchAction)
            default:
                result(FlutterMethodNotImplemented)
            }
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/notificationaction` channel. That was defined in the Flutter portion of the app within **NotificationActionService.dart**. Calls can be made in both directions in this case. Be sure to replace **<your_organization>** with your own organization wherever this is used.

1. In **AppDelegate.swift**, add variables to store a reference to the services you created previously.

    ```swift
    var deviceInstallationService : DeviceInstallationService?
    var notificationRegistrationService : NotificationRegistrationService?
    var notificationActionService : NotificationActionService?
    ```

1. Add a function called **processNotificationActions** for processing the notification data. Conditionally trigger that action or store it for use later if the action is being processed during app launch.

    ```swift
    func processNotificationActions(userInfo: [AnyHashable : Any], launchAction: Bool = false) {
        if let action = userInfo["action"] as? String {
            if (launchAction) {
                notificationActionService?.launchAction = action
            }
            else {
                notificationActionService?.triggerAction(action: action)
            }
        }
    }
    ```

1. Override the **didRegisterForRemoteNotificationsWithDeviceToken** function setting the **token** value for the **DeviceInstallationService**. Then, call **refreshRegistration** on the **NotificationRegistrationService**.

    ```swift
    override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      deviceInstallationService?.token = deviceToken
      notificationRegistrationService?.refreshRegistration()
    }
    ```

1. Override the **didReceiveRemoteNotification** function passing the **userInfo** argument to the **processNotificationActions** function.

    ```swift
    override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
        processNotificationActions(userInfo: userInfo)
    }
    ```

1. Override the **didFailToRegisterForRemoteNotificationsWithError** function to log the error.

    ```swift
    override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print(error);
    }
    ```

    > [!NOTE]
    > This is very much a placeholder. You will want to implement proper logging and error handling for production scenarios.

1. In **didFinishLaunchingWithOptions**, instantiate the **deviceInstallationService**, **notificationRegistrationService**, and **notificationActionService** variables.

    ```swift
    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController

    deviceInstallationService = DeviceInstallationService(withBinaryMessenger: controller.binaryMessenger)
    notificationRegistrationService = NotificationRegistrationService(withBinaryMessenger: controller.binaryMessenger)
    notificationActionService = NotificationActionService(withBinaryMessenger: controller.binaryMessenger)
    ```

1. In the same function, conditionally request authorization and register for remote notifications.

    ```swift
    if #available(iOS 13.0, *) {
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
          (granted, error) in

          if (granted)
          {
              DispatchQueue.main.async {
                  let pushSettings = UIUserNotificationSettings(types: [.alert, .sound, .badge], categories: nil)
                  application.registerUserNotificationSettings(pushSettings)
                  application.registerForRemoteNotifications()
              }
          }
      }
    }
    ```

1. If the **launchOptions** contains the **remoteNotification** key, call **processNotificationActions** at the end of the **didFinishLaunchingWithOptions** function. Pass in the resulting **userInfo** object and use *true* for the *launchAction* argument. A *true* value denotes that the action is being processed during app launch.

    ```swift
    if let userInfo = launchOptions?[.remoteNotification] as? [AnyHashable : Any] {
        processNotificationActions(userInfo: userInfo, launchAction: true)
    }
    ```
