
<properties
	pageTitle="Check your app usage in PowerApps | Microsoft Azure"
	description=""
	services="power-apps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="10/19/2015"
   ms.author="mandia"/>


# Manage the apps in your app service environment
Once you create your app service environment and add APIs and their connections, you're ready to start managing your settings. You can:

- See the different apps within your app service environment, including PowerApps apps, web apps, logics apps, and more.
- See all the APIs used by specific apps.
- See the number of requests made to your app service environment.
- View and manage user access to the apps within the app service environment. 
- Add (or remov) user and group permissions to the APIs and their connections. 
- Using role-based access control (RBAC).

Remember, your app service environment is yours to add other apps, including web apps and logic apps. You can then open PowerApps to see and manage these apps.


## Manage your PowerApps and other App Service apps
PowerApps is enabled and some PowerApps, logic, mobile, and web apps are deployed to your subscription. Now, time to manage these apps.

In PowerApps in the Azure portal, you can see the apps within your app service environment and you can see all the APIs used within these apps. For example, you can select **Web apps** to see all your web apps, and also see the APIs used within these web apps. 

In the following example, the PowerApps blade shows you how many logic apps, web apps, and so on are in your subscription:  
![][9]  

Select **Logic apps**. In this new blade, all the logic apps are listed, the app status is shown, and it lists which API apps are used within the logic app:  
![][10]   

You can also select a specific app to view more information about that app. In the following example, the **Twitter daily** PowerApps app is selected. In its blade, you can see the APIs used within the app, you can see which users and groups have permissions to the app, you can delete the app, and also view more details:  
![][11]  


## Track requests made to your app service environment
1. In the Azure portal, open **PowerApps**.
2. Select **Settings** and select **App Service environment**:  
![][6]
3. Look at **Requests today**:  
![][7]  

**Add red note in slide 39**

Currently, there is no API connection-level tracking available. 

## Delete your PowerApps apps
When you publish a PowerApps app to your app service environment, you can also delete it. To delete your app, open **PowerApps**, select your app, and then select **Delete**.  


## Review the security options
Different security methods are used, depending on what you're doing. Here's what you need to know:

- **Subscription administrator**: These administrators control billing and are responsible for signing up your company for PowerApps. Only Subscription Administrators can enable PowerApps within your company's Azure subscription. 
- **Runtime permissions**: *Can use* and *Can use and edit* are the runtime user permissions available. When you add an API and create its connection within PowerApps, you grant users and groups these specific permissions:  
![][3]  
- **Role-based access control** (RBAC): Many Azure offerings use role-based access control to determine who can do what. In PowerApps, RBAC is used in a couple of places:  
	- When you create the app service environment, you add users or groups to PowerApps, and you can remove users or groups from PowerApps. For example, you can add specific Administrator groups within your company to the *Owners* role; which allows them to grant users access to PowerApps and more.
	- When you add users to your existing apps in the app service environment, you can choose the role for these users.  	
	
		In the following example, the *Twitter daily* app is open. Select **Users**:  
	![][12]  
	In Users, you can select **Add User** and choose the role for that user or group. Or, choose an existing user and change his or her role. When finished, your user list and their roles may look similar to the following:  
	![][2]  
	
		Adding users and assigning roles is just like using [Role-based access control](../role-based-access-control-configure.md) within Azure. 

		Using these roles, you can make userA an owner of the **Twitter daily** app and a Reader of the **Link forms** app. You can make userB owner of all PowerApps app. You can remove userC from all roles. You can really get granular with these rights or add everyone as a Reader. It really depends on your business needs. 


## Summary and next steps
In this topic, you read about the different options to manage your PowerApps and the security methods implemented within PowerApps. 

Now that your Azure portal experience is configured, let's start creating your PowerApps apps. These are good starters:

**INSERT LINKS TO GETTING STARTED TOPICS ON POWERAPPS.COM**



[5]: ./media/powerapps-manage-monitor-usage/addadmin.png


[2]: ./media/powerapps-manage-monitor-usage/adduser.png
[3]: ./media/powerapps-manage-monitor-usage/selectpermission.png
[6]: ./media/powerapps-manage-monitor-usage/settingsase.png
[7]: ./media/powerapps-manage-monitor-usage/requests.png
[9]: ./media/powerapps-manage-monitor-usage/allapps.png
[10]: ./media/powerapps-manage-monitor-usage/alllogicapps.png
[11]: ./media/powerapps-manage-monitor-usage/twitterdailyapp.png
[12]: ./media/powerapps-manage-monitor-usage/twitterdailyusers.png



## Add administrators to PowerApps - Move to sign-up topic
1. In the Azure portal, open **PowerApps**.
2. Select **Add admin**:  
![][5]  

When you add Administrators to PowerApps, the users and groups you add as Admins can:

- Create connectors and connections.
- Make changes to the PowerApps settings, including the app service environment.
- Add other users and groups and give them roles and permissions to connectors and the app service environment. 
- Cannot change the billing.
- **WHAT ELSE CAN THEY DO? WHAT ELSE CAN THEY NOT DO?**