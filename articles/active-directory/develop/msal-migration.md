---
title: Migrate to Microsoft Authentication Library (MSAL)
titleSuffix: Microsoft identity platform
description: Learn about the differences between Microsoft Authentication Library (MSAL) and Azure AD Authentication Library (ADAL) and how to migrate to MSAL.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/27/2020
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about the differences between the ADAL and MSAL libraries so I can migrate my applications to MSAL.
---

# Migrate applications to Microsoft Authentication Library (MSAL)

Both Microsoft Authentication Library (MSAL) and Azure AD Authentication Library (ADAL) are used to authenticate Azure AD entities and request tokens from Azure AD. Up until now, most developers have worked with Azure AD for developers platform (v1.0) to authenticate Azure AD identities (work and school accounts) by requesting tokens using Azure AD Authentication Library (ADAL). Using MSAL:

- You can authenticate a broader set of Microsoft identities (Azure AD identities and Microsoft accounts, and social and local accounts through Azure AD B2C) as it uses the Microsoft identity platform endpoint.
- Your users will get the best single-sign-on experience.
- Your application can enable incremental consent, and supporting Conditional Access is easier.
- You benefit from the innovation.

**MSAL is now the recommended auth library to use with the Microsoft identity platform**. No new features will be implemented on ADAL. The efforts are focused on improving MSAL.

The following articles describe the differences between the MSAL and ADAL libraries and help you migrate to MSAL:
- [Migrate to MSAL.NET](msal-net-migration.md)
- [Migrate to MSAL.js](msal-compare-msal-js-and-adal-js.md)
- [Migrate to MSAL.Android](migrate-android-adal-msal.md)
- [Migrate to MSAL.iOS / macOS](migrate-objc-adal-msal.md)
- [Migrate to MSAL Python](migrate-python-adal-msal.md)
- [Migrate to MSAL for Java](migrate-adal-msal-java.md)
- [Migrate Xamarin apps using brokers to MSAL.NET](msal-net-migration-ios-broker.md)
