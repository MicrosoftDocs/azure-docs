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
ms.date: 06/16/2020
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
# Customer intent: As an application developer, I want to learn about the differences between the ADAL and MSAL libraries so I can migrate my applications to MSAL.
---
# Migrate applications to Microsoft Authentication Library (MSAL)

Many developers have built and deployed applications using the Active Active Directory Authentication Library (ADAL). We now recommend using the Microsoft Authentication Library (MSAL) for authentication and authorization of Azure AD entities.

By using MSAL instead of ADAL:

- You can authenticate a broader set of identities:
  - Azure AD identities
  - Microsoft accounts
  - Social and local accounts by using Azure AD B2C
- Your users will get the best single-sign-on experience.
- Your application can enable incremental consent.
- Supporting Conditional Access is easier.
- You benefit from innovation. Because all Microsoft development efforts are now focused on MSAL, no new features will be implemented in ADAL.

**MSAL is now the recommended authentication library for use with the Microsoft identity platform**.

## Next steps

The following articles can help you migrate to MSAL:

- [Migrate to MSAL.Android](migrate-android-adal-msal.md)
- [Migrate to MSAL.iOS / macOS](migrate-objc-adal-msal.md)
- [Migrate to MSAL Java](migrate-adal-msal-java.md)
- [Migrate to MSAL.js](msal-compare-msal-js-and-adal-js.md)
- [Migrate to MSAL.NET](msal-net-migration.md)
- [Migrate to MSAL Python](migrate-python-adal-msal.md)
- [Migrate Xamarin apps using brokers to MSAL.NET](msal-net-migration-ios-broker.md)
