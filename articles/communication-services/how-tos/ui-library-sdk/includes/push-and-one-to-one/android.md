---
description: Learn how to use the Calling composite on Android.
author: iaulakh

ms.author: iaulakh
ms.date: 12/19/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Set up permissions for push notifications

To set up push notifications, you need a Firebase account with Firebase Cloud Messaging (FCM) enabled. Your FCM service must be connected to an Azure Notification Hubs instance. For more information, see [Communication Services notifications](../../../../concepts/notifications.md). You also need to use Android Studio version 3.6 or later to build your application.

For the Android application to receive notification messages from FCM, it needs a set of permissions. In your `AndroidManifest.xml` file, add the following set of permissions after the `<manifest ...>` or `</application>` tag.

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.GET_ACCOUNTS"/>
<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
```

### Register for push notifications

To register for push notifications, the application needs to call `registerPushNotification()` on a `CallComposite` instance with a device registration token.

To get the device registration token, add the Firebase SDK to your application module's `build.gradle` instance. To receive notifications from Firebase, integrate Azure Notification Hubs by following the instructions in [Communication Services notifications](/azure/communication-services/concepts/notifications).

To avoid current limitations, you can skip `registerPushNotification` by using Azure Event Grid for push notifications. For more information, see [Connect calling native push notifications with Azure Event Grid](/azure/communication-services/tutorials/add-voip-push-notifications-event-grid).

#### [Kotlin](#tab/kotlin)

```kotlin
    val deviceRegistrationToken = "" // From Firebase
    callComposite.registerPushNotification(
        applicationContext,
        CallCompositePushNotificationOptions(
            CommunicationTokenCredential...,
            deviceRegistrationToken,
            displayName
        )
    )
```

#### [Java](#tab/java)

```java
    String deviceRegistrationToken = ""; // From Firebase
    callComposite.registerPushNotification(
            applicationContext,
            new CallCompositePushNotificationOptions(tokenCredential,
                    deviceRegistrationToken,
                    "DISPLAY_NAME"),
            (result) -> {
                // Handle success/failure
            });
```

-----

### Handle push notifications

To receive push notifications for incoming calls, call `handlePushNotification` on a `CallComposite` instance with a payload.

To get the payload from FCM, begin by creating a new service (**File** > **New** > **Service** > **Service**) that extends the `FirebaseMessagingService` Firebase SDK class and overrides the `onMessageReceived` method. This method is the event handler that's called when FCM delivers the push notification to the application.

#### [Kotlin](#tab/kotlin)

```kotlin
    // On Firebase onMessageReceived
    val pushNotificationInfo = CallCompositePushNotificationInfo(remoteMessage.data)

    // If pushNotificationInfo.eventType is an incoming call
    val remoteOptions = CallCompositeRemoteOptions(
            pushNotificationInfo,
            communicationTokenCredential,
            displayName
        )
    callComposite.handlePushNotification(
            applicationContext,
            remoteOptions
        )
```

#### [Java](#tab/java)

```java
    // On Firebase onMessageReceived
    CallCompositePushNotificationInfo pushNotificationInfo = 
            new CallCompositePushNotificationInfo(remoteMessage.data)

    // If pushNotificationInfo.eventType is an incoming call
    CallCompositeRemoteOptions remoteOptions = new CallCompositeRemoteOptions(
            pushNotificationInfo,
            tokenCredential,
            "DISPLAY_NAME"
    );
    callComposite.handlePushNotification(
            applicationContext,
            remoteOptions
    );
```

-----

### Register for incoming call notifications

To receive incoming call notifications after `handlePushNotification`, subscribe to `IncomingCallEvent` and `IncomingCallEndEvent`.

#### [Kotlin](#tab/kotlin)

```kotlin
    private var incomingCallEvent: IncomingCallEvent? = null
    private var incomingCallEndEvent: IncomingCallEndEvent? = null

    class IncomingCallEndEvent : CallCompositeEventHandler<CallCompositeIncomingCallEndEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallEndEvent?) {
            // Display incoming call UI to accept/decline a call
        }
    }

    class IncomingCallEndEvent : CallCompositeEventHandler<CallCompositeIncomingCallEndEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallEndEvent?) {
            // Call-ended event when a call is declined or not accepted
        }
    }

    // Event subscription
    incomingCallEvent = IncomingCallEvent()
    callComposite.addOnIncomingCallEventHandler(incomingCallEvent)

    incomingCallEndEvent = IncomingCallEndEvent()
    callComposite.addOnIncomingCallEndEventHandler(incomingCallEndEvent)

    // Event unsubscribe
    callComposite.removeOnIncomingCallEventHandler(incomingCallEvent)
    callComposite.removeOnIncomingCallEndEventHandler(incomingCallEndEvent)
```

#### [Java](#tab/java)

```java
    callComposite.addOnIncomingCallEventHandler((call) -> {
        // Display incoming call UI to accept/decline a call
    });

    callComposite.addOnIncomingCallEndEventHandler((call) -> {
        // Call-ended event when a call is declined or not accepted
    });
```

-----

### Handle calls

To accept calls, make a call to `acceptIncomingCall`. To decline calls, make a call to `declineIncomingCall`.

#### [Kotlin](#tab/kotlin)

```kotlin
// Accept call
callComposite.acceptIncomingCall(applicationContext, localOptions)

// Decline call
callComposite.declineIncomingCall()
```

#### [Java](#tab/java)

```java
// Accept call
callComposite.acceptIncomingCall(applicationContext, localOptions);

// Decline call
callComposite.declineIncomingCall();
```

-----

### Dial other participants

To start calls with other participants, create `CallCompositeStartCallOptions` with participants' raw IDs from `CommunicationIdentity` and `launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
    val participant = [] // Participant raw IDs
    val startCallOption = CallCompositeStartCallOptions(participant)
    val remoteOptions = CallCompositeRemoteOptions(startCallOption, communicationTokenCredential, displayName)
    callComposite.launch(context, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
    List<String> participant; // Participant raw IDs
    CallCompositeStartCallOptions startCallOption =
            new CallCompositeStartCallOptions(participant);
    CallCompositeRemoteOptions remoteOptions = CallCompositeRemoteOptions(startCallOption,
            tokenCredential,
            "DISPLAY_NAME");
    callComposite.launch(applicationContext, remoteOptions, localOptions);
```

-----

### Integrate TelecomManager samples

To integrate [TelecomManager](https://developer.android.com/reference/android/telecom/TelecomManager), use the samples provided in the [open-source library](https://github.com/Azure/communication-ui-library-android). Use  `CallComposite` APIs for `hold`, `resume`, `mute`, and `unmute`. Create `CallComposite` with `CallCompositeTelecomIntegration.APPLICATION_IMPLEMENTED_TELECOM_MANAGER` to use `TelecomManager` in an application.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.hold()
callComposite.resume()
callComposite.mute()
callComposite.unmute()
```

#### [Java](#tab/java)

```java
callComposite.hold();
callComposite.resume();
callComposite.mute();
callComposite.unmute();
```

-----
