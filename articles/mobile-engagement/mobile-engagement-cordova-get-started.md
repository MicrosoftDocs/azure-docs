<properties
	pageTitle="Get Started with Azure Mobile Engagement for Cordova/Phonegap"
	description="Learn how to use Azure Mobile Engagement with Analytics and Push Notifications for Cordova/Phonegap apps."
	services="mobile-engagement"
	documentationCenter="Mobile"
	authors="piyushjo"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-phonegap"
	ms.devlang="js"
	ms.topic="article" 
	ms.date="07/02/2015"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for Cordova/Phonegap

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-dotnet-get-started.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-get-started.md)
- [iOS - Obj C](mobile-engagement-ios-get-started.md)
- [iOS - Swift](mobile-engagement-ios-swift-get-started.md)
- [Android](mobile-engagement-android-get-started.md)
- [Cordova](mobile-engagement-cordova-get-started.md)

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users for a mobile application developed with Cordova.

In this tutorial, we will create a blank Cordova app using Mac and then integrate Mobile Engagement SDK. It collects basic analytics data and receives push notifications using Apple Push Notification System (APNS) for iOS and Google Cloud Messaging (GCM) for Android. We will deploy this to an iOS or Android device for testing. 

> [AZURE.IMPORTANT] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fwww.windowsazure.com%2Fen-us%2Fdevelop%2Fmobile%2Ftutorials%2Fget-started%2F" target="_blank">Azure Free Trial</a>.

This tutorial requires the following:

+ XCode, which you can install from Mac App Store (for deploying to iOS)
+ [Android SDK & Emulator](http://developer.android.com/sdk/installing/index.html) (for deploying to Android)
+ Push notification certificate (.p12) that you can obtain from Apple Dev Center for APNS
+ GCM Project number that you can obtain from your Google Developer Console for GCM
+ [Mobile Engagement Cordova Plugin](https://www.npmjs.com/package/cordova-plugin-ms-azure-mobile-engagement)

> [AZURE.NOTE] You can find the source code and the ReadMe for the Cordova plugin on [Github](https://github.com/Azure/azure-mobile-engagement-cordova)

##<a id="setup-azme"></a>Setup Mobile Engagement for your app

1. Log on to the Azure Management Portal, and then click **+NEW** at the bottom of the screen.

2. Click on **App Services**, then **Mobile Engagement**, and then **Create**.

   	![][1]

3. In the popup that appears, enter the following information:

   	![][2]

	- **Application Name**: Name of your application. 
	- **Platform**: Target platform for the app (Choose **iOS** or **Android** depending on where you are deploying your Cordova App)
	- **Application Resource Name**: Name by which this application will be accessible via APIs and URLs. 
	- **Location**: Data center where this app and app collection will be hosted.
	- **Collection**: Select a previously created Collection or select 'New Collection'.
	- **Collection Name**: Represents your group of applications. This will also ensure all your apps are in a group that will allow aggregated calculations of metrics. You should use your company name or department here if applicable.

4. Select the app you just created in the **Applications** tab.

5. Click on **Connection Info** in order to display the connection settings to put into your SDK integration in your mobile app.

   	![][3]

6. Copy the **Connection String** - this is what you will need to identify this app in your Application code and connect with Mobile Engagement from your Phone App.

   	![][4]

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. 

We will create a basic app with Cordova to demonstrate the integration:

###Create a new Cordova project

1. Launch *Terminal* window on your Mac machine and type the following which will create a new Cordova project from the default template:

		$ cordova create azme-cordova com.mycompany.myapp
		$ cd azme-cordova

> [AZURE.IMPORTANT] Make sure that the publishing profile you eventually use to deploy your iOS app is using 'com.mycompany.myapp' as the App ID.  

2. Execute the following to configure your project for **iOS** and run it in the iOS Simulator:

		$ cordova platform add ios 
		$ cordova run ios

3. Execute the following to configure your project for **Android** and run it in the Android emulator:

		$ cordova platform add android
		$ cordova run android

4. 	Add the Cordova Console plugin. 

		$ cordova plugin add cordova-plugin-console 

###Connect your app to Mobile Engagement backend

1. Install the Azure Mobile Engagement Cordova plugin while providing the variable values to configure the plugin:

		cordova plugin add cordova-plugin-ms-azure-mobile-engagement    
			--variable AZME_IOS_COLLECTION=<iOSAppCollectionName>.device.mobileengagement.windows.net
	        --variable AZME_IOS_SDKKEY=... 
	        --variable AZME_IOS_APPID=... 
	        --variable AZME_IOS_REACH_ICON=... (icon name WITH extension) 
	        --variable AZME_ANDROID_COLLECTION=<AndroidAppCollectionName>.device.mobileengagement.windows.net
	        --variable AZME_ANDROID_SDKKEY=...
	        --variable AZME_ANDROID_APPID=...
			--variable AZME_ANDROID_REACH_ICON=... (icon name WITHOUT extension)       
	        --variable AZME_ANDROID_GOOGLE_PROJECT_NUMBER=... (From your Google Cloud console for sending push notifications) 
	        --variable AZME_REDIRECT_URL=... (URL scheme which triggers the app for deep linking)
	        --variable AZME_ENABLE_LOG=true|false

	For example: 

		cordova plugin add cordova-plugin-ms-azure-mobile-engagement   
			--variable AZME_IOS_COLLECTION=apps-Collection.device.mobileengagement.windows.net
	        --variable AZME_IOS_SDKKEY=26dxxxxxxxxxxxxb794 
	        --variable AZME_IOS_APPID=piyxxxxxx
	        --variable AZME_IOS_REACH_ICON=icon.png 
			--variable AZME_ANDROID_COLLECTION=apps-Collection.device.mobileengagement.windows.net
	        --variable AZME_ANDROID_SDKKEY=c3d296xxxxxxxxxxc6540
	        --variable AZME_ANDROID_APPID=piyxxxxxxx
			--variable AZME_ANDROID_REACH_ICON=icon   
	        --variable AZME_ANDROID_GOOGLE_PROJECT_NUMBER=393xxxxxxx718
			--variable AZME_REDIRECT_URL=myapp 
			--variable AZME_ENABLE_LOG=true

> [AZURE.TIP] The AppId, SDKKey and Collection can be retrieved from the connection string  **Endpoint={YourAppCollection.Domain};SdkKey={YourSDKKey};AppId={YourAppId}** 

##<a id="monitor"></a>Enabling real-time monitoring

1. In the Cordova project - edit **www/js/index.js** to add the call to Mobile Engagement to declare a new activity once the *deviceReady* event is received.

		 onDeviceReady: function() {
		        app.receivedEvent('deviceready');
		        AzureEngagement.startActivity("myPage",{});
		    }

2. Run the application:
		
	- **For iOS**
	
		In `Terminal` window launch your app in a new Simulator instance by executing the following:

			cordova run ios

	- **For Android**
		
		In `Terminal` window launch your app in a new emulator instance by executing the following:

			cordova run android

3. You can see the following in the console logs:

		[Engagement] Agent: Session started
		[Engagement] Agent: Activity 'myPage' started
		[Engagement] Connection: Established
		[Engagement] Connection: Sent: appInfo
		[Engagement] Connection: Sent: startSession
		[Engagement] Connection: Sent: activity name='myPage'

###Ensure your app is connected with realtime monitoring

This section shows you how to make sure your app connects to the Mobile Engagement backend by using Mobile Engagement's realtime monitoring feature.

1. Navigate to your Mobile Engagement portal

	From your Azure portal, ensure you're in the app we're using for this project and then click on the **Engage** button at the bottom:

	![][6]

2. You will land in the settings page in your **Engagement Portal** for your app. From there click on the **Monitor** tab:

	![][7]

3. If your app running in the Emulator is configured correctly then you will see a session logged in realtime while your app is running:

	![][8]

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact with your users using Push Notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

###Configure Push credentials for Mobile Engagement

To allow Mobile Engagement to send Push Notifications on your behalf, you need to grant it access to your Apple iOS certificate or GCM Server API Key. 
	
1. Navigate to your Mobile Engagement portal. Ensure you're in the app we're using for this project and then click on the **Engage** button at the bottom:
	
	![][10]
	
2. You will land in the settings page in your Engagement Portal. From there click on the **Native Push** section:
	
	![][11]

3. Configure iOS Certificate/GCM Server API Key

	**[iOS]**

	a. Select your .p12, upload it and type your password:
	
	![][12]

	**[Android]**

	a. Click the edit icon in front of **API Key** in the GCM Settings section as shown below:
		
	![][20]
	
	b. In the popup, paste the GCM Server Key then click **Ok**.
	
	![][21]

###Enable push notifications in the Cordova app

Edit **www/js/index.js** to add the call to Mobile Engagement to request push notifications and declare a handler:

	 onDeviceReady: function() {
	        app.receivedEvent('deviceready');
	        AzureEngagement.registerForPushNotification();
	        AzureEngagement.onOpenURL(function(_url) { alert(_url); });
	        AzureEngagement.startActivity("myPage",{});
	    }

###Run the app

**[iOS]**

1. We will use XCode to build and deploy the app on the device to test push notifications since iOS only allows push notifications to an actual device. Go to the location where your Cordova project is created and navigate to **...\platforms\ios** location. Open up the native .xcodeproj file in XCode. 
	
2. Build and deploy the Cordova app to the iOS device using the account which has the provisioning profile containing the certificate you just uploaded to the Mobile Engagement portal and the App Id which matches the one you provided while creating the Cordova app. You can check out the *Bundle identifier* in your **Resources\*-info.plist** file in XCode to match it up. 

3. You will see the standard iOS popup on your device saying that the app requests permission to send notifications. Grant the permission. 

**[Android]**

You can simply use the emulator to run the Android app as GCM notifications are supported on the Android emulator. 

	cordova run android

##<a id="send"></a>Send a notification to your app

We will now create a simple Push Notification campaign that will send a push to your app running on the device:

1. Navigate to the Reach tab in your Mobile Engagement portal

2. Click **New Announcement** to create your push campaign

	![][13]

3. Provide inputs to create your campaign:

	![][14]

	- 	Provide a name for your campaign. 
	- 	**[Android]** Select the **Delivery Type** as *System notification* - *Simple*
	- 	Select the Delivery time as 
		- 	For **iOS** : *"Out of app only"*
		- 	For **Android** : *"Any Time"*
		
		This is the simple push notification type that features some text.
	- 	In the notification text, type first the Title which will be the first line in the push
	- 	Then type your message which will be the second line

4. Scroll down, and in the content section select **Notification only**

	![][15]

5. [Optional] You can also provide an Action URL. Make sure that it uses a URL scheme provided while configuring the plugin's **AZME REDIRECT URL** variable e.g. *myapp://test*.  

5. You're done setting the most basic campaign possible, now scroll down again and **Create** your campaign to save it.
	
	![][16]

6. Finally **Activate** your campaign
	
	![][17]

7. You should now see a push notification on your device or emulator as part of this campaign. 

##<a id="next-steps"></a>Next Steps
[Overview of all methods available with Cordova Mobile Engagement SDK](https://github.com/Azure/azure-mobile-engagement-cordova)

<!-- URLs. -->
[Mobile Engagement iOS SDK]: http://go.microsoft.com/?linkid=9864553

<!-- Images. -->
[1]: ./media/mobile-engagement-cordova-get-started/create-mobile-engagement-app.png
[2]: ./media/mobile-engagement-cordova-get-started/create-azme-popup.png
[3]: ./media/mobile-engagement-cordova-get-started/app-main-page-select-connection-info.png
[4]: ./media/mobile-engagement-cordova-get-started/app-connection-info-page.png
[6]: ./media/mobile-engagement-cordova-get-started/engage-button.png
[7]: ./media/mobile-engagement-cordova-get-started/clic-monitor-tab.png
[8]: ./media/mobile-engagement-cordova-get-started/monitor.png
[10]: ./media/mobile-engagement-cordova-get-started/engage-button.png
[11]: ./media/mobile-engagement-cordova-get-started/engagement-portal.png
[12]: ./media/mobile-engagement-cordova-get-started/native-push-settings.png
[13]: ./media/mobile-engagement-cordova-get-started/new-announcement.png
[14]: ./media/mobile-engagement-cordova-get-started/campaign-first-params.png
[15]: ./media/mobile-engagement-cordova-get-started/campaign-content.png
[16]: ./media/mobile-engagement-cordova-get-started/campaign-create.png
[17]: ./media/mobile-engagement-cordova-get-started/campaign-activate.png
[18]: ./media/mobile-engagement-cordova-get-started/engage-button.png
[19]: ./media/mobile-engagement-cordova-get-started/engagement-portal.png
[20]: ./media/mobile-engagement-cordova-get-started/native-push-settings.png
[21]: ./media/mobile-engagement-cordova-get-started/api-key.png
