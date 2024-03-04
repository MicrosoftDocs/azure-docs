---
title: Microsoft Identity Web authentication library overview
description: Learn about Microsoft Identity Web, an authentication and authorization library for ASP.NET Core applications that integrate with Azure Active Directory, Azure AD B2C, and Microsoft Graph and other web APIs.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/08/2022
ms.author: henrymbugua
ms.reviewer: jmprieur
ms.custom: devx-track-csharp, aaddev, engagement-fy23
# Customer intent: As an application developer, I want to learn how to add authentication to ASP.NET Core web apps and authorization to protected web APIs.
---

# Microsoft Identity Web authentication library

Microsoft Identity Web is a set of ASP.NET Core libraries that simplifies adding authentication and authorization support to web apps and web APIs integrating with the Microsoft identity platform. It provides a single-surface API convenience layer that ties together ASP.NET Core, its authentication middleware, and the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/azuread/microsoft-authentication-library-for-dotnet). It can be installed via NuGet or by using a Visual Studio project template to create a new app project


## Supported application scenarios

When building ASP.NET Core web apps or web APIs that use Azure Active Directory (Azure AD) or Azure AD B2C for identity and access management (IAM), Microsoft Identity Web is recommended for these scenarios:

- [Web app that signs in users](scenario-web-app-sign-user-overview.md)
- [Web app that signs in users and calls a web API on their behalf](scenario-web-app-call-api-overview.md)
- [Protected web API that only authenticated users can access](scenario-protected-web-api-overview.md)
- [Protected web API that calls another (downstream) web API on behalf of the signed-in user](scenario-web-api-call-api-overview.md)

## Install from NuGet

Microsoft Identity Web is available on NuGet as a set of packages that provide modular functionality based on application requirements. Use the .NET CLI's `dotnet add` command or Visual Studio's **NuGet Package Manager** to install the appropriate packages:

- [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) - The main package. Required by all apps that use Microsoft Identity Web.
- [Microsoft.Identity.Web.UI](https://www.nuget.org/packages/Microsoft.Identity.Web.UI) - Optional. Adds UI for user sign-in and sign-out and an associated controller for web apps.
- [Microsoft.Identity.Web.GraphServiceClient](https://www.nuget.org/packages/Microsoft.Identity.Web.GraphServiceClient) - Optional. Provides simplified interaction with the Microsoft Graph API.
- [Microsoft.Identity.Web.GraphServiceClientBeta](https://www.nuget.org/packages/Microsoft.Identity.Web.GraphServiceClientBeta) - Optional. Provides simplified interaction with the Microsoft Graph API [beta endpoint](/graph/api/overview?view=graph-rest-beta&preserve-view=true).

## Install by using a Visual Studio project template

Several project templates that use *Microsoft.Identity.Web* are included in .NET SDK versions 6.0 and above.

### .NET 6.0+ - Project templates included

The Microsoft Identity Web project templates are included in .NET SDK versions 6.0 and above.

In the following example, .NET CLI command creates a Blazor Server project that includes Microsoft Identity Web.

```dotnetcli
dotnet new blazorserver --auth SingleOrg --calls-graph --client-id "00000000-0000-0000-0000-000000000000" --tenant-id "11111111-1111-1111-1111-111111111111" --output my-blazor-app
```

Don't append a `2` to the application type argument, `blazorserver` in the example, because templates included in .NET SDK 6.0+ are being used. 

## Next steps

To see Microsoft Identity Web in action, try our Blazor Server tutorial:

[Tutorial: Create a Blazor Server app that uses the Microsoft identity platform for authentication](tutorial-blazor-server.md)

The Microsoft Identity Web wiki on GitHub contains extensive reference documentation for various aspects of the library. For example, certificate usage, incremental consent, and Conditional Access reference can be found here:

- <a href="https://github.com/AzureAD/microsoft-identity-web/wiki/Using-certificates" target="_blank">Using certificates with Microsoft.Identity.Web</a> (GitHub)
- <a href="https://github.com/AzureAD/microsoft-identity-web/wiki/Managing-incremental-consent-and-conditional-access" target="_blank">Incremental consent and Conditional Access</a> (GitHub)

<!-- LINKS -->
<!--  [miw-certs]: microsoft-identity-web-certificates.md  -->
<!--  [miw-certs-decrypt]: microsoft-identity-web-certificates.md#decryption-certificates  -->
<!--  [miw-inc-consent-ca-header]: microsoft-identity-web-consent-conditional-access.md#handling-incremental-consent-or-conditional-access-in-web-apis  -->
<!--  [miw-inc-consent-ca]: microsoft-identity-web-consent-conditional-access.md  -->
[scenario-api-call-api]: scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk
[scenario-api-call-graph]: scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk
[scenario-api-validation]: scenario-protected-web-api-verification-scope-app-roles.md
