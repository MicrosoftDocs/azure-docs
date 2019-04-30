---
title: Get consent for several resources (Microsoft Authentication Library for .NET) | Azure
description: Learn about initializing public client and confidential client applications using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
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
#Customer intent: As an application developer, I want to learn about initializing client applications so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# User gets consent for several resources using MSAL.NET


The Azure AD v2.0 endpoint does not allow you to get a token for several resources at once. Therefore the scopes parameter should only contain scopes for a single resource. However, you can ensure that the user pre-consents to several resources by using the extraScopesToConsent parameter.

> [!NOTE]
> Getting consent for several resources works for Microsoft identity platform, but not for Azure AD B2C. B2C supports only admin consent, not user consent.

For example, if you have two resources that have 2 scopes each:

- https://mytenant.onmicrosoft.com/customerapi (with 2 scopes customer.read and customer.write)
- https://mytenant.onmicrosoft.com/vendorapi (with 2 scopes vendor.read and vendor.write)

You should use the `.WithAdditionalPromptToConsent` modifier which has the *extraScopesToConsent* parameter

For example:

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

This will get you an access token for the first Web API. Then, you can silently acquire the second token from the token cache:

```csharp
AcquireTokenSilent(scopesForVendorApi, accounts.FirstOrDefault()).ExecuteAsync();
```
See this GitHub issue for more context.