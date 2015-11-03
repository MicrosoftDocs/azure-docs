<properties
	pageTitle="Add and create a new App Service environment for your PowerApps | Microsoft Azure"
	description="IT Doc: Add and configure a new App Service Environment"
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

# Add and create a new App Service Environment
Create an app service environment to host your PowerApps APIs and connections. 

An App Service environment is an isolated and dedicated environment that securely runs all of your apps. Compute resources are per app service environment and are exclusively dedicated to running only your apps. When you sign-up for PowerApps, a dedicated App Service environment is used to host the APIs and connections used by your PowerApps apps. This app service environment is a "special" type of app service environment. Specifically: 

- You can use this app service environment for whatever you want. It's tied to your company, not the subscription.
- You configure APIs and connections to be used by your PowerApps. But, you can also add web apps, mobile apps, logic apps, and API apps to this same app service environment. 
- Billing is fixed and included with PowerApps.  
- Scale is automatically managed for you. You don't have to monitor the environment to determine if additional compute resources are needed.

The regular Azure app service environment has different features. See [Introduction to App Service Environment](../app-service-web/app-service-app-service-environment-intro.md) for those details.

#### Requirements to get started

- Azure company subscription
- The Subscription Administrator within your company [signed up your company for PowerApps](powerapps-portal-signup.md).
- You are signed into the Azure portal as the PowerApps Administrator ("owner" of PowerApps) or the Subscription Administrator.

## Create an app service environment

1. In the Azure portal, sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription. 
2. In the task bar on the left, select **PowerApps** to open your PowerApps blade. In this new blade, select the **Create an app service environment to get started** banner:  
![][1]  
3. In the new blade, enter the name, select your subscription, and select or create a new resource group:  
![][2]  
	Some pointers:
	- For the name, be specific. If different departments within your company will have their own app service environment, you can include that in the name. For example, you can name it *HRApps* or *ContosoITApps*. You can also name it by its purpose. For example, you can name it *FieldSalesGroupApps* or *GlobalSupportApps*. If your company will use one app service environment for all your apps, you can name it *ContosoApps*.
	- Resource groups acts as containers for items that are related. If your apps use a database server, then you can create your apps and your database server within the same resource group. All items within the resource group are deployed together, updated together, and even deleted together. See [Azure Resource Manager overview](../resource-group-overview.md) for more specific information.

4. Select **Add** to complete creating the app service environment. 

Remember, you can also add web apps and mobile apps to this app service environment. In fact, it's your environment to add anything you want. 

## Assign roles to your users
When you create the app service environment, you add users or groups to PowerApps, and you can remove users or groups from PowerApps. For example, you can add specific Administrator groups within your company to the *Owners* role; which allows them to grant users access to PowerApps and more.

Adding users and assigning roles is just like using [Role-based access control](../role-based-access-control-configure.md) within Azure. Some roles include:   

Role | Description
--- | ---
Contributor | Manages everything except grant access to users.
Reader | Can view everything, but can't make any changes.
Owner | Can manage everything and grant users access.

Using these roles, you can make userA an owner of the app service environment. You can make groupB a Contributor of the app service environment. You can remove userC from all roles. You can really get granular with these rights or add everyone as a Reader. It really depends on your business needs. 


## Summary and next steps
In this topic, you created a new App Service environment to host your PowerApps apps. 

Next, [add some connectors](powerapps-create-new-connector.md) to your app service environment and give users within your company access.

[1]: ./media/powerapps-create-new-app-service-environment/newase.png
[2]: ./media/powerapps-create-new-app-service-environment/aseproperties.png
