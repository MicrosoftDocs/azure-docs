<properties linkid="develop-notificationhubs-tutorials-get-started-nokia-x" urlDisplayName="Get Started" pageTitle="Get Started with Azure Notification Hubs" metaKeywords="" description="Learn how to use Azure Notification Hubs to push notifications." metaCanonical="" services="notification-hubs" documentationCenter="Mobile" title="Get started with Notification Hubs" authors="piyushjo" solutions="" manager="kirillg" editor="" />
# Get started with Notification Hubs

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/notification-hubs-windows-store-dotnet-get-started/" title="Windows Store C#">Windows Store C#</a><a href="/en-us/documentation/articles/notification-hubs-windows-phone-get-started/" title="Windows Phone">Windows Phone</a><a href="/en-us/documentation/articles/notification-hubs-ios-get-started/" title="iOS">iOS</a><a href="/en-us/documentation/articles/notification-hubs-android-get-started/" title="Android" class="current">Android</a><a href="/en-us/documentation/articles/notification-hubs-kindle-get-started/" title="Kindle">Kindle</a><a href="/en-us/documentation/articles/notification-hubs-nokia-x-get-started/" title="Nokia X">Nokia X</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-ios-get-started/" title="Xamarin.iOS">Xamarin.iOS</a><a href="/en-us/documentation/articles/partner-xamarin-notification-hubs-android-get-started/" title="Xamarin.Android">Xamarin.Android</a></div>

This topic shows you how to use **Azure Notification Hubs** to send push notifications to an Android application on **Nokia X**. In this tutorial, you will create a blank Android app that receives push notifications using Nokia Notification Service. When complete, you will be able to broadcast push notifications to all the devices running your app using your notification hub.

The tutorial walks you through these basic steps to enable push notifications:

* [Configure Nokia Notification service](#register)
* [Configure your Notification Hub](#configure-hub)
* [Connecting your app to the Notification Hub](#connect-hub)
* [How to send a notification to your app](#send)
* [Testing your app](#test-app)

This tutorial requires the following:

1.	Nokia X development environment which you can configure by following the instructions <a href="http://developer.nokia.com/resources/library/nokia-x/getting-started/environment-setup.html">here</a>. Make sure to install the Nokia X specific packages and set up the Nokia X emulator by following the instructions. 
2.	Nokia X device setup (optional) which you can configure by following the instructions <a href="http://developer.nokia.com/resources/library/nokia-x/getting-started/device-setup.html">here</a>.
3.	Android SDK (it is assumed you will be using Eclipse) which you can download from <a href="http://go.microsoft.com/fwlink/?linkid=389797&clcid=0x409">here</a>.
4.	Mobile Services Android SDK which you can download from <a href="https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409">here<a>. 

<div class="dev-callout"><strong>Note</strong> <p>To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.</p></div>

##<a id="register"></a>Configure Nokia Notification service

1. Sign in to <a href="https://console.push.nokia.com/ncm/Web/index.jsp">Nokia Notifications API Developer Console</a> 

2. Go to the **Create services** tab and create a new service by providing a **Sender ID** and **Service description**

	![][11]

3. Make a note of the **Sender ID** and the **Authorization Key** once the service has been created successfully. 

4. You can go to the **My services** tab to list all your created services with the respective **Sender ID** and **Authorization Key**

	![][12]

5. For details refer to this <a href="http://developer.nokia.com/resources/library/nokia-x/nokia-notifications/nokia-notifications-developer-guide.html">link</a>. 

##<a id="configure-hub"></a>Configure your Notification Hub

1. Log on to the [Azure Management Portal], and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.

	![][3]

3. Type a name for your notification hub, select your desired region and optionally namespace, and then click **Create a new Notification Hub**.

	![][2]

4. Go to the Notification hub you just created. Click on the Service Bus tab on the left and click the namespace where you created the Notification Hub and then click the Notification Hubs tab. 

	![][9]

5. Once on the Notification hub that you created - click on the **Configure** tab at the top.

	![][7]

6. Scroll down and find the **nokia x notification settings** and paste the Authorization Key you got from the Nokia Notification service and click **Save** button at the bottom of the page

	![][8]

7. Select the **Dashboard** tab at the top and click the **Connection Information** at the bottom of the page. 

	![][10]

8.	Make a note of the two SAS connection strings for **DefaultListenSharedAccessSignature** & **DefaultFullSharedAccessSignature** which you will use later in the tutorial. 

##<a id="connect-hub"></a>Connecting your app to the Notification Hub

###Create new Android project

1. In Eclipse ADT, create a new Android project (File -> New -> Android Application).

2. Ensure that the Minimum Required SDK is set to **API 16: Android 4.1 (Jelly Bean)**, and that the next two SDK entries are set to the latest available version. Choose Next, and follow the wizard, making sure **Create activity** is selected to create a **blank activity**. Accept the default Launcher Icon on the next box, and click **Finish** in the last box.

	![][5]

3. Ensure that the project build target is correctly set (Platform = 4.1.2 and API Level = 16 for this sample). Right click on Project, select Properties and select Android in the Project Properties dialogue. 
	
	![][13]

4.	Add the Nokia Notification Service's JAR file to your project. This Nokia Notifications helper library **push.jar** provides an API similar to the GCM helper library. 
Navigate to Project Properties -> Java Build Path -> Libraries -> Add External JARs and add the **push.jar** available in **<android-sdk-path>\extras\nokia\nokia_x_services\libs\nna\push.jar**. The Javadoc for the library is located in <android-sdk-path>\extras\nokia\nokia_x_services\javadocs\nna.

5. Make sure to also copy this push.jar library to the \libs directory of your project in the Package explorer. 

6. Download the Notification Hubs Android SDK from <a href="https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409">here</a>. Extract the .zip file and copy the file notificationhubs\notification-hubs-0.1.jar to the \libs directory of your project in the Package Explorer.

    <div class="dev-callout"><b>Note</b>
	<p>The numbers at the end of the file name may change in subsequent SDK releases.</p>
    </div>

###Add code

1. Open up the **AndroidManifest.xml** file and replace the application element with the following lines of code while making sure that you are replacing the `[YourPackageName]` with the name of your package which you specified while creating the Android application.
		
		<!-- Push Notifications connects to Internet services. -->
	    <uses-permission android:name="android.permission.INTERNET" />
	
	    <!-- Keeps the processor from sleeping when a message is received. -->
	    <uses-permission android:name="android.permission.WAKE_LOCK" />
	
		 <!--
	     Creates a custom permission so only this app can receive its messages.
	
	     NOTE: the permission *must* be called PACKAGE.permission.C2D_MESSAGE,
	           where PACKAGE is the application's package name.
	    -->
	    <permission 
	        android:name="[YourPackageName].permission.C2D_MESSAGE" 
	        android:protectionLevel="signature" />
	    <uses-permission android:name="[YourPackageName].permission.C2D_MESSAGE" />
	
	    <uses-permission android:name="com.nokia.pushnotifications.permission.RECEIVE" />
	    
	    <application
	        android:allowBackup="true"
	        android:icon="@drawable/ic_launcher"
	        android:label="@string/app_name"
	        android:theme="@style/AppTheme" >
	        <activity
	            android:name="[YourPackageName].MainActivity"
	            android:label="@string/app_name" >
	            <intent-filter>
	                <action android:name="android.intent.action.MAIN" />
	
	                <category android:name="android.intent.category.LAUNCHER" />
	            </intent-filter>
	        </activity>
	        
	        <receiver
	            android:name="com.nokia.push.PushBroadcastReceiver"
	            android:permission="com.nokia.pushnotifications.permission.SEND" >
	            <intent-filter>
	                
					<!-- Receives the actual messages. -->
	                <action android:name="com.nokia.pushnotifications.intent.RECEIVE" />
	                <!-- Receives the registration id. -->
	                <action android:name="com.nokia.pushnotifications.intent.REGISTRATION" />
	                
	                <category android:name="[YourPackageName]" />
	            </intent-filter>
	        </receiver>
	
	        <service android:name="[YourPackageName].PushIntentService" />
	    </application> 

2. In the Package Explorer, right-click the package (under the `src` node), click **New**, click **Class** and create a new class called **ConfigurationSettings.java** 
![][6]

	Then add the following code to it which defines the constants used on the sample:

		public class ConfigurationSettings {
	    	public static String NotificationHubName = "";
	    	public static String NotificationHubConnectionString = "";
	    	public static String SenderId = "";
		}
	
	Fill up the above constants with your configuration – **SenderId** from Nokia push console and **NotificationHubName** and **NotificationHubConnectionString** (DefaultListenSharedAccessSignature) from the management portal. 

3. In the **MainActivity.java**, add the following import statement:
	
		import com.nokia.push.PushRegistrar;

	and then add the following code in the onCreate method:
 
		// Make sure the device has the proper dependencies.
		PushRegistrar.checkDevice(this);
	        
		// Make sure the manifest was properly set - comment out this line
		// while developing the app, then uncomment it when it's ready
		PushRegistrar.checkManifest(this);
	        
		// Register the device with the Nokia Notification service
		PushRegistrar.register(this, ConfigurationSettings.SenderId);

4. Add another new class named **PushIntentService.java** and add the following code which will register with your Notification Hub and will also handle the received messages from this Notification Hub. 

		import android.app.NotificationManager;
		import android.app.PendingIntent;
		import android.content.Context;
		import android.content.Intent;
		import android.os.Bundle;
		import android.support.v4.app.NotificationCompat;
		import android.util.Log;
		
		import com.microsoft.windowsazure.messaging.NotificationHub;
		import com.nokia.push.PushBaseIntentService;
		
		/**
		 * IntentService responsible for handling push notification messages.
		 */
		public class PushIntentService extends PushBaseIntentService {
			
			private NotificationManager mNotificationManager;
			private static NotificationHub hub;
		    public static final int NOTIFICATION_ID = 1;
		    private static final String TAG = "NokiaXPush/PushIntentService";
		
		    /**
		     * Constructor.
		     */
		    public PushIntentService() {
		    }
		    
		    @Override
		    protected void onRegistered(Context context, String registrationId) {
		    	Log.i(TAG, "Nokia Registration ID \"" + registrationId + "\"");
		    	RegisterWithNotificationHub(context, registrationId);
		    }
		
		    public static void RegisterWithNotificationHub(Context context, String registrationId) {
		        if (hub == null) {
		            hub = new NotificationHub(
		            		ConfigurationSettings.NotificationHubName, 
		            		ConfigurationSettings.NotificationHubConnectionString, 
		            		context);
		        }
		        try {
					hub.register(registrationId);
			    	Log.i(TAG, "Registered with Notification Hub - '" 
			    			+ ConfigurationSettings.NotificationHubName + "'" 
			    			+ " with RegistrationID - '"
			    			+ registrationId + "'");
				} catch (Exception e) {
					e.printStackTrace();
				}
		    }
		
		    @Override
		    protected void onMessage(Context context, Intent intent) {
		    	String message = intentExtrasToString(intent.getExtras());
		    	Log.i(TAG, "Received message. Extras: " + message);
		    	generateNotification(context, message);
		    }
		    
		    /**
		     * Extracts the key-value pairs from the given Intent extras and returns
		     * them in a string.
		     */
		    private String intentExtrasToString(Bundle extras) {
		        StringBuilder sb = new StringBuilder();
		        sb.append("{ ");
		        
		        for (String key : extras.keySet()) {
		            sb.append(sb.length() <= 2 ? "" : ", ");
		            sb.append(key).append("=").append(extras.get(key));
		        }
		        
		        sb.append(" }");
		        return sb.toString();
		    }
		
		    /**
		     * Issues a notification to inform the user that server has sent a message.
		     */
		    private void generateNotification(Context context, String message)
		    {
		    	mNotificationManager = (NotificationManager)
		                context.getSystemService(Context.NOTIFICATION_SERVICE);
		
		        PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
		            new Intent(context, MainActivity.class), 0);
		
		        NotificationCompat.Builder mBuilder =
		            new NotificationCompat.Builder(context)
		            .setSmallIcon(R.drawable.ic_launcher)
		            .setContentTitle("Notification Hub Demo")
		            .setStyle(new NotificationCompat.BigTextStyle()
		                     .bigText(message))
		            .setContentText(message);
		
		        mBuilder.setContentIntent(contentIntent);
		        mNotificationManager.notify(NOTIFICATION_ID, mBuilder.build());
		    }
		
			@Override
			protected void onError(Context arg0, String errorId) {
		        Log.i(TAG, "Received error:  " + errorId);
			}
		
			@Override
			protected void onUnregistered(Context arg0, String errorId) {
		        Log.i(TAG, "Received recoverable error: " + errorId);
			}
		}

##<a name="send"></a>How to send a notification to your app

You can send notifications using Notification Hubs from any back-end that uses our <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial we show it using a .NET console app. 

1. Create a new Visual C# console application:

	![][4]

2. Add a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then **Library Package Manager**, then **Package Manager Console**. Then, in the console window type the following and press Enter:

        Install-Package WindowsAzure.ServiceBus

3. Open the file Program.cs and add the following using statement:

        using Microsoft.ServiceBus.Notifications;

4. In your `Program` class add the following method:

		private static async void SendNotificationAsync()
		{
			NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<DefaultFullSharedAccessSignatureSASConnectionString>", "<hub name>");
			hub.SendNokiaXNativeNotificationAsync("{\"data\" : {\"payload\":\"" + "Hello from Azure" + "\"}}");
		}

5. Then add the following lines in your Main method:

         SendNotificationAsync();
		 Console.ReadLine();

##<a name="test-app"></a>Testing your app

To test this app with an actual phone, just connect it to your computer with a USB cable.

To test this app with the emulator:

1. On the Eclipse top toolbar, click Run and then select your app. To test this app with the emulator:

2. This loads your app, either onto the attached phone, or else it starts the emulator, and loads and runs the app.

3. The app retrieves the registrationId from Nokia Notification Service and registers with the Notification Hub.

    <div class="dev-callout"><b>Note</b>
	<p>
	If the Android app is able to register successfully with the Notification Hub, you will see a message like the following in your **Eclipse – Logcat** logs:
	**Registered with Notification Hub - '<yourNotificationHubName>' with RegistrationID - '<RegistrationIdReturnedByNokiaNotificationService'**
	</p>
    </div>
	
4.	To send a test notification when using the .Net console application, just press the F5 key in Visual Studio to run the application, and it will send a notification that will appear in the top notification area of your device or emulator. 

<!-- Images. -->
[1]: ./media/notification-hubs-nokia-x-get-started/AndroidAppProperties.png
[2]: ./media/notification-hubs-nokia-x-get-started/AzureManagementCreateNH.png
[3]: ./media/notification-hubs-nokia-x-get-started/AzureManagementPortal.png
[4]: ./media/notification-hubs-nokia-x-get-started/ConsoleProject.png
[5]: ./media/notification-hubs-nokia-x-get-started/NewAndroidApp.png
[6]: ./media/notification-hubs-nokia-x-get-started/NewJavaClass.png
[7]: ./media/notification-hubs-nokia-x-get-started/NHConfigure.png
[8]: ./media/notification-hubs-nokia-x-get-started/NHConfigureNokiaX.png
[9]: ./media/notification-hubs-nokia-x-get-started/NHConfigureTopItem.png
[10]: ./media/notification-hubs-nokia-x-get-started/NHDashboard.png
[11]: ./media/notification-hubs-nokia-x-get-started/NokiaConsole.png
[12]: ./media/notification-hubs-nokia-x-get-started/NokiaConsoleService.png
[13]: ./media/notification-hubs-nokia-x-get-started/AndroidBuildTarget.png

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/


