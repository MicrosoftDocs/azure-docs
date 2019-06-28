---
title: Single-page application (app's code configuration) - Microsoft identity platform
description: Learn how to build a single-page application (App's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single-page application - code configuration

Learn how to configure the code for your single-page application (SPA).

## MSAL libraries supporting implicit flow

Microsoft identity platform provides MSAL.js library to support the implicit flow using the industry recommended secure practices.  

The libraries supporting implicit flow are:

| MSAL library | Description |
|--------------|--------------|
| ![MSAL.js](media/sample-v2-code/logo_js.png) <br/> [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)  | Plain JavaScript library for use in any client side web app built using JavaScript or SPA frameworks such as Angular, Vue.js, React.js, etc. |
| ![MSAL Angular](media/sample-v2-code/logo_angular.png) <br/> [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) | Wrapper of the core MSAL.js library to simplify use in single page apps built with the Angular framework. This library is in preview and has [known issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues?q=is%3Aopen+is%3Aissue+label%3Aangular) with certain Angular versions and browsers. |

## Application code configuration

In MSAL library, the application registration information is passed as configuration during the library initialization.

### JavaScript

```javascript
// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri" //defaults to application start page
    }
}

// create UserAgentApplication instance
const userAgentApplication = new UserAgentApplication(config);
```
For more details on the configurable options available, see [Initializing application with MSAL.js](msal-js-initializing-client-applications.md).

### Angular

```javascript
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientId: 'your_app_id'
            })]
         })

  export class AppModule { }
```

## Next steps

> [!div class="nextstepaction"]
> [Sign-in and sign-out](scenario-spa-sign-in.md)
