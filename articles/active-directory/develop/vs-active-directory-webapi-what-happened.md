---
title: Changes made to WebAPI projects when connecting to Azure AD
description: Describes what happens to your WebAPI project when you connect to Azure AD using Visual Studio
author: ghogen
manager: jillfra
ms.workload: azure-vs
ms.prod: visual-studio-windows
ms.technology: vs-azure
ms.topic: conceptual
ms.date: 03/12/2018
ms.author: ghogen
ms.custom: aaddev, vs-azure
---
# What happened to my WebAPI project (Visual Studio Azure Active Directory connected service)

> [!div class="op_single_selector"]
> - [Getting Started](vs-active-directory-webapi-getting-started.md)
> - [What Happened](vs-active-directory-webapi-what-happened.md)

This article identifies the exact changes made to ASP.NET WebAPI, ASP.NET Single-Page Application, and ASP.NET Azure API projects when adding the [Azure Active Directory connected service using Visual Studio](vs-active-directory-add-connected-service.md). Also applies to the ASP.NET Azure Mobile Service projects in Visual Studio 2015.

For information on working with the connected service, see [Getting Started](vs-active-directory-webapi-getting-started.md).

## Added references

Affects the project file *.NET references) and `packages.config` (NuGet references).

| Type | Reference |
| --- | --- |
| .NET; NuGet | Microsoft.Owin |
| .NET; NuGet | Microsoft.Owin.Host.SystemWeb |
| .NET; NuGet | Microsoft.Owin.Security |
| .NET; NuGet | Microsoft.Owin.Security.ActiveDirectory |
| .NET; NuGet | Microsoft.Owin.Security.Jwt |
| .NET; NuGet | Microsoft.Owin.Security.OAuth |
| .NET; NuGet | Owin |
| .NET; NuGet | System.IdentityModel.Tokens.Jwt |

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
| .NET        | Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms<br>(Visual Studio 2015 only) |
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
        <add key="ida:Tenant" value="<your selected Azure domain>" />
        <add key="ida:Audience" value="<your selected domain + / + project name>" />
    </appSettings>
    ```

- Visual Studio 2017 only: Also added the following entry under `<appSettings>`"

    ```xml
    <add key="ida:MetadataAddress" value="<domain URL + /federationmetadata/2007-06/federationmetadata.xml>" />
    ```

- Added `<dependentAssembly>` elements under the `<runtime><assemblyBinding>` node for `System.IdentityModel.Tokens.Jwt`.

- If you selected the **Read directory data** option, added the following configuration entry under `<appSettings>`:

    ```xml
    <add key="ida:Password" value="<Your Azure AD app's new password>" />
    ```

## Code changes and additions

- Added the `[Authorize]` attribute to `Controllers/ValueController.cs` and any other existing controllers.

- Added an authentication startup class, `App_Start/Startup.Auth.cs`, containing startup logic for Azure AD authentication, or modified it accordingly. If you selected the **Read directory data** option, this file also contains code to receive an OAuth code and exchange it for an access token.

- (Visual Studio 2015 with ASP.NET 4 app only) Removed `App_Start/IdentityConfig.cs` and added `Controllers/AccountController.cs`, `Models/IdentityModel.cs`, and `Providers/ApplicationAuthProvider.cs`.

- Added `Connected Services/AzureAD/ConnectedService.json` (Visual Studio 2017) or `Service References/Azure AD/ConnectedService.json` (Visual Studio 2015), containing information that Visual Studio uses to track the addition of the connected service.

### File backup (Visual Studio 2015)

When adding the connected service, Visual Studio 2015 backs up changed and removed files. All affected files are saved in the folder `Backup/AzureAD`. Visual Studio 2017 does not create backups.

- `Startup.cs`
- `App_Start\IdentityConfig.cs`
- `App_Start\Startup.Auth.cs`
- `Controllers\AccountController.cs`
- `Controllers\ManageController.cs`
- `Models\IdentityModels.cs`
- `Models\ApplicationOAuthProvider.cs`

## Changes on Azure

- Created an Azure AD Application in the domain that you selected when adding the connected service.
- Updated the app to include the **Read directory data** permission if that option was selected.

[Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory/).

## Next steps

- [Authentication scenarios for Azure Active Directory](authentication-scenarios.md)
- [Add sign-in with Microsoft to an ASP.NET web app](quickstart-v2-aspnet-webapp.md)
