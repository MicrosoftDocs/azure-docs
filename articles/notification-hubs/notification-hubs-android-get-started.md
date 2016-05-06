<properties
	pageTitle="Sending push notifications to Android with Azure Notification Hubs | Microsoft Azure"
	description="In this tutorial, you learn how to use Azure Notification Hubs to push notifications to Android devices."
	services="notification-hubs"
	documentationCenter="android"
	keywords="push notifications,push notification,android push notification"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>
<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="hero-article"
	ms.date="03/15/2016"
	ms.author="wesmc"/>

# Sending push notifications to Android with Azure Notification Hubs

[AZURE.INCLUDE [notification-hubs-selector-get-started](../../includes/notification-hubs-selector-get-started.md)]

##Overview

> [AZURE.IMPORTANT] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A643EE910&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-android-get-started).

This tutorial shows you how to use Azure Notification Hubs to send push notifications to an Android application.
You'll create a blank Android app that receives push notifications by using Google Cloud Messaging (GCM).

Be sure to follow along with the [tagging tutorial](./notification-hubs-routing-tag-expressions.md) to learn how to use Notification Hubs send targeted push notifications.


## Before you begin

[AZURE.INCLUDE [notification-hubs-hero-slug](../../includes/notification-hubs-hero-slug.md)]

The completed code for this tutorial can be found on GitHub [here](https://github.com/Azure/azure-notificationhubs-samples/tree/master/Android/GetStarted).


##Prerequisites

In addition to an active Azure account mentioned above, this tutorial only requires the latest version of [Android Studio](http://go.microsoft.com/fwlink/?LinkId=389797).

Completing this tutorial is a prerequisite for all other Notification Hubs tutorials for Android apps.

##Creating a project that supports Google Cloud Messaging

[AZURE.INCLUDE [mobile-services-enable-Google-cloud-messaging](../../includes/mobile-services-enable-google-cloud-messaging.md)]


##Configure a new notification hub


[AZURE.INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]


&emsp;&emsp;7.   In the **Settings** blade, select **Notification Services** and then **Google (GCM)**. Enter the API key and save.

&emsp;&emsp;![Azure Notification Hubs - Google (GCM)](./media/notification-hubs-android-get-started/notification-hubs-gcm-api.png)

Your notification hub is now configured to work with GCM, and you have the connection strings to both register your app to receive and send push notifications.

##<a id="connecting-app"></a>Connect your app to the notification hub

###Create a new Android project

1. In Android Studio, start a new Android Studio project.

   	![Android Studio - new project][13]

2. Choose the **Phone and Tablet** form factor and the **Minimum SDK** that you want to support. Then click **Next**.

   	![Android Studio - project creation workflow][14]

3. Choose **Blank Activity** for the main activity, click **Next**, and then click **Finish**.

###Add Google Play services to the project

[AZURE.INCLUDE [Add Play Services](../../includes/notification-hubs-android-studio-add-google-play-services.md)]

###Add code

1. Download the `notification-hubs-0.4.jar` file from the **Files** tab of the [Notification-Hubs-Android-SDK on Bintray](https://bintray.com/microsoftazuremobile/SDK/Notification-Hubs-Android-SDK/0.4). Drag the file directly into the **libs** folder in the Project View window of Android Studio. Then right click the file and click **Add as Library**.

2. In the `Build.Gradle` file for the **app**, add the following line in the **dependencies** section.

	    compile 'com.microsoft.azure:azure-notifications-handler:1.0.1@aar'

	Add the following repository after the **dependencies** section.

		repositories {
		    maven {
		        url "http://dl.bintray.com/microsoftazuremobile/SDK"
		    }
		}

3. Set up the application to obtain a registration ID from GCM, and use it to register the app instance to the notification hub.

	In the `AndroidManifest.xml` file, add the following permissions below the  `</application>` tag. Make sure to replace `<your package>` with the package name shown at the top of the `AndroidManifest.xml` file (`com.example.testnotificationhubs` in this case).

		<uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.GET_ACCOUNTS"/>
		<uses-permission android:name="android.permission.WAKE_LOCK"/>
		<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />

		<permission android:name="<your package>.permission.C2D_MESSAGE" android:protectionLevel="signature" />
		<uses-permission android:name="<your package>.permission.C2D_MESSAGE"/>

3. In the **MainActivity** class, add the following `import` statements above the class declaration.

		import android.app.AlertDialog;
		import android.content.DialogInterface;
		import android.os.AsyncTask;
		import com.google.android.gms.gcm.*;
		import com.microsoft.windowsazure.messaging.*;
		import com.microsoft.windowsazure.notifications.NotificationsManager;
		import android.widget.Toast;



4. Add the following private members at the top of the class. We use them to configure the push notification channel between your app and cloud services.

		private String SENDER_ID = "<your project number>";
		private GoogleCloudMessaging gcm;
		private NotificationHub hub;
    	private String HubName = "<Enter Your Hub Name>";
		private String HubListenConnectionString = "<Your default listen connection string>";
	    private static Boolean isVisible = false;


	Make sure to update the three placeholders:
	* **SENDER_ID**: Set `SENDER_ID` to the project number you obtained earlier in the [Google Cloud Console](http://cloud.google.com/console).
	* **HubListenConnectionString**: Set `HubListenConnectionString` to the **DefaultListenAccessSignature** connection string for your hub. You can copy that connection string by clicking **Access Policies** on the **Settings** blade of your hub on the [Azure Portal].
	* **HubName**: Use the name of your notification hub that appears in the hub blade in the [Azure Portal].


5. In the `OnCreate` method of the `MainActivity` class, add the following code to register with the notification hub when the activity is created.

        MyHandler.mainActivity = this;
        NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);
        gcm = GoogleCloudMessaging.getInstance(this);
        hub = new NotificationHub(HubName, HubListenConnectionString, this);
        registerWithNotificationHubs();

6. In `MainActivity.java`, add the code below for the `registerWithNotificationHubs()` method. This method reports success after registering with Google Cloud Messaging and the notification hub.

    	@SuppressWarnings("unchecked")
    	private void registerWithNotificationHubs() {
        	new AsyncTask() {
            	@Override
            	protected Object doInBackground(Object... params) {
                	try {
                    	String regid = gcm.register(SENDER_ID);
                    ToastNotify("Registered Successfully - RegId : " +
						hub.register(regid).getRegistrationId());
                	} catch (Exception e) {
                    	ToastNotify("Registration Exception Message - " + e.getMessage());
                    	return e;
                	}
                	return null;
            	}
        	}.execute(null, null, null);
    	}


7. Add the `ToastNotify` method to the activity to display the notification when the app is running and visible. Also override `onStart`, `onPause`, `onResume` and `onStop` to determine whether the activity is visible to display the toast.

	    @Override
	    protected void onStart() {
	        super.onStart();
	        isVisible = true;
	    }

	    @Override
	    protected void onPause() {
	        super.onPause();
	        isVisible = false;
	    }

	    @Override
	    protected void onResume() {
	        super.onResume();
	        isVisible = true;
	    }

	    @Override
	    protected void onStop() {
	        super.onStop();
	        isVisible = false;
	    }

	    public void ToastNotify(final String notificationMessage)
	    {
	        if (isVisible == true)
	            runOnUiThread(new Runnable() {
	                @Override
	                public void run() {
	                    Toast.makeText(MainActivity.this, notificationMessage, Toast.LENGTH_LONG).show();
	                }
	            });
	    }

8. Because by default Android does not handle notification display, you must write your own receiver. In `AndroidManifest.xml`, add the following element inside the `<application>` element.

	> [AZURE.NOTE] Replace the placeholder with your package name.

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="<your package name>" />
            </intent-filter>
        </receiver>


9. In the Project View, expand **app** > **src** > **main** > **java**. Right-click your package folder under **java**, click **New**, and then click **Java Class**.

	![Android Studio - new Java class][6]

10. In the **Name** field for the new class, type **MyHandler**, and then click **OK**.


11. Add the following import statements at the top of `MyHandler.java`:

		import android.app.NotificationManager;
		import android.app.PendingIntent;
		import android.content.Context;
		import android.content.Intent;
		import android.os.Bundle;
		import android.support.v4.app.NotificationCompat;
		import com.microsoft.windowsazure.notifications.NotificationsHandler;


12. Update the class declaration as follows to make `MyHandler` a subclass of `com.microsoft.windowsazure.notifications.NotificationsHandler` as shown below.

		public class MyHandler extends NotificationsHandler {


13. Add the following code for the `MyHandler` class.

	This code overrides the `OnReceive` method, so the handler will pop up a Toast to show notifications that are received. The handler also sends the push notification to the Android notification manager by using the `sendNotification()` method.

    	public static final int NOTIFICATION_ID = 1;
    	private NotificationManager mNotificationManager;
    	NotificationCompat.Builder builder;
    	Context ctx;

    	static public MainActivity mainActivity;

    	@Override
    	public void onReceive(Context context, Bundle bundle) {
        	ctx = context;
        	String nhMessage = bundle.getString("message");

        	sendNotification(nhMessage);
	        mainActivity.ToastNotify(nhMessage);
    	}

    	private void sendNotification(String msg) {
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

14. In Android Studio on the menu bar, click **Build** > **Rebuild Project** to make sure that no errors are present in your code.

##Sending push notifications

You can test receiving push notifications in your app by sending them via the [Azure Portal] - look for the **Troubleshooting** Section in the hub blade, as shown below.

![Azure Notification Hubs - Test Send](./media/notification-hubs-android-get-started/notification-hubs-test-send.png)

[AZURE.INCLUDE [notification-hubs-sending-notifications-from-the-portal](../../includes/notification-hubs-sending-notifications-from-the-portal.md)]

## (Optional) Send push notifications directly from the app

For most testing cases, you might want to be able to send push notifications directly from the application that you are developing. This section explains how to properly implement this scenario.

1. In Android Studio Project View, expand **App** > **src** > **main** > **res** > **layout**. Open the `activity_main.xml` layout file and click the **Text** tab to update the text contents of the file. Update it with the code below, which adds new `Button` and `EditText` controls for sending push notification messages to the notification hub. Add this code at the bottom, just before `</RelativeLayout>`.

	    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/send_button"
        android:id="@+id/sendbutton"
        android:layout_centerVertical="true"
        android:layout_centerHorizontal="true"
        android:onClick="sendNotificationButtonOnClick" />

	    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/editTextNotificationMessage"
        android:layout_above="@+id/sendbutton"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="42dp"
        android:hint="@string/notification_message_hint" />

2. Add this line to the `build.gradle` file under `android`

		useLibrary 'org.apache.http.legacy'

3. In Android Studio Project View, expand **App** > **src** > **main** > **res** > **values**. Open the `strings.xml` file and add the string values that are referenced by the new `Button` and `EditText` controls. Add these at the bottom of the file, just before `</resources>`.

        <string name="send_button">Send Notification</string>
        <string name="notification_message_hint">Enter notification message text</string>


4. In your `MainActivity.java` file, add the following `import` statements above the `MainActivity` class.

		import java.net.URLEncoder;
		import javax.crypto.Mac;
		import javax.crypto.spec.SecretKeySpec;

		import android.util.Base64;
		import android.view.View;
		import android.widget.EditText;

		import org.apache.http.HttpResponse;
		import org.apache.http.client.HttpClient;
		import org.apache.http.client.methods.HttpPost;
		import org.apache.http.entity.StringEntity;
		import org.apache.http.impl.client.DefaultHttpClient;


5. In your `MainActivity.java` file, add the following members at the top of the `MainActivity` class.

	Update `HubFullAccess` with the **DefaultFullSharedAccessSignature** connection string for your hub. This connection string can be copied from the [Azure Portal] by clicking **Access Policies** on the **Settings** blade for your notification hub.

	    private String HubEndpoint = null;
	    private String HubSasKeyName = null;
	    private String HubSasKeyValue = null;
		private String HubFullAccess = "<Enter Your DefaultFullSharedAccess Connection string>";

6. Your activity holds the hub name and the full shared access connection string for the hub. You must create a Software Access Signature (SaS) token to authenticate a POST request to send messages to your notification hub. This is done by parsing the key data from the connection string and then creating the SaS token, as mentioned in the [Common Concepts](http://msdn.microsoft.com/library/azure/dn495627.aspx) REST API reference.

	In `MainActivity.java`, add the following method to the `MainActivity` class to parse your connection string.

	    /**
    	 * Example code from http://msdn.microsoft.com/library/azure/dn495627.aspx
    	 * to parse the connection string so a SaS authentication token can be
    	 * constructed.
    	 *
    	 * @param connectionString This must be the DefaultFullSharedAccess connection
    	 *                         string for this example.
	     */
	    private void ParseConnectionString(String connectionString)
	    {
	        String[] parts = connectionString.split(";");
	        if (parts.length != 3)
	            throw new RuntimeException("Error parsing connection string: "
	                    + connectionString);

	        for (int i = 0; i < parts.length; i++) {
	            if (parts[i].startsWith("Endpoint")) {
	                this.HubEndpoint = "https" + parts[i].substring(11);
	            } else if (parts[i].startsWith("SharedAccessKeyName")) {
	                this.HubSasKeyName = parts[i].substring(20);
	            } else if (parts[i].startsWith("SharedAccessKey")) {
	                this.HubSasKeyValue = parts[i].substring(16);
	            }
	        }
	    }

7. In `MainActivity.java`, add the following method to the `MainActivity` class to create a SaS authentication token.

        /**
         * Example code from http://msdn.microsoft.com/library/azure/dn495627.aspx to
         * construct a SaS token from the access key to authenticate a request.
         *
         * @param uri The unencoded resource URI string for this operation. The resource
         *            URI is the full URI of the Service Bus resource to which access is
         *            claimed. For example,
         *            "http://<namespace>.servicebus.windows.net/<hubName>"
         */
        private String generateSasToken(String uri) {

            String targetUri;
            try {
                targetUri = URLEncoder
                        .encode(uri.toString().toLowerCase(), "UTF-8")
                        .toLowerCase();

                long expiresOnDate = System.currentTimeMillis();
                int expiresInMins = 60; // 1 hour
                expiresOnDate += expiresInMins * 60 * 1000;
                long expires = expiresOnDate / 1000;
                String toSign = targetUri + "\n" + expires;

                // Get an hmac_sha1 key from the raw key bytes
                byte[] keyBytes = HubSasKeyValue.getBytes("UTF-8");
                SecretKeySpec signingKey = new SecretKeySpec(keyBytes, "HmacSHA256");

                // Get an hmac_sha1 Mac instance and initialize with the signing key
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(signingKey);

                // Compute the hmac on input data bytes
                byte[] rawHmac = mac.doFinal(toSign.getBytes("UTF-8"));

            	// Using android.util.Base64 for Android Studio instead of
	            // Apache commons codec
                String signature = URLEncoder.encode(
                        Base64.encodeToString(rawHmac, Base64.NO_WRAP).toString(), "UTF-8");

                // Construct authorization string
                String token = "SharedAccessSignature sr=" + targetUri + "&sig="
                        + signature + "&se=" + expires + "&skn=" + HubSasKeyName;
                return token;
            } catch (Exception e) {
                DialogNotify("Exception Generating SaS",e.getMessage().toString());
            }

            return null;
        }


8. In `MainActivity.java`, add the following method to the `MainActivity` class to handle the **Send Notification** button click and send the push notification message to the hub by using the built-in REST API.

        /**
         * Send Notification button click handler. This method parses the
         * DefaultFullSharedAccess connection string and generates a SaS token. The
         * token is added to the Authorization header on the POST request to the
         * notification hub. The text in the editTextNotificationMessage control
         * is added as the JSON body for the request to add a GCM message to the hub.
         *
         * @param v
         */
        public void sendNotificationButtonOnClick(View v) {
            EditText notificationText = (EditText) findViewById(R.id.editTextNotificationMessage);
            final String json = "{\"data\":{\"message\":\"" + notificationText.getText().toString() + "\"}}";

            new Thread()
            {
                public void run()
                {
                    try
                    {
                        HttpClient client = new DefaultHttpClient();

                        // Based on reference documentation...
                        // http://msdn.microsoft.com/library/azure/dn223273.aspx
                        ParseConnectionString(HubFullAccess);
                        String url = HubEndpoint + HubName + "/messages/?api-version=2015-01";
                        HttpPost post = new HttpPost(url);

                        // Authenticate the POST request with the SaS token
                        post.setHeader("Authorization", generateSasToken(url));

                        // JSON content for GCM
                        post.setHeader("Content-Type", "application/json;charset=utf-8");

                        // Notification format should be GCM
                        post.setHeader("ServiceBusNotification-Format", "gcm");
                        post.setEntity(new StringEntity(json));

                        HttpResponse response = client.execute(post);
                    }
                    catch(Exception e)
                    {
                        DialogNotify("Exception",e.getMessage().toString());
                    }
                }
            }.start();
        }



##Testing your app

####Push notifications in the emulator

If you want to test push notifications inside an emulator, make sure that your emulator image supports the Google API level that you chose for your app. If your image doesn't support native Google APIs, you will end up with the **SERVICE\_NOT\_AVAILABLE** exception.

In addition to the above, ensure that you have added your Google account to your running emulator under **Settings** > **Accounts**. Otherwise, your attempts to register with GCM may result in the **AUTHENTICATION\_FAILED** exception.

####Running the application

1. Run the app and notice that the registration ID is reported for a successful registration.

   	![Testing on Android - Channel registration][18]

2. Enter a notification message to be sent to all Android devices that have registered with the hub.

   	![Testing on Android - sending a message][19]

3. Press **Send Notification**. Any devices that have the app running will show an `AlertDialog` instance with the push notification message. Devices that don't have the app running but were previously registered for push notifications will receive a notification in the Android Notification Manager. Those can be viewed by swiping down from the upper-left corner.

   	![Testing on Android - notifications][21]

##Next steps

We recommend the [Use Notification Hubs to push notifications to users] tutorial as the next step. It will show you how to send notifications from an ASP.NET backend using tags to target specific users.

If you want to segment your users by interest groups, check out the [Use Notification Hubs to send breaking news] tutorial.

To learn more general information about Notification Hubs, see our [Notification Hubs Guidance].

<!-- Images. -->
[6]: ./media/notification-hubs-android-get-started/notification-hub-android-new-class.png

[12]: ./media/notification-hubs-android-get-started/notification-hub-connection-strings.png

[13]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-new-project.png
[14]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-choose-form-factor.png
[15]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app4.png
[16]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app5.png
[17]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app6.png

[18]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-registered.png
[19]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-set-message.png

[20]: ./media/notification-hubs-android-get-started/notification-hub-create-console-app.png
[21]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-received-message.png
[22]: ./media/notification-hubs-android-get-started/notification-hub-scheduler1.png
[23]: ./media/notification-hubs-android-get-started/notification-hub-scheduler2.png
[29]: ./media/mobile-services-android-get-started-push/mobile-eclipse-import-Play-library.png

[30]: ./media/notification-hubs-android-get-started/notification-hubs-debug-hub-gcm.png

[31]: ./media/notification-hubs-android-get-started/notification-hubs-android-studio-add-ui.png


<!-- URLs. -->
[Get started with push notifications in Mobile Services]: ../mobile-services-javascript-backend-android-get-started-push.md  
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409
[Referencing a library project]: http://go.microsoft.com/fwlink/?LinkId=389800
[Azure Classic Portal]: https://manage.windowsazure.com/
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Use Notification Hubs to push notifications to users]: notification-hubs-aspnet-backend-android-notify-users.md
[Use Notification Hubs to send breaking news]: notification-hubs-aspnet-backend-android-breaking-news.md
[Azure Portal]: https://portal.azure.com
