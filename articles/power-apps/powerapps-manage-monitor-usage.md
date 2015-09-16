
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
   ms.date="09/15/2015"
   ms.author="mandia"/>


# Manage PowerApps apps and track your usage
Once you create your app service environment and add connectors and their connections, you're ready to start managing your settings. These options include:

- Adding (or removing) user and group permissions to the connectors and their connections. 
- Using role-based access control (RBAC).
- Track usage of your App Service environment.
- View and manage user access to PowerApps.


## Manage your PowerApps
After PowerApps is enabled and ready to be used, you can add administrators, monitor the requests made to your app service environment, and monitor other apps within your app service environment.

### Add administrators to PowerApps
1. In the Azure portal, open **PowerApps**.
2. Select **Add admin**:  
![][5]  

When you add Administrators to PowerApps, the users and groups you add as Admins can:

- Create connectors and connections.
- Make changes to the PowerApps settings, including the app service environment.
- Add other users and groups and give them roles and permissions to connectors and the app service environment. 
- Cannot change the billing.
- **WHAT ELSE CAN THEY DO? WHAT ELSE CAN THEY NOT DO?**

### Track usage of the app service environment
1. In the Azure portal, open **PowerApps**.
2. Select **Settings** and select **App Service environment**:  
![][6]
3. Look at **Requests today**:  
![][7]  

### Manage other apps
Your app service environment is yours. You can add other apps, like web apps and logic apps, to the same app service environment. When you do this, they are listed in PowerApps.

1. In the Azure portal, open **PowerApps**.
2. Select **App Service apps**:  
![][8]  

### Delete your PowerApps apps
When you publish a PowerApps app to your app service environment, you can also delete it. To delete your app, open **PowerApps**, select your app, and then select **Delete**.  


## Review the security options
Different security methods are used, depending on what you're doing. Here's what you need to know:

- **Subscription administrator**: These administrators control billing and are responsible for signing up your company for PowerApps. Only Subscription Administrators can enable PowerApps within your company's Azure subscription. 
- **Runtime permissions**: *Can use* and *Can use and edit* are the runtime user permissions available. When you add a connector (or connection profile) and create its connection within PowerApps, you grant users and groups these specific permissions:  
![][3]  
	For example, you can give the Sales group within your company *Can use and edit* permissions to a SQL connector. When the Sales group uses their PowerApps app with this SQL connector, they can insert rows (like add a new customer), update records (increase quantity ordered) , and other 'Edit' tasks (remove a product from a sales order). For those groups that report on this information, you can give them *Can use* permission to this SQL connector.
- **Role-based access control** (RBAC): Many Azure offerings use role-based access control to determine who can do what. In PowerApps, RBAC is used in a couple of places:  
	- When you create the app service environment, you add users or groups to PowerApps, and you can remove users or groups from PowerApps. For example, you can add specific Administrator groups within your company to the *Owners* role; which allows them to grant users access to PowerApps and more.
	- You publish a PowerApps app to the same app service environment that hosts all the connectors you added. You can add users to the PowerApps app and choose the role for these users.  	
	
		In the following example, all the **PowerApps apps** are listed, including the *Twitter daily* app:  
	![][4]  
	Select the *Twitter daily* app to open it. Select **Users**:  
	![][1]  
	In Users, you can select **Add User** and choose the role for that user or group. When finished, your user list and their roles may look similar to the following:  
	![][2]  
	
		Adding users and assigning roles is just like using [Role-based access control](../role-based-access-control-configure.md) within Azure. Some roles include:   

		Role | Description
--- | ---
Contributor | Manages everything except grant access to users.
Reader | Can view everything, but can't make any changes.
Owner | Can manage everything and grant users access.

		Using these roles, you can make userA an owner of the Twitter connector and a Reader of the Salesforce connector. You can make userB owner of all connectors. You can remove userC from all roles. You can really get granular with these rights or add everyone as a Reader. It really depends on your business needs. 


## Summary and next steps
In this topic, you read about the different options to manage your PowerApps and the security methods implemented within PowerApps. 


Now that your Azure portal experience is configured, let's start creating your PowerApps apps. These are good starters:

**INSERT LINKS TO GETTING STARTED TOPICS ON POWERAPPS.COM**

[1]: ./media/powerapps-manage-monitor-usage/users.png
[2]: ./media/powerapps-manage-monitor-usage/adduser.png
[3]: ./media/powerapps-manage-monitor-usage/selectpermission.png
[4]: ./media/powerapps-manage-monitor-usage/apps.png
[5]: ./media/powerapps-manage-monitor-usage/addadmin.png
[6]: ./media/powerapps-manage-monitor-usage/settingsase.png
[7]: ./media/powerapps-manage-monitor-usage/requests.png
[8]: ./media/powerapps-manage-monitor-usage/otherapps.png