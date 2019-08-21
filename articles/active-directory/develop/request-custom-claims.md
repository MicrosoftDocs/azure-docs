---
title: How to request custom claims using MSAL for iOS and macOS | Microsoft identity platform
description: Learn how to request custom claims.
services: active-directory
documentationcenter: ''
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: twhitney
ms.reviewer: ''
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Request custom claims using MSAL for iOS and macOS

OpenID Connect allows you to optionally request individual claims. Claims are returned as a JSON object containing the list of requested claims. The mechanism for doing this is an optional `claims` parameter (See [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-final.html#ClaimsParameter) for details.)

The Microsoft Authentication Library (MSAL) provides an interactive API to pass a `claims` parameter to OpenID Connect so that you can request individual claims and specify parameters that apply to the requested Claims.

A situation where you would need to request is claim is if a claims challenge is issued by the resource when the access token is used to access it. In that case, an interactive acquire token call is needed to pass the claims challenge to the server.

MSAL provides the following function on the `MSALPublicClientApplication` class, which accepts a claims challenge:

```objc
(void)acquireTokenForScopes:(NSArray<NSString *> *)scopes
         extraScopesToConsent:(NSArray<NSString *> *)extraScopesToConsent
                      account:(MSALAccount *)account
                   uiBehavior:(MSALUIBehavior)uiBehavior
         extraQueryParameters:(NSDictionary <NSString *, NSString *> *)extraQueryParameters
                       claims:(NSString *)claims
                    authority:(NSString *)authority
                correlationId:(NSUUID *)correlationId
              completionBlock:(MSALCompletionBlock)completionBlock;
```

The `claims` parameter value is represented in an OAuth 2.0 request as UTF-8 encoded JSON.  
MSAL expects the claims string to be URL encoded.  For example:

```objc
[application acquireTokenForScopes:@[@"user.read"]
                  extraScopesToConsent:nil
                  account:account
                  uiBehavior:MSALUIBehaviorDefault
                  extraQueryParameters:nil
                  claims:@"%7B%22access_token%22%3A%7B%22deviceid%22%3A%7B%22essential%22%3Atrue%7D%7D%7D"
                  authority:nil
                  correlationId:nil
                  completionBlock:^(MSALResult *result, NSError *error) {
                      // TODO: handle result or error
    }];
```

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
