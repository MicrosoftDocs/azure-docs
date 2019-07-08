---
title: Build a .NET web API that integrates with Azure AD for authentication and authorization | Microsoft Docs
description: How to build a .NET MVC web API that integrates with Azure AD for authentication and authorization.
services: active-directory
documentationcenter: .net
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 67e74774-1748-43ea-8130-55275a18320f
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/21/2019
ms.author: ryanwi
ms.reviewer: jmprieur, andret
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to build a .NET MVC web API that integrates with Azure AD for authentication and authorization.
ms.collection: M365-identity-device-management
---

# Quickstart: Build a .NET web API that integrates with Azure AD for authentication and authorization

[!INCLUDE [active-directory-develop-applies-v1](../../../includes/active-directory-develop-applies-v1.md)]

If you’re building an application that provides access to protected resources, you need to know how to prevent unwarranted access to those resources. Azure Active Directory (Azure AD) makes it simple and straightforward to help protect a web API by using OAuth 2.0 bearer access tokens with only a few lines of code.

In ASP.NET web apps, you can accomplish this protection by using the Microsoft implementation of the community-driven OWIN middleware included in .NET Framework 4.5. Here you'll use OWIN to build a "To Do List" web API that:

* Designates which APIs are protected.
* Validates that the web API calls contain a valid access token.

In this quickstart, you'll build the To Do List API and learn how to:

1. Register an application with Azure AD.
2. Set up the app to use the OWIN authentication pipeline.
3. Configure a client application to call the web API.

## Prerequisites

To get started, complete these prerequisites:

* [Download the app skeleton](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/complete.zip). Each is a Visual Studio 2013 solution.
* Have an Azure AD tenant in which to register your application. If you don't have one already, [learn how to get one](quickstart-create-new-tenant.md).

## Step 1: Register an application with Azure AD

To help secure your application, you first need to create an application in your tenant and provide Azure AD with a few key pieces of information.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Choose your Azure AD tenant by selecting your account in the top right corner of the page, select the **Switch directory** navigation, and then select the appropriate tenant.
    * Skip this step, if you've only one Azure AD tenant under your account or if you've already selected the appropriate Azure AD tenant.

3. In the left-hand navigation pane, select **Azure Active Directory**.
4. Select **App registrations**, and then select **New registration**.
5. When the **Register an application** page appears, enter a name for your application.
Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
6. Select the **Web** platform under the **Redirect URI** section and set the value to `https://localhost:44321/` (the location to which Azure AD will return tokens).
7. When finished, select **Register**. On the app **Overview** page, note down the **Application (client) ID** value.
6. Select **Expose an API**, then update the Application ID URI by clicking **Set**. Enter a tenant-specific identifier. For example, enter `https://contoso.onmicrosoft.com/TodoListService`.
7. Save the configuration. Leave the portal open, because you'll also need to register your client application shortly.

## Step 2: Set up the app to use the OWIN authentication pipeline

To validate incoming requests and tokens, you need to set up your application to communicate with Azure AD.

1. To begin, open the solution and add the OWIN middleware NuGet packages to the TodoListService project by using the Package Manager Console.

    ```
    PM> Install-Package Microsoft.Owin.Security.ActiveDirectory -ProjectName TodoListService
    PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TodoListService
    ```

2. Add an OWIN Startup class to the TodoListService project called `Startup.cs`.  Right-click the project, select **Add > New Item**, and then search for **OWIN**. The OWIN middleware will invoke the `Configuration(…)` method when your app starts.

3. Change the class declaration to `public partial class Startup`. We’ve already implemented part of this class for you in another file. In the `Configuration(…)` method, make a call to `ConfigureAuth(…)` to set up authentication for your web app.

    ```csharp
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
    ```

4. Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(…)` method. The parameters that you provide in `WindowsAzureActiveDirectoryBearerAuthenticationOptions` will serve as coordinates for your app to communicate with Azure AD. To use them you'll need to use classes in the `System.IdentityModel.Tokens` namespace.

    ```csharp
    using System.IdentityModel.Tokens;
    ```

    ```csharp
    public void ConfigureAuth(IAppBuilder app)
    {
        app.UseWindowsAzureActiveDirectoryBearerAuthentication(
            new WindowsAzureActiveDirectoryBearerAuthenticationOptions
            {
                 Tenant = ConfigurationManager.AppSettings["ida:Tenant"],
                 TokenValidationParameters = new TokenValidationParameters
                 {
                    ValidAudience = ConfigurationManager.AppSettings["ida:Audience"]
                 }
            });
    }
    ```

5. Use the `[Authorize]` attributes to help protect your controllers and actions with JSON Web Token (JWT) bearer authentication. Decorate the `Controllers\TodoListController.cs` class with an authorize tag, which forces the user to sign in before accessing that page.

    ```csharp
    [Authorize]
    public class TodoListController : ApiController
    {
    ```

    When an authorized caller successfully invokes one of the `TodoListController` APIs, the action might need access to information about the caller. OWIN provides access to the claims inside the bearer token via the `ClaimsPrincpal` object.  

6. A common requirement for web APIs is to validate the "scopes" present in the token to ensure that the user has consented to the permissions required to access the To Do List Service.

    ```csharp
    public IEnumerable<TodoItem> Get()
    {
        // user_impersonation is the default permission exposed by applications in Azure AD
        if (ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value != "user_impersonation")
        {
            throw new HttpResponseException(new HttpResponseMessage {
              StatusCode = HttpStatusCode.Unauthorized,
              ReasonPhrase = "The Scope claim does not contain 'user_impersonation' or scope claim not found"
            });
        }
        ...
    }
    ```

7. Open the `web.config` file in the root of the TodoListService project, and enter your configuration values in the `<appSettings>` section.
    * `ida:Tenant` is the name of your Azure AD tenant--for example, contoso.onmicrosoft.com.
    * `ida:Audience` is the App ID URI of the application that you entered in the Azure portal.

## Step 3: Configure a client application and run the service

Before you can see the To Do List Service in action, you need to configure the To Do List client so it can get tokens from Azure AD and make calls to the service.

1. Go back to the [Azure portal](https://portal.azure.com).
1. Create a new application registration in your Azure AD tenant.  Enter a **Name** that describes your application to users, enter `http://TodoListClient/` for the **Redirect URI** value, and select **Public client (mobile and desktop)** in the dropdown.
1. After you finish registration, Azure AD assigns a unique application ID to your app. You’ll need this value in the next steps, so copy it from the application page.
1. Select **API permissions**, then **Add a permission**.  Locate and select the To Do List Service, add the **user_impersonation Access TodoListService** permission under **Delegated Permissions**, and then select **Add permissions**.
1. In Visual Studio, open `App.config` in the TodoListClient project, and then enter your configuration values in the `<appSettings>` section.

    * `ida:Tenant` is the name of your Azure AD tenant, for example, contoso.onmicrosoft.com.
    * `ida:ClientId` is the app ID that you copied from the Azure portal.
    * `todo:TodoListResourceId` is the App ID URI of the To Do List Service application that you entered in the Azure portal.

1. Clean, build, and run each project.
1. If you haven’t done so already, create a new user in your tenant with a *.onmicrosoft.com domain.
1. Sign in to the To Do List client with that user, and add some tasks to the user's to-do list.

## Next steps

* For reference, download the completed sample (without your configuration values) from [GitHub](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/complete.zip). You can now move on to other identity scenarios.
