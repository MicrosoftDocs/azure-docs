<properties
	pageTitle="Azure Mobile Engagement demo app | Microsoft Azure"
	description="Describes where to download, how to use, and the benefits of using Azure Mobile Engagement demo app"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2016"
	ms.author="piyushjo" />

# Azure Mobile Engagement demo app

We've published an Azure Mobile Engagement demo app for **iOS**, **Android**, and **Windows** platforms to help you to find useful resources and learn more about Azure Mobile Engagement.

The app helps you to:

- Easily find useful links to Mobile Engagement resources like videos, documentation, the support forum, and where to go to raise feature requests.
- Experience sample notifications that are supported by Azure Mobile Engagement to get ideas for your own mobile applications.
- Use a reference implementation to study how to implement Mobile Engagement into your own app. You can learn to:

	- Collect analytics data.
	- Implement advanced notification scenarios of types such as *Full screen Interstitial* or *Pop-up*.
	- Implement surveys and polls.
	- Implement silent push data and push scenarios.   

## App installation
This app is available in the following apps stores:

- **Windows Universal demo app**

	- Download the app at the [Windows App store](https://www.microsoft.com/en-us/store/apps/azure-mobile-engagement/9nblggh4qmh2).
	- The app was developed as a Windows 10 Universal App. The source code is available on [GitHub](https://github.com/Azure/azure-mobile-engagement-app-ios).

- **iOS demo app**

	- Download the app at the [Apple store](https://itunes.apple.com/us/app/azure%20mobile%20engagement/id1105090090).
	- The app was developed in iOS Swift. The source code is available on [GitHub](https://github.com/Azure/azure-mobile-engagement-app-ios).

- **Android demo app**

	- Download the app at the [Google Play store](https://play.google.com/store/apps/details?id=com.microsoft.azure.engagement)
	- The source code is available on [GitHub](https://github.com/Azure/azure-mobile-engagement-app-android).

![Windows Universal demo app][1]

![iOS demo app][2]
![Android demo app][3]


## Usage

You can use this app in the following ways:

**Download the app on your device from the application store links (provided earlier):**

>[AZURE.IMPORTANT] You don't need an Azure account or to connect the app to a back end. The app works independently.

- After you have the app on your device, then you can go through the links in the left-side menu to find the useful resources about Mobile Engagement.
- We've added the [service's RSS feed](https://aka.ms/azmerssfeed) into this application so that you're always updated about the latest product updates.
- You can also go through the sample notification scenarios to experience the type of notifications that are supported by Mobile Engagement for each platform. These notifications can be experienced locally--that is, you can click the buttons on the screens to show you the notifications experience, which is identical to sending the notifications from the Mobile Engagement platform.

![menu-windows][4]

![menu-ios][5]
![menu-android][6]

**Download the source code from the Github links (provided earlier):**

- After you've downloaded the source code, open it in the respective development environment--XCode for iOS, Android Studio for Android, and Visual Studio for Windows.
- You should next follow our [basic SDK integration steps](mobile-engagement-windows-store-dotnet-get-started.md) so that you're able to connect this app to its own Mobile Engagement back-end instance.
	- You need to configure a connection string in the app.
	- You also need to configure the push notification platform for your app.
- You'll notice that this app itself is instrumented with Azure Mobile Engagement. Therefore, as you open the app after connecting it to the back end, you'll be able to see the user session, activities, events, and so on, on the **Monitor** tab.
- You'll also be able to send notifications to this app from your own Mobile Engagement instance instead of using local notifications.
	- Here you can add your device as a test device by using the **Get the Device ID** menu item in the app. This will give you a device ID that you then register as a test device with your platform back-end instance.

	![device-id-windows][7]

	![device-id-ios][8]
	![device-id-android][9]

## Key features of the demo app

- As mentioned earlier, with this app, you have all the key resources for Azure Mobile Engagement in your hand. You can go through the links in the left menu.

- You can experience out-of-app notifications for each platform. These notifications can be delivered as **notification only**, where clicking the notification simply opens up a native screen of the application (by using **deep linking**), or as a **Web announcement**, where you can deliver additional HTML content from the Mobile Engagement back end to be displayed when the notification is clicked.

	![out-of-app][29]

	- On iOS, you have to close the app to see the out-of-app or system push notifications. You can look at the implementation here for adding **Action buttons**, like the ones that are added to this out-of-app notification for *Feedback* and *Share* (so that the user can take action right from the notification itself).

	![out-of-app-ios][11] ![out-of-app-display-ios][14]

	- On Android, you can see the options that are supported in the form of adding multiline text (**Big Text**) or adding an image in the notification **Big Picture**) to the notification along with the **Action buttons**, as supported by iOS.

	![out-of-app-android][12] ![out-of-app-display-android][15]

	- On Windows 10, you can see how the notifications look on the PC. This notification also shows up in the Windows 10 **Notification Center**. There is no support for adding **Action buttons** at the moment with the Windows SDK.

	![out-of-app-windows][10] ![out-of-app-display-windows][13]

- You can experience default in-app notifications for each platform. This is a two-step experience where a **Notification** window is displayed first. When you click it, it opens up a full screen **Announcement**, as displayed in the following screenshot. The content of this announcement comes from your Mobile Engagement back-end instance. The SDK has the templates for both notifications and announcements. They can be easily customized as in this demo app with the addition of our logo and coloring.  

	![in-app-windows][16]

	![in-app-ios][17] **iOS** ![in-app-android][18] **Android**

- You can also use the **Category** feature of Mobile Engagement to customize this default experience. In the demo app, we've demonstrated two common ways to change the experience of the notifications. Note that Category feature is not yet supported in the Windows SDK yet.

	**Full-screen interstitial:**

	![in-app-interstitial][30]

	![interstitial-ios][21]	![interstitial-android][22]

	**Pop-up notification:**

	![in-app-pop-up][31]

	![pop-up-ios][19]	![pop-up-android][20]

**iOS**, **Android**

- Mobile Engagement also supports a specialized type of in-app notification called **Polls**. This allows you to send out quick surveys to your segmented app users. You can add questions and options for each question as in the following screenshot, which will then get displayed as an in-app notification to the app user.   

	![notification-poll][32]

	![survey-windows][26]

	![survey-ios][27]   ![survey-android][28]

**iOS**, **Android**

- Mobile Engagement also supports sending silent **Data Push** notifications. With these notifications, you can send data from your service (like the JSON data in the following example), which you can handle in your app and take some action. An example is how we're changing the price of an item selectively by using Data Push notifications.

	![notification-data-push][33]

	![data-push-windows][23]

	![data-push-ios][24]  ![data-push-android][25]

**iOS**, **Android**

> [AZURE.NOTE] You can view detailed step-by-step instructions for any of these notifications by clicking **Click here for instructions on how to send these notifications from Mobile Engagement platform** on any sample notification screen.


[1]: ./media/mobile-engagement-demo-apps/home-windows.png
[2]: ./media/mobile-engagement-demo-apps/home-ios.png
[3]: ./media/mobile-engagement-demo-apps/home-android.png
[4]: ./media/mobile-engagement-demo-apps/menu-windows.png
[5]: ./media/mobile-engagement-demo-apps/menu-ios.png
[6]: ./media/mobile-engagement-demo-apps/menu-android.png
[7]: ./media/mobile-engagement-demo-apps/device-id-windows.png
[8]: ./media/mobile-engagement-demo-apps/device-id-ios.png
[9]: ./media/mobile-engagement-demo-apps/device-id-android.png
[10]: ./media/mobile-engagement-demo-apps/out-of-app-windows.png
[11]: ./media/mobile-engagement-demo-apps/out-of-app-ios.png
[12]: ./media/mobile-engagement-demo-apps/out-of-app-android.png
[13]: ./media/mobile-engagement-demo-apps/out-of-app-display-windows.png
[14]: ./media/mobile-engagement-demo-apps/out-of-app-display-ios.png
[15]: ./media/mobile-engagement-demo-apps/out-of-app-display-android.png
[16]: ./media/mobile-engagement-demo-apps/in-app-windows.png
[17]: ./media/mobile-engagement-demo-apps/in-app-ios.png
[18]: ./media/mobile-engagement-demo-apps/in-app-android.png
[19]: ./media/mobile-engagement-demo-apps/pop-up-ios.png
[20]: ./media/mobile-engagement-demo-apps/pop-up-android.png
[21]: ./media/mobile-engagement-demo-apps/interstitial-ios.png
[22]: ./media/mobile-engagement-demo-apps/interstitial-android.png
[23]: ./media/mobile-engagement-demo-apps/data-push-windows.png
[24]: ./media/mobile-engagement-demo-apps/data-push-ios.png
[25]: ./media/mobile-engagement-demo-apps/data-push-android.png
[26]: ./media/mobile-engagement-demo-apps/survey-windows.png
[27]: ./media/mobile-engagement-demo-apps/survey-ios.png
[28]: ./media/mobile-engagement-demo-apps/survey-android.png
[29]: ./media/mobile-engagement-demo-apps/out-of-app.png
[30]: ./media/mobile-engagement-demo-apps/in-app-interstitial.png
[31]: ./media/mobile-engagement-demo-apps/in-app-pop-up.png
[32]: ./media/mobile-engagement-demo-apps/notification-poll.png
[33]: ./media/mobile-engagement-demo-apps/notification-data-push.png
