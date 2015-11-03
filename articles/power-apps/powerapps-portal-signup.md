<properties
	pageTitle="Sign-up or get started with PowerApps using your Azure subscription | Microsoft Azure"
	description="IT Doc: sign-up for Azure subscription administrator for enterprises"
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

# Sign-up overview
PowerApps is a new offering available to companies with an Azure subscription. You can sign-up for PowerApps and allow anyone within your company to create and use PowerApps within your company subscription. 


#### Requirements to get started

- Azure company subscription
- Subscription Administrator signs-in to the Azure portal


## Sign-up your company to use PowerApps 

> [AZURE.NOTE] The following steps require the subscription Administrator to sign-in to the Azure portal and submit a request. 

To sign-up your company, the subscription administrator submits a request for *@yourCompany.com* email accounts. Use the following steps to sign-up:

1. In the Azure portal, sign-in to your work subscription.
2. Select **Browse All** in the task bar:  
![Browse for PowerApps][1]  
3. In the list, you can scroll to find PowerApps. You can also select **Resources**, and type in *powerapps*:
![Search for PowerApps in Resources][2]  
4. Next, submit your request to sign-up for PowerApps:  
![Submit your request][3]  


Once approved, everyone with the *@yourCompany.com* email address potentially has access to PowerApps. Within PowerApps, you can:  

- Add users within your company and using [role-based access control](../role-based-access-control-configure.md), give these users specific roles to the PowerApps apps.
- Creating connectors [we now call this API that serves as connection provider to access user data] to run within your App Service environment (ASE).
- View performance metrics for your App Service environment. [this won't be available at Public Preview, user will only see the requests coming through to their dedicated ASE]
- Add additional apps to your ASE, including web apps and mobile apps. [User can create other apps on their dedicated ASE in additional to PowerApps such as web apps, mobile apps]
- See the PowerApps apps hosted [the PowerApps apps are not hosted on the ASE. The connections they use are hosted on the ASE] within the App Service environment and their respective "owners" [why is there " " on owners?].

In the following example, the Contoso company signed-up for PowerApps. In this new **PowerApps apps** blade, you can see all the apps created within this app service environment, including the *Audio notes* and *Link forms* apps. In **Connection providers**, you can see all the connectors used by your PowerApps apps, including Twitter and Youtube:  
![Sample company PowerApps blade][4]  


## Next step
Now that you're company is signed up for PowerApps, [create an app service environment](powerapps-create-new-ase.md) to host your PowerApps apps.

[1]: ./media/powerapps-portal-signup/browseall.png
[2]: ./media/powerapps-portal-signup/allresources.png
[3]: ./media/powerapps-portal-signup/signup.png
[4]: ./media/powerapps-portal-signup/powerappsblade.png

[We need to give user a clearer expectation of what will happen each step.]
