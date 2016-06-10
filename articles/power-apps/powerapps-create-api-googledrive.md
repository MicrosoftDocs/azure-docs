<properties
	pageTitle="Add the Google Drive API to PowerApps Enterprise | Microsoft Azure"
	description="Create or configure a new Google Drive API in your organization's app service environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
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

# Create a new Google Drive API in PowerApps Enterprise

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
Add the Google Drive API to your organization's (tenant) app service environment. 

## Create the API in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.
 
2. Select **Browse** in the task bar:  
![][15]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![][16]  

4. In **PowerApps**, select **Manage APIs**:  
![Browse to registered apis][1]

5. In **Manage APIs**, select **Add** to add the new API:  
![Add API][2]

6. Enter a descriptive **name** for your API.  
	
7. In **Source**, select **Available APIs** to select the pre-built APIs, and select **Google Drive**:  
![select google drive api][3]

8. Select **Settings - Configure required settings**:  
![configure google drive API settings][4]

9. Enter *App Key* and *App Secret* of your Google Drive application. If you don't have one, see the "Register a Google Drive app for use with PowerApps" section in this topic to create the key and secret values you need.  

	> [AZURE.IMPORTANT] Save the **redirect URL**. You may need this value later in this topic.

10. Select **OK** to complete the steps.

When finished, a new Google Drive API is added to your app service environment.


## Optional: Register a Google Drive app for use with PowerApps

If you don't have an existing Google Drive app with the key and secret values, then use the following steps to create the application, and get the values you need. 

1. Sign in to [Google Developers Console][5]:  
![Google developers console][6]

2. Select **Create an empty project**. 

3. Enter a name for your application, agree to the terms and conditions, and select **Create**:  
![create new google drive project][7]

4. On successful creation of the new project, select **Use Google APIs**:  
![Use google apis][8]

5. In the overview page, select **Drive API**:  
![Google Drive API overview][9]

6. Select **Enable API**:  
![Enable Google Drive API][10]

7. On enabling the Drive API, select **Credentials**, and select **OAuth 2.0 Client ID**:  
![Add credentials][12]

8. Select **Configure consent screen**.

9. In the **OAuth consent screen** tab, enter a **Product Name**, and select **Save**:  
![Configure consent screen][13]

10. In the create client id page:  

	1. In **Application type**, select **Web application**.  
	2.  Enter a name for the client.  
	3. Set the redirect URL to the redirect URL you received when you added the new Google Drive API in the Azure Portal (in this topic).  
	4. Select **Create**.  

	![Create client id][14] 

11. You are shown the client id and client secret of the registered application.

A new Google Drive app is created. You can use this app in your Google Drive API configuration in the Azure portal. 

## See the REST APIs

[Google Drive REST API](../connectors/connectors-create-api-googledrive.md) reference.

## Summary and next steps
In this topic, you added the Google Drive API to your PowersApps Enterprise. Next, give users access to the API so it can be added to their apps: 

[Add a connection and give users access](powerapps-manage-api-connection-user-access.md)
-->

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
[15]: ./media/powerapps-create-api-googledrive/browseall.png
[16]: ./media/powerapps-create-api-googledrive/allresources.png
