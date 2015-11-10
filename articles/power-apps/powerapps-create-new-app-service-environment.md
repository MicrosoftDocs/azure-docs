<properties
	pageTitle="Create a new App Service environment for your PowerApps | Microsoft Azure"
	description="IT Pro: Add and configure a new App Service Environment or ASE in the Azure portal"
	services="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/05/2015"
   ms.author="litran"/>

# Add and create a new App Service Environment
Create an app service environment to host your PowerApps APIs and connections as well as Mobile apps, Web apps, API apps, Logic apps. 

An App Service environment is an isolated and dedicated environment that securely runs all of your apps. Compute resources are per app service environment and are exclusively dedicated to running only your apps. When you sign-up for PowerApps, a dedicated App Service environment is used to host the APIs and connections used by your PowerApps apps. This app service environment is a "special" type of app service environment. Specifically: 

- You can use this app service environment for whatever you want. It's tied to your company, not the subscription.
- You configure APIs and connections to be used by your PowerApps. But, you can also add web apps, mobile apps, logic apps, and API apps to this same app service environment. 
- Billing is fixed and included with PowerApps.  
- Scale is automatically managed for you. You don't have to monitor the environment to determine if additional compute resources are needed.

The regular Azure app service environment has different features. See [Introduction to App Service Environment](../app-service-web/app-service-app-service-environment-intro.md) for those details.

#### Requirements to get started

- Azure company subscription
- The Subscription Administrator within your company [signed up your company for PowerApps](powerapps-get-started-azure-portal.md).
- You are signed into the Azure portal as the PowerApps Administrator ("owner" of PowerApps) or the Subscription Administrator.

## Create an app service environment
> [AZURE.NOTE] The following steps are for Public Preview only. If you do not see the option to create the App Service Environment, it was already created for your tenant. You can just open the App Service Environment via Settings to view the details. 

1. In the Azure portal, sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription. 

2. Select **Browse All** in the task bar:  
![Browse for PowerApps][1]  

3. In the list, you can scroll to find PowerApps. You can also select **Resources**, and type in *powerapps*:
![Search for PowerApps in Resources][2]  

4. In the **PowerApps** blade, click **Create App Service Environment to get started** or select **App Service Environment** under *Settings*. 
![][3]

5. Next, enter the name, select the subscription you want to use, select or create a new resource group, select a Virtual network and then select **Add**:  
![][4]  
	Some pointers:
	- For the name, be specific. If different departments within your company will have their own app service environment, you can include that in the name. For example, you can name it *HRApps* or *ContosoITApps*. You can also name it by its purpose. For example, you can name it *FieldSalesGroupApps* or *GlobalSupportApps*. If your company will use one app service environment for all your apps, you can name it *ContosoApps*.
	- Resource groups acts as containers for items that are related. If your apps use a database server, then you can create your apps and your database server within the same resource group. All items within the resource group are deployed together, updated together, and even deleted together. See [Azure Resource Manager overview](../resource-group-overview.md) for more specific information. 

4. Select **Add** to complete creating the app service environment. 

Remember, you can also add web apps and mobile apps to this app service environment. In fact, it's your environment to add anything you want. 

## Add Administrator to manage App Service Environment
To get access to the App Service Environment and create APIs and connections on it, user needs to be added explicitly as Owner.

When you create the app service environment, you can add users or groups, and you can remove users or groups from PowerApps. For example, you can add specific Administrator groups within your company to the *Owners* role; which allows them to grant users access to the app service environment and more.

1. Select the App Service Environment you just created
2. Select on the RBAC icon to manage permission
![][5]
3. Select **Add**
4. Select role **Owner**
5. Select users or groups you want to add to manage this App Service Environment
6. Select **OK** to add

Adding users and assigning roles is just like using [Role-based access control](../role-based-access-control-configure.md) within Azure. Some roles include:   

Role | Description
--- | ---
Contributor | Manages everything except grant access to users.
Reader | Can view everything, but can't make any changes.
Owner | Can manage everything and grant users access.

Using these roles, you can make userA an owner of the app service environment. You can make groupB a Contributor of the app service environment. You can remove userC from all roles. You can really get granular with these rights or add everyone as a Reader. It really depends on your business needs. 

## Summary and next steps
In this topic, you created a new App Service environment to host your PowerApps apps. 

Next, [add some APIs](powerapps-create-new-connector.md) to your app service environment and give users within your company access.

[1]: ./media/powerapps-create-new-app-service-environment/browseall.png
[2]: ./media/powerapps-create-new-app-service-environment/allresources.png
[3]: ./media/powerapps-create-new-app-service-environment/createase.png
[4]: ./media/powerapps-create-new-app-service-environment/aseproperties.png
[5]: ./media/powerapps-create-new-app-service-environment/addaseowner.png


