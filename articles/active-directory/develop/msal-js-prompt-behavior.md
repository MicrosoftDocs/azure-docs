---
title: Interactive request prompt behavior (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Learn to customize prompt behavior in interactive calls using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/24/2019
ms.author: nacanuma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about customizing the UI prompt behaviors in MSAL.js library so I can decide if this platform meets my application development needs and requirements.
---

# Prompt behavior in MSAL.js interactive requests

When a user has established an active Azure AD session with multiple user accounts, the Azure AD sign in page will by default prompt the user to select an account before proceeding to sign in. Users will not see an account selection experience if there is only a single authenticated session with Azure AD.

The MSAL.js library (starting in v0.2.4) does not send a prompt parameter during the interactive requests (`loginRedirect`, `loginPopup`, `acquireTokenRedirect` and `acquireTokenPopup`), and thereby does not enforce any prompt behavior. For silent token requests using the `acquireTokenSilent` method, MSAL.js passes a prompt parameter set to `none`.

Based on your application scenario, you can control the prompt behavior for the interactive requests by setting the prompt parameter in the request parameters passed to the methods. For example, if you want to invoke the account selection experience:

```javascript
var request = {
    scopes: ["user.read"],
    prompt: 'select_account',
}

userAgentApplication.loginRedirect(request);
```


The following prompt values can be passed when authenticating with Azure AD:

**login:** This value will force the user to enter credentials on the authentication request.

**select_account:** This value will provide the user with an account selection experience listing all the accounts in session.

**consent:** This value will invoke the OAuth consent dialogue that allows users to grant permissions to the app.

**none:** This value will ensure that the user does not see any interactive prompt. It is recommended not to pass this value to interactive methods in MSAL.js as it can have unexpected behaviors. Instead, use the `acquireTokenSilent` method to achieve silent calls.

## Next steps

Read more about the `prompt` parameter in the [OAuth 2.0 implicit grant](v2-oauth2-implicit-grant-flow.md) protocol which MSAL.js library uses.
