---
title: Microsoft identity web - Overview
titleSuffix: Microsoft identity platform
description: Learn about Microsoft identity web, the glue between ASP.NET Core, authentication middleware, and MSAL.NET.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 09/24/2020
ms.author: jmprieur
ms.reviewer: marsma
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn how to build ASP.NET Core web apps and web api calling or not downstream apis.
---

# Microsoft.Identity.Web - Overview

_Microsoft.Identity.Web_ is an authentication library available as a set of NuGet packages. You want to use _Microsoft.Identity.Web_ when developing an ASP.NET Core web app or web API involving authentication with the Microsoft Identity Platform. The library provides the glue between ASP.NET Core, the authentication middleware, and the [Microsoft Authentication Library (MSAL)](msal-overview.md) for [.NET](https://github.com/azuread/microsoft-authentication-library-for-dotnet). It allows for a clearer, more robust developer experience and leverages the power of the Microsoft identity platform and Azure AD B2C.

Microsoft.Identity.Web proposes the following NuGet packages:

- [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web), the main package
- [Microsoft.Identity.Web.UI](https://www.nuget.org/packages/Microsoft.Identity.Web.UI), brings UI to sign in and sign out users, and an associated controller for web apps
- [Microsoft.Identity.Web.MicrosoftGraph](https://www.nuget.org/packages/Microsoft.Identity.Web.MicrosoftGraph), does the glue with the Graph SDK for .NET.

## Application types and scenarios

Microsoft Identity Web can be used in the following scenarios when the technology you choose is ASP.NET Core. 

* [Web app signing in users](scenario-web-app-sign-user-overview.md)
* [Web application signing in a user and calling a web API on behalf of the user](scenario-web-app-call-api-overview.md)
* [Protecting a web API so only authenticated users can access it](scenario-protected-web-api-overview.md)
* [Web API calling another downstream web API on behalf of the signed-in user](scenario-web-api-call-api-overview.md)

These scenarios are enabled both for Azure AD and Azure AD B2C applications. See them for details on how Microsoft.Identity.Web is used specifically in these scenarios.

## Why use Microsoft Identity Web?

When  creating a web app from an ASP.NET core 3.1 project templates (for instance, `dotnet new webapp --auth SingleOrg`), the application that is produced targets the Azure AD v1.0 endpoint, which means sign-in with a work or school account is the only option for customers. Microsoft.Identity.Web provides access to the Microsoft identity platform (formerly Azure AD v2.0) endpoint. It also provides more complete security features such as issuer validation happening in multi-tenant applications. The web apps and web APIs leveraging that are created don't call downstream web APIs, if a developer wanted to call a downstream web API, they would need to leverage MSAL on their own.

The table below show the features brought by Microsoft Identity web on top of the ASP.NET Core web apps and web APIs.

| Feature                   | ASP.NET Core 3.1                       | with Microsoft.Identity.Web |
| ------------------------- | -------------------------------------- | --------------------------- |
| [Sign in users](scenario-web-app-sign-user-app-configuration.md) in web apps | yes: Work or school accounts and B2C   | yes: Work or school accounts, personal accounts, and B2C   |
| [Protect web APIs](scenario-protected-web-api-app-configuration.md#microsoftidentityweb)        | yes: Work or school accounts and B2C   | yes: Work or school accounts, personal accounts, and B2C |
| Issuer validation in multi-tenant apps        | no                                     | yes for [all clouds](authentication-national-cloud.md) and [Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c)         |
| web app/API [calls Microsoft graph](scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk)   | no                           | yes                         |
| web app/API [calls web API](scenario-web-api-call-api-call-api.md#option-1-call-microsoft-graph-with-the-sdk)   | no                                   | yes                         |
| Supports [certificate credentials](ms-id-web-using-certificates.md#client-certificates)   | no                            | yes, many means of describing the certificate source, including Azure Key Vault                        |
| [Incremental consent and conditional access](ms-id-web-handling-incremental-consent-conditional-access.md) support in web apps   | no                             | yes in MVC, Razor pages and Blazor pages |
| Supports [token encryption certificates](ms-id-web-using-certificates.md#decryption-certificates) in web APIs | no            | yes, many means of describing the certificate source |
| [Scopes/app role validation](scenario-protected-web-api-verification-scope-app-roles.md) in web APIs | no                        | yes |
| [www-Authenticate headers generation](ms-id-web-handling-incremental-consent-conditional-access.md#handling-incremental-consent-or-conditional-access-in-web-apis) in web APIs | no               | yes |

## Microsoft.Identity.Web provides project templates for ASP.NET Core 3.1

Microsoft.Identity.Web also provides .NET Core project templates that bring to ASP.NET Core 3.1 the features above. If you're using .NET 5.0, the web templates already reference Microsoft.Identity.Web.

Here are the available project templates: 

![image](https://user-images.githubusercontent.com/13203188/93343955-603e4100-f831-11ea-9cd8-7025f6361453.png)