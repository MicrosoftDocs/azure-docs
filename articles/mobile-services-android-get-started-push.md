<properties pageTitle="Get started with push notifications (Android) | Mobile Dev Center" description="Learn how to use Azure Mobile Services to send push notifications to your Android app." services="mobile-services" documentationCenter="android" authors="RickSaling" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="Mobile-Android" ms.devlang="Java" ms.topic="article" ms.date="11/21/2014" ms.author="ricksal"/>

# Get started with push notifications in Mobile Services (legacy push)

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a>
    <a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
    <a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a>
    <a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a>
    <a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android" class="current">Android</a>
<!--    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a>
    <a href="/en-us/documentation/articles/partner-xamarin-mobile-services-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a> -->
	<a href="/en-us/documentation/articles/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push" title="Appcelerator">Appcelerator</a>
</div>

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-android-get-started-push/" title=".NET backend">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-android-get-started-push/"  title="JavaScript backend" class="current">JavaScript backend</a></div>

This topic shows you how to use Azure Mobile Services to send push notifications to an Android app. In this tutorial you add push notifications using the Google Cloud Messaging (GCM) service to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

>[AZURE.NOTE]This topic supports <em>existing</em> mobile services that have <em>not yet been upgraded</em> to use Notification Hubs integration. When you create a <em>new</em> mobile service, this integrated functionality is automatically enabled. For new mobile services, see [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/).
>
>Mobile Services integrates with Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and improved scale. <em>You should upgrade your existing mobile services to use Notification Hubs when possible</em>. Once you have upgraded, see this version of [Get started with push notifications](/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/).

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


[AZURE.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

Next, you will use this API key value to enable Mobile Services to authenticate with GCM and send push notifications on behalf of you app.

##<a id="configure"></a>Configure Mobile Services to send push requests

1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app.

   	![][18]

2. Click the **Push** tab, enter the **API Key** value obtained from GCM in the previous procedure, and then click **Save**.

   	![][19]

You mobile service is now configured to work with GCM to send push notifications.

##<a id="add-push"></a>Add push notifications to your app


###Add Google Play Services to the project

[AZURE.INCLUDE [Add Play Services](../includes/mobile-services-add-Google-play-services.md)]

###Add code

1. Open the project file **AndroidManifest.xml**. Google Cloud Messaging has some minimum API level requirements for development and testing, which the **minSdkVersion** property in the Manifest must conform to. Consult [Set Up Google Play Services SDK] to determine how low you can set this value, if you need to set it below 16 because you are using an older device. Set the property appropriately.

2. Ensure that in the `uses-sdk` element, the **targetSdkVersion** is set to the number of an SDK platform that has been installed (step 1). It is preferable to set it to the newest version available. 

3. The **uses-sdk** tag might look like this, depending on the choices you made in the preceding steps:

	    <uses-sdk
	        android:minSdkVersion="17"
	        android:targetSdkVersion="19" />
	
4. In the code in the next two steps, replace _`**my_app_package**`_ with the name of the app package for your project, which is the value of the `package` attribute of the `manifest` tag. 

5. Add the following new permissions after the existing `uses-permission` element:

        <permission android:name="**my_app_package**.permission.C2D_MESSAGE" 
            android:protectionLevel="signature" />
        <uses-permission android:name="**my_app_package**.permission.C2D_MESSAGE" /> 
        <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
        <uses-permission android:name="android.permission.GET_ACCOUNTS" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />

6. Add the following code after the `application` opening tag: 

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="**my_app_package**" />
            </intent-filter>
        </receiver>



7. Open the file ToDoItem.java, add the following code to the **TodoItem** class:

			@com.google.gson.annotations.SerializedName("handle")
			private String mHandle;
		
			public String getHandle() {
				return mHandle;
			}
		
			public final void setHandle(String handle) {
				mHandle = handle;
			}
		
	This code creates a new property that holds the registration ID.

    > [AZURE.NOTE] When dynamic schema is enabled on your mobile service, a new **handle** column is automatically added to the **TodoItem** table when a new item that contains this property is inserted.

8. Download and unzip the [Mobile Services Android SDK], open the **notifications** folder, copy the **notifications-1.0.1.jar** file to the *libs* folder of your Eclipse project, and refresh the *libs* folder.

    > [AZURE.NOTE] The numbers at the end of the file name may change in subsequent SDK releases.

9.  Open the file *ToDoItemActivity.java*, and add the following import statement:

		import com.microsoft.windowsazure.notifications.NotificationsManager;

10. Add the following private variable to the class, where _`<PROJECT_NUMBER>`_ is the Project Number assigned by Google to your app in the preceding procedure:

		public static final String SENDER_ID = "<PROJECT_NUMBER>";

11. In the **onCreate** method, before the MobileServiceClient is instantiated, add this code which registers the Notification Handler for the device:

		NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);



12. Add the following line of code to the **addItem** method, before the item is inserted into the table:

		item.setHandle(MyHandler.getHandle());

	This code sets the `handle` property of the item to the registration ID of the device.

13. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

14. In **Name** type `MyHandler`, in **Superclass** type `com.microsoft.windowsazure.notifications.NotificationsHandler`, then click **Finish**

	![][6]

	This creates the new MyHandler class.

15. Add the following import statements:

		import android.content.Context;
		
		import com.microsoft.windowsazure.notifications.NotificationsHandler;
		

16. Add the following code:

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

> [AZURE.NOTE] When you run this app in the emulator, make sure that you use an Android Virtual Device (AVD) that supports Google APIs.

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

In this simple example a user receives a push notification with the data that was just inserted. The device token used by GCM is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 


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

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Mobile Services android conceptual]: /en-us/develop/mobile/how-to-guides/work-with-android-client-library/
[gcm object]: http://go.microsoft.com/fwlink/p/?LinkId=282645

