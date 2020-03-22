---
title: Issues on Internet Explorer & Microsoft Edge (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Learn about know issues when using the Microsoft Authentication Library for JavaScript (MSAL.js) with Internet Explorer and Microsoft Edge browsers.
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: troubleshooting
ms.workload: identity
ms.date: 05/16/2019
ms.author: nacanuma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about issues with MSAL.js library so I can decide if this platform meets my application development needs and requirements.
---

# Known issues on Internet Explorer and Microsoft Edge browsers (MSAL.js)

## Issues due to security zones
We had multiple reports of issues with authentication in IE and Microsoft Edge (since the update of the *Microsoft Edge browser version to 40.15063.0.0*). We are tracking these and have informed the Microsoft Edge team. While Microsoft Edge works on a resolution, here is a description of the frequently occurring issues and the possible workarounds that can be implemented.

### Cause
The cause for most of these issues is as follows. The session storage and local storage are partitioned by security zones in the Microsoft Edge browser. In this particular version of Microsoft Edge, when the application is redirected across zones, the session storage and local storage are cleared. Specifically, the session storage is cleared in the regular browser navigation, and both the session and local storage are cleared in the InPrivate mode of the browser. MSAL.js saves certain state in the session storage and relies on checking this state during the authentication flows. When the session storage is cleared, this state is lost and hence results in broken experiences.

### Issues

- **Infinite redirect loops and page reloads during authentication**. When users sign in to the application on Microsoft Edge, they are redirected back from the AAD login page and are stuck in an infinite redirect loop resulting in repeated page reloads. This is usually accompanied by an `invalid_state` error in the session storage.

- **Infinite acquire token loops and AADSTS50058 error**. When an application running on Microsoft Edge tries to acquire a token for a resource, the application may get stuck in an infinite loop of the acquire token call along with the following error from AAD in your network trace:

    `Error :login_required; Error description:AADSTS50058: A silent sign-in request was sent but no user is signed in. The cookies used to represent the user's session were not sent in the request to Azure AD. This can happen if the user is using Internet Explorer or Edge, and the web app sending the silent sign-in request is in different IE security zone than the Azure AD endpoint (login.microsoftonline.com)`

- **Popup window doesn't close or is stuck when using login through Popup to authenticate**. When authenticating through popup window in Microsoft Edge or IE(InPrivate), after entering credentials and signing in, if multiple domains across security zones are involved in the navigation, the popup window doesn't close because MSAL.js loses the handle to the popup window.  

### Update: Fix available in MSAL.js 0.2.3
Fixes for the authentication redirect loop issues have been released in [MSAL.js 0.2.3](https://github.com/AzureAD/microsoft-authentication-library-for-js/releases). Enable the flag `storeAuthStateInCookie` in the MSAL.js config to take advantage of this fix. By default this flag is set to false.

When the `storeAuthStateInCookie` flag is enabled, MSAL.js will use the browser cookies to store the request state required for validation of the auth flows.

> [!NOTE]
> This fix is not yet available for the msal-angular and msal-angularjs wrappers. This fix does not address the issue with Popup windows.

Use workarounds below.

#### Other workarounds
Make sure to test that your issue is occurring only on the specific version of Microsoft Edge browser and works on the other browsers before adopting these workarounds.  
1. As a first step to get around these issues, ensure that the application domain,  , and any other sites involved in the redirects of the authentication flow are added as trusted sites in the security settings of the browser, so that they belong to the same security zone.
To do so, follow these steps:
    - Open **Internet Explorer** and click on the **settings** (gear icon) in the top-right corner
    - Select **Internet Options**
    - Select the **Security** tab
    - Under the **Trusted Sites** option, click on the **sites** button and add the URLs in the dialog box that opens.

2. As mentioned before, since only the session storage is cleared during the regular navigation, you may configure MSAL.js to use the local storage instead. This can be set as the `cacheLocation` config parameter while initializing MSAL.

Note, this will not solve the issue for InPrivate browsing since both session and local storage are cleared.

## Issues due to popup blockers

There are cases when popups are blocked in IE or Microsoft Edge, for example when a second popup occurs during multi-factor authentication. You will get an alert in the browser to allow for the popup once or always. If you choose to allow, the browser opens the popup window automatically and returns a `null` handle for it. As a result, the library does not have a handle for the window and there is no way to close the popup window. The same issue does not happen in Chrome when it prompts you to allow popups because it does not automatically open a popup window.

As a **workaround**, developers will need to allow popups in IE and Microsoft Edge before they start using their app to avoid this issue.

## Next steps
Learn more about [Using MSAL.js in Internet Explorer](msal-js-use-ie-browser.md).
