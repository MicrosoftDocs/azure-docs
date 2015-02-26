<properties 
   pageTitle="Azure Mobile Engagement User Interface - Home" 
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

## <a name="Home">Home</a>
 
The Home section of the UI contains the list of all of your applications in My Applications as well as access to the Demo Application for each platform for testing and the ability to grant others permissions to your applications. Anyone can access the home page of the UI by creating an account and can access the Demo Applications in Favorite Applications, but you need to grant others users need permission in order for them to have to access your custom applications in My Projects.
 
### My applications:
 
![Home1][2]

This quick overview of your applications and allows you to select which application you would like to open to view the detailed ribbon options. You can click the name of your application to return to the most recently visited ribbon location in your application, or click the gear icon to go directly to the "Settings" page of your application. You can search, filter, or sort the information displayed on the applications tables. You can also drag and drop the column headers to change the order. 
 
The overview of your applications includes:

- Total users (Total number of users)
- New users Trend (Evolution of new users over the last two weeks)
- Active users (Number of active users over the last 30 days)
- Active users trend (Evolution of active users over the last two weeks)
- Plan (Plan of the application and % of the data plan used)
 
You can also see a chart comparing your applications.

- Show comparison chart (Can be used to show the application data in chart form)
- Check boxes (add/remove this application to/from the comparison chart)
 
![Home2][3] 

The "new application" button allows you to add a new Windows, Windows Phone, iOS, Web, or Android App and will prompt you for the following information before you can create your app:

1. Choose a name for your application 
2. Android Only: Enter the package name of your application as defined in your AndroidManifest.xml file. Please double-check your package name. This is vital to your application for interacting with Azure Mobile Engagement.
3. Select the first day of the week

> Note: New applications are placeholders for applications you create with the SDK and don't actually have to exist yet before you can create them.
 
![Home3][4]

### Favorite applications:
 
![Home4][5]

The same usage information is available for a subset of your applications that you have added to a favorite applications list. The "manage applications" button allows you to select all the applications you want to see in the current project from a list of all the applications that you have permission to access.
 
### My projects:
 
![Home5][6] 

You can use projects to group your applications and give permissions to your applications. The New projects button allows you to create a new project by only entering a "name" and a "description" of your new project. Once a project is created you can click on the project name to edit the name and description of your product and to select all the applications you want to see in this project. You can also deleting this project, which will not destroy the applications it references. Nevertheless, you will lose access to all applications you do not own and that are not accessible from another project. So, be careful! 
You can also invite a user to your project based on their e-mail address. Users need to have already created an account in Azure Mobile Engagement before you can grant them permissions. 

**Roles include:** 

- Viewer: A Viewer is a User who can only view the applications associated to a Project. A Viewer can access analytics and monitor data and look at Reach results. A Viewer cannot change any information, nor manage Applications or Users. A Viewer cannot create or change Reach campaign status.
- Developer: A Developer is a User who can do everything a Viewer can do as well as manage Applications. A Developer can enable and disable applications, change applications' information (like package and signature) and create Reach campaigns. A Developer cannot manage Users. 
- Administrator: An Administrator is a User who can do everything a Developer can do as well as manage Users. An Administrator can invite users to join a project, can change user roles and can change project's information. Application level permissions can also be set in “settings”.
 
**See also:** 

-  [UI Documentation - Settings][Link 20]

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


 
