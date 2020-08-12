---
author: mmacy
ms.service: active-directory
ms.subservice: develop
ms.topic: include
ms.date: 07/27/2020
ms.author: marsma
# Notification of MSAL.js 2.0 + Azure AD B2C incompatibility due to CORS issue on B2C endpoint.
# GitHub issue for tracking: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/1795
---
> [!IMPORTANT]
> MSAL.js 2.0 does not currently support Azure AD B2C for use with the PKCE authorization code flow. At this time, Azure AD B2C recommends using the implicit flow as described in [Tutorial: Register an application][implicit-flow]. To follow progress on this issue, see the [MSAL.js wiki][msal-wiki].

[github-issue]: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/1795
[implicit-flow]: ../articles/active-directory-b2c/tutorial-register-applications.md
[msal-wiki]: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-browser-B2C-CORS-issue
