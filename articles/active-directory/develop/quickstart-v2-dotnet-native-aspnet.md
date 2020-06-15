---
title: Call an ASP.NET web API protected by Microsoft identity platform
description: In this quickstart, learn how to call an ASP.NET web API protected by Microsoft identity platform from a Windows Desktop (WPF) application. The WPF client authenticates a user, requests an access token, and calls the web API.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 12/12/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET
#Customer intent: As an application developer, I want to know how to set up OpenId Connect authentication in a web application built using Node.js with Express.
---

# Quickstart: Call an ASP.NET web API protected by Microsoft identity platform

In this quickstart, you expose a web API and protect it so that only authenticated user can access it. This sample shows how to expose an ASP.NET web API so it can accept tokens issued by personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has integrated with Microsoft identity platform.

The sample also includes a Windows Desktop application (WPF) client that demonstrates how you can request an access token to access a web API.

## Prerequisites

To run this sample, you will need the following:

* Visual Studio 2017 or 2019.  Download [Visual Studio for free](https://www.visualstudio.com/downloads/).

* Either a [Microsoft account](https://www.outlook.com) or [ Office 365 Developer Program](/office/developer-program/office-365-developer-program)

## Download or clone this sample

You can clone this sample from your shell or command line:

  ```console
  git clone https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet.git
  ```

Or, you can [download the sample as a ZIP file](https://github.com/AzureADQuickStarts/AppModelv2-NativeClient-DotNet/archive/complete.zip).

## Register your web API in the application registration portal

### Choose the Azure AD tenant where you want to create your applications

If you want to register your apps manually, as a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account is present in more than one Azure AD tenant, select your profile at the top-right corner in the menu on top of the page, and then **switch directory**.
   Change your portal session to the desired Azure AD tenant.

### Register the service app (TodoListService)

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `AppModelv2-NativeClient-DotNet-TodoListService`.
   - Change **Supported account types** to **Accounts in any organizational directory**.
   - Select **Register** to create the application.

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the Visual Studio configuration file for this project (`ClientId` in `TodoListService\Web.config`).
1. Select the **Expose an API** section, and:
   - Select **Add a scope**
   - accept the proposed Application ID URI (api://{clientId}) by selecting **Save and Continue**
   - Enter the following parameters:
     - for **Scope name** use `access_as_user`
     - Ensure the **Admins and users** option is selected for **Who can consent**
     - in **Admin consent display name** type `Access TodoListService as a user`
     - in **Admin consent description** type `Accesses the TodoListService web API as a user`
     - in **User consent display name** type `Access TodoListService as a user`
     - in **User consent description** type `Accesses the TodoListService web API as a user`
     - Keep **State** as **Enabled**
     - Select **Add scope**

### Configure the service project to match the registered web API

1. Open the solution in Visual Studio and then open the **Web.config** file under the root of **TodoListService** project.
1. Replace the value of `ida:ClientId` parameter with the **Client ID (Application ID)** from the application you just registered in the Application Registration Portal.

### Add the new scope to the *TodoListClient*`s app.config

1. Open the **app.config** file located in **TodoListClient** project's root folder and then paste **Application ID** from the application you just registered for your *TodoListService* under `TodoListServiceScope` parameter, replacing the string `{Enter the Application ID of your TodoListService from the app registration portal}`.

   > Note: Make sure it uses the following format:
   >
   > `api://{TodoListService-Application-ID}/access_as_user`
   >
   >(where {TodoListService-Application-ID} is the GUID representing the Application ID for your TodoListService).

## Register the client app (TodoListClient)

In this step, you configure your *TodoListClient* project by registering a new application in the Application registration portal. In the cases where the client and server are considered *the same application* you may also just reuse the same application registered in the 'Step 2.'. Using the same application is needed if you want users to sign in with Microsoft personal accounts

### Register the *TodoListClient* application in the *Application registration portal*

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `NativeClient-DotNet-TodoListClient`.
   - Change **Supported account types** to **Accounts in any organizational directory**.
   - Select **Register** to create the application.
1. From the app's Overview page, select the **Authentication** section.
   - In the **Redirect URIs** | **Suggested Redirect URIs for public clients (mobile, desktop)** section, check **https://login.microsoftonline.com/common/oauth2/nativeclient**
   - Select **Save**.
1. Select the **API permissions** section
   - Click the **Add a permission** button and then,
   - Select the **My APIs** tab.
   - In the list of APIs, select the `AppModelv2-NativeClient-DotNet-TodoListService API`, or the name you entered for the web API.
   - Check the **access_as_user** permission if it's not already checked. Use the search box if necessary.
   - Select the **Add permissions** button

### Configure your *TodoListClient* project

1. In the *Application registration portal*, in the **Overview** page copy the value of the **Application (client) ID**
1. Open the **app.config** file located in the **TodoListClient** project's root folder and then paste the value in the `ida:ClientId` parameter value

## Run your project

1. Press `<F5>` to run your project. Your *TodoListClient* should open.
1. Select **Sign in** at the top right and sign in with the same user you have used to register your application, or a user in the same directory.
1. At this point, if you are signing in for the first time, you may be prompted to consent to *TodoListService* Web Api.
1. The sign-in also request the access token to the *access_as_user* scope to access *TodoListService* Web Api and manipulate the *To-Do* list.

## Pre-authorize your client application

One of the ways to allow users from other directories to access your web API is by *pre-authorizing* the client applications to access your web API by adding the Application IDs from client applications in the list of *pre-authorized* applications for your web API. By adding a pre-authorized client, you will not require user to consent to use your web API. Follow the steps below to pre-authorize your Web Application::

1. Go back to the *Application registration portal* and open the properties of your **TodoListService**.
1. In the **Expose an API** section, click on **Add a client application** under the *Authorized client applications* section.
1. In the *Client ID* field, paste the application ID of the `TodoListClient` application.
1. In the *Authorized scopes* section, select the scope for this web API `api://<Application ID>/access_as_user`.
1. Press the **Add application** button at the bottom of the page.

## Run your project

1. Press `<F5>` to run your project. Your *TodoListClient* should open.
1. Select **Sign in** at the top right (or Clear Cache/Sign-in) and then sign-in either using a personal Microsoft account (live.com or hotmail.com) or work or school account.

## Optional: Restrict sign-in access to your application

By default, when you download this code sample and configure the application to use the Azure Active Directory v2 endpoint following the preceding steps, both personal accounts - like outlook.com, live.com, and others - as well as Work or school accounts from any organizations that are integrated with Azure AD can request tokens and access your web API.

To restrict who can sign in to your application, use one of the options:

### Option 1: Restrict access to a single organization (single-tenant)

You can restrict sign-in access for your application to only user accounts that are in a single Azure AD tenant - including *guest accounts* of that tenant. This scenario is a common for *line-of-business applications*:

1. Open the **App_Start\Startup.Auth** file, and change the value of the metadata endpoint that's passed into the `OpenIdConnectSecurityTokenProvider` to `"https://login.microsoftonline.com/{Tenant ID}/v2.0/.well-known/openid-configuration"` (you can also use the Tenant Name, such as `contoso.onmicrosoft.com`).
2. In the same file, set the `ValidIssuer` property on the `TokenValidationParameters` to `"https://sts.windows.net/{Tenant ID}/"` and the `ValidateIssuer` argument to `true`.

### Option 2: Use a custom method to validate issuers

You can implement a custom method to validate issuers by using the **IssuerValidator** parameter. For more information about how to use this parameter, read about the [TokenValidationParameters class](/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters?view=azure-dotnet).

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps
Learn more about the protected web API scenario that the Microsoft identity platform supports:
> [!div class="nextstepaction"]
> [Protected web API scenario](scenario-protected-web-api-overview.md)
