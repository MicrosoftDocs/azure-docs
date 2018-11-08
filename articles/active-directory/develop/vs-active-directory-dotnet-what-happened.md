---
title: Changes made to a MVC project when you connect to Azure AD
description: Describes what happens to your MVC project when you connect to Azure AD by using Visual Studio connected services
services: active-directory
author: ghogen
manager: douge
ms.assetid: 8b24adde-547e-4ffe-824a-2029ba210216
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 03/12/2018
ms.author: ghogen
ms.custom: aaddev, vs-azure
---
# What happened to my MVC project (Visual Studio Azure Active Directory connected service)?

> [!div class="op_single_selector"]
> - [Getting Started](vs-active-directory-dotnet-getting-started.md)
> - [What Happened](vs-active-directory-dotnet-what-happened.md)

This article identifies the exact changes made to am ASP.NET MVC project when adding the [Azure Active Directory connected service using Visual Studio](vs-active-directory-add-connected-service.md).

For information on working with the connected service, see [Getting Started](vs-active-directory-dotnet-getting-started.md).

## Added references

Affects the project file *.NET references) and `packages.config` (NuGet references).

| Type | Reference |
| --- | --- |
| .NET; NuGet | Microsoft.IdentityModel.Protocol.Extensions |
| .NET; NuGet | Microsoft.Owin |
| .NET; NuGet | Microsoft.Owin.Host.SystemWeb |
| .NET; NuGet | Microsoft.Owin.Security |
| .NET; NuGet | Microsoft.Owin.Security.Cookies |
| .NET; NuGet | Microsoft.Owin.Security.OpenIdConnect |
| .NET; NuGet | Owin |
| .NET        | System.IdentityModel |
| .NET; NuGet | System.IdentityModel.Tokens.Jwt |
| .NET        | System.Runtime.Serialization |

Additional references if you selected the **Read directory data** option:

| Type | Reference |
| --- | --- |
| .NET; NuGet | EntityFramework |
| .NET        | EntityFramework.SqlServer (Visual Studio 2015 only) |
| .NET; NuGet | Microsoft.Azure.ActiveDirectory.GraphClient |
| .NET; NuGet | Microsoft.Data.Edm |
| .NET; NuGet | Microsoft.Data.OData |
| .NET; NuGet | Microsoft.Data.Services.Client |
| .NET; NuGet | Microsoft.IdentityModel.Clients.ActiveDirectory |
| .NET        | Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms (Visual Studio 2015 only) |
| .NET; NuGet | System.Spatial |

The following references are removed (ASP.NET 4 projects only, as in Visual Studio 2015):

| Type | Reference |
| --- | --- |
| .NET; NuGet | Microsoft.AspNet.Identity.Core |
| .NET; NuGet | Microsoft.AspNet.Identity.EntityFramework |
| .NET; NuGet | Microsoft.AspNet.Identity.Owin |

## Project file changes

- Set the property `IISExpressSSLPort` to a distinct number.
- Set the property `WebProject_DirectoryAccessLevelKey` to 0, or 1 if you selected the **Read directory data** option.
- Set the property `IISUrl` to `https://localhost:<port>/` where `<port>` matches the `IISExpressSSLPort` value.

## web.config or app.config changes

- Added the following configuration entries:

    ```xml
    <appSettings>
        <add key="ida:ClientId" value="<ClientId from the new Azure AD app>" />
        <add key="ida:AADInstance" value="https://login.microsoftonline.com/" />
        <add key="ida:Domain" value="<your selected Azure domain>" />
        <add key="ida:TenantId" value="<the Id of your selected Azure AD tenant>" />
        <add key="ida:PostLogoutRedirectUri" value="<project start page, such as https://localhost:44335>" />
    </appSettings>
    ```

- Added `<dependentAssembly>` elements under the `<runtime><assemblyBinding>` node for `System.IdentityModel.Tokens.Jwt` and `Microsoft.IdentityModel.Protocol.Extensions`.

Additional changes if you selected the **Read directory data** option:

- Added the following configuration entry under `<appSettings>`:

    ```xml
    <add key="ida:ClientSecret" value="<Azure AD app's new client secret>" />
    ```

- Added the following elements under `<configuration>`; values for the project-mdf-file and project-catalog-id will vary:

    ```xml
    <configSections>
      <!-- For more information on Entity Framework configuration, visit http://go.microsoft.com/fwlink/?LinkID=237468 -->
      <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />
    </configSections>

    <connectionStrings>
      <add name="DefaultConnection" connectionString="Data Source=(localdb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\<project-mdf-file>.mdf;Initial Catalog=<project-catalog-id>;Integrated Security=True" providerName="System.Data.SqlClient" />
    </connectionStrings>

    <entityFramework>
      <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
        <parameters>
          <parameter value="mssqllocaldb" />
        </parameters>
      </defaultConnectionFactory>
      <providers>
        <provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer" />
      </providers>
    </entityFramework>
    ```

- Added `<dependentAssembly>` elements under the `<runtime><assemblyBinding>` node for `Microsoft.Data.Services.Client`, `Microsoft.Data.Edm`, and `Microsoft.Data.OData`.

## Code changes and additions

- Added the `[Authorize]` attribute to `Controllers/HomeController.cs` and any other existing controllers.

- Added an authentication startup class, `App_Start/Startup.Auth.cs`, containing startup logic for Azure AD authentication. If you selected the **Read directory data** option, this file also contains code to receive an OAuth code and exchange it for an access token.

- Added a controller class, `Controllers/AccountController.cs`, containing `SignIn` and `SignOut` methods.

- Added a partial view, `Views/Shared/_LoginPartial.cshtml`, containing an action link for `SignIn` and `SignOut`.

- Added a partial view, `Views/Account/SignoutCallback.cshtml`, containing HTML for sign-out UI.

- Updated the `Startup.Configuration` method to include a call to `ConfigureAuth(app)` if the class already existed; otherwise added a `Startup` class that includes calls the method.

- Added `Connected Services/AzureAD/ConnectedService.json` (Visual Studio 2017) or `Service References/Azure AD/ConnectedService.json` (Visual Studio 2015), containing information that Visual Studio uses to track the addition of the connected service.

- If you selected the **Read directory data** option, added `Models/ADALTokenCache.cs` and `Models/ApplicationDbContext.cs` to support token caching. Also added an additional controller and view to illustrate accessing user profile information using Azure graph APIs: `Controllers/UserProfileController.cs`, `Views/UserProfile/Index.cshtml`, and `Views/UserProfile/Relogin.cshtml`

### File backup (Visual Studio 2015)

When adding the connected service, Visual Studio 2015 backs up changed and removed files. All affected files are saved in the folder `Backup/AzureAD`. Visual Studio 2017 does not create backups.

- `Startup.cs`
- `App_Start\IdentityConfig.cs`
- `App_Start\Startup.Auth.cs`
- `Controllers\AccountController.cs`
- `Controllers\ManageController.cs`
- `Models\IdentityModels.cs`
- `Models\ManageViewModels.cs`
- `Views\Shared\_LoginPartial.cshtml`

## Changes on Azure

- Created an Azure AD Application in the domain that you selected when adding the connected service.
- Updated the app to include the **Read directory data** permission if that option was selected.

[Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory/).

## Next steps

- [Authentication scenarios for Azure Active Directory](authentication-scenarios.md)
- [Add sign-in with Microsoft to an ASP.NET web app](quickstart-v1-aspnet-webapp.md)
