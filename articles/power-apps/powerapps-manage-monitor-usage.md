<properties
	pageTitle="Check your app usage in PowerApps Enterprise | Microsoft Azure"
	description="See all apps, APIs, users, app requests, and update permissions in the Azure portal"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="erikre"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/02/2016"
   ms.author="litran"/>


# Manage and secure your PowerApps

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
You create your app service environment, and add APIs and their connections. Now users in your organization can start consuming these APIs and connections. You can also manage all apps created in your organization. These options include:

- See the different apps within your app service environment, including PowerApps, web apps, logic apps, mobile apps, and more.
- See all the APIs used by specific apps.
- View and manage user access to the apps within the app service environment. 
- View and manage user access to the APIs and their connections. 

Remember, your app service environment is yours to add other apps, including web apps and logic apps. You can then open PowerApps Enterprise to see and manage these apps.


## Add PowerApps administrators
After PowerApps Enterprise is enabled and ready to be used, you can add administrators, and monitor other apps within your app service environment.

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. Select **Settings**.
3. In **Settings**, select **Admin**:  
![][1]  
4. In **Users**, select **Add**.
5. Select the **Owner** role:  
![][2]  

	> [AZURE.IMPORTANT] Make sure that you select **Owner** role if you are assigning someone as a PowerApps Admin. Other roles listed won't give users full access to manage PowerApps. 

6. Select your users or groups.
7. Select **OK** to complete the steps.

When you add Administrators to PowerApps Enterprise, the users and groups you add as administrators can:

- Add other users as PowerApps administrators.
- Manage all apps as well as their user access.
- Cannot change the billing.

> [AZURE.IMPORTANT] PowerApps Administrators cannot make changes to the App Service Environment until they are given the Owner role on the app service environment's resource group. To do this, see [Get started with PowerApps Enterprise](powerapps-get-started-azure-portal.md).

Once given the Owner role on the app service environment's resource group, the PowerApps administrators can also: 

- Create and configure APIs and their connections.
- Make changes to the PowerApps settings, including the app service environment.
- Add other users and groups and give them roles and permissions to the APIs,  thier connections, and the app service environment. 


## Manage your PowerApps and other types of apps
Once you enable PowerApps and your app service environment, you can add other apps, like web apps and logic apps to the same app service environment. After you do this, the apps are listed under *All apps* along with apps created in PowerApps. You can click on each type of app to browse through the apps. 

### View and manage your PowerApps

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. From the **All apps** tile, select **PowerApps**:  
![][3]  
3. Select an app to view details of the app, including:  
	- The APIs the app uses
	- Users and groups who have access to the app 
	- The app's analytics (coming soon)

#### Add an app

You cannot add an app through the Azure portal. Currently, go to the [PowerApps portal](http://go.microsoft.com/fwlink/p/?LinkId=715583).

#### Delete your apps created in PowerApps
As a PowerApps Admin, you can delete any app, including apps created in PowerApps and other types of apps in your app service environment. To delete your app, select the **All apps** tile, select your app, and then select **Delete**:  
![][4]


#### Give users or groups access to use an app
As a PowerApps admin, you can add or remove users and groups to PowerApps.

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. In the **All apps** tile, select **PowerApps**:  
![][3]  
3. Select an app, such as **Service Desk**. 
4. In **Settings**, select **App user access**:  
![][5]  
5. Select **Add** to add a new user or group. 
6. Select a role:  
	- Can Edit
	- Can View
7. Select the users or groups.
8. Select **OK** to complete the steps.

### View and manage your Logic apps

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. In the **All apps** tile, select **Logic apps**:  
![][8]  
3. Select a logic app to view details of the app. Make sure you select the correction subscription for PowerApps to  list the correct logic apps:  
![][7]  

	> [AZURE.IMPORTANT] At public preview, you may see some inconsistency in the count of logic apps in the browsing blade vs. the count displayed on the main PowerApps blade. This is expected. The portal is displaying all logic apps across all hosting plans and not filtering the logic apps under the app service environment deployed for PowerApps. This behavior will be fixed in a future updates.

	**To learn more about Logic apps and how to manage them, see [these instructions](https://azure.microsoft.com/documentation/services/app-service/logic/).**

### View and manage your Web Apps

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. In the **All apps** tile, select **Web apps**:  
![][9]  

	**To learn more about web apps and how to manage them, see [these instructions](https://azure.microsoft.com/documentation/services/app-service/web/).**

### View and manage your Mobile Apps

1. In the [Azure portal](https://portal.azure.com/), open **PowerApps**.
2. In the **All apps** tile, select **Mobile apps**:  
![][10]  

	**To learn more about mobile apps and how to manage them, see [these instructions](https://azure.microsoft.com/documentation/services/app-service/mobile/).**


## Review the security options
Different security methods are used, depending on what you're doing. Here's what you need to know:

- **Subscription administrator**: These administrators control billing and are responsible for signing up your company for PowerApps Enterprise. Only Subscription Administrators can request to enable PowerApps within your company's Azure subscription. 

- **Runtime user access**: There are three different types of runtime user access: 
	- **App user access**: This permission controls if the user of the app *Can edit* the app or *Can view* the app.
	- **API user access**: This permissions controls the runtime access. If users have this permission, he or she can use the API in their app. Users either have permission or don't have permission to use the API at runtime. 
	- **Connection user access**: *Can view* and *Can edit* are the runtime user permissions available for a connection. When you add an API (or connection profile) and create its connection, you grant users and groups these specific permissions:  
		![][6]  

		For example, you can give the Sales group within your company *Can edit* permission to a connection of a SQL connector API. User with *Can edit* permission will be able to use the connection in their apps as well as edit the connection configuration. User with *Can view* permission will be able to use the connection in their apps but can't modify the connection configuration such as connection string. 

- **Role-based access control** (RBAC): Many Azure offerings use role-based access control to determine who can do what. In PowerApps, RBAC is used in a couple of places:  
	- When you first enter the PowerApps portal, you can add and manage users who should be administrators of the PowerApps. 
	- When you create the app service environment, you add users or groups to PowerApps, and you can remove users or groups from PowerApps. For example, you can add specific Administrator groups within your company to the *Owners* role; which allows them to create APIs and connections. These APIs and connections are then added to apps created in PowerApps.
	- When you add users to apps like Web apps, Logic apps, Mobile apps or Logic apps. You can choose the role for these users.  
		
		Adding users and assigning roles is just like using [Role-based access control](../role-based-access-control-configure.md) within Azure. Some roles include:   

		Role | Description
		--- | ---
		Contributor | Manages everything except grant access to users.
		Reader | Can view everything, but can't make any changes.
		Owner | Can manage everything and grant users access.

Using these roles, you can grant userA **Can View** permission to a Twitter daily app and userB **Can Edit** permission to ShuttleBus app. You can grant userB access on all APIs. You can really get granular with these rights or add everyone with a specific role. It really depends on your business needs. 


## Summary and next steps
In this topic, you read about the different options to manage your PowerApps and the security methods implemented within PowerApps. 

Now that your Azure portal experience is configured, let's start creating your apps. These are good starters:

- [Create an app from a template in PowerApps](http://go.microsoft.com/fwlink/p/?LinkId=715536) 
- [Create an app from data in PowerApps](http://go.microsoft.com/fwlink/?LinkId=715539) 
- [Create an app from scratch in PowerApps](http://go.microsoft.com/fwlink/p/?LinkId=715538)
-->

[1]: ./media/powerapps-manage-monitor-usage/addadmin.png
[2]: ./media/powerapps-manage-monitor-usage/selectrole.png
[3]: ./media/powerapps-manage-monitor-usage/PowerApps.png
[4]: ./media/powerapps-manage-monitor-usage/deleteapp.png
[5]: ./media/powerapps-manage-monitor-usage/appuseraccess.png
[6]: ./media/powerapps-manage-monitor-usage/selectpermission.png
[7]: ./media/powerapps-manage-monitor-usage/alllogicapps.png
[8]: ./media/powerapps-manage-monitor-usage/logicapps.png
[9]: ./media/powerapps-manage-monitor-usage/webapps.png
[10]: ./media/powerapps-manage-monitor-usage/mobileapps.png



