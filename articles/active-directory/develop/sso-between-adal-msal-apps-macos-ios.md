---
title: SSO between ADAL & MSAL apps (iOS/macOS) - Microsoft identity platform | Azure
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
ms.date: 08/28/2019
ms.author: twhitney
ms.reviewer: 
ms.custom: aaddev
---

# How to: SSO between ADAL and MSAL apps on macOS and iOS

The Microsoft Authentication Library (MSAL) for iOS can share SSO state with [ADAL Objective-C](https://github.com/AzureAD/azure-activedirectory-library-for-objc) between applications. You can migrate your apps to MSAL at your own pace, ensuring that your users will still benefit from cross-app SSO--even with a mix of ADAL and MSAL-based apps.

If you're looking for guidance of setting up SSO between apps using the MSAL SDK, see [Silent SSO between multiple apps](single-sign-on-macos-ios.md#silent-sso-between-apps). This article focuses on SSO between ADAL and MSAL.

The specifics implementing SSO depend on ADAL version that you're using.

## ADAL 2.7.x

This section covers SSO differences between MSAL and ADAL 2.7.x

### Cache format

ADAL 2.7.x can read the MSAL cache format. You don't need to do anything special for cross-app SSO with version ADAL 2.7.x. However, you need to be aware of differences in account identifiers that those two libraries support.

### Account identifier differences

MSAL and ADAL use different account identifiers. ADAL uses UPN as its primary account identifier. MSAL uses a non-displayable account identifier that is based of an object ID and a tenant ID for AAD accounts, and a `sub` claim for other types of accounts.

When you receive an `MSALAccount` object in the MSAL result, it contains an account identifier in the `identifier` property. The application should use this identifier for subsequent silent requests.

In addition to `identifier`, `MSALAccount` object contains a displayable identifier called `username`. That translates to `userId` in ADAL. `username` is not considered a unique identifier and can change anytime, so it should only be used for backward compatibility scenarios with ADAL. MSAL supports cache queries using either `username` or `identifier`, where querying by `identifier` is recommended.

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

### SSO from MSAL to ADAL

If you have an MSAL app and an ADAL app, and the user first signs into the MSAL-based app, you can get SSO in the ADAL app by saving the `username` from the `MSALAccount` object and passing it to your ADAL-based app as `userId`. ADAL can then find the account information silently with the `acquireTokenSilentWithResource:clientId:redirectUri:userId:completionBlock:` API.

### SSO from ADAL to MSAL

If you have an MSAL app and an ADAL app, and the user first signs into the ADAL-based app, you can use ADAL user identifiers for account lookups in MSAL. This also applies when migrating from ADAL to MSAL.

#### ADAL's homeAccountId

ADAL 2.7.x returns the `homeAccountId` in the `ADUserInformation` object in the result via this property:

```objc
/*! Unique AAD account identifier across tenants based on user's home OID/home tenantId. */
@property (readonly) NSString *homeAccountId;
```

`homeAccountId` in ADAL's is equivalent of `identifier` in MSAL. 
You can save this identifier to use in MSAL for account lookups with the `accountForIdentifier:error:` API.

#### ADAL's `userId`

If `homeAccountId` is not available, or you only have the displayable identifier, you can use ADAL's `userId` to lookup the account in  MSAL.

In MSAL, first look up an account by `username` or `identifier`. Always use `identifier` for querying if you have it, and only use `username` as a fallback. If the account is found, use the account in the `acquireTokenSilent` calls.

Objective-C:

```objc
NSString *msalIdentifier = @"previously.saved.msal.account.id";
MSALAccount *account = nil;
    
if (msalIdentifier)
{
    // If you have MSAL account id returned either from MSAL as identifier or ADAL as homeAccountId, use it
    account = [application accountForIdentifier:@"my.account.id.here" error:nil];
}
else
{
    // Fallback to ADAL userId for migration
    account = [application accountForUsername:@"adal.user.id" error:nil];
}
    
if (!account)
{
  // Account not found.
  return;
}

MSALSilentTokenParameters *silentParameters = [[MSALSilentTokenParameters alloc] initWithScopes:@[@"user.read"] account:account];
[application acquireTokenSilentWithParameters:silentParameters completionBlock:completionBlock];
```

Swift:

```swift
        
let msalIdentifier: String?
var account: MSALAccount
        
do {
  if let msalIdentifier = msalIdentifier {
    account = try application.account(forIdentifier: msalIdentifier)
  }
  else {
    account = try application.account(forUsername: "adal.user.id") 
  }
             
  let silentParameters = MSALSilentTokenParameters(scopes: ["user.read"], account: account)          
  application.acquireTokenSilent(with: silentParameters) {
    (result: MSALResult?, error: Error?) in
    // handle result
  }  
} catch let error as NSError {
  // handle error or account not found
}
```



MSAL supported account lookup APIs:

```objc
/*!
 Returns account for the given account identifier (received from an account object returned in a previous acquireToken call)
 
 @param  error      The error that occurred trying to get the accounts, if any, if you're
                    not interested in the specific error pass in nil.
 */
- (nullable MSALAccount *)accountForIdentifier:(nonnull NSString *)identifier
                                         error:(NSError * _Nullable __autoreleasing * _Nullable)error;
    
/*!
Returns account for for the given username (received from an account object returned in a previous acquireToken call or ADAL)
    
@param  username    The displayable value in UserPrincipleName(UPN) format
@param  error       The error that occurred trying to get the accounts, if any, if you're
                    not interested in the specific error pass in nil.
*/
- (MSALAccount *)accountForUsername:(NSString *)username
                              error:(NSError * __autoreleasing *)error;
```

## ADAL 2.x-2.6.6

This section covers SSO differences between MSAL and ADAL 2.x-2.6.6.

Older ADAL versions don't natively support the MSAL cache format. However, to ensure smooth migration from ADAL to MSAL, MSAL can read the older ADAL cache format without prompting for user credentials again.

Because `homeAccountId` isn't available in older ADAL versions, you'd need to look up accounts using the `username`:

```objc
/*!
 Returns account for for the given username (received from an account object returned in a previous acquireToken call or ADAL)

 @param  username    The displayable value in UserPrincipleName(UPN) format
 @param  error       The error that occurred trying to get the accounts, if any.  If you're not interested in the specific error pass in nil.
 */
- (MSALAccount *)accountForUsername:(NSString *)username
                              error:(NSError * __autoreleasing *)error;
```

For example:

Objective-C:


```objc
MSALAccount *account = [application accountForUsername:@"adal.user.id" error:nil];;
MSALSilentTokenParameters *silentParameters = [[MSALSilentTokenParameters alloc] initWithScopes:@[@"user.read"] account:account];
[application acquireTokenSilentWithParameters:silentParameters completionBlock:completionBlock];
```

Swift:

```swift
do {
  let account = try application.account(forUsername: "adal.user.id")          
  let silentParameters = MSALSilentTokenParameters(scopes: ["user.read"], account: account)
  application.acquireTokenSilent(with: silentParameters) { 
    (result: MSALResult?, error: Error?) in
    // handle result
  }   
} catch let error as NSError { 
  // handle error or account not found
}
```



Alternatively, you can read all of the accounts, which will also read account information from ADAL:

Objective-C:

```objc
NSArray *accounts = [application allAccounts:nil];
    
if ([accounts count] == 0)
{
  // No account found.
  return; 
}
if ([accounts count] > 1)
{
  // You might want to display an account picker to user in actual application
  // For this sample we assume there's only ever one account in cache
  return;
}
    ``
MSALSilentTokenParameters *silentParameters = [[MSALSilentTokenParameters alloc] initWithScopes:@[@"user.read"] account:accounts[0]];
[application acquireTokenSilentWithParameters:silentParameters completionBlock:completionBlock];
```

Swift:

```swift
      
do {
  let accounts = try application.allAccounts()
  if accounts.count == 0 {
    // No account found.
    return
  }
  if accounts.count > 1 {
    // You might want to display an account picker to user in actual application
    // For this sample we assume there's only ever one account in cache
    return
  }
  
  let silentParameters = MSALSilentTokenParameters(scopes: ["user.read"], account: accounts[0])
  application.acquireTokenSilent(with: silentParameters) {
    (result: MSALResult?, error: Error?) in
    // handle result or error  
  }  
} catch let error as NSError { 
  // handle error
}
```



## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
