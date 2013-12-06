<properties linkid="" urlDisplayName="" pageTitle="" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Get started with Notification Hubs" authors=""  solutions="" writer="elioda" manager="" editor=""  />





# Get started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/manage/services/notification-hubs/getting-started-windows-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-ios" title="iOS">iOS</a><a href="/en-us/manage/services/notification-hubs/get-started-notification-hubs-android" title="Android">Android</a><a href="/en-us/manage/services/notification-hubs/getting-started-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/manage/services/notification-hubs/getting-started-xamarin-android" title="Xamarin.Android" class="current">Xamarin.Android</a></div>

This topic shows you how to use Windows Azure Notification Hubs to send push notifications to a Xamarin.Android application. 
In this tutorial, you create a blank Xamarin.Android app that receives push notifications using Google Cloud Messaging (GCM). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub. The finished code is available in the [NotificationHubs app][GitHub] sample.

The tutorial walks you through these basic steps to enable push notifications:

1. [Enable Google Cloud Messaging]
2. [Configure your Notification Hub]
3. [Connecting your app to the Notification Hub]
4. [Run your app with the emulator]
5. [Send notifications from your back-end]

This tutorial demonstrates the simple broadcast scenario using Notification Hubs. <!-- Be sure to follow along with the next tutorial to see how to use notification hubs to address specific users and groups of devices. --> This tutorial requires the following:

+ Xamarin.Android
+ Active Google account

Completing this tutorial is a prerequisite for all other notification hub tutorials for Android apps. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you must have an active Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A9C9624B5&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fmanage%2Fservices%2Fnotification-hubs%2Fgetting-started-xamarin-android%2F" target="_blank">Windows Azure Free Trial</a>.</p></div>

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

### Create a new project

1. In Xamarin Studio (or Visual Studio), create a new Android project (File, New, Solution, Android Application).

   ![][13]   
   ![][14]

2. Open the project properties by right clicking on your new project in the Solution view, and choosing **Options**. Select the **Android Application** item in the **Build** section.

   ![][15]

3. Set the **Minimum Android version** to API Level 8.

4. Set the **Target Android version** to the API version you would like to target (must be API level 8 or higher).

5. Ensure that the first letter of your **Package name** is lowercase.

	<div class="dev-callout"><b>Note</b>
    <p>The first letter of the package name must be lowercase. Otherwise you will receive application manifest errors when registering your **BroadcastReceiver** and **IntentFilter**s for push notifications below.</p>
    </div> 

### Add PushSharp to your project

1. Now we will want to add **PushSharp** as a reference in our project. To do this we must compile the latest version of PushSharp and add the compiled DLL as a reference to our Xamarin.Android project.

2. Visit the [PushSharp Github page], and download the latest release. Once you've extracted the collection of files, navigate to the following sample project folder:

	**/Client.Samples/PushSharp.ClientSample.MonoForAndroid/PushSharp.ClientSample.MonoForAndroid.Gcm/**

	.. and open the following project file in Xamarin Studio (or Visual Studio):
	
	**  PushSharp.ClientSample.MonoForAndroid.Gcm.csproj **

3. Build the MonoForAndroid PushSharp client sample in **Release** mode.

4. Create an **_external** folder in your Xamarin.Android project folder

5. Copy the following file from the MonoForAndroid PushSharp client sample to the newly created **_external** folder in your Xamarin.Android project folder:

	 **\bin\Release\PushSharp.Client.MonoForAndroid.dll**

6. Open your Xamarin.Android project in Xamarin Studio (or Visual Studio). 

7. Right click the project **References** folder, and choose **Edit References…**

8. Go to the **.Net Assembly** tab, browse to your project's **_external** folder, select the **PushSharp.Client.MonoForAndroid.dll** we built earlier and click **Add**. Click OK to close the dialog. 

### Add Xamarin.NotificationHub to your project

1. Now we need to add libraries to support the NotificationHub class. Visit the [Xamarin.NotificationHub Github page], download and build the source folder.

2. Copy the compiled **ByteSmith.WindowsAzure.Messaging.Android.dll** into your **_external** folder in your Xamarin.Android project folder.

3. Open your Xamarin.Android project in Xamarin Studio (or Visual Studio).

4. Right click the project **References** folder, and choose **Edit References…**

5. Go to the **.Net Assembly** tab, browse to your project's **_external** folder, select the **ByteSmith.WindowsAzure.Messaging.Android.dll** we built earlier and click **Add**. Click OK to close the dialog. 

### Setup Notification Hubs in your project

1. Create a **Constants.cs** class and define the following constant values (replacing placeholders with values):

        public const string SenderID = "<GoogleProjectNumber>"; // Google API Project Number

        // Azure app specific connection string and hub path
        public const string ConnectionString = "<Azure connection string>"";
        public const string NotificationHubPath = "<hub path>";

2. Add the following using statements to **MainActivity.cs**:

		using ByteSmith.WindowsAzure.Messaging;
		using PushSharp.Client;

3. Create the following method in the **MainActivity** class:

		private void RegisterWithGCM()
        {
            // Check to ensure everything's setup right
            PushClient.CheckDevice(this);
            PushClient.CheckManifest(this);

            // Register for push notifications
            System.Diagnostics.Debug.WriteLine("Registering...");
            PushClient.Register(this, Constants.SenderID);
        }

4. Create a new class **MyBroadcastReceiver**.

	<div class="dev-callout"><b>Note</b>
    <p>We will walk through creating a **BroadcastReceiver** from scratch. However, a quick alternative to manually creating the **MyBroadcastReceiver.cs** below is to refer to the **PushService.cs** file found in the PushSharp sample Xamarin.Android project on GitHub. Duplicating th **PushService.cs** and changing class names can be a great place to start as well.</p>
    </div> 

5. Add the following using statements to **MyBroadcastReceiver.cs**:

		using ByteSmith.WindowsAzure.Messaging;
		using PushSharp.Client;

5. Add the following permission requests between the **using** statements and the **namespace** declaration:

		[assembly: Permission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
		[assembly: UsesPermission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
		[assembly: UsesPermission(Name = "com.google.android.c2dm.permission.RECEIVE")]

		//GET_ACCOUNTS is only needed for android versions 4.0.3 and below
		[assembly: UsesPermission(Name = "android.permission.GET_ACCOUNTS")]
		[assembly: UsesPermission(Name = "android.permission.INTERNET")]
		[assembly: UsesPermission(Name = "android.permission.WAKE_LOCK")]

6. In **MyBroadcastReceiver.cs** change the **MyBroadcastReceiver** class to match the following:

    	[BroadcastReceiver(Permission=GCMConstants.PERMISSION_GCM_INTENTS)]
        [IntentFilter(new string[] { GCMConstants.INTENT_FROM_GCM_MESSAGE }, Categories = new string[] { "@PACKAGE_NAME@" })]
        [IntentFilter(new string[] { GCMConstants.INTENT_FROM_GCM_REGISTRATION_CALLBACK }, Categories = new string[] { "@PACKAGE_NAME@" })]
        [IntentFilter(new string[] { GCMConstants.INTENT_FROM_GCM_LIBRARY_RETRY }, Categories = new string[] { "@PACKAGE_NAME@" })]
        public class MyBroadcastReceiver : PushHandlerBroadcastReceiverBase<PushHandlerService>
        {
            public static string[] SENDER_IDS = new string[] { Constants.SenderID };

            public const string TAG = "MyBroadcastReceiver-GCM";
        }
        
7. Add another class in **MyBroadcastReceiver.cs** named **PushHandlerService** which derives from **PushHandlerServiceBase**. Make sure to use the **Service** directive on the class:

    	[Service] //Must use the service tag
    	public class PushHandlerService : PushHandlerServiceBase
    	{
        	public static string RegistrationID { get; private set; }
        	private NotificationHub Hub { get; set; }

        	public PushHandlerService() : base(Constants.SenderID) 
       		{
            	Log.Info(MyBroadcastReceiver.TAG, "PushHandlerService() constructor"); 
        	}
    	}


8. **PushHandlerServiceBase** implements methods **OnRegistered()**, **OnUnRegistered()**, **OnMessage()**, **OnRecoverableError()**, and **OnError()**. Our implementation class **PushHandlerService** must override these methods, and these methods will fire in response to interacting with the notification hub.

9. Override the **OnRegistered()** method in **PushHandlerService** with the following code:

        protected override async void OnRegistered(Context context, string registrationId)
        {
            Log.Verbose(MyBroadcastReceiver.TAG, "GCM Registered: " + registrationId);
            RegistrationID = registrationId;

            createNotification("PushHandlerService-GCM Registered...", "The device has been Registered, Tap to View!");

            Hub = new NotificationHub(Constants.NotificationHubPath, Constants.ConnectionString);
            try
            {
                await Hub.UnregisterAllAsync(registrationId);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debugger.Break();
            }

            var tags = new List<string>() { "falcons" }; // create tags if you want

            try
            {
                var hubRegistration = await Hub.RegisterNativeAsync(registrationId, tags);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message); 
                Debugger.Break();
            }
        }

	<div class="dev-callout"><b>Note</b>
    <p>In the **OnRegistered()** code above you should note the ability to specify tags to register for specific messaging channels.</p>
    </div> 
    
10. Override the **OnMessage** method in **PushHandlerService** with the following code:

        protected override void OnMessage(Context context, Intent intent)
        {
            Log.Info(MyBroadcastReceiver.TAG, "GCM Message Received!");

            var msg = new StringBuilder();

            if (intent != null && intent.Extras != null)
            {
                foreach (var key in intent.Extras.KeySet())
                    msg.AppendLine(key + "=" + intent.Extras.Get(key).ToString());
            }

            string messageText = intent.Extras.GetString("msg");
            if (!string.IsNullOrEmpty(messageText))
            {
                createNotification("New hub message!", messageText);
                return;
            }

            createNotification("Unknown message details", msg.ToString());
        }

11. Add the following **createNotification** method to **PushHandlerService** for notifying users as used above:

        void createNotification(string title, string desc)
        {
            //Create notification
            var notificationManager = GetSystemService(Context.NotificationService) as NotificationManager;

            //Create an intent to show ui
            var uiIntent = new Intent(this, typeof(MainActivity));

            //Create the notification
            var notification = new Notification(Android.Resource.Drawable.SymActionEmail, title);

            //Auto cancel will remove the notification once the user touches it
            notification.Flags = NotificationFlags.AutoCancel;

            //Set the notification info
            //we use the pending intent, passing our ui intent over which will get called
            //when the notification is tapped.
            notification.SetLatestEventInfo(this, title, desc, PendingIntent.GetActivity(this, 0, uiIntent, 0));

            //Show the notification
            notificationManager.Notify(1, notification);
        }
        
12. Override abstract members **OnUnRegistered()**, **OnRecoverableError()**, and **OnError()** so that your code compiles.


<h2><a name="run-app"></a><span class="short-header">Run your app</span>Run your app in the emulator</h2>

When you run this app in the emulator, make sure that you use an Android Virtual Device (AVD) that supports Google APIs.

1. From **Tools**, click **Open Android Emulator Manager**, select your device, and then click **Edit**.

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

[13]: ../media/notification-hub-create-xamarin-android-app1.png
[14]: ../media/notification-hub-create-xamarin-android-app2.png
[15]: ../media/notification-hub-create-xamarin-android-app3.png

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
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-xamarin-android/#create-new-service
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Android]: http://msdn.microsoft.com/en-us/library/dn282661.aspx

[Use Notification Hubs to push notifications to users]: ./tutorial-notify-users-aspnet.md
[Use Notification Hubs to send breaking news]: ./breaking-news-dotnet.md
[PushSharp Github page]: https://github.com/Redth/PushSharp
[Xamarin.NotificationHub Github page]: https://github.com/SaschaDittmann/Xamarin.NotificationHub
[GitHub]: http://go.microsoft.com/fwlink/p/?LinkId=331329