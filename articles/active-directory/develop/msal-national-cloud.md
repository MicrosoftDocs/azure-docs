---
title: Use Microsoft Authentication Library (MSAL) in National Clouds | Azure
description: Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third-party Web APIs, or your own Web API. MSAL supports multiple application architectures and platforms.
services: active-directory
documentationcenter: dev-center-name
author: negoe
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: using msal with national cloud
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2019
ms.author: negoe
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about how the Microsoft Authentication Library work in National CLoud scenarios so I can decide if this platform meets my application development needs and requirements in these special cloud environment.
ms.collection: M365-identity-device-management
---

# Using MSAL in National cloud environment

[National cloud](authentication-national-cloud.md) (aka Sovereign clouds) are physically isolated instances of Azure. These regions of Azure are designed to make sure that data residency, sovereignty, and compliance requirements are honored within geographical boundaries.

In addition to Microsoft worldwide cloud, Microsoft Authentication Library (MSAL) also enables application developers in national clouds to acquire tokens in order to authenticate and call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS.

Including global cloud, Azure Active Directory is deployed in the following National clouds:  

- Azure US Government
- Azure China 21Vianet
- Azure Germany


This guide demonstrates how to sign in work and school accounts, get an access token and call the Microsoft Graph API in [Microsoft cloud for US Government](https://azure.microsoft.com/en-us/global-infrastructure/government/) environment.


## Prerequisites

### Choose the appropriate identities
[Azure Government](https://docs.microsoft.com/en-us/azure/azure-government/) applications can use Azure AD Government identities as well as Azure AD public identities to authenticate users. Since you can use any of these identities, you need to understand and decide which authority endpoint you should choose for your scenario:

- Azure AD Public: Commonly used if your organization already has an Azure AD Public tenant to support Office 365 (Public or GCC) or another application.

- Azure AD Government: Commonly used if your organization already has an Azure AD Government tenant to support Office 365 (GCC High or DoD) or are creating a new tenant in Azure AD Government.

Once decided, the special consideration is where you perform your app registration. If you choose Azure AD Public identities for your Azure Government application, you must register the application in your Azure AD Public tenant.

### Get an Azure Government subscription
- To get an Azure Government subscription. See [managing and connecting to your subscription in Azure Government](https://docs.microsoft.com/en-us/azure/azure-government/documentation-government-manage-subscriptions)

- If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/en-us/global-infrastructure/government/request/) before you begin.


## JavaScript

### Step 1: Register your Application

1. Sign in to the [Azure portal](https://portal.azure.us/) to register an application. 
    1. To find Azure portal endpoints for other national clouds, see [App registration endpoints](https://docs.microsoft.com/en-us/azure/active-directory/develop/authentication-national-cloud#app-registration-endpoints)

2. If your account gives you access to more than one tenant, select your account in the top-right corner, and set your portal session to the desired Azure AD tenant.

3. Navigate to the Microsoft identity platform for developers [App registrations](https://aka.ms/ra/ff) page.

4. When the **Register an application** page appears, enter a name for your application.
5. Under **Supported account types**, select **Accounts in any organizational directory**.
6. Under the **Redirect URI** section, select the **Web** platform and set the value to the application's URL based on your web server. See the sections below for instructions on how to set and obtain the redirect URL in Visual Studio and Node.
7. When finished, select **Register**.
8. On the app **Overview** page, note down the **Application (client) ID** value.
9. This tutorial requires the [Implicit grant flow](v2-oauth2-implicit-grant-flow.md) to be enabled. In the left-hand navigation pane of the registered application, select **Authentication**.
10. In **Advanced settings**, under **Implicit grant**, enable both **ID tokens** and **Access tokens** checkboxes. ID tokens and access tokens are required since this app needs to sign in users and call an API.
11. Select **Save**.


### Step 2:  Setting up your web server or project

- [Download the project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip) for a local web server, such as Node

 or
 - [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/vsquickstart.zip)

 And then  skip to the ['Configure your JavaScript SPA'](#Step-4:-Configure-your-JavaScript-SPA) to configure the code sample before executing it.


### Step 3: Use the Microsoft Authentication Library (MSAL) to sign in the user

Follow steps in [Javascript tutorial](https://docs.microsoft.com/azure/active-directory/develop/tutorial-v2-javascript-spa#create-your-project) to create you project and integrate with Microsoft Authentication Library (MSAL) to sign in the user. 

### Step 4: Configure your JavaScript SPA

1. In the `index.html` file created during project setup, add the application registration information. Add the following code at the top within the `<script></script>` tags in the body of your `index.html` file:

    ```javascripts
    const msalConfig = {
        auth:{
            clientId: "Enter_the_Application_Id_here",
            authority: "https://login.microsoftonline.us/Enter_the_Tenant_Info_Here",
               }
     }

    const graphConfig = {
             graphEndpoint: "https://graph.microsoft.us",
             graphScopes: ["user.read"],

    }

    // create UserAgentApplication instance
    const myMSALObj = new UserAgentApplication(msalConfig);
    ```

    Where:
    - `Enter_the_Application_Id_here` - is the **Application (client) ID** for the application you registered.
    - `Enter_the_Tenant_Info_Here` - is set to one of the following options:
       - If your application supports **Accounts in this organizational directory**, replace this value with the **Tenant ID** or **Tenant name** (for example, contoso.microsoft.com)
       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
      -  To find authentication endpoints for all the national clouds, see [Azure AD authentication endpoints](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud#azure-ad-authentication-endpoints)
       - **Note:**  Microsoft personal accounts (MSA) scenarios are not supported in national clouds.
  
    -   `graphEndpoint` - is the Microsoft Graph endpoint for Microsoft cloud for US government.
           -  To find Microsoft Graph endpoints for all the National clouds, see [Microsoft Graph endpoints in National cloud](https://docs.microsoft.com/en-us/graph/deployments#microsoft-graph-and-graph-explorer-service-root-endpoints)

## .NET

MSAL .NET enables you to sign in users, acquire token and call Microsoft Graph API in National Clouds.

The following tutorial demonstrates how to build a .NET Core 2.2 MVC Web app that uses OpenID Connect to sign in users with their 'work and school' accounts in their organization belonging to national clouds.

- Follow [tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-4-Sovereign#build-an-aspnet-core-web-app-signing-in-users-in-sovereign-clouds-with-the-microsoft-identity-platform) to sign in users and acquire token
- Follow [tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-4-Sovereign-Call-MSGraph#using-the-microsoft-identity-platform-to-call-the-microsoft-graph-api-from-an-an-aspnet-core-2x-web-app-on-behalf-of-a-user-signing-in-using-their-work-and-school-account-in-microsoft-national-cloud) to call Microsoft Graph API 


## Next steps

### Learn more about

- [Azure Government](https://docs.microsoft.com/azure/azure-government/).
- [Azure China 21Vianet](https://docs.microsoft.com/azure/china/).
-  [Azure Germany](https://docs.microsoft.com/azure/germany/).