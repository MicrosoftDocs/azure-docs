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
ms.date: 08/26/2019
ms.author: twhitney
ms.reviewer: ''
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Request custom claims using MSAL for iOS and macOS

OpenID Connect allows you to optionally request the return of individual claims from the UserInfo Endpoint and/or in the ID Token. A claims request is represented as a JSON object that contains a list of requested claims. See [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-final.html#ClaimsParameter) for more details.

The Microsoft Authentication Library (MSAL) for iOS and macOS allows requesting specific claims in both interactive and silent token acquisition scenarios. It does so through the `claimsRequest` parameter.

There're multiple scenarios where this is needed, for example:

- Requesting claims outside of the standard set for your application.
- Requesting specific combinations of the standard claims that cannot be specified using scopes for your application. For example, if an access token gets rejected due to missing claims, the application can request the missing claims using MSAL.

MSAL bypasses the access token cache whenever a claims request is specified. Therefore it is important to only provide `claimsRequest` parameter when additional claims are needed (as opposed to always providing same `claimsRequest` parameter in each MSAL API call).

`claimsRequest` can be specified in `MSALSilentTokenParameters` and `MSALInteractiveTokenParameters`:

```objc
/*!
 MSALTokenParameters is the base abstract class for all types of token parameters (silent and interactive).
 */
@interface MSALTokenParameters : NSObject

/*!
 The claims parameter that needs to be sent to authorization or token endpoint.
 If claims parameter is passed in silent flow, access token will be skipped and refresh token will be tried.
 */
@property (nonatomic, nullable) MSALClaimsRequest *claimsRequest;

@end
```
`MSALClaimsRequest` can be constructed from an NSString representation of JSON Claims request. 

```objc
NSError *claimsError = nil;
MSALClaimsRequest *request = [[MSALClaimsRequest alloc] initWithJsonString:@"{\"id_token\":{\"auth_time\":{\"essential\":true},\"acr\":{\"values\":[\"urn:mace:incommon:iap:silver\"]}}}" error:&claimsError];
```

It can also be modified by requesting additional specific claims:

```objc
MSALIndividualClaimRequest *individualClaimRequest = [[MSALIndividualClaimRequest alloc] initWithName:@"custom_claim"];
individualClaimRequest.additionalInfo = [MSALIndividualClaimRequestAdditionalInfo new];
individualClaimRequest.additionalInfo.essential = @1;
individualClaimRequest.additionalInfo.value = @"myvalue";
[request requestClaim:individualClaimRequest forTarget:MSALClaimsRequestTargetIdToken error:&claimsError];
```

`MSALClaimsRequest` should be then set in the token parameters and provided to one of MSAL token acquisitions APIs:

```objc
MSALPublicClientApplication *application = ...;
MSALWebviewParameters *webParameters = ...;

MSALInteractiveTokenParameters *parameters = [[MSALInteractiveTokenParameters alloc] initWithScopes:@[@"user.read"]
                                                                                  webviewParameters:webParameters];
parameters.claimsRequest = request;
    
[application acquireTokenWithParameters:parameters completionBlock:completionBlock];
```

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
