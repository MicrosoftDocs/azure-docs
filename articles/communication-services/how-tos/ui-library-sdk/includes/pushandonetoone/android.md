---
description: In this tutorial how to use the Calling composite on Android.
author: iaulakh

ms.author: iaulakh
ms.date: 12/19/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Prerequisites for Push Notifications

A Firebase account set up with Cloud Messaging (FCM) enabled and with your Firebase Cloud Messaging service connected to an Azure Notification Hub instance. See [Communication Services notifications](../../../../concepts/notifications.md) for more information.
Additionally, the tutorial assumes you're using Android Studio version 3.6 or higher to build your application.

A set of permissions is required for the Android application in order to be able to receive notifications messages from Firebase Cloud Messaging. In your `AndroidManifest.xml` file, add the following set of permissions right after the `<manifest ...>` or the `</application>` tag.

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.GET_ACCOUNTS"/>
<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
```

### Register for push notification

To register for push notifications, the application needs to call `registerPushNotification()` on a `CallComposite` instance with a device registration token.

To obtain the device registration token, add the Firebase SDK to your application module's `build.gradle`. To receive notification from Firebase, integrate Azure Notification Hub following [Communication Services notifications](https://learn.microsoft.com/en-us/azure/communication-services/concepts/notifications).

You can skip `registerPushNotification` to avoid current limitation by using Event Grid [Current limitations with the Push Notification model](https://learn.microsoft.com/en-us/azure/communication-services/tutorials/add-voip-push-notifications-event-grid).

#### [Kotlin](#tab/kotlin)

```kotlin
    val deviceRegistrationToken = "" // from Firebase
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
    String deviceRegistrationToken = ""; // from Firebase
    callComposite.registerPushNotification(
            applicationContext,
            new CallCompositePushNotificationOptions(tokenCredential,
                    deviceRegistrationToken,
                    "DISPLAY_NAME"),
            (result) -> {
                // Handle success/failure
            });
```

### Handle push notification

To receive incoming call push notifications, call `handlePushNotification` on a `CallComposite` instance with a payload.

To obtain the payload from Firebase Cloud Messaging, begin by creating a new Service (File > New > Service > Service) that extends the `FirebaseMessagingService`. Firebase SDK class and override the `onMessageReceived` method. This method is the event handler called when, Firebase Cloud Messaging delivers the push notification to the application.

#### [Kotlin](#tab/kotlin)

```kotlin
    // on Firebase onMessageReceived
    val pushNotificationInfo = CallCompositePushNotificationInfo(remoteMessage.data)

    // if pushNotificationInfo.eventType is incoming call
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
    // on Firebase onMessageReceived
    CallCompositePushNotificationInfo pushNotificationInfo = 
            new CallCompositePushNotificationInfo(remoteMessage.data)

    // if pushNotificationInfo.eventType is incoming call
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

### Register for incoming call notification

To receive incoming call notification after `handlePushNotification` subscribe to `IncomingCallEvent` and `IncomingCallEndEvent`.

#### [Kotlin](#tab/kotlin)

```kotlin
    private var incomingCallEvent: IncomingCallEvent? = null
    private var incomingCallEndEvent: IncomingCallEndEvent? = null

    class IncomingCallEndEvent : CallCompositeEventHandler<CallCompositeIncomingCallEndEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallEndEvent?) {
            // display incoming call UI to accept/decline call
        }
    }

    class IncomingCallEndEvent : CallCompositeEventHandler<CallCompositeIncomingCallEndEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallEndEvent?) {
            // call ended event when call is declined or not accepted
        }
    }

    // event subscription
    incomingCallEvent = IncomingCallEvent()
    callComposite.addOnIncomingCallEventHandler(incomingCallEvent)

    incomingCallEndEvent = IncomingCallEndEvent()
    callComposite.addOnIncomingCallEndEventHandler(incomingCallEndEvent)

    // event unsubscribe
    callComposite.removeOnIncomingCallEventHandler(incomingCallEvent)
    callComposite.removeOnIncomingCallEndEventHandler(incomingCallEndEvent)
```

#### [Java](#tab/java)

```java
    callComposite.addOnIncomingCallEventHandler((call) -> {
        // display incoming call UI to accept/decline call
    });

    callComposite.addOnIncomingCallEndEventHandler((call) -> {
        // call ended event when call is declined or not accepted
    });
```

### Call handling

To accept call, make call to `acceptIncomingCall` and to decline call to `declineIncomingCall`.

#### [Kotlin](#tab/kotlin)

```kotlin
// accept call
callComposite.acceptIncomingCall(applicationContext, localOptions)

// decline call
callComposite.declineIncomingCall()
```

#### [Java](#tab/java)

```java
// accept call
callComposite.acceptIncomingCall(applicationContext, localOptions);

// decline call
callComposite.declineIncomingCall();
```

### Dial other participants

To start call with other participants, create `CallCompositeStartCallOptions` with participants raw id's from `CommunicationIdentity` and `launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
    val participant = [] // participant identifiers raw id's
    val startCallOption = CallCompositeStartCallOptions(participant)
    val remoteOptions = CallCompositeRemoteOptions(startCallOption, communicationTokenCredential, displayName)
    callComposite.launch(context, remoteOptions, localOptions)
```

#### [Java](#tab/java)

```java
    List<String> participant; // participant identifiers raw id's
    CallCompositeStartCallOptions startCallOption =
            new CallCompositeStartCallOptions(participant);
    CallCompositeRemoteOptions remoteOptions = CallCompositeRemoteOptions(startCallOption,
            tokenCredential,
            "DISPLAY_NAME");
    callComposite.launch(applicationContext, remoteOptions, localOptions);
```

### Telecom manager sample

To integrate [Telecom Manager](https://developer.android.com/reference/android/telecom/TelecomManager), the samples are provided at [open source library](https://github.com/Azure/communication-ui-library-android) can use API's to `hold`, `resume`, `mute` and `unmute`.

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