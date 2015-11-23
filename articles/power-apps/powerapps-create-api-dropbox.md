<properties
	pageTitle="Add Dropbox API in PowerApps| Azure"
	description="Add a new Dropbox API in your organization's App Service Environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="linhtranms"
	manager="dwerde"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/20/2015"
   ms.author="litran"/>

#Create a new Dropbox API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][4]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][5]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Dropbox** from the marketplace
![select dropbox api][6]

7. Select *Settings - Configure required settings*
![configure dropbox API settings][7]

8. Enter *App Key* and *App Secret* of your Dropbox application. If you don't already have one, see the section below titled "Register a Dropbox app for use with PowerApps". 
> Note the _redirect URL_ here before starting to register the Dropbox app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Dropbox API in your ASE.

On successful completion, a new API is added to your ASE.

##Register a Dropbox app for use with PowerApps

1. Launch [Dropbox][1] and sign in with your account.

2. Navigate to [Dropbox developer site] and click on _My Apps_
![Dropbox developer site][8]

3. Click on _Create app_ button in the top right corner.
![Dropbox create app][9]

4. In the **Create a new app on the Dropbox platform" page
	1. Select **Dropbox API** under _Choose API_
	2. Select **Full Dropbox – Access to all files and folders in a user's Dropbox.** under _Choose the type of access you need_
	3. Enter a name for your app
![Dropbox create app page 1][10]  

5. In the app settings page, 
	1. Set the **Redirect URL** under _OAuth 2_ section to the redirect URL obtained from adding a new Dropbox API in Azure Portal and click **Add**.
	2. Click on **Show** link to reveal the _app secret_
![Dropbox create app page 2][11]

Congratulations! You have now successfully created a Dropbox app that can be used in PowerApps.


<!--References-->
[1]: https://www.dropbox.com/login
[2]: https://www.dropbox.com/developers/apps/create
[3]: https://www.dropbox.com/developers/apps
[4]: ./media/powerapps-create-api-dropbox/browse-to-registered-apis.PNG
[5]: ./media/powerapps-create-api-dropbox/add-api.PNG
[6]: ./media/powerapps-create-api-dropbox/select-dropbox-api.PNG
[7]: ./media/powerapps-create-api-dropbox/configure-dropbox-api.PNG
[8]: ./media/powerapps-create-api-dropbox/dropbox-developer-site.PNG
[9]: ./media/powerapps-create-api-dropbox/dropbox-create-app.PNG
[10]: ./media/powerapps-create-api-dropbox/dropbox-create-app-page1.PNG
[11]: ./media/powerapps-create-api-dropbox/dropbox-create-app-page2.PNG
