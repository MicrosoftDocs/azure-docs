<properties linkid="develop-mobile-tutorials-get-started-with-push-js-vs2013" urlDisplayName="Get Started with Push (JS)" pageTitle="Get started with push notifications (Android JavaScript) | Mobile Dev Center" metaKeywords="" description="Learn how to use Windows Azure Mobile Services to send push notifications to your Android JavaScript app." metaCanonical="http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/" services="" documentationCenter="Mobile" title="Get started with push notifications in Mobile Services" authors="ricksal"  solutions="" writer="ricksal" manager="" editor=""  />


# <a name="getting-started-with-push"> </a>Get started with push notifications in Mobile Services


<div class="dev-center-tutorial-selector sublanding">
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a>
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-phone-get-started-push" title="Windows Phone">Windows Phone</a>
	<a href="/en-us/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a>
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push" title="Android" class="current">Android</a>
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS">Xamarin.iOS</a>
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android">Xamarin.Android</a>
</div>


<div class="dev-center-tutorial-subselector">
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push/" title=".NET backend" >.NET backend</a> | 
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/" title="JavaScript backend" class="current">JavaScript backend</a>
</div>


This topic shows how to use Azure Mobile Services to send push notifications to your Android app. In this tutorial you add push notifications using Google Cloud Messaging (GCM) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

[WACOM.NOTE]This tutorial demonstrates Mobile Services integration with Notification Hubs, which is currently in preview. By default, sending push notifications using Notification Hubs is not enabled from a JavaScript backend.  Once the new notification hub has been created, the integration process cannot be reverted. 

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

[WACOM.INCLUDE [mobile-services-android-getting-started-with-push](../includes/mobile-services-android-getting-started-with-push.md)]


##<a id="update-scripts"></a>Update the registered insert script in the Management Portal

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   	![](./media/mobile-services-android-get-started-push/mobile-portal-data-tables.png)

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  	![](./media/mobile-services-android-get-started-push/mobile-insert-script-push2.png)

   	This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
		// Define a payload for the Google Cloud Messaging toast notification.
		var payload = 
		    '{"data":{"message" : "Hello from Mobile Services!"}}';
		
		request.execute({
		    success: function() {
		        // If the insert succeeds, send a notification.
		        push.gcm.send(null, payload, {
		            success: function(pushResponse) {
		                console.log("Sent push:", pushResponse, payload);
		                request.respond();
		                },              
		            error: function (pushResponse) {
		                console.log("Error Sending push:", pushResponse);
		                request.respond(500, { error: pushResponse });
		                }
		            });
		        },
		    error: function(err) {
		        console.log("request.execute error", err)
		        request.respond();
		    }
		  });
		}

   	This registers a new insert script, which uses the [gcm object] to send a push notification to all registered devices after the insert succeeds. 

##<a id="test"></a>Test push notifications in your app

You can test the app by directly attaching an Android phone with a USB cable, or by using a virtual device in the emulator.

###Setting up the emulator for testing

When you run this app in the emulator, make sure that you use an Android Virtual Device (AVD) that supports Google APIs.

1. Restart Eclipse, then in Package Explorer, right-click the project, click **Properties**, click **Android**, check **Google APIs**, then click **OK**.

	![](./media/mobile-services-android-get-started-push/mobile-services-import-android-properties.png)

  	This targets the project for the Google APIs.

2. From **Window**, select **Android Virtual Device Manager**, select your device, click **Edit**.

	![](./media/mobile-services-android-get-started-push/mobile-services-android-virtual-device-manager.png)

3. Select **Google APIs** in **Target**, then click OK.

   	![](./media/mobile-services-android-get-started-push/mobile-services-android-virtual-device-manager-edit.png)

	This targets the AVD to use Google APIs.

###Running the test

1. From the **Run** menu in Eclipse, then click **Run** to start the app.

2. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the **Add** button.

  	![](./media/mobile-services-android-get-started-push/mobile-quickstart-push1-android.png)

3. Swipe down from the top of the screen to open the device's Notification Center to see the notification.


You have successfully completed this tutorial.


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

* [How to use the Android client library for Mobile Services]
  <br/>Learn more about how to use Mobile Services with Android.  


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
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-android-get-started/
[Get started with data]: /en-us/documentation/articles/mobile-services-android-get-started-data/
[Get started with authentication]: /en-us/documentation/articles/mobile-services-android-get-started-users
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-js
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-js
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-js
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-push-js
[Set Up Google Play Services SDK]: http://go.microsoft.com/fwlink/?LinkId=389801
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[How to use the Android client library for Mobile Services]: /en-us/documentation/articles/mobile-services-android-how-to-use-client-library
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[What are Notification Hubs?]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[Send notifications to subscribers]: /en-us/manage/services/notification-hubs/breaking-news-dotnet/
[Send notifications to users]: /en-us/manage/services/notification-hubs/notify-users/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645
