<properties
	pageTitle="Get started with PowerApps Enterprise"
	description="IT Doc: steps to do before you can sign up for PowerApps Enterprise"
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

# Create a new API from Azure Marketplace

1. In the Azure portal, open **PowerApps**. In PowerApps, select **Registered APIs** tile or select it from *Settings*:  


2. In the **Registered APIs** blade, select **Add** to add a new API

3. Configure the API properties:  


	a) Enter a descriptive **name** for your API. For example, if you're adding the SQL connector, you can name it *SQLOrdersDB*.  
	b) In **Source**, select **Marketplace** to select a pre-built connector. Select **Existing API** to choose a connector you created (the .json and .manifest files are needed).  
	c) Select **API** from Azure Marketplace.  

4. Choose the API you want to add and configure that API's properties. Every API has different properties. For example, the SQL API can connect to an Azure SQL Database or an on-premises SQL Server. These options determine the settings or properties you configure. Currently, there are 15 APIs available from Azure Marketplace. 
	- [Bing Search](powerapps-create-api-azuremarketplace-bingsearch.md)
	- [Dynamics CRM Online Connection Provider](powerapps-create-api-azuremarketplace-crmonline.md)
	- [Dropbox](powerapps-create-api-azuremarketplace-dropbox.md)
	- [Excel]()
	- [Google Drive](powerapps-create-api-azuremarketplace-googledrive.md)
	- [Microsoft Translator]()
	- [Office 365 Outlook]()
	- [Office 365 Users]()
	- [Office 365 Videos]()
	- [OneDrive](powerapps-create-api-azuremarketplace-onedrive.md)
	- [Salesforce](powerapps-create-api-azuremarketplace-saleforce.md)
	- [SharePoint Online](powerapps-create-api-azuremarketplace-sharepointonline.md)
	- [SharePoint Server]()
	- [SQL Server]()
	- [Twitter](powerapps-create-api-azuremarketplace-twitter.md)
	
	> [AZURE.TIP] When you add an API, you're adding the API to your App Service environment. Once in the app service environment, it can be used by other apps within the same app service environment, especially PowerApps apps.

5. Select **Add**. The connector is now added to your list of **Registered APIs** in your app service environment.  

