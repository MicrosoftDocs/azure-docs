---
title: Create a Universal Windows Platform (UWP) that uses Azure Mobile Apps | Microsoft Docs
description: Follow this tutorial to get started with using Azure mobile app backends for Universal Windows Platform (UWP) app development in C#, Visual Basic, or JavaScript.
services: app-service\mobile
documentationcenter: windows
author: conceptdev
manager: crdun
editor: ''

ms.assetid: 47124296-2908-4d92-85e0-05c4aa6db916
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 05/09/2019
ms.author: crdun
---
# Create a Windows app with an Azure backend

[!INCLUDE [app-service-mobile-selector-get-started](../../includes/app-service-mobile-selector-get-started.md)]

## Overview

This tutorial shows you how to add a cloud-based backend service to a Universal Windows Platform (UWP) app. For more information, see [What are Mobile Apps](app-service-mobile-value-prop.md). The following are screen captures from the completed app:

![Completed desktop app](./media/app-service-mobile-windows-store-dotnet-get-started/mobile-quickstart-completed-desktop.png)

Completing this tutorial is a prerequisite for all other Mobile App tutorials for UWP apps.

## Prerequisites

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* Windows 10.
* Visual Studio Community 2017.
* Familiarity with UWP app development. Visit the [UWP documentation](https://docs.microsoft.com/windows/uwp/) to learn how to [get set up](https://docs.microsoft.com/windows/uwp/get-started/get-set-up) to build UWP apps.

## Create a new Azure Mobile App backend

Follow these steps to create a new Mobile App backend.

[!INCLUDE [app-service-mobile-dotnet-backend-create-new-service](../../includes/app-service-mobile-dotnet-backend-create-new-service.md)]

## Create a database connection and configure the client and server project
[!INCLUDE [app-service-mobile-configure-new-backend.md](../../includes/app-service-mobile-configure-new-backend.md)]

## Run the client project

1. Open the UWP project.

2. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

3. Open the file `App.xaml.cs` in this folder - windows-uwp-cs/ZUMOAPPNAME/. The application name is `ZUMOAPPNAME`.

4. In `App` class, replace `ZUMOAPPURL` parameter with public endpoint above.

    `public static MobileServiceClient MobileService = new MobileServiceClient("ZUMOAPPURL");`

    becomes
    
    `public static MobileServiceClient MobileService = new MobileServiceClient("https://test123.azurewebsites.net");`

5. Press the F5 key to deploy and run the app.

6. In the app, type meaningful text, such as *Complete the tutorial*, in the **Insert a TodoItem** text box, and then click **Save**.

    ![Windows quickstart complete desktop](./media/app-service-mobile-windows-store-dotnet-get-started/mobile-quickstart-startup.png)

    This sends a POST request to the new mobile app backend that's hosted in Azure.
