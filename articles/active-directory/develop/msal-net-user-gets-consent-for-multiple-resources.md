---
title: Get consent for several resources (Microsoft Authentication Library for .NET) | Azure
description: Learn how a user can get pre-consent for several resources using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/30/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to specify additional scopes so I can get pre-consent for several resources.
ms.collection: M365-identity-device-management
---

# User gets consent for several resources using MSAL.NET
The Microsoft identity platform endpoint does not allow you to get a token for several resources at once. When using the Microsoft Authentication Library for .NET (MSAL.NET), the scopes parameter in the acquire token method should only contain scopes for a single resource. However, you can pre-consent to several resources upfront by specifying additional scopes using the `.WithExtraScopeToConsent` builder method.

> [!NOTE]
> Getting consent for several resources works for Microsoft identity platform, but not for Azure AD B2C. Azure AD B2C supports only admin consent, not user consent.

For example, if you have two resources that have 2 scopes each:

- https:\//mytenant.onmicrosoft.com/customerapi (with 2 scopes `customer.read` and `customer.write`)
- https:\//mytenant.onmicrosoft.com/vendorapi (with 2 scopes `vendor.read` and `vendor.write`)

You should use the `.WithExtraScopeToConsent` modifier which has the *extraScopesToConsent* parameter as shown in the following example:

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

This will get you an access token for the first web API. Then, when you need to access the second web API you can silently acquire the token from the token cache:

```csharp
AcquireTokenSilent(scopesForVendorApi, accounts.FirstOrDefault()).ExecuteAsync();
```
