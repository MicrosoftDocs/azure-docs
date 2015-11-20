<properties
	pageTitle="Add Google Drive API in PowerAps | Azure"
	description="Add a new Google Drive API in your organization's App Service Environment"
	services="powerapps"
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
   ms.date="11/19/2015"
   ms.author="litran"/>

#Create a new Dropbox API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Dropbox** from the marketplace
![select google drive api][3]

7. Select *Settings - Configure required settings*
![configure google drive API settings][4]

8. Enter *App Key* and *App Secret* of your Dropbox application. If you don't already have one, see the section below titled "Register a Google Drive app for use with PowerApps". 
> Note the _redirect URL_ here before starting to register the Dropbox app

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Dropbox API in your ASE.

On successful completion, a new API is added to your ASE.

##Register a Google Drive app for use with PowerApps

1. Login to [Google Developers Console][5]
![Google developers console][6]

2. Select **Create an empty project**

3. Provide a name for your application, agree to the terms and conditions, and click on **Create**
![create new google drive project][7]

4. On successful creation of the new project, click on **Use Google APIs**
![Use google apis][8]

5. In the overview page, click on **Drive API**
![Google Drive API overview][9]

6. Click on **Enable API**
![Enable Google Drive API][10]

7. On enabling the Drive API, click on **Credentials** and select **OAuth 2.0 Client ID**
![Add credentials][12]

8. Click on **Configure consent screen**

9. In the _OAuth consent screen_ tab, enter a **Product Name** and click on **Save**
![Configure consent screen][13]

10. In the create client id page,
	1. Select **Web application** under _Application type_
	2. Provide a name for the client
	3. Provide the redirect URL obtained from Azure portal as one of the authorized redirect URLs
	4. Click on **Create**
![Create client id][14] 

11. On successful completion, you will be shown client id and client secret of the registered application.

Congratulations! You have now successfully created a Google Drive app that can be used in PowerApps.

<!--References-->
[1]: ./media/powerapps-create-api-googledrive/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-googledrive/add-api.PNG
[3]: ./media/powerapps-create-api-googledrive/select-googledrive-api.PNG
[4]: ./media/powerapps-create-api-googledrive/configure-googledrive-api.PNG
[5]: https://console.developers.google.com/
[6]: ./media/powerapps-create-api-googledrive/google-developers-console.PNG
[7]: ./media/powerapps-create-api-googledrive/googledrive-create-project.PNG
[8]: ./media/powerapps-create-api-googledrive/use-google-apis.PNG
[9]: ./media/powerapps-create-api-googledrive/googledrive-api-overview.PNG
[10]: ./media/powerapps-create-api-googledrive/enable-googledrive-api.PNG
[11]: ./media/powerapps-create-api-googledrive/googledrive-api-credentials.PNG
[12]: ./media/powerapps-create-api-googledrive/googledrive-api-credentials-add.PNG
[13]: ./media/powerapps-create-api-googledrive/configure-consent-screen.PNG
[14]: ./media/powerapps-create-api-googledrive/create-client-id.PNG