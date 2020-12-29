---
 author: mikeparker104
 ms.author: miparker
 ms.date: 07/07/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Create the Flutter solution

1. Open a new instance of **Visual Studio Code**.

1. Open the **Command Palette** (**Shift** + **Command** + **P**).

1. Select the **Flutter: New Project** command then press **Enter**.

1. Enter *push_demo* for the **Project Name** and then select a **Project location**.

1. When prompted to do so, choose **Get Packages**.

1. **Control** + **Click** on the **kotlin** folder (under **app** > **src** > **main**), then choose **Reveal in Finder**. Then, rename the child folders (under the **kotlin** folder) to ```com```, ```<your_organization>```, and ```pushdemo``` respectively.

    > [!NOTE]
    > When using the **Visual Studio Code** template these folders default to **com**, **example**, **<project_name>**. Assuming **mobcat** is used for the **organization**, the folder structure should indicatively appear as:
    >
    > - kotlin
    >     - com
    >         - mobcat
    >             - pushdemo

1. Back in **Visual Studio Code**, update the **applicationId** value in **android** > **app** > **build.gradle** to `com.<your_organization>.pushdemo`.

    > [!NOTE]
    > You should use your own organization name for the *<your_organization>* placeholder. For example, using **mobcat** as the organization will result in a **package name** value of *com.mobcat.pushdemo*.

1. Update the **package** attribute in the **AndroidManifest.xml** files, under **src** > **debug**, **src** > **main**, and **src** > **profile** respectively. Ensure the values match the **applicationId** you used in the previous step.

    ```xml
    <manifest
        xmlns:android="http://schemas.android.com/apk/res/android"
        package="com.<your_organization>.pushdemo>">
        ...
    </manifest>
    ```

1. Update the ```android:label``` attribute in the **AndroidManifest.xml** file under **src** > **main** to *PushDemo*. Then, add the ```android:allowBackup``` attribute, directly under ```android:label```, setting its value to **false**.

    ```xml
    <application
        android:name="io.flutter.app.FlutterApplication"
        android:label="PushDemo"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher">
        ...
    </application>
    ```

1. Open the app-level **build.gradle** file (**android** > **app** > **build.gradle**), then update the *compileSdkVersion* (from the **android** section) to use API **29**. Then, update the *minSdkVersion* and *targetSdkVersion* values (from the **defaultConfig** section), to **26** and **29** respectively.

    > [!NOTE]
    > Only those devices running **API level 26 and above** are supported for the purposes of this tutorial however you can extend it to support devices running older versions.

1. **Control** + **Click** on the **ios** folder, then choose **Open in Xcode**.

1. In **Xcode**, click on **Runner** (the **xcodeproj** at the top, not the folder). Then, select the **Runner** target and select the **General** tab. With the **All** build configuration selected, update the **Bundle Identifier** to `com.<your_organization>.PushDemo`.

    > [!NOTE]
    > You should use your own organization name for the *<your_organization>* placeholder. For example, using **mobcat** as the organization will result in a **Bundle Identifier** value of *com.mobcat.PushDemo*.

1. Click **Info.plist** then update the **Bundle name** value to **PushDemo**

1. Close **Xcode** and return to **Visual Studio Code**.

1. Back in **Visual Studio Code**, open **pubspec.yaml**, add the [http](https://pub.dev/packages/http) and [flutter_secure_storage](https://pub.dev/packages/flutter_secure_storage) **Dart packages** as dependencies. Then, save the file and click **Get Packages** when prompted to do so.

    ```yaml
    dependencies:
      flutter:
        sdk: flutter

      http: ^0.12.1
      flutter_secure_storage: ^3.3.3
    ```

1. In **Terminal**, change directory to the **ios** folder (for your Flutter project). Then, execute the [**pod install**](https://guides.cocoapods.org/using/getting-started.html#installation) command to install new pods (required by the [flutter_secure_storage](https://pub.dev/packages/flutter_secure_storage) package).

1. **Control** + **Click** on the **lib** folder, then choose **New File** from the menu using *main_page.dart* as the filename. Then, add the following code.

    ```kotlin
    import 'package:flutter/material.dart';

    class MainPage extends StatefulWidget {
      @override
      _MainPageState createState() => _MainPageState();
    }

    class _MainPageState extends State<MainPage> {
      @override
      Widget build(BuildContext context) {
        return Scaffold(
          body: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[],
            )
          )
        );
      }
    }
    ```

1. In **main.dart**, replace the templated code with the following.

    ```dart
    import 'package:flutter/material.dart';
    import 'package:push_demo/main_page.dart';

    final navigatorKey = GlobalKey<NavigatorState>();

    void main() => runApp(MaterialApp(home: MainPage(), navigatorKey: navigatorKey));
    ```

1. In **Terminal**, build and run the app on each target platform to test the templated app runs on your device(s). Make sure that supported devices are connected.

    ```bash
    flutter run
    ```

### Implement the cross-platform components

1. **Control** + **Click** on the **lib** folder, then choose **New Folder** from the menu using *models* as the **Folder Name**.

1. **Control** + **Click** on the **models** folder, then choose **New File** from the menu using *device_installation.dart* as the filename. Then, add the following code.

    ```dart
    class DeviceInstallation {
        final String deviceId;
        final String platform;
        final String token;
        final List<String> tags;

        DeviceInstallation(this.deviceId, this.platform, this.token, this.tags);

        DeviceInstallation.fromJson(Map<String, dynamic> json)
          : deviceId = json['installationId'],
            platform = json['platform'],
            token = json['pushChannel'],
            tags = json['tags'];

        Map<String, dynamic> toJson() =>
        {
          'installationId': deviceId,
          'platform': platform,
          'pushChannel': token,
          'tags': tags,
        };
    }
    ```

1. Add a new file to the **models** folder called *push_demo_action.dart* defining the enumeration of actions being supported in this example.

    ```dart
    enum PushDemoAction {
      actionA,
      actionB,
    }
    ```

1. Add a new folder to the project called **services** then add a new file to that folder called *device_installation_service.dart* with the following implementation.

    ```dart
    import 'package:flutter/services.dart';

    class DeviceInstallationService {
      static const deviceInstallation = const MethodChannel('com.<your_organization>.pushdemo/deviceinstallation');
      static const String getDeviceIdChannelMethod = "getDeviceId";
      static const String getDeviceTokenChannelMethod = "getDeviceToken";
      static const String getDevicePlatformChannelMethod = "getDevicePlatform";

      Future<String> getDeviceId() {
        return deviceInstallation.invokeMethod(getDeviceIdChannelMethod);
      }

      Future<String> getDeviceToken() {
        return deviceInstallation.invokeMethod(getDeviceTokenChannelMethod);
      }

      Future<String> getDevicePlatform() {
        return deviceInstallation.invokeMethod(getDevicePlatformChannelMethod);
      }
    }
    ```

    > [!NOTE]
    > You should use your own organization name for the *<your_organization>* placeholder. For example, using **mobcat** as the organization will result in a [MethodChannel](https://api.flutter.dev/flutter/services/MethodChannel-class.html) name of *com.mobcat.pushdemo/deviceinstallation*.
    >
    > This class encapsulates working with the underlying native platform to acquire the requisite device installation details. A [MethodChannel](https://api.flutter.dev/flutter/services/MethodChannel-class.html) facilitates bidirectional asynchronous communication with the underlying native platforms. The platform-specific counterpart for this channel will be created on the in later steps.

1. Add another file to that folder called *notification_action_service.dart* with the following implementation.

    ```dart
    import 'package:flutter/services.dart';
    import 'dart:async';
    import 'package:push_demo/models/push_demo_action.dart';

    class NotificationActionService {
      static const notificationAction =
          const MethodChannel('com.<your_organization>.pushdemo/notificationaction');
      static const String triggerActionChannelMethod = "triggerAction";
      static const String getLaunchActionChannelMethod = "getLaunchAction";

      final actionMappings = {
        'action_a' : PushDemoAction.actionA,
        'action_b' : PushDemoAction.actionB
      };

      final actionTriggeredController = StreamController.broadcast();

      NotificationActionService() {
        notificationAction
            .setMethodCallHandler(handleNotificationActionCall);
      }

      Stream get actionTriggered => actionTriggeredController.stream;

      Future<void> triggerAction({action: String}) async {

        if (!actionMappings.containsKey(action)) {
          return;
        }

        actionTriggeredController.add(actionMappings[action]);
      }

      Future<void> checkLaunchAction() async {
        final launchAction = await notificationAction.invokeMethod(getLaunchActionChannelMethod) as String;

        if (launchAction != null) {
          triggerAction(action: launchAction);
        }
      }

      Future<void> handleNotificationActionCall(MethodCall call) async {
        switch (call.method) {
          case triggerActionChannelMethod:
            return triggerAction(action: call.arguments as String);
          default:
            throw MissingPluginException();
            break;
        }
      }
    }
    ```

    > [!NOTE]
    > This is used as a simple mechanism to centralize the handling of notification actions so they can be handled in a cross-platform manner using a strongly-typed enumeration. The service enables the underlying native platform to trigger an action, when one is specified in the notification payload. It also enables the common code to retrospectively check whether an action was specified during the application launch once Flutter is ready to process it. For example, when the app is launched by tapping on a notification from notification center.

1. Add a new file to the **services** folder called *notification_registration_service.dart* with the following implementation.

    ```dart
    import 'dart:convert';
    import 'package:flutter/services.dart';
    import 'package:http/http.dart' as http;
    import 'package:push_demo/services/device_installation_service.dart';
    import 'package:push_demo/models/device_installation.dart';
    import 'package:flutter_secure_storage/flutter_secure_storage.dart';

    class NotificationRegistrationService {
      static const notificationRegistration =
          const MethodChannel('com.<your_organization>.pushdemo/notificationregistration');

      static const String refreshRegistrationChannelMethod = "refreshRegistration";
      static const String installationsEndpoint = "api/notifications/installations";
      static const String cachedDeviceTokenKey = "cached_device_token";
      static const String cachedTagsKey = "cached_tags";

      final deviceInstallationService = DeviceInstallationService();
      final secureStorage = FlutterSecureStorage();

      String baseApiUrl;
      String apikey;

      NotificationRegistrationService(this.baseApiUrl, this.apikey) {
        notificationRegistration
            .setMethodCallHandler(handleNotificationRegistrationCall);
      }

      String get installationsUrl => "$baseApiUrl$installationsEndpoint";

      Future<void> deregisterDevice() async {
        final cachedToken = await secureStorage.read(key: cachedDeviceTokenKey);
        final serializedTags = await secureStorage.read(key: cachedTagsKey);

        if (cachedToken == null || serializedTags == null) {
          return;
        }

        var deviceId = await deviceInstallationService.getDeviceId();

        if (deviceId.isEmpty) {
          throw "Unable to resolve an ID for the device.";
        }

        var response = await http
            .delete("$installationsUrl/$deviceId", headers: {"apikey": apikey});

        if (response.statusCode != 200) {
          throw "Deregister request failed: ${response.reasonPhrase}";
        }

        await secureStorage.delete(key: cachedDeviceTokenKey);
        await secureStorage.delete(key: cachedTagsKey);
      }

      Future<void> registerDevice(List<String> tags) async {
        try {
          final deviceId = await deviceInstallationService.getDeviceId();
          final platform = await deviceInstallationService.getDevicePlatform();
          final token = await deviceInstallationService.getDeviceToken();

          final deviceInstallation =
              DeviceInstallation(deviceId, platform, token, tags);

          final response = await http.put(installationsUrl,
              body: jsonEncode(deviceInstallation),
              headers: {"apikey": apikey, "Content-Type": "application/json"});

          if (response.statusCode != 200) {
            throw "Register request failed: ${response.reasonPhrase}";
          }

          final serializedTags = jsonEncode(tags);

          await secureStorage.write(key: cachedDeviceTokenKey, value: token);
          await secureStorage.write(key: cachedTagsKey, value: serializedTags);
        } on PlatformException catch (e) {
          throw e.message;
        } catch (e) {
          throw "Unable to register device: $e";
        }
      }

      Future<void> refreshRegistration() async {
        final currentToken = await deviceInstallationService.getDeviceToken();
        final cachedToken = await secureStorage.read(key: cachedDeviceTokenKey);
        final serializedTags = await secureStorage.read(key: cachedTagsKey);

        if (currentToken == null ||
            cachedToken == null ||
            serializedTags == null ||
            currentToken == cachedToken) {
          return;
        }

        final tags = jsonDecode(serializedTags);

        return registerDevice(tags);
      }

      Future<void> handleNotificationRegistrationCall(MethodCall call) async {
        switch (call.method) {
          case refreshRegistrationChannelMethod:
            return refreshRegistration();
          default:
            throw MissingPluginException();
            break;
        }
      }
    }
    ```

    > [!NOTE]
    > This class encapsulates the use of the **DeviceInstallationService** and the requests to the backend service to perform the requisite register, deregister, and refresh registration actions. The **apiKey** argument is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.

1. Add a new file to the **lib** folder called *config.dart* with the following implementation.

    ```dart
    class Config {
      static String apiKey = "API_KEY";
      static String backendServiceEndpoint = "BACKEND_SERVICE_ENDPOINT";
    }
    ```

    > [!NOTE]
    > This is used as a simple way to define app secrets. Replace the placeholder values with your own. You should have made a note of these when you built the backend service. The **API App URL** should be `https://<api_app_name>.azurewebsites.net/`. The **apiKey** member is only required if you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section.
    >
    > Be sure to add this to your gitignore file to avoid committing these secrets to source control.

### Implement the cross-platform UI

1. In **main_page.dart**, replace the **build** function with the following.

    ```dart
    @override
    Widget build(BuildContext context) {
    return Scaffold(
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              FlatButton(
                child: Text("Register"),
                onPressed: registerButtonClicked,
              ),
              FlatButton(
                child: Text("Deregister"),
                onPressed: deregisterButtonClicked,
              ),
            ],
          ),
        ),
      );
    }
    ```

1. Add the requisite imports to the top of the **main_page.dart** file.

    ```dart
    import 'package:push_demo/services/notification_registration_service.dart';
    import 'config.dart';
    ```

1. Add a field to the **_MainPageState** class to store a reference to the **NotificationRegistrationService**.

    ```dart
    final notificationRegistrationService = NotificationRegistrationService(Config.backendServiceEndpoint, Config.apiKey);
    ```

1. At the **_MainPageState** class, implement the event handlers for the **Register** and **Deregister** buttons **onPressed** events. Call the corresponding **Register**/**Deregister** methods then show an alert to indicate the result.

    ```dart
    void registerButtonClicked() async {
        try {
          await notificationRegistrationService.registerDevice(List<String>());
          await showAlert(message: "Device registered");
        }
        catch (e) {
          await showAlert(message: e);
        }
      }

      void deregisterButtonClicked() async {
        try {
          await notificationRegistrationService.deregisterDevice();
          await showAlert(message: "Device deregistered");
        }
        catch (e) {
          await showAlert(message: e);
        }
      }

      Future<void> showAlert({ message: String }) async {
        return showDialog<void>(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('PushDemo'),
              content: SingleChildScrollView(
                child: ListBody(
                  children: <Widget>[
                    Text(message),
                  ],
                ),
              ),
              actions: <Widget>[
                FlatButton(
                  child: Text('OK'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            );
          },
        );
      }
    ```

1. Now in **main.dart**, ensure the following imports are present at the top of the file.

    ```dart
    import 'package:flutter/material.dart';
    import 'package:push_demo/models/push_demo_action.dart';
    import 'package:push_demo/services/notification_action_service.dart';
    import 'package:push_demo/main_page.dart';
    ```

1. Declare a variable to store reference to an instance of **NotificationActionService** and initialize it.

    ```dart
    final notificationActionService = NotificationActionService();
    ```

1. Add functions to handle the display of an alert when an action is triggered.

    ```dart
    void notificationActionTriggered(PushDemoAction action) {
      showActionAlert(message: "${action.toString().split(".")[1]} action received");
    }

    Future<void> showActionAlert({ message: String }) async {
      return showDialog<void>(
        context: navigatorKey.currentState.overlay.context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('PushDemo'),
            content: SingleChildScrollView(
              child: ListBody(
                children: <Widget>[
                  Text(message),
                ],
              ),
            ),
            actions: <Widget>[
              FlatButton(
                child: Text('OK'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
    ```

1. Update the **main** function to observe the **NotificationActionService** **actionTriggered** stream and check for any actions captured during app launch.

    ```dart
    void main() async {
      runApp(MaterialApp(home: MainPage(), navigatorKey: navigatorKey,));
      notificationActionService.actionTriggered.listen((event) { notificationActionTriggered(event as PushDemoAction); });
      await notificationActionService.checkLaunchAction();
    }
    ```

    > [!NOTE]
    > This is simply to demonstrate the receipt and propagation of push notification actions. Typically, these would be handled silently for example navigating to a specific view or refreshing some data rather than displaying an alert in this case.
