<properties
	pageTitle="Sign-up or get started with PowerApps using your Azure subscription | Microsoft Azure"
	description="IT Pro: Sign up or login steps for Azure subscription administrator for enterprises in the Azure portal"
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
   ms.date="11/03/2015"
   ms.author="mandia"/>

# Sign up overview

PowerApps is a new offering available to companies with an Azure subscription. You can sign up for PowerApps and allow anyone within your company to create and use PowerApps within your company subscription.


#### Requirements to get started
- Have an Azure company subscription
- Must be a Subscription Administrator 
- The Subscription Administrator signs in to the Azure portal


## Sign up your company to use PowerApps
To sign-up your company, the **subscription administrator** submits a request to sign up for PowerApps. Use the following steps to sign-up:

1. In the Azure portal, sign in to your work subscription.
2. In the task bar on the left, select **PowerApps**:  
![][6]  
3. In **PowerApps**, select **Get an invitation**:  
![][7]  

An email opens that is sent to the PowerApps group. After you submit your request, the PowerApps team reviews the information you provided. There is no ETA on approval and each scenario is considered on a case-by-case basis. Until your request is reviewed, an **Access denied** message may display in PowerApps in the Azure portal.


If the request is approved, you can then:  

- Add users within your company to PowerApps and using [role-based access control](../role-based-access-control-configure.md), give these users specific roles to the apps.
- Create APIs and their connections to run within your dedicated app service environment (ASE).
- In addition to PowerApps apps, you can add additional apps to your app service environment, including web apps, mobile apps, and logic apps. 

In the following example, the Contoso company signed-up for PowerApps. In this new **PowerApps** blade, you can see a summary of the different type of apps created using this app service environment. In **Registered APIs**, you can see a summary of the Microsoft-created APIs (Microsoft managed) and see the Contoso-created APIs (Self managed):  
![][4]  

In **All apps**, you can select the different app types to see all those apps. For example, you can select **Logic apps** and see all those apps listed, including *Twitter daily* and *Link forms*. You can also see all the APIs used by your logic apps, including Bing, Facebook, Twitter, and more:  
![][8]  

## Add more administrators to PowerApps
Once you have access to PowerApps, you can give users and groups within your company administrative privileges. Steps include:

1. In the Azure portal, open **PowerApps**.
2. Select **Settings** and then select **Admins**:  
![][5]  
3. Add your users or groups.

When you add Administrators to PowerApps, the users and groups you add as Admins can:

- Create APIs and their connections.
- Make changes to the PowerApps settings, including the app service environment.
- Add other users and groups and give them roles and permissions to APIs and the app service environment. 
- Cannot change the billing.


## Next step
Now that you're company is signed up for PowerApps, [create an app service environment](powerapps-create-new-ase.md) to host your PowerApps apps.

[5]: ./media/powerapps-portal-signup/addadmin.png
[4]: ./media/powerapps-portal-signup/powerappsblade.png
[6]: ./media/powerapps-portal-signup/taskbar.png
[7]: ./media/powerapps-portal-signup/invitation.png
[8]: ./media/powerapps-portal-signup/alllogicapps.png