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
ms.date: 08/19/2019
ms.author: twhitney
ms.reviewer: 
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: SSO between ADAL and MSAL apps on macOS and iOS

Microsoft Authentication Library (MSAL) for macOS and iOS, starting with [0.2.0](https://github.com/AzureAD/microsoft-authentication-library-for-objc/releases/tag/0.2.0), can coexist in the same app, and share SSO state with [ADAL Objective-C](https://github.com/AzureAD/azure-activedirectory-library-for-objc). You can migrate your apps to MSAL Objective-C at your own pace, ensuring that your users will still benefit from cross-app SSO even with a mix of ADAL and MSAL based apps.

If you're looking for guidance of setting up SSO between apps using the MSAL SDK, see [Silent SSO between multiple apps](single-sign-on-macos-ios.md#silent-sso-between-multiple-apps). This article focuses on SSO between ADAL and MSAL.

The specifics implementing SSO depend on ADAL version that you're using:

## ADAL 2.7.x

This section covers SSO and ADAL 2.7.x

### Cache format

ADAL 2.7.x can read the MSAL cache format. You don't need to do anything special for cross-app SSO with version ADAL 2.7.x.

### Account identifier differences

MSAL and ADAL use different account identifiers. ADAL uses UPN as its primary account identifier. MSAL uses the Home Account Identifier as its primary account identifier, which contains the account's object ID and tenant ID.

When you receive an `MSALAccount` object in the result, it will contain both of those identifiers.

`username` translates to `userId` in ADAL. Whereas MSAL supports cache queries using either `username` or `homeAccountIdentifier`.

This is the `MSALAccount` interface:

```objc
@interface MSALAccount : NSObject <NSCopying>

/*!
 The displayable value in UserPrincipleName(UPN) format. Can be nil if not returned from the service.
 This is the primary ADAL identifier for acquireTokenSilent calls.
 */
@property (readonly) NSString *username;

/*!
 Unique identifier of the account in the home directory.
 This is the primary MSAL identifier for acquireTokenSilent calls.
 */
@property (readonly) MSALAccountId *homeAccountId;

/*!
 Host part of the authority string used for authentication.
 */
@property (readonly) NSString *environment;

@end
```

### Acquire a token silently

If another app has previously signed in using MSAL, save the `username` from the `MSALAccount` object and pass it to your ADAL-based app. ADAL can then find the account information silently with the `acquireTokenSilentWithResource:clientId:redirectUri:userId:completionBlock:` API.

### Use ADAL's homeAccountID with MSAL

ADAL 2.7.x returns the `homeAccountId` in the `ADUserInformation` object in the result via this property:

```objc
/*! Unique AAD account identifier across tenants based on user's home OID/home tenantId. */
@property (readonly) NSString *homeAccountId;
```

 Save this identifier to use in MSAL.

### Use an MSAL account with ADAL

1. In MSAL, first lookup an account by `username` or `homeAccountId`:

```objc
/*!
 Returns account for for the given home identifier (received from an account object returned in a previous acquireToken call)

 @param  error      The error that occured trying to get the accounts, if any, if you're
                    not interested in the specific error pass in nil.
 */
- (MSALAccount *)accountForHomeAccountId:(NSString *)homeAccountId
                                   error:(NSError * __autoreleasing *)error;

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
/*!
    Acquire a token silently for an existing account.
 
    @param  scopes      Permissions you want included in the access token received
                                  in the result in the completionBlock. Not all scopes are
                                  guaranteed to be included in the access token returned.
    @param  account     An account object retrieved from the application object that the
                                  interactive authentication flow will be locked down to.
    @param  completionBlock   The completion block that will be called when the authentication
                                            flow completes, or encounters an error.
 */
- (void)acquireTokenSilentForScopes:(NSArray<NSString *> *)scopes
                            account:(MSALAccount *)account
                    completionBlock:(MSALCompletionBlock)completionBlock;
```

## ADAL 2.x-2.6.6

This section covers SSO and ADAL 2.x-2.6.6.

Older ADAL versions don't natively support the MSAL cache format. However, to ensure smooth migration from ADAL to MSAL, MSAL can read the older ADAL cache format without prompting for user credentials again.

Because `homeAccountId` isn't available in older ADAL versions, lookup accounts using the `username`:

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
