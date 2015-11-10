<properties
	pageTitle="Register API from Marketplace | Microsoft Azure"
	description="Register API from marketplace"
	services="power-apps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/30/2015"
   ms.author="guayan"/>

**Need to update the terminology around _Marketplace_ when we have the official glossary**

# Register API from Marketplace

There are three ways to register an API so that users can use them from their apps:

1. From Marketplace
2. [From APIs hosted in your App Service Environment](powerapps-register-api-hosted-in-app-service.md)
3. [From Swagger 2.0 API definition](powerapps-register-existing-api-from-api-definition.md)

This article describes what are the available APIs in Marketplace, why you want to register them for your organization and how to register one.

#### Prerequisites to get started

- Sign up for PowerApps Enterprise
- Create an App Service Environment

## Available APIs in marketplace

Every Microsoft managed APIs you get out-of-box after you sign up for PowerApps is availabe in Marketplace so that you can register your own instance. This list includes:

- Bing Search
- Dropbox
- DynamicsCRM Online
- Excel
- Google Drive
- Microsoft Translator
- Office365 Outlook
- Office3665 Users
- OneDrive
- Salesforce
- SharePoint Online
- Twitter

There are also additional APIs which are only available in Marketplace. This list includes:

- SQL Server
- SharePoint Server

## Why register APIs from marketplace

Using the out-of-box Microsoft managed APIs is convenient. Having said that, registering APIs from marketplace as self managed APIs has many benefits. At a high level, we recommend you to do so when you want to

- Have full manageability on the APIs, including user access, security when connecting to other systems, API call limits, monitoring and advanced features like policies, etc..
- Access on-premises data since App Service Environment supports virtual network.
- Set up the APIs for business users which they may not be able to use by themselves.

Following is a table comparing the capabilities you get in both cases.

| Capability | Microsoft Managed | Self Managed |
| ---------- | ----------------- | ------------ |
| API call limits | Defined by Microsoft | Defined by yourself (via policies) |
| Bring your own key when connecting to SaaS | Not supported | Supported |
| API user access | Enabled for everyone | Fully manageable at AAD user and group level |
| API Monitoring | Not supported | Supported |
| API Policies | Not supported | Supported |
| Connection user access | View only | Fully manageable at AAD user and group level |
| Connection management | View only | Fully manageable |


## How to register an API from marketplace

Register an API from marketplace is very simple. Following are the general steps.

1. In the Azure portal, select **PowerApps**. In PowerApps, select **Registered APIs**:  
	![][11]
2. In Registered APIs, select **Add**:
	![][12]  
3. In **Add API**, enter the API properties:
	In **Name**, enter a name for your API. Notice that it will be part of the runtime URL of the API, which should be meaningful and unique within your organization.
	In **Source**, select **Marketplace**.
	![][13]
4. Click the **API** chevron and then choose the API you want to register from the **Select from Marketplace** blade.
	![][14]
5. Follow the marketplace API specific articles to configure additional settings if there is any.
6. Click **ADD** to complete these steps.

For specific settings needed for each API, you can follow the API specific articles referenced below:

- [Bing Search]()
- [Microsoft Translator]()
- [Dropbox]()
- [DynamicsCRM Online]()
- [Excel]()
- [Google Drive]()
- [Office365 Outlook]()
- [Office3665 Users]()
- [OneDrive]()
- [Salesforce]()
- [SharePoint Online]()
- [SharePoint Server]()
- [SQL Server]()
- [Twitter]()

## Summary and next steps




[11]: ./media/powerapps-register-api-from-marketplace/registered-apis-part.png
[12]: ./media/powerapps-register-api-from-marketplace/add-api-button.png
[13]: ./media/powerapps-register-api-from-marketplace/add-api-blade.png
[14]: ./media/powerapps-register-api-from-marketplace/add-api-select-from-marketplace-blade.png