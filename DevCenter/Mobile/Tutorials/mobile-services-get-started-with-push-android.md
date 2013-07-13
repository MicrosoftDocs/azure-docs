<properties linkid="develop-mobile-tutorials-get-started-with-push-android" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in Android apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-android.md" />

# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android" class="current">Android</a></div>

<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use Windows Azure Mobile Services to send push notifications to an Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.</p>
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

+ [Mobile Services Android SDK]
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

1. In Eclipse, click **Window**, then click **Android SDK Manager**. 

2. In the Android SDK Manager, expand **Extras**, check **Google Cloud Messaging for Android Library**, make a note of the **SDK Path**, click **Install Package**, select **Accept** to accept the license, then click **Install**.

	![][5]

3. In the Android SDK Manager, under the **Android n.m (API x)** node, check **Google APIs**, then click **Install**. 

4. Browse to the SDK path (usually in a folder named `adt-bundle-windows-x86_64`), and copy the `gcm.jar` file from the `\extras\google\gcm\gcm-client\dist` subfolder into the `\libs` project subfolder, then in Package Explorer, right-click the **libs** folder and click **Refresh**.  

	The `gcm.jar` library file is now shown in your project.

5. Open the project file AndroidManifest.xml and add the following new permissions after the existing `uses-permission` element:

        <permission android:name="**my_app_package**.permission.C2D_MESSAGE" 
            android:protectionLevel="signature" />
        <uses-permission android:name="**my_app_package**.permission.C2D_MESSAGE" /> 
        <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
        <uses-permission android:name="android.permission.GET_ACCOUNTS" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />

6. Add the following code into the `application` element: 

        <receiver android:name="com.google.android.gcm.GCMBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                    <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
                    <category android:name="**my_app_package**" />
            </intent-filter>
        </receiver>
        <service android:name=".GCMIntentService" />

7. Note that in the `uses-sdk` element, the **targetSdkVersion** must be 16 or greater since notifications don't work for earlier versions of the API.

8. In the code inserted in the previous two steps, replace _`**my_app_package**`_ with the name of the app package for your project, which is the value of the `manifest.package` attribute. 

9. Open the file ToDoItem.java, add the following code to the **TodoItem** class:

		@com.google.gson.annotations.SerializedName("channel")
		private String mRegistrationId;

		public String getRegistrationId() {
			return mRegistrationId;
		}

		public final void setRegistrationId(String registrationId) {
			mRegistrationId = registrationId;
		}

	This code creates a new property that holds the registration ID.

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

10.  Open the file ToDoItemActivity.java, and add the following import statement:

		import com.google.android.gcm.GCMRegistrar;

11. Add the following private variables to the class, where _`<PROJECT_ID>`_ is the project ID assigned by Google to your app in the first procedure:

		private String mRegistationId;
		public static final String SENDER_ID = "<PROJECT_ID>";

12. In the **onCreate** method, add this code before the MobileServiceClient is instantiated:

		GCMRegistrar.checkDevice(this);
		GCMRegistrar.checkManifest(this);
		mRegistationId = GCMRegistrar.getRegistrationId(this);
		if (mRegistationId.equals("")) {
			GCMRegistrar.register(this, SENDER_ID);
		}

	This code get the registration ID for the device.

13. Add the following line of code to the **addItem** method:

		item.setRegistrationId(mRegistationId);

	This code sets the registrationId property of the item to the registration ID of the device.

14. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

15. In **Name** type `GCMIntentService`, in **Superclass** type `com.google.android.gcm.GCMBaseIntentService`, then click **Finish**

	![][6]

	This creates the new GCMIntentService class.

16. Add the following import statements:

		import android.app.Notification;
		import android.app.NotificationManager;
		import android.support.v4.app.NotificationCompat;

17. In the new class, add the following constructor:

		public GCMIntentService(){
			super(ToDoActivity.SENDER_ID);
		}

	This code invokes the Superclass constructor with the app `SENDER_ID` value of the app.

18. Replace the existing onMessage method override with the following code:

		@Override
		protected void onMessage(Context context, Intent intent) {
			
			PendingIntent contentIntent = PendingIntent.getActivity(
				context, 0, new Intent(context, ToDoActivity.class), 0);


			NotificationCompat.Builder mBuilder =
					new NotificationCompat.Builder(this)
						.setSmallIcon(R.drawable.ic_launcher)
						.setContentTitle("New todo item!")
						.setContentIntent(contentIntent)
						.setPriority(Notification.PRIORITY_HIGH)
						.setContentText(intent.getStringExtra("message"));
			NotificationManager mNotificationManager =
				(NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
			mNotificationManager.notify(0, mBuilder.build());
			
		}

    <div class="dev-callout"><b>Note</b>
	<p>In this tutorial, only the <strong>onMessage</strong> override is implemented. In a real-world app you should consider implementing all four method overrides.</p>
    </div>

Your app is now updated to support push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][21]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
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

1. Restart Eclipse, then in Package Explorer, right-click the project, click **Properties**, click **Android**, check **Google APIs**, then click **OK**.

	![][23]

  This targets the project for the Google APIs.

2. From **Window**, select **Android Virtual Device Manager**, select your device, click **Edit**.

	![][24]

3. Select **Google APIs** in **Target**, then click OK.

   ![][25]

	This targets the AVD to use Google APIs.

4. From the **Run** menu, then click **Run** to start the app.

5. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the **Add** button.

  ![][26]

6. You will see an icon appear in the upper left corner of the emulator, which we have outlined in red to emphasize it (the red does not appear on the actual screen). 

  ![][28]

7. Tap on the icon and swipe down to display the notification, which appears in the graphic below.

  ![][27]

You have successfully completed this tutorial.

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
[5]: ../Media/mobile-services-android-sdk-manager.png
[6]: ../Media/mobile-services-android-create-class.png
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

<!-- URLs. -->
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Android Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-android.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-android.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-android.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-android.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-android.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-android.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services android conceptual]: ../HowTo/mobile-services-client-android.md
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645

