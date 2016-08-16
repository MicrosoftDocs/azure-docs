<properties
	pageTitle="Add the Microsoft Translator API to PowerApps Enterprise | Microsoft Azure"
	description="Create or configure a new Microsoft Translator API in your organization's app service environment"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="linhtranms"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/02/2016"
   ms.author="litran"/>

# Create a new Microsoft Translator API in PowerApps Enterprise

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about the available connections in PowerApps, go to [Available Connections](https://powerapps.microsoft.com/tutorials/connections-list/). 

<!--Archived
Add the Microsoft Translator API to your organization's (tenant) app service environment. 

## Create the API in the Azure portal

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.
 
2. Select **Browse** in the task bar:  
![][7]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![][8]  

4. In **PowerApps**, select **Manage APIs**:  
![Browse to registered apis][1]

5. In **Manage APIs**, select **Add** to add the new API:  
![Add API][2]

6. Enter a descriptive **name** for your API.  
	
7. In **Source**, select **Available APIs** to select the pre-built APIs, and select **Microsoft Translator**:  
![select Microsoft Translator api][3]

8. Select **Settings - Configure required settings**:  
![configure Microsoft Translator API settings][4]

9. Enter the *Client Id* and *Client Secret* of your Microsoft Translator application. If you don't have one, see the "Register a Microsoft Translator app for use with PowerApps" section in this topic to create the ID and secret values you need. 

9. Select **OK** to complete the steps.

When finished, a new Microsoft Translator API is added to your app service environment.


## Optional: Register a Microsoft Translator app for use with PowerApps

If you don't have an existing Microsoft Translator app with the ID and secret values, then use the following steps to create the application, and get the values you need. 


1. Go to [Azure Data Market developer's page][5] and sign in with your Microsoft Account. 

2. Select **Register**.

3. In **Register your application**:  

	1. Enter a value for **Client Id**.  
	2. Enter the **name** of your application.  
	3. Enter a dummy value for **redirect url**. For example, enter *https://contosoredirecturl*.  
	4. Enter a **description**.  
	5. Select **Create**.  

	![Register your application][6]

A new Microsoft Translator app is created. You can use this app in your Microsoft Translator API configuration in the Azure portal. 

## See the REST APIs

[Microsoft Translator REST API](../connectors/connectors-create-api-microsofttranslator.md) reference.

## Summary and next steps
In this topic, you added the Microsoft Translator API to your PowersApps Enterprise. Next, give users access to the API so it can be added to their apps: 

[Add a connection and give users access](powerapps-manage-api-connection-user-access.md)
-->

<!--References-->
[1]: ./media/powerapps-create-api-microsofttranslator/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-microsofttranslator/add-api.PNG
[3]: ./media/powerapps-create-api-microsofttranslator/select-microsofttranslator-api.PNG
[4]: ./media/powerapps-create-api-microsofttranslator/configure-microsofttranslator-api.PNG
[5]: https://datamarket.azure.com/developer/applications/
[6]: ./media/powerapps-create-api-microsofttranslator/register-your-application.PNG
[7]: ./media/powerapps-create-api-microsofttranslator/browseall.png
[8]: ./media/powerapps-create-api-microsofttranslator/allresources.png
