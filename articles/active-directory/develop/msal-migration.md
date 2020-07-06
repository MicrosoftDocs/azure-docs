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

Many developers have built and deployed applications using the Azure Active Directory Authentication Library (ADAL). We now recommend using the Microsoft Authentication Library (MSAL) for authentication and authorization of Azure AD entities.

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

## Migration guidance

The following articles can help you migrate to MSAL:

- [Migrate to MSAL.Android](migrate-android-adal-msal.md)
- [Migrate to MSAL.iOS / macOS](migrate-objc-adal-msal.md)
- [Migrate to MSAL Java](migrate-adal-msal-java.md)
- [Migrate to MSAL.js](msal-compare-msal-js-and-adal-js.md)
- [Migrate to MSAL.NET](msal-net-migration.md)
- [Migrate to MSAL Python](migrate-python-adal-msal.md)
- [Migrate Xamarin apps using brokers to MSAL.NET](msal-net-migration-ios-broker.md)

## Frequently asked questions (FAQ)

__Q: Is ADAL being deprecated?__  
A: Yes. Starting June 30th, 2020, we will no longer add new features to ADAL. We'll continue adding critical security fixes to ADAL until June 30th, 2022.

__Q: How do I know which of my apps are using ADAL?__  
A: If you have the source code for the application, you can reference the above migration guides to help determine which library the app uses and how to migrate it to MSAL. If you don't have access to your application's source code, you can [open a support request](developer-support-help-options.md#open-a-support-request) to obtain a list of your registered applications and the library each application uses.

__Q: Will my existing ADAL apps continue to work?__  
A: Your existing apps will continue to work without modification. If you're planning to keep them beyond June 30th, 2022, you should consider updating them to MSAL to keep them secure, but migrating to MSAL isn't required to maintain existing functionality.

__Q: Why should I invest in moving to MSAL?__  
A: MSAL contains new features not in ADAL including incremental consent, single sign-on, and token cache management. Also, unlike ADAL, MSAL will continue to receive security patches beyond June 30th, 2022. [Learn more](msal-overview.md).

__Q: Will you release a tool that helps me move my apps from ADAL to MSAL?__  
A: No. Differences between the libraries would require dedicating resources to development and maintenance of the tool that would otherwise be spent improving MSAL. However, we do provide the preceding set of migration guides to help you make the required changes in your application.

__Q: How does MSAL work with AD FS?__  
A: MSAL.NET supports certain scenarios to authenticate against AD FS 2019. If your app needs to acquire tokens directly from earlier version of AD FS, you should remain on ADAL. [Learn more](msal-net-adfs-support.md).

__Q: How do I get help migrating my application?__  
A: See the [Migration guidance](#migration-guidance) section of this article. If, after reading the guide for your app's platform, you have additional questions, you can post on Stack Overflow with the tag `[adal-deprecation]` or open an issue in library's GitHub repository. See the [Languages and frameworks](msal-overview.md#languages-and-frameworks) section of the MSAL overview article for links to each library's repo.

## Next steps

- [Update your applications to use Microsoft Authentication Library and Microsoft Graph API](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/update-your-applications-to-use-microsoft-authentication-library/ba-p/1257363)
- [Learn more about Microsoft identity platform (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
- [Review our MSAL code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code)
