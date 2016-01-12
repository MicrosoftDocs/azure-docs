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
	ms.date="1/11/2015"
	ms.author="dastrock"/>

# Sign-in Microsoft Account & Azure AD users in a single app

In the past, an app developer who wanted to support both Microsoft accounts and Azure Active Directory was required to integrate with two separate systems.  We've now introduced a new application version that enables you to sign in users in with both types of accounts using a single system.  These applications are known as "v2.0" apps.  With v2.0 apps, one simple integration allows you to reach an audience that spans millions of users with both personal and work/school accounts.

V2.0 apps can also consume REST APIs from the [Microsoft Graph](https://graph.microsoft.io) and [Office 365](https://msdn.microsoft.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) using either type of account.

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by v2.0 apps.  To determine if you should create a v2.0 app, read about [v2.0 limitations](active-directory-v2-limitations.md).


## Getting Started
Choose your favorite platform below to build a v2.0 app using our open source libraries & frameworks.  Alternatively you can use our OAuth 2.0 & OpenID Connect protocol documentation to send & receive protocol messages directly without using an auth library.
<!-- TODO: Finalize this table  -->

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]

## What's New	
The conceptual information here will be useful in understanding what is & what isn't possible with v2.0 apps.

- Learn about the [different types of v2.0 apps you can build](active-directory-v2-flows.md).
- Current [limitations, restrictions and constraints](active-directory-v2-limitations.md).
- If you're already familiar with Azure Active Directory, you should check out the [updates to our protocols & differences in the v2.0 app model](active-directory-v2-compare.md).
- If you've built a v2.0 application during the 2015 preview period, be sure to [read about these protocol changes](active-directory-v2-preview-oidc-changes.md) to make sure your app keeps working.

## Reference
These links will be useful for exploring the platform in depth:

- Get help on Stack Overflow using the [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) or [adal](http://stackoverflow.com/questions/tagged/adal) tags.
- [v2.0 Protocol Reference](active-directory-v2-protocols.md)
- [v2.0 Token Reference](active-directory-v2-tokens.md)
- [Scopes and Consent in the v2.0 app model](active-directory-v2-scopes.md)
- [Office 365 REST API Reference](https://msdn.microsoft.com/office/office365/howto/authenticate-Office-365-APIs-using-v2)
- [The Microsoft Graph](https://graph.microsoft.io)

<!-- TODO: These articles
- [ADAL Library Reference]()
- [v2 Endpoint FAQs](active-directory-v2-faq.md)
- Give us your thoughts on the preview using [User Voice](http://feedback.azure.com/forums/169401-azure-active-directory) - we want to hear them!  Use the phrase "AppModelv2:" in the title of your post so we can find it.
-->
