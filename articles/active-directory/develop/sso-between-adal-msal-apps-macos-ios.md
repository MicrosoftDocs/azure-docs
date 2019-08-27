---
title: SSO between ADAL and MSAL apps on iOS and macOS - Microsoft identity platform
description: 
services: active-directory
documentationcenter: dev-center-name
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/22/2019
ms.author: twhitney
ms.reviewer: 
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: SSO between ADAL and MSAL apps on macOS and iOS

Microsoft Authentication Library (MSAL) for macOS and iOS, starting with [0.2.0](https://github.com/AzureAD/microsoft-authentication-library-for-objc/releases/tag/0.2.0), can coexist in the same app, and share SSO state with [ADAL Objective-C](https://github.com/AzureAD/azure-activedirectory-library-for-objc). You can migrate your apps to MSAL Objective-C at your own pace, ensuring that your users will still benefit from cross-app SSO even with a mix of ADAL and MSAL based apps.

If you're looking for guidance of setting up SSO between apps using the MSAL SDK, see [Silent SSO between multiple apps](single-sign-on-macos-ios.md#silent-sso-between-apps). This article focuses on SSO between ADAL and MSAL.

The specifics implementing SSO depend on ADAL version that you're using:

## ADAL 2.7.x

This section covers SSO and ADAL 2.7.x

### Cache format

ADAL 2.7.x can read the MSAL cache format. You don't need to do anything special for cross-app SSO with version ADAL 2.7.x. However, you need to be aware of differences in account identifiers that those two libraries support. 

### Account identifier differences

MSAL and ADAL use different account identifiers. ADAL uses UPN as its primary account identifier. MSAL uses a non-displayable account identifier which is based of an object ID and a tenant ID for AAD accounts, and `sub` claim for other types of accounts. 

When you receive an `MSALAccount` object in the MSAL result, it will contain account identifier in the `identifier` property that application should save and present to MSAL for subsequent silent requests. 

In addition to `identifier`, `MSALAccount` object contains a displayable identifier called `username`. That translates to `userId` in ADAL. Note that `username` is not considered a unique identifier and can change any time, so it should only be used for backward compatibility scenarios with ADAL. MSAL supports cache queries using either `username` or `identifier`, where querying by `identifier` is recommended. 

Following table summarizes account identifier differences between ADAL and MSAL:

| Account identifier                | MSAL                                                         | ADAL 2.7.x      | Older ADAL (before ADAL 2.7.x) |
| --------------------------------- | ------------------------------------------------------------ | --------------- | ------------------------------ |
| displayable identifier            | `username`                                                   | `userId`        | `userId`                       |
| unique non-displayable identifier | `identifier`                                                 | `homeAccountId` | N/A                            |
| No account id known               | Query all accounts through `allAccounts:` API in `MSALPublicClientApplication` | N/A             | N/A                            |

This is the `MSALAccount` interface providing those identifiers:

```objc
@protocol MSALAccount <NSObject>

/*!
 Displayable user identifier. Can be used for UI and backward compatibility with ADAL.
 */
@property (readonly, nullable) NSString *username;

/*!
 Unique identifier for the account.
 Save this for account lookups from cache at a later point.
 */
@property (readonly, nullable) NSString *identifier;

/*!
 Host part of the authority string used for authentication based on the issuer identifier.
 */
@property (readonly, nonnull) NSString *environment;

/*!
 ID token claims for the account.
 Can be used to read additional information about the account, e.g. name
 Will only be returned if there has been an id token issued for the client Id for the account's source tenant.
 */
@property (readonly, nullable) NSDictionary<NSString *, NSString *> *accountClaims;

@end
```

### Acquire a token silently in ADAL

If another app has previously signed in using MSAL, save the `username` from the `MSALAccount` object and pass it to your ADAL-based app. ADAL can then find the account information silently with the `acquireTokenSilentWithResource:clientId:redirectUri:userId:completionBlock:` API.

### Use ADAL's homeAccountID with MSAL

ADAL 2.7.x returns the `homeAccountId` in the `ADUserInformation` object in the result via this property:

```objc
/*! Unique AAD account identifier across tenants based on user's home OID/home tenantId. */
@property (readonly) NSString *homeAccountId;
```

You can save this identifier to use in MSAL for account lookups with the `accountForIdentifier:error:" API. 

### Use ADAL account identifier to query accounts in MSAL

1. In MSAL, first lookup an account by `username` or `identifier`. Always use `identifier` for querying if you have it and only use `username` as a fallback. 

```objc
/*!
 Returns account for the given account identifier (received from an account object returned in a previous acquireToken call)
 
 @param  error      The error that occured trying to get the accounts, if any, if you're
                    not interested in the specific error pass in nil.
 */
- (nullable MSALAccount *)accountForIdentifier:(nonnull NSString *)identifier
                                         error:(NSError * _Nullable __autoreleasing * _Nullable)error;
    
/*!
Returns account for for the given username (received from an account object returned in a previous acquireToken call or ADAL)
    
@param  username    The displayable value in UserPrincipleName(UPN) format
@param  error       The error that occured trying to get the accounts, if any, if you're
                    not interested in the specific error pass in nil.
*/
- (MSALAccount *)accountForUsername:(NSString *)username
                              error:(NSError * __autoreleasing *)error;
```
    
2. Then use the account in the acquireTokenSilent calls:

```objc
NSString *msalIdentifier = @"previously.saved.msal.account.id";
MSALAccount *account = nil;
    
if (msalIdentifier)
{
    account = [application accountForIdentifier:@"my.account.id.here" error:nil];
}
else
{
    account = [application accountForUsername:@"adal.user.id" error:nil];
}
    
MSALSilentTokenParameters *silentParameters = [[MSALSilentTokenParameters alloc] initWithScopes:@[@"user.read"] account:account];
[application acquireTokenSilentWithParameters:silentParameters completionBlock:completionBlock];
```

## ADAL 2.x-2.6.6

This section covers SSO and ADAL 2.x-2.6.6.

Older ADAL versions don't natively support the MSAL cache format. However, to ensure smooth migration from ADAL to MSAL, MSAL can read the older ADAL cache format without prompting for user credentials again.

Because `homeAccountId` isn't available in older ADAL versions, you'd need to lookup accounts using the `username`:

```objc
/*!
 Returns account for for the given username (received from an account object returned in a previous acquireToken call or ADAL)

 @param  username    The displayable value in UserPrincipleName(UPN) format
 @param  error       The error that occurred trying to get the accounts, if any.  If you're not interested in the specific error pass in nil.
 */
- (MSALAccount *)accountForUsername:(NSString *)username
                              error:(NSError * __autoreleasing *)error;
```

Alternatively, you can read all of the accounts, which will also read account information from ADAL:

```objc
/*!
 Returns an array of all accounts visible to this application.

 @param  error    The error that occurred trying to retrieve accounts, if any. If you're not interested in the specific error pass in nil.
 */

- (NSArray <MSALAccount *> *)allAccounts:(NSError * __autoreleasing *)error;
```

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
