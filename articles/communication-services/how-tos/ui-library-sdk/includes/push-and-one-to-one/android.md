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

### Add incoming notifications to your mobile app

Azure Communication Services integrates with [Azure Event Grid](../../../../../event-grid/overview.md) and [Azure Notification Hubs](../../../../../notification-hubs/notification-hubs-push-notification-overview.md), so you can [add push notifications](../../../../concepts/notifications.md) to your apps in Azure. 

### Register/Unregister for notification hub push notifications

To register for push notifications, the application needs to call `registerPushNotification()` on a `CallComposite` instance with a device registration token.

To get the device registration token, add the Firebase SDK to your application module's `build.gradle` instance. To receive notifications from Firebase, integrate Azure Notification Hubs by following the instructions in [Communication Services notifications](/azure/communication-services/concepts/notifications).

#### [Kotlin](#tab/kotlin)

```kotlin
    val deviceRegistrationToken = "" // From Firebase
    callComposite.registerPushNotification(deviceRegistrationToken).whenComplete { _, throwable ->
        if (throwable != null) {
            // Handle error
        }
    }
```

#### [Java](#tab/java)

```java
    String deviceRegistrationToken = ""; // From Firebase
    callComposite.registerPushNotification(deviceRegistrationToken)
    .whenComplete((aVoid, throwable) -> {
            if (throwable != null) {
                // Handle error
            }
    });
```

-----

### Handle push notifications received from Event Grid or notification hub

To receive push notifications for incoming calls, call `handlePushNotification` on a `CallComposite` instance with a payload.

To get the payload from FCM, begin by creating a new service (**File** > **New** > **Service** > **Service**) that extends the `FirebaseMessagingService` Firebase SDK class and overrides the `onMessageReceived` method. This method is the event handler that called when FCM delivers the push notification to the application.

#### [Kotlin](#tab/kotlin)

```kotlin
    // On Firebase onMessageReceived
    val pushNotification = CallCompositePushNotification(remoteMessage.data)
    callComposite.handlePushNotification(pushNotification).whenComplete { _, throwable ->
        if (throwable != null) {
            // Handle error
        }
    }
```

#### [Java](#tab/java)

```java
    // On Firebase onMessageReceived
    // push notification contains from/to communication identifiers and event type
    CallCompositePushNotification pushNotification = 
            new CallCompositePushNotification(remoteMessage.data)

    callComposite.handlePushNotification(pushNotification)
    .whenComplete((aVoid, throwable) -> {
            if (throwable != null) {
                // Handle error
            }
    });
```

-----

### Register for incoming call notifications

To receive incoming call notifications after `handlePushNotification`, subscribe to `CallCompositeIncomingCallEvent` and `CallCompositeIncomingCallCancelledEvent`. `CallCompositeIncomingCallEvent` contains the incoming callId and caller information. `CallCompositeIncomingCallCancelledEvent` contains callId and call cancellation code [Troubleshooting in Azure Communication Services](../../../../concepts/troubleshooting-info.md#calling-sdk-error-codes).

#### [Kotlin](#tab/kotlin)

```kotlin
    private var incomingCallEvent: IncomingCallEvent? = null
    private var incomingCallCancelledEvent: IncomingCallCancelledEvent? = null

    class IncomingCallEvent : CallCompositeEventHandler<CallCompositeIncomingCallEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallEvent?) {
            // Display incoming call UI to accept/decline a call
            // CallCompositeIncomingCallEvent contains call id and caller information
        }
    }

    class IncomingCallCancelledEvent : CallCompositeEventHandler<CallCompositeIncomingCallCancelledEvent> {
        override fun handle(eventArgs: CallCompositeIncomingCallCancelledEvent?) {
            // Call-ended event when a call is declined or not accepted
        }
    }

    // Event subscription
    incomingCallEvent = IncomingCallEvent()
    callComposite.addOnIncomingCallEventHandler(incomingCallEvent)

    incomingCallCancelledEvent = IncomingCallCancelledEvent()
    callComposite.addOnIncomingCallCancelledEventHandler(incomingCallEndEvent)

    // Event unsubscribe
    callComposite.removeOnIncomingCallEventHandler(incomingCallEvent)
    callComposite.removeOnIncomingCallCancelledEventHandler(incomingCallEndEvent)
```

#### [Java](#tab/java)

```java
    callComposite.addOnIncomingCallEventHandler((call) -> {
        // Display incoming call UI to accept/decline a call
        // incomingCallEvent.getCallId()
        // incomingCallEvent.getCallerIdentifier()
        // incomingCallEvent.getCallerDisplayName()
    });

    callComposite.addOnIncomingCallCancelledEventHandler((call) -> {
        // Call-ended event when a call is declined or not accepted
        // incomingCallCancelledEvent.getCallId()
        // incomingCallCancelledEvent.getCode()
        // incomingCallCancelledEvent.getSubCode()
    });
```

-----

### Handle calls

To accept calls, make a call to `accept`. To decline calls, make a call to `reject`.

#### [Kotlin](#tab/kotlin)

```kotlin
// Accept call
callComposite.accept(applicationContext, incomingCallId, localOptions)

// Decline call
callComposite.reject(incomingCallId)
```

#### [Java](#tab/java)

```java
// Accept call
callComposite.accept(applicationContext, incomingCallId, localOptions);

// Decline call
callComposite.reject(incomingCallId);
```

-----

### Dial other participants

To start calls with other participants, create `CallCompositeStartCallOptions` with participants' raw IDs from `CommunicationIdentity` and `launch`.

#### [Kotlin](#tab/kotlin)

```kotlin
    val participants: List<CommunicationIdentifier> // participants to dial
    callComposite.launch(context, participants, localOptions)
```

#### [Java](#tab/java)

```java
    Collection<CommunicationIdentifier> participants; // participants to dial
    callComposite.launch(applicationContext, participants, localOptions);
```

-----
