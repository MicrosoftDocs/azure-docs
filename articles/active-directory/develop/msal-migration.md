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
ms.date: 08/07/2020
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
A: Yes. Starting June 30th, 2020, we will no longer add new features to ADAL. We'll continue adding critical security fixes to ADAL until June 30th, 2022. After this date, your apps using ADAL will continue to work, but we recommend upgrading to MSAL to take advantage of the latest features and to stay secure.

__Q: Will my existing ADAL apps stop working?__  
A: No. Your existing apps will continue working without modification. If you're planning to keep them beyond June 30th, 2022, you should consider updating your apps to MSAL to keep them secure, but migrating to MSAL isn't required to maintain existing functionality.

__Q: How do I know which of my apps are using ADAL?__  
A: If you have the source code for the application, you can reference the above migration guides to help determine which library the app uses and how to migrate it to MSAL. If you partnered with an ISV, we suggest you reach out to them directly to understand their migration journey to MSAL.

__Q: Why should I invest in moving to MSAL?__  
A: MSAL contains new features not in ADAL including incremental consent, single sign-on, and token cache management. Also, unlike ADAL, MSAL will continue to receive security patches beyond June 30th, 2022. [Learn more](msal-overview.md).

__Q: Will Microsoft update its own apps to MSAL?__  
Yes. Microsoft is in the process of migrating its applications to MSAL by the end-of-support deadline, ensuring they'll benefit from MSAL's ongoing security and feature improvements.

__Q: Will you release a tool that helps me move my apps from ADAL to MSAL?__  
A: No. Differences between the libraries would require dedicating resources to development and maintenance of the tool that would otherwise be spent improving MSAL. However, we do provide the preceding set of migration guides to help you make the required changes in your application.

__Q: How does MSAL work with AD FS?__  
A: MSAL.NET supports certain scenarios to authenticate against AD FS 2019. If your app needs to acquire tokens directly from earlier version of AD FS, you should remain on ADAL. [Learn more](msal-net-adfs-support.md).

__Q: How do I get help migrating my application?__  
A: See the [Migration guidance](#migration-guidance) section of this article. If, after reading the guide for your app's platform, you have additional questions, you can post on Stack Overflow with the tag `[adal-deprecation]` or open an issue in library's GitHub repository. See the [Languages and frameworks](msal-overview.md#languages-and-frameworks) section of the MSAL overview article for links to each library's repo.

## Next steps

- [Update your applications to use Microsoft Authentication Library and Microsoft Graph API](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/update-your-applications-to-use-microsoft-authentication-library/ba-p/1257363)
- [Overview of the Microsoft identity platform](v2-overview.md)
- [Review our MSAL code samples](sample-v2-code.md)
