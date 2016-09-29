<properties
	pageTitle="v2.0 Endpoint Overview | Microsoft Azure"
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
	ms.date="09/27/2016"
	ms.author="dastrock"/>

# Sign-in Microsoft Account & Azure AD users in a single app

In the past, an app developer who wanted to support both Microsoft accounts and Azure Active Directory was required to integrate with two separate systems.  We've now introduced a new authentication API version that enables you to sign in users in with both types of accounts using the Azure AD system.  This converged authentication system is known as **the v2.0 endpoint**.  With the v2.0 endpoint, one simple integration allows you to reach an audience that spans millions of users with both personal and work/school accounts.

Apps that use the v2.0 endpoint can also consume REST APIs from the [Microsoft Graph](https://graph.microsoft.io) and [Office 365](https://msdn.microsoft.com/office/office365/howto/authenticate-Office-365-APIs-using-v2) using either type of account.

<!-- For a quick introduction to the v2.0 endpoint, please view the [Getting Started with Microsoft Identities: Enterprise Grade Sign In For Your Apps](https://azure.microsoft.com/documentation/videos/build-2016-getting-started-with-microsoft-identities-enterprise-grade-sign-in-for-your-apps/) video. -->

## Getting Started
[AZURE.VIDEO build-2016-getting-started-with-microsoft-identities-enterprise-grade-sign-in-for-your-apps]

Choose your favorite platform from the following list to build an app using our open source libraries & frameworks.  Alternatively, you can use our OAuth 2.0 & OpenID Connect protocol documentation to send & receive protocol messages directly without using an auth library.

<!-- TODO: Finalize this table  -->
[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]

## What's New
The conceptual information here will be useful in understanding what is & what isn't possible with the v2.0 endpoint.

- Learn about the [types of apps you can build with the v2.0 endpoint](active-directory-v2-flows.md).
- Understand the [limitations, restrictions, and constraints](active-directory-v2-limitations.md) with the v2.0 endpoint.
- We've recently added support for [admin restricted scopes](active-directory-v2-scopes.md) and the [OAuth2 client credentials grant](active-directory-v2-protocols-oauth-client-creds.md).  Try them out!

## Reference
These links will be useful for exploring the platform in depth:

- Build 2016: [Getting Started with Microsoft Identities: Enterprise Grade Sign In For Your Apps](https://azure.microsoft.com/documentation/videos/build-2016-getting-started-with-microsoft-identities-enterprise-grade-sign-in-for-your-apps/)
- Get help on Stack Overflow using the [azure-active-directory](http://stackoverflow.com/questions/tagged/azure-active-directory) or [adal](http://stackoverflow.com/questions/tagged/adal) tags.
- [v2.0 Protocol Reference](active-directory-v2-protocols.md)
- [v2.0 Token Reference](active-directory-v2-tokens.md)
- [v2.0 Library Reference](active-directory-v2-libraries.md)
- [Scopes and Consent in the v2.0 endpoint](active-directory-v2-scopes.md)
- [The Microsoft App Registration Portal](https://apps.dev.microsoft.com)
- [Office 365 REST API Reference](https://msdn.microsoft.com/office/office365/howto/authenticate-Office-365-APIs-using-v2)
- [The Microsoft Graph](https://graph.microsoft.io)