---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/17/2018
ms.author: nacanuma
ms.custom: include file

---

## Register your application

1. Sign in to the [Azure portal](https://portal.azure.com/) to register an application.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. When the **Register an application** page appears, enter a name for your application.
1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. Under the **Redirect URI** section, select the **Web** platform and set the value to the application's URL based on your web server. See the sections below for instructions on how to set and obtain the redirect URL in Visual Studio and Node.
1. When finished, select **Register**.
1. On the app **Overview** page, note down the **Application (client) ID** value.
1. This quickstart requires the [Implicit grant flow](../articles/active-directory/develop/v2-oauth2-implicit-grant-flow.md) to be enabled. In the left-hand navigation pane of the registered application, select **Authentication**.
1. In **Advanced settings**, under **Implicit grant**, enable both **ID tokens** and **Access tokens** checkboxes. ID tokens and access tokens are required since this app needs to sign in users and call an API.
1. Select **Save**.

> #### Setting the redirect URL for Node
> For Node.js, you can set the web server port in the *server.js* file. This tutorial uses the port 30662 for reference but you can use any other available port. Follow the instructions below to set up a redirect URL in the application registration information:<br/>
> - Switch back to the *Application Registration* and set `http://localhost:30662/` as a `Redirect URL`, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number).

<p>

> #### Visual Studio instructions for obtaining the redirect URL
> Follow these steps to obtain the redirect URL:
> 1. In **Solution Explorer**, select the project and look at the **Properties** window. If you don’t see a **Properties** window, press **F4**.
> 2. Copy the value from **URL** to the clipboard:<br/> ![Project properties](media/active-directory-develop-guidedsetup-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3. Switch back to the *Application Registration* and set the value as a **Redirect URL**.

#### Configure your JavaScript SPA

1. In the `index.html` file created during project setup, add the application registration information. Add the following code at the top within the `<script></script>` tags in the body of your `index.html` file:

    ```javascript
    var applicationConfig = {
        clientID: "Enter_the_Application_Id_here",
        authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
        graphScopes: ["user.read"],
        graphEndpoint: "https://graph.microsoft.com/v1.0/me"
    };
    ```

    Where:
    - `Enter_the_Application_Id_here` - is the **Application (client) ID** for the application you registered.
    - `Enter_the_Tenant_Info_Here` - is set to one of the following options:
       - If your application supports **Accounts in this organizational directory**, replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
       - If your application supports **Accounts in any organizational directory and personal Microsoft accounts**, replace this value with `common`
