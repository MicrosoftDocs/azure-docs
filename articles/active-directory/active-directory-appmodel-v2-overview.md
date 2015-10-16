<properties
	pageTitle="App Model v2.0 Overview | Microsoft Azure"
	description="An introduction to building apps with both Microsoft Account and Azure Active Directory sign-in."
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
	ms.date="09/11/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: Sign-in Microsoft Account & Azure AD users in a single app

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

In the past, an app developer who wanted to support both Microsoft accounts and Azure Active Directory was required to integrate with two separate systems. With the v2.0 app model, you can now sign users in with both types of accounts. One simple integration allows you to reach an audience that spans millions of users with both personal and work/school accounts.

Your apps can also consume a [set of Office 365 REST APIs](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) using either type of account.  Currently, these APIs include Outlook's Mail, Contacts, and Calendars APIs.  Additional services will be added in the near future.
<!-- TODO: customer reference article -->
<!-- Several apps have already begun to bridge the gap between consumer and enterprise accounts, including: [Boomerang](), [TripIt](), & [Uber](). -->

The v2.0 app model is in preview.  During the preview period, we are eager to hear your feedback and experience with the new app model as you try things out.  Based on that feedback, we may make breaking changes in the interest of improving the service.  You should not release a production app using the v2.0 app model during this period.
<!-- TODO: Get approval on how it looks  -->

## Getting Started
There are two ways to get your own app up & running with the v2.0 app model.  You can choose to send protocol messages directly, using [OAuth 2.0](active-directory-v2-protocols.md#oauth2-authorization-code-flow) or [Open ID Connect](active-directory-v2-protocols.md#openid-connect-sign-in-flow).  Alternatively you can use our libraries to do the work for you - choose your favorite platform below and get started.
<!-- TODO: Finalize this table  -->

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]

## What's New
Check back here often to learn about future changes to the v2.0 app model public preview.  We'll also tweet about any updates using @AzureAD.

- Learn about the [types of apps you can build with app model v2.0](active-directory-v2-flows.md).
- For developers familiar with Azure Active Directory, you should check out the [updates to our protocols & differences in the v2.0 app model](active-directory-v2-compare.md).
- Current [preview limitations, restrictions and constraints](active-directory-v2-limitations.md).

## Reference
These links will be useful for exploring the platform in depth:

- Get help on Stack Overflow using the [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) or [adal](http://stackoverflow.com/questions/tagged/adal) tags.
- Give us your thoughts on the preview using [User Voice](http://feedback.azure.com/forums/169401-azure-active-directory) - we want to hear them!  Use the phrase "AppModelv2:" in the title of your post so we can find it.
- [App Model v2.0 Protocol Reference](active-directory-v2-protocols.md)
- [App Model v2.0 Token Reference](active-directory-v2-tokens.md)
- [Office 365 REST API Reference](https://www.msdn.com/office/office365/howto/authenticate-Office-365-APIs-using-v2)
- [Scopes and Consent in the v2 endpoint](active-directory-v2-scopes.md)

<!-- TODO: These articles
- [ADAL Library Reference]()
- [v2 Endpoint FAQs](active-directory-v2-faq.md)
-->
