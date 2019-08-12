---
title: Set redirect URLs to b2clogin.com - Azure Active Directory B2C
description: Learn about using b2clogin.com in your redirect URLs for Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/17/2019
ms.author: marsma
ms.subservice: B2C
---

# Set redirect URLs to b2clogin.com for Azure Active Directory B2C

When you set up an identity provider for sign-up and sign-in in your Azure Active Directory B2C (Azure AD B2C) application, you need to specify a redirect URL. You should no longer use the legacy *login.microsoftonline.com* in your applications and APIs. Instead, use *b2clogin.com* for all new applications, and migrate existing applications from *login.microsoftonline.com* to *b2clogin.com*.

## Benefits of b2clogin.com

When you use *b2clogin.com* as your redirect URI:

* Space consumed in the cookie header by Microsoft services is reduced.
* Your URLs no longer need to include a reference to Microsoft. For example, you can use `https://your-tenant-name.b2clogin.com/your-tenant-guid/oauth2/authresp`.
  * You can still use the tenant name in the URI if you prefer. For example, `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`.
* JavaScript client-side code is supported (currently in preview) in customized pages.
  * Due to security restrictions, both JavaScript code and HTML form elements are removed from custom pages if you use *login.microsoftonline.com*.

## Overview of required changes

There are several modifications you might need to make to migrate to *b2clogin.com*:

* Set the redirect URLs in your identity provider's applications to use *b2clogin.com*.
* Set your Azure AD B2C application to use *b2clogin.com* for its user flow references and token endpoints.
* Change any **Allowed Origins** that you've defined in the CORS settings for [user-interface customization](active-directory-b2c-ui-customization-custom-dynamic.md).

## Change identity provider redirect URLs

On each identity provider's website in which you've created an application, change all trusted URLs to redirect to *b2clogin.com*.

If you have it configured to redirect to a *login.microsoftonline.com* URL, modify it so that `your-tenant-name.b2clogin.com` is authorized. Replace `your-tenant-name` with the name of your Azure AD B2C tenant, and remove `/te` if it exists in the URL. There are slight variations to this URL for each identity provider, so check the corresponding page on the identity provider's site to get the exact URL format.

## Update your applications and APIs

The code in your Azure AD B2C-enabled applications may refer to `login.microsoftonline.com` in several places, for example references to user flows and token endpoints. Update the following to instead reference `your-tenant-name.b2clogin.com`:

* Authorization endpoint
* Token endpoint
* Token issuer

## Microsoft Authentication Library (MSAL)

### Set the ValidateAuthority property

If you're using [MSAL .NET][msal-dotnet] v2 or earlier, set the **ValidateAuthority** property to `false` to allow redirects to b2clogin.com. This setting is not required for MSAL .NET v3 and above.

For example

```CSharp
 ConfidentialClientApplication client = new ConfidentialClientApplication(...); // can also be PublicClientApplication
 client.ValidateAuthority = false;
```

In [MSAL for Javascript][msal-js]:

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

<!-- LINKS - External -->
[msal-dotnet]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet
[msal-js]: https://github.com/AzureAD/microsoft-authentication-library-for-js