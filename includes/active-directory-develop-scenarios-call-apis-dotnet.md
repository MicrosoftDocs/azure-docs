---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: include file
---

### AuthenticationResult properties in MSAL.NET

The methods to acquire tokens return an `AuthenticationResult` (or, for the async methods, a `Task<AuthenticationResult>`.

In MSAL.NET, `AuthenticationResult` exposes:

- `AccessToken` for the Web API to access resources. This parameter is a string, usually a base64 encoded JWT but the client should never look inside the access token. The format isn't guaranteed to remain stable and it can be encrypted for the resource. People writing code depending on access token content on the client is one of the biggest sources of errors and client logic breaks. See also [Access tokens](../articles/active-directory/develop/access-tokens.md)
- `IdToken` for the user (this parameter is an encoded JWT). See [ID Tokens](../articles/active-directory/develop/id-tokens.md)
- `ExpiresOn` tells the date/time when the token expires
- `TenantId` contains the tenant in which the user was found. For guest users (Azure AD B2B scenarios), the Tenant ID is the guest tenant, not the unique tenant.
When the token is delivered for a user, `AuthenticationResult` also contains information about this user. For confidential client flows where tokens are requested with no user (for the application), this User information is null.
- The `Scopes` for which the token was issued.
- The unique Id for the user.

### IAccount

MSAL.NET defines the notion of Account (through the `IAccount` interface). This breaking change provides the right semantics: the fact that the same user can have several accounts, in different Azure AD directories. Also MSAL.NET provides better information in the case of guest scenarios, as home account information is provided.
The following diagram shows the structure of the `IAccount` interface:

![image](https://user-images.githubusercontent.com/13203188/44657759-4f2df780-a9fe-11e8-97d1-1abbffade340.png)

The `AccountId` class identifies an account in a specific tenant. It has the following properties:

| Property | Description |
|----------|-------------|
| `TenantId` | A string representation for a GUID, which is the ID of the tenant where the account resides. |
| `ObjectId` | A string representation for a GUID, which is the ID of the user who owns the account in the tenant. |
| `Identifier` | Unique identifier for the account. `Identifier` is the concatenation of `ObjectId` and `TenantId` separated by a comma and are not base64 encoded. |

The `IAccount` interface represents information about a single account. The same user can be present in different tenants, that is, a user can have multiple accounts. Its members are:

| Property | Description |
|----------|-------------|
| `Username` | A string containing the displayable value in UserPrincipalName (UPN) format, for example, john.doe@contoso.com. This string can be null, whereas the HomeAccountId and HomeAccountId.Identifier won’t be null. This property replaces the `DisplayableId` property of `IUser` in previous versions of MSAL.NET. |
| `Environment` | A string containing the identity provider for this account, for example, `login.microsoftonline.com`. This property replaces the `IdentityProvider` property of `IUser`, except that `IdentityProvider` also had information about the tenant (in addition to the cloud environment), whereas here the value is only the host. |
| `HomeAccountId` | AccountId of the home account for the user. This property uniquely identifies the user across Azure AD tenants. |

### Using the token to call a protected API

Once the `AuthenticationResult` has been returned by MSAL (in `result`), you need to add it to the HTTP authorization header, before making the call to access the protected Web API.

```CSharp
httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

// Call Web API.
HttpResponseMessage response = await _httpClient.GetAsync(apiUri);
...
}
```