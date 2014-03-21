<properties linkid="develop-mobile-tutorials-get-started-with-push-js-vs2013" urlDisplayName="Get Started with Push (JS)" pageTitle="Get started with push notifications (Android JavaScript) | Mobile Dev Center" metaKeywords="" description="Learn how to use Windows Azure Mobile Services to send push notifications to your Android JavaScript app." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/" services="" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors="ricksal"  solutions="" writer="ricksal" manager="" editor=""  />


# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a><a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push" title="Windows Store JavaScript" class="current">Windows Store JavaScript</a><a href="/en-us/documentation/articles/mobile-services-windows-phone-get-started-push" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a><a href="/en-us/documentation/articles/mobile-services-android-get-started-push" title="Android">Android</a><a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/partner-xamarin-mobile-services-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a></div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-javascript-get-started-push/" title=".NET backend">.NET backend</a> |  <a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a></div>		


This topic shows how to use Windows Azure Mobile Services to send push notifications to your Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

>[WACOM.NOTE]Mobile Services now integrates with Windows Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and scale. This integrated functionality is currently in preview. For more information, see this version of [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started-push/).

This tutorial walks you through these basic steps to enable push notifications:

1. [Enable Google Cloud Messaging](#register)
2. [Configure Mobile Services](#configure)
3. [Add push notifications to your app](#add-push)
4. [Update scripts to send push notifications](#update-scripts)
5. [Insert data to receive notifications](#test)

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete either [Get started with Mobile Services] or [Get started with data] to connect your project to the mobile service.  

##<a id="register"></a>Enable Google Cloud Messaging


[WACOM.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

Next, you will use this API key value to enable Mobile Services to authenticate with GCM and send push notifications on behalf of you app.

##<a id="configure"></a>Configure Mobile Services to send push requests

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   	![](./media/mobile-services-android-get-started-push/mobile-services-selection.png)

2. Click the **Push** tab, click **Enable enhanced push**, and click **Yes** to accept the configuration change.


	![](./media/mobile-services-android-get-started-push/mobile-enable-enhanced-push.png)

	![](../includes/media/mobile-services-javascript-backend-register-windows-store-app/mobile-enable-enhanced-push.png)


	This updates the configuration of your mobile service to use the enhanced push notification functionality provided by Notification Hubs. Some Notification Hubs usage is free with your paid mobile service. For more information, see [Mobile Services Pricing Details](http://go.microsoft.com/fwlink/p/?LinkID=311786).

    <div class="dev-callout"><b>Important</b>
	<p>This operation resets your push credentials and changes the behavior of the push methods in your scripts. These changes cannot be reverted. Do not use this method to add a notification hub to a production mobile service. For guidance on how to enable enhanced push notifications in a production mobile service, see <a href="http://go.microsoft.com/fwlink/p/?LinkId=391951">this guidance</a>.</p>
    </div>

3. Enter the **API Key** value obtained from GCM in the previous procedure, and then click **Save**.



   	![](./media/mobile-services-android-get-started-push/mobile-push-tab-android.png)

    <div class="dev-callout"><b>Important</b>
	<p>When you set your GCM credentials for enhanced push notifications in the Push tab in the portal, they are shared with Notification Hubs to configure the notification hub with your app.</p>
    </div>


Both your mobile service and your app are now configured to work with GCM and Notification Hubs.

##<a id="add-push"></a>Add push notifications to your app

###Verify Android SDK Version

[WACOM.INCLUDE [Verify SDK](../includes/mobile-services-verify-android-sdk-version.md)]

Your next step is to install Google Play services. Google Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the Manifest must conform to. 

If you will be testing with an older device, then consult [Set Up Google Play Services SDK] to determine how low you can set this value, and set it appropriately.

###Add Google Play Services to the project

[WACOM.INCLUDE [Add Play Services](../includes/mobile-services-add-Google-play-services.md)]

###Add code

1. Open the file `AndroidManifest.xml`. In the code in the next two steps, replace _`**my_app_package**`_ with the name of the app package for your project, which is the value of the `package` attribute of the `manifest` tag. 

2. Add the following new permissions after the existing `uses-permission` element:

        <permission android:name="**my_app_package**.permission.C2D_MESSAGE" 
            android:protectionLevel="signature" />
        <uses-permission android:name="**my_app_package**.permission.C2D_MESSAGE" /> 
        <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
        <uses-permission android:name="android.permission.GET_ACCOUNTS" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />

3. Add the following code after the `application` opening tag: 

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="**my_app_package**" />
            </intent-filter>
        </receiver>



4. Open the file ToDoItem.java, add the following code to the **TodoItem** class:

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

5. Download and unzip the [Mobile Services Android SDK], open the **notifications** folder, copy the **notifications-1.0.1.jar** file to the *libs* folder of your Eclipse project, and refresh the *libs* folder.

    <div class="dev-callout"><b>Note</b>
	<p>The numbers at the end of the file name may change in subsequent SDK releases.</p>
    </div>

6.  Open the file *ToDoItemActivity.java*, and add the following import statement:

		import com.microsoft.windowsazure.notifications.NotificationsManager;

7. Add the following private variable to the class, where _`<PROJECT_NUMBER>`_ is the Project Number assigned by Google to your app in the preceding procedure:

		public static final String SENDER_ID = "<PROJECT_NUMBER>";

8. In the **onCreate** method, before the MobileServiceClient is instantiated, add this code which registers the Notification Handler for the device:

		NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);

	Next we define the MyHandler.class referenced in this code.
	

9. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

10. In **Name** type `MyHandler`, in **Superclass** type `com.microsoft.windowsazure.notifications.NotificationsHandler`, then click **Finish**

	![](./media/mobile-services-android-get-started-push/mobile-services-android-create-class.png)

	This creates the new MyHandler class.

11. Add the following import statements:

		import android.content.Context;
		
		import com.microsoft.windowsazure.notifications.NotificationsHandler;
		

12. Add the following code:

		@com.google.gson.annotations.SerializedName("handle")
		private static String mHandle;
	
		public static String getHandle() {
			return mHandle;
		}
	
		public static final void setHandle(String handle) {
			mHandle = handle;
		}
	

17. Replace the existing **onRegistered** method override with the following code:

		@Override
		public void onRegistered(Context context, String gcmRegistrationId) {
			super.onRegistered(context, gcmRegistrationId);
			
			setHandle(gcmRegistrationId);
		}
		

Your app is now updated to support push notifications.


##<a id="update-scripts"></a>Update the registered insert script in the Management Portal

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   	![][21]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  	![][22]

   	This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
			// Define a payload for the Windows Store toast notification.
			var payload = '<?xml version="1.0" encoding="utf-8"?><toast><visual>' +    
			    '<binding template="ToastText01">  <text id="1">' +
			    item.text + '</text></binding></visual></toast>';

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

   	This registers a new insert script, which uses the [gcm object] to send a push notification (the text of the inserted item) to all registered devices after the insert succeeds. 

## <a name="next-steps"> </a>Next steps

This tutorial demonstrates the basic push notification functionality provided by Mobile Services. If your app requires more advanced functionalities, such as sending cross-platform notifications, subscription-based routing, or very large volumes, consider using Windows Azure Notification Hubs with your mobile service. For more information, see one of the following Notification Hubs topics:

+ [Get started with Notification Hubs]
  <br/>Learn how to leverage Notification Hubs in your Android app.

+ [Send notifications to subscribers]
	<br/>Learn how users can register and receive push notifications for categories they're interested in.

+ [Send notifications to users]
	<br/>Learn how to send push notifications from a Mobile Service to specific users on any device.

+ [Send cross-platform notifications to users]
	<br/>Learn how to use templates to send push notifications from a Mobile Service, without having to craft platform-specific payloads in your back-end.

Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

* [Mobile Services HTML/JavaScript How-to Conceptual Reference]
  <br/>Learn more about how to use Mobile Services with HTML and JavaScript.  


<!-- Anchors. -->
[Register your app for push notifications and configure Mobile Services]: #register
[Update the generated push notification code]: #update-scripts
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[13]: ./media/mobile-services-windows-store-javascript-get-started-push/mobile-quickstart-push1.png
[14]: ./media/mobile-services-windows-store-javascript-get-started-push/mobile-quickstart-push2.png


<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-js/
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-js
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-js
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-js
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-js
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-push-js

[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: /en-us/develop/mobile/how-to-guides/work-with-html-js-client/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-dotnet/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
