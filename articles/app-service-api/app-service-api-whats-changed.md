<properties
	pageTitle="App Service API Apps - What's changed | Microsoft Azure"
	description="Learn what's new for API Apps in Azure App Service."
	services="app-service\api"
	documentationCenter=".net"
	authors="mohitsriv"
	manager="wpickett"
	editor="tdykstra"/>

<tags
	ms.service="app-service-api"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="11/29/2015"
	ms.author="mohisri"/>

# App Service API Apps - What's changed

At the Connect() event in November 2015, a number of improvements were [announced](https://azure.microsoft.com/en-us/blog/azure-app-service-updates-november-2015/) to Azure App Service. These improvements include underlying changes to API Apps to better align with Mobile and Web Apps, reduce concept count and improve deployment and runtime performance. Starting November 30, 2015, new API apps you create using the Azure management portal or the latest tooling will reflect these changes. This article describes these changes, as well as how to redeploy existing apps to take advantage of the capabilities.

> [AZURE.NOTE] The initial preview of API Apps supported two primary scenarios: 1) custom APIs for use in Logic Apps or your own clients and 2) Marketplace API (often SaaS connectors) for use in Logic Apps. This article addresses the first scenario, custom APIs. For Marketplace APIs, an improved Logic Apps designer experience and underlying connectivity foundation will be introduced in early 2016. The existing Marketplace APIs remain available in the Logic Apps designer.

## Overview of changes
The key features of API Apps – authentication, CORS and API metadata – are moving directly into App Service. With this change, the features will be available across Web, Mobile and API Apps. The API Apps gateway will no longer be needed or offered with API Apps. This also makes it easier to use Azure API Management since there will be just the single API Management gateway.

[diagram here]

A key design principle with the API Apps update is to enable you to bring your API as is, in your language of choice.  If your API is already deployed as a Web App or Mobile App*, you do not have to redeploy your app to take advantage of the new features.

> [AZURE.NOTE] *If you are currently on API Apps preview, migration guidance is detailed below.

### Authentication
Azure App Service offers built-in services for authentication and authorization. This tutorial shows how how to protect an API app and how to call it from an HTML/JavaScript client, on behalf of users authenticated by Azure Active Directory. The next tutorial in the series shows how to handle service principal authentication, that is, when you want to make a call from one API app to another without using an individual user's credentials.

For an introduction to authentication and authorization services in Azure App Service, see Expanding App Service authentication / authorization.

### CORS
Instead of a comma-delimited **MS_CrossDomainOrigins** app setting, there is now a blade in the Azure management portal for configuring CORS. Alternatively, it can be configured using Resource Manager tooling such as Azure PowerShell, CLI or [Resource Explorer](https://resources.azure.com/). Set the **cors** property on the **Microsoft.Web/sites/config** resource type for your **&lt;site name&gt;/web** resource. For example:

    {
        "cors": {
            "allowedOrigins": [
                "https://localhost:44300"
            ]
        }
    } 

### API metadata
The API definition blade is now available across Web, Mobile and API Apps. In the management portal, you can specify either a relative url or an absolute url pointing to an endpoint that hosts a Swagger 2.0 representation of your API. Alternatively, it can be configured using Resource Manager tooling. Set the **apiDefinition** property on the **Microsoft.Web/sites/config** resource type for your **&lt;site name&gt;/web** resource. For example:

    {
        "apiDefinition":
        {
            "url": "https://myStorageAccount.blob.core.windows.net/swagger/apiDefinition.json"
        }
    }

At this time, the metadata endpoint needs to be publicly accessible without authentication for many downstream clients (e.g. Visual Studio code generation and PowerApps "Add API" flow) to consume it.

## Portal
## Visual Studio
## Migrating existing API apps
Do it by December 31, 2015


