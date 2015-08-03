<properties
	pageTitle="App Model v2.0 | Microsoft Azure"
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
	ms.date="08/02/2015"
	ms.author="dastrock"/>

# App Model v2.0 Preview: Sign-in Microsoft Account & Azure AD users in a single application
In the past, an app developer who wanted to support both Microsoft Accounts and Azure Active Directory was required to integrate with two completely separate systems.  Now you can build apps using the "v2.0 application model", which allows you to sign users in with both types of accounts.  One simple process allows you to immediately reach an audience that spans millions of users with both personal and work/school accounts.

| [Register an app](active-directory-v2-app-registration.md) at <br> apps.dev.microsoft.com | Learn the auth protocols, <br> [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) & [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow) | [Get Started](#getting-started) with tutorials using <br> our open source auth libraries |
| ----------------------- | ------------------------------- | ------------ |

Your apps can also consume a [unified set of Microsoft REST APIs](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) using either type of account.  Currently, these APIs include Outlook's Mail, Contacts, and Calendars APIs - additional Microsoft Online services will be added in the near future.
<!-- TODO: customer reference article -->
<!-- Several apps have already begun to bridge the gap between consumer and enterprise accounts, including: [Boomerang](), [TripIt](), & [Uber](). -->

The app model v2.0 will be in preview for the next few months.  During the preview period, we are eager to hear your feedback and experience with the new app model as you try things out.  Based on that feedback, we will make breaking changes in the interest of improving the service.  You should not release a production app using the v2.0 app model during this period - support will not be provided for any issues that arise.
<!-- TODO: Get approval on how it looks  -->

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Getting Started
To get your own app up & running with the v2.0 app model, try out one of our quick start tutorials below.
<!-- TODO: Finalize this table  -->

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]

## What's New
Check back here often to learn about future changes to the v2.0 app model public preview.  We'll also tweet about any updates using @AzureAD.

- Learn about the [types of apps you can build with app model v2.0](active-directory-v2-flows.md).
- For developers familiar with Azure Active Directory, check out [the differences in app model v2.0](active-directory-v2-compare.md).
- Current [preview limitations, restrictions and constraints](active-directory-v2-limitations.md).

## Reference
These links will be useful for exploring the platform in depth:

- Get help on Stack Overflow using the [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) or [adal](http://stackoverflow.com/questions/tagged/adal) tags.
- Give us your thoughts on the preview using [User Voice](http://feedback.azure.com/forums/169401-azure-active-directory) - we want to hear them!  Use the phrase "AppModelv2:" in the title of your post so we can find it.
- [App Model v2.0 Protocol Reference](active-directory-v2-protocols.md)
- [App Model v2.0 Token Reference](active-directory-v2-tokens.md)
- [Office 365 Unified API Reference](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2)
- [Scopes and Consent in the v2 endpoint](active-directory-v2-scopes.md)
<!-- TODO: These articles
- [ADAL Library Reference]()
- [v2 Endpoint FAQs](active-directory-v2-faq.md)
-->
