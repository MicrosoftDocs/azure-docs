---
title: Sign in users in your ASP.NET browserless app using Device Code flow - Prepare app
description: Learn about how to prepare an ASP.NET browserless app that signs in users by using Device Code flow.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/10/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my ASP.NET browserless app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your ASP.NET browserless app using Device Code flow - Prepare app

In this article, you create an ASP.NET browserless app project and organize all the folders and files you require. You also install the packages you need to help you with configuration and authentication.

## Prerequisites

Completion of the prerequisites and steps in the [Overview](./how-to-browserless-app-dotnet-sign-in-prepare-tenant.md) before proceeding.

## Create an ASP.NET browserless app

This how-to guide useS Visual Studio Code and .NET 7.0.

1. Open the [integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal).
1. Navigate to the folder where you want your project to live.
1. Initialize a .NET console app and navigate to its root folder

    ```dotnetcli
    dotnet new console -o MsIdBrowserlessApp
    cd MsIdBrowserlessApp
    ```

## Add packages
 
Install the following packages to help you handle app [configuration](/dotnet/core/extensions/configuration?source=recommendations). These packages are part of the [Microsoft.Extensions.Configuration](https://www.nuget.org/packages/Microsoft.Extensions.Configuration/) package.

- [*Microsoft.Extensions.Configuration*](/dotnet/api/microsoft.extensions.configuration)
- [*Microsoft.Extensions.Configuration.Json*](/dotnet/api/microsoft.extensions.configuration.json): JSON configuration provider implementation for `Microsoft.Extensions.Configuration`.
- [*Microsoft.Extensions.Configuration.Binder*](/dotnet/api/microsoft.extensions.configuration.configurationbinder): Functionality to bind an object to data in configuration providers for `Microsoft.Extensions.Configuration`.

Install the following package to help with authentication.

- [*Microsoft.Identity.Web*](/entra/msal/dotnet/microsoft-identity-web/) simplifies adding authentication and authorization support to apps that integrate with the Microsoft identity platform.


  ```dotnetcli
  dotnet add package Microsoft.Extensions.Configuration
  dotnet add package Microsoft.Extensions.Configuration.Json
  dotnet add package Microsoft.Extensions.Configuration.Binder
  dotnet add package Microsoft.Identity.Web
  ```

## Configure app registration details

1. In your code editor, create an *appsettings.json* file in the root folder of the app.

1. Add the following code to the *appsettings.json* file.
    
    ```json
    {
        "AzureAd": {
            "Authority": "https://<Enter_the_Tenant_Subdomain_Here>.ciamlogin.com/",
            "ClientId": "<Enter_the_Application_Id_Here>"
        }
    }
    ```

1. Replace `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.
 
1. Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain. For example, if your primary domain is *contoso.onmicrosoft.com*, replace `Enter_the_Tenant_Subdomain_Here` with *contoso*. If you don't have your primary domain, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

1. Add the following code to the *MsIdBrowserlessApp.csproj* file to instruct your app to copy the *appsettings.json* file to the output directory when the project is compiled.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk">
        ...

        <ItemGroup>
            <None Update="appsettings.json">
                <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
            </None>
        <ItemGroup>
    </Project>
    ```

## Next steps

> [!div class="nextstepaction"]
> [Sign in to your ASP.NET browserless app >](./how-to-browserless-app-dotnet-sign-in-sign-in.md)
