---
title: Azure Active Directory breaking changes reference | Microsoft Docs
description: Learn about changes made to the Azure AD protocols that may impact your application.
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
ms.date: 10/02/2018
ms.author: celested
ms.reviewer: hirsin
ms.custom: aaddev
---

# What's new for authentication? 

>Get notified about updates to this page. Just add [this URL](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20for%20authentication%22&locale=en-us) to your RSS feed reader.

The authentication system alters and adds features on an ongoing basis to improve security and standards compliance. To stay up-to-date with the most recent developments, this article provides you with information about the following:

- Latest features
- Known issues
- Protocol changes
- Deprecated functionality

> [!TIP] 
> This page is updated regularly, so visit often. Unless otherwise noted, these changes are only put in place for newly registered applications.  

## Upcoming changes

### Authorization codes can no longer be reused

**Effective date**: October 10, 2018
**Endpoints impacted**: Both v1.0 and v2.0
**Protocol impacted**: [Code flow](v2-oauth2-auth-code-flow.md)

Starting on October 10, 2018, Azure AD will stop accepting previously-used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. Any new app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For more information about refresh tokens, see [Refreshing the access tokens](v1-protocols-oauth-code.md#refreshing-the-access-tokens).

> [!NOTE]
> In an effort to break as few apps as possible, existing applications that rely on this feature were given an exception to this requirement.  Any app with more than 10 logins a day relying on this pattern was considered to rely on it.  

## May 2018

### ID tokens cannot be used for the OBO flow

**Date**: May 1, 2018
**Endpoints impacted**: Both v1.0 and v2.0
**Protocols impacted**: Implicit flow and [OBO flow](v1-oauth2-on-behalf-of-flow.md)

After May 1, 2018, id_tokens cannot be used as the assertion in an OBO flow for new applications. Access tokens should be used instead to secure APIs, even between a client and middle tier of the same application. Apps registered before May 1, 2018 will continue to work and be able to exchange id_tokens for an access token; however, this is not considered a best practice.

To work around this change, you can do the following:

1. Create a Web API for your middle tier application, with one or more scopes. This will allow finer grained control and security.
1. In your app's manifest, in the [Azure portal](https://portal.azure.com) or the [app registration portal](https://apps.dev.microsoft.com), ensure that the app is allowed to issue access tokens via the implicit flow. This is controlled through the `oauth2AllowImplicitFlow` key.
1. When your client application requests an id_token via `response_type=id_token`, also request an access token (`response_type=token`) for the Web API created above. Thus, when using the v2.0 endpoint the `scope` parameter should look similar to `api://GUID/SCOPE`. On the v1.0 endpoint, the `resource` parameter should be the app URI of the web API.
1. Pass this access token to the middle tier in place of the id_token.  
