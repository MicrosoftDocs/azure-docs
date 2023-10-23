---
title: Cookie definitions
titleSuffix: Azure AD B2C
description: Provides definitions for the cookies used in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 03/20/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Cookies definitions for Azure AD B2C

The following sections provide information about the cookies used in Azure Active Directory B2C (Azure AD B2C).

## SameSite

The Azure B2C service is compatible with SameSite browser configurations, including support for `SameSite=None` with the `Secure` attribute.

To safeguard access to sites, web browsers will introduce a new secure-by-default model that assumes all cookies should be protected from external access unless otherwise specified. The Chrome browser is the first to implement this change, starting with [Chrome 80 in February 2020](https://www.chromium.org/updates/same-site/). For more information about preparing for the change in Chrome, see [Developers: Get Ready for New SameSite=None; Secure Cookie Settings](https://blog.chromium.org/2019/10/developers-get-ready-for-new.html) on the Chromium Blog.

Developers must use the new cookie setting, `SameSite=None`, to designate cookies for cross-site access. When the `SameSite=None` attribute is present, an additional `Secure` attribute must be used so cross-site cookies can only be accessed over HTTPS connections. Validate and test all your applications, including those applications that use Azure AD B2C.

For more information, see:

* [Handle SameSite cookie changes in Chrome browser](../active-directory/develop/howto-handle-samesite-cookie-changes-chrome-browser.md)
* [Effect on customer websites and Microsoft services and products in Chrome version 80 or later](https://support.microsoft.com/help/4522904/potential-disruption-to-customer-websites-in-latest-chrome)

## Cookies

The following table lists the cookies used in Azure AD B2C.

| Name | Domain | Expiration | Purpose |
| ----------- | ------ | -------------------------- | --------- |
| `x-ms-cpim-admin` | main.b2cadmin.ext.azure.com | End of [browser session](session-behavior.md) | Holds user membership data across tenants. The tenants a user is a member of and level of membership (Admin or User). |
| `x-ms-cpim-slice` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used to route requests to the appropriate production instance. |
| `x-ms-cpim-trans` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for tracking the transactions  (number of authentication requests to Azure AD B2C) and the current transaction. |
| `x-ms-cpim-sso:{Id}` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for maintaining the SSO session. This cookie is set as `persistent`, when [Keep Me Signed In](session-behavior.md#enable-keep-me-signed-in-kmsi) is enabled.|
| `x-ms-cpim-cache:{id}_n` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md), successful authentication | Used for maintaining the request state. |
| `x-ms-cpim-csrf` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Cross-Site Request Forgery token used for CRSF protection. For more information, read the [Cross-Site request forgery token](#cross-site-request-forgery-token) section. |
| `x-ms-cpim-dc` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for Azure AD B2C network routing. |
| `x-ms-cpim-ctx` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Context |
| `x-ms-cpim-rp` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for storing membership data for the resource provider tenant. |
| `x-ms-cpim-rc` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for storing the relay cookie. |
| `x-ms-cpim-geo` | b2clogin.com, login.microsoftonline.com, branded domain | 1 Hour | Used as a hint to determine the resource tenants home geographic location. |

## Cross-Site request forgery token

To prevent Cross Site Request Forgery (CSRF) attacks, Azure AD B2C applies the Synchronizer Token strategy mechanism. For more details on this pattern, check out the [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern) article.

Azure AD B2C generates a synchronizer token, and adds it in two places; in a cookie labeled `x-ms-cpim-csrf`, and a query string parameter named `csrf_token` in the URL of the page sent to the Azure AD B2C. As Azure AD B2C service processes the incoming requests from the browser, it confirms that both the query string and cookie versions of the token exist, and that they exactly match. Also it verifies the elements of the contents of the token to confirm against expected values for the in-progress authentication.

For example, in the sign-up or sign-in page, when a user selects the "Forgot password", or "Sign-up now" links, the browser sends a GET request to Azure AD B2C in order to load the contents of the next page. The request to load content Azure AD B2C additionally chooses to send and validate the Synchronizer Token as an extra layer of protection to ensure that the request to load the page was the result of an in-progress authentication.

The Synchronizer Token is a credential that doesn't identify a user, but rather is tied to an active unique authentication session. 
