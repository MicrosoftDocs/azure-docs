<properties pageTitle="Get Started with Azure Notification Hubs" description="Learn how to use Azure Notification Hubs to push notifications." services="notification-hubs" documentationCenter="android" authors="RickSaling" manager="dwrede" editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="11/21/2014" 
	ms.author="ricksal"/>
# Get started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/" title="Windows Universal">Windows Universal</a><a href="/en-us/documentation/articles/notification-hubs-windows-phone-get-started/" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/notification-hubs-ios-get-started/" title="iOS">iOS</a><a href="/en-us/documentation/articles/notification-hubs-android-get-started/" title="Android" class="current">Android</a><a href="/en-us/documentation/articles/notification-hubs-kindle-get-started/" title="Kindle">Kindle</a><a href="/en-us/documentation/articles/notification-hubs-baidu-get-started/" title="Baidu">Baidu</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-ios-get-started/" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-android-get-started/" title="Xamarin.Android">Xamarin.Android</a><a href="/en-us/documentation/articles/notification-hubs-chrome-get-started/" title="Chrome">Chrome</a></div>

This topic shows you how to use Azure Notification Hubs to send push notifications to an Android application. 
In this tutorial, you create a blank Android app that receives push notifications using Google Cloud Messaging (GCM). When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

The tutorial walks you through these basic steps to enable push notifications:

* [Enable Google Cloud Messaging](#register)
* [Configure your Notification Hub](#configure-hub)
* [Connecting your app to the Notification Hub](#connecting-app)
* [How to send a notifications to your app](#send)
* [Testing your app](#run-app)

This tutorial demonstrates the simple broadcast scenario using Notification Hubs. Be sure to follow along with the next tutorial to see how to use notification hubs to address specific users and groups of devices. 

This tutorial requires the following:

+ the Android SDK (it is assumed you will be using Eclipse), which you can download from <a href="http://go.microsoft.com/fwlink/?LinkId=389797">here</a>
+ the [Mobile Services Android SDK]

Completing this tutorial is a prerequisite for all other notification hub tutorials for Android apps. 

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F%20target="_blank").

##<a id="register"></a>Enable Google Cloud Messaging

[AZURE.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]

Next, you will use this API key value to enable your notification hub to authenticate with GCM and send push notifications on behalf of your application.

##<a id="configure-hub"></a>Configure your Notification Hub

1. Log on to the [Azure Management Portal], and then click **+NEW** at the bottom of the screen.

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

7. Select the **Dashboard** tab at the top, then click **View Connection String**. Take note of the two connection strings.


Your notification hub is now configured to work with GCM, and you have the connection strings to register your app and send push notifications.

##<a id="connecting-app"></a>Connecting your app to the Notification Hub

###Create new Android project

1. In Eclipse ADT, create a new Android project (File, New, Android Application).

   	![][13]

2. Ensure that the **Minimum Required SDK** is set to *API 8: Android 2.2 (Froyo)*, and that the next two SDK entries are set to the latest available version. Choose Next, and follow the wizard, making sure **Create activity** is selected to create a blank activity. Accept the default Launcher Icon on the next box, and click **Finish** in the last box.

   	![][14]

###Add Google Play Services to the project

[AZURE.INCLUDE [Add Play Services](../includes/mobile-services-add-Google-play-services.md)]

###Add code

1. Download the Notification Hubs Android SDK from <a href="https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409">here</a>. Extract the .zip file and copy the file notificationhubs\notification-hubs-0.1.jar to the \libs directory of your project in the Package Explorer.

2. Download and unzip the [Mobile Services Android SDK], open the **notifications** folder, copy the **notifications-1.0.1.jar** file to the *libs* folder of your Eclipse project, and refresh the *libs* folder.

    > [AZURE.NOTE] The numbers at the end of the file name may change in subsequent SDK releases.

	Now, set up the application to obtain a *registrationId* from GCM, and use it to register the app instance to the notification hub.

3. In the AndroidManifest.xml file, add the following line just below the <uses-sdk/> element. Make sure to replace `<your package>` with the package you selected for your app in step 1 (`com.yourCompany.wams_notificationhubs` in this example).

        <uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.GET_ACCOUNTS"/>
		<uses-permission android:name="android.permission.WAKE_LOCK"/>
		<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />

		<permission android:name="<your package>.permission.C2D_MESSAGE" android:protectionLevel="signature" />
		<uses-permission android:name="<your package>.permission.C2D_MESSAGE"/>

4. In the **MainActivity** class, add the following statements.

		import android.os.AsyncTask;	
		import com.google.android.gms.gcm.*;
		import com.microsoft.windowsazure.messaging.*;
		import com.microsoft.windowsazure.notifications.NotificationsManager;


5. Add the following private members at the top of the class.

	> [AZURE.NOTE] Make sure to set the SENDER_ID to the Project Number you obtained earlier.

		private String SENDER_ID = "<your project number>";
		private GoogleCloudMessaging gcm;
		private NotificationHub hub;

6. In the **OnCreate** method add the following code, and make sure to replace the placeholders with your connection string with listen access obtained in the previous section, and the name of your notification hub that appears at the top of the page in Azure for your hub (**not** the full url).

		NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);

		gcm = GoogleCloudMessaging.getInstance(this);
        
		String connectionString = "<your listen access connection string>";
		hub = new NotificationHub("<your notification hub name>", connectionString, this);
		
		registerWithNotificationHubs();

7. In MainActivity.java, create the following method:

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

8. Because Android does not display notifications, you must write your own receiver. In **AndroidManifest.xml**, add the following element inside the `<application/>` element.

	> [AZURE.NOTE] eplace the placeholder with your package name.

        <receiver android:name="com.microsoft.windowsazure.notifications.NotificationsBroadcastReceiver"
            android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <category android:name="**my_app_package**" />
            </intent-filter>
        </receiver>


9. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class**.

10. In **Name** type `MyHandler`, in **Superclass** type `com.microsoft.windowsazure.notifications.NotificationsHandler`, then click **Finish**

	![][6]

	This creates the new MyHandler class.

11. Add the following import statements:

		import android.app.NotificationManager;
		import android.app.PendingIntent;
		import android.content.Context;
		import android.content.Intent;
		import android.os.Bundle;
		import android.support.v4.app.NotificationCompat;
		

12. Add the following code to the class:

		public static final int NOTIFICATION_ID = 1;
		private NotificationManager mNotificationManager;
		NotificationCompat.Builder builder;
		Context ctx;
	
		
		@Override
		public void onReceive(Context context, Bundle bundle) {
		    ctx = context;
		    String nhMessage = bundle.getString("msg");
	
		    sendNotification(nhMessage);
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
	

##<a name="send"></a>How to send a notification to your app

You can send notifications using Notification Hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial you send notifications with a .NET console application. For an example of how to send notifications from an Azure Mobile Services backend integrated with Notification Hubs, see **Get started with push notifications in Mobile Services** ([.NET backend](/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/) | [JavaScript backend](/en-us/documentation/articles/mobile-services-javascript-backend-android-get-started-push/)).  For an example of how to send notifications using the REST APIs, see **How to use Notification Hubs from Java/PHP** ([Java](/en-us/documentation/articles/notification-hubs-java-backend-how-to/) | [PHP](/en-us/documentation/articles/notification-hubs-php-backend-how-to/)).

1. In Visual Studio, from the **File** menu select **New** and then **Project...**, then under **Visual C#** click **Windows** and **Console Application** and click **OK**.  

   	![][20]

	This creates a new console application project.

2. From the **Tools** menu, click **Library Package Manager** and then **Package Manager Console**. 

	This displays the Package Manager Console.

3. In the console window, execute the following command:

        Install-Package WindowsAzure.ServiceBus
    
	This adds a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. 

4. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

5. In the **Program** class, add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
            await hub.SendGcmNativeNotificationAsync("{ \"data\" : {\"msg\":\"Hello from Azure!\"}}");
        }

   	Make sure to replace the "hub name" placeholder with the name of the notification hub that appears in the portal on the **Notification Hubs** tab. Also, replace the connection string placeholder with the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub." 

	>[AZURE.NOTE]Make sure that you use the connection string with **Full** access, not **Listen** access. The listen access string does not have permissions to send notifications.

5. Then add the following lines in the **Main** method:

         SendNotificationAsync();
		 Console.ReadLine();

##<a name="run-app"></a>Testing your app

Before testing the app on an emulator, you need to complete these emulator configuration steps (skip if testing on a physical device):

1. Make sure that you use an Android Virtual Device (AVD) that supports Google APIs.

2. From **Window**, click **Android Virtual Device Manager**, select your device, and then click **Edit**.

   	![][18]

3. Select **Google APIs** in **Target**, then click **OK**.

   	![][19]

4. 	In order to receive push notifications, you must set up a Google account on your Android Virtual Device (in the emulator, navigate to <strong>Settings</strong> and click <strong>Add Account</strong>). Also, make sure that the emulator is connected to the Internet.


Use the following steps to run the app on a device or on the emulator:

1. On the Eclipse top toolbar, click **Run**, and then select your app. 
 
	This starts the emulator (if using an emulator) and loads and runs the app. The app retrieves the *registrationId* from GCM and registers with the notification hub.

3. Press the F5 key in Visual Studio run the console app. 

	A notification is sent to your app.  
 
5. When an icon appears in the notification area (upper left corner), pull down the notification drawer to see the notification.  

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
[7]: ./media/notification-hubs-android-get-started/notification-hub-create-from-portal.png
[8]: ./media/notification-hubs-android-get-started/notification-hub-create-from-portal2.png
[9]: ./media/notification-hubs-android-get-started/notification-hub-select-from-portal.png
[10]: ./media/notification-hubs-android-get-started/notification-hub-select-from-portal2.png
[11]: ./media/notification-hubs-android-get-started/notification-hub-configure-android.png
[12]: ./media/notification-hubs-android-get-started/notification-hub-connection-strings.png

[13]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app.png
[14]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app2.png
[15]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app4.png
[16]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app5.png
[17]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app6.png

[18]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app7.png
[19]: ./media/notification-hubs-android-get-started/notification-hub-create-android-app8.png

[20]: ./media/notification-hubs-android-get-started/notification-hub-create-console-app.png
[21]: ./media/notification-hubs-android-get-started/notification-hub-android-toast.png
[22]: ./media/notification-hubs-android-get-started/notification-hub-scheduler1.png
[23]: ./media/notification-hubs-android-get-started/notification-hub-scheduler2.png
[29]: ./media/mobile-services-android-get-started-push/mobile-eclipse-import-Play-library.png

<!-- URLs. -->
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-android
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-android
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-android
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-android
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-android
[JavaScript and HTML]: /en-us/develop/mobile/tutorials/get-started-with-push-js
[Referencing a library project]: http://go.microsoft.com/fwlink/?LinkId=389800
[Azure Management Portal]: https://manage.windowsazure.com/
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx

[Use Notification Hubs to push notifications to users]: /en-us/manage/services/notification-hubs/notify-users-aspnet
[Use Notification Hubs to send breaking news]: /en-us/manage/services/notification-hubs/breaking-news-dotnet

