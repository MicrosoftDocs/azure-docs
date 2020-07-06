---
title: Diagnose errors with Azure AD connected service (Visual Studio)
description: The active directory connected service detected an incompatible authentication type
author: ghogen
manager: jillfra
ms.prod: visual-studio-windows
ms.technology: vs-azure
ms.workload: azure-vs
ms.topic: how-to
ms.date: 03/12/2018
ms.author: ghogen
ms.custom: aaddev, vs-azure
---
# Diagnosing errors with the Azure Active Directory Connected Service

While detecting previous authentication code, the Azure Active Directory connected service detected an incompatible authentication type.

To correctly detect previous authentication code in a project, the project must be rebuilt. If you see this error and you don't have a previous authentication code in your project, rebuild and try again.

## Project types

The connected service checks the type of project you’re developing so it can inject the right authentication logic into the project. If there's any controller that derives from `ApiController` in the project, the project is considered a WebAPI project. If there are only controllers that derive from `MVC.Controller` in the project, the project is considered an MVC project. The connected service doesn't support any other project type.

## Compatible authentication code

The connected service also checks for authentication settings that have been previously configured or are compatible with the service. If all settings are present, it's considered a re-entrant case, and the connected service opens display the settings.  If only some of the settings are present, it's considered an error case.

In an MVC project, the connected service checks for any of the following settings, which result from previous use of the service:

    <add key="ida:ClientId" value="" />
    <add key="ida:Tenant" value="" />
    <add key="ida:AADInstance" value="" />
    <add key="ida:PostLogoutRedirectUri" value="" />

Also, the connected service checks for any of the following settings in a Web API project, which result from previous use of the service:

    <add key="ida:ClientId" value="" />
    <add key="ida:Tenant" value="" />
    <add key="ida:Audience" value="" />

## Incompatible authentication code

Finally, the connected service attempts to detect versions of authentication code that have been configured with previous versions of Visual Studio. If you received this error, it means your project contains an incompatible authentication type. The connected service detects the following types of authentication from previous versions of Visual Studio:

* Windows Authentication
* Individual User Accounts
* Organizational Accounts

To detect Windows Authentication in an MVC project, the connected looks for the `authentication` element in your `web.config` file.

```xml
<configuration>
    <system.web>
        <authentication mode="Windows" />
    </system.web>
</configuration>
```

To detect Windows Authentication in a Web API project, the connected service looks for the `IISExpressWindowsAuthentication` element in your project's `.csproj` file:

```xml
<Project>
    <PropertyGroup>
        <IISExpressWindowsAuthentication>enabled</IISExpressWindowsAuthentication>
    </PropertyGroup>
</Project>
```

To detect Individual User Accounts authentication, the connected service looks for the package element in your `packages.config` file.

```xml
<packages>
    <package id="Microsoft.AspNet.Identity.EntityFramework" version="2.1.0" targetFramework="net45" />
</packages>
```

To detect an old form of Organizational Account authentication, the connected service looks for the following element in`web.config`:

```xml
<configuration>
    <appSettings>
        <add key="ida:Realm" value="***" />
    </appSettings>
</configuration>
```

To change the authentication type, remove the incompatible authentication type and try adding the connected service again.

For more information, see [Authentication Scenarios for Azure AD](authentication-scenarios.md).
