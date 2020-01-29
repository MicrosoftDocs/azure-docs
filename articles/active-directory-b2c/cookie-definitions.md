---
title: Cookie definitions
titleSuffix: Azure AD B2C
description: Provides definitions for the cookies used in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 01/23/2020
ms.author: marsma
ms.subservice: B2C
---

# Cookies definitions for Azure AD B2C

The following sections provide information about the cookies used in Azure Active Directory B2C (Azure AD B2C).

## SameSite

The Microsoft Azure AD B2C service is compatible with SameSite browser configurations, including support for `SameSite=None` with the `Secure` attribute.

To safeguard access to sites, web browsers will introduce a new secure-by-default model that assumes all cookies should be protected from external access unless otherwise specified. The Chrome browser is the first to implement this change, starting with [Chrome 80 in February 2020](https://www.chromium.org/updates/same-site). For more information about preparing for the change in Chrome, see [Developers: Get Ready for New SameSite=None; Secure Cookie Settings](https://blog.chromium.org/2019/10/developers-get-ready-for-new.html) on the Chromium Blog.

Developers must use the new cookie setting, `SameSite=None`, to designate cookies for cross-site access. When the `SameSite=None` attribute is present, an additional `Secure` attribute must be used so cross-site cookies can only be accessed over HTTPS connections. Validate and test all your applications, including those applications that use Azure AD B2C.

For more information, see [Effect on customer websites and Microsoft services and products in Chrome version 80 or later](https://support.microsoft.com/help/4522904/potential-disruption-to-customer-websites-in-latest-chrome).

## Cookies

The following table lists the cookies used in Azure AD B2C.

| Name | Domain | Expiration | Purpose |
| ----------- | ------ | -------------------------- | --------- |
| `x-ms-cpim-admin` | main.b2cadmin.ext.azure.com | End of [browser session](session-behavior.md) | Holds user membership data across tenants. The tenants a user is a member of and level of membership (Admin or User). |
| `x-ms-cpim-slice` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used to route requests to the appropriate production instance. |
| `x-ms-cpim-trans` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for tracking the transactions  (number of authentication requests to Azure AD B2C) and the current transaction. |
| `x-ms-cpim-sso:{Id}` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for maintaining the SSO session. |
| `x-ms-cpim-cache:{id}_n` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md), successful authentication | Used for maintaining the request state. |
| `x-ms-cpim-csrf` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Cross-Site Request Forgery token used for CRSF protection. |
| `x-ms-cpim-dc` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for Azure AD B2C network routing. |
| `x-ms-cpim-ctx` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Context |
| `x-ms-cpim-rp` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for storing membership data for the resource provider tenant. |
| `x-ms-cpim-rc` | b2clogin.com, login.microsoftonline.com, branded domain | End of [browser session](session-behavior.md) | Used for storing the relay cookie. |
