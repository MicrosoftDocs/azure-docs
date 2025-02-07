---
author: sanathr
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/06/2024
ms.author: sanathr
---

- A Firebase account with Firebase Cloud Messaging (FCM) enabled and with your FCM service connected to an Azure Notification Hubs instance. For more information, see [Communication Services notifications](../../../../concepts/notifications.md).
- Android Studio version 3.6 or later to build your application.
- A set of permissions to enable the Android application to receive notification messages from FCM. In your `AndroidManifest.xml` file, add the following permissions right after `<manifest ...>` or below the `</application>` tag:

  ```xml
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.GET_ACCOUNTS"/>
  <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
  ```

> [!IMPORTANT]
> On June 20, 2023, Google announced that it [deprecated sending messages by using the FCM legacy APIs](https://firebase.google.com/docs/cloud-messaging) and would start removing the legacy FCM from service in June 2024. Google recommends [migrating from legacy FCM APIs to FCM HTTP v1](https://firebase.google.com/docs/cloud-messaging/migrate-v1).
>
> If your Communication Services resource is still using the FCM legacy APIs, follow [this migration guide](/azure/communication-services/tutorials/call-chat-migrate-android-push-fcm-v1).

## Considerations for mobile push notifications

Mobile push notifications are the pop-up notifications that appear on mobile devices. For calling, this article focuses on voice over Internet Protocol (VoIP) push notifications.

> [!NOTE]
> When the application registers for push notifications and handles the incoming push notifications for a Teams user, the APIs are the same. The APIs that this article describes can also be invoked on the `CommonCallAgent` or `TeamsCallAgent` class.

[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

## Register for push notifications

To register for push notifications, the application needs to call `registerPushNotification()` on a `CallAgent` instance by using a device registration token.

To obtain the device registration token, add the Firebase SDK to your application module's `build.gradle` file by adding the following lines in the `dependencies` section (if the lines aren't already there):

```groovy
// Add the SDK for Firebase Cloud Messaging
implementation 'com.google.firebase:firebase-core:16.0.8'
implementation 'com.google.firebase:firebase-messaging:20.2.4'
```

In your project level's `build.gradle` file, add the following line in the `dependencies` section if it's not already there:

```groovy
classpath 'com.google.gms:google-services:4.3.3'
```

Add the following plug-in to the beginning of the file if it's not already there:

```groovy
apply plugin: 'com.google.gms.google-services'
```

On the toolbar, select **Sync Now**. Add the following code snippet to get the device registration token that the Firebase Cloud Messaging SDK generated for the client application instance. Be sure to add the following imports to the header of the main activity for the instance to retrieve the token.

```java
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
```

Add this snippet to retrieve the token:

```java
FirebaseInstanceId.getInstance().getInstanceId()
    .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
        @Override
        public void onComplete(@NonNull Task<InstanceIdResult> task) {
            if (!task.isSuccessful()) {
                Log.w("PushNotification", "getInstanceId failed", task.getException());
                return;
            }

            // Get the new instance ID token
            String deviceToken = task.getResult().getToken();
            // Log
            Log.d("PushNotification", "Device Registration token retrieved successfully");
        }
    });
```

Register the device registration token with the Calling Services SDK for incoming call push notifications:

```java
String deviceRegistrationToken = "<Device Token from previous section>";
try {
    callAgent.registerPushNotification(deviceRegistrationToken).get();
}
catch(Exception e) {
    System.out.println("Something went wrong while registering for Incoming Calls Push Notifications.")
}
```

## Handle push notifications

To receive incoming call push notifications, call `handlePushNotification()` on a `CallAgent` instance with a payload.

To obtain the payload from Firebase Cloud Messaging, begin by creating a new service (select **File** > **New** > **Service** > **Service**) that extends the `FirebaseMessagingService` Firebase SDK class and overrides the `onMessageReceived` method. This method is the event handler that's called when Firebase Cloud Messaging delivers the push notification to the application.

```java
public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private java.util.Map<String, String> pushNotificationMessageDataFromFCM;

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Check if the message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d("PushNotification", "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }
        else {
            pushNotificationMessageDataFromFCM = remoteMessage.getData();
        }
    }
}
```

Add the following service definition to the `AndroidManifest.xml` file, inside the `<application>` tag:

```xml
<service
    android:name=".MyFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

After you retrieve the payload, you can pass it to the Communication Services SDK to be parsed into an internal `IncomingCallInformation` object. This object handles calling the `handlePushNotification` method on a `CallAgent` instance. You create a `CallAgent` instance by calling the `createCallAgent(...)` method on the `CallClient` class.

```java
try {
    IncomingCallInformation notification = IncomingCallInformation.fromMap(pushNotificationMessageDataFromFCM);
    Future handlePushNotificationFuture = callAgent.handlePushNotification(notification).get();
}
catch(Exception e) {
    System.out.println("Something went wrong while handling the Incoming Calls Push Notifications.");
}
```

When the handling of the push notification message is successful, and the all event handlers are registered properly, the application rings.

## Unregister push notifications

Applications can unregister push notification at any time. To unregister, call the `unregisterPushNotification()` method on `callAgent`:

```java
try {
    callAgent.unregisterPushNotification().get();
}
catch(Exception e) {
    System.out.println("Something went wrong while un-registering for all Incoming Calls Push Notifications.")
}
```

## Disable internal push notifications for an incoming call

The push payload of an incoming call can be delivered to the callee in two ways:

- Using FCM and registering the device token with the API mentioned earlier, `registerPushNotification` on `CallAgent` or `TeamsCallAgent`
- Registering the SDK with an internal service upon creation of `CallAgent` or `TeamsCallAgent` to get the push payload delivered

By using the property `setDisableInternalPushForIncomingCall` in `CallAgentOptions` or `TeamsCallAgentOptions`, it's possible to instruct the SDK to disable the delivery of the push payload via the internal push service:

```java
CallAgentOptions callAgentOptions = new CallAgentOptions();
callAgentOptions.setDisableInternalPushForIncomingCall(true);
```
