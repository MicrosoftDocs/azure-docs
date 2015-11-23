<properties
	pageTitle="Add Microsoft Translator API in PowerApps | Azure"
	description="Add a new Microsoft Translator API in your organization's App Service Environment"
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
   ms.date="11/20/2015"
   ms.author="litran"/>

#Create a new Microsoft Translator API in your organization's App Service Environment

1. In the Azure portal, click on _Browse_ and select _PowerApps Services_. 

2. In **PowerApps Services**, select **Manage APIs** tile or select it from *Settings*:  
![Browse to registered apis][1]

3. In the **Manage APIs** blade, select **Add** to add a new API
![Add API][2]

4. Enter a descriptive **name** for your API.  
	
5. In **Source**, select **Available APIs** to select a pre-built API. 
	
6. Select **Microsoft Translator** from the marketplace
![select Microsoft Translator api][3]

7. Select *Settings - Configure required settings*
![configure Microsoft Translator API settings][4]

8. Enter *Client Id* and *Client Secret* of your Microsoft Translator application. If you don't already have one, see the section below titled "Register a Microsoft Translator app for use with PowerApps". 

9. Click **OK** to close the configure API blade.

10. Click **OK** to create a new Microsoft Translator API in your ASE.

On successful completion, a new Microsoft Translator API is added to your ASE.

##Register a Microsoft Translator app for use with PowerApps

1. Navigate to [Azure Data Market developer's page][5] and sign in with your Microsoft Account

2. Click on **Register**

3. In the _Register your application_ page,
	1. Enter a value for **Client Id**
	2. Enter the **name** of your application
	3. Provide a dummy value for **redirect url** (example: https://contosoredirecturl)
	4. Provide a **description**
	5. Click **Create**
![Register your application][6]

4. On successful completion, a new Microsoft Translator app is created.


Congratulations! You have now successfully created a Microsoft Translator app that can be used in PowerApps.


<!--References-->
[1]: ./media/powerapps-create-api-microsofttranslator/browse-to-registered-apis.PNG
[2]: ./media/powerapps-create-api-microsofttranslator/add-api.PNG
[3]: ./media/powerapps-create-api-microsofttranslator/select-microsofttranslator-api.PNG
[4]: ./media/powerapps-create-api-microsofttranslator/configure-microsofttranslator-api.PNG
[5]: https://datamarket.azure.com/developer/applications/
[6]: ./media/powerapps-create-api-microsofttranslator/register-your-application.PNG