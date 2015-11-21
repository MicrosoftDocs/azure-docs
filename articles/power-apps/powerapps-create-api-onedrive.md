<properties
	pageTitle="Add OneDrive API in PowerApps| Azure"
	description="Add a new OneDrive API in your organization's App Service Environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/20/2015"
   ms.author="rajram"/>

#Create a new OneDrive API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **OneDrive** from the marketplace
![select OneDrive api][3]

7. Select *Settings - Configure required settings*
![configure OneDrive API settings][4]

8. Enter *App Key* and *App Secret* of your OneDrive application. If you don't already have one, see the section below titled "Register a OneDrive app for use with PowerApps". 
	> Note the _redirect URL_ here before starting to register the OneDrive app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new OneDrive API in your ASE.

On successful completion, a new API is added to your ASE.

##Register a OneDrive app for use with PowerApps

1. Navigate to the [app creation page][5] in _Microsoft account developer center_ and sign in with your _Microsoft Account_

2. Enter your **Application name** and click on **I accept**
![OneDrive new app][6]

3. In the settings page,
	1. Click on **API Settings**
	2. Set the **Redirect URL** to the redirect URL obtained from adding a new OneDrive API in Azure Portal.
	3. Click on **Save**
![OneDrive app API settings][7]

Congratulations! You have now successfully created a OneDrive app that can be used in PowerApps.


<!--References-->
[1]: ./media/powerapps-create-api-onedrive/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-onedrive/add-api.PNG
[3]: ./media/powerapps-create-api-onedrive/select-onedrive-api.PNG
[4]: ./media/powerapps-create-api-onedrive/configure-onedrive-api.PNG
[5]: https://account.live.com/developers/applications/create
[6]: ./media/powerapps-create-api-onedrive/onedrive-new-app.PNG
[7]: ./media/powerapps-create-api-onedrive/onedrive-app-api-settings.PNG