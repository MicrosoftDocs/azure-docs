---
title: Single sign-on (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Learn about building single sign-on experiences using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/25/2021
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev, has-adal-ref
#Customer intent: As an application developer, I want to learn about enabling single sign on experiences with MSAL.js library so I can decide if this platform meets my application development needs and requirements.
---

# Single sign-on with MSAL.js

Single sign-on (SSO) provides a more seamless experience by reducing the number of times your users are asked for their credentials. Users enter their credentials once, and the established session can be reused by other applications on the device without further prompting. 

Azure Active Directory (Azure AD) enables SSO by setting a session cookie when a user first authenticates. MSAL.js allows use of the session cookie for SSO between the browser tabs opened for one or several applications.

## SSO between browser tabs

When a user has your application open in several tabs and signs in on one of them, they're signed into the same app open on the other tabs without being prompted. MSAL.js caches the ID token for the user in the browser `localStorage` and will sign the user in to the application on the other open tabs.

By default, MSAL.js uses `sessionStorage`, which doesn't allow the session to be shared between tabs. To get SSO between tabs, make sure to set the `cacheLocation` in MSAL.js to `localStorage` as shown below.

```javascript
const config = {
  auth: {
    clientId: "abcd-ef12-gh34-ikkl-ashdjhlhsdg",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

const msalInstance = new msal.PublicClientApplication(config);
```

## SSO between apps

When a user authenticates, a session cookie is set on the Azure AD domain in the browser. MSAL.js relies on this session cookie to provide SSO for the user between different applications. MSAL.js also caches the ID tokens and access tokens of the user in the browser storage per application domain. As a result, the SSO behavior varies for different cases:

### Applications on the same domain

When applications are hosted on the same domain, the user can sign into an app once and then get authenticated to the other apps without a prompt. MSAL.js uses the tokens cached for the user on the domain to provide SSO.

### Applications on different domain

When applications are hosted on different domains, the tokens cached on domain A cannot be accessed by MSAL.js in domain B.

When a user signed in on domain A navigates to an application on domain B, they're typically redirected or prompted to sign in. Because Azure AD still has the user's session cookie, it signs in the user without prompting for credentials.

If the user has multiple user accounts in a session with Azure AD, the user is prompted to pick an account to sign in with.

### Automatic account selection

When a user is signed in concurrently to multiple Azure AD accounts on the same device, you might find you have the need to bypass the account selection prompt.

**Using a session ID**

Use the session ID (SID) in silent authentication requests you make with `acquireTokenSilent` in MSAL.js.

To use a SID, add `sid` as an [optional claim](active-directory-optional-claims.md) to your app's ID tokens. The `sid` claim allows an application to identify a user's Azure AD session independent of their account name or username. To learn how to add optional claims like `sid`, see [Provide optional claims to your app](active-directory-optional-claims.md).

The SID is bound to the session cookie and won't cross browser contexts. You can use the SID only with `acquireTokenSilent`.

```javascript
var request = {
  scopes: ["user.read"],
  sid: sid,
};

 msalInstance.acquireTokenSilent(request)
  .then(function (response) {
    const token = response.accessToken;
  })
  .catch(function (error) {
    //handle error
  });
```

**Using a login hint**

To bypass the account selection prompt typically shown during interactive authentication requests (or for silent requests when you haven't configured the `sid` optional claim), provide a `loginHint`. In multi-tenant applications, also include a `domain_hint`.

```javascript
var request = {
  scopes: ["user.read"],
  loginHint: preferred_username,
  extraQueryParameters: { domain_hint: "organizations" },
};

 msalInstance.loginRedirect(request);
```

Get the values for `loginHint` and `domain_hint` from the user's **ID token**:

- `loginHint`: Use the ID token's `preferred_username` claim value.

- `domain_hint`: Use the ID token's `tid` claim value. Required in requests made by multi-tenant applications that use the */common* authority. Optional for other applications.

For more information about login hint and domain hint, see [Microsoft identity platform and OAuth 2.0 authorization code flow](v2-oauth2-auth-code-flow.md).

## SSO without MSAL.js login

By design, MSAL.js requires that a login method is called to establish a user context before getting tokens for APIs. Since login methods are interactive, the user sees a prompt.

There are certain cases in which applications have access to the authenticated user's context or ID token through authentication initiated in another application and want to use SSO to acquire tokens without first signing in through MSAL.js.

An example: A user is signed in to Microsoft account in a browser that hosts another JavaScript application running as an add-on or plugin, which requires a Microsoft account sign-in.

The SSO experience in this scenario can be achieved as follows:

Pass the `sid` if available (or `login_hint` and optionally `domain_hint`) as request parameters to the MSAL.js `acquireTokenSilent` call as follows:

```javascript
var request = {
  scopes: ["user.read"],
  loginHint: preferred_username,
  extraQueryParameters: { domain_hint: "organizations" },
};

msalInstance.acquireTokenSilent(request)
  .then(function (response) {
    const token = response.accessToken;
  })
  .catch(function (error) {
    //handle error
  });
```

## SSO in ADAL.js to MSAL.js update

MSAL.js brings feature parity with ADAL.js for Azure AD authentication scenarios. To make the migration from ADAL.js to MSAL.js easy and to avoid prompting your users to sign in again, the library reads the ID token representing user’s session in ADAL.js cache, and seamlessly signs in the user in MSAL.js.

To take advantage of the SSO behavior when updating from ADAL.js, you'll need to ensure the libraries are using `localStorage` for caching tokens. Set the `cacheLocation` to `localStorage` in both the MSAL.js and ADAL.js configuration at initialization as follows:

```javascript

// In ADAL.js
window.config = {
  clientId: "g075edef-0efa-453b-997b-de1337c29185",
  cacheLocation: "localStorage",
};

var authContext = new AuthenticationContext(config);

// In latest MSAL.js version
const config = {
  auth: {
    clientId: "abcd-ef12-gh34-ikkl-ashdjhlhsdg",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

const msalInstance = new msal.PublicClientApplication(config);
```

Once the `cacheLocation` is configured, MSAL.js can read the cached state of the authenticated user in ADAL.js and use that to provide SSO in MSAL.js.

## Next steps

For more information about SSO, see:

- [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md)
- [Configurable token lifetimes](active-directory-configurable-token-lifetimes.md)
