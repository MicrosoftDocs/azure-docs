---
title: Migrate applications and APIs to b2clogin.com
titleSuffix: Azure AD B2C
description: Learn how to update redirect URLs in Azure AD B2C applications to use b2clogin.com or a custom domain for authentication endpoints.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory

ms.topic: how-to
ms.date: 02/26/2025
ms.author: kengaderdus
ms.subservice: b2c


#Customer intent: As an Azure AD B2C application developer, I want to update the redirect URLs in my identity provider's applications to reference b2clogin.com or a custom domain, so that I can authenticate users with Azure AD B2C using the updated endpoints.

---

# Set redirect URLs to b2clogin.com for Azure Active Directory B2C

When you set up an identity provider for sign-up and sign-in in your Azure Active Directory B2C (Azure AD B2C) applications, you need to specify the endpoints of the Azure AD B2C identity provider. You should no longer reference *login.microsoftonline.com* in your applications and APIs for authenticating users with Azure AD B2C. Instead, use *b2clogin.com* or a [custom domain](./custom-domain.md) for all applications.

## What endpoints does this changes apply to

The transition to b2clogin.com only applies to authentication endpoints that use Azure AD B2C policies (user flows or custom policies) to authenticate users. These endpoints have a `<policy-name>` parameter, which specifies the policy Azure AD B2C should use. [Learn more about Azure AD B2C policies](technical-overview.md#identity-experiences-user-flows-or-custom-policies). 

Old endpoints may look like:
- <code>https://<b>login.microsoft.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/authorize</code> or <code>https://<b>login.microsoft.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/authorize<b>?p=\<policy-name\></b></code> for `/authorize` endpoint.
- <code>https://<b>login.microsoft.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/logout</code> or <code>https://<b>login.microsoft.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/logout<b>?p=\<policy-name\></b></code> for `/logout` endpoint.

A corresponding updated endpoint would look similar to the following endpoints:
- <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/authorize</code> or  <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/authorize?<b>p=\<policy-name\></b></code> for the `/authorize` endpoint.
- <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/logout</code> or <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/logout?<b>p=\<policy-name\></b></code> for the `/logout` endpoint.


With Azure AD B2C [custom domain](./custom-domain.md) the corresponding updated endpoint would look similar to the following endpoints. You can use either of these endpoints:

- <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/authorize</code> or <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/authorize?<b>p=\<policy-name\></b></code> for the `/authorize` endpoint.
- <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/logout</code> or <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/logout?<b>p=\<policy-name\></b></code> for the `/logout` endpoint.

## Endpoints that aren't affected

Some customers use the shared capabilities of Microsoft Entra enterprise tenants. For example, acquiring an access token to call the [MS Graph API](microsoft-graph-operations.md) of the Azure AD B2C tenant.

This change doesn't affect all endpoints, which don't contain a policy parameter in the URL. They're accessed only with the Microsoft Entra ID's login.microsoftonline.com endpoints, and can't be used with the *b2clogin.com*, or custom domains. The following example shows a valid token endpoint of the Microsoft identity platform:

```http
https://login.microsoftonline.com/<tenant-name>.onmicrosoft.com/oauth2/v2.0/token
```

However, if you only want to obtain a token to authenticate users, then you can specify the policy that your application wishes to use to authenticate users. In this case, the updated `/token` endpoints  would look similar to the following examples.

- <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/token</code> or  <code>https://<b>\<tenant-name\>.b2clogin.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/token?<b>p=\<policy-name\></b></code> when you use *b2clogin.com*. 

-  <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/<b>\<policy-name\></b>/oauth2/v2.0/token</code> or <code>https://<b>login.contoso.com</b>/\<tenant-name\>.onmicrosoft.com/oauth2/v2.0/token?<b>p=\<policy-name\></b></code> when you use a custom domain.

## Overview of required changes

There are several modifications you might need to make to migrate your applications from *login.microsoftonline.com* using Azure AD B2C endpoints:

* Change the redirect URL in your identity provider's applications to reference *b2clogin.com*, or custom domain. For more information, follow the [change identity provider redirect URLs](#change-identity-provider-redirect-urls) guidance.
* Update your Azure AD B2C applications to use *b2clogin.com*, or custom domain in their user flow and token endpoint references. The change may include updating your use of an authentication library like Microsoft Authentication Library (MSAL).
* Update any **Allowed Origins** that you define in the CORS settings for [user interface customization](customize-ui-with-html.md).

## Change identity provider redirect URLs

On each identity provider's website in which you've created an application, change all trusted URLs to redirect to `your-tenant-name.b2clogin.com`, or a custom domain instead of *login.microsoftonline.com*.

There are two formats you can use for your b2clogin.com redirect URLs. The first provides the benefit of not having "Microsoft" appear anywhere in the URL by using the Tenant ID (a GUID) in place of your tenant domain name. Note, the `authresp` endpoint may not contain a policy name.

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

### MSAL.NET ValidateAuthority property

If you're using [MSAL.NET][msal-dotnet] v2 or earlier, set the **ValidateAuthority** property to `false` on client instantiation to allow redirects to *b2clogin.com*. Setting this value to `false` isn't required for MSAL.NET v3 and later.

```csharp
ConfidentialClientApplication client = new ConfidentialClientApplication(...); // Can also be PublicClientApplication
client.ValidateAuthority = false; // MSAL.NET v2 and earlier **ONLY**
```

### MSAL for JavaScript validateAuthority property

If you're using [MSAL for JavaScript][msal-js] v1.2.2 or earlier, set the **validateAuthority** property to `false`.

```JavaScript
// MSAL.js v1.2.2 and earlier
this.clientApplication = new UserAgentApplication(
  env.auth.clientId,
  env.auth.loginAuthority,
  this.authCallback.bind(this),
  {
    validateAuthority: false // Required in MSAL.js v1.2.2 and earlier **ONLY**
  }
);
```

If you set `validateAuthority: true` in MSAL.js 1.3.0+ (the default), you must also specify a valid token issuer with `knownAuthorities`:

```JavaScript
// MSAL.js v1.3.0+
this.clientApplication = new UserAgentApplication(
  env.auth.clientId,
  env.auth.loginAuthority,
  this.authCallback.bind(this),
  {
    validateAuthority: true, // Supported in MSAL.js v1.3.0+
    knownAuthorities: ['tenant-name.b2clogin.com'] // Required if validateAuthority: true
  }
);
```

## Related content

For information about migrating OWIN-based web applications to b2clogin.com, see [Migrate an OWIN-based web API to b2clogin.com](multiple-token-endpoints.md).

For migrating Azure API Management APIs protected by Azure AD B2C, see the [Migrate to b2clogin.com](secure-api-management.md#migrate-to-b2clogincom) section of [Secure an Azure API Management API with Azure AD B2C](secure-api-management.md).

<!-- LINKS - External -->
[msal-dotnet]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet
[msal-dotnet-b2c]: https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics
[msal-js]: https://github.com/AzureAD/microsoft-authentication-library-for-js
[msal-js-b2c]: ../active-directory/develop/msal-b2c-overview.md