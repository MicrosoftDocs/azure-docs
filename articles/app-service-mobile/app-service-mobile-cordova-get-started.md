---
title: Create a Cordova app on Azure App Service Mobile Apps | Microsoft Docs
description: Follow this tutorial to get started with using Azure mobile app backends for Apache Cordova development
services: app-service\mobile
documentationcenter: javascript
author: elamalani
manager: crdun
editor: ''
tags: ''
keywords: cordova,javascript,mobile,client

ms.assetid: 0b08fc12-0a80-42d3-9cc1-9b3f8d3e3a3f
ms.service: app-service-mobile
ms.workload: na
ms.tgt_pltfrm: mobile-html
ms.devlang: javascript
ms.topic: conceptual
ms.date: 06/25/2019
ms.author: emalani
---
# Create an Apache Cordova app
[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-cordova-get-started) today.
>

## Overview
This tutorial shows you how to add a cloud-based backend service to an Apache Cordova mobile app by using
an Azure mobile app backend.  You create both a new mobile app backend and a simple *Todo list* Apache Cordova
app that stores app data in Azure.

Completing this tutorial is a prerequisite for all other Apache Cordova tutorials about using the Mobile
Apps feature in Azure App Service.

## Prerequisites
To complete this tutorial, you need the following prerequisites:

* A PC with [Visual Studio Community 2017] or newer.
* [Visual Studio Tools for Apache Cordova].
* An [active Azure account](https://azure.microsoft.com/pricing/free-trial/).

You may also bypass Visual Studio and use the Apache Cordova command line directly.  Using the command line
is useful when completing the tutorial on a Mac computer.  Compiling Apache Cordova client applications using
the command line is not covered by this tutorial.

## Create an Azure mobile app backend
[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Create a database connection and configure the client and server project
[!INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Download and run the Apache Cordova app
[!INCLUDE [app-service-mobile-cordova-run-app](../../includes/app-service-mobile-cordova-run-app.md)]
<!-- URLs -->
[Azure portal]: https://portal.azure.com/

[Visual Studio Community 2017]: https://www.visualstudio.com/
[Visual Studio Tools for Apache Cordova]: https://www.visualstudio.com/en-us/features/cordova-vs.aspx