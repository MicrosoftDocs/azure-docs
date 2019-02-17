---
title: Create .NET Core Publishable Zip - Azure App Service | Microsoft Docs 
description: Learn how to create a ZIP file for .NET Core applications for deploying onto Azure App Service.
services: app-service
documentationcenter: ''
author: rbhadti94
manager: ''
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/17/2019
ms.author: cephalin;sisirap
ms.custom: seodec18

---

# Create Project ZIP File - .NET Core Application
>[!NOTE]
> If attempting to deploy a .NET Core Application ZIP, please take note of the underlying Operating System of your App Service Plan (Windows or Linux). This was chosen when creating the App Service Plan [!INCLUDE [Manage App Service plan](app-service-plan-manage.md)]

Navigate to the .NET Core project root directory (the directory containing the project solution ```.sln``` file). And publish the application in a *portable* format. This means publishing using a target runtime of either *linux-x64, win-x32, win-x64*. This **must** match the underlying App Service Plan OS and the architecture (32/64 bit) of the App Service sitting on top of the App Service Plan. See [!INCLUDE [.NET Core RID Catalog](https://github.com/dotnet/docs/blob/master/docs/core/rid-catalog.md)] for more information.

```
cd <root_app_dir>

# Publish using portable runtime
dotnet publish -o ./myapp --runtime [linux-x64, win-x32, win-x64]

# Zip published application
zip -r myapp.zip ./myapp/*
```