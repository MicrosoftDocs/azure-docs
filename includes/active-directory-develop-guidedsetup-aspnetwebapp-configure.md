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
ms.date: 04/11/2019
ms.author: jmprieur
ms.custom: include file 

---

## Register your application

To register your application and add your application registration information to your solution, you have two options:

### Option 1: Express mode

You can quickly register your application by doing the following:

1. Go to the new  [Azure portal - App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/AspNetWebAppQuickstartPage/sourceType/docs) pane.
1. Enter a name for your application and click **Register**.
1. Follow the instructions to download and automatically configure your new application for you in one click.

### Option 2: Advanced mode

To register your application and add the app's registration information to your solution manually, follow these steps:

1. Go to Visual Studio and:
   1. in Solution Explorer, select the project and look at the Properties window (if you don’t see a Properties window, press F4).
   1. Change SSL Enabled to `True`.
   1. Right-click on the project in Visual Studio, then choose **Properties**, and the **Web** tab. In the *Servers* section change the *Project Url* to be the SSL URL.
   1. Copy the SSL URL. You will add this URL to the list of Redirect URLs in the Registration Portal’s list of Redirect URLs in the next step:<br/><br/>![Project properties](media/active-directory-develop-guidedsetup-aspnetwebapp-configure/vsprojectproperties.png)<br />
1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application** page appears, enter your application's registration information:
   1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ASPNET-Tutorial`.
   1. Add the SSL URL you had copied from Visual Studio in Step 1 (for instance `https://localhost:44368/`) in **Reply URL**, and click **Register**.
1. Select **Authentication** menu, set **ID tokens** under **Implicit Grant**, and then select **Save**.
1. Add the following in `web.config` located in the root folder under the section `configuration\appSettings`:

    ```xml
    <add key="ClientId" value="Enter_the_Application_Id_here" />
    <add key="redirectUri" value="Enter_the_Redirect_URL_here" />
    <add key="Tenant" value="common" />
    <add key="Authority" value="https://login.microsoftonline.com/{0}/v2.0" />
    ```

1. Replace `ClientId` with the Application ID you just registered.
1. Replace `redirectUri` with the SSL URL of your project.
