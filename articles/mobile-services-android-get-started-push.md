<properties linkid="develop-mobile-tutorials-get-started-with-push-android" urlDisplayName="Get Started with Push (Android)" pageTitle="Get started with push notifications (Android) | Mobile Dev Center" metaKeywords="" description="Learn how to use Windows Azure Mobile Services to send push notifications to your Android app." metaCanonical="" services="" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors=""  solutions="" writer="ricksal" manager="" editor=""  />




# Get started with push notifications in Mobile Services

<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android" class="current">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android">Xamarin.Android</a>
</div>


<p>This topic shows you how to use Windows Azure Mobile Services to send push notifications to an Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.</p>


This tutorial walks you through these basic steps to enable push notifications:

* [Enable Google Cloud Messaging](#register)
* [Configure Mobile Services](#configure)
* [Add push notifications to your app](#add-push)
* [Update scripts to send push notifications](#update-scripts)
* [Insert data to receive notifications](#test)

This tutorial requires the following:

+ [Mobile Services Android SDK]
+ An active Google account

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

##<a id="register"></a>Enable Google Cloud Messaging

<div class="dev-callout"><b>Note</b>
<p>To complete the procedure in this topic, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.</p>
</div> 

<!--
1. Navigate to the [Google Cloud Console] web site, sign-in with your Google account credentials, and click **Create Project**.

	![][7]

2. Fill in a Project Name and Project ID, and choose **Create**.

	![][8]

3. Choose **Continue** and follow the SMS verification process.

	![][9]

4. Make a note of the Project Number in the Dashboard section. Later in the tutorial you set this value as the PROJECT_ID variable in the client.

5. Choose **APIs**, and scoll down the right pane until **Google Play Android Developer API** appears. Choose the **OFF** button, agree to the Terms Of Service, and choose **Accept**.

	![][10]

6. Choose **Registered apps**,


1. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> web site, sign-in with your Google account credentials, and then click **Create project...**.

   	![][1]   

	<div class="dev-callout"><b>Note</b>
	<p>When you already have an existing project, you are directed to the <strong>Dashboard</strong> page after login. To create a new project from the Dashboard, expand <strong>API Project</strong>, click <strong>Create...</strong> under <strong>Other projects</strong>, then enter a project name and click <strong>Create project</strong>.</p>
    </div>

2. Click the Overview button in the left column, and make a note of the Project Number in the Dashboard section. 

	Later in the tutorial you use this value to initialize the  `SENDER_ID` variable in the client.


3. On the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268303" target="_blank">Google apis</a> page, click **Services**, then click the toogle to turn on **Google Cloud Messaging for Android** and accept the terms of service. 

4. Click **API Access**, and then click **Create new Server key...** 

   	![][2]

5. In **Configure Server Key for API Project**, click **Create**.

	![][3]

6. Make a note of the **API key** value.

	![][4] 
-->

[WACOM.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

Next, you will use this API key value to enable Mobile Services to authenticate with GCM and send push notifications on behalf of you app.

##<a id="configure"></a>Configure Mobile Services to send push requests

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   	![][18]

2. Click the **Push** tab, enter the **API Key** value obtained from GCM in the previous procedure, and then click **Save**.

   	![][19]

You mobile service is now configured to work with GCM to send push notifications.

##<a id="add-push"></a>Add push notifications to your app



1. In Eclipse, click **Window**, then click **Android SDK Manager**. If you have not installed the highest API level available of the SDK Platform, then click to install it. Make a note of this number so you can modify the manifest file **targetSdkVersion** property to reference this number.  

2. In the Android SDK Manager, expand **Extras**, check **Google Play Services**, make a note of the **SDK Path**, click **Install Package**, select **Accept** to accept the license, then click **Install**.


	![][5]

3. In the Android SDK Manager, under the **Android n.m (API x)** node, check **Google APIs**, then click **Install**. 



4. Install the Google Play Services SDK in your project. In Eclipse, click **File**, then **Import**. Select **Android**, then **Existing Android Code into Workspace**, and click **Next**. Click **Browse**, navigate to the Android SDK path (usually in a folder named `adt-bundle-windows-x86_64`), then go to the `\extras\google\google_play_services\libproject` subfolder, and there select the google-play-services-lib folder, and click **OK**. Check the **Copy projects into workspace** checkbox, and then click **Finish**.

	![][29]

5. Next you must reference the Google Play Services SDK library that you just imported, from your project. Follow the instructions at [Referencing a library project].

5. Open the project file **AndroidManifest.xml**. Google Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the Manifest must conform to. Consult [Set Up Google Play Services SDK] to determine how low you can set this value, if you need to set it below 16 because you are using an older device. Set the property appropriately.

6. Ensure that in the `uses-sdk` element, the **targetSdkVersion** is set to the number of an SDK platform that has been installed (step 1). It is preferable to set it to the newest version available. 

7. The **uses-sdk** tag might look like this, depending on the choices you made in the preceding steps:

	    <uses-sdk
	        android:minSdkVersion="17"
	        android:targetSdkVersion="19" />
	
8. In the code in the next two steps, replace _`**my_app_package**`_ with the name of the app package for your project, which is the value of the `package` attribute of the `manifest` tag. 

9. Add the following new permissions after the existing `uses-permission` element:

        <permission android:name="**my_app_package**.permission.C2D_MESSAGE" 
            android:protectionLevel="signature" />
        <uses-permission android:name="**my_app_package**.permission.C2D_MESSAGE" /> 
        <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
        <uses-permission android:name="android.permission.GET_ACCOUNTS" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />

10. Add the following code into the `application` element: 

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="**my_app_package**" />
            </intent-filter>
        </receiver>



11. Open the file ToDoItem.java, add the following code to the **TodoItem** class:

			@com.google.gson.annotations.SerializedName("handle")
			private String mHandle;
		
			public String getHandle() {
				return mHandle;
			}
		
			public final void setHandle(String handle) {
				mHandle = handle;
			}
		
	This code creates a new property that holds the registration ID.

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new <strong>handle</strong> column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

12. Download and unzip the [Mobile Services Android SDK], open the **notifications** folder, copy the **notifications-n.jar** and **notification-hubs-n.jar** files to the *libs* folder of your Eclipse project, and refresh the *libs* folder.

13.  Open the file ToDoItemActivity.java, and add the following import statement:

		import com.microsoft.windowsazure.notifications.NotificationsManager;

14. Add the following private variable to the class, where _`<PROJECT_NUMBER>`_ is the Project Number assigned by Google to your app in the first procedure:

		public static final String SENDER_ID = "<PROJECT_NUMBER>";

15. In the **onCreate** method, add this code before the MobileServiceClient is instantiated:

		NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);

	This code registers the Notification Handler for the device.

16. Add the following line of code to the **addItem** method, before the item is inserted into the table:

		item.setHandle(MyHandler.getHandle());

	This code sets the `handle` property of the item to the registration ID of the device.

17. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

18. In **Name** type `MyHandler`, in **Superclass** type `com.microsoft.windowsazure.notifications.NotificationsHandler`, then click **Finish**

	![][6]

	This creates the new MyHandler class.

19. Add the following import statements:

		import android.content.Context;
		import android.os.Bundle;
		
		import com.microsoft.windowsazure.messaging.*;
		

20. Add the following code:

		@com.google.gson.annotations.SerializedName("handle")
		private static String mHandle;
	
		public static String getHandle() {
			return mHandle;
		}
	
		public static final void setHandle(String handle) {
			mHandle = handle;
		}
	

18. Replace the existing **onRegistered** method override with the following code:

		@Override
		public void onRegistered(Context context, String gcmRegistrationId) {
			super.onRegistered(context, gcmRegistrationId);
			
			this.setHandle(gcmRegistrationId);
		}
		

Your app is now updated to support push notifications.


<!--4. Browse to the Android SDK path (usually in a folder named `adt-bundle-windows-x86_64`), and copy the `google-play-services.jar` file from the `\extras\google\google_play_services\libproject\google-play-services_lib\libs` subfolder into the `\libs` project subfolder, then in Package Explorer, right-click the **libs** folder and click **Refresh**.  

	The `google-play-services.jar` library file is now shown in your project.
-->

##<a id="update-scripts"></a>Update the registered insert script in the Management Portal

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
					push.gcm.send(item.handle, item.text, {
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

##<a id="test"></a>Test push notifications in your app

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

6. You will see a black notification box appear briefly in the lower part of the screen. 

  	![][28]

<!--7. Tap on the icon and swipe down to display the notification, which appears in the graphic below.

  ![][27]-->

You have successfully completed this tutorial.

## <a name="next-steps"></a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 


<!-- Images. -->

[1]: ./media/mobile-services-android-get-started-push/mobile-services-google-developers.png
[2]: ./media/mobile-services-android-get-started-push/mobile-services-google-create-server.png
[3]: ./media/mobile-services-android-get-started-push/mobile-services-google-create-server2.png
[4]: ./media/mobile-services-android-get-started-push/mobile-services-google-create-server3.png
[5]: ./media/mobile-services-android-get-started-push/mobile-services-android-sdk-manager.png
[6]: ./media/mobile-services-android-get-started-push/mobile-services-android-create-class.png
[7]: ./media/mobile-services-android-get-started-push/mobile-google-cloud-new-project.png
[8]: ./media/mobile-services-android-get-started-push/mobile-google-cloud-sms-verify.png
[9]: ./media/mobile-services-android-get-started-push/mobile-google-cloud-project-created.png
[10]: ./media/mobile-services-android-get-started-push/mobile-google-choose-play-api.png
[18]: ./media/mobile-services-android-get-started-push/mobile-services-selection.png
[19]: ./media/mobile-services-android-get-started-push/mobile-push-tab-android.png
[21]: ./media/mobile-services-android-get-started-push/mobile-portal-data-tables.png
[22]: ./media/mobile-services-android-get-started-push/mobile-insert-script-push2.png
[23]: ./media/mobile-services-android-get-started-push/mobile-services-import-android-properties.png
[24]: ./media/mobile-services-android-get-started-push/mobile-services-android-virtual-device-manager.png
[25]: ./media/mobile-services-android-get-started-push/mobile-services-android-virtual-device-manager-edit.png
[26]: ./media/mobile-services-android-get-started-push/mobile-quickstart-push1-android.png
[27]: ./media/mobile-services-android-get-started-push/mobile-quickstart-push2-android.png
[28]: ./media/mobile-services-android-get-started-push/mobile-push-icon.png
[29]: ./media/mobile-services-android-get-started-push/mobile-eclipse-import-Play-library.png

<!-- URLs. -->
[Google Cloud Console]: https://cloud.google.com/console
[Google apis]: http://go.microsoft.com/fwlink/p/?LinkId=268303
[Android Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Set Up Google Play Services SDK]: http://go.microsoft.com/fwlink/?LinkId=389801
[Referencing a library project]: http://go.microsoft.com/fwlink/?LinkId=389800
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-android
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-android
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-android
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-android

[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services android conceptual]: /en-us/develop/mobile/how-to-guides/work-with-android-client-library/
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645

