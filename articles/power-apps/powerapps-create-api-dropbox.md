<properties
	pageTitle="Add the Dropbox API to PowerApps Enterprise| Microsoft Azure"
	description="Create or configure a new Dropbox API in your organization's app service environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="linhtranms"
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

# Create a new Dropbox API in PowerApps Enterprise

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
Add the Dropbox API to your organization's (tenant) app service environment. 

## Create the API in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.
 
2. Select **Browse** in the task bar:  
![][12]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![][13]  

4. In **PowerApps**, select **Manage APIs**:  
![Browse to registered apis][4]

5. In **Manage APIs**, select **Add** to add the new API:  
![Add API][5]

6. Enter a descriptive **name** for your API.  
	
7. In **Source**, select **Available APIs** to see the pre-built APIs, and then select **Dropbox**:  
![select dropbox api][6]

8. Select **Settings - Configure required settings**:  
![configure dropbox API settings][7]

9. Enter the **App Key** and **App Secret** values of your Dropbox application. If you don't already have one, see the "Register a Dropbox app for use with PowerApps" section in this topic to create the key and secret values you need.  

	> [AZURE.IMPORTANT] Save the **redirect URL**. You may need this value later in this topic.

10. Select **OK** to complete the steps.


When finished, a new Dropbox API is added to your app service environment.


## Optional: Register a Dropbox app for use with PowerApps

If you don't have an existing Dropbox app with the key and secret values, then use the following steps to create the application, and get the values you need. 

1. Go to [Dropbox][1] and sign in with your account.

2. Go to the Dropbox developer site and select **My Apps**:  
![Dropbox developer site][8]

3. Select **Create app**:  
![Dropbox create app][9]

4. In **Create a new app on the Dropbox platform**:  

	1. In **Choose API**, select **Dropbox API**.  
	2. In **Choose the type of access you need**, select **Full Dropbox...**.  
	3. Enter a name for your app.  

	![Dropbox create app page 1][10]  

5. In the app settings page:  

	1. In **OAuth 2**, set the **Redirect URL** to the redirect URL you received when you added the new Dropbox API in the Azure Portal (in this topic). Select **Add**.  
	2. Select **Show** link to reveal the **app secret**:  

	![Dropbox create app page 2][11]

A new Dropbox app is created. You can use this app in your Dropbox API configuration in the Azure portal. 

## See the REST APIs

[Dropbox REST API](../connectors/connectors-create-api-dropbox.md) reference.


## Summary and next steps
In this topic, you added the Dropbox API to your PowersApps Enterprise. Next, give users access to the API so it can be added to their apps: 

[Add a connection and give users access](powerapps-manage-api-connection-user-access.md)
-->

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


[12]: ./media/powerapps-create-api-dropbox/browseall.png
[13]: ./media/powerapps-create-api-dropbox/allresources.png
