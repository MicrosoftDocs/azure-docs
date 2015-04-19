<properties 
	pageTitle="Get Started with Azure Notification Hubs" 
	description="Learn how to use Azure Notification Hubs to push notifications." 
	services="notification-hubs" 
	documentationCenter="android" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>
<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="04/14/2015" 
	ms.author="wesmc"/>

# Get started with Notification Hubs

[AZURE.INCLUDE [notification-hubs-selector-get-started](../includes/notification-hubs-selector-get-started.md)]

##Overview

This topic shows you how to use Azure Notification Hubs to send push notifications to an Android application. 
In this tutorial, you create a blank Android app that receives push notifications using Google Cloud Messaging (GCM). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

This tutorial demonstrates the simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to see how to use notification hubs to address specific users and groups of devices. 


##Prerequisites

This tutorial requires the following:

+ Android Studio, which you can download from <a href="http://go.microsoft.com/fwlink/?LinkId=389797">here</a>
+ To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-android-get-started%2F).


Completing this tutorial is a prerequisite for all other notification hub tutorials for Android apps. 


##Create a Project that supports Google Cloud Messaging

[AZURE.INCLUDE [mobile-services-enable-Google-cloud-messaging](../includes/mobile-services-enable-Google-cloud-messaging.md)]


##Configure a New Notification Hub

[AZURE.INCLUDE [notification-hubs-android-configure-push](../includes/notification-hubs-android-configure-push.md)]

##<a id="connecting-app"></a>Connecting your app to the Notification Hub

###Create new Android project

1. In Android Studio, start a new Android Studio project.

   	![][13]

2. Choose **Phone and Tablet** form factor and the **Minimum SDK** that you want to support. Then click **Next**.

   	![][14]

3. Choose **Blank Activity** for the main activity. Then click **Next** and then **Finish**.

###Add Google Play Services to the project

[AZURE.INCLUDE [Add Play Services](../includes/mobile-services-add-Google-play-services.md)]

###Add code

1. Download the Notification Hubs Android SDK from <a href="https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409">here</a>. Extract the .zip file and copy **notificationhubs\notification-hubs-0.4.jar** and **notifications\notifications-1.0.1.jar** to the **app\libs** directory of your project. You can do this by dragging the files directly into the **libs** folder in the Project View window of Android Studio. Refresh the libs folder.



	The reference documentation for these two packages are located in the links below:
	* [com.microsoft.windowsazure.messaging](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/messaging/package-summary.html)
	* [com.microsoft.windowsazure.notifications](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/notifications/package-summary.html)


    > [AZURE.NOTE] The numbers at the end of the file name may change in subsequent SDK releases.

2. Next, you will set up the application to obtain a registration id from GCM, and use it to register the app instance to the notification hub. 

	In the AndroidManifest.xml file, add the following permissions below the  `</application>` tag. Make sure to replace `<your package>` with the package name shown at the top of the AndroidManifest.xml file (`com.example.testnotificationhubs` in this example).

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


4. Add the following private members at the top of the class.

		private String SENDER_ID = "<your project number>";
		private GoogleCloudMessaging gcm;
		private NotificationHub hub;
    	private String HubName = "<Enter Your Hub Name>";
		private String HubListenConnectionString = "<Your default listen connection string>";


	Make sure to update the three placeholders: 
	* **SENDER_ID**: Set the `SENDER_ID` to the Project Number you obtained earlier from the project you created in  the [Google Cloud Console](http://cloud.google.com/console). 
	* **HubListenConnectionString**: Set `HubListenConnectionString` to the **DefaultListenAccessSignature** connection string for your hub. You can copy that connection string by clicking **View Connection String** on the **Dashboard** tab of your hub on the [Azure Management Portal].
	* **HubName**: The name of your notification hub that appears at the top of the page in Azure for your hub (**not** the full url). For example, `"myhub"`.



5. In the **OnCreate** method of the **MainActivity** class add the following code to perform the registration on creation of the activity.

        MyHandler.mainActivity = this;
        NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);
        gcm = GoogleCloudMessaging.getInstance(this);
        hub = new NotificationHub(HubName, HubListenConnectionString, this);
        registerWithNotificationHubs();

6. In **MainActivity.java**, add the code below for the **registerWithNotificationHubs()** method. This method reports success after registering with Google Cloud Messaging and the Notification Hub:

    	@SuppressWarnings("unchecked")
    	private void registerWithNotificationHubs() {
        	new AsyncTask() {
            	@Override
            	protected Object doInBackground(Object... params) {
                	try {
                    	String regid = gcm.register(SENDER_ID);
                    DialogNotify("Registered Successfully","RegId : " + 
						hub.register(regid).getRegistrationId());
                	} catch (Exception e) {
                    	DialogNotify("Exception",e.getMessage());
                    	return e;
                	}
                	return null;
            	}
        	}.execute(null, null, null);
    	}

		
		/**
		  * A modal AlertDialog for displaying a message on the UI thread
		  * when theres an exception or message to report.
		  * 
		  * @param title   Title for the AlertDialog box. 
		  * @param message The message displayed for the AlertDialog box.
		  */
    	public void DialogNotify(final String title,final String message)
    	{
        	final AlertDialog.Builder dlg;
        	dlg = new AlertDialog.Builder(this);

        	runOnUiThread(new Runnable() {
            	@Override
            	public void run() {
                	AlertDialog dlgAlert = dlg.create();
                	dlgAlert.setTitle(title);
                	dlgAlert.setButton(DialogInterface.BUTTON_POSITIVE, 
						(CharSequence) "OK", 
						new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        });
                	dlgAlert.setMessage(message);
                	dlgAlert.setCancelable(false);
                	dlgAlert.show();
            	}
        	});
    	}

7. Because Android does not display notifications, you must write your own receiver. In **AndroidManifest.xml**, add the following element inside the `<application>` element.

	> [AZURE.NOTE] Replace the placeholder with your package name.

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="<your package name>" />
            </intent-filter>
        </receiver>


8. In the Project view, expand **app** -> **src** -> **main** -> **java**. Right-click your package folder under **java**, click **New**, and then click **Java Class**.

	![][6]

9. In **Name** field for the new class type **MyHandler**, then click **OK**
	

10. Add the following import statements at the top of **MyHandler.java**:

		import android.app.NotificationManager;
		import android.app.PendingIntent;
		import android.content.Context;
		import android.content.Intent;
		import android.os.Bundle;
		import android.support.v4.app.NotificationCompat;
		import com.microsoft.windowsazure.notifications.NotificationsHandler;
		

11. Update the class declaraction as follows to make `MyHandler` a subclass of `com.microsoft.windowsazure.notifications.NotificationsHandler` as shown below.

		public class MyHandler extends NotificationsHandler {


12. Add the following code for the `MyHandler` class.

	This code overides the `OnReceive` method so the handler will pop up an `AlertDialog` to show notifications that are received. The handler also sends the notification to the Android notification manager using the `sendNotification()` method. 

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
        	mainActivity.DialogNotify("Received Notification",nhMessage);
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
	
13. In Android Studio on the menu bar click **Build** -> **Rebuild Project** to make sure no errors are detected.

##How to Send Notifications


You can run your app and send test notifications to your app from the Notification Hub in the Azure portal using the debug tab on the notification hub as shown in the screen below.

![][30]


Push notifications with Notification Hubs are normally sent in a back-end service like Mobile Services or an ASP.NET WebAPI back-end. You can use the REST API or a library to send notification messages. In this tutorial, you will just use the [Notification Hub REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx) to send the notification hub message but, here is a list of some other options.

- Azure Mobile Services : For an example of how to send notifications from an Azure Mobile Services backend integrated with Notification Hubs, see [Get started with push notifications in Mobile Services](mobile-services-javascript-backend-android-get-started-push.md).  
- Azure Notification Hub Java SDK: See [How to use Notification Hubs from Java](notification-hubs-java-backend-how-to.md) for sending notifications from Java. This has been tested in Eclipse for Android Development
- PHP: [How to use Notification Hubs from PHP](notification-hubs-php-backend-how-to.md).


In this section of the tutorial you will add code to use the [Notification Hub REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx) to send notifications to the hub directly from the Android client app. So if multiple devices have registered for GCM notifications, a single device can send notifications to all the registered devices.

![][31]

1. In Android Studio Project View expand **App**->**src**->**main**->**res**->**layout**. Open the **activity_main.xml** layout file and click the **Text** tab to update the text contents of the file. Update it with the code below that adds a new `Button` and `EditText` control for sending notification messages to the notification hub. Add this code at the bottom just before `</RelativeLayout>`.

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

2. In Android Studio Project View expand **App** -> **src** -> **main** -> **res** -> **values**. Open the **strings.xml** file and add the string values referenced by the new `Button` and `EditText` controls. Add these at the bottom of the file just before `</resources>`.

        <string name="send_button">Send Notification</string>
        <string name="notification_message_hint">Enter notification message text</string>


3. In your **MainActivity.java** file, add the following `import` statements above the `MainActivity` class.

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


3. In your **MainActivity.java** file, add the following members at the top of the `MainActivity` class. 

	Enter the name of your hub for `HubName` not the namespace. For example, "myhub". Also, enter the **DefaultFullSharedAccessSignature** connnection string. This connection string can be copied from the [Azure Management Portal] by clicking **View Connection String** on the **Dashboard** tab for your notification hub.

	    private String HubEndpoint = null;
	    private String HubSasKeyName = null;
	    private String HubSasKeyValue = null;
		private String HubFullAccess = "<Enter Your DefaultFullSharedAccess Connection string>";

4. Your activity holds the hub name and the full shared access connection string for the hub. You must create a Software Access Signature (SaS) token to authenticate a POST request to send messages to your notification hub. This is done by parsing the key data from the connection string and then creating the SaS token as mentioned in the [Common Concepts](http://msdn.microsoft.com/library/azure/dn495627.aspx) REST API reference.

	In **MainActivity.java**, add the following method to the `MainActivity` class to parse your connection string.

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

5. In **MainActivity.java**, add the following method to the `MainActivity` class to create a SaS authentication token.

        /**
         * Example code from http://msdn.microsoft.com/library/azure/dn495627.aspx to
         * construct a SaS token from the access key to authenticate a request.
         * 
         * @param uri The un-encoded resource URI string for this operation. The resource
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
	            // Apache commons codec.
                String signature = URLEncoder.encode(
                        Base64.encodeToString(rawHmac, Base64.NO_WRAP).toString(), "UTF-8");
    
                // construct authorization string
                String token = "SharedAccessSignature sr=" + targetUri + "&sig="
                        + signature + "&se=" + expires + "&skn=" + HubSasKeyName;
                return token;
            } catch (Exception e) {
                DialogNotify("Exception Generating SaS",e.getMessage().toString());
            }
    
            return null;
        }


6. In **MainActivity.java**, add the following method to the `MainActivity` class to handle the **Send Notification** button click and send the notification message to the hub using the REST API.

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
    
                        // Authenticate the POST request with the SaS token.
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

####Emulator Testing
If you want to test on an emulator, make sure your emulator image supports the Google API level you choose for your app. If your image doesn't support the Google APIs you will end up with the **SERVICE\_NOT\_AVAILABLE** exception.

Also make sure you have added your Google account to your running emulator under **Settings**->**Accounts**. Otherwise, your attempts to register with GCM may result in the **AUTHENTICATION\_FAILED** exception.

####Testing the app     

1. Run the app and notice the registration id is reported for a successful registration.

   	![][18]

2. Enter a notification message to be sent to all Android devices that have registered with the hub.

   	![][19]

3. Press **Send Notification**. Any devices that have the app running will show an `AlertDialog` with the notification message. Devices that don't have the app running but were previously registered for the notifications will receive a notification added to the notification manager. Notifications can be viewed by swiping down from the upper left hand corner.

   	![][21]

## <a name="next-steps"> </a>Next steps

In this simple example you broadcast notifications to all your Android devices. In order to target specific users refer to the tutorial [Use Notification Hubs to push notifications to users], while if you want to segment your users by interest groups you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance].


<!-- Images. -->
[1]: ./media/notification-hubs-android-get-started/mobile-services-google-new-project.png
[2]: ./media/notification-hubs-android-get-started/mobile-services-google-create-server-key.png
[3]: ./media/notification-hubs-android-get-started/mobile-services-google-create-server-key2.png
[4]: ./media/notification-hubs-android-get-started/mobile-services-google-create-server-key3.png
[5]: ./media/notification-hubs-android-get-started/mobile-services-google-enable-GCM.png
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
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409
[Referencing a library project]: http://go.microsoft.com/fwlink/?LinkId=389800
[Azure Management Portal]: https://manage.windowsazure.com/
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx

[Use Notification Hubs to push notifications to users]: notification-hubs-aspnet-backend-android-notify-users.md
[Use Notification Hubs to send breaking news]: notification-hubs-aspnet-backend-android-breaking-news.md

