<properties linkid="develop-mobile-tutorials-get-started-with-push-xamarin-android" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in Xamarin.Android apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-xamarin-android.md" />

# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-html" title="HTML">HTML</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS">iOS C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android" class="current">Android C#</a></div>

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Xamarin.Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.</p>
</div>

<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Add-Push-Notifications-to-your-Apps-with-Windows-Azure-Mobile-Services" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-android-get-started-push-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Android-Add-Push-Notifications-to-your-Apps-with-Windows-Azure-Mobile-Services" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a><span class="time">17:11</span></div>
</div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications]
2. [Configure Mobile Services]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial requires the following:

+ An active Google account

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

   ![][1]   

	<div class="dev-callout"><b>Note</b>
	<p>When you already have an existing project, you are directed to the <strong>Dashboard</strong> page after login. To create a new project from the Dashboard, expand <strong>API Project</strong>, click <strong>Create...</strong> under <strong>Other projects</strong>, then enter a project name and click <strong>Create project</strong>.</p>
    </div>

2. Click the Overview button in the left column, and make a note of the Project Number in the Dashboard section. 

	Later in the tutorial you set this value as the PROJECT_ID variable in the client.

3. On the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> page, click **Services**, then click the toogle to turn on **Google Cloud Messaging for Android** and accept the terms of service. 

4. Click **API Access**, and then click **Create new Server key...** 

   ![][2]

5. In **Configure Server Key for API Project**, click **Create**.

	![][3]

6. Make a note of the **API key** value.

	![][4] 

Next, you will use this API key value to enable Mobile Services to authenticate with GCM and send push notifications on behalf of you app.

<a name="configure"></a><h2><span class="short-header">Configure the service</span>Configure Mobile Services to send push requests</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][18]

2. Click the **Push** tab, enter the **API Key** value obtained from GCM in the previous procedure, and then click **Save**.

   ![][19]

You mobile service is now configured to work with GCM to send push notifications.

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. Open the project file AndroidManifest.xml and add the following new permissions after the existing `uses-permission` element:

	   	<uses-permission android:name="android.permission.WAKE_LOCK" />
	    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
	    <uses-permission android:name="**my_app_package**.permission.C2D_MESSAGE" />
	    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />   

2. In the code inserted in the previous step, replace _`**my_app_package**`_ with the name of the app package for your project, which is the value of the `manifest.package` attribute. 

3. Note that in the `uses-sdk` element, the **targetSdkVersion** must be 16 or greater since notifications don't work for earlier versions of the API.

4. Open the file TodoItem.java, add the following code to the **TodoItem** class:

        [DataMember(Name = "channel")]        public string RegistrationId { get; set; }

	This code creates a new property that holds the registration ID.

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

5. Create a new class named **PushBroadcastReceiver** that is defined as the following:

        [BroadcastReceiver(Permission= "com.google.android.c2dm.permission.SEND")]
        [IntentFilter(new[] { "com.google.android.c2dm.intent.RECEIVE" }, 
        	Categories = new[] {"my_app_package" })]
        [IntentFilter(new[] { "com.google.android.c2dm.intent.REGISTRATION" }, 
        	Categories = new[] {"my_app_package" })]
        [IntentFilter(new[] { "com.google.android.gcm.intent.RETRY" }, 
        	Categories = new[] {"my_app_package**"})]
        public class PushBroadcastReceiver : BroadcastReceiver
        {
            const string TAG = "PushHandlerBroadcastReceiver";

            public PushBroadcastReceiver()
            {
                Debug.WriteLine("PushBroadcastReceiver()");
            }

            public override void OnReceive(Context context, Intent intent)
            {
                Debug.WriteLine("Receiver action is " + intent.Action);

                PushIntentService.RunIntentInService(context, intent);
                SetResult(Result.Ok, null, null);
            }
        }

6. Replace **my_app_package** in **PushBroadcastReceiver** with the name of the app package for your project, which is the value of the manifest.package attribute

6. Add the following private variable to the **TodoActivity** class, where _`<PROJECT_ID>`_ is the project ID assigned by Google to your app in the first procedure:

		private const string SENDER_ID = "<PROJECT_ID>"; // Google API Project Number

7. Create a new method named **RegisterForPushNotifications** defined with this code:

        private void RegisterForPushNotifications()
        {
            string senders = SENDER_ID; // Google API Project Number
            Intent intent = new Intent("com.google.android.c2dm.intent.REGISTER");
            intent.PutExtra("app", PendingIntent.GetBroadcast(this, 0, new Intent(), 0));
            intent.PutExtra("sender", senders);
            StartService(intent);
        }
8. Create a new method named **UnregisterForPushNotifications** defined with this code:

        private void UnregisterForPushNotifications()
        {
            var intent = new Intent("com.google.android.c2dm.intent.UNREGISTER");
            intent.PutExtra("app", PendingIntent.GetBroadcast(this, 0, new Intent(), 0));
            StartService(intent);
        }

9. In the **OnCreate** method, add this code before the MobileServiceClient is instantiated:

		RegisterForPushNotifications();

	This code requests the registration, which in turn gets the registration ID.

10. Create a new class named **PushIntentService** that is defined as the following:

		[Service]
        public class PushIntentService : IntentService
        {
            static PowerManager.WakeLock sWakeLock;
            static object LOCK = new object();

            public static string RegistrationId { get; set; }

            public static void RunIntentInService(Context context, Intent intent)
            {
                lock (LOCK)
                {
                    if (sWakeLock == null)
                    {
                        // This is called from BroadcastReceiver, there is no init.
                        var pm = PowerManager.FromContext(context);
                        sWakeLock = pm.NewWakeLock(
                            WakeLockFlags.Partial, "My WakeLock Tag");
                    }
                }

                sWakeLock.Acquire();
                intent.SetClass(context, typeof(PushIntentService));
                context.StartService(intent);
            }

            protected override void OnHandleIntent(Intent intent)
            {
                try
                {
                    Context context = this.ApplicationContext;
                    string action = intent.Action;
                                                  
                    if (action.Equals("com.google.android.c2dm.intent.REGISTRATION"))
                    {
                        HandleRegistration(context, intent);
                    }
                    else if (action.Equals("com.google.android.c2dm.intent.RECEIVE"))
                    {
                        HandleMessage(context, intent);
                    }
                }
                finally
                {
                    lock (LOCK)
                    {
                        //Sanity check for null as this is a public method
                        if (sWakeLock != null)
                            sWakeLock.Release();
                    }
                }
            }

            protected async void HandleRegistration(Context context, Intent intent)
            {
                try 
                {
                    RegistrationId = intent.GetStringExtra("registration_id");
                    string error = intent.GetStringExtra("error");

                    if (!String.IsNullOrEmpty(RegistrationId)) 
                    {
                        // TODO:: handle success
                    }
                    else if (!String.IsNullOrEmpty (error)) {
                        // TODO:: handle error
                    }
                } 
                catch (Exception ex) 
                {
                    // TODO:: handle error
                }
            }

            private void HandleMessage(Context context, Intent intent)
            {
	            // TODO:: do something with the received message (ex: intent.GetStringExtra("text"))
            }
        }

12. Add the following line of code to the **TodoItem** constructor in the **AddItem** method of **TodoActivity**:

		RegistrationId = PushIntentService.RegistrationId

	This code sets the registrationId property of the item to the registration ID of the device.

Your app is now updated to support push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][21]

2. In **TodoItem**, click the **Script** tab and select **Insert**.
   
  	![][22]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
			request.execute({
				success: function() {
					// Write to the response and then send the notification in the background
					request.respond();
					push.gcm.send(item.channel, item.text, {
						success: function(response) {
							console.log('Push notification sent: ', response);
						}, error: function(error) {
							console.log('Error sending push notification: ', error);
						}
					});
				}
			});
		}

   This registers a new insert script, which uses the [gcm object] to send a push notification (the inserted text) to the device provided in the insert request. 

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

<div class="dev-callout"><b>Note</b>
	<p>When you run this app in the emulator, make sure that you use an Android Virtual Device (AVD) that supports Google APIs.</p>
</div>

1. In Xamarin Studio, choose **Open Android Emulator Manager..** from the **Tools** menu, select your device, click **Edit**.

	![][24]

2. Select **Google APIs** in **Target**, then click OK.

   ![][25]

	This targets the AVD to use Google APIs.

3. From the **Run** menu, then click **Run** to start the app.

4. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the **Add** button.

  	![][26]

5. You will see an icon appear in the upper left corner of the emulator, which we have outlined in red to emphasize it (the red does not appear on the actual screen). 

  	![][28]

6. Tap on the icon and swipe down to display the notification, which appears in the graphic below.

  	![][27]

You have successfully completed this tutorial.

## Get completed example
Download the [completed example project]. Be sure to update the **applicationURL** and **applicationKey** variables with your own Azure settings. 

## <a name="next-steps"> </a>Next steps

<!--In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. -->

This concludes the tutorials that demonstrate the basics of working with push notifications. Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services android conceptual]
  <br/>Learn more about using Mobile Services with Android devices.

<!-- Anchors. -->
[Register your app for push notifications]: #register
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-google-developers.png
[2]: ../Media/mobile-services-google-create-server.png
[3]: ../Media/mobile-services-google-create-server2.png
[4]: ../Media/mobile-services-google-create-server3.png
[18]: ../Media/mobile-services-selection.png
[19]: ../Media/mobile-push-tab-android.png
[21]: ../Media/mobile-portal-data-tables.png
[22]: ../Media/mobile-insert-script-push2.png
[23]: ../Media/mobile-services-import-android-properties.png
[24]: ../Media/mobile-services-android-virtual-device-manager.png
[25]: ../Media/mobile-services-android-virtual-device-manager-edit.png
[26]: ../Media/mobile-quickstart-push1-android.png
[27]: ../Media/mobile-quickstart-push2-android.png
[28]: ../Media/mobile-push-icon.png

<!-- URLs. TODO:: update 'Download the Android app project' download link, 'GitHub', completed project, etc. -->
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Android Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-xamarin-android.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-xamarin-android.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-xamarin-android.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-xamarin-android.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-xamarin-android.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-xamarin-android.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services android conceptual]: ../HowTo/mobile-services-client-xamarin-android.md
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645
[completed example project]: http://www.google.com

