<properties linkid="develop-notificationhubs-tutorials-get-started-android" urlDisplayName="Get Started" pageTitle="Get Started with Windows Azure Notification Hubs" metaKeywords="" description="Learn how to use Windows Azure Notification Hubs to push notifications." metaCanonical="" services="" documentationCenter="Mobile" title="Get started with Notification Hubs" authors=""  solutions="" writer="elioda" manager="" editor=""  />





# Get started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/manage/services/notification-hubs/getting-started-windows-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-ios" title="iOS">iOS</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-android" title="Android" class="current">Android</a><a href="/en-us/manage/services/notification-hubs/getting-started-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/manage/services/notification-hubs/getting-started-xamarin-android" title="Xamarin.Android">Xamarin.Android</a></div>

This topic shows you how to use Windows Azure Notification Hubs to send push notifications to an Android application. 
In this tutorial, you create a blank Android app that receives push notifications using Google Cloud Messaging (GCM). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

The tutorial walks you through these basic steps to enable push notifications:

1. [Enable Google Cloud Messaging]
2. [Configure your Notification Hub]
3. [Connecting your app to the Notification Hub]
4. [Run your app with the emulator]
5. [Send notifications from your back-end]

This tutorial demonstrates the simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to see how to use notification hubs to address specific users and groups of devices. This tutorial requires the following:

+ Android SDK (it is assumed you will be using Eclipse), which you can download from <a href="http://developer.android.com/sdk/index.html">here</a>.
+ Active Windows Store account.

Completing this tutorial is a prerequisite for all other notification hub tutorials for Android apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you must have an active Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Windows Azure Free Trial</a>.</p></div>

<h2><a name="register"></a><span class="short-header">Enable Google Cloud Messaging</span>Enable Google Cloud Messaging</h2>

<p></p>

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

   ![][1]   

	<div class="dev-callout"><b>Note</b>
	<p>When you already have an existing project, you are directed to the <strong>Dashboard</strong> page after login. To create a new project from the Dashboard, expand <strong>API Project</strong>, click <strong>Create...</strong> under <strong>Other projects</strong>, then enter a project name and click <strong>Create project</strong>.</p>
    </div>

2. Click **Overview** in the left column, and make a note of the project number in the **Dashboard** section. 

	Later in the tutorial you set this value as the PROJECT_ID variable in the client.

3. On the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> page, click **Services**, then click the toggle to enable **Google Cloud Messaging for Android** and accept the terms of service. 

4. Click **API Access**, and then click **Create new Server key...** 

   ![][2]

5. In **Configure Server Key for API Project**, click **Create**.

   ![][3]

6. Make a note of the **API key** value.

   ![][4] 

Next, you will use this API key value to enable your notification hub to authenticate with GCM and send push notifications on behalf of your application.

<h2><a name="configure-hub"></a><span class="short-header">Configure your Notification Hub</span>Configure your Notification Hub</h2>

1. Log on to the [Windows Azure Management Portal], and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.

   ![][7]

3. Type a name for your notification hub, select your desired region, and then click **Create a new Notification Hub**.

   ![][8]

4. Click the namespace you just created (usually ***notification hub name*-ns**), and then click **Configure** at the top.

   ![][9]

5. Click the **Notification Hubs** tab at the top, and then click on the notification hub you just created.

   ![][10]

6. Click the **Configure** tab at the top, enter the **API Key** value you obtained in the previous section, and then click **Save**.

   ![][11]

7. Select the **Dashboard** tab at the top, then click **Connection Information**. Take note of the two connection strings.

   ![][12]

Your notification hub is now configured to work with GCM, and you have the connection strings to register your app and send push notifications.

<h2><a name="connecting-app"></a><span class="short-header">Connecting your app</span>Connecting your app to the Notification Hub</h2>

1. In Eclipse ADT, create a new Android project (File, New, Android Application).

   ![][13]

2. Set Minimum Required SDK to API 8: Android 2.2 (Froyo). Then follow the wizard, making sure to click **Create activity** to create a blank activity.

   ![][14]

3. Open the Android SDK Manager from the top toolbar of Eclipse. Click **Google APIs**, **Google Cloud Messaging for Android Library**, and **Google Play Service**, as shown below. Click Install Packages. Restart Eclipse.

	<div class="dev-callout"><b>Note</b>
    <p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
    </div> 

   ![][15]

4. Browse to the SDK path, and copy the following files to the \libs directory of your project in the Package Explorer: \extras\google\gcm\gcm-client\dist\gcm.jar; \extras\google\google_play_services\libproject\google-play-services_lib\libs\google-play-services.jar.

5. Download the Notification Hubs Android SDK from <a href="https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409">here</a>. Extract the .zip file and copy the file notificationhubs\notification-hubs-sdk.jar to the \libs directory of your project in the Package Explorer.

6. Right-click on the project in the Package Explorer, and click **Properties**. Then click **Android** in the left-hand pane. Check the **Google APIs** target. Click **OK**.

   ![][16]

	Now, set up the application to obtain a *registrationId* from GCM, and use the *registrationId* to register the app instance to the notification hub.

7. In the AndroidManifest.xml file, add the following line just below the <uses-sdk/> element. Make sure to replace `<your package>` with the package you selected for your app in step 1 (`com.microsoft.testnotificationhub`s in this example).

        <uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.GET_ACCOUNTS"/>
		<uses-permission android:name="android.permission.WAKE_LOCK"/>
		<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />

		<permission android:name="<your package>.permission.C2D_MESSAGE" android:protectionLevel="signature" />
		<uses-permission android:name="<your package>.permission.C2D_MESSAGE"/>

8. In the **MainActivity** class, add the following private members.

	<div class="dev-callout"><b>Note</b>
    <p>Make sure to use the sender ID you obtained earlier.</p>
    </div> 

		private String SENDER_ID = "<your project number>";
		private GoogleCloudMessaging gcm;
		private NotificationHub hub;

9. In the **OnCreate** method add the following code, and make sure to replace the placeholders with your connection string with listen access obtained in the previous section, and the name of your notification hub.

		gcm = GoogleCloudMessaging.getInstance(this);
        
		String connectionString = "<your listen access connection string>";
		hub = new NotificationHub("<your notification hub name>", connectionString, this);
		
		registerWithNotificationHubs();

10. In MainActivity.java, create the following method:

		@SuppressWarnings("unchecked")
		private void registerWithNotificationHubs() {
		   new AsyncTask() {
		      @Override
		      protected Object doInBackground(Object... params) {
		         try {
		            String regid = gcm.register(SENDER_ID);
		            hub.register(regid);
		         } catch (Exception e) {
		            return e;
		         }
		         return null;
		     }
		   }.execute(null, null, null);
		}

11. Because Android does not display notifications, you must write your own receiver. In **AndroidManifest.xml**, add the following element inside the `<application/>` element.

	<div class="dev-callout"><b>Note</b>
    <p>Replace the placeholder with your package name.</p>
    </div> 

		<receiver
		    android:name=".MyBroadcastReceiver"
		    android:permission="com.google.android.c2dm.permission.SEND" >
		   <intent-filter>
		      <action android:name="com.google.android.c2dm.intent.RECEIVE" />
		      <category android:name="<your package name>" />
		   </intent-filter>
		</receiver>

12. Create a new class (right-click your app package in Package Explorer and click **New**, then click **Class**). Name the class **MyBroadcastReceiver**, derived from **android.content.BroadcastReceiver**.

   ![][17]

13. Add the following code to **MyBroadcastReceiver**:

		public static final int NOTIFICATION_ID = 1;
		private NotificationManager mNotificationManager;
		NotificationCompat.Builder builder;
		Context ctx;
		
		@Override
		public void onReceive(Context context, Intent intent) {
		GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(context);
		        ctx = context;
		        String messageType = gcm.getMessageType(intent);
		        if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
		            sendNotification("Send error: " + intent.getExtras().toString());
		        } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
		            sendNotification("Deleted messages on server: " + 
		                    intent.getExtras().toString());
		        } else {
		            sendNotification("Received: " + intent.getExtras().toString());
		        }
		        setResultCode(Activity.RESULT_OK);
		}
		
		private void sendNotification(String msg) {
		mNotificationManager = (NotificationManager)
		              ctx.getSystemService(Context.NOTIFICATION_SERVICE);
		      
		      PendingIntent contentIntent = PendingIntent.getActivity(ctx, 0,
		          new Intent(ctx, MainActivity.class), 0);
		      
		      NotificationCompat.Builder mBuilder =
		          new NotificationCompat.Builder(ctx)
		          .setSmallIcon(R.drawable.ic_launcher)
		          .setContentTitle("Notification Hub Demo")
		          .setStyle(new NotificationCompat.BigTextStyle()
		                     .bigText(msg))
		          .setContentText(msg);
		      
		     mBuilder.setContentIntent(contentIntent);
		     mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
		}


<h2><a name="run-app"></a><span class="short-header">Run your app</span>Run your app in the emulator</h2>

When you run this app in the emulator, make sure that you use an Android Virtual Device (AVD) that supports Google APIs.

1. From **Window**, click **Android Virtual Device Manager**, select your device, and then click **Edit**.

   ![][18]

2. Select **Google APIs** in **Target**, then click **OK**.

   ![][19]

3. On the top toolbar, click **Run**, and then select your app. This starts the emulator and run the app.

4. The app retrieves the *registrationId* from GCM and registers with the Notification Hub.

	<div class="dev-callout"><b>Note</b>
    <p>In order to receive push notifications, you must set up a Google account on your Android Virtual Device (in the emulator, navigate to **Settings** and click **Add Account**). Also, make sure that the emulator is connected to the Internet.</p>
    </div> 

<h2><a name="send"></a><span class="short-header">Send notification</span>Send notification from your back-end</h2>

You can send notifications using Notification Hubs from any back-end using our <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial we will send notifications with a .NET console app, and with a Mobile Service using a node script.

To send notifications using a .NET app:

1. Create a new Visual C# console application: 

   ![][20]

2. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then **Library Package Manager**, then **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.ServiceBus

    and press Enter.

2. Open the file Program.cs and add the following using statement:

        using Microsoft.ServiceBus.Notifications;

3. In your `Program` class add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            await hub.SendGcmNativeNotificationAsync("{ \"data\" : {\"msg\":\"Hello from Windows Azure!\"}}");
        }

4. Then add the following lines in your Main method:

         SendNotificationAsync();
		 Console.ReadLine();

5. Press the F5 key to run the app. You should receive a toast notification.

   ![][21]

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then:

1. Log on to the [Windows Azure Management Portal], and select your Mobile Service.

2. Select the tab **Scheduler** on the top.

   ![][22]

3. Create a new scheduled job, insert a name, and select **On demand**.

   ![][23]

4. When the job is created, click the job name. Then click the tab **Script** in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. Click **Save**.

        var azure = require('azure');
		var notificationHubService = azure.createNotificationHubService('<hub name>', '<connection string>');
		notificationHubService.gcm.send(null,'{"data":{"msg" : "Hello from Mobile Services!"}}',
    	  function (error)
    	  {
        	if (!error) {
               console.warn("Notification successful");
            }
            else
            {
              console.warn("Notification failed" + error);
            }
          }
	    );

6. Click **Run Once** on the bottom bar. You should receive a toast notification.

## <a name="next-steps"> </a>Next steps

In this simple example you broadcast notifications to all your Android devices. In order to target specific users refer to the tutorial [Use Notification Hubs to push notifications to users], while if you want to segment your users by interest groups you can read [Use Notification Hubs to send breaking news]. Learn more about how to use Notification Hubs in [Notification Hubs Guidance] and on the [Notification Hubs How-To for Android].

<!-- Anchors. -->
[Enable Google Cloud Messaging]: #register
[Configure your Notification Hub]: #configure-hub
[Connecting your app to the Notification Hub]: #connecting-app
[Run your app with the emulator]: #run-app
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../media/mobile-services-google-developers.png
[2]: ../media/mobile-services-google-create-server.png
[3]: ../media/mobile-services-google-create-server2.png
[4]: ../media/mobile-services-google-create-server3.png

[7]: ../media/notification-hub-create-from-portal.png
[8]: ../media/notification-hub-create-from-portal2.png
[9]: ../media/notification-hub-select-from-portal.png
[10]: ../media/notification-hub-select-from-portal2.png
[11]: ../media/notification-hub-configure-android.png
[12]: ../media/notification-hub-connection-strings.png

[13]: ../media/notification-hub-create-android-app.png
[14]: ../media/notification-hub-create-android-app2.png
[15]: ../media/notification-hub-create-android-app4.png
[16]: ../media/notification-hub-create-android-app5.png
[17]: ../media/notification-hub-create-android-app6.png

[18]: ../media/notification-hub-create-android-app7.png
[19]: ../media/notification-hub-create-android-app8.png

[20]: ../media/notification-hub-create-console-app.png
[21]: ../media/notification-hub-android-toast.png
[22]: ../media/notification-hub-scheduler1.png
[23]: ../media/notification-hub-scheduler2.png

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Android]: http://msdn.microsoft.com/en-us/library/dn282661.aspx

[Use Notification Hubs to push notifications to users]: ./tutorial-notify-users-aspnet.md
[Use Notification Hubs to send breaking news]: ./breaking-news-dotnet.md

