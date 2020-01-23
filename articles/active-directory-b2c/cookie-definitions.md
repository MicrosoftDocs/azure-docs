---
title: Cookie definitions - Azure Active Directory B2C | Microsoft Docs
description: Provides definitions for the cookies used in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/18/2019
ms.author: marsma
ms.subservice: B2C
---

# Cookies definitions for Azure Active Directory B2C

The following table lists the cookies used in Azure Active Directory B2C.

| Name | Domain | Expiration | Purpose |
| ----------- | ------ | -------------------------- | --------- |
| x-ms-cpim-admin | main.b2cadmin.ext.azure.com | End of [browser session](session-behavior.md) | Holds user membership data across tenants. The tenants a user is a member of and level of membership (Admin or User). |
| x-ms-cpim-slice | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used to route requests to the appropriate production instance. |
| x-ms-cpim-trans | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used for tracking the transactions  (number of authentication requests to Azure AD B2C) and the current transaction. |
| x-ms-cpim-sso:{Id} | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used for maintaining the SSO session. |
| x-ms-cpim-cache:{id}_n | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md), successful authentication | Used for maintaining the request state. |
| x-ms-cpim-csrf | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Cross-Site Request Forgery token used for CRSF protection. |
| x-ms-cpim-dc | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used for Azure AD B2C network routing. |
| x-ms-cpim-ctx | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Context |
| x-ms-cpim-rp | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used for storing membership data for the resource provider tenant. |
| x-ms-cpim-rc | login.microsoftonline.com, b2clogin.com, branded domain | End of [browser session](session-behavior.md) | Used for storing the relay cookie. |
