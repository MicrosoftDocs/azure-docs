<properties
	pageTitle="v2.0 Endpoint | Microsoft Azure"
	description="An introduction to building apps with both Microsoft Account and Azure Active Directory sign in."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/15/2015"
	ms.author="dastrock"/>

# Preview: Signing In Microsoft Account & Azure AD users with a single auth endpoint
In the past, an app developer who wanted to support both Microsoft Accounts and Azure Active Directory was required to integrate with two completely separate systems.  Now you can sign users in with both types of accounts using OpenID Connect or OAuth 2.0 and the  "v2.0" authentication endpoint:

```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize
https://login.microsoftonline.com/common/oauth2/v2.0/token
```

 One simple process allows you to immediately reach an audience that spans millions of users with both personal and work/school accounts.

| Register an app at <br> [apps.dev.microsoft.com](apps.dev.microsoft.com) | Learn the auth protocols, <br> [OAuth 2.0]() & [OpenID Connect]() | [Get Started]() with tutorials <br> using our auth libraries |
| ----------------------- | ------------------------------- | ------------ |

Your apps can also consume a [unified set of Microsoft REST APIs]() using either type of account, including:

- Files through OneDrive and OneDrive for Business
- Mail, Contacts, and Calendars through Outlook.com and Office 365
- Users, Groups, and Company Information through Azure Active Directory

With more Microsoft Online services to be added in the near future. Several apps have already begun to bridge the gap between consumer and enterprise accounts, including: [Boomerang](), [TripIt](), & [Uber]().

> [AZURE.NOTE]
	This information applies to the v2.0 endpoint public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Getting Started
To get your own app up & running with the v2.0 endpoint, try out one of our quick start tutorials below.

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../includes/active-directory-v2-quickstart-table.md)]

## What's New
Check back here often to learn about future changes to the v2.0 endpoint public preview.  We'll also tweet about any updates using @AzureAD.

- Learn about the [currently supported authentication flows](active-directory-v2-scenarios.md).
- For developers familiar with Azure Active Directory, check out [v2.0 vs. v1.0](active-directory-v2-compare.md).
- Current [limitations, restrictions and constraints]().

## Reference
These links will be useful for exploring the platform in depth:

- Get help on [Stack Overflow using the AADv2 tag]().
- Give us your thoughts on the preview using [User Voice]() - we want to hear them!
- [ADAL Library Reference]()
- [v2 Endpoint Protocol Reference]()
- [v2 Endpoint FAQs](active-directory-v2-faq.md)
- [Office 365 Rest API Reference]()
- [Scopes and Resources in the v2 endpoint](active-directory-v2-scopes.md)
