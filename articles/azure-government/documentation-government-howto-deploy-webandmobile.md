---
title: Deploy to Azure App Services using Visual Studio 2015 | Microsoft Docs
description: This article describes how to deploy a Web App, API App or Mobile App to Azure Government using Visual Studio 2015 and Azure SDK.
services: azure-government
cloud: gov
documentationcenter: ''
author: sdubeymsft
manager: zakramer

ms.assetid: 8f9a3700-b9ee-43b7-b64d-2e6c3b57d4c0
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 01/03/2016
ms.author: sdubeymsft

---
# Deploy to Azure App Services using Visual Studio 2017
This article describes how to deploy an Azure App Services app (API App, Web App, Mobile App) to Azure Government using Visual Studio 2017.

## Prerequisites
* See [Visual Studio prerequisites] (../app-service/app-service-web-get-started-dotnet.md#prerequisites) to install and configure Visual Studio 2017 and Azure SDK.
* Follow [these instructions] (documentation-government-get-started-connect-with-vs.md) to configure Visual Studio to connect to Azure Government account.

## Open App project in Visual Studio
If you have an existing app solution\project in Visual Studio, you can create a project by following [these instructions](../app-service/app-service-web-get-started-dotnet.md).

If not, download a sample app by following [these steps] (../app-service/app-service-web-get-started-dotnet.md#download-the-sample-application).

Run the app in Visual Studio to make sure it works locally.

## Deploy to Azure Government
Once **Visual Studio is configured to connect to Azure Government account** (already done in prerequisites section), instructions to deploy to app services are exactly same as for Azure Public.

To deploy the app, follow [these steps] (../app-service/app-service-web-get-started-dotnet.md#createapiapp).

Once the app has been successfully deployed to Azure Government, the url should end with "azurewebsites.us"(as shown below).  
![success screenshot](./media/documentation-government-howto-deploy-webandmobile-screenshot1.png)  

### References
* [Deploy an ASP.NET web app to Azure App Service, using Visual Studio] (../app-service/app-service-web-get-started-dotnet.md)
* For general App Service documentation, see [App Service - API Apps Documentation] (../app-service/index.md)

## Next steps
For supplemental information and updates, subscribe to the [Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/).
