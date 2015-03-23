<properties 
	pageTitle="Get Started with Azure Notification Hubs" 
	description="Learn how to use Azure Notification Hubs to push notifications." 
	services="notification-hubs" 
	documentationCenter="android" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.tgt_pltfrm="mobile-baidu" 
	ms.workload="mobile" 
	ms.date="03/16/2015" 
	ms.author="wesmc"/>

# Get started with Notification Hubs

[AZURE.INCLUDE [notification-hubs-selector-get-started](../includes/notification-hubs-selector-get-started.md)]

##Overview

Baidu cloud push is a Chinese cloud service that you can use to send push notifications to mobile devices. This service is particularly useful in China where delivering push notifications to Android is complex owing to the presence of different app stores, push services and availability of Android devices not typically connected to GCM (Google Cloud Messaging). 

##Prerequisites

This tutorial requires the following:

+ Android SDK (it is assumed you will be using Eclipse), which you can download from <a href="http://go.microsoft.com/fwlink/?LinkId=389797">here</a>
+ [Mobile Services Android SDK]
+ [Baidu Push Android SDK]

>[AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fnotification-hubs-baidu-get-started%2F).


##Create a Baidu account

To use Baidu, you must create an account. If you already have one, login to the [Baidu portal] with your Baidu account and skip to the next step; otherwise, see the instructions below on how to create a new Baidu account.  

1. Go to [Baidu portal] and click on 登录 (Login) link. Click 立即注册 to start a new account registration process. 

   	![][1]

2. Enter the required details – phone/email address, password and the verification code and click Signup.

   	![][2]

3. You will be sent an email to the email address you entered with a link to activate your Baidu account. 

   	![][3]

4. Login to your email account, open the Baidu activation mail, and click on the activation link to activate your Baidu account. 

   	![][4]

Once you have an activated Baidu account, login to the [Baidu portal] with your account. 

##Register as a Baidu developer

1. Once you have logged in to the [Baidu portal], click **更多>> (more)**.

  	![][5]

2. Scroll down the **站长与开发者服务 (Webmaster and Developer Services)** section and click **百度开放云平台 (Baidu open cloud platform)**. 

  	![][6]

3. On the next page, click **开发者服务 (Developer Services)** on the top right corner. 

  	![][7]

4. On the next page, click **注册开发者 (Registered Developers)** from the top right corner menu. 

  	![][8]

5. Enter your name, description and mobile phone number for receiving a verification text message and then click **送验证码 (Send Verification Code)**. Note that for international phone numbers you need to enclose the country code in braces e.g. for a United States number, it will be **(1)1234567890**.

  	![][9]

6. You should then receive a text message with a verification number, as shown in the following example:

  	![][10] 

7. Enter the verification number from the message in the **验证码 (Confirmation code)**. 

8. Finally, complete the developer registration by accepting the Baidu agreement and clicking **提交 (Submit)**. You will see the following page on successful completion of registration:

  	![][11] 

##Create a Baidu cloud push project

When you create a Baidu cloud push project, you receive your app ID, API key, and secret key.

1. Once you have logged in to the [Baidu portal], click **更多>> (more)**.

  	![][5]

2. Scroll down the **站长与开发者服务 (Webmaster and Developer Services)** section and click **百度开放云平台 (Baidu open cloud platform)**. 

  	![][6]

3. On the next page, click **开发者服务 (Developer Services)** on the top right corner. 

  	![][7]

4. On the next page, click **云推送 (Cloud Push)** from **云服务 (Cloud Services)** section. 

  	![][12]

5. Once you are a registered developer, you will see **管理控制台 (Management Console)** at the top menu. Click **开发者服务管理 (Developers Service Management)**. 

  	![][13]

6. On the next page, click **创建工程 (Create Project)**.

  	![][14]

7. Enter an application name and click **创建 (Create)**.

  	![][15]

8. Upon successful creation, you will see a page with the **AppID**, **API Key** and **Secret Key**. Make a note of the **API key** and **Secret key** that we will be using later. 

  	![][16]

9. Configure the project for Push Notifications by clicking on **云推送 (Cloud Push)** on the left pane. 

  	![][31]

10. On the next page, click the **推送设置 (Push settings)** button.

	![][32]  

11. On the configuration page, add the package name that you will be using in your Android project in the **应用包名 (Application package)** field and click **保存设置 (Save)**  

	![][33]

You will see **保存成功！(Successfully saved!)** message.

##Configure your Notification Hub

1. Log on to the [Azure Management Portal], and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Notification Hub**, then **Quick Create**.
 
3. Provide a name for your **Notification Hub**, select the **Region** and the **Namespace** where this notification hub will be created and then click on **Create a New Notification Hub**  

  	![][17]

4. Click the namespace in which you created your notification hub and then click **Notification Hubs** at the top. 

  	![][18]

5. Select the Notification Hub you created and click on **Configure** from the top menu.

  	![][19]

6. Scroll down to the **baidu notification settings** section and enter the **API Key** and **Secret Key** you obtained from the Baidu console previously for your Baidu cloud push project. Click **Save** after entering these values. 

  	![][20]

7. Click the **Dashboard** tab at the top for the Notification Hub and click **View Connection String**.

  	![][21]

8. Make a note of the **DefaultListenSharedAccessSignature** and **DefaultFullSharedAccessSignature** from the Access connection information window. 

    ![][22]

##Connecting your app to the Notification Hub

1. In Eclipse ADT, create a new Android project (File -> New -> Android Application).

    ![][23]

2. Enter an **Application Name** and ensure that the **Minimum Required SDK** version is set to **API 16: Android 4.1**.

    ![][24]

3. Click **Next** and continue following the wizard until the **Create Activity** window. Make sure that **Blank Activity** is selected and finally select **Finish** to create a new Android Application. 

    ![][25]

4. Make sure that the **Project Build Target** is set correctly.

    ![][26]

5. Download and unzip the [Mobile Services Android SDK], open the **notificationhubs** folder, copy the **notification-hubs-x.y.jar** file to the *libs* folder of your Eclipse project, and refresh the *libs* folder.

6. Download and unzip the [Baidu Push Android SDK], open the **libs** folder and copy the *pushservice-x.y.z* jar file and the *armeabi* & *mips* folders in the **libs** folder of your Android application. 

7. Open up the **AndroidManifest.xml** of your Android project and add the permissions required by the Baidu SDK.

	    <uses-permission android:name="android.permission.INTERNET" />
	    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
	    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
	    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
	    <uses-permission android:name="android.permission.WRITE_SETTINGS" />
	    <uses-permission android:name="android.permission.VIBRATE" />
	    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
	    <uses-permission android:name="android.permission.DISABLE_KEYGUARD" />
	    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
	    <uses-permission android:name="android.permission.ACCESS_DOWNLOAD_MANAGER" />
	    <uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION" />

8. Add the *android:name* property to your *application* element in the **AndroidManifest.xml** replacing *yourprojectname* e.g. **com.example.BaiduTest**. Make sure that this project name matches the one you configured in the Baidu console. 

		<application android:name="yourprojectname.DemoApplication"

9. Add the following configuration within the application element after the .MainActivity activity element replacing *yourprojectname* e.g. **com.example.BaiduTest**:

		<receiver android:name="yourprojectname.MyPushMessageReceiver">
		    <intent-filter>
		        <action android:name="com.baidu.android.pushservice.action.MESSAGE" />
		        <action android:name="com.baidu.android.pushservice.action.RECEIVE" />
		        <action android:name="com.baidu.android.pushservice.action.notification.CLICK" />
		    </intent-filter>
		</receiver>
		
		<receiver android:name="com.baidu.android.pushservice.PushServiceReceiver"
		    android:process=":bdservice_v1">
		    <intent-filter>
		        <action android:name="android.intent.action.BOOT_COMPLETED" />
		        <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
				<action android:name="com.baidu.android.pushservice.action.notification.SHOW" />
		    </intent-filter>
		</receiver>
        
        <receiver android:name="com.baidu.android.pushservice.RegistrationReceiver"
            android:process=":bdservice_v1">
            <intent-filter>
                <action android:name="com.baidu.android.pushservice.action.METHOD" />
                <action android:name="com.baidu.android.pushservice.action.BIND_SYNC" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_REMOVED"/>
                <data android:scheme="package" />
            </intent-filter>                   
        </receiver>
        
        <service
            android:name="com.baidu.android.pushservice.PushService"
            android:exported="true"
            android:process=":bdservice_v1"  >
            <intent-filter>
                <action android:name="com.baidu.android.pushservice.action.PUSH_SERVICE" />
            </intent-filter>
        </service>

9. Add a new class called **ConfigurationSettings.java** to the project. 

    ![][28]

    ![][29]

10. Add the following code to it:

		public class ConfigurationSettings {
		        public static String API_KEY = "...";
				public static String NotificationHubName = "...";
				public static String NotificationHubConnectionString = "...";
			}
	
	Set the value of the *API_KEY* with what you retrieved from the Baidu cloud project earlier, *NotificationHubName* with your notification hub name from the Azure portal and *NotificationHubConnectionString* with DefaultListenSharedAccessSignature from the Azure portal. 

11. Add a new class called **DemoApplication.java** and add the following code to it:

		import com.baidu.frontia.FrontiaApplication;
		
		public class DemoApplication extends FrontiaApplication {
		    @Override
		    public void onCreate() {
		        super.onCreate();
		    }
		}

12. Add another new class called **MyPushMessageReceiver.java** and add the code below to it. This is the class which handles the push notifications received from the Baidu push server:

		import java.util.List;
		import android.content.Context;
		import android.os.AsyncTask;
		import android.util.Log;
		import com.baidu.frontia.api.FrontiaPushMessageReceiver;
		import com.microsoft.windowsazure.messaging.NotificationHub;
		
		public class MyPushMessageReceiver extends FrontiaPushMessageReceiver {
		    /** TAG to Log */
			public static NotificationHub hub = null;
			public static String mChannelId, mUserId;
		    public static final String TAG = MyPushMessageReceiver.class
		            .getSimpleName();
		    
			@Override
		    public void onBind(Context context, int errorCode, String appid,
		            String userId, String channelId, String requestId) {
		        String responseString = "onBind errorCode=" + errorCode + " appid="
		                + appid + " userId=" + userId + " channelId=" + channelId
		                + " requestId=" + requestId;
		        Log.d(TAG, responseString);
		        mChannelId = channelId;
		        mUserId = userId;
		        
		        try {
		       	 if (hub == null) {
		                hub = new NotificationHub(
		                		ConfigurationSettings.NotificationHubName, 
		                		ConfigurationSettings.NotificationHubConnectionString, 
		                		context);
		                Log.i(TAG, "Notification hub initialized");
		            }
		        } catch (Exception e) {
		           Log.e(TAG, e.getMessage());
		        }
		        
		        registerWithNotificationHubs();
			}
		    
		    private void registerWithNotificationHubs() {
		       new AsyncTask<Void, Void, Void>() {
		          @Override
		          protected Void doInBackground(Void... params) {
		             try {
		            	 hub.registerBaidu(mUserId, mChannelId);
		            	 Log.i(TAG, "Registered with Notification Hub - '" 
		     	    			+ ConfigurationSettings.NotificationHubName + "'" 
		     	    			+ " with UserId - '"
		     	    			+ mUserId + "' and Channel Id - '"
		     	    			+ mChannelId + "'");
		             } catch (Exception e) {
		            	 Log.e(TAG, e.getMessage());
		             }
		             return null;
		         }
		       }.execute(null, null, null);
		    }
		    
		    @Override
		    public void onSetTags(Context context, int errorCode,
		            List<String> sucessTags, List<String> failTags, String requestId) {
		        String responseString = "onSetTags errorCode=" + errorCode
		                + " sucessTags=" + sucessTags + " failTags=" + failTags
		                + " requestId=" + requestId;
		        Log.d(TAG, responseString);
		    }
		
		    @Override
		    public void onDelTags(Context context, int errorCode,
		            List<String> sucessTags, List<String> failTags, String requestId) {
		        String responseString = "onDelTags errorCode=" + errorCode
		                + " sucessTags=" + sucessTags + " failTags=" + failTags
		                + " requestId=" + requestId;
		        Log.d(TAG, responseString);
		    }
		
		    @Override
		    public void onListTags(Context context, int errorCode, List<String> tags,
		            String requestId) {
		        String responseString = "onListTags errorCode=" + errorCode + " tags="
		                + tags;
		        Log.d(TAG, responseString);
		    }
		
		    @Override
		    public void onUnbind(Context context, int errorCode, String requestId) {
		        String responseString = "onUnbind errorCode=" + errorCode
		                + " requestId = " + requestId;
		        Log.d(TAG, responseString);
		    }
		
		    @Override
		    public void onNotificationClicked(Context context, String title,
		            String description, String customContentString) {
		        String notifyString = "title=\"" + title + "\" description=\""
		                + description + "\" customContent=" + customContentString;
		        Log.d(TAG, notifyString);
		    }
		
		    @Override
		    public void onMessage(Context context, String message,
		            String customContentString) {
		        String messageString = "message=\"" + message + "\" customContentString=" + customContentString;
		        Log.d(TAG, messageString);
		    }
		}

13. Open up the **MainActivity.java** and add the following to the **onCreate** method:

	        PushManager.startWork(getApplicationContext(),
	                PushConstants.LOGIN_TYPE_API_KEY, ConfigurationSettings.API_KEY);

and add the following import statements at the top:
			import com.baidu.android.pushservice.PushConstants;
			import com.baidu.android.pushservice.PushManager;

##Send notifications to your app

You can send notifications using Notification Hubs from any back-end that uses our <a href="http://msdn.microsoft.com/library/windowsazure/dn223264.aspx">REST interface</a>. In this tutorial we show it using a .NET console app. 

1. Create a new Visual C# console application:

	![][30]

2. Add a reference to the Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then **Library Package Manager**, then **Package Manager Console**. Then, in the console window type the following and press Enter:

        Install-Package WindowsAzure.ServiceBus

3. Open the file Program.cs and add the following using statement:

        using Microsoft.ServiceBus.Notifications;

4. In your `Program` class add the following method and replace the *DefaultFullSharedAccessSignatureSASConnectionString* and *NotificationHubName* with the values you have. 

		private static async void SendNotificationAsync()
		{
			NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("DefaultFullSharedAccessSignatureSASConnectionString", "NotificationHubName");
			string message = "{\"title\":\"((Notification title))\",\"description\":\"Hello from Azure\"}";
			var result = await hub.SendBaiduNativeNotificationAsync(message);
		}

5. Then add the following lines in your Main method:

         SendNotificationAsync();
		 Console.ReadLine();

##Testing your app

To test this app with an actual phone, just connect it to your computer with a USB cable.

To test this app with the emulator:

1. On the Eclipse top toolbar, click Run and then select your app. 

2. This loads your app, either onto the attached phone, or else it starts the emulator, and loads and runs the app.

3. The app retrieves the 'userId' and 'channelId' from the Baidu Push notification service and registers with the Notification Hub.
	
4.	To send a test notification when using the .Net console application, just press the F5 key in Visual Studio to run the application, and it will send a notification that will appear in the top notification area of your device or emulator. 


<!-- Images. -->
[1]: ./media/notification-hubs-baidu-get-started/BaiduRegistration.png
[2]: ./media/notification-hubs-baidu-get-started/BaiduRegistrationInput.png
[3]: ./media/notification-hubs-baidu-get-started/BaiduConfirmation.png
[4]: ./media/notification-hubs-baidu-get-started/BaiduActivationEmail.png
[5]: ./media/notification-hubs-baidu-get-started/BaiduRegistrationMore.png
[6]: ./media/notification-hubs-baidu-get-started/BaiduOpenCloudPlatform.png
[7]: ./media/notification-hubs-baidu-get-started/BaiduDeveloperServices.png
[8]: ./media/notification-hubs-baidu-get-started/BaiduDeveloperRegistration.png
[9]: ./media/notification-hubs-baidu-get-started/BaiduDevRegistrationInput.png
[10]: ./media/notification-hubs-baidu-get-started/BaiduDevRegistrationConfirmation.png
[11]: ./media/notification-hubs-baidu-get-started/BaiduDevConfirmationFinal.png
[12]: ./media/notification-hubs-baidu-get-started/BaiduCloudPush.png
[13]: ./media/notification-hubs-baidu-get-started/BaiduDevSvcMgmt.png
[14]: ./media/notification-hubs-baidu-get-started/BaiduCreateProject.png
[15]: ./media/notification-hubs-baidu-get-started/BaiduCreateProjectInput.png
[16]: ./media/notification-hubs-baidu-get-started/BaiduProjectKeys.png
[17]: ./media/notification-hubs-baidu-get-started/AzureNHCreation.png
[18]: ./media/notification-hubs-baidu-get-started/NotificationHubs.png
[19]: ./media/notification-hubs-baidu-get-started/NotificationHubsConfigure.png
[20]: ./media/notification-hubs-baidu-get-started/NotificationHubBaiduConfigure.png
[21]: ./media/notification-hubs-baidu-get-started/NotificationHubsConnectionStringView.png
[22]: ./media/notification-hubs-baidu-get-started/NotificationHubsConnectionString.png
[23]: ./media/notification-hubs-baidu-get-started/EclipseNewProject.png
[24]: ./media/notification-hubs-baidu-get-started/EclipseProjectCreation.png
[25]: ./media/notification-hubs-baidu-get-started/EclipseBlankActivity.png
[26]: ./media/notification-hubs-baidu-get-started/EclipseProjectBuildProperty.png
[27]: ./media/notification-hubs-baidu-get-started/EclipseBaiduReferences.png
[28]: ./media/notification-hubs-baidu-get-started/EclipseNewClass.png
[29]: ./media/notification-hubs-baidu-get-started/EclipseConfigSettingsClass.png
[30]: ./media/notification-hubs-baidu-get-started/ConsoleProject.png
[31]: ./media/notification-hubs-baidu-get-started/BaiduPushConfig1.png
[32]: ./media/notification-hubs-baidu-get-started/BaiduPushConfig2.png
[33]: ./media/notification-hubs-baidu-get-started/BaiduPushConfig3.png

<!-- URLs. -->
[Mobile Services Android SDK]: https://go.microsoft.com/fwLink/?LinkID=280126&clcid=0x409
[Baidu Push Android SDK]: http://developer.baidu.com/wiki/index.php?title=docs/cplat/push/sdk/clientsdk
[Azure Management Portal]: https://manage.windowsazure.com/
[Baidu portal]: http://www.baidu.com/



