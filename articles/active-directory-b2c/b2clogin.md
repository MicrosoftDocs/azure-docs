---
title: Migrate applications and APIs to b2clogin.com
titleSuffix: Azure AD B2C
description: Learn about using b2clogin.com in your redirect URLs for Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/04/2019
ms.author: mimart
ms.subservice: B2C
---

# Set redirect URLs to b2clogin.com for Azure Active Directory B2C

When you set up an identity provider for sign-up and sign-in in your Azure Active Directory B2C (Azure AD B2C) application, you need to specify a redirect URL. You should no longer reference *login.microsoftonline.com* in your applications and APIs. Instead, use *b2clogin.com* for all new applications, and migrate existing applications from *login.microsoftonline.com* to *b2clogin.com*.

## Deprecation of login.microsoftonline.com

On 04 December 2019, we announced the scheduled retirement of login.microsoftonline.com support in Azure AD B2C on **04 December 2020**:

[Azure Active Directory B2C is deprecating login.microsoftonline.com](https://azure.microsoft.com/updates/b2c-deprecate-msol/)

The deprecation of login.microsoftonline.com goes into effect for all Azure AD B2C tenants on 04 December 2020, providing existing tenants one (1) year to migrate to b2clogin.com. New tenants created after 04 December 2019 will not accept requests from login.microsoftonline.com. All functionality remains the same on the b2clogin.com endpoint.

The deprecation of login.microsoftonline.com does not impact Azure Active Directory tenants. Only Azure Active Directory B2C tenants are affected by this change.

## Benefits of b2clogin.com

When you use *b2clogin.com* as your redirect URL:

* Space consumed in the cookie header by Microsoft services is reduced.
* Your redirect URLs no longer need to include a reference to Microsoft.
* JavaScript client-side code is supported (currently in [preview](user-flow-javascript-overview.md)) in customized pages. Due to security restrictions, JavaScript code and HTML form elements are removed from custom pages if you use *login.microsoftonline.com*.

## Overview of required changes

There are several modifications you might need to make to migrate your applications to *b2clogin.com*:

* Change the redirect URL in your identity provider's applications to reference *b2clogin.com*.
* Update your Azure AD B2C applications to use *b2clogin.com* in their user flow and token endpoint references.
* Update any **Allowed Origins** that you've defined in the CORS settings for [user interface customization](custom-policy-ui-customization.md).

## Change identity provider redirect URLs

On each identity provider's website in which you've created an application, change all trusted URLs to redirect to `your-tenant-name.b2clogin.com` instead of *login.microsoftonline.com*.

There are two formats you can use for your b2clogin.com redirect URLs. The first provides the benefit of not having "Microsoft" appear anywhere in the URL by using the Tenant ID (a GUID) in place of your tenant domain name:

```
https://{your-tenant-name}.b2clogin.com/{your-tenant-id}/oauth2/authresp
```

The second option uses your tenant domain name in the form of `your-tenant-name.onmicrosoft.com`. For example:

```
https://{your-tenant-name}.b2clogin.com/{your-tenant-name}.onmicrosoft.com/oauth2/authresp
```

For both formats:

* Replace `{your-tenant-name}` with the name of your Azure AD B2C tenant.
* Remove `/te` if it exists in the URL.

## Update your applications and APIs

The code in your Azure AD B2C-enabled applications and APIs may refer to `login.microsoftonline.com` in several places. For example, your code might have references to user flows and token endpoints. Update the following to instead reference `your-tenant-name.b2clogin.com`:

* Authorization endpoint
* Token endpoint
* Token issuer

For example, the authority endpoint for Contoso's sign-up/sign-in policy would now be:

```
https://contosob2c.b2clogin.com/00000000-0000-0000-0000-000000000000/B2C_1_signupsignin1
```

For information about migrating OWIN-based web applications to b2clogin.com, see [Migrate an OWIN-based web API to b2clogin.com](multiple-token-endpoints.md).

For migrating Azure API Management APIs protected by Azure AD B2C, see the [Migrate to b2clogin.com](secure-api-management.md#migrate-to-b2clogincom) section of [Secure an Azure API Management API with Azure AD B2C](secure-api-management.md).

## Microsoft Authentication Library (MSAL)

### ValidateAuthority property

If you're using [MSAL.NET][msal-dotnet] v2 or earlier, set the **ValidateAuthority** property to `false` on client instantiation to allow redirects to *b2clogin.com*. This setting is not required for MSAL.NET v3 and above.

```csharp
ConfidentialClientApplication client = new ConfidentialClientApplication(...); // Can also be PublicClientApplication
client.ValidateAuthority = false; // MSAL.NET v2 and earlier **ONLY**
```

If you're using [MSAL for JavaScript][msal-js]:

```JavaScript
this.clientApplication = new UserAgentApplication(
  env.auth.clientId,
  env.auth.loginAuthority,
  this.authCallback.bind(this),
  {
    validateAuthority: false
  }
);
```

## Next steps

For information about migrating OWIN-based web applications to b2clogin.com, see [Migrate an OWIN-based web API to b2clogin.com](multiple-token-endpoints.md).

For migrating Azure API Management APIs protected by Azure AD B2C, see the [Migrate to b2clogin.com](secure-api-management.md#migrate-to-b2clogincom) section of [Secure an Azure API Management API with Azure AD B2C](secure-api-management.md).

<!-- LINKS - External -->
[msal-dotnet]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet
[msal-dotnet-b2c]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics
[msal-js]: https://github.com/AzureAD/microsoft-authentication-library-for-js
[msal-js-b2c]: ../active-directory/develop/msal-b2c-overview.md
