---
title: Enable push notifications in your Android chat app
titleSuffix: An Azure Communication Services tutorial
description: Learn how to enable push notification in Android App by using Azure Communication Chat SDK
author: jiminwen
services: azure-communication-services
ms.author: jiminwen
ms.date: 08/16/2022
ms.topic: tutorial
ms.service: azure-communication-services
---


# Enable push notifications
Push notifications let clients be notified for incoming messages and other operations occurring in a chat thread in situations where the mobile app isn't running in the foreground. Azure Communication Services supports a [list of events that you can subscribe to](../concepts/chat/concepts.md#push-notifications).
> [!NOTE]
> Chat push notifications are supported for Android SDK in versions starting from 1.1.0-beta.4 and 1.1.0. It is recommended that you use version 2.0.0 or newer, as older versions have a known issue with the registration renewal. Steps from 8 to 12 are only needed for versions equal to or greater than 2.0.0.

1. Set up Firebase Cloud Messaging for the ChatQuickstart project. Complete steps `Create a Firebase project`, `Register your app with Firebase`, `Add a Firebase configuration file`, `Add Firebase SDKs to your app`, and `Edit your app manifest` in [Firebase Documentation](https://firebase.google.com/docs/cloud-messaging/android/client).

2. Create a Notification Hub within the same subscription as your Communication Services resource, configure your Firebase Cloud Messaging settings for the hub, and link the Notification Hub to your Communication Services resource. See [Notification Hub provisioning](../concepts/notifications.md#notification-hub-provisioning).
3. Create a new file called `MyFirebaseMessagingService.java` in the same directory where `MainActivity.java` resides. Copy the following code into `MyFirebaseMessagingService.java`. You will need to replace `<your_package_name>` with the package name used in `MainActivity.java`. You can use your own value for `<your_intent_name>`. This value will be used in step 6 below.

   ```java
      package <your_package_name>;

      import android.content.Intent;
      import android.util.Log;

      import androidx.localbroadcastmanager.content.LocalBroadcastManager;

      import com.azure.android.communication.chat.models.ChatPushNotification;
      import com.google.firebase.messaging.FirebaseMessagingService;
      import com.google.firebase.messaging.RemoteMessage;

      import java.util.concurrent.Semaphore;

      public class MyFirebaseMessagingService extends FirebaseMessagingService {
          private static final String TAG = "MyFirebaseMsgService";
          public static Semaphore initCompleted = new Semaphore(1);

          @Override
          public void onMessageReceived(RemoteMessage remoteMessage) {
              try {
                  Log.d(TAG, "Incoming push notification.");

                  initCompleted.acquire();

                  if (remoteMessage.getData().size() > 0) {
                      ChatPushNotification chatPushNotification =
                          new ChatPushNotification().setPayload(remoteMessage.getData());
                      sendPushNotificationToActivity(chatPushNotification);
                  }

                  initCompleted.release();
              } catch (InterruptedException e) {
                  Log.e(TAG, "Error receiving push notification.");
              }
          }

          private void sendPushNotificationToActivity(ChatPushNotification chatPushNotification) {
              Log.d(TAG, "Passing push notification to Activity: " + chatPushNotification.getPayload());
              Intent intent = new Intent("<your_intent_name>");
              intent.putExtra("PushNotificationPayload", chatPushNotification);
              LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
          }
      }

   ```

4. At the top of file `MainActivity.java`, add the following import statements:

   ```java
      import android.content.BroadcastReceiver;
      import android.content.Context;
      import android.content.Intent;
      import android.content.IntentFilter;

      import androidx.localbroadcastmanager.content.LocalBroadcastManager;
      import com.azure.android.communication.chat.models.ChatPushNotification;
      import com.google.android.gms.tasks.OnCompleteListener;
      import com.google.android.gms.tasks.Task;
      import com.google.firebase.messaging.FirebaseMessaging;
   ```

5. Add the following code to the `MainActivity` class:

   ```java
      private BroadcastReceiver firebaseMessagingReceiver = new BroadcastReceiver() {
          @Override
          public void onReceive(Context context, Intent intent) {
              ChatPushNotification pushNotification =
                  (ChatPushNotification) intent.getParcelableExtra("PushNotificationPayload");

              Log.d(TAG, "Push Notification received in MainActivity: " + pushNotification.getPayload());

              boolean isHandled = chatAsyncClient.handlePushNotification(pushNotification);
              if (!isHandled) {
                  Log.d(TAG, "No listener registered for incoming push notification!");
              }
          }
      };


      private void startFcmPushNotification() {
          FirebaseMessaging.getInstance().getToken()
              .addOnCompleteListener(new OnCompleteListener<String>() {
                  @Override
                  public void onComplete(@NonNull Task<String> task) {
                      if (!task.isSuccessful()) {
                          Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                          return;
                      }

                      // Get new FCM registration token
                      String token = task.getResult();

                      // Log and toast
                      Log.d(TAG, "Fcm push token generated:" + token);
                      Toast.makeText(MainActivity.this, token, Toast.LENGTH_SHORT).show();

                      chatAsyncClient.startPushNotifications(token, new Consumer<Throwable>() {
                          @Override
                          public void accept(Throwable throwable) {
                              Log.w(TAG, "Registration failed for push notifications!", throwable);
                          }
                      });
                  }
              });
      }

   ```

6. Update the function `onCreate` in `MainActivity`.

   ```java
      @Override
      protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          setContentView(R.layout.activity_main);
    
          LocalBroadcastManager
              .getInstance(this)
              .registerReceiver(
                  firebaseMessagingReceiver,
                  new IntentFilter("<your_intent_name>"));
      }
   ```

7. Put the following code below the comment `<RECEIVE CHAT MESSAGES>` in `MainActivity`:

```java
   startFcmPushNotification();

   chatAsyncClient.addPushNotificationHandler(CHAT_MESSAGE_RECEIVED, (ChatEvent payload) -> {
       Log.i(TAG, "Push Notification CHAT_MESSAGE_RECEIVED.");
       ChatMessageReceivedEvent event = (ChatMessageReceivedEvent) payload;
       // You code to handle ChatMessageReceived event
   });
```

8. Add the `xmlns:tools` field to the `AndroidManifest.xml` file:

```
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.azure.android.communication.chat.sampleapp">
```

9. Disable the default initializer for `WorkManager` in `AndroidManifest.xml`:

```
    <!-- Disable the default initializer of WorkManager so that we could override it in MyAppConfiguration  -->
    <provider
        android:name="androidx.startup.InitializationProvider"
        android:authorities="${applicationId}.androidx-startup"
        android:exported="false"
        tools:node="merge">
      <!-- If you are using androidx.startup to initialize other components -->
      <meta-data
          android:name="androidx.work.WorkManagerInitializer"
          android:value="androidx.startup"
          tools:node="remove" />
    </provider>
    <!-- End of Disabling default initializer of WorkManager -->
```

10. Add the `WorkManager` dependency to your `build.gradle` file:

```
    def work_version = "2.7.1"
    implementation "androidx.work:work-runtime:$work_version"
```

11. Add a custom `WorkManager` initializer by creating a class implementing `Configuration.Provider`:

```java
    public class MyAppConfiguration extends Application implements Configuration.Provider {
        Consumer<Throwable> exceptionHandler = new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) {
                Log.i("YOUR_TAG", "Registration failed for push notifications!" + throwable.getMessage());
            }
        };
    
        @Override
        public void onCreate() {
            super.onCreate();
            // Initialize application parameters here
            WorkManager.initialize(getApplicationContext(), getWorkManagerConfiguration());
        }
    
        @NonNull
        @Override
        public Configuration getWorkManagerConfiguration() {
            return new Configuration.Builder().
                setWorkerFactory(new RegistrationRenewalWorkerFactory(COMMUNICATION_TOKEN_CREDENTIAL, exceptionHandler)).build();
        }
    }
```
**Explanation to code above:** The default initializer of `WorkManager` has been disabled in step 9. This step implements `Configuration.Provider` to provide a customized 'WorkFactory', which is responsible to create `WorkerManager` during runtime. 

If the app is integrated with Azure Function, initialization of application parameters should be added in method 'onCreate()'. Method 'getWorkManagerConfiguration()' is called when the application is starting, before any activity, service, or receiver objects (excluding content providers) have been created, so that application parameters could be initialized before being used. More details can be found in the sample chat app.

12. Add the `android:name=.MyAppConfiguration` field, which uses the class name from step 11, into `AndroidManifest.xml`:

```
<application
      android:allowBackup="true"
      android:icon="@mipmap/ic_launcher"
      android:label="@string/app_name"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:theme="@style/Theme.AppCompat"
      android:supportsRtl="true"
      android:name=".MyAppConfiguration"
>
```
