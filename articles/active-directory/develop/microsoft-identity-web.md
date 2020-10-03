---
title: Microsoft Identity Web authentication library overview
titleSuffix: Microsoft identity platform
description: Learn about Microsoft Identity Web, an authentication and authorization library for ASP.NET Core applications that integrate with Azure Active Directory and Microsoft Graph and other web APIs.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/09/2020
ms.author: jmprieur
ms.reviewer: marsma
ms.custom: "devx-track-csharp, aaddev"
# Customer intent: As an application developer, I want to learn how to add authentication to ASP.NET Core web apps and authorization to protected web APIs.
---

# Microsoft Identity Web authentication library

Microsoft Identity Web is a set of ASP.NET Core libraries that simplifies adding authentication and authorization support to web apps and web APIs integrating with the Microsoft identity platform. It provides a single-surface API convenience layer that ties together ASP.NET Core, its authentication middleware, and the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/azuread/microsoft-authentication-library-for-dotnet).

## Supported application scenarios

If you're building ASP.NET Core web apps or web APIs and want to use Azure AD or Azure AD B2C for identity and access management (IAM), we recommend using Microsoft Identity Web for all of these scenarios:

- [Web app that signs in users](scenario-web-app-sign-user-overview.md)
- [Web app that signs in users and calls a web API on their behalf](scenario-web-app-call-api-overview.md)
- [Protected web API that only authenticated users can access](scenario-protected-web-api-overview.md)
- [Protected web API that calls another (downstream) web API on behalf of the signed-in user](scenario-web-api-call-api-overview.md)

## Get Microsoft Identity Web

Microsoft Identity Web is available through three channels:

- [NuGet](#nuget)
- [.NET Core project templates](#project-templates)
- [GitHub](#github)

#### NuGet

Microsoft Identity Web is available on NuGet as a set of packages that provide modular functionality based on your app's needs. Use the .NET CLI's `dotnet add` command or Visual Studio's **NuGet Package Manager** to install the packages appropriate for your project:

- [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) - The main package. Required by all apps that use Microsoft Identity Web.
- [Microsoft.Identity.Web.UI](https://www.nuget.org/packages/Microsoft.Identity.Web.UI) - Optional. Adds UI for user sign-in and sign-out and an associated controller for web apps.
- [Microsoft.Identity.Web.MicrosoftGraph](https://www.nuget.org/packages/Microsoft.Identity.Web.MicrosoftGraph) - Optional. Provides simplified interaction with the Microsoft Graph API.

#### Project templates

Microsoft Identity Web project templates are included in .NET 5.0 and are available for download for ASP.NET Core 3.1 projects.

If you're using ASP.NET Core 3.1, install the templates with the .NET CLI:

```dotnetcli
dotnet new --install Microsoft.Identity.Web.ProjectTemplates::1.0.0
```

The following diagram shows a high-level view of the supported app types and their relevant arguments:

:::image type="content" source="media/microsoft-identity-web-overview/diagram-microsoft-identity-web-templates.png" alt-text="Diagram of the available dot net CLI project templates for Microsoft Identity Web ":::
<br /><sup><b>*</b></sup> `MultiOrg` is not supported with `webapi2`, but can be enabled in *appsettings.json* by setting tenant to `common` or `organizations`
<br /><sup><b>**</b></sup> `--calls-graph` is not supported for Azure AD B2C

This example .NET CLI command, taken from our [Blazor Server tutorial](tutorial-blazor-server.md), generates a new Blazor Server project that includes the right packages and starter code (placeholder values shown):

```dotnetcli
dotnet new blazorserver2 --auth SingleOrg --calls-graph --client-id "00000000-0000-0000-0000-000000000000" --tenant-id "11111111-1111-1111-1111-111111111111" --output my-blazor-app
```

#### GitHub

Microsoft Identity Web is an open-source project hosted on GitHub: <a href="https://github.com/AzureAD/microsoft-identity-web" target="_blank">AzureAD/microsoft-identity-web<span class="docon docon-navigate-external x-hidden-focus"></span></a>

The [repository wiki](https://github.com/AzureAD/microsoft-identity-web/wiki) contains additional documentation, and you can view, search, and [file issues](https://github.com/AzureAD/microsoft-identity-web/issues) if you need help or discover a bug.

## Features

The following table provides a feature comparison between what's provided by the default ASP.NET 3.1 project templates and those provided by Microsoft Identity Web.

| Feature                   | ASP.NET Core 3.1                       | with Microsoft Identity Web |
| ------------------------- | -------------------------------------- | --------------------------- |
| [Sign in users](scenario-web-app-sign-user-app-configuration.md) in web apps | Yes: Work or school accounts and B2C   | Yes: Work or school accounts, personal accounts, and B2C   |
| [Protect web APIs](scenario-protected-web-api-app-configuration.md#microsoftidentityweb)        | Yes: Work or school accounts and B2C   | Yes: Work or school accounts, personal accounts, and B2C |
| Issuer validation in multi-tenant apps        | No                                     | Yes for [all clouds](authentication-national-cloud.md) and [Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c)         |
| Web app/API [calls Microsoft graph](scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk)   | No                           | Yes                         |
| Web app/API [calls web API](scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk)   | No                                   | Yes                         |
| Supports [certificate credentials](ms-id-web-using-certificates.md#client-certificates)   | No                            | Yes, many means of describing the certificate source, including Azure Key Vault                        |
| [Incremental consent and conditional access](ms-id-web-handling-incremental-consent-conditional-access.md) support in web apps   | No                             | Yes in MVC, Razor pages and Blazor pages |
| [Token encryption certificates](ms-id-web-using-certificates.md#decryption-certificates) in web APIs | No            | Yes, many means of describing the certificate source |
| [Scopes/app role validation](scenario-protected-web-api-verification-scope-app-roles.md) in web APIs | No                        | Yes |
| [www-Authenticate headers generation](ms-id-web-handling-incremental-consent-conditional-access.md#handling-incremental-consent-or-conditional-access-in-web-apis) in web APIs | No               | Yes |

## Next steps

To see Microsoft Identity Web in action, try our Blazor Server tutorial:

[Tutorial: Create a Blazor Server app that uses the Microsoft identity platform for authentication](tutorial-blazor-server.md)