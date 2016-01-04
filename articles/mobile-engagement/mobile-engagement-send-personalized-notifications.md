<properties 
	pageTitle="Send personalized notification with Azure Mobile Engagement" 
	description="How to send personalized notifications by including user profile information in the notifications like their names"		
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="all" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/07/2015" 
	ms.author="piyushjo" />

#Personalize notifications by including user name

In your quest to make notifications more appealing to your app users, you should consider personalizing them. One powerful approach comprises of selectively using the app users names to address the notifications to make them more personal. A word of caution here - you should approach adding user names to the notifications carefully because if you overuse this strategy then it could come across as creepy for some app users. You should also ensure that you are letting the user opt in to provide these personal details to you with full consent in the mobile app before starting to use this. 

Technically, with Azure Mobile Engagement, you can accomplish personalizing the notifications by following the steps below in which we will use the scenario of including user name in the notifications. You will use the concept of App-Info or Tags whose values could either be passed by the SDKs integrated in the Mobile App or via APIs. These App-Infos or Tags could then be used:

1. for targeting notifications to specific users based on the values of the App-Info or 
2. as placeholders in the notifications which will be replaced with values specific to the device/user while sending notifications to that device. 

> [AZURE.IMPORTANT] Note that the speed of sending notifications will see a reduction because of this additional processing of replacing app-info values with each notifications. 

##Register App-Info in the Mobile Engagement Portal

1) You start with registering App Info or Tags in the Azure portal. Go to **Settings** -> **Tag (App-Info)** for this.  

![][1]	

2) Click on **New tag (app-info)** and provide the name as *user_name* and the type as *string* and click **Submit**. 

![][2]

3) You will finally see this app-info registered like the following:

![][3]

##Send App-Info from the client SDK

Here we are using the Windows Universal app example but equivalent methods exist for our other SDKs also. 

Assuming you have a method in the mobile app where you get the profile information from the user like their names probably after authenticating them, you will call `SendAppInfo` method here and populate the value of the `user_name` app info that you registered earlier into the Mobile Engagement service backend. 

    Dictionary<object, object> appInfo = new Dictionary<object, object>();
    appInfo.Add("user_name", str);
    EngagementAgent.Instance.SendAppInfo(appInfo); 

##Send personalized notifications

Now you are all set to send notifications using this **user_name**. 

1) Go to Mobile Engagement Portal on the **Reach** tab to create a notification and you can use this placeholder in the following format anywhere in the notification title or the body. 

![][4]	

> [AZURE.NOTE] Any users for which the user_name app info is not set, will not get any notification. If you run the notification campaign in test mode and if you do not have app-info set then we will send '?' character to replace the placeholder. 

2) When Mobile Engagement will select a device to send this notification then it will look at this app-info and replace the value in the placeholder.  
For example, if we have set `str = "Scott"` for a user than the device registration will get associated with the app info of **user_name = SCOTT** for this user and this user will see an out of app push notification in the following format. 

![][5]	

<!-- Images. -->
[1]: ./media/mobile-engagement-send-personalized-notifications/app-info.png
[2]: ./media/mobile-engagement-send-personalized-notifications/create-app-info.png
[3]: ./media/mobile-engagement-send-personalized-notifications/app-info-user-name.png
[4]: ./media/mobile-engagement-send-personalized-notifications/personal-notification.png
[5]: ./media/mobile-engagement-send-personalized-notifications/notification.png

