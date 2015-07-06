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
To get your own Microsoft Identity integrated app up & running, try out one of our quick start tutorials below.

[AZURE.INCLUDE [active-directory-msid-quickstart-table](../includes/active-directory-msid-quickstart-table.md)]

## What's New
Check back here often to learn about future changes to the Microsoft Identity Preview.  We'll also tweet about any updates using @MicrosoftIdentity.

- Learn about the [currently supported authentication flows](active-directory-microsoft-identity-scenarios.md).
- For developers familiar with Azure Active Directory, check out [Azure AD vs. Microsoft Identity](active-directory-microsoft-identity-compare.md).
- Current [limitations, restrictions and constraints]().

## Reference
These links will be useful for exploring the platform in depth:

- Get help on [Stack Overflow using the MSID tag]().
- Give us your thoughts on the preview using [User Voice]() - we want to hear them!
- [ADAL Library Reference]()
- [Microsoft Identity Protocol Reference]()
- [Microsoft Identity FAQs](active-directory-microsoft-identity-faq.md)
- [Office 365 Rest API Reference]()
- [Scopes and Resources in Microsoft Identity](active-directory-microsoft-identity-scopes.md)
