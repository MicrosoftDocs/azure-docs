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
   ms.date="09/15/2015"
   ms.author="mandia"/>

# Add and create a new App Service Environment
Create an app service environment to host your PowerApps apps. 

An App Service environment is an isolated and dedicated environment that securely runs all of your apps. Compute resources are per App Service environment and are exclusively dedicated to running only your apps. When you sign-up for PowerApps, a dedicated App Service environment is used to host your PowerApps. The App Service environment used by PowerApps is a "special" type of app service environment. Specifically: 

- You can use this app service environment for whatever you want. It's tied to your company, not the subscription.
- You configure connectors and connections to be used by your PowerApps. But, you can also add web apps and mobile apps to this same app service environment. 
- Billing is fixed and included with PowerApps. For example, you sign-up for PowerApps. When you reach max capacity, Azure automatically scales your apps with no additional costs and no additional actions by you. 
- Scale is automatically managed for you. You don't have to monitor the environment to determine if additional compute resources are needed.

The regular Azure app service environment has different features. See [Introduction to App Service Environment](../app-service-web/app-service-app-service-environment-intro.md) for those details.

#### Requirements to get started

- Azure company subscription
- The Subscription Administrator within your company [signed up your company for PowerApps](powerapps-portal-signup.md).


## Create an app service environment

1. In the Azure portal, sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription. 
2. In the Azure startboard, select **Marketplace**:  
![][1]  
3. In the Everything blade, select **PowerApps**:  
![][2] 
4. In the **PowerApps** blade, select **Create**. 
5. In the next blade, you can buy licenses and create an App Service environment. In Licenses, select **Buy new**, and then select **Buy from Office**:  
![][3]  
6. Next, select **App Service environment**, enter the name, select your subscription, select or create a new resource group, and then select **Add**:  
![][4]  
	Some pointers:
	- For the name, be specific. If different departments within your company will have their own app service environment, you can include that in the name. For example, you can name it *HRApps* or *ContosoITApps*. You can also name it by its purpose. For example, you can name it *FieldSalesGroupApps* or *GlobalSupportApps*. If your company will use one app service environment for all your apps, you can name it *ContosoApps*.
	- Resource groups acts as containers for items that are related. If your apps use a database server, then you can create your apps and your database server within the same resource group. All items within the resource group are deployed together, updated together, and even deleted together. See [Azure Resource Manager overview](../resource-group-overview.md) for more specific information. 
7. When finished with licenses and creating the app service environment, select **Create** in the PowerApps blade:  
![][5]  

Remember, you can also add web apps and mobile apps to this app service environment. In fact, it's your environment to add anything you want. 


## Summary and next steps
In this topic, you created a new App Service environment to host your PowerApps apps. 

Next, [add some connectors](powerapps-create-new-connector.md) to your app service environment and give users within your company access.

[1]: ./media/powerapps-create-new-app-service-environment/marketplace.png
[2]: ./media/powerapps-create-new-app-service-environment/everything.png
[3]: ./media/powerapps-create-new-app-service-environment/buylicenses.png
[4]: ./media/powerapps-create-new-app-service-environment/aseproperties.png
[5]: ./media/powerapps-create-new-app-service-environment/createase.png

