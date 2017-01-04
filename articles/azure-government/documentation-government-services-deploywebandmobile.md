---
title: Deploy to App Services using Visual Studio | Microsoft Docs
description: This article describes how to deploy a Web\Mobile App Service to Azure Government using Visual Studio 2015 and Azure SDK.
services: Azure-Government
cloud: gov
documentationcenter: ''
author: sdubey
manager: zakramer
editor: ''

ms.assetid: 8f9a3700-b9ee-43b7-b64d-2e6c3b57d4c0
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 01/03/2016
ms.author: sdubey

---
# Deploy to Azure App Services using Visual Studio 2015
This article describes how to deploy an App Service app to Azure Government using Visual Studio 2015 and Azure SDK. 

## Prerequisites
* See [Visul Studio prerequsisites] (../app-service-api/app-service-api-dotnet-get-started.md#prerequisites) to install and configure Visual Studio 2015 and Azure SDK.
* Follow [these instructions] (documentation-government-manage-subscriptions.md#connecting-via-visual-studio) to configure Visual Studio to connect to Azure Government account.

## Open App project in Visual Studio
* Open existing App solution\project in Visual Studio, create a new project by following [these instructions] (../app-service-web/web-sites-dotnet-get-started.md#create-a-web-application), or download sample app by following [these steps] (../app-service-api/app-service-api-dotnet-get-started.md#download-the-sample-application).
* Run the app in Visual Studio to make sure it works locally.

## Deploy to Azure Government
* Once **Visual Studio is configured to connect to Azure Government account** (already done in prerequisites section), instructions to deploy to app service are exactly same as for Azure Public.
* Follow [these steps] (../app-service-api/app-service-api-dotnet-get-started.md#a-idcreateapiappa-create-an-api-app-in-azure-and-deploy-code-to-it) to deploy the app.

### References
* [Deploy an ASP.NET web app to Azure App Service, using Visual Studio] (../app-service-web/web-sites-dotnet-get-started.md)
* For other ways to deploy, see [Deploy your app to Azure App Service] (../app-service-web/web-sites-deploy.md)
* For general App Service documentation, see [App Service - API Apps Documentation] (../app-service-api/index.md)

## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).
