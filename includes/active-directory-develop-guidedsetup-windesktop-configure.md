---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: jmprieur
ms.custom: include file
---

## Register your application

You can register your application in either of two ways.

### Option 1: Express mode

You can quickly register your application by doing the following:
1. Go to the [Azure portal - Application Registration](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/WinDesktopQuickstartPage/sourceType/docs).
1. Enter a name for your application and select **Register**.
1. Follow the instructions to download and automatically configure your new application with just one click.

### Option 2: Advanced mode

To register your application and add your application registration information to your solution, do the following:
1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `Win-App-calling-MsGraph`.
   - In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (for example, Skype, Xbox, Outlook.com)**.
   - Select **Register** to create the application.
1. In the list of pages for the app, select **Authentication**.
   1. In the **Redirect URIs** section, in the Redirect URIs list:
   1. In the **TYPE** column select **Public client (mobile & desktop)**.
   1. Enter `urn:ietf:wg:oauth:2.0:oob` in the **REDIRECT URI** column.
1. Select **Save**.
1. Go to Visual Studio, open the *App.xaml.cs* file, and then replace `Enter_the_Application_Id_here` with the application ID that you just registered and copied.

    ```csharp
    private static string ClientId = "Enter_the_Application_Id_here";
    ```
