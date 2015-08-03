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

# App Model v2.0 Preview: Signing In Microsoft Account & Azure AD users with a single auth endpoint
In the past, an app developer who wanted to support both Microsoft Accounts and Azure Active Directory was required to integrate with two completely separate systems.  Now you can build apps using the v2.0 application model, which allows you to sign users in with both types of accounts.  One simple process allows you to immediately reach an audience that spans millions of users with both personal and work/school accounts.

| Register an app at <br> [apps.dev.microsoft.com](apps.dev.microsoft.com) | Learn the auth protocols, <br> [OAuth 2.0](active-directory-v2-protocols.md#oauth-2.0-authorization-code-flow) & [OpenID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow) | [Get Started](#getting-started) with tutorials <br> using our open source auth libraries |
| ----------------------- | ------------------------------- | ------------ |

Your apps can also consume a [unified set of Microsoft REST APIs]() using either type of account.  Currently, these APIs include Outlook's Mail, Contacts, and Calendars APIs - additional Microsoft Online services will be added in the near future.
<!-- TODO: customer reference article -->
<!-- Several apps have already begun to bridge the gap between consumer and enterprise accounts, including: [Boomerang](), [TripIt](), & [Uber](). -->
<!-- TODO: Need the right link above  -->

The app model v2.0 will be in preview for the next few months.  During the preview period, we are eager to hear your feedback and experience with the new app model.  We will make breaking changes during this period in the interest of improving the service, and you must be prepared to adjust your applications accordingly.  If you require production level support on the v2.0 app model before it becomes generally available, you must reach out to us to understand all of the limitations.  Tweet at us using @AzureAD.
<!-- TODO: What to say here about prod support?  -->
<!-- TODO: Get approval on how it looks  -->

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Getting Started
To get your own app up & running with the v2.0 endpoint, try out one of our quick start tutorials below.
<!-- TODO: Write & finalize this table  -->

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../includes/active-directory-v2-quickstart-table.md)]

## What's New
Check back here often to learn about future changes to the v2.0 endpoint public preview.  We'll also tweet about any updates using @AzureAD.

- Learn about the [types of apps you can build with app model v2.0](active-directory-v2-flows.md).
- For developers familiar with Azure Active Directory, check out [v2.0 vs. v1.0](active-directory-v2-compare.md).
- Current [preview limitations, restrictions and constraints](active-directory-v2-limitations.md).

## Reference
These links will be useful for exploring the platform in depth:

- Get help on Stack Overflow using the [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) or [adal](http://stackoverflow.com/questions/tagged/adal) tags.
- Give us your thoughts on the preview using [User Voice](http://feedback.azure.com/forums/169401-azure-active-directory) - we want to hear them!  Use the phrase "AppModelv2:" in the title of your post so we can find it.
- [App Model v2.0 Protocol Reference](active-directory-v2-protocols.md)
- [Office 365 Unified API Reference]()
- [Scopes and Consent in the v2 endpoint](active-directory-v2-scopes.md)

<!-- TODO: Need O365 link above -->

<!-- TODO: These articles
- [ADAL Library Reference]()
- [v2 Endpoint FAQs](active-directory-v2-faq.md)
-->
