---
title: Desktop app that calls web APIs (move to production) - Microsoft identity platform
description: Learn how to build a Desktop app that calls web APIs (move to production)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Desktop app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Desktop app that calls web APIs - move to production

This article provides you details to improve your application further and move it to production.

## Handling errors in desktop applications

In the different flows, you've learned how to handle the errors for the silent flows (as shown in code snippets). You've also seen that there are cases where interaction is needed (incremental consent and Conditional Access).

## How to have  the user consent upfront for several resources

> [!NOTE]
> Getting consent for several resources works for Microsoft identity platform, but not for Azure Active Directory (Azure AD) B2C. Azure AD B2C supports only admin consent, not user consent.

The Microsoft identity platform (v2.0) endpoint doesn't allow you to get a token for several resources at once. Therefore, the `scopes` parameter can only contain scopes for a single resource. You can ensure that the user pre-consents to several resources by using the `extraScopesToConsent` parameter.

For instance, if you have two resources, which have two scopes each:

- `https://mytenant.onmicrosoft.com/customerapi` - with 2 scopes `customer.read` and `customer.write`
- `https://mytenant.onmicrosoft.com/vendorapi` - with 2 scopes `vendor.read` and `vendor.write`

You should use the `.WithAdditionalPromptToConsent` modifier that has the `extraScopesToConsent` parameter.

For instance:

```CSharp
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

This call will get you an access token for the first web API.

When you need to call the second web API, you can call:

```CSharp
AcquireTokenSilent(scopesForVendorApi, accounts.FirstOrDefault()).ExecuteAsync();
```

### Microsoft personal account requires reconsenting each time the app is run

For Microsoft personal accounts users, reprompting for consent on each native client (desktop/mobile app) call to authorize is the intended behavior. Native client identity is inherently insecure (contrary to confidential client application which exchange a secret with the Microsoft Identity platform to prove their identity). The Microsoft identity platform chose to mitigate this insecurity for consumer services by prompting the user for consent, each time the application is authorized.

## Next steps

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]
