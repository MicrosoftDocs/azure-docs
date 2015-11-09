<properties
	pageTitle="Create a new Twitter API in your organization's App Service Environment"
	description="Create a new Twitter API in your organization's App Service Environment"
	services="powerapps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="11/05/2015"
   ms.author="litran"/>

#Create a new Twitter API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Registered APIs** tile or select it from *Settings*:  


2. In the **Registered APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	
	c) Select **API** from Azure Marketplace.  

4. Select Twitter from Azure Marketplace

	a) Select *Settings - Configure required settings*
	
	b) Enter *App Key* and *App Secret* for Salesforce
		
		Note the *Redirect URL*
	- If you don't have a Twitter app key, follow these steps:
		- Create a free application for Twitter at [http://apps.twitter.com](http://apps.twitter.com).

	c) Click *OK* on *Configure API* blade

5. Click **OK**. Twitter API is now added to the list of **Registered APIs** in your App Service Environment. 

<!--References-->
[1]: http://apps.twitter.com
