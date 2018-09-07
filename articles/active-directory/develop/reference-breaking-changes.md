---
title: Azure Active Directory breaking changes reference | Microsoft Docs
description: Changes made to the Azure AD protocols that may impact your application.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 68517c83-1279-4cc7-a7c1-c7ccc3dbe146
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/31/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# What's new for authentication? 

|
>Get notified about when to revisit this page for updates by adding this [URL](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20for%20authentication%22&locale=en-us) to your ![RSS icon](./media/whats-new/feed-icon-16x16.png) feed reader.

The authentication system alters and adds features on an ongoing basis in order to improve security and improve standards compliance. To stay up-to-date with the most recent developments, this article provides you with information about:

- The latest features
- Known issues
- Protocol changes
- Deprecated functionality

This page is updated regularly, so revisit often. Unless otherwise noted, these changes are only put in place for newly registered applications.  

---
## Upcoming changes

### Authorization codes can no longer be reused

**Effective date**: October 10, 2018
**Endpoints impacted**: Both v1.0 and v2.0
**Protocol impacted**: [Code flow](v2-oauth2-auth-code-flow.md)

Starting on October 10, 2018, Azure AD will stop accepting previously-used authentication codes for new apps. Any app created before October 10, 2018 will still be able to reuse authentication codes. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. Any new app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error, revoking the previous refresh token that was acquired using that duplicate code.

For more information about refresh tokens, see [Refreshing the access tokens](https://docs.microsoft.com/azure/active-directory/develop/v1-protocols-oauth-code#refreshing-the-access-tokens).

### Native apps must use PKCE in the code flow

**Effective date**: November 7, 2018
**Endpoints impacted**: Both v1.0 and v2.0
**Protocol impacted**: [Code flow](v2-oauth2-auth-code-flow.md)

In order to better protect tokens sent to native and mobile clients, these clients must begin using PKCE to protect the code flow.  Apps created after November 7th will be unable to retrieve their tokens from the /token endpoint without a `code_verifier` parameter that matches the `code_challenge` on the /authorize request. 

To add PKCE support to your application, modify both the /authorize and /token calls for interactive authentications.  For the /authorize call, add an additional parameter `code_challenge` and `code_challenge_method`, preferably a hashed value and the `S256` method. Then, in the corresponding /token request, include the `code_verifier` parameter along with the original value.  

Apps that use a client secret or certificate auth will not be subject to this requirement.  Apps that are required to provide PKCE parameters but do not will receive errors such as `‘code_verifier’ was missing from the request.  Native applications must provide PKCE parameters for security purposes`.

## May 2018

### ID tokens cannot be used for the OBO flow

**Date**: May 1, 2018
**Endpoints impacted**: Both v1.0 and v2.0
**Protocols impacted**: Implicit flow and OBO flow
