---
title: Deploy to Azure App Services using Visual Studio 2015 | Microsoft Docs
description: This article describes how to deploy a Web App, API App or Mobile App to Azure Germany using Visual Studio 2015 and Azure SDK.
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---

# Deploy to Azure App Services using Visual Studio 2015
This article describes how to deploy an Azure App Services app (API App, Web App, Mobile App) to Azure Germany using Visual Studio 2015.

## Prerequisites
* See [Visual Studio prerequisites](../app-service-api/app-service-api-dotnet-get-started.md#prerequisites) to install and configure Visual Studio 2015 and Azure SDK.
* Follow [these instructions](./germany-get-started-connect-with-vs.md) to configure Visual Studio to connect to Azure Government account. 

## Open App project in Visual Studio
* Open existing app solution\project in Visual Studio, create a project by following [these instructions](../app-service-web/web-sites-dotnet-get-started.md#create-a-web-application), or download sample app by following [these steps](../app-service-api/app-service-api-dotnet-get-started.md#download-the-sample-application).
* Run the app in Visual Studio to make sure it works locally.

## Deploy to Azure Germany
* Once **Visual Studio is configured to connect to Azure Germany account** (already done in prerequisites section), instructions to deploy to app services are exactly same as for Azure Public.
* To deploy the app, follow [these steps](../app-service-api/app-service-api-dotnet-get-started.md#a-idcreateapiappa-create-an-api-app-in-azure-and-deploy-code-to-it).

### References
* [Deploy an ASP.NET web app to Azure App Service, using Visual Studio](../app-service-web/web-sites-dotnet-get-started.md)
* For other ways to deploy, see [Deploy your app to Azure App Service](../app-service-web/web-sites-deploy.md)
* For general App Service documentation, see [App Service - API Apps Documentation](../app-service-api/index.md)

## Next Steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/)




