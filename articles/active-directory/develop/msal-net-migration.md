---
title: Migrating to MSAL.NET and Microsoft.Identity.Web
description: Learn why and how to migrate from  Azure AD Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET) or Microsoft.Identity.Web
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 06/08/2021
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev, has-adal-ref"
#Customer intent: As an application developer, I want to learn why and how to migrate from ADAL.NET and MSAL.NET or Microsoft.Identity.Web libraries.
---

# Migrating applications to MSAL.NET or Microsoft.Identity.Web

## Why migrate to MSAL.NET or Microsoft.Identity.Web

Both the Microsoft Authentication Library for .NET (MSAL.NET) and Azure AD Authentication Library for .NET (ADAL.NET) are used to authenticate Azure AD entities and request tokens from Azure AD. Up until now, most developers have requested tokens from Azure AD for developers platform (v1.0) using Azure AD Authentication Library (ADAL). These tokens are used to authenticate Azure AD identities (work and school accounts). 

MSAL comes with benefits over ADAL. Some of these benefits are listed below:

- You can authenticate a broader set of Microsoft identities: work or school accounts, personal Microsoft accounts, and social or local accounts with Azure AD B2C,
- Your users will get the best single-sign-on experience,
- Your application can enable incremental consent, Conditional Access,
- You benefit from continuous innovation in term of security and resilience,
- Your application implements the best practices in term of resilience and security.

**MSAL.NET or Microsoft.Identity.Web are now the recommended auth libraries to use with the Microsoft identity platform**. No new features will be implemented on ADAL.NET. The efforts are focused on improving MSAL.NET. For details see the announcement: [Update your applications to use Microsoft Authentication Library and Microsoft Graph API](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/update-your-applications-to-use-microsoft-authentication-library/ba-p/1257363)

## Should you migrate to MSAL.NET or to Microsoft.Identity.Web

Before digging in the details of MSAL.NET vs ADAL.NET, you might want to check if you want to use MSAL.NET or a higher-level abstraction like [Microsoft.Identity.Web](microsoft-identity-web.md)

For details about the decision tree below, read [MSAL.NET or Microsoft.Identity.Web?](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/MSAL.NET-or-Microsoft.Identity.Web)

!["Block diagram explaining how to choose if you need to use MSAL.NET and Microsoft.Identity.Web or both when migrating from ADAL.NET"](media/msal-net-migration/decision-diagram.png)

<!-- 1P
## Examples of 1P Migrations

[See examples](https://identitydivision.visualstudio.com/DevEx/_wiki/wikis/DevEx.wiki/20413/1P-ADAL.NET-to-MSAL.NET-migration-examples) of other 1P teams who have already, or are currently, migrating from ADAL to one of the MSAL+ solutions above. See their code, and in some cases read about their migration story.
 -->
 
## Next steps

- Learn about [public client and confidential client applications](msal-client-applications.md).
- Learn how to [migrate confidential client applications built on top of ASP.NET MVC or .NET classic from ADAL.NET to MSAL.NET](msal-net-migration-confidential-client.md).
- Learn how to [migrate public client applications built on top of .NET or .NET classic from ADAL.NET to MSAL.NET](msal-net-migration-public-client.md).
- Learn more about the [Differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md).
- Learn how to migrate confidential client applications built on top of ASP.NET Core from ADAL.NET to Microsoft.Identity.Web:
  -  [Web apps](https://github.com/AzureAD/microsoft-identity-web/wiki/web-apps#migrating-from-previous-versions--adding-authentication)
  -  [Web APIs](https://github.com/AzureAD/microsoft-identity-web/wiki/web-apis)
