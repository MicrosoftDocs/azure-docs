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
	ms.topic="hero-article" 
	ms.date="04/04/2016"
	ms.author="piyushjo" />

# Get Started with Azure Mobile Engagement for Cordova/Phonegap

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your app usage and send push notifications to segmented users for a mobile application developed with Cordova.

In this tutorial, we will create a blank Cordova app using Mac and then integrate Mobile Engagement SDK. It collects basic analytics data and receives push notifications using Apple Push Notification System (APNS) for iOS and Google Cloud Messaging (GCM) for Android. We will deploy this to an iOS or Android device for testing. 

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-cordova-get-started).

This tutorial requires the following:

+ XCode, which you can install from Mac App Store (for deploying to iOS)
+ [Android SDK & Emulator](http://developer.android.com/sdk/installing/index.html) (for deploying to Android)
+ Push notification certificate (.p12) that you can obtain from Apple Dev Center for APNS
+ GCM Project number that you can obtain from your Google Developer Console for GCM
+ [Mobile Engagement Cordova Plugin](https://www.npmjs.com/package/cordova-plugin-ms-azure-mobile-engagement)

> [AZURE.NOTE] You can find the source code and the ReadMe for the Cordova plugin on [Github](https://github.com/Azure/azure-mobile-engagement-cordova)

##<a id="setup-azme"></a>Setup Mobile Engagement for your Cordova app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal.md)]

##<a id="connecting-app"></a>Connecting your app to the Mobile Engagement backend

This tutorial presents a "basic integration" which is the minimal set required to collect data and send a push notification. 

We will create a basic app with Cordova to demonstrate the integration:

###Create a new Cordova project

1. Launch *Terminal* window on your Mac machine and type the following which will create a new Cordova project from the default template. Make sure that the publishing profile you eventually use to deploy your iOS app is using 'com.mycompany.myapp' as the App ID. 

		$ cordova create azme-cordova com.mycompany.myapp
		$ cd azme-cordova

2. Execute the following to configure your project for **iOS** and run it in the iOS Simulator:

		$ cordova platform add ios 
		$ cordova run ios

3. Execute the following to configure your project for **Android** and run it in the Android emulator. Make sure that your Android SDK Emulator settings have its Target as Google APIs (Google Inc.) with the CPU / ABI as Google APIs ARM.  

		$ cordova platform add android
		$ cordova run android

4. 	Add the Cordova Console plugin. 

		$ cordova plugin add cordova-plugin-console 

###Connect your app to Mobile Engagement backend

1. Install the Azure Mobile Engagement Cordova plugin while providing the variable values to configure the plugin:

		cordova plugin add cordova-plugin-ms-azure-mobile-engagement    
     		--variable AZME_IOS_CONNECTION_STRING=<iOS Connection String> 
	        --variable AZME_IOS_REACH_ICON=... (icon name WITH extension) 
	        --variable AZME_ANDROID_CONNECTION_STRING=<Android Connection String> 
			--variable AZME_ANDROID_REACH_ICON=... (icon name WITHOUT extension)       
	        --variable AZME_ANDROID_GOOGLE_PROJECT_NUMBER=... (From your Google Cloud console for sending push notifications) 
	        --variable AZME_ACTION_URL =... (URL scheme which triggers the app for deep linking)
	        --variable AZME_ENABLE_NATIVE_LOG=true|false
			--variable AZME_ENABLE_PLUGIN_LOG=true|false

*Android Reach Icon* : must be the name of the resource without any extension, nor drawable prefix (ex: mynotificationicon), and the icon file must be copied into your android project (platforms/android/res/drawable)

*iOS Reach Icon*  : must be the name of the resource with its extension (ex:  mynotificationicon.png), and the icon file must be added into your iOS project with XCode (using the Add Files Menu)

##<a id="monitor"></a>Enabling real-time monitoring

1. In the Cordova project - edit **www/js/index.js** to add the call to Mobile Engagement to declare a new activity once the *deviceReady* event is received.

		 onDeviceReady: function() {
		        Engagement.startActivity("myPage",{});
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

##<a id="monitor"></a>Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

##<a id="integrate-push"></a>Enabling Push Notifications and in-app messaging

Mobile Engagement allows you to interact with your users using Push Notifications and in-app messaging in the context of campaigns. This module is called REACH in the Mobile Engagement portal.
The following sections will setup your app to receive them.

###Configure Push credentials for Mobile Engagement

To allow Mobile Engagement to send Push Notifications on your behalf, you need to grant it access to your Apple iOS certificate or GCM Server API Key. 
	
1. Navigate to your Mobile Engagement portal. Ensure you're in the app we're using for this project and then click on the **Engage** button at the bottom:
	
	![][1]
	
2. You will land in the settings page in your Engagement Portal. From there click on the **Native Push** section:
	
	![][2]

3. Configure iOS Certificate/GCM Server API Key

	**[iOS]**

	a. Select your .p12, upload it and type your password:
	
	![][3]

	**[Android]**

	a. Click the edit icon in front of **API Key** in the GCM Settings section and in the popup which shows up, paste the GCM Server Key and click **OK**. 
		
	![][4]

###Enable push notifications in the Cordova app

Edit **www/js/index.js** to add the call to Mobile Engagement to request push notifications and declare a handler:

	 onDeviceReady: function() {
           Engagement.initializeReach(  
	 			// on OpenUrl  
	 			function(_url) {   
	 			alert(_url);   
	 			});  
			Engagement.startActivity("myPage",{});  
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

1. Navigate to the **Reach** tab in your Mobile Engagement portal

2. Click **New Announcement** to create your push campaign

	![][6]

3. Provide inputs to create your campaign **[Android]**
	
	- Provide a **Name** for your campaign. 
	- Select the **Delivery Type** as *System notification* *Simple*
	- Select the **Delivery time** as *"Any Time"*
	- Provide a **Title** for your notification which will be the first line in the push.
	- Provide a **Message** for your notification which will serve as the message body. 

	![][11]

4. Provide inputs to create your campaign **[iOS]**

	- Provide a **Name** for your campaign. 
	- Select the **Delivery time** as *"Out of app only"*
	- Provide a **Title** for your notification which will be the first line in the push.
	- Provide a **Message** for your notification which will serve as the message body. 
 
	![][12]

5. Scroll down, and in the content section select **Notification only**

	![][8]

6. [Optional] You can also provide an Action URL. Make sure that it uses a URL scheme provided while configuring the plugin's **AZME\_REDIRECT\_URL** variable e.g. *myapp://test*.  

7. You're done setting the most basic campaign possible. Now scroll down again and click the **Create** button to save your campaign.

8. Finally **Activate** your campaign
	
	![][10]

9. You should now see a push notification on your device or emulator as part of this campaign. 

##<a id="next-steps"></a>Next Steps
[Overview of all methods available with Cordova Mobile Engagement SDK](https://github.com/Azure/azure-mobile-engagement-cordova)

<!-- Images. -->

[1]: ./media/mobile-engagement-cordova-get-started/engage-button.png
[2]: ./media/mobile-engagement-cordova-get-started/engagement-portal.png
[3]: ./media/mobile-engagement-cordova-get-started/native-push-settings.png
[4]: ./media/mobile-engagement-cordova-get-started/api-key.png
[6]: ./media/mobile-engagement-cordova-get-started/new-announcement.png
[8]: ./media/mobile-engagement-cordova-get-started/campaign-content.png
[10]: ./media/mobile-engagement-cordova-get-started/campaign-activate.png
[11]: ./media/mobile-engagement-cordova-get-started/campaign-first-params-android.png
[12]: ./media/mobile-engagement-cordova-get-started/campaign-first-params-ios.png

