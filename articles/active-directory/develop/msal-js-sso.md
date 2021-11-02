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

Single Sign-On (SSO) enables users to enter their credentials once to sign in and establish a session, which can be reused across multiple applications without requiring to authenticate again. The session provides a seamless experience to the user and reduces the repeated prompts for credentials.

Azure Active Directory (Azure AD) provides SSO capabilities to applications by setting a session cookie when the user authenticates the first time. The MSAL.js library allows applications to apply a session cookie in a few ways.

## SSO between browser tabs

When your application is open in multiple tabs and you first sign in the user on one tab, the user is also signed in on the other tabs without being prompted. MSAL.js caches the ID token for the user in the browser `localStorage` and will sign the user in to the application on the other open tabs.

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

const myMSALObj = new UserAgentApplication(config);
```

## SSO between apps

When a user authenticates, a session cookie is set on the Azure AD domain in the browser. MSAL.js relies on this session cookie to provide SSO for the user between different applications. MSAL.js also caches the ID tokens and access tokens of the user in the browser storage per application domain. As a result, the SSO behavior varies for different cases:

### Applications on the same domain

When applications are hosted on the same domain, the user can sign into an app once and then get authenticated to the other apps without a prompt. MSAL.js uses the tokens cached for the user on the domain to provide SSO.

### Applications on different domain

When applications are hosted on different domains, the tokens cached on domain A cannot be accessed by MSAL.js in domain B.

When a user is signed in on domain A navigate to an application on domain B, the user will be redirected or prompted with the sign-in page. Since Azure AD still has the user session cookie, it will sign in the user and no prompt for credentials.

If the user has multiple user accounts in session with Azure AD, the user will be prompted to pick the relevant account to sign in with.

### Automatically select account on Azure AD

In certain cases, the application has access to the user's authentication context and there's a need to bypass the Azure AD account selection prompt when multiple accounts are signed in. Bypassing the Azure AD account selection prompt can be done in a few different ways:

**Using Session ID**

Session ID (SID) is an [optional claim](active-directory-optional-claims.md) that can be configured in the ID tokens. A claim allows the application to identify the user’s Azure AD session independent of the user’s account name or username. You can pass the SID in the request parameters to the `acquireTokenSilent` call. The `acquireTokenSilent` in the request parameters allow Azure AD to bypass the account selection. SID is bound to the session cookie and won't cross browser contexts.

```javascript
var request = {
  scopes: ["user.read"],
  sid: sid,
};

userAgentApplication
  .acquireTokenSilent(request)
  .then(function (response) {
    const token = response.accessToken;
  })
  .catch(function (error) {
    //handle error
  });
```

SID can be used only with silent authentication requests made by `acquireTokenSilent` call in MSAL.js. To find the steps to configure optional claims in your application manifest, see [Provide optional claims to your app](active-directory-optional-claims.md).

**Using Login Hint**

If you don't have SID claim configured or need to bypass the account selection prompt in interactive authentication calls, you can do so by providing a `login_hint` in the request parameters and optionally a `domain_hint` as `extraQueryParameters` in the MSAL.js interactive methods (`loginPopup`, `loginRedirect`, `acquireTokenPopup`, and `acquireTokenRedirect`). For example:

```javascript
var request = {
  scopes: ["user.read"],
  loginHint: preferred_username,
  extraQueryParameters: { domain_hint: "organizations" },
};

userAgentApplication.loginRedirect(request);
```

To get the values for login_hint and domain_hint by reading the claims returned in the ID token for the user.

- **loginHint** should be set to the `preferred_username` claim in the ID token.

- **domain_hint** is only required to be passed when using the /common authority. The domain hint is determined by tenant ID(tid). If the `tid` claim in the ID token is `9188040d-6c67-4c5b-b112-36a304b66dad` it's consumers. Otherwise, it's organizations.

For more information about **login_hint** and **domain_hint**, see  [Implicit grant flow](v2-oauth2-implicit-grant-flow.md).

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

userAgentApplication
  .acquireTokenSilent(request)
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

const myMSALObj = new UserAgentApplication(config);
```

Once the `cacheLocation` is configured, MSAL.js can read the cached state of the authenticated user in ADAL.js and use that to provide SSO in MSAL.js.

## Next steps

For more information about SSO, see:

- [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md)
- [Configurable token lifetimes](active-directory-configurable-token-lifetimes.md)
