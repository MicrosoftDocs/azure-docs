<properties
	pageTitle="Azure Mobile Engagement Demo App"
	description="Describes where to download, how to use and find benefits using Azure Mobile Engagement Demo app"
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

# Azure Mobile Engagement Demo App

We have published an Azure Mobile Engagement demo app for **iOS**, **Android** and **Windows** platforms to help you to find useful resources and learn more about Azure Mobile Engagement. 

The app helps you to:

1. Easily find useful links to Azure Mobile Engagement specific resources like videos, documentation, support forum, where to go to raise feature requests etc. 
2. Experience sample notifications supported by Azure Mobile Engagement to get ideas for your own mobile applications. 
3. Provides you a reference implementation that you can use to study how to implement Mobile Engagement into your own app to: 

	- collect Analytics data 
	- implement advanced notification scenarios of types such as *Full screen Interstitial* or *Pop-up*
	- implement Surveys/Polls
	- implement silent push/data push scenarios   

## App installation
This apps is available in the respective apps stores:

1. **Windows Universal Demo App**

	- [Download link at Windows App Store](https://www.microsoft.com/en-us/store/apps/azure-mobile-engagement/9nblggh4qmh2) 
	- App was developed as Windows 10 Universal App and the source code is available on [Github](https://github.com/Azure/azure-mobile-engagement-app-ios)

2. **iOS Demo App** 

	- [Download link at Apple Store](https://itunes.apple.com/us/app/azure%20mobile%20engagement/id1105090090) 
	- App was developed in iOS Swift and the source code is available on [Github](https://github.com/Azure/azure-mobile-engagement-app-ios)

3. **Android Demo App** 

	- [Download link at Google Play Store](https://play.google.com/store/apps/details?id=com.microsoft.azure.engagement)
	- Source code is available on [Github](https://github.com/Azure/azure-mobile-engagement-app-android)

![][1]

![][2]
![][3]


## Usage

You can use these apps in the following ways:

**1) Download the apps on your device from the application store links provided above.** 

>[AZURE.IMPORTANT] You don't need any Azure account or the need to connect the app to any backend. The app will work independently. 

- Once you have the app on your device then you can go through the links in the left side menu to find all the useful resources about Azure Mobile Engagement. 
- We have also added our [service's RSS feed](https://aka.ms/azmerssfeed) right into this application so you are always updated about the latest product updates.
- You can also go through the sample notification scenarios to experience what type of notifications are supported by Azure Mobile Engagement for each platforms. These notifications can be experienced locally i.e. you can click on the buttons on the screens to show you the notifications experience which is identical to when you will send the notifications from the Azure Mobile Engagement platform. 

![][4]
    
![][5]
![][6]

**2) Download the source code from the Github links provided above.** 

- Once you have downloaded the source code, open it in the respective Development environment so XCode for iOS, Android Studio for Android and Visual Studio for Windows. 
- You should next follow our [Basic SDK integration steps](mobile-engagement-windows-store-dotnet-get-started.md) so that you are able to connect this app to its own Mobile Engagement backend instance. 
	- You will need to configure a connection string in the app.  
	- You will also need to configure the push notification platform for your app. 
- You will notice that this app itself is instrumented with Azure Mobile Engagement and therefore as you open the app after connecting it to the backend, you will be able to see the user session, activities, events etc on the Monitor tab. 
- You will also be able to send notifications to this app from your own Mobile Engagement instance instead of using local notifications. 
	- Here you can add your device as test device by using the **Get the Device ID** menu item in the app which will give you a device id that you then register as a test device with your platform backend instance. 

	![][7]
	    
	![][8]
	![][9]

## Key features of the Demo App

1. As mentioned above, with this app, you have all the key resources for Azure Mobile Engagement in your hand. You can go through the links in the left menu. 

2. Experience out-of-app notifications for each platform. These notifications can be delivered as **notification only** where clicking on the notification will simply open up a native screen of the application (using **deep linking**) or as **Web announcement** where you can deliver additional HTML content from the Mobile Engagement backend to be displayed when the notification is clicked. 

	![][29]

	
	- On iOS, you will have to close the app to see the out-of-app or system push notifications. You can look at the implementation here for adding **Action buttons** like the ones added to this out-of-app notification here for *Feedback* and *Share* so that the user can take action right from the notification itself. 
	    
	![][11] ![][14]
	
	
	- On Android, you will see the options supported by Android in the form of adding multi-line text (**Big Text**) or adding an image in the notification **Big Picture**) to the notification along with the **Action buttons** as supported by iOS. 
	
	![][12] ![][15]
	
	
	- On Windows 10, you can see how the notifications look like on the PC. This notification will also show up in the Windows 10 **Notification Center**. There is no support for adding **Action buttons** at the moment with Windows SDK. 
	
	![][10] ![][13] 

3. Experience default in-app notifications for each platform. This is a two-step experience where a **Notification** window is displayed first which when clicked, opens up a full screen **Announcement** as displayed below. The content of this announcement comes from your Mobile Engagement backend instance. The SDK has the templates for both notification and announcement which could be easily customized like in this demo app with the addition of our logo and coloring.  

	![][16]
	
	![][17] **iOS** ![][18] **Android** 

4. You can also use the **Category** feature of Azure Mobile Engagement to customize this default experience. In the demo app, we have demonstrated two common ways to change the experience of the notifications. Note that Category feature is not yet supported in Windows SDK yet. 

	**Full screen interstitial**
	
	![][30]

	![][21]	![][22]

	**Pop-up notification**

	![][31]
	
	![][19]	![][20]

5. Azure Mobile Engagement also supports a specialized type of in-app notification called **Polls** which allow you to send out quick surveys to your segmented app users. You can add questions and options for each questions like the following which will then get displayed as an in-app notification to the app user.   

	![][32]

	![][26]
	    
	![][27] **iOS** ![][28] **Android**

5. Azure Mobile Engagement also supports sending silent **Data Push** notification where you can send some data from your service like the JSON data in the following example which you can handle in your app and take some action. For example, how we are changing the price of an item selectively using the Data Push notification. 

	![][33]

	![][23]
	    
	![][24] **iOS** ![][25] **Android** 

> [AZURE.NOTE] Note that you can view detailed step-by-step instructions for any of these notification by clicking on *Click here for instructions on how to send these notifications from Mobile Engagement platform* on any sample notification screen. 


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
