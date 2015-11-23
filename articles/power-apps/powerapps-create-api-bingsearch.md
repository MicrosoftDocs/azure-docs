<properties
	pageTitle="Create a new Bing Search API in your organization's App Service Environment"
	description="Create a new Bing Search API in your organization's App Service Environment"
	services=""
    suite="powerapps"
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
   ms.date="11/20/2015"
   ms.author="litran"/>

#Create a new Bing Search API in your organization's App Service Environment

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Registered APIs** tile or select it from *Settings*:  


2. In the **Registered APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	
	c) Select **API** from Azure Marketplace.  

4. Select Bing Search from Azure Marketplace

	a) Select *Settings - Configure required settings*
	
	b) Enter *Account Key*
		
	- If you don't have a Bing Search Key, create a free [Bing Search offer][1] to obtain one


	c) Click *OK* on *Configure API* blade

5. Click **OK**. Bing Search API is now added to the list of **Registered APIs** in your App Service Environment. 

<!--References-->
[1]: https://datamarket.azure.com/dataset/bing/search

