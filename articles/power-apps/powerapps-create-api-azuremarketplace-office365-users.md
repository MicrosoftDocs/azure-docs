<properties
	pageTitle="Create a new Office 365 Users API in your organization's App Service Environment"
	description="Create a new Office 365 Users API in your organization's App Service Environment"
	services="power-apps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/02/2015"
   ms.author="litran"/>

#Create a new Office 365 Users API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Registered APIs** tile or select it from *Settings*:  


2. In the **Registered APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	
	c) Select **API** from Azure Marketplace.  

4. Select *Office 365 Users* from Azure Marketplace

	a) Select *Settings - Configure required settings*
	
	b) Enter *Client Id* and *Client Secret*
		
		Note the *Redirect URL*
	- If you don't already have an Azure Application Directory app created, follow [these instructions][1].
	- Following the instructions from the above tutorial, ensure that the application has delegated permissions to *Office 365 APIs*


	c) Click *OK* on *Configure API* blade

5. Click **OK**. Office 365 Users API is now added to the list of **Registered APIs** in your App Service Environment.

<!--References-->
[1]: https://azure.microsoft.com/en-us/documentation/articles/active-directory-integrating-applications/  