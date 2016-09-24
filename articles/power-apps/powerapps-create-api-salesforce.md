<properties
	pageTitle="Add the Salesforce API to PowerApps Enterprise | Microsoft Azure"
	description="Create or configure a new Salesforce API in your organization's app service environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="rajeshramabathiran"
	manager="dwerde"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/02/2016"
   ms.author="litran"/>

# Create a new Salesforce API in PowerApps Enterprise

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
Add the Salesforce API to your organization's (tenant) app service environment. 

## Create the API in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.
 
2. Select **Browse** in the task bar:  
![][14]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![][15]  

4. In **PowerApps**, select **Manage APIs**:    
![Browse to registered apis][1]

5. In **Manage APIs**, select **Add** to add the new API:  
![Add API][2]

6. Enter a descriptive **name** for your API.  
	
7. In **Source**, select **Available APIs** to select the pre-built APIs, and select **Salesforce**:  
![select Salesforce api][3]

8. Select **Settings - Configure required settings**:  
![configure dropbox API settings][7]

9. Enter the *App Key* and *App Secret* of your Salesforce application. If you don't have one, see the "Register a Salesforce app for use with PowerApps" section in this topic to create the key and secret values you need.  

	> [AZURE.IMPORTANT] Save the **redirect URL**. You may need this value later in this topic.

10. Select **OK** to complete the steps.

When finished, a new Salesforce API is added to your app service environment.


## Optional: Register a Salesforce app for use with PowerApps

If you don't have an existing Salesforce app with the key and secret values, then use the following steps to create the application, and get the values you need. 

1. Open [Salesforce developer homepage][5], and sign in with your Salesforce account. 

2. In the homepage, select your profile, and select **Setup**:  
![Salesforce homepage][6]

3. Select **Create** and select **Apps**. In the **Apps** page, select **New** under **Connected Apps**:  
![Salesforce create app][7]

4. In **New Connected App**:  

	1. Enter the value for **Connected App Name**.  
	2. Enter the value for **API Name**.  
	3. Enter the value for **Contact Email**.  
	4. Under _API (Enable OAuth Settings)_, select **Enable OAuth Settings**, and set the **Callback URL** to the redirect URL you received when you added the new Salesforce API in the Azure Portal (in this topic).  

5. Under _Selected OAuth scopes_, add the following scopes to the **Selected OAuth Scopes**:  

	- Access and manage your Chatter data (chatter_api)
	- Access and manage your data (api)
	- Allow access to your unique identifier (openid)
	- Perform requests on your behalf at any time (refresh_token, offline_access)

6. **Save** your changes:  
![Salesforce new app][8]

A new Salesforce app is created. You can use this app in your Salesforce API configuration in the Azure portal. 

## See the REST APIs

[Salesforce REST API](../connectors/connectors-create-api-salesforce.md) reference.

## Summary and next steps
In this topic, you added the Salesforce API to your PowersApps Enterprise. Next, give users access to the API so it can be added to their apps: 

[Add a connection and give users access](powerapps-manage-api-connection-user-access.md)
-->


<!--References-->
[1]: ./media/powerapps-create-api-salesforce/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-salesforce/add-api.PNG
[3]: ./media/powerapps-create-api-salesforce/select-salesforce-api.PNG
[4]: ./media/powerapps-create-api-salesforce/configure-salesforce-api.PNG
[5]: https://developer.salesforce.com
[6]: ./media/powerapps-create-api-salesforce/salesforce-developer-homepage.PNG
[7]: ./media/powerapps-create-api-salesforce/salesforce-create-app.PNG
[8]: ./media/powerapps-create-api-salesforce/salesforce-new-app.PNG
[14]: ./media/powerapps-create-api-salesforce/browseall.png
[15]: ./media/powerapps-create-api-salesforce/allresources.png
