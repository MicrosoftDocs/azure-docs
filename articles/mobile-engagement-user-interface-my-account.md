<properties 
   pageTitle="Azure Mobile Engagement User Interface - My Account" 
   description="User Interface Overview for Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="mobile" 
   authors="v-micada" 
   manager="mattgre" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="Java"
   ms.topic="article"
   ms.tgt_pltfrm="mobile"
   ms.workload="required" 
   ms.date="02/17/2015"
   ms.author="v-micada"/>

# Azure Mobile Engagement - User Interface

<div class="dev-center-tutorial-selector sublanding">
<a href="../mobile-engagement-user-interface-navigation" title="Navigation">Navigation</a>
<a href="../mobile-engagement-user-interface-home/" title="Home">Home</a>
<a href="../mobile-engagement-user-interface-my-account" title="My Account">My Account</a>
<a href="../mobile-engagement-user-interface-analytics" title="Analytics">Analytics</a>
<a href="../mobile-engagement-user-interface-monitor" title="Monitor">Monitor</a>
<a href="../mobile-engagement-user-interface-reach" title="Reach">Reach</a>
<a href="../mobile-engagement-user-interface-segments" title="Segments">Segments</a>
<a href="../mobile-engagement-user-interface-dashboard" title="Dashboard">Dashboard</a>
<a href="../mobile-engagement-user-interface-settings" title="Settings">Settings</a>
</div>

## <a name="MyAccount">My Account</a>
 
The My Account section of the UI is where you can view and change the settings associated with your account, including your Profile settings and test Device IDs. These settings contain items that can also be accessed via to the Device API.
 
![MyAccount1][7]  

### Profile:
You can view or change any of your account settings: Password, First Name, Last Name, Organization, Phone Number, Time Zone, or E-mail opt-in or opt-out of e-mail updates. You can also give another user permission to use your application based on their e-mail address from “home”.

**See also:** 

-  [UI Documentation - Home][Link 13]

![MyAccount2][8]  

### Devices:
You can view, add, or remove test Device ID's of the test devices that you can use to test your reach or push campaigns. Contextual instructions for how to find the Device ID of devices for each platform (iOS, Android, Windows Phone, etc.) are displayed when you "New Device". 
 
![MyAccount3][9]  
 
To use Push API or Device API you need to know your users' unique device identifier (the deviceid parameter). There is several ways to retrieve it:
 
1. From your backend, you can use the "Get" feature of the Device API to get the full list of device identifiers.
2. From your app, you can use the SDK to get it (on Android, call the getDeviceID() function of the Agent class, and on iOS, read the deviceid property of the Agent class)
3. From a Reach announcement, if the action URL associated with the announcement contains the {deviceid} pattern, it will be automatically replaced by the identifier of the device triggering the action.
http://<example>.com/registeruser?deviceid={deviceid}&otherparam=myparamdata 
will be replaced by:
http://<example>.com/registeruser?deviceid=XXXXXXXXXXXXXXXX&otherparam=myparamdata 
4. From a Reach web announcement, if the HTML code of the announcement contains the {deviceid} pattern, it will be automatically replaced by the identifier of the device displaying the web announcement.
Here is my device identifier: {deviceid}
will be replaced by:
Here is my device identifier: XXXXXXXXXXXXXXXX
5.  Open your application on your device and perform an Event in your app which has been tagged.
From "UI - your app - Monitor - Events - Details", find the Event you performed in the list.
Click to this event in the Monitor.
You should find out your Device ID in the list of the devices that have performed this event.
Then you can copy this Device ID and register it in the "UI - My Account - Devices - New Device - Select your device platform"
>(Be aware that when IDFA is disabled for iOS, then the Device ID may change over the time if you uninstall and re-install your app.)

<!--Image references-->
[1]: ./media/mobile-engagement-user-interface/navigation1.png
[2]: ./media/mobile-engagement-user-interface/home1.png
[3]: ./media/mobile-engagement-user-interface/home2.png
[4]: ./media/mobile-engagement-user-interface/home3.png
[5]: ./media/mobile-engagement-user-interface/home4.png
[6]: ./media/mobile-engagement-user-interface/home5.png
[7]: ./media/mobile-engagement-user-interface/myaccount1.png
[8]: ./media/mobile-engagement-user-interface/myaccount2.png
[9]: ./media/mobile-engagement-user-interface/myaccount3.png
[10]: ./media/mobile-engagement-user-interface/analytics1.png
[11]: ./media/mobile-engagement-user-interface/analytics2.png
[12]: ./media/mobile-engagement-user-interface/analytics3.png
[13]: ./media/mobile-engagement-user-interface/analytics4.png
[14]: ./media/mobile-engagement-user-interface/monitor1.png
[15]: ./media/mobile-engagement-user-interface/monitor2.png
[16]: ./media/mobile-engagement-user-interface/monitor3.png
[17]: ./media/mobile-engagement-user-interface/monitor4.png
[18]: ./media/mobile-engagement-user-interface/reach1.png
[19]: ./media/mobile-engagement-user-interface/reach2.png
[20]: ./media/mobile-engagement-user-interface/Reach-Campaign1.png
[21]: ./media/mobile-engagement-user-interface/Reach-Campaign2.png
[22]: ./media/mobile-engagement-user-interface/Reach-Campaign3.png
[23]: ./media/mobile-engagement-user-interface/Reach-Campaign4.png
[24]: ./media/mobile-engagement-user-interface/Reach-Campaign5.png
[25]: ./media/mobile-engagement-user-interface/Reach-Campaign6.png
[26]: ./media/mobile-engagement-user-interface/Reach-Campaign7.png
[27]: ./media/mobile-engagement-user-interface/Reach-Campaign8.png
[28]: ./media/mobile-engagement-user-interface/Reach-Campaign9.png
[29]: ./media/mobile-engagement-user-interface/Reach-Criterion1.png
[30]: ./media/mobile-engagement-user-interface/Reach-Content1.png
[31]: ./media/mobile-engagement-user-interface/Reach-Content2.png
[32]: ./media/mobile-engagement-user-interface/Reach-Content3.png
[33]: ./media/mobile-engagement-user-interface/Reach-Content4.png
[34]: ./media/mobile-engagement-user-interface/dashboard1.png
[35]: ./media/mobile-engagement-user-interface/segments1.png
[36]: ./media/mobile-engagement-user-interface/segments2.png
[37]: ./media/mobile-engagement-user-interface/segments3.png
[38]: ./media/mobile-engagement-user-interface/segments4.png
[39]: ./media/mobile-engagement-user-interface/segments5.png
[40]: ./media/mobile-engagement-user-interface/segments6.png
[41]: ./media/mobile-engagement-user-interface/segments7.png
[42]: ./media/mobile-engagement-user-interface/segments8.png
[43]: ./media/mobile-engagement-user-interface/segments9.png
[44]: ./media/mobile-engagement-user-interface/segments10.png
[45]: ./media/mobile-engagement-user-interface/segments11.png
[46]: ./media/mobile-engagement-user-interface/settings1.png
[47]: ./media/mobile-engagement-user-interface/settings2.png
[48]: ./media/mobile-engagement-user-interface/settings3.png
[49]: ./media/mobile-engagement-user-interface/settings4.png
[50]: ./media/mobile-engagement-user-interface/settings5.png
[51]: ./media/mobile-engagement-user-interface/settings6.png
[52]: ./media/mobile-engagement-user-interface/settings7.png
[53]: ./media/mobile-engagement-user-interface/settings8.png
[54]: ./media/mobile-engagement-user-interface/settings9.png
[55]: ./media/mobile-engagement-user-interface/settings10.png
[56]: ./media/mobile-engagement-user-interface/settings11.png
[57]: ./media/mobile-engagement-user-interface/settings12.png
[58]: ./media/mobile-engagement-user-interface/settings13.png

<!--Link references-->
[Link 1]: ../mobile-engagement-user-interface/
[Link 2]: ../mobile-engagement-troubleshooting-guide/
[Link 3]: ../mobile-engagement-how-tos/
[Link 4]: http://go.microsoft.com/fwlink/?LinkID=525553
[Link 5]: http://go.microsoft.com/fwlink/?LinkID=525554
[Link 6]: http://go.microsoft.com/fwlink/?LinkId=525555
[Link 7]: https://account.windowsazure.com/PreviewFeatures
[Link 8]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azuremobileengagement
[Link 9]: http://azure.microsoft.com/en-us/services/mobile-engagement/
[Link 10]: http://azure.microsoft.com/en-us/documentation/services/mobile-engagement/
[Link 11]: http://azure.microsoft.com/en-us/pricing/details/mobile-engagement/
[Link 12]: ../mobile-engagement-user-interface-navigation/
[Link 13]: ../mobile-engagement-user-interface-home/
[Link 14]: ../mobile-engagement-user-interface-my-account/
[Link 15]: ../mobile-engagement-user-interface-analytics/
[Link 16]: ../mobile-engagement-user-interface-monitor/
[Link 17]: ../mobile-engagement-user-interface-reach/
[Link 18]: ../mobile-engagement-user-interface-segments/
[Link 19]: ../mobile-engagement-user-interface-dashboard/
[Link 20]: ../mobile-engagement-user-interface-settings/
[Link 21]: ../mobile-engagement-troubleshooting-guide-analytics/
[Link 22]: ../mobile-engagement-troubleshooting-guide-apis/
[Link 23]: ../mobile-engagement-troubleshooting-guide-push-reach/
[Link 24]: ../mobile-engagement-troubleshooting-guide-service/
[Link 25]: ../mobile-engagement-troubleshooting-guide-sdk/
[Link 26]: ../mobile-engagement-troubleshooting-guide-sr-info/
[Link 27]: ../mobile-engagement-how-tos-first-push/
[Link 28]: ../mobile-engagement-how-tos-test-campaign/
[Link 29]: ../mobile-engagement-how-tos-personalize-push/
[Link 30]: ../mobile-engagement-how-tos-differentiate-push/
[Link 31]: ../mobile-engagement-how-tos-schedule-campaign/
[Link 32]: ../mobile-engagement-how-tos-text-view/
[Link 33]: ../mobile-engagement-how-tos-web-view/


 
