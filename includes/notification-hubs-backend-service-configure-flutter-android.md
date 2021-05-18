---
 author: mikeparker104
 ms.author: miparker
 ms.date: 07/07/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Add the Google Services JSON file

1. **Control** + **Click** on the **android** folder, then choose **Open in Android Studio**. Then, switch to the **Project** view (if it's not already).

1. Locate the *google-services.json* file you downloaded earlier when you set up the **PushDemo** project in the [Firebase Console](https://console.firebase.google.com). Then, drag it into the **app** module root directory (**android** > **android** > **app**).

### Configure build settings and permissions

1. Switch the **Project** view to **Android**.

1. Open **AndroidManifest.xml**, then add the **INTERNET** and **READ_PHONE_STATE** permissions after the **application** element before the closing **</manifest>** tag.

    ```xml
    <manifest>
        <application>...</application>
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    </manifest>
    ```

### Add the Firebase SDKs

1. In **Android Studio**, open the project-level **build.gradle** file (**Gradle Scripts** > **build.gradle (Project: android)**). and ensure you have the `com.google.gms:google-services' classpath in the ``buildscript`` > **dependencies** node.

    ```json
    buildscript {

      repositories {
        // Check that you have the following line (if not, add it):
        google()  // Google's Maven repository
      }

      dependencies {
        // ...

        // Add the following line:
        classpath 'com.google.gms:google-services:4.3.3'  // Google Services plugin
      }
    }

    allprojects {
      // ...

      repositories {
        // Check that you have the following line (if not, add it):
        google()  // Google's Maven repository
        // ...
      }
    }
    ```

    > [!NOTE]
    > Ensure you reference the latest version as per the instructions provided in the [Firebase Console](https://console.firebase.google.com) when you created the **Android Project**.

1. In the app-level **build.gradle** file (**Gradle Scripts** > **build.gradle (Module: app)**), apply the **Google Services Gradle plugin**. Apply the plugin right above the **android** node.

    ```json
    // ...

    // Add the following line:
    apply plugin: 'com.google.gms.google-services'  // Google Services plugin

    android {
      // ...
    }
    ```

1. In the same file, in the **dependencies** node, add the dependency for the **Cloud Messaging** Android library.

    ```json
    dependencies {
        // ...
        implementation 'com.google.firebase:firebase-messaging:20.2.0'
    }
    ```

    > [!NOTE]
    > Ensure you reference the latest version as per the [Cloud Messaging Android client documentation](https://firebase.google.com/docs/cloud-messaging/android/client).

1. Save the changes, then click on the **Sync Now** button (from the toolbar prompt) or **Sync Project with Gradle Files**.

### Handle Push Notifications for Android

1. In **Android Studio**, **Control** + **Click** on the **com.<your_organization>.pushdemo** package folder (**app** > **src** > **main** > **kotlin**), choose **Package** from the **New** menu. Enter **services** as the name, then press **Return**.

1. **Control** + **Click** on the **services** folder, choose **Kotlin File/Class** from the **New** menu. Enter **DeviceInstallationService** as the name, then press **Return**.

1. Implement the **DeviceInstallationService** using the following code.

    ```kotlin
    package com.<your_organization>.pushdemo.services

    import android.annotation.SuppressLint
    import android.content.Context
    import android.provider.Settings.Secure
    import com.google.android.gms.common.ConnectionResult
    import com.google.android.gms.common.GoogleApiAvailability
    import io.flutter.embedding.engine.FlutterEngine
    import io.flutter.plugin.common.MethodCall
    import io.flutter.plugin.common.MethodChannel

    @SuppressLint("HardwareIds")
    class DeviceInstallationService {

        companion object {
            const val DEVICE_INSTALLATION_CHANNEL = "com.<your_organization>.pushdemo/deviceinstallation"
            const val GET_DEVICE_ID = "getDeviceId"
            const val GET_DEVICE_TOKEN = "getDeviceToken"
            const val GET_DEVICE_PLATFORM = "getDevicePlatform"
        }

        private var context: Context
        private var deviceInstallationChannel : MethodChannel

        val playServicesAvailable
            get() = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS

        constructor(context: Context, flutterEngine: FlutterEngine) {
            this.context = context
            deviceInstallationChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, DEVICE_INSTALLATION_CHANNEL)
            deviceInstallationChannel.setMethodCallHandler { call, result -> handleDeviceInstallationCall(call, result) }
        }

        fun getDeviceId() : String
            = Secure.getString(context.applicationContext.contentResolver, Secure.ANDROID_ID)

        fun getDeviceToken() : String {
            if(!playServicesAvailable) {
                throw Exception(getPlayServicesError())
            }

            // TODO: Revisit once we have created the PushNotificationsFirebaseMessagingService
            val token = "Placeholder_Get_Value_From_FirebaseMessagingService_Implementation"

            if (token.isNullOrBlank()) {
                throw Exception("Unable to resolve token for FCM.")
            }

            return token
        }

        fun getDevicePlatform() : String = "fcm"

        private fun handleDeviceInstallationCall(call: MethodCall, result: MethodChannel.Result) {
            when (call.method) {
                GET_DEVICE_ID -> {
                    result.success(getDeviceId())
                }
                GET_DEVICE_TOKEN -> {
                    getDeviceToken(result)
                }
                GET_DEVICE_PLATFORM -> {
                    result.success(getDevicePlatform())
                }
                else -> {
                    result.notImplemented()
                }
            }
        }

        private fun getDeviceToken(result: MethodChannel.Result) {
            try {
                val token = getDeviceToken()
                result.success(token)
            }
            catch (e: Exception) {
                result.error("ERROR", e.message, e)
            }
        }

        private fun getPlayServicesError(): String {
            val resultCode = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context)

            if (resultCode != ConnectionResult.SUCCESS) {
                return if (GoogleApiAvailability.getInstance().isUserResolvableError(resultCode)){
                    GoogleApiAvailability.getInstance().getErrorString(resultCode)
                } else {
                    "This device is not supported"
                }
            }

            return "An error occurred preventing the use of push notifications"
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/deviceinstallation` channel. This was defined in the Flutter portion of the app within **DeviceInstallationService.dart**. In this case, the calls are made from the common code to the native host. Be sure to replace **<your_organization>** with your own organization wherever this is used.
    >
    > This class provides a unique ID (using [Secure.AndroidId](https://developer.android.com/reference/android/provider/Settings.Secure#ANDROID_ID)) as part of the notification hub registration payload.

1. Add another **Kotlin File/Class** to the **services** folder called *NotificationRegistrationService*, then add the following code.

    ```kotlin
    package com.<your_organization>.pushdemo.services

    import io.flutter.embedding.engine.FlutterEngine
    import io.flutter.plugin.common.MethodChannel

    class NotificationRegistrationService {

        companion object {
            const val NOTIFICATION_REGISTRATION_CHANNEL = "com.<your_organization>.pushdemo/notificationregistration"
            const val REFRESH_REGISTRATION = "refreshRegistration"
        }

        private var notificationRegistrationChannel : MethodChannel

        constructor(flutterEngine: FlutterEngine) {
            notificationRegistrationChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, NotificationRegistrationService.NOTIFICATION_REGISTRATION_CHANNEL)
        }

        fun refreshRegistration() {
            notificationRegistrationChannel.invokeMethod(REFRESH_REGISTRATION, null)
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/notificationregistration` channel. This was defined in the Flutter portion of the app within **NotificationRegistrationService.dart**. In this case, the calls are made from the native host to the common code. Again, take care to replace **<your_organization>** with your own organization wherever this is used.

1. Add another **Kotlin File/Class** to the **services** folder called *NotificationActionService*, then add the following code.

    ```kotlin
    package com.<your_organization>.pushdemo.services

    import io.flutter.embedding.engine.FlutterEngine
    import io.flutter.plugin.common.MethodCall
    import io.flutter.plugin.common.MethodChannel

    class NotificationActionService {
        companion object {
            const val NOTIFICATION_ACTION_CHANNEL = "com.<your_organization>.pushdemo/notificationaction"
            const val TRIGGER_ACTION = "triggerAction"
            const val GET_LAUNCH_ACTION = "getLaunchAction"
        }

        private var notificationActionChannel : MethodChannel
        var launchAction : String? = null

        constructor(flutterEngine: FlutterEngine) {
            notificationActionChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, NotificationActionService.NOTIFICATION_ACTION_CHANNEL)
            notificationActionChannel.setMethodCallHandler { call, result -> handleNotificationActionCall(call, result) }
        }

        fun triggerAction(action: String) {
            notificationActionChannel.invokeMethod(NotificationActionService.TRIGGER_ACTION, action)
        }

        private fun handleNotificationActionCall(call: MethodCall, result: MethodChannel.Result) {
            when (call.method) {
                NotificationActionService.GET_LAUNCH_ACTION -> {
                    result.success(launchAction)
                }
                else -> {
                    result.notImplemented()
                }
            }
        }
    }
    ```

    > [!NOTE]
    > This class implements the platform-specific counterpart for the `com.<your_organization>.pushdemo/notificationaction` channel. That was defined in the Flutter portion of the app within **NotificationActionService.dart**. Calls can be made in both directions in this case. Be sure to replace **<your_organization>** with your own organization wherever this is used.

1. Add a new **Kotlin File/Class** to the **com.<your_organization>.pushdemo** package called *PushNotificationsFirebaseMessagingService*, then implement using the following code.

    ```kotlin
    package com.<your_organization>.pushdemo

    import android.os.Handler
    import android.os.Looper
    import com.google.firebase.messaging.FirebaseMessagingService
    import com.google.firebase.messaging.RemoteMessage
    import com.<your_organization>.pushdemo.services.NotificationActionService
    import com.<your_organization>.pushdemo.services.NotificationRegistrationService

    class PushNotificationsFirebaseMessagingService : FirebaseMessagingService() {

        companion object {
            var token : String? = null
            var notificationRegistrationService : NotificationRegistrationService? = null
            var notificationActionService : NotificationActionService? = null
        }

        override fun onNewToken(token: String) {
            PushNotificationsFirebaseMessagingService.token = token
            notificationRegistrationService?.refreshRegistration()
        }

        override fun onMessageReceived(message: RemoteMessage) {
            message.data.let {
                Handler(Looper.getMainLooper()).post {
                    notificationActionService?.triggerAction(it.getOrDefault("action", null))
                }
            }
        }
    }
    ```

    > [!NOTE]
    > This class is responsible for handling notifications when the app is running in the foreground. It will conditionally call the **triggerAction** on the **NotificationActionService** if an action is included in the notification payload that is received in **onMessageReceived**. This will also call **refreshRegistration** on the **NotificationRegistrationService** when the **Firebase** token gets regenerated by overriding the **onNewToken** function.
    >
    > Once again, take care to replace **<your_organization>** with your own organization wherever it is used.

1. In **AndroidManifest.xml** (**app** > **src** > **main**), add the **PushNotificationsFirebaseMessagingService** to the bottom of the **application** element with the `com.google.firebase.MESSAGING_EVENT` intent filter.

    ```xml
    <manifest>
        <application>
            <!-- EXISTING MANIFEST CONTENT -->
             <service
                android:name="com.<your_organization>.pushdemo.PushNotificationsFirebaseMessagingService"
                android:exported="false">
                <intent-filter>
                    <action android:name="com.google.firebase.MESSAGING_EVENT" />
                </intent-filter>
            </service>
        </application>
    </manifest>
    ```

1. Back in **DeviceInstallationService**, ensure the following imports are present at the top of the file.

    ```kotlin
    package com.<your_organization>.pushdemo
    import com.<your_organization>.pushdemo.services.PushNotificationsFirebaseMessagingService
    ```

    > [!NOTE]
    > Replace **<your_organization>** with your own organization value.

1. Update the placeholder text *Placeholder_Get_Value_From_FirebaseMessagingService_Implementation* to get the token value from the **PushNotificationFirebaseMessagingService**.

    ```kotlin
    fun getDeviceToken() : String {
        if(!playServicesAvailable) {
            throw Exception(getPlayServicesError())
        }

        // Get token from the PushNotificationsFirebaseMessagingService.token field.
        val token = PushNotificationsFirebaseMessagingService.token

        if (token.isNullOrBlank()) {
            throw Exception("Unable to resolve token for FCM.")
        }

        return token
    }
    ```

1. In **MainActivity**, ensure the following imports are present at the top of the file.

    ```kotlin
    package com.<your_organization>.pushdemo

    import android.content.Intent
    import android.os.Bundle
    import com.google.android.gms.tasks.OnCompleteListener
    import com.google.firebase.iid.FirebaseInstanceId
    import com.<your_organization>.pushdemo.services.DeviceInstallationService
    import com.<your_organization>.pushdemo.services.NotificationActionService
    import com.<your_organization>.pushdemo.services.NotificationRegistrationService
    import io.flutter.embedding.android.FlutterActivity
    ```

    > [!NOTE]
    > Replace **<your_organization>** with your own organization value.

1. Add a variable to store a reference to the **DeviceInstallationService**.

    ```kotlin
    private lateinit var deviceInstallationService: DeviceInstallationService
    ```

1. Add a function called **processNotificationActions** to check whether an **Intent** has an extra value named **action**. Conditionally trigger that action or store it for use later if the action is being processed during app launch.

    ```kotlin
     private fun processNotificationActions(intent: Intent, launchAction: Boolean = false) {
        if (intent.hasExtra("action")) {
            var action = intent.getStringExtra("action");

            if (action.isNotEmpty()) {
                if (launchAction) {
                    PushNotificationsFirebaseMessagingService.notificationActionService?.launchAction = action
                }
                else {
                    PushNotificationsFirebaseMessagingService.notificationActionService?.triggerAction(action)
                }
            }
        }
    }
    ```

1. Override the **onNewIntent** function to call **processNotificationActions**.

    ```kotlin
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        processNotificationActions(intent)
    }
    ```

    > [!NOTE]
    > Since the **LaunchMode** for **MainActivity** is set to **SingleTop**, an **Intent** will be sent to the existing **Activity** instance via the **onNewIntent** function rather than the **onCreate** function and so you must handle an incoming **Intent** in both **onCreate** and **onNewIntent** functions.

1. Override the **onCreate** function, set the **deviceInstallationService** to a new instance of **DeviceInstallationService**.

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        flutterEngine?.let {
            deviceInstallationService = DeviceInstallationService(context, it)
        }
    }
    ```

1. Set the **notificationActionService** and **notificationRegistrationService** properties on **PushNotificationFirebaseMessagingServices**.

    ```kotlin
    flutterEngine?.let {
      deviceInstallationService = DeviceInstallationService(context, it)
      PushNotificationsFirebaseMessagingService.notificationActionService = NotificationActionService(it)
      PushNotificationsFirebaseMessagingService.notificationRegistrationService = NotificationRegistrationService(it)
    }
    ```

1. In the same function, conditionally call **FirebaseInstanceId.getInstance().instanceId**. Implement the **OnCompleteListener** to set the resulting **token** value on **PushNotificationFirebaseMessagingService** before calling **refreshRegistration**.

    ```kotlin
    if(deviceInstallationService?.playServicesAvailable) {
        FirebaseInstanceId.getInstance().instanceId
            .addOnCompleteListener(OnCompleteListener { task ->
                if (!task.isSuccessful)
                    return@OnCompleteListener

                PushNotificationsFirebaseMessagingService.token = task.result?.token
                PushNotificationsFirebaseMessagingService.notificationRegistrationService?.refreshRegistration()
            })
    }
    ```

1. Still in **onCreate**, call **processNotificationActions** at the end of the function. Use *true* for the *launchAction* argument to indicate this action is being processed during app launch.

    ```kotlin
    processNotificationActions(this.intent, true)
    ```

> [!NOTE]
> You must re-register the app each time you run it and stop it from a debug session to continue receiving push notifications.
