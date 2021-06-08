---
title: Migrating to MSAL.NET
titleSuffix: Microsoft identity platform
description: Learn why and how to migrate from  Azure AD Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/10/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn why and how to migrate from ADAL.NET and MSAL.NET libraries.
---

# Migrating applications to MSAL.NET

## Why migrate to MSAL.NET

Both the Microsoft Authentication Library for .NET (MSAL.NET) and Azure AD Authentication Library for .NET (ADAL.NET) are used to authenticate Azure AD entities and request tokens from Azure AD. Up until now, most developers have worked with Azure AD for developers platform (v1.0) to authenticate Azure AD identities (work and school accounts) by requesting tokens using Azure AD Authentication Library (ADAL). Using MSAL:

- you can authenticate a broader set of Microsoft identities (Azure AD identities and Microsoft accounts, and social and local accounts through Azure AD B2C) as it uses the Microsoft identity platform,
- your users will get the best single-sign-on experience.
- your application can enable incremental consent, and supporting Conditional Access is easier
- you benefit from the innovation.
- your application implements the best practices in term of resilience and security.

**MSAL.NET or Microsoft.Identity.Web are now the recommended auth libraries to use with the Microsoft identity platform**. No new features will be implemented on ADAL.NET. The efforts are focused on improving MSAL.

This article describes the differences between the Microsoft Authentication Library for .NET (MSAL.NET) and Azure AD Authentication Library for .NET (ADAL.NET) and helps you migrate to MSAL.

## Should you migrate to MSAL.NET or to Microsoft.Identity.Web

Before digging in the details of MSAL.NET vs ADAL.NET, you might want to check if you want to use MSAL.NET or a higher-level abstraction like [Microsoft.Identity.Web](microsoft-identity-web.md)

For details about the decision tree below, read [Should I use MSAL.NET only? or a higher level abstraction?](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Is-MSAL.NET-right-for-me%3F)

:::image type="content" source="media/msal-net-migration/decision-diagram.png" alt-text="Block diagram explaining how to choose if you need to use MSAL.NET and Microsoft.Identity.Web or both when migrating from ADAL.NET":::



## Next steps

- Learn [how to migrate confidential client applications from ADAL.NET to MSAL.NET](msal-net-migration-confidential-client.md).
- Learn more about the [Differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md).