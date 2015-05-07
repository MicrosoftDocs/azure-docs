<properties 
	pageTitle="Use Emoji emoticon within Push Notifications" 
	description="How to use Emoji emoticons within your push notifications"					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/06/2015" 
	ms.author="piyushjo" />

#Use Emoji emoticon within Push Notifications

You can include Emoji emoticons in you push notification. Currently, Azure Mobile Engagement only supports the 3 bytes Emoji emoticon set for in and out of app text notifications. 
Please follow the steps below:

1) First you need to find a 3 bytes Emoji emoticon library. You can find all Emoji emoticons you can use at the following [link](http://stackoverflow.com/questions/10153529/emoji-on-mysql-and-php-why-some-symbol-yes-other-not)

![1]

2) Go to the Reach tab on the the Azure Mobile Engagement portal.

3) Select the type of your push notification (Announcement, polls etc). For this example we choose an announcement push.

4) Specify the different fields of the notification until you reach the text of the notification. This is where you will add your Emoji Emoticon. You can choose to put it in the title, the message, or both.

![2]

5) Cut the Emoji emoticon you want to use from the previous link. Paste it directly in the title and/or message, at the place you chose. 

6) Complete the other fields for the notification and save it. 

7) When you run a test or activate the announcement you will see a notification with the emoticon as specified.   

![3] ![4]

<!-- Images. -->
[1]: ./media/mobile-engagement-use-emoji-with-push/emoji.png
[2]: ./media/mobile-engagement-use-emoji-with-push/notification_input.png
[3]: ./media/mobile-engagement-use-emoji-with-push/notification_android.png
[4]: ./media/mobile-engagement-use-emoji-with-push/notification_ios.png