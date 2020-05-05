---
title: Move desktop app calling web APIs to production - Microsoft identity platform | Azure
description: Learn how to move a desktop app that calls web APIs to production
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform for developers.
---

# Desktop app that calls web APIs: Move to production

In this article, you learn how to move your desktop app that calls web APIs to production.

## Handle errors in desktop applications

In the different flows, you've learned how to handle the errors for the silent flows, as shown in the code snippets. You've also seen that there are cases where interaction is needed, as in incremental consent and conditional access.

## Have the user consent upfront for several resources

> [!NOTE]
> Getting consent for several resources works for Microsoft identity platform but not for Azure Active Directory (Azure AD) B2C. Azure AD B2C supports only admin consent, not user consent.

You can't get a token for several resources at once with the Microsoft identity platform (v2.0) endpoint. The `scopes` parameter can contain scopes for only a single resource. You can ensure that the user pre-consents to several resources by using the `extraScopesToConsent` parameter.

For instance, you might have two resources that have two scopes each:

- `https://mytenant.onmicrosoft.com/customerapi` with the scopes `customer.read` and `customer.write`
- `https://mytenant.onmicrosoft.com/vendorapi` with the scopes `vendor.read` and `vendor.write`

In this example, use the `.WithAdditionalPromptToConsent` modifier that has the `extraScopesToConsent` parameter.

For instance:

### In MSAL.NET

```csharp
string[] scopesForCustomerApi = new string[]
{
  "https://mytenant.onmicrosoft.com/customerapi/customer.read",
  "https://mytenant.onmicrosoft.com/customerapi/customer.write"
};
string[] scopesForVendorApi = new string[]
{
 "https://mytenant.onmicrosoft.com/vendorapi/vendor.read",
 "https://mytenant.onmicrosoft.com/vendorapi/vendor.write"
};

var accounts = await app.GetAccountsAsync();
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithAccount(accounts.FirstOrDefault())
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

### In MSAL for iOS and macOS

Objective-C:

```objc
NSArray *scopesForCustomerApi = @[@"https://mytenant.onmicrosoft.com/customerapi/customer.read",
                                @"https://mytenant.onmicrosoft.com/customerapi/customer.write"];

NSArray *scopesForVendorApi = @[@"https://mytenant.onmicrosoft.com/vendorapi/vendor.read",
                              @"https://mytenant.onmicrosoft.com/vendorapi/vendor.write"]

MSALInteractiveTokenParameters *interactiveParams = [[MSALInteractiveTokenParameters alloc] initWithScopes:scopesForCustomerApi webviewParameters:[MSALWebviewParameters new]];
interactiveParams.extraScopesToConsent = scopesForVendorApi;
[application acquireTokenWithParameters:interactiveParams completionBlock:^(MSALResult *result, NSError *error) { /* handle result */ }];
```

Swift:

```swift
let scopesForCustomerApi = ["https://mytenant.onmicrosoft.com/customerapi/customer.read",
                            "https://mytenant.onmicrosoft.com/customerapi/customer.write"]

let scopesForVendorApi = ["https://mytenant.onmicrosoft.com/vendorapi/vendor.read",
                          "https://mytenant.onmicrosoft.com/vendorapi/vendor.write"]

let interactiveParameters = MSALInteractiveTokenParameters(scopes: scopesForCustomerApi, webviewParameters: MSALWebviewParameters())
interactiveParameters.extraScopesToConsent = scopesForVendorApi
application.acquireToken(with: interactiveParameters, completionBlock: { (result, error) in /* handle result */ })
```

This call gets you an access token for the first web API.

When you need to call the second web API, call the `AcquireTokenSilent` API.

```csharp
AcquireTokenSilent(scopesForVendorApi, accounts.FirstOrDefault()).ExecuteAsync();
```

### Microsoft personal account requires reconsent each time the app runs

For Microsoft personal account users, reprompting for consent on each native client (desktop or mobile app) call to authorize is the intended behavior. Native client identity is inherently insecure, which is contrary to confidential client application identity. Confidential client applications exchange a secret with the Microsoft Identity platform to prove their identity. The Microsoft identity platform chose to mitigate this insecurity for consumer services by prompting the user for consent each time the application is authorized.

## Next steps

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]
