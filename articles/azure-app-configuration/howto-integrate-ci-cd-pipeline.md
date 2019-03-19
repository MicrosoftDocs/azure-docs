---
title: Integrate with a continuous integration and delivery pipeline using Azure App Configuration | Microsoft Docs
description: Learn how to generate a configuration file using data in Azure App Configuration during continuous integration and delivery
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/24/2019
ms.author: yegu
ms.custom: mvc
---

# Integrate with a CI/CD pipeline

To enhance the resiliency of your application against the remote possibility of not being able to reach Azure App Configuration, you should package the current configuration data into a file that is deployed with the application and loaded locally during its startup. This approach guarantees that your application will have default setting values at least. These values will be overwritten by any newer changes in an app configuration store when it is available.

## Automate configuration data retrieval

Using the [**Export**](./howto-import-export-data.md#export-data) function of Azure App Configuration, you can automate the process of retrieving current configuration data as a single file. You can then include this file in a build or deployment step in your continuous integration and continuous deployment pipeline.

## Next steps

* [Quickstart: Create an ASP.NET web app](quickstart-aspnet-core-app.md)  
