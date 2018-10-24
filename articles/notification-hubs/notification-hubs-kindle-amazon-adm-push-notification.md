---
title: Push notifications to Kindle apps using Azure Notification Hubs | Microsoft Docs
description: In this tutorial, you learn how to use Azure Notification Hubs to send push notifications to a Kindle application.
services: notification-hubs
documentationcenter: ''
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 346fc8e5-294b-4e4f-9f27-7a82d9626e93
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-kindle
ms.devlang: Java
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/14/2018
ms.author: dimazaid

---
# Get started with Notification Hubs for Kindle apps
[!INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

This tutorial shows you how to use Azure Notification Hubs to send push notifications to a Kindle application. You create a blank Kindle app that receives push notifications by using Amazon Device Messaging (ADM).

In this tutorial, you create/update code to do the following tasks: 

> [!div class="checklist"]
> * Add a new app to the developer portal
> * Create an API key
> * Add credentials to the hub
> * Set up your application
> * Create your ADM message handler
> * Add your API key to your app
> * Run the app
> * Send a test notification 

## Prerequisites

* Get the Android SDK (assuming that you are using Eclipse) from the <a href="http://go.microsoft.com/fwlink/?LinkId=389797">Android site</a>.
* Follow the steps in <a href="https://developer.amazon.com/docs/fire-tablets/ft-set-up-your-development-environment.html">Setting Up Your Development Environment</a> to set up your development environment for Kindle.

## Add a new app to the developer portal
1. First, create an app in the [Amazon developer portal].
   
    ![][0]
2. Copy the **Application Key**.
   
    ![][1]
3. In the portal, click the name of your app, and then click the **Device Messaging** tab.
   
    ![][2]
4. Click **Create a New Security Profile**, and then create a new security profile (for example, **TestAdm security profile**). Then click **Save**.
   
    ![][3]
5. Click **Security Profiles** to view the security profile that you created. Copy the **Client ID** and **Client Secret** values for later use.
   
    ![][4]

## Create an API key
1. Open a command prompt with administrator privileges.
2. Navigate to the Android SDK folder.
3. Enter the following command:
   
        keytool -list -v -alias androiddebugkey -keystore ./debug.keystore
   
    ![][5]
4. For the **keystore** password, type **android**.
5. Copy the **MD5** fingerprint.
6. Back in the developer portal, on the **Messaging** tab, click **Android/Kindle** and enter the name of the package for your app (for example, **com.sample.notificationhubtest**) and the **MD5** value, and then click **Generate API Key**.

## Add credentials to the hub
In the portal, add the client secret and client ID to the **Configure** tab of your notification hub.

## Set up your application
> [!NOTE]
> When you're creating an application, use at least API Level 17.

Add the ADM libraries to your Eclipse project:

1. To obtain the ADM library, [download the SDK]. Extract the SDK zip file.
2. In Eclipse, right-click your project, and then click **Properties**. Select **Java Build Path** on the left, and then select the **Libraries **tab at the top. Click **Add External Jar**, and select the file `\SDK\Android\DeviceMessaging\lib\amazon-device-messaging-*.jar` from the directory in which you extracted the Amazon SDK.
3. Download the NotificationHubs Android SDK (link).
4. Unzip the package, and then drag the file `notification-hubs-sdk.jar` into the `libs` folder in Eclipse.

Edit your app manifest to support ADM:

1. Add the Amazon namespace in the root manifest element:

    ```xml
        xmlns:amazon="http://schemas.amazon.com/apk/res/android"
    ```

1. Add permissions as the first element under the manifest element. Substitute **[YOUR PACKAGE NAME]** with the package that you used to create your app.
   
    ```xml
        <permission
         android:name="[YOUR PACKAGE NAME].permission.RECEIVE_ADM_MESSAGE"
         android:protectionLevel="signature" />
   
        <uses-permission android:name="android.permission.INTERNET"/>
   
        <uses-permission android:name="[YOUR PACKAGE NAME].permission.RECEIVE_ADM_MESSAGE" />
   
        <!-- This permission allows your app access to receive push notifications
        from ADM. -->
        <uses-permission android:name="com.amazon.device.messaging.permission.RECEIVE" />
   
        <!-- ADM uses WAKE_LOCK to keep the processor from sleeping when a message is received. -->
        <uses-permission android:name="android.permission.WAKE_LOCK" />
    ```
2. Insert the following element as the first child of the application element. Remember to substitute **[YOUR SERVICE NAME]** with the name of your ADM message handler that you create in the next section (including the package), and replace **[YOUR PACKAGE NAME]** with the package name with which you created your app.
   
    ```xml
        <amazon:enable-feature
              android:name="com.amazon.device.messaging"
                     android:required="true"/>
        <service
            android:name="[YOUR SERVICE NAME]"
            android:exported="false" />
   
        <receiver
            android:name="[YOUR SERVICE NAME]$Receiver" />
   
            <!-- This permission ensures that only ADM can send your app registration broadcasts. -->
            android:permission="com.amazon.device.messaging.permission.SEND" >
   
            <!-- To interact with ADM, your app must listen for the following intents. -->
            <intent-filter>
          <action android:name="com.amazon.device.messaging.intent.REGISTRATION" />
          <action android:name="com.amazon.device.messaging.intent.RECEIVE" />
   
          <!-- Replace the name in the category tag with your app's package name. -->
          <category android:name="[YOUR PACKAGE NAME]" />
            </intent-filter>
        </receiver>
    ```

## Create your ADM message handler
1. Create a new class that inherits from `com.amazon.device.messaging.ADMMessageHandlerBase` and name it `MyADMMessageHandler`, as shown in the following figure:
   
    ![][6]
2. Add the following `import` statements:
   
    ```java
        import android.app.NotificationManager;
        import android.app.PendingIntent;
        import android.content.Context;
        import android.content.Intent;
        import android.support.v4.app.NotificationCompat;
        import com.amazon.device.messaging.ADMMessageReceiver;
        import com.microsoft.windowsazure.messaging.NotificationHub
    ```
3. Add the following code in the class that you created. Remember to substitute the hub name and connection string (listen):
   
    ```java
        public static final int NOTIFICATION_ID = 1;
        private NotificationManager mNotificationManager;
        NotificationCompat.Builder builder;
          private static NotificationHub hub;
        public static NotificationHub getNotificationHub(Context context) {
            Log.v("com.wa.hellokindlefire", "getNotificationHub");
            if (hub == null) {
                hub = new NotificationHub("[hub name]", "[listen connection string]", context);
            }
            return hub;
        }
   
        public MyADMMessageHandler() {
                super("MyADMMessageHandler");
            }
   
            public static class Receiver extends ADMMessageReceiver
            {
                public Receiver()
                {
                    super(MyADMMessageHandler.class);
                }
            }
   
            private void sendNotification(String msg) {
                Context ctx = getApplicationContext();
   
                mNotificationManager = (NotificationManager)
                    ctx.getSystemService(Context.NOTIFICATION_SERVICE);
   
            PendingIntent contentIntent = PendingIntent.getActivity(ctx, 0,
                  new Intent(ctx, MainActivity.class), 0);
   
            NotificationCompat.Builder mBuilder =
                  new NotificationCompat.Builder(ctx)
                  .setSmallIcon(R.mipmap.ic_launcher)
                  .setContentTitle("Notification Hub Demo")
                  .setStyle(new NotificationCompat.BigTextStyle()
                         .bigText(msg))
                  .setContentText(msg);
   
             mBuilder.setContentIntent(contentIntent);
             mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
        }
    ```
4. Add the following code to the `OnMessage()` method:
   
    ```java
        String nhMessage = intent.getExtras().getString("msg");
        sendNotification(nhMessage);
    ```
5. Add the following code to the `OnRegistered` method:
   
    ```java
        try {
            getNotificationHub(getApplicationContext()).register(registrationId);
        } catch (Exception e) {
            Log.e("[your package name]", "Fail onRegister: " + e.getMessage(), e);
        }
    ```
6. Add the following code to the `OnUnregistered` method:
   
    ```java
         try {
             getNotificationHub(getApplicationContext()).unregister();
         } catch (Exception e) {
             Log.e("[your package name]", "Fail onUnregister: " + e.getMessage(), e);
         }
    ```
7. In the `MainActivity` method, add the following import statement:
   
    ```java
        import com.amazon.device.messaging.ADM;
    ```
8. Add the following code at the end of the `OnCreate` method:
   
    ```java
        final ADM adm = new ADM(this);
        if (adm.getRegistrationId() == null)
        {
           adm.startRegister();
        } else {
            new AsyncTask() {
                  @Override
                  protected Object doInBackground(Object... params) {
                     try {                         MyADMMessageHandler.getNotificationHub(getApplicationContext()).register(adm.getRegistrationId());
                     } catch (Exception e) {
                         Log.e("com.wa.hellokindlefire", "Failed registration with hub", e);
                         return e;
                     }
                     return null;
                 }
               }.execute(null, null, null);
        }
    ```
    
## Add your API key to your app
1. In Eclipse, create a new file named **api_key.txt** in the directory assets of your project.
2. Open the file and copy the API key that you generated in the Amazon developer portal.

## Run the app
1. Start the emulator.
2. In the emulator, swipe from the top and click **Settings**, and then click **My account** and register with a valid Amazon account.
3. In Eclipse, run the app.

> [!NOTE]
> If a problem occurs, check the time of the emulator (or device). The time value must be accurate. To change the time of the Kindle emulator, you can run the following command from your Android SDK platform-tools directory:
> 

```
adb shell  date -s "yyyymmdd.hhmmss"
```

## Send a notification message

To send a message by using .NET:

```csharp
static void Main(string[] args)
{
    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("[conn string]", "[hub name]");

    hub.SendAdmNativeNotificationAsync("{\"data\":{\"msg\" : \"Hello from .NET!\"}}").Wait();
}
```

![][7]

## Next steps
In this tutorial, you sent broadcast notifications to all your Kindle devices registered with the backend. To learn how to push notifications to specific Kindle devices, advance to the following tutorial:  The following tutorial shows how to push notifications to specific Android devices, but you can use the same logic for pushing notifications to specific Kindle devices. 

> [!div class="nextstepaction"]
>[Push notifications to specific devices](notification-hubs-aspnet-backend-android-xplat-segmented-gcm-push-notification.md)

<!-- URLs. -->
[Amazon developer portal]: https://developer.amazon.com/home.html
[download the SDK]: https://developer.amazon.com/public/resources/development-tools/sdk

[0]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-portal1.png
[1]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-portal2.png
[2]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-portal3.png
[3]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-portal4.png
[4]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-portal5.png
[5]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-cmd-window.png
[6]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-new-java-class.png
[7]: ./media/notification-hubs-kindle-get-started/notification-hub-kindle-notification.png
