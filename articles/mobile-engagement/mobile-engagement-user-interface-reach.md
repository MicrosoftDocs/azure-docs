<properties 
   pageTitle="Azure Mobile Engagement User Interface - Reach" 
   description="Learn how to reach out to the users of your application with push notifications using Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="" 
   authors="piyushjo" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="mobile" 
   ms.date="03/08/2016"
   ms.author="piyushjo"/>


# How to reach out to the users of your application with push notifications

This article describes the **REACH** tab of the **Mobile Engagement** portal. You use the **Mobile Engagement** portal to monitor and manage your mobile apps. Note that to start using the portal you first need to create an **Azure Mobile Engagement** account. For more information, see [Create an Azure Mobile Engagement account](mobile-engagement-create.md).

The Reach section of the UI is the Push campaign management tool where you can create/edit/activate/finish/monitor and get statistics on Push notification campaigns and features that can also be accessed via the Reach API (and some elements of the low level Push API). Remember that whether you are using the APIs or the UI, you will need to integrate both Azure Mobile Engagement and Reach into your application for each platform with the SDK before you can use Reach campaigns.

>[AZURE.NOTE] Many sections of the **Mobile Engagement** portal UI contain the **SHOW HELP** button. Press this button to get more contextual information about a section.

## Four types of Push notifications
1.    Announcements - allow you to send advertising messages to users that redirect them to another location inside your app or to send them to a webpage or store outside of your app. 
2.    Polls - allow you to gather information from end users by asking them questions.
3.    Data Pushes - allow you to send a binary or base64 data file. The information contained in a data push is sent to your application to modify your users' current experience in your app. Your application needs to be able to process the data in a data push.

## Campaign Details

You can edit, clone, delete, or activate campaigns that have not been activated yet by hovering over their names or you can click to open them. You can clone campaigns that have already been activated by hovering over their names or you can click to open them. However, you can't change a campaign once it has been activated.
 
![Reach1][18]

## Reach Feedback

Click on **Statistics** to see the details of a Reach campaign. The **Simple** view provides a visual representation in the form of a column bar graph about what happened after a campaign was activated. The **Advanced** view provides more granular details about the push campaign. These details will not be available if you are sending a test campaign i.e. a push sent to a test device. 
Here is how you should interpret these details:

1. **Pushed** - This specifies the number of messages pushed to the devices. This number will depend on the target audience you specified while creating the push campaign. If you do not specify any target audience, then this push will be sent out to all the registered devices. Like all other push services, we do not push the notifications directly to the devices but instead push them to the respective platform specific Push Notification Services (PNS - APNS/GCM/WNS) so that they can deliver the notifications to the devices. 

2.	**Delivered** - This specifies the number of messages which are successfully delivered by the PNS to the device and acknowledged as received by Mobile Engagement SDK. 
		
	*Reasons for Delivered count being less than Pushed count:*
	
	1. If the user has uninstalled the app from the device but the PNS doesn't know about it at the time we send the push to the PNS then the message will be dropped.
	2. If the device has the app but the devices themselves were offline for long periods of time, then the PNS will fail to deliver the message to the device. 
	3. If the message does get delivered to the device but the Mobile Engagement SDK in the app doesn’t recognize the content of the message, then it drops that message. This could happen if the customization of the notification in the app generates an exception which we catch in the SDK and drop the message. This could also occur if the app on the device is using a version of the Mobile Engagement SDK which is not able to understand the newer version of the push message sent from the platform but this is only when the app was upgraded after the notification was dispatched from the service platform. The **Advanced** tab will tell how many messages were dropped. 
	4. On iOS devices, messages sometimes do not get delivered if either the device is on low battery or if the app is consuming significant amount of power when processing remote notifications. This is a limitation of the iOS devices.   

3.	**Displayed** - This specifies the number of messages which are successfully shown to the app user on the device in the form of a system push/out-of-app notification in the notification center or an in-app notification within the mobile app.  The **Advanced** tab will tell you how many were system notifications and how many were in-app notifications. 
	
	*Reasons for Displayed count being less than Delivered count (waiting to be displayed)*
	
	1. If the notification campaign had an end date on it then it is possible that the notification was delivered but when the time came to open and display it to the app user, it was already expired so it was never displayed.   
	2. If the notification is an in-app notification then the notification is only displayed when the app user opens the app. In cases where the app user hasn't opened the app, the SDK will report that the notification was delivered but not yet displayed until the app is opened. 
	2. If the notification is an in-app notification and configured to be shown on a specific activity/screen then also the notification will be reported as delivered but not yet delivered until the user opens the app on a specific screen. 
	
4.	**User Interactions** - This specifies the number of messages which the app user has interacted with and will include the messages which are either actioned or exited. 

	- *The app user can action a notification in either of the following ways:*
			
		1. If the notification is a system/out-of-app notification or an in-app notification sent as notification-only then the app user clicks on the notification.
		2. If the notification is an in-app notification with a text or web-view or polls then the app user clicks on the Action button in the notification.
		3. If the notification is an in-app notification with a web-view then the app user clicks on a URL in the web view [Android Only]
	
	- *The app user can exit a notification in either of the following ways:*
	
		1. Clicking the close button on the notification directly. 
		2. Swiping away or deleting the notification. 
		3. In-app notifications with text/web content and polls are typically displayed to the app user in a two-step process. They see a notification first and when they click on it, they see the subsequent text/web/poll content. The app user can exit a notification in either of these steps and the details in the Advanced view captures this. 

5.	**Actioned** - This specifies the number of messages which were explicitly actioned by the app user. This is the most interesting number as this tells how many app users were interested by the message you pushed out in the notification. 
 
> [AZURE.NOTE] On iOS & Windows platforms, if the user has the app open and the campaign was an "AnyTime" campaign then it is possible that both out of app and in-app notifications are displayed at the same time. This may cause a Displayed count higher than the Delivered. If the user interacts or actions the notification, then even the User Interactions/Actioned count could be greater than Delivered. 


![Reach2][19]

## See also

- [Concepts][Link 6]
- [Troubleshooting Guide Service][Link 24]

<!--Image references-->
[1]: ./media/mobile-engagement-user-interface-navigation/navigation1.png
[2]: ./media/mobile-engagement-user-interface-home/home1.png
[3]: ./media/mobile-engagement-user-interface-home/home2.png
[4]: ./media/mobile-engagement-user-interface-home/home3.png
[5]: ./media/mobile-engagement-user-interface-home/home4.png
[6]: ./media/mobile-engagement-user-interface-home/home5.png
[7]: ./media/mobile-engagement-user-interface-my-account/myaccount1.png
[8]: ./media/mobile-engagement-user-interface-my-account/myaccount2.png
[9]: ./media/mobile-engagement-user-interface-my-account/myaccount3.png
[10]: ./media/mobile-engagement-user-interface-analytics/analytics1.png
[11]: ./media/mobile-engagement-user-interface-analytics/analytics2.png
[12]: ./media/mobile-engagement-user-interface-analytics/analytics3.png
[13]: ./media/mobile-engagement-user-interface-analytics/analytics4.png
[14]: ./media/mobile-engagement-user-interface-monitor/monitor1.png
[15]: ./media/mobile-engagement-user-interface-monitor/monitor2.png
[16]: ./media/mobile-engagement-user-interface-monitor/monitor3.png
[17]: ./media/mobile-engagement-user-interface-monitor/monitor4.png
[18]: ./media/mobile-engagement-user-interface-reach/reach1.png
[19]: ./media/mobile-engagement-user-interface-reach/reach2.png
[20]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign1.png
[21]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign2.png
[22]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign3.png
[23]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign4.png
[24]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign5.png
[25]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign6.png
[26]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign7.png
[27]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign8.png
[28]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign9.png
[29]: ./media/mobile-engagement-user-interface-reach-criterion/Reach-Criterion1.png
[30]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content1.png
[31]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content2.png
[32]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content3.png
[33]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content4.png
[34]: ./media/mobile-engagement-user-interface-dashboard/dashboard1.png
[35]: ./media/mobile-engagement-user-interface-segments/segments1.png
[36]: ./media/mobile-engagement-user-interface-segments/segments2.png
[37]: ./media/mobile-engagement-user-interface-segments/segments3.png
[38]: ./media/mobile-engagement-user-interface-segments/segments4.png
[39]: ./media/mobile-engagement-user-interface-segments/segments5.png
[40]: ./media/mobile-engagement-user-interface-segments/segments6.png
[41]: ./media/mobile-engagement-user-interface-segments/segments7.png
[42]: ./media/mobile-engagement-user-interface-segments/segments8.png
[43]: ./media/mobile-engagement-user-interface-segments/segments9.png
[44]: ./media/mobile-engagement-user-interface-segments/segments10.png
[45]: ./media/mobile-engagement-user-interface-segments/segments11.png
[46]: ./media/mobile-engagement-user-interface-settings/settings1.png
[47]: ./media/mobile-engagement-user-interface-settings/settings2.png
[48]: ./media/mobile-engagement-user-interface-settings/settings3.png
[49]: ./media/mobile-engagement-user-interface-settings/settings4.png
[50]: ./media/mobile-engagement-user-interface-settings/settings5.png
[51]: ./media/mobile-engagement-user-interface-settings/settings6.png
[52]: ./media/mobile-engagement-user-interface-settings/settings7.png
[53]: ./media/mobile-engagement-user-interface-settings/settings8.png
[54]: ./media/mobile-engagement-user-interface-settings/settings9.png
[55]: ./media/mobile-engagement-user-interface-settings/settings10.png
[56]: ./media/mobile-engagement-user-interface-settings/settings11.png
[57]: ./media/mobile-engagement-user-interface-settings/settings12.png
[58]: ./media/mobile-engagement-user-interface-settings/settings13.png

<!--Link references-->
[Link 1]: mobile-engagement-user-interface.md
[Link 2]: mobile-engagement-troubleshooting-guide.md
[Link 3]: mobile-engagement-how-tos.md
[Link 4]: http://go.microsoft.com/fwlink/?LinkID=525553
[Link 5]: http://go.microsoft.com/fwlink/?LinkID=525554
[Link 6]: http://go.microsoft.com/fwlink/?LinkId=525555
[Link 7]: https://account.windowsazure.com/PreviewFeatures
[Link 8]: https://social.msdn.microsoft.com/Forums/azure/home?forum=azuremobileengagement
[Link 9]: http://azure.microsoft.com/services/mobile-engagement/
[Link 10]: http://azure.microsoft.com/documentation/services/mobile-engagement/
[Link 11]: http://azure.microsoft.com/pricing/details/mobile-engagement/
[Link 12]: mobile-engagement-user-interface-navigation.md
[Link 13]: mobile-engagement-user-interface-home.md
[Link 14]: mobile-engagement-user-interface-my-account.md
[Link 15]: mobile-engagement-user-interface-analytics.md
[Link 16]: mobile-engagement-user-interface-monitor.md
[Link 17]: mobile-engagement-user-interface-reach.md
[Link 18]: mobile-engagement-user-interface-segments.md
[Link 19]: mobile-engagement-user-interface-dashboard.md
[Link 20]: mobile-engagement-user-interface-settings.md
[Link 21]: mobile-engagement-troubleshooting-guide-analytics.md
[Link 22]: mobile-engagement-troubleshooting-guide-apis.md
[Link 23]: mobile-engagement-troubleshooting-guide-push-reach.md
[Link 24]: mobile-engagement-troubleshooting-guide-service.md
[Link 25]: mobile-engagement-troubleshooting-guide-sdk.md
[Link 26]: mobile-engagement-troubleshooting-guide-sr-info.md
[Link 27]: mobile-engagement-user-interface-reach-campaign.md
[Link 28]: mobile-engagement-user-interface-reach-criterion.md
[Link 29]: mobile-engagement-user-interface-reach-content.md
 
